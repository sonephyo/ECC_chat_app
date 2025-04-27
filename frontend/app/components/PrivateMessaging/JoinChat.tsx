import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface JoinChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const backend_url = import.meta.env.VITE_BACKEND_URL;

const JoinChat: React.FC<JoinChatProps> = ({ socket }) => {
  const [rooms, setrooms] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backend_url}/chat-groups`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setrooms(result.rooms);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p>Join Chat</p>
      <div>
        {rooms &&
          rooms.map((item, index) => (
            <div className="flex flex-row w-100 justify-between">
              <p key={index}>{item}</p>
              <Link to={`/chat/${item}`}>Join Room</Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default JoinChat;
