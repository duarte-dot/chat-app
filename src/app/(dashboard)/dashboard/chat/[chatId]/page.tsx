import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { User } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: pageProps) => {
  const { chatId } = params;

  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const userId = session.user.id;

  const users = chatId.split("--");

  if (!users.includes(userId)) notFound();

  const chatPartnerIds = users.filter((id) => id !== userId);

  const chatPartnersRaw = await Promise.all(
    chatPartnerIds.map(async (chatPartnerId) => {
      return await fetchRedis("get", `user:${chatPartnerId}`);
    })
  );

  const chatPartners = chatPartnersRaw.map(
    (rawData) => JSON.parse(rawData) as User
  );

  const initialMessages = await getChatMessages(users.join("--"));

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-2rem)]">
      {chatPartners.map((chatPartner) => (
        <div
          key={chatPartner.id}
          className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200"
        >
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                {!chatPartner ||
                !chatPartner.image ||
                chatPartner.image === "" ||
                chatPartner.image === undefined ? (
                  <User className="h-8 w-8 sm:h-12 sm:w-12" />
                ) : (
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    src={chatPartner.image}
                    alt={`${chatPartner.name}'s profile picture`}
                    className="rounded-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 96vw, 600px"
                  />
                )}
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
        chatId={chatId}
        initialMessages={initialMessages}
        chatPartners={chatPartners}
        sessionImg={session.user.image}
        sessionId={session.user.id}
      />
      <ChatInput chatId={chatId} chatPartners={chatPartners} />
    </div>
  );
};

export default page;
