"use client";

import { pusherClient } from "@/lib/pusher";
import { pusherKeyFormatter } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface GroupSidebarOptionProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}

const GroupSidebarOption: FC<GroupSidebarOptionProps> = ({ sessionId }) => {
  return (
    <Link
      href="/dashboard/create-group"
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <Users className="h-4 w-4" />
      </div>
      <p className="truncate">Create a new group</p>
    </Link>
  );
};

export default GroupSidebarOption;
