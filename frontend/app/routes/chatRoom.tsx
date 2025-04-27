import React from "react";
import { useSocket } from "~/lib/socketContext";

const chatRoom = () => {
  const { socket } = useSocket();

  return <div>chatRoom</div>;
};

export default chatRoom;
