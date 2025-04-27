import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useSocket } from "~/lib/socketContext";

const chatRoom = () => {
  const { socket } = useSocket();
  const { roomId } = useParams();
  const { username } = useSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!socket || !roomId || !username) {
      console.log("Missing info, redirecting...");
      navigate("/chat");
      return;
    }
  }, []);

  useEffect(() => {
    if (!socket || !username || !roomId) return;
    console.log("running");
    socket.emit("join_room", { username: username, room_code: roomId });

    const handleUserJoined = (data: { username: string }) => {
      console.log(`${data.username} joined the room.`);
    };

    const handleError = (data: { message: string }) => {
      alert(data.message);
      navigate("/chat");
    };

    const handleUserLeft = (data: { username: string }) => {
      console.log(data.username + " has left the room");
    };

    const handleMessages = (data: { messages: string[] }) => {
      setMessages(data.messages);
    };

    socket.on("user_joined", handleUserJoined);
    socket.on("error", handleError);
    socket.on("user_left", handleUserLeft);
    socket.on("recieve_message", handleMessages);

    const handleLeave = () => {
      socket.emit("leave_room", { username, room_code: roomId });
    };

    window.addEventListener("beforeunload", handleLeave);

    return () => {
      socket.off("user_left", handleUserLeft);
      socket.off("joined_room", handleUserJoined);
      socket.off("error", handleError);
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!socket || !inputValue) return;
    console.log("sending Hello world");
    socket.emit("send_message", {
      username: username,
      room_code: roomId,
      message: inputValue,
    });
    setInputValue("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <h1>You are in roomID:{roomId}</h1>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="h-[400px] overflow-y-auto p-4">
          <div className="flex flex-col space-y-2">
            {messages.map((message, index) => (
              <div key={index} className="rounded-lg bg-muted p-3">
                {message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  );
};

export default chatRoom;
