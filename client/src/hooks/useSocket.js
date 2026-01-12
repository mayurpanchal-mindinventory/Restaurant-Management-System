import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SOCKET_URL = "http://localhost:5000";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("join", userId);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("newMessage", (message) => {
      setNewMessage(message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const clearNewMessage = useCallback(() => {
    setNewMessage(null);
  }, []);

  return {
    socket,
    isConnected,
    newMessage,
    clearNewMessage,
  };
};

export default useSocket;
