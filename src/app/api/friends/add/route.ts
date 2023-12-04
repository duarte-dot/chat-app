import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 404 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized.", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself.", { status: 400 });
    }

    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("You have already added this person.", {
        status: 400,
      });
    }

    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("You are already friends with this person.", {
        status: 400,
      });
    }

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("Friend request sent.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("An error occurred.", { status: 500 });
  }
}
