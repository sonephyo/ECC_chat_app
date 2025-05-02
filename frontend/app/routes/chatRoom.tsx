import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
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
import { ChatCrypto } from "~/services/encryption";

interface Message {
  username: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
}

type PublicKeyMap = {
  [username: string]: {
    x: string;
    y: string;
  };
};

const chatRoom = () => {
  const { socket } = useSocket();
  const { roomId } = useParams();
  const { username } = useSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const roomRef = useRef(roomId);
  // Use State for ECCDHKE
  const [chatCryptoInstance, setchatCryptoInstance] =
    useState<ChatCrypto | null>(null);
  const [otherUserPublicKey, setotherUserPublicKey] = useState<{
    x: string;
    y: string;
  } | null>(null);
  const [sharedSecret, setsharedSecret] = useState<bigint | undefined>(
    undefined
  );

  // If the socket is missing, user will be redirected back and will not be able to join the room
  useEffect(() => {
    if (!socket || !roomId || !username) {
      console.log("Missing info, redirecting...");
      navigate("/chat");
      return;
    }
    roomRef.current = roomId;
    const chatCrypto = new ChatCrypto();
    chatCrypto.initialize();
    setchatCryptoInstance(chatCrypto);
  }, []);

  // This will happen as soon as the user get in and expected to happen only one time cuz socket can only change state one time
  useEffect(() => {
    if (!socket || !username || !roomId || !chatCryptoInstance) return;
    // Tell the backend to make the user join the room
    socket.emit("join_room", { username: username, room_code: roomId });

    // Setting up private/public keys for after joining
    const handleUserJoined = (data: { username: string }) => {
      console.log(`${data.username} joined the room.`);
      if (!otherUserPublicKey) {
        console.log("sending send_public_key");
        socket.emit("send_public_key", {
          ...chatCryptoInstance.getPublicKeyPayLoad(),
          username: username,
          room_code: roomId,
        });
      }
    };

    const handleError = (data: { message: string }) => {
      alert(data.message);
      navigate("/chat");
    };

    const handleMessages = async (data: { messages: Message[] }) => {
      for (const message of data.messages) {
        if (message.encrypted) {
          message.content = await chatCryptoInstance.decrypt(message.content);
        }
      }
      setMessages(data.messages);
    };

    const handleReadyForComm = (data: PublicKeyMap) => {
      console.log("Handling Ready for comm", data);
      for (const key in data) {
        if (key != username) {
          setotherUserPublicKey(data[key]);
          chatCryptoInstance.establishSession(data[key]);
          const sharedSecret = chatCryptoInstance.getSharedSecret();
          setsharedSecret(sharedSecret);
          break;
        }
      }
    };

    const handleOtherUserLeft = (data: { username: string }) => {
      const navWithUserLeft =
        "/chat" + `?toast=${data.username} left the room. Chat session will be closed`;
      navigate(navWithUserLeft);
    };

    socket.on("user_joined", handleUserJoined);
    socket.on("error", handleError);
    socket.on("recieve_message", handleMessages);
    socket.on("ready_for_comm", handleReadyForComm);
    socket.on("other_user_left", handleOtherUserLeft);

    const handleLeave = () => {
      socket.emit("leave_room", { username, room_code: roomId });
    };

    window.addEventListener("beforeunload", handleLeave);

    return () => {
      socket.off("joined_room", handleUserJoined);
      socket.off("error", handleError);
      socket.off("ready_for_comm", handleReadyForComm);
      window.removeEventListener("beforeunload", handleLeave);
      setchatCryptoInstance(null);

      const newPath = window.location.pathname;
      const isNavigatingAway = !newPath.includes(roomRef.current as string);

      if (isNavigatingAway) {
        handleLeave();
      }
    };
  }, [socket, chatCryptoInstance]);

  useEffect(() => {
    console.log(sharedSecret);
  }, [sharedSecret]);

  const handleSendMessage = async () => {
    if (!socket || !inputValue || !sharedSecret || !chatCryptoInstance) return;
    const encryptedMessage = await chatCryptoInstance.encrypt(inputValue);
    console.log(encryptedMessage);
    socket.emit("send_message", {
      username: username,
      room_code: roomId,
      message: encryptedMessage,
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

  // Helper function
  const truncate = (str: string, length = 10) => {
    if (!str) return "";
    return str.length > length ? `${str.substring(0, length)}...` : str;
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

            {/* Encryption Info Panel */}
            <div className="mt-4 bg-zinc-800/50 rounded-md p-3 text-xs">
              <div className="text-center mb-2">
                <span className="text-emerald-400 font-semibold">
                  ECC Diffie-Hellman Key Exchange
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* My Public Key */}
                <div className="bg-zinc-800 p-2 rounded-md">
                  <div className="text-xs text-emerald-400 font-medium mb-1">
                    My Public Key
                  </div>
                  {chatCryptoInstance?.getPublicKeyPayLoad() ? (
                    <>
                      <div className="flex items-center text-[10px]">
                        <span className="text-gray-400 mr-1">X:</span>
                        <span className="text-gray-300 font-mono overflow-hidden text-ellipsis">
                          {truncate(
                            chatCryptoInstance.getPublicKeyPayLoad().x,
                            15
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-[10px]">
                        <span className="text-gray-400 mr-1">Y:</span>
                        <span className="text-gray-300 font-mono overflow-hidden text-ellipsis">
                          {truncate(
                            chatCryptoInstance.getPublicKeyPayLoad().y,
                            15
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500 italic text-[10px]">
                      Initializing...
                    </span>
                  )}
                </div>

                {/* Other User's Public Key */}
                <div className="bg-zinc-800 p-2 rounded-md">
                  <div className="text-xs text-emerald-400 font-medium mb-1">
                    Other's Public Key
                  </div>
                  {otherUserPublicKey ? (
                    <>
                      <div className="flex items-center text-[10px]">
                        <span className="text-gray-400 mr-1">X:</span>
                        <span className="text-gray-300 font-mono overflow-hidden text-ellipsis">
                          {truncate(otherUserPublicKey.x, 15)}
                        </span>
                      </div>
                      <div className="flex items-center text-[10px]">
                        <span className="text-gray-400 mr-1">Y:</span>
                        <span className="text-gray-300 font-mono overflow-hidden text-ellipsis">
                          {truncate(otherUserPublicKey.y, 15)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500 italic text-[10px]">
                      Waiting for key...
                    </span>
                  )}
                </div>
              </div>

              {/* Shared Secret */}
              <div className="mt-2 bg-zinc-800 p-2 rounded-md">
                <div className="text-xs text-emerald-400 font-medium mb-1">
                  Shared Secret
                </div>
                {sharedSecret ? (
                  <div className="text-[10px] font-mono text-gray-300 overflow-hidden text-ellipsis">
                    {truncate(sharedSecret.toString(), 30)}
                  </div>
                ) : (
                  <span className="text-gray-500 italic text-[10px]">
                    Waiting for key exchange...
                  </span>
                )}
              </div>

              {/* Encryption Status */}
              <div className="mt-2 flex items-center justify-center">
                <span className="text-[10px] text-gray-300">
                  {sharedSecret
                    ? "End-to-end encryption established"
                    : "Setting up encryption..."}
                </span>
              </div>
            </div>
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
                placeholder={
                  sharedSecret
                    ? "Type your message..."
                    : "Waiting for encryption to be established..."
                }
                className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-emerald-600"
                disabled={!sharedSecret}
              />
              <Button
                type="submit"
                size="icon"
                onClick={handleSendMessage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!inputValue.trim() || !sharedSecret}
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
