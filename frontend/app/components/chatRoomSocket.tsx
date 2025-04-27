import React, { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

interface ChatRoomSocketProps {
  socketRef: React.RefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>;
  selectedRoom: number | null;
}

const ChatRoomSocket: React.FC<ChatRoomSocketProps> = ({ socketRef, selectedRoom }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleReceiveMessage = (data: { message: string }) => {
      console.log("Received message:", data.message);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socketRef]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const socket = socketRef.current;
    if (!socket || !inputMessage.trim() || selectedRoom === null) return;

    socket.emit("send_message", { message: inputMessage, room: selectedRoom });
    setInputMessage("");
  };

  return (
    <div>
      <div>
        <h3>Messages</h3>
        <div>
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoomSocket;
