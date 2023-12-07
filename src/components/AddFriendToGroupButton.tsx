"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import axios from "axios";
import { nanoid } from "nanoid";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AddFriendToGroupButtonProps {
  friends: User[];
}

const AddFriendToGroupButton: FC<AddFriendToGroupButtonProps> = ({
  friends,
}) => {
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");

  const toggleFriendSelection = (friend: User) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friend)) {
        return prevSelectedFriends.filter(
          (selectedFriend) => selectedFriend !== friend
        );
      } else {
        return [...prevSelectedFriends, friend];
      }
    });
  };

  const createGroup = async () => {
    await axios.post("/api/groups/create", {
      groupId: nanoid(),
      groupName: groupName,
      userIdsToAdd: selectedFriends.map((friend) => friend.id),
    });
  };

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Invite friends</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Group name"
          className="border border-gray-200 rounded-md p-2"
          onChange={(e) => setGroupName(e.target.value)}
        />
        {friends.map((friend: User) => (
          <div className="flex items-center gap-4" key={friend.id}>
            <input
              type="checkbox"
              checked={selectedFriends.includes(friend)}
              onChange={() => toggleFriendSelection(friend)}
            />
            <div className="relative h-8 w-8 bg-gray-50">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
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
