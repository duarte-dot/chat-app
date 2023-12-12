import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: {
    groupId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  async function getChatMessages(groupId: string) {
    try {
      const results: string[] = await fetchRedis(
        "zrange",
        `group-chat:${groupId}:messages`,
        0,
        -1
      );

      const dbMessages = results.map(
        (message) => JSON.parse(message) as Message
      );

      const reversedDbMessages = dbMessages.reverse();

      const messages = messageArrayValidator.parse(reversedDbMessages);

      return messages;
    } catch (error) {
      notFound();
    }
  }

  const { groupId } = params;

  const initialMessages = await getChatMessages(groupId);

  const session = await getServerSession(authOptions);

  const rawGroup = (await fetchRedis("smembers", `group:${groupId}`)) as string;
  const group = JSON.parse(rawGroup) as GroupChat;

  const membersOfGroup = group.members;

  const rawMembers = await Promise.all(
    membersOfGroup.map(async (member) => {
      return (await fetchRedis("get", `user:${member}`)) as string;
    })
  );

  const members = rawMembers.map((rawMember) => JSON.parse(rawMember));

  return (
    <>
      <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <span className="text-gray-700 mr-3 font-semibold">
              {members.map((chatPartner) => chatPartner.name).join(", ")}
            </span>
          </div>
        </div>

        <Messages
          chatId={groupId}
          initialMessages={initialMessages}
          chatPartners={members}
          sessionImg={session!.user.image}
          sessionId={session!.user.id}
        />
        <ChatInput chatId={groupId} chatPartners={members} />
      </div>
    </>
  );
};

export default Page;
