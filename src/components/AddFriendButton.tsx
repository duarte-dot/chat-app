"use client";

import { FC, useState } from "react";
import Button from "./ui/Button";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      setShowSuccessState(true);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError("email", { message: e.message });
        return;
      }
      if (e instanceof AxiosError) {
        setError("email", { message: e.response?.data });
        return;
      }
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by email
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          placeholder="email@example.com"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">
          Friend request sent successfully!
        </p>
      )}
    </form>
  );
};

export default AddFriendButton;
