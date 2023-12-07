import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { pusherKeyFormatter } from "@/lib/utils";
import { Message, messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { usePathname } from "next/navigation";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const userId = session.user.id;
    const userIds = chatId.split("--");

    if (!userIds.includes(userId) && chatId.length === 74) {
      console.log(chatId);
      return new Response("Unauthorized", { status: 401 });
    }

    const friendList = (await fetchRedis(
      "smembers",
      `user:${userId}:friends`
    )) as string[];

    const areFriends = userIds.every(
      (id) => friendList.includes(id) || id === userId
    );

    if (!areFriends && chatId.length === 74) {
      return new Response("Unauthorized", { status: 401 });
    }

    const rawSender = (await fetchRedis("get", `user:${userId}`)) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: userId,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    // Determine the Redis key prefix based on the number of users
    const redisKeyPrefix = userIds.length > 2 ? "group-chat" : "chat";

    // Broadcast a message to the chat channel
    await pusherServer.trigger(
      pusherKeyFormatter(`${redisKeyPrefix}:${chatId}`),
      "incoming-message",
      message
    );

    // Broadcast a new message event to each user in the group
    userIds.forEach(async (friendId) => {
      await pusherServer.trigger(
        pusherKeyFormatter(`user:${friendId}:chats`),
        "new_message",
        {
          ...message,
          senderImg: sender.image,
          senderName: sender.name,
        }
      );
    });

    // Add the message to the Redis sorted set
    await db.zadd(`${redisKeyPrefix}:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
