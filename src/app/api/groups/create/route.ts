import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { pusherKeyFormatter } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { string, z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, userIdsToAdd, name } = z
      .object({
        id: z.string(),
        name: z.string(),
        userIdsToAdd: z.array(string()),
      })
      .parse(body);

    const session = await getServerSession(authOptions);
    if (!session || session.user.id === "") {
      return new Response("Unauthorized. Please sign in again!", {
        status: 401,
      });
    }

    const userIdsAndName = {
      id,
      name,
      members: [session.user.id, ...userIdsToAdd],
    };

    if (userIdsAndName.members.length <= 2) {
      return new Response("A group must have at least three members.", {
        status: 422,
      });
    }

    if (!name) {
      return new Response("A group must have a name.", { status: 422 });
    }

    const existingGroup = await fetchRedis("smembers", `group:${id}`);
    if (existingGroup.length > 0) {
      return new Response("This group already exists.", { status: 400 });
    }

    await Promise.all([
      pusherServer.trigger(
        pusherKeyFormatter(`user:${session.user.id}:groups`),
        "new_group",
        userIdsAndName
      ),

      db.sadd(`user:${session.user.id}:groups`, id),
      ...userIdsToAdd.map(async (userIdToAdd) => {
        await pusherServer.trigger(
          pusherKeyFormatter(`user:${userIdToAdd}:groups`),
          "new_group",
          userIdsAndName
        );

        db.sadd(`user:${userIdToAdd}:groups`, id);
      }),

      db.sadd(`group:${id}`, JSON.stringify(userIdsAndName)),
    ]);

    return new Response("Group created successfully.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}
