"use client";

import { useUser } from "@clerk/nextjs";
import { Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-50'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Video className='w-8 h-8 text-indigo-600' />
          <span className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            VideoChat
          </span>
        </div>

        {user && (
          <div className='flex items-center gap-3'>
            <span className='text-sm text-gray-700 font-medium'>
              {user.firstName}
            </span>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>
                <User className='w-4 h-4' />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
