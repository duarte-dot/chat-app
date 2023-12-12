import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/helpers/redis";
import { chatHrefConstructor } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getGroupsByUserId } from "@/helpers/get-groups-by-user-id";
import RecentChatComponent from "@/components/RecentChatComponent";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);
  const groups = await getGroupsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const messages = await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(
          `${session.user.id + friend.id}`
        )}:messages`,
        -1,
        -1
      );

      const lastMessageRaw = messages[0];

      const lastMessage = lastMessageRaw ? JSON.parse(lastMessageRaw) : null;

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  const groupsWithLastMessage = await Promise.all(
    groups.map(async (group) => {
      const messages = await fetchRedis(
        "zrange",
        `group-chat:${group.id}:messages`,
        -1,
        -1
      );

      const lastMessageRaw = messages[0];

      const lastMessage = lastMessageRaw ? JSON.parse(lastMessageRaw) : null;

      return {
        ...group,
        lastMessage,
      };
    })
  );

  const filteredFriends = friendsWithLastMessage.filter(
    (friend) => friend.lastMessage !== null
  );

  const filteredGroups = groupsWithLastMessage.filter(
    (group) => group.lastMessage !== null
  );

  return (
    <>
      <div className="container py-12">
        <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
        {filteredFriends.length === 0 && filteredGroups.length === 0 ? (
          <div className="text-center text-gray-500">
            Nothing to show here...
          </div>
        ) : (
          <RecentChatComponent
            sessionId={session.user.id}
            filteredFriends={filteredFriends}
            filteredGroups={filteredGroups}
          />
        )}
      </div>
    </>
  );
};

export default page;
