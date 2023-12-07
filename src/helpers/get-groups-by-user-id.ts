import { fetchRedis } from "./redis";

export const getGroupsByUserId = async (userId: string) => {
  const groupIds = (await fetchRedis(
    "smembers",
    `user:${userId}:groups`
  )) as string[];

  const groups = await Promise.all(
    groupIds.map(async (groupId) => {
      const group = (await fetchRedis(
        "smembers",
        `group:${groupId}`
      )) as string;
      const parsedGroup = JSON.parse(group);
      return parsedGroup as GroupChat;
    })
  );

  return groups;
};
