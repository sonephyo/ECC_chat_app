import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSocket } from "~/lib/socketContext";

const chatRoom = () => {
  const { socket } = useSocket();
  const { roomId } = useParams();
  const { username } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket || !roomId || !username) {
      console.log("Missing info, redirecting...");
      navigate("/chat");
      return;
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
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

    socket.on("user_joined", handleUserJoined);
    socket.on("error", handleError);
    socket.on("user_left", handleUserLeft);

    const handleLeave = () => {
      socket.emit("leave_room", { username, room_code: roomId });
    };

    window.addEventListener("beforeunload", handleLeave);

    return () => {
      socket.off("user_left", handleUserLeft);
      socket.off("joined_room", handleUserJoined);
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, [socket]);

  return (
    <div>
      <h1>You are in roomID:{roomId}</h1>
    </div>
  );
};

export default chatRoom;
