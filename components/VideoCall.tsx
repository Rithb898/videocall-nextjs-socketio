"use client";

import { useSocket } from "@/context/SocketContext";
import { useCallback, useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";

const VideoCall = () => {
  const { localStream, peer, ongoingCall } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];

      if (videoTrack) {
        setIsCameraOn(videoTrack.enabled);
      }

      if (audioTrack) {
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];

      if (!videoTrack) return;

      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];

      if (!audioTrack) return;

      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const isOnCall = localStream && peer && ongoingCall ? true : false;

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50'>
      <div className='relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-white'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
        {localStream && (
        <div className='relative rounded-2xl overflow-hidden'>
          <VideoContainer
          stream={localStream}
          isLocalStream={true}
          isOnCall={isOnCall}
          />
        </div>
        )}
        {peer && peer.stream && (
        <div className='relative rounded-2xl overflow-hidden'>
          <VideoContainer
          stream={peer.stream}
          isLocalStream={false}
          isOnCall={isOnCall}
          />
        </div>
        )}
      </div>
      </div>
      <div className='mt-8'>
      {localStream && (
        <div className='flex items-center gap-8 bg-white px-8 py-4 rounded-full shadow-xl'>
        <button
          onClick={toggleMic}
          className={`p-5 rounded-full transition-all duration-300 hover:scale-110 ${
          isMicOn
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-rose-500 hover:bg-rose-600"
          }`}
        >
          {isMicOn ? (
          <Mic className='w-7 h-7 text-white' />
          ) : (
          <MicOff className='w-7 h-7 text-white' />
          )}
        </button>
        <button className='p-5 rounded-full bg-rose-500 hover:bg-rose-600 transition-all duration-300 hover:scale-110'>
          <PhoneOff className='w-7 h-7 text-white' />
        </button>
        <button
          onClick={toggleCamera}
          className={`p-5 rounded-full transition-all duration-300 hover:scale-110 ${
          isCameraOn
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-rose-500 hover:bg-rose-600"
          }`}
        >
          {isCameraOn ? (
          <Video className='w-7 h-7 text-white' />
          ) : (
          <VideoOff className='w-7 h-7 text-white' />
          )}
        </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default VideoCall;
