"use client";

import { useSocket } from "@/context/SocketContext";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Phone, PhoneOff } from "lucide-react";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangUp } = useSocket();

  if (!ongoingCall?.isRinging) return null;
  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50'>
      <div className='bg-white rounded-3xl shadow-2xl p-8 w-[400px] animate-in fade-in zoom-in duration-300'>
        <div className='flex flex-col items-center'>
          <div className='relative'>
            <Avatar className='w-32 h-32 border-8 border-white shadow-2xl'>
              <AvatarImage
                src={ongoingCall.participants.caller.profile.imageUrl}
              />
            </Avatar>
            <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg'>
              <span className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                <span className='text-sm font-medium text-gray-600'>
                  Online
                </span>
              </span>
            </div>
          </div>

          <h3 className='text-2xl font-bold text-gray-800 mt-6'>
            {ongoingCall.participants.caller.profile.firstName}
          </h3>
          <div className='flex items-center gap-2 mt-2'>
            <span className='inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse' />
            <p className='text-indigo-600 font-medium'>Video Call</p>
          </div>

          <div className='flex items-center gap-6 mt-8'>
            <button
              onClick={() => handleJoinCall(ongoingCall)}
              className='w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 active:scale-95 transition-all rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-green-300/50 ring-4 ring-white'
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
              className='w-16 h-16 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 active:scale-95 transition-all rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-rose-300/50 ring-4 ring-white'
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
