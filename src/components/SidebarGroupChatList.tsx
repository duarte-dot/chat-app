"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, pusherKeyFormatter } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import { getGroupsByUserId } from "@/helpers/get-groups-by-user-id";

interface SidebarGroupChatListProps {
  groupChats?: GroupChat[];
  sessionId: string;
}

const SidebarGroupChatList: FC<SidebarGroupChatListProps> = ({
  groupChats,
  sessionId,
}) => {
  //   console.log(groupChats);
  //   console.log(sessionId);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {groupChats?.map((groupChat) => {
        return (
          <li key={groupChat.groupId}>
            <a
              href={`/dashboard/group-chat/${groupChat.groupId}`}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {groupChat.groupName}
              <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center"></div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarGroupChatList;