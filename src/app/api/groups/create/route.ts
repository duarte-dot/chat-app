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

    const { groupId, userIdsToAdd, groupName } = z
      .object({
        groupId: z.string(),
        groupName: z.string(),
        userIdsToAdd: z.array(string()),
      })
      .parse(body);

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    db.sadd(`user:${session.user.id}:groups`, groupId);
    userIdsToAdd.forEach(async (userIdToAdd) => {
      await db.sadd(`user:${userIdToAdd}:groups`, groupId);
    });

    const userIdsToAddAndGroupName = {
      groupId: groupId,
      groupName: groupName,
      members: userIdsToAdd,
    };

    db.sadd(`group:${groupId}`, userIdsToAddAndGroupName);

    return new Response("User added to the group successfully.", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}
