import React, { useEffect, useState } from "react";
import { type Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

type ChatRoomSocketProps = {
  socketRef: React.RefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>;
  selectedRoom: number | null;
};

const ChatRoomSocket: React.FC<ChatRoomSocketProps> = ({ socketRef, selectedRoom }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const handleReceiveMessage = (data: { message: string }) => {
      console.log("Received message:", data.message);
      setMessages((prev) => [...prev, data.message]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socketRef]);

  const sendMessage = () => {
    if (socketRef.current && message.trim() !== "") {
      socketRef.current.emit("send_message", { message, selectedRoom });
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomSocket;
