import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect } from "react";

interface JoinChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const JoinChat: React.FC<JoinChatProps> = ({ socket }) => {
  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  return (
    <div>
      <p>Join Chat</p>
    </div>
  );
};

export default JoinChat;
