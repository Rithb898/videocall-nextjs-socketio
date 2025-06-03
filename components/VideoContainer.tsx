import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream?: boolean;
  isOnCall?: boolean;
}

const VideoContainer = ({
  stream,
  isLocalStream = false,
  isOnCall,
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      className={cn('rounded border w-[800px]', isLocalStream && isOnCall && 'w-[200px] h-auto absolute ')}
      autoPlay
      playsInline
      muted={isLocalStream}
      ref={videoRef}
    />
  );
};

export default VideoContainer;
