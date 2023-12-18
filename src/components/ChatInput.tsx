"use client";

import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";

interface ChatInputProps {
  chatPartners: User[];
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartners, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [canSendMessage, setCanSendMessage] = useState<boolean>(true);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    if (textareaRef.current && !isInputDisabled) {
      textareaRef.current.focus();
    }
  }, [isInputDisabled]);

  const sendMessage = async () => {
    if (!input || !canSendMessage) {
      toast("Please wait before sending another message.", {
        icon: "🕒",
      });
      return;
    }
    setIsLoading(true);

    setIsInputDisabled(true);

    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      setMessageCount((prevCount) => prevCount + 1);
      
      if (textareaRef.current) {
        textareaRef.current.focus();
      }

      if (messageCount >= 2) {
        setCanSendMessage(false);
        setTimeout(() => {
          setCanSendMessage(true);
          setMessageCount(0);
        }, 3000);
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsInputDisabled(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          ref={textareaRef}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          disabled={isInputDisabled}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`...`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrin-0">
            <Button isLoading={isLoading} onClick={sendMessage} type="submit">
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
