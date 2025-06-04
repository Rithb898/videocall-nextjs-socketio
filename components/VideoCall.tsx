"use client";

import { useSocket } from "@/context/SocketContext";
import { useCallback, useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";

const VideoCall = () => {
  const { localStream, peer, ongoingCall, handleHangUp, isCallEnded } =
    useSocket();
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

  if (isCallEnded) {
    return <div>Call ended</div>;
  }

  if (!localStream && !peer) return;
  return (
    <div className='flex flex-col'>
      <div className='relative w-full bg-gray-900 aspect-video'>
        <div className='absolute inset-0 flex items-center justify-center'>
          {!localStream && !peer && (
            <div className='text-center'>
              <Video className='w-16 h-16 text-gray-500 mx-auto mb-4' />
              <h3 className='text-gray-400 text-lg font-medium'>
                Ready to start a call
              </h3>
              <p className='text-gray-500 text-sm mt-2'>
                Select a user from the list to begin
              </p>
            </div>
          )}
          {(localStream || peer?.stream) && (
            <div className='relative w-full h-full'>
              {peer && peer.stream && (
                <div className='absolute inset-0'>
                  <VideoContainer
                    stream={peer.stream}
                    isLocalStream={false}
                    isOnCall={isOnCall}
                  />
                </div>
              )}
              {localStream && (
                <div className='absolute bottom-4 right-4 w-[280px] rounded-xl overflow-hidden shadow-lg'>
                  <VideoContainer
                    stream={localStream}
                    isLocalStream={true}
                    isOnCall={isOnCall}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {localStream && (
        <div className='bg-white border-t py-6'>
          <div className='flex items-center justify-center gap-8'>
            <button
              onClick={toggleMic}
              className={`p-4 rounded-full transition-all duration-300 hover:scale-105 ${
                isMicOn
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isMicOn ? (
                <Mic className='w-6 h-6 text-white' />
              ) : (
                <MicOff className='w-6 h-6 text-white' />
              )}
            </button>
            <button
              onClick={() =>
                handleHangUp({
                  ongoingCall: ongoingCall ? ongoingCall : undefined,
                  isEmitHangup: true,
                })
              }
              className='p-4 rounded-full bg-rose-600 hover:bg-rose-700 transition-all duration-300 hover:scale-105'
            >
              <PhoneOff className='w-6 h-6 text-white' />
            </button>
            <button
              onClick={toggleCamera}
              className={`p-4 rounded-full transition-all duration-300 hover:scale-105 ${
                isCameraOn
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isCameraOn ? (
                <Video className='w-6 h-6 text-white' />
              ) : (
                <VideoOff className='w-6 h-6 text-white' />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
