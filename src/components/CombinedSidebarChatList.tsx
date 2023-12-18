"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, pusherKeyFormatter } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import Link from "next/link";

interface CombinedSidebarChatListProps {
  sessionId: string;
  friends?: User[];
  groups?: GroupChat[];
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
  senderEmail: string;
}

interface ExtendedUser extends User {
  isGroupChat: boolean;
  lastMessage?: ExtendedMessage | null;
}

interface ExtendedGroup extends GroupChat {
  isGroupChat: boolean;
  lastMessage?: ExtendedMessage | null;
}

const CombinedSidebarChatList: FC<CombinedSidebarChatListProps> = ({
  sessionId,
  friends,
  groups,
}) => {
  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;

  const handleChatClick = (chatId: string) => {
    setUnseenMessagesCount((prev) => ({
      ...prev,
      [chatId]: 0,
    }));

    if (!isLocalStorageAvailable) return;

    const storedUnseenMessagesCount = localStorage.getItem(
      "unseenMessagesCount"
    );

    if (storedUnseenMessagesCount) {
      const parsedUnseenMessagesCount = JSON.parse(storedUnseenMessagesCount);
      parsedUnseenMessagesCount[chatId] = 0;
      localStorage.setItem(
        "unseenMessagesCount",
        JSON.stringify(parsedUnseenMessagesCount)
      );
    }
  };

  const router = useRouter();
  const pathname = usePathname();
  const [activeChats, setActiveChats] = useState<User[]>(friends || []);
  const [groupChats, setGroupChats] = useState<GroupChat[]>(groups || []);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState<{
    [key: string]: number;
  }>(() => {
    if (!isLocalStorageAvailable) return {};

    const storedUnseenMessagesCount = localStorage.getItem(
      "unseenMessagesCount"
    );
    return storedUnseenMessagesCount
      ? JSON.parse(storedUnseenMessagesCount)
      : {};
  });

  const [chats, setChats] = useState<(ExtendedUser | ExtendedGroup)[]>([]);
  const [sortedChats, setSortedChats] = useState<
    (ExtendedUser | ExtendedGroup)[]
  >([]);

  useEffect(() => {
    const storedSortedChats = localStorage.getItem("sortedChats");
    if (storedSortedChats) {
      setSortedChats(JSON.parse(storedSortedChats));
    }
  }, []);

  useEffect(() => {
    setChats([
      ...activeChats.map((userChat) => ({ ...userChat, isGroupChat: false })),
      ...groupChats.map((groupChat) => ({ ...groupChat, isGroupChat: true })),
    ]);
  }, [activeChats, groupChats]);

  useEffect(() => {
    pusherClient.subscribe(pusherKeyFormatter(`user:${sessionId}:chats`));
    pusherClient.subscribe(pusherKeyFormatter(`user:${sessionId}:friends`));
    pusherClient.subscribe(pusherKeyFormatter(`user:${sessionId}:groups`));

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const newGroupHandler = (newGroup: GroupChat) => {
      setGroupChats((prev) => [...prev, newGroup]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !== `/dashboard/chat/${message.chatId}` &&
        pathname !== `/dashboard/group-chat/${message.chatId}`;

      if (!shouldNotify || message.senderId === sessionId) {
        const existingChatIndex = chats.findIndex((chat) =>
          chat.id.length > 74
            ? message.chatId === chat.id
            : message.chatId === chatHrefConstructor(chat.id + sessionId)
        );

        if (existingChatIndex !== -1) {
          setChats((prevChats) => {
            const updatedChats = [...prevChats];
            const updatedChat = {
              ...updatedChats[existingChatIndex],
              lastMessage: message,
            };
            // Move the chat to the top by removing and reinserting
            updatedChats.splice(existingChatIndex, 1);
            updatedChats.unshift(updatedChat);

            // armazena no localstorage o chat atualizado
            if (isLocalStorageAvailable) {
              localStorage.setItem(
                "sortedChats",
                JSON.stringify([...updatedChats])
              );
            }

            setSortedChats(updatedChats);

            return updatedChats;
          });
        } else {
          setChats((prevChats) => [
            {
              id: message.senderId,
              name: message.senderName,
              email: message.senderEmail,
              image: message.senderImg,
              lastMessage: message,
              isGroupChat: message.chatId.length > 74,
            },
            ...prevChats,
          ]);

          setSortedChats((prevChats) => [
            {
              id: message.senderId,
              name: message.senderName,
              email: message.senderEmail,
              image: message.senderImg,
              lastMessage: message,
              isGroupChat: message.chatId.length > 74,
            },
            ...prevChats,
          ]);
        }

        return;
      }

      setUnseenMessagesCount((prev) => {
        const chatId = message.chatId;
        const count = prev[chatId] || 0;
        return { ...prev, [chatId]: count + 1 };
      });

      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionGroup={groupChats?.find(
            (groupChat) => groupChat.id === message.chatId
          )}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));

      const existingChatIndex = chats.findIndex((chat) =>
        chat.id.length > 74
          ? message.chatId === chat.id
          : message.chatId === chatHrefConstructor(chat.id + sessionId)
      );

      if (existingChatIndex !== -1) {
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          const updatedChat = {
            ...updatedChats[existingChatIndex],
            lastMessage: message,
          };
          updatedChats.splice(existingChatIndex, 1);
          updatedChats.unshift(updatedChat);

          if (isLocalStorageAvailable) {
            localStorage.setItem(
              "sortedChats",
              JSON.stringify([...updatedChats])
            );
          }

          setSortedChats(updatedChats);

          return updatedChats;
        });
      } else {
        setChats((prevChats) => [
          {
            id: message.senderId,
            name: message.senderName,
            email: message.senderEmail,
            image: message.senderImg,
            lastMessage: message,
            isGroupChat: message.chatId.length > 74,
          },
          ...prevChats,
        ]);

        setSortedChats((prevChats) => [
          {
            id: message.senderId,
            name: message.senderName,
            email: message.senderEmail,
            image: message.senderImg,
            lastMessage: message,
            isGroupChat: message.chatId.length > 74,
          },
          ...prevChats,
        ]);
      }
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);
    pusherClient.bind("new_group", newGroupHandler);

    return () => {
      pusherClient.unsubscribe(pusherKeyFormatter(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(pusherKeyFormatter(`user:${sessionId}:friends`));
      pusherClient.unsubscribe(pusherKeyFormatter(`user:${sessionId}:groups`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
      pusherClient.unbind("new_group", newGroupHandler);
    };
  }, [pathname, sessionId, router, unseenMessagesCount, groupChats, chats]);

  useEffect(() => {
    const storedUnseenMessagesCount = localStorage.getItem(
      "unseenMessagesCount"
    );
    if (storedUnseenMessagesCount) {
      setUnseenMessagesCount(JSON.parse(storedUnseenMessagesCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "unseenMessagesCount",
      JSON.stringify(unseenMessagesCount)
    );
  }, [unseenMessagesCount]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {sortedChats.length !== 0
        ? sortedChats.map((chat) => {
            const chatId = chat.id;

            return (
              <li key={chatId}>
                <Link
                  href={`/dashboard/${
                    chat.isGroupChat ? "group-chat" : "chat"
                  }/${
                    chat.isGroupChat
                      ? chatId
                      : chatHrefConstructor(chatId + sessionId)
                  }`}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  {...(chat.isGroupChat
                    ? {
                        onClick: () => handleChatClick(chatId),
                      }
                    : {
                        onClick: () =>
                          handleChatClick(
                            chatHrefConstructor(chatId + sessionId)
                          ),
                      })}
                >
                  {chat.name}
                  {chat.isGroupChat
                    ? unseenMessagesCount[chatId] > 0 && (
                        <span className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                          {unseenMessagesCount[chatId]}
                        </span>
                      )
                    : unseenMessagesCount[
                        chatHrefConstructor(chatId + sessionId)
                      ] > 0 && (
                        <span className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                          {
                            unseenMessagesCount[
                              chatHrefConstructor(chatId + sessionId)
                            ]
                          }
                        </span>
                      )}
                </Link>
              </li>
            );
          })
        : chats.map((chat) => {
            const chatId = chat.id;

            return (
              <li key={chatId}>
                <Link
                  href={`/dashboard/${
                    chat.isGroupChat ? "group-chat" : "chat"
                  }/${
                    chat.isGroupChat
                      ? chatId
                      : chatHrefConstructor(chatId + sessionId)
                  }`}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  {...(chat.isGroupChat
                    ? {
                        onClick: () => handleChatClick(chatId),
                      }
                    : {
                        onClick: () =>
                          handleChatClick(
                            chatHrefConstructor(chatId + sessionId)
                          ),
                      })}
                >
                  {chat.name}
                  {chat.isGroupChat
                    ? unseenMessagesCount[chatId] > 0 && (
                        <span className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                          {unseenMessagesCount[chatId]}
                        </span>
                      )
                    : unseenMessagesCount[
                        chatHrefConstructor(chatId + sessionId)
                      ] > 0 && (
                        <span className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                          {
                            unseenMessagesCount[
                              chatHrefConstructor(chatId + sessionId)
                            ]
                          }
                        </span>
                      )}
                </Link>
              </li>
            );
          })}
    </ul>
  );
};

export default CombinedSidebarChatList;
