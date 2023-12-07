import AddfriendToGroupButton from "@/components/AddFriendToGroupButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Create a group</h1>
      <AddfriendToGroupButton friends={friends} />
    </main>
  );
};

export default page;
