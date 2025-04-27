import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect } from "react";
import { Button } from "../ui/button";

interface CreateChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const CreateChat: React.FC<CreateChatProps> = ({ socket }) => {
  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  const handleCreateRoom = () => {
    if (!socket) return;
    socket.emit("create_room", { username: "soney" });
  };

  return (
    <div>
      <p>Create Chat</p>

      <Button onClick={handleCreateRoom}>Create Chat</Button>
    </div>
  );
};

export default CreateChat;
