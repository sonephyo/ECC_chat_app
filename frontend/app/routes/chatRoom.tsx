import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useSocket } from "~/lib/socketContext";

interface Message {
  username: string;
  content: string;
  timestamp: string;
}
const chatRoom = () => {
  const { socket } = useSocket();
  const { roomId } = useParams();
  const { username } = useSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
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

    const handleMessages = (data: { messages: Message[] }) => {
      console.log(JSON.stringify(data.messages));
      setMessages(data.messages);
    };

    socket.on("user_joined", handleUserJoined);
    socket.on("error", handleError);
    socket.on("recieve_message", handleMessages);

    const handleLeave = () => {
      socket.emit("leave_room", { username, room_code: roomId });
    };

    window.addEventListener("beforeunload", handleLeave);

    return () => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold mb-4 text-center">
            Room: {roomId}
          </CardTitle>
          <CardDescription>User Logged in as: {username}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[400px] overflow-y-auto pr-2">
            <div className="flex flex-col space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    message.username === "System"
                      ? "items-center"
                      : message.username === username
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  {message.username !== "System" && (
                    <span className="text-xs text-muted-foreground mb-1">
                      {message.username}
                    </span>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] break-words ${
                      message.username === "System"
                        ? "bg-muted text-xs text-center w-full text-muted-foreground italic"
                        : message.username === username
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 border-t">
          <div className="flex w-full items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default chatRoom;
