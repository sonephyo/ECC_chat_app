import { useEffect, useState } from "react";
import CreateChat from "~/components/PrivateMessaging/CreateChat";
import JoinChat from "~/components/PrivateMessaging/JoinChat";
import { useNavigate } from "react-router";
import { useSocket } from "~/lib/socketContext";

const Chat = () => {
  const [display, setdisplay] = useState<string>("create-room");
  const { socket } = useSocket();
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

  return (
    <div className="bg-blue-200 flex flex-col items-center gap-5">
      <ChatNavigate setdisplay={setdisplay} />
      {display === "create-room" ? (
        <CreateChat socket={socket} />
      ) : display === "join-room" ? (
        <JoinChat socket={socket} />
      ) : (
        <div>Invalid State</div>
      )}
    </div>
  );
};

const ChatNavigate = ({
  setdisplay,
}: {
  setdisplay: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex w-100 justify-between">
      <button
        onClick={() => {
          setdisplay("create-room");
        }}
      >
        Create Room
      </button>
      <button
        onClick={() => {
          setdisplay("join-room");
        }}
      >
        Join Room
      </button>
    </div>
  );
};

export default Chat;
