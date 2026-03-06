import { useEffect, useRef, useCallback } from "react";
import {
  initSocket,
  getSocket,
  onAvailabilityUpdate,
  offAvailabilityUpdate,
} from "../lib/socket";

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = initSocket();

    return () => {
      // Don't close socket on unmount - it might be used by other components
    };
  }, []);

  const joinRoom = useCallback((roomId) => {
    const socket = getSocket();
    socket.emit("joinRoom", roomId);
  }, []);

  const leaveRoom = useCallback((roomId) => {
    const socket = getSocket();
    socket.emit("leaveRoom", roomId);
  }, []);

  const onAvailabilityChanged = useCallback((callback) => {
    onAvailabilityUpdate(callback);

    return () => {
      offAvailabilityUpdate(callback);
    };
  }, []);

  const getSocketInstance = useCallback(() => {
    return socketRef.current || getSocket();
  }, []);

  return {
    socket: getSocketInstance,
    joinRoom,
    leaveRoom,
    onAvailabilityChanged,
  };
};
