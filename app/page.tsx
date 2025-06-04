import CallNotification from "@/components/CallNotification";
import ListOnlineUsers from "@/components/ListOnlineUsers";
import Navbar from "@/components/Navbar";
import VideoCall from "@/components/VideoCall";
import React from "react";

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      <Navbar />
      <div className='container mx-auto px-4 pt-24 pb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden'>
              <div className='p-4 bg-gradient-to-r from-indigo-600 to-purple-600'>
                <h2 className='text-lg font-semibold text-white'>
                  Online Users
                </h2>
              </div>
              <ListOnlineUsers />
            </div>
          </div>
          <div className='lg:col-span-9'>
            <div className='bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden'>
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
