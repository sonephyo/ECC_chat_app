import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSocket } from "~/lib/socketContext";

interface CreateChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const CreateChat: React.FC<CreateChatProps> = ({ socket }) => {
  const { username } = useSocket();
  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  const handleCreateRoom = () => {
    if (username.length == 0) {
      alert("Please put your name");
      return;
    }
    if (!socket) return;
    socket.emit("create_room", { username: username });
  };

  return (
    <div>
      <Button onClick={handleCreateRoom}>Create Chat</Button>
    </div>
  );
};

export default CreateChat;
