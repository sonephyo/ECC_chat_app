import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const backend_url = import.meta.env.VITE_BACKEND_URL;
let socket = io(backend_url);

function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("response", (data) => {
      console.log("Received from server:", data);
      setResponse(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div>
      <h1>Socket.IO Chat Example</h1>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <p>Server says: {response}</p>
    </div>
  );
}

export default Chat;
