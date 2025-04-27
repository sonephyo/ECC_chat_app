import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface CreateChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const CreateChat: React.FC<CreateChatProps> = ({ socket }) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  const handleCreateRoom = () => {
    if (inputValue.length == 0) {
      alert("Please put your name");
      return;
    }
    if (!socket) return;
    socket.emit("create_room", { username: inputValue });
  };

  return (
    <div>
      <p>Create Chat</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter your name..."
      />

      <Button onClick={handleCreateRoom}>Create Chat</Button>
    </div>
  );
};

export default CreateChat;
