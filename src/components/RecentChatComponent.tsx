"use client";

import { fetchRedis } from "@/helpers/redis";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface ExtendedUser extends User {
  lastMessage: Message | null;
}

interface ExtendedGroup extends GroupChat {
  lastMessage: Message | null;
  image?: string;
  groupName?: string;
}

interface RecentChatComponentProps {
  filteredFriends?: ExtendedUser[];
  filteredGroups?: ExtendedGroup[];
  sessionId: string;
}

const RecentChatComponent: FC<RecentChatComponentProps> = ({
  filteredFriends: initialFilteredFriends,
  filteredGroups: initialFilteredGroups,
  sessionId,
}) => {
  const [filteredFriends, setFilteredFriends] = useState(
    initialFilteredFriends || []
  );
  const [filteredGroups, setFilteredGroups] = useState(
    initialFilteredGroups || []
  );
  const pathname = usePathname();
  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;

  const handleChatClick = (chatId: string) => {
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

  useEffect(() => {
    pusherClient.bind("new_message", async function (data: any) {
      if (data.chatId.length <= 74) {
        const existingFriendIndex = filteredFriends.findIndex(
          (friend) => friend.id === data.senderId
        );

        if (existingFriendIndex !== -1) {
          setFilteredFriends((prevFriends: ExtendedUser[]) => {
            const updatedFriends = [...prevFriends];
            updatedFriends[existingFriendIndex] = {
              ...updatedFriends[existingFriendIndex],
              lastMessage: data,
            };
            return updatedFriends;
          });
        } else {
          setFilteredFriends((prevFriends: ExtendedUser[]) => [
            ...prevFriends,
            {
              id: data.senderId,
              name: data.senderName,
              email: data.senderEmail,
              image: data.senderImg,
              lastMessage: data,
            },
          ]);
        }
      } else {
        const existingGroupIndex = filteredGroups.findIndex(
          (group) => group.id === data.chatId
        );

        if (existingGroupIndex !== -1) {
          setFilteredGroups((prevGroups: ExtendedGroup[]) => {
            const updatedGroups = [...prevGroups];
            updatedGroups[existingGroupIndex] = {
              ...updatedGroups[existingGroupIndex],
              lastMessage: data,
            };
            return updatedGroups;
          });
        } else {
          setFilteredGroups((prevGroups: ExtendedGroup[]) => [
            ...prevGroups,
            {
              id: data.chatId,
              name: data.senderName,
              groupName: data.groupName,
              members: data.chatMembers,
              lastMessage: data,
              image: data.chatImg,
            },
          ]);
        }
      }
    });

    return () => {
      pusherClient.unbind("new_message");
    };
  }, [filteredFriends, filteredGroups, sessionId, pathname]);

  return (
    <>
      {filteredFriends?.map((friend) => (
        <div
          key={friend?.id}
          className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md mb-4 cursor-pointer hover:bg-zinc-100 transition-colors min-h-[80px]"
        >
          <div className="absolute right-4 inset-y-0 flex items-center">
            <ChevronRight className="h-7 w-7 text-zinc-400" />
          </div>

          <a
            onClick={() =>
              handleChatClick(chatHrefConstructor(sessionId + friend?.id) || "")
            }
            href={`/dashboard/chat/${chatHrefConstructor(
              `${sessionId + friend?.id}`
            )}`}
            className="relative sm:flex"
          >
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
              <div className="relative h-6 w-6">
                {friend?.image === "" ? (
                  <Users className="h-6 w-6" />
                ) : (
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend?.name}'s picture`}
                    src={friend?.image || ""}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 96vw, 600px"
                    fill
                  />
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold">{friend?.name}</h4>
              <p className="mt-1 max-w-md">
                <span className="text-zinc-400">
                  {friend?.lastMessage &&
                  friend.lastMessage.senderId === sessionId
                    ? "You: "
                    : ""}
                </span>
                {friend?.lastMessage ? friend.lastMessage.text : ""}
              </p>
            </div>
          </a>
        </div>
      ))}
      {filteredGroups?.map((group) => (
        <div
          key={group?.id}
          className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md mb-4 cursor-pointer hover:bg-zinc-100 transition-colors min-h-[80px]"
        >
          <div className="absolute right-4 inset-y-0 flex items-center">
            <ChevronRight className="h-7 w-7 text-zinc-400" />
          </div>

          <a
            onClick={() => handleChatClick(group?.id || "")}
            href={`/dashboard/group-chat/${group?.id}`}
            className="relative sm:flex"
          >
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
              <div className="relative h-6 w-6">
                {group?.image === undefined ? (
                  <Users className="h-6 w-6" />
                ) : (
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${group?.name}'s picture`}
                    src={group?.image || ""}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 96vw, 600px"
                    fill
                  />
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold">
                {group?.groupName ? group.groupName : group.name}
              </h4>
              <p className="mt-1 max-w-md">
                <span className="text-zinc-400">
                  {group?.lastMessage &&
                  group.lastMessage.senderId === sessionId
                    ? "You: "
                    : `${group.lastMessage?.senderName}: `}
                </span>
                {group?.lastMessage ? group.lastMessage.text : ""}
              </p>
            </div>
          </a>
        </div>
      ))}
    </>
  );
};

export default RecentChatComponent;
