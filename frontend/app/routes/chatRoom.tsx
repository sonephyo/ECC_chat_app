import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion"
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
  const location = useLocation();
  const roomRef = useRef(roomId);

  useEffect(() => {
    if (!socket || !roomId || !username) {
      console.log("Missing info, redirecting...");
      navigate("/chat");
      return;
    }
    roomRef.current = roomId;
  }, []);

  useEffect(() => {
    if (!socket || !username || !roomId) return;
    socket.emit("join_room", { username: username, room_code: roomId });

    const handleUserJoined = (data: { username: string }) => {
      console.log(`${data.username} joined the room.`);
    };

    const handleError = (data: { message: string }) => {
      alert(data.message);
      navigate("/chat");
    };

    const handleMessages = (data: { messages: Message[] }) => {
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

      const newPath = window.location.pathname;
      const isNavigatingAway = !newPath.includes(roomRef.current as string);

      if (isNavigatingAway) {
        handleLeave();
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!socket || !inputValue) return;
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full bg-zinc-900 border-zinc-800 shadow-lg overflow-hidden">
          <CardHeader className="bg-zinc-950 border-b border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <Link to="/chat">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-zinc-800 -ml-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-emerald-400 mr-1" />
                <span className="text-xs text-emerald-400">Encrypted</span>
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
              {roomId && roomId.length > 10
                ? `${roomId.substring(0, 10)}...`
                : roomId}
            </CardTitle>
            <CardDescription className="text-center text-gray-400 mt-1">
              Logged in as{" "}
              <span className="text-emerald-400 font-medium">{username}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 bg-zinc-900">
            <div className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
              <AnimatePresence initial={false}>
                <div className="flex flex-col space-y-3 py-2">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${
                        message.username === "System"
                          ? "items-center"
                          : message.username === username
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      {message.username !== "System" && (
                        <span className="text-xs text-gray-500 mb-1 px-2">
                          {message.username === username
                            ? "You"
                            : message.username}
                        </span>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[80%] break-words ${
                          message.username === "System"
                            ? "bg-zinc-800/50 text-xs text-center w-full text-gray-400 italic"
                            : message.username === username
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-800 text-gray-200"
                        }`}
                      >
                        {message.content}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-2">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </AnimatePresence>
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t border-zinc-800 bg-zinc-950">
            <div className="flex w-full items-center space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-emerald-600"
              />
              <Button
                type="submit"
                size="icon"
                onClick={handleSendMessage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default chatRoom;
