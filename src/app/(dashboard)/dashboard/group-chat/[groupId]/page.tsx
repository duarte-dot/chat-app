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
  async function getChatMessages(chatId: string) {
    try {
      const results: string[] = await fetchRedis(
        "zrange",
        `chat:${chatId}:messages`,
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

  const rawGroup = await fetchRedis("smembers", `group:${groupId}`);
  const group = JSON.parse(rawGroup) as GroupChat;

  const membersOfGroup = group.members;

  const rawMembers = await Promise.all(
    membersOfGroup.map(async (member) => {
      return await fetchRedis("get", `user:${member}`);
    })
  );

  const members = rawMembers.map((rawMember) => JSON.parse(rawMember));

  return (
    <>
      <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
        {members.map((chatPartner) => (
          <div
            key={chatPartner.id}
            className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200"
          >
            <div className="relative flex items-center space-x-4">
              <div className="relative">
                <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    src={chatPartner.image}
                    alt={`${chatPartner.name}'s profile picture`}
                    className="rounded-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 96vw, 600px"
                  />
                </div>
              </div>

              <div className="flex flex-col leading-tight">
                <div className="text-x1 flex items-center">
                  <span className="text-gray-700 mr-3 font-semibold">
                    {chatPartner.name}
                  </span>
                </div>

                <span className="text-sm text-gray-600">{chatPartner.email}</span>
              </div>
            </div>
          </div>
        ))}

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
