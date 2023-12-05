import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { pusherKeyFormatter } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response("You are already friends with this person.", {
        status: 400,
      });
    }

    const hasFriendRequest = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1;

    if (!hasFriendRequest) {
      return new Response(
        "You have not received a friend request from this person.",
        {
          status: 400,
        }
      );
    }

    const [rarUser, rawFriend] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idToAdd}`),
    ])) as [string, string];

    const user = JSON.parse(rarUser) as User;
    const friend = JSON.parse(rawFriend) as User;

    await Promise.all([
      pusherServer.trigger(
        pusherKeyFormatter(`user:${idToAdd}:friends`),
        "new_friend",
        user
      ),
      pusherServer.trigger(
        pusherKeyFormatter(`user:${session.user.id}:friends`),
        "new_friend",
        friend
      ),
    ]);

    await db.sadd(`user:${session.user.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);
    // await db.srem(`user:${idToAdd}:outgoing_friend_requests`, session.user.id);

    return new Response("Friend request accepted.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}
