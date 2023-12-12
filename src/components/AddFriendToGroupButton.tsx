"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import axios, { AxiosError } from "axios";
import { chatHrefConstructor } from "@/lib/utils";
import toast from "react-hot-toast";
import { z } from "zod";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AddFriendToGroupButtonProps {
  friends: User[];
  sessionId: string;
}

const AddFriendToGroupButton: FC<AddFriendToGroupButtonProps> = ({
  friends,
  sessionId,
}) => {
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
  const [name, setName] = useState("");

  const toggleFriendSelection = (friend: User) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends((prevSelectedFriends) =>
        prevSelectedFriends.filter(
          (selectedFriend) => selectedFriend !== friend
        )
      );
    } else {
      setSelectedFriends((prevSelectedFriends) => [
        ...prevSelectedFriends,
        friend,
      ]);
    }
  };

  const userIds = [sessionId, ...selectedFriends.map((friend) => friend.id)];
  const userIdsString = userIds.join("");

  const createGroup = async () => {
    try {
      await axios.post("/api/groups/create", {
        id: chatHrefConstructor(userIdsString),
        name: name,
        userIdsToAdd: selectedFriends.map((friend) => friend.id),
      });

      setSelectedFriends([]);
      setName("");
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data);

        setSelectedFriends([]);
        setName("");

        return;
      }
    }
  };

  return (
    <main className="pt-8">
      <h1 className="font-bold text-3xl mb-8">Invite friends</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Group name"
          className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:border-transparent"
          onChange={(e) => setName(e.target.value)}
        />
        {friends.map((friend: User) => (
          <div
            className={`flex items-center gap-4 ${
              selectedFriends.includes(friend)
                ? "bg-purple-900 text-white rounded-md p-2 cursor-pointer"
                : "cursor-pointer hover:bg-gray-200 transition-colors rounded-md p-2"
            }`}
            key={friend.id}
            onClick={() => toggleFriendSelection(friend)}
          >
            <div className="relative h-8 w-8 bg-gray-50">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={friend.image || ""}
                alt="Your profile picture"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 96vw, 600px"
              />
            </div>
            <div className="flex flex-col">
              <span aria-hidden="true">{friend.name}</span>
              <span className="text-xs text-zinc-400" aria-hidden="true">
                {friend.email}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-8">
        <Button onClick={() => createGroup()}>Create group</Button>
      </div>
    </main>
  );
};

export default AddFriendToGroupButton;
