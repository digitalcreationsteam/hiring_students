import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket";

type Msg = {
  senderId: string;
  text: string;
};

export default function Chat() {
  const { otherUserId } = useParams();
  const currentUserId = localStorage.getItem("userId");

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!currentUserId) return;

    // join my personal room
    socket.emit("join", currentUserId);

    const onReceive = (msg: Msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", onReceive);

    return () => {
      socket.off("receive-message", onReceive);
    };
  }, [currentUserId]);

  const sendMessage = () => {
    if (!input.trim() || !otherUserId || !currentUserId) return;

    const text = input.trim();

    // show on my screen immediately
    setMessages((prev) => [...prev, { senderId: currentUserId, text }]);

    // send to backend (receiver is from URL)
    socket.emit("send-message", {
      receiverId: otherUserId,
      text,
    });

    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="border h-[400px] overflow-y-auto p-2 rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 ${
              m.senderId === currentUserId ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block p-2 rounded bg-gray-100">
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="border flex-1 p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message…"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
