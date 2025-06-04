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
      {" "}
      {onlineUsers?.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
          <User className='w-12 h-12 text-gray-300 mb-2' />
          <p className='text-gray-500'>No users online at the moment</p>
        </div>
      ) : (
        onlineUsers?.map((onlineUser) => {
          if (onlineUser.userId === user?.id) return null;

          return (
            <div
              key={onlineUser.userId}
              onClick={() => handleCall(onlineUser)}
              className='flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b last:border-b-0'
            >
              <div className='relative'>
                <Avatar className='h-12 w-12 ring-2 ring-white shadow-sm'>
                  <AvatarImage src={onlineUser.profile.imageUrl} />
                  <AvatarFallback>
                    <User className='w-6 h-6' />
                  </AvatarFallback>
                </Avatar>
                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white' />
              </div>
              <div className='flex flex-col'>
                <span className='font-semibold text-gray-900'>
                  {onlineUser.profile.firstName}
                </span>
                <span className='text-sm text-green-600 font-medium'>
                  Available for call
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ListOnlineUsers;
