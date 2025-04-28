import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

interface SocketContextType {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  username: "",
  setUsername: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const [username, setUsername] = useState<string>(""); 

  useEffect(() => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const newSocket = io(backend_url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, username, setUsername }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
