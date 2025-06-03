"use client";

import { useSocket } from "@/context/SocketContext";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Phone, PhoneOff } from "lucide-react";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangUp } = useSocket();

  if (!ongoingCall?.isRinging) return null;
  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50'>
      <div className='bg-white/90 rounded-2xl shadow-2xl p-5 min-w-[350px] animate-in fade-in zoom-in duration-300'>
        <div className='flex flex-col items-center space-y-2'>
          <Avatar className='w-24 h-24 border-4 border-white shadow-xl ring-2 ring-gray-200'>
            <AvatarImage
              src={ongoingCall.participants.caller.profile.imageUrl}
            />
          </Avatar>
          <h3 className='text-2xl font-bold text-gray-800'>
            {ongoingCall.participants.caller.profile.firstName}
          </h3>
          <p className='text-gray-600 font-medium text-lg animate-pulse'>
            Incoming Call...
          </p>

          <div className='flex items-center gap-10 mt-6'>
            <button
              onClick={() => handleJoinCall(ongoingCall)}
              className='w-16 h-16 bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-green-300/50'
            >
              <Phone className='w-7 h-7' />
            </button>
            <button
              onClick={() =>
                handleHangUp({
                  ongoingCall: ongoingCall ? ongoingCall : undefined,
                  isEmitHangup: true,
                })
              }
              className='w-16 h-16 bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-rose-300/50'
            >
              <PhoneOff className='w-7 h-7' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
