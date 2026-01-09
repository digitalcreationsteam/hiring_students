// import { useEffect, useState } from "react";
// import { socket } from "./socket";

// type Message = {
//   role: "user" | "assistant";
//   text: string;
// };

// export default function Chat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     socket.on("chat-reply", (reply: string) => {
//       setMessages(prev => [...prev, { role: "assistant", text: reply }]);
//     });

//     return () => {
//       socket.off("chat-reply");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (!input) return;

//     setMessages(prev => [...prev, { role: "user", text: input }]);
//     socket.emit("chat-message", input);
//     setInput("");
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <div className="border h-[400px] overflow-y-auto p-2">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}
//           >
//             <span className="inline-block p-2 rounded bg-gray-100">
//               {m.text}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2 mt-2">
//         <input
//           className="border flex-1 p-2"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//         <button onClick={sendMessage} className="bg-black text-white px-4">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
