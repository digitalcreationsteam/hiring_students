import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Chat() {
  const { otherUserId } = useParams(); // 👈 FROM URL
  const currentUserId = localStorage.getItem("userId"); // 👈 LOGGED-IN USER

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

   useEffect(() => {
    // 🔑 Join room
    socket.emit("join", currentUserId);

    socket.on("receive-message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [currentUserId]);

  const sendMessage = () => {
    if (!input || !otherUserId || !currentUserId) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);

    socket.emit("chat-message", {
      senderId: currentUserId,
      receiverId: otherUserId,
      text: input
    });

    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="border h-[400px] overflow-y-auto p-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}
          >
            <span className="inline-block p-2 rounded bg-gray-100">
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-black text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}
