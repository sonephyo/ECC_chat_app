import React, { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import ChatRoomSocket from "./chatRoomSocket";

export function meta() {
  return [{ title: "Chat Page" }];
}

const Index = () => {
  const [joinChatRoom, setjoinChatRoom] = useState<boolean>(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );

  const [selectedRoom, setselectedRoom] = useState<number | null>(null);
  const [username, setusername] = useState<string | null>(null);

  useEffect(() => {
    if (joinChatRoom) {
      console.log("User has joined the chat room");
  
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const socket = io(backend_url);
  
      socketRef.current = socket;
  
      socket.on("connect", () => {
        console.log("Connected to backend socket server");
  
        if (username && selectedRoom !== null) {
          socket.emit("join", { username, room: selectedRoom });
          console.log("Emit join event:", { username, room: selectedRoom });
        }
      });
  
      return () => {
        console.log("Cleaning up socket connection...");
        socket.disconnect();
      };
    }
  }, [joinChatRoom, username, selectedRoom]);
  

  const handleJoinChatRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!username || !selectedRoom) {
      alert("Please fill out the username and room number to join");
      return;
    }

    setjoinChatRoom(true);

    if (socketRef.current) {
      socketRef.current.emit("join", { username, room: selectedRoom });
      console.log("Emit join event:", { username, room: selectedRoom });
    }
  };
  const handleLeaveChatRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave", { username, room: selectedRoom });
      console.log("Emit leave event:", { username, room: selectedRoom });
    }
    setjoinChatRoom(false);
  };
  return (
    <div>
      <p>ChatRoom</p>
      <div>
        <div>
          <div>
            <input
              type="username"
              value={username ? username : ""}
              onChange={(e) => setusername(e.target.value)}
              placeholder="Username"
            />
          </div>

          <div>
            <select
              value={selectedRoom ? selectedRoom : -1}
              onChange={(e) => setselectedRoom(Number(e.target.value))}
            >
              <option value="">--Select an option--</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>

          <div>
            <p>Typed Text: {username}</p>
            <p>Selected Option: {selectedRoom}</p>
          </div>
        </div>
        {!joinChatRoom ? (
          <button onClick={handleJoinChatRoom}>Join Chat Room</button>
        ) : (
          <div>
            <button onClick={handleLeaveChatRoom}>Leave Chat Room</button>
            <ChatRoomSocket socketRef={socketRef} selectedRoom={selectedRoom} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Index;
