import { z } from "zod";

export const messageValidator = z.object({
  id: z.string(),
  chatId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
