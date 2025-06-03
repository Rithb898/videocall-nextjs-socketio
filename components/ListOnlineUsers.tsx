"use client";

import { useSocket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";

const ListOnlineUsers = () => {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();

  return (
    <div className='p-4 space-y-4'>
      {onlineUsers &&
        onlineUsers.map((onlineUser) => {
          if (onlineUser.userId === user?.id) return null;

          return (
            <div
              key={onlineUser.userId}
              onClick={() => handleCall(onlineUser)}
              className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer'
            >
              <Avatar className='h-10 w-10 border-2 border-green-500'>
                <AvatarImage src={onlineUser.profile.imageUrl} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-semibold text-lg text-gray-900'>
                  {onlineUser.profile.firstName}
                </span>
                <span className='text-sm text-green-600'>Online</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ListOnlineUsers;
