import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { pusherKeyFormatter } from "@/lib/utils";
import { Message, messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

async function getGroupName(chatId: string): Promise<string | undefined> {
  if (chatId.includes("--")) {
    const group = (await fetchRedis("smembers", `group:${chatId}`)) as string;

    const groupParsed = JSON.parse(group) as GroupChat;
    return groupParsed.name;
  }
}

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session || session.user.id === "") {
      return new Response("Unauthorized. Please sign in again!", {
        status: 401,
      });
    }

    const userId = session.user.id;
    const userIds = chatId.split("--");

    if (!userIds.includes(userId)) {
      return new Response("Unauthorized. Please sign in again!", {
        status: 401,
      });
    }

    const friendList = (await fetchRedis(
      "smembers",
      `user:${userId}:friends`
    )) as string[];

    const areFriends = userIds.every(
      (id) => friendList.includes(id) || id === userId
    );
    if (!areFriends && userIds.length === 2) {
      return new Response("Unauthorized. Please sign in again!", {
        status: 401,
      });
    }

    const rawSender = (await fetchRedis("get", `user:${userId}`)) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      chatId: chatId,
      senderName: sender.name,
      senderId: userId,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    const redisKeyPrefix = userIds.length > 2 ? "group-chat" : "chat";

    let grpName: string | undefined = undefined;

    if (userIds.length > 2) {
      grpName = await getGroupName(chatId);
    }

    await Promise.all([
      pusherServer.trigger(
        pusherKeyFormatter(`${redisKeyPrefix}:${chatId}`),
        "incoming-message",
        message
      ),

      ...userIds.map(async (friendId) => {
        await pusherServer.trigger(
          pusherKeyFormatter(`user:${friendId}:chats`),
          "new_message",
          {
            ...message,
            senderImg: sender.image,
            groupName: userIds.length > 2 ? grpName : sender.name,
            name: sender.name,
            senderId: sender.id,
            senderName: sender.name,
            senderEmail: sender.email,
          }
        );
      }),
      db.zadd(`${redisKeyPrefix}:${chatId}:messages`, {
        score: timestamp,
        member: JSON.stringify(message),
      }),
    ]);

    return new Response("OK");
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
