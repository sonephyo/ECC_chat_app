import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CreateChat from "~/components/PrivateMessaging/CreateChat";
import JoinChat from "~/components/PrivateMessaging/JoinChat";
import { useNavigate } from "react-router";
import { useSocket } from "~/lib/socketContext";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Lock, Users } from 'lucide-react';

const Chat = () => {
  const [display, setDisplay] = useState<string>("create-room");
  const { socket, setUsername, username } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = (data: { room_code: string }) => {
      navigate(`/chat/${data.room_code}`);
    };

    socket.on("room_created", handleRoomCreated);

    return () => {
      socket.off("room_created", handleRoomCreated);
    };
  }, [socket, navigate]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div 
      className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="mb-8 text-center"
          variants={fadeIn}
        >
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
            ECC Chat
          </h1>
          <p className="text-gray-400">Secure, end-to-end encrypted messaging</p>
        </motion.div>
        <ChatNavigate setDisplay={setDisplay} currentDisplay={display} />
        <motion.div 
          className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8 mt-8 w-full"
          variants={fadeIn}
        >
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Your Display Name
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name..."
            className="bg-zinc-800 border-zinc-700 text-white mb-1"
          />
          <p className="text-xs text-gray-500">This name will be visible to others in your chat room</p>
        </motion.div>

       

        <motion.div 
          className="mt-6 bg-zinc-900 rounded-lg border border-zinc-800 p-6"
          variants={fadeIn}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          key={display}
        >
          {display === "create-room" ? (
            <CreateChat socket={socket} />
          ) : display === "join-room" ? (
            <JoinChat socket={socket} />
          ) : (
            <div className="text-red-400 text-center">Invalid State</div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const ChatNavigate = ({
  setDisplay,
  currentDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
  currentDisplay: string;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <Button
        variant={currentDisplay === "create-room" ? "default" : "outline"}
        onClick={() => {
          setDisplay("create-room");
        }}
        className={
          currentDisplay === "create-room"
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "border-zinc-700 text-black hover:bg-zinc-800 hover:text-white"
        }
      >
        <Lock className="mr-2 h-4 w-4" />
        Create Room
      </Button>
      <Button
        variant={currentDisplay === "join-room" ? "default" : "outline"}
        onClick={() => {
          setDisplay("join-room");
        }}
        className={
          currentDisplay === "join-room"
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "border-zinc-700 text-black hover:bg-zinc-800 hover:text-white"
        }
      >
        <Users className="mr-2 h-4 w-4" />
        Join Room
      </Button>
    </div>
  );
};

export default Chat;
