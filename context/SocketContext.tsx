"use client";
import { OngoingCall, Participants, PeerData, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

interface iSocketContext {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  peer: PeerData | null;
  handleCall: (user: SocketUser) => void;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>();
  const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<PeerData | null>(null);

  const currentSocketUser = onlineUsers?.find(
    (onlineUser) => onlineUser.userId === user?.id
  );

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) return localStream;

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
          audio: true,
        });
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  const handleCall = useCallback(
    async (user: SocketUser) => {
      if (!socket || !currentSocketUser) return;

      const stream = await getMediaStream();

      if (!stream) return;

      const participant = { caller: currentSocketUser, receiver: user };
      setOngoingCall({
        participants: participant,
        isRinging: false,
      });
      socket.emit("call", participant);
    },
    [socket, currentSocketUser, ongoingCall]
  );

  const onIncomingCall = useCallback(
    (participants: Participants) => {
      setOngoingCall({
        participants,
        isRinging: true,
      });
    },
    [socket, ongoingCall, user]
  );

  const handleHangUp = useCallback(
    (data: { ongoingCall?: OngoingCall | null; isEmitHangup?: boolean }) => {
      
    },
    []
  );

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];

      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: {
          iceServers,
        },
      });

      peer.on("stream", (stream) => {
        setPeer((prevPeer) => {
          if (prevPeer) {
            return {
              ...prevPeer,
              stream,
            };
          }
          return prevPeer;
        });
      });

      peer.on("error", console.error);
      peer.on("close", () => {
        handleHangUp();
      });

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;

      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          console.log("Peer disconnected");
          handleHangUp();
        }
      };

      return peer;
    },
    [ongoingCall, setPeer]
  );

  const completePeerConnection = useCallback(
    async (connectionData: {
      sdp: SignalData;
      isCaller: boolean;
      ongoingCall: OngoingCall;
    }) => {
      if (!localStream) {
        console.error("Local stream not available for completing connection");
        return;
      }

      if (peer) {
        peer.peerConnection?.signal(connectionData.sdp);
        return;
      }

      const newPeer = createPeer(localStream, true);

      setPeer({
        peerConnection: newPeer,
        stream: undefined,
        participantUser: connectionData.ongoingCall.participants.receiver,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          //emit offer
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: true,
          });
        }
      });
    },
    [localStream, peer, createPeer, ongoingCall]
  );

  const handleJoinCall = useCallback(
    async (ongoingCall: OngoingCall) => {
      // join the call
      if (!socket || !currentSocketUser) return;
      setOngoingCall((prev) => {
        if (prev) {
          return {
            ...prev,
            isRinging: false,
          };
        }
        return prev;
      });

      const stream = await getMediaStream();
      if (!stream) {
        console.error("Could not get media stream for joining call");
        return;
      }

      const newPeer = createPeer(stream, true);

      setPeer({
        peerConnection: newPeer,
        stream: undefined,
        participantUser: ongoingCall.participants.caller,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          //emit offer
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: false,
          });
        }
      });
    },
    [socket, currentSocketUser]
  );

  // initialize socket
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  // get online users
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.emit("addNewUser", user);
    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isSocketConnected, user]);

  // handle incoming call
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.on("incomingCall", onIncomingCall);
    socket.on("webrtcSignal", completePeerConnection);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
    };
  }, [socket, isSocketConnected, user, onIncomingCall, completePeerConnection]);

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        ongoingCall,
        localStream,
        peer,
        handleCall,
        handleJoinCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};
