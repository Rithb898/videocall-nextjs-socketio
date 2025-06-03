import CallNotification from "@/components/CallNotification";
import ListOnlineUsers from "@/components/ListOnlineUsers";
import VideoCall from "@/components/VideoCall";
import React from "react";

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>
          Video Chat App
        </h1>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-lg shadow p-4'>
              <ListOnlineUsers />
            </div>
          </div>
          <div className='lg:col-span-9'>
            <div className='bg-white rounded-lg shadow p-4 mb-6'>
              <VideoCall />
            </div>
            <CallNotification />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
