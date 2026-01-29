export {
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { socket } from "./socket";
// import { colors } from "src/common/Colors";
// import { Avatar } from "../Avatar";
// import { Badge } from "../Badge";
// import {
//   FeatherArrowLeft,
//   FeatherEdit3,
//   FeatherMoreVertical,
//   FeatherSearch,
// } from "@subframe/core";
// import API, { URL_PATH, BASE_URL } from "src/common/API";


// type Student = {
//   name: string;
//   domain: string;
//   avatar: string;
// }

// type Recruiter = {
//   userId: string; // IMPORTANT: recruiter userId for /chat/:userId
//   name: string;
//   company?: string;
//   title?: string;
//   avatar?: string;
//   lastMessage?: string;
//   time?: string;
//   unread?: number;
// };

// type Msg = {
//   senderId: string;
//   text: string;
//   time?: string;
// };

// export default function Chat() {
//   const navigate = useNavigate();
//   const { otherUserId } = useParams(); // 👉 this will be recruiterId in student side
//   const currentUserId = localStorage.getItem("userId") || "";

 


//   // Student profile info (top bar)
//   const student = useMemo(() => {
//     try {
//       const raw = localStorage.getItem("user");
//       const u = raw ? JSON.parse(raw) : {};
//       return {
//         name: u?.name || u?.fullName || "Student",
//         domain: u?.domain || "Student",
//         avatar:
//           u?.profileUrl ||
//           "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
//       };
//     } catch {
//       return {
//         name: "Student",
//         domain: "Student",
//         avatar:
//           "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
//       };
//     }
//   }, []);

//   // ✅ Demo recruiter list (replace with API later)
//   const [recruiters] = useState<Recruiter[]>([
//     {
//       userId: "RECRUITER_ID_1",
//       name: "Sarah Kim",
//       company: "TechWave Inc",
//       title: "Senior Recruiter",
//       avatar:
//         "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
//       lastMessage: "Perfect! I’ll send over the JD in a moment…",
//       time: "2m ago",
//       unread: 2,
//     },
//     {
//       userId: "RECRUITER_ID_2",
//       name: "Michael Rodriguez",
//       company: "DataCore Systems",
//       title: "Talent Acquisition",
//       avatar:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
//       lastMessage: "Thanks for your interest! I’d like to learn more…",
//       time: "1h ago",
//     },
//     {
//       userId: "RECRUITER_ID_3",
//       name: "Jennifer Chen",
//       company: "CloudScale",
//       title: "Recruiter",
//       avatar:
//         "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200",
//       lastMessage: "Your profile caught my attention…",
//       time: "3h ago",
//     },
//   ]);

//   const [search, setSearch] = useState("");
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [input, setInput] = useState("");
//   const [student, setStudent] = useState<Student>({
//   name: "",
//   domain: "Professional",
//   avatar: DEFAULT_AVATAR,
// });


//   // Which recruiter is selected? (by URL param)
//   const activeRecruiter = useMemo(() => {
//     return recruiters.find((r) => r.userId === otherUserId) || null;
//   }, [recruiters, otherUserId]);

//   const filteredRecruiters = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     if (!s) return recruiters;
//     return recruiters.filter(
//       (r) =>
//         r.name.toLowerCase().includes(s) ||
//         (r.company || "").toLowerCase().includes(s) ||
//         (r.title || "").toLowerCase().includes(s) ||
//         (r.lastMessage || "").toLowerCase().includes(s)
//     );
//   }, [search, recruiters]);

//   // --- Socket wiring ---
//   useEffect(() => {
//     if (!currentUserId) return;

//     // student joins their room
//     socket.emit("join", currentUserId);

//     const onReceive = (msg: Msg) => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           senderId: msg.senderId,
//           text: msg.text,
//           time:
//             msg.time ||
//             new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         },
//       ]);
//     };

//     socket.on("receive-message", onReceive);

//     return () => {
//       socket.off("receive-message", onReceive);
//     };
//   }, [currentUserId]);

//   const sendMessage = () => {
//     if (!input.trim() || !otherUserId || !currentUserId) return;

//     const text = input.trim();

//     // optimistic UI
//     setMessages((prev) => [
//       ...prev,
//       {
//         senderId: currentUserId,
//         text,
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       },
//     ]);

//     // send to backend (receiver is recruiterId from URL)
//     socket.emit("send-message", { receiverId: otherUserId, text });

//     setInput("");
//   };

// useEffect(() => {
//   const fetchStudent = async () => {
//     try {
//       const res = await API("GET", URL_PATH.calculateExperienceIndex);

//       const demo = res?.data?.demographics?.[0];
//       const domain = res?.jobdomain || "Professional";

//       const profileFromServer = res?.documents?.profileUrl;

//       let avatar = DEFAULT_AVATAR;
//       if (profileFromServer) {
//         const origin = BASE_URL.replace(/\/api\/?$/, "");
//         if (/^https?:\/\//.test(profileFromServer)) avatar = profileFromServer;
//         else if (profileFromServer.startsWith("/")) avatar = origin + profileFromServer;
//         else avatar = origin + "/" + profileFromServer;
//       }

//       setStudent({
//         name: demo?.fullName || "Student",
//         domain,
//         avatar,
//       });
//     } catch (err) {
//       console.error("fetchStudent failed", err);
//       setStudent((prev) => ({ ...prev, avatar: DEFAULT_AVATAR }));
//     }
//   };

//   fetchStudent();
// }, []);



//   return (
//     <div className="min-h-screen w-full" style={{ backgroundColor: colors.white }}>
//       {/* TOP BAR (Student) */}
//       <div className="w-full border-b" style={{ borderColor: colors.aqua }}>
//         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="h-9 w-9 rounded-xl border flex items-center justify-center"
//               style={{ borderColor: colors.aqua }}
//               title="Back"
//             >
//               <FeatherArrowLeft />
//             </button>

//             <div className="flex flex-col">
//               <div className="text-sm font-black" style={{ color: colors.primary }}>
//                 {student.name}
//               </div>
//               <div className="text-[11px] font-semibold" style={{ color: colors.secondary }}>
//                 {student.domain}
//               </div>
//             </div>
//           </div>

//           <div className="hidden md:flex items-center gap-2 flex-1 max-w-[520px]">
//             <div
//               className="flex items-center gap-2 w-full rounded-2xl border px-3 py-2"
//               style={{ borderColor: colors.aqua, backgroundColor: colors.cream }}
//             >
//               <FeatherSearch className="w-4 h-4" />
//               <input
//                 className="w-full bg-transparent outline-none text-sm"
//                 placeholder="Search recruiters"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <span className="text-sm font-bold" style={{ color: colors.primary }}>
//               Messages
//             </span>
//             <Avatar
//               size="small"
//               image={student.avatar}
//               style={{ boxShadow: `0 0 0 2px ${colors.aqua}` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* BODY */}
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4">
//         <div className="flex gap-4">
//           {/* LEFT SIDEBAR (Recruiters list) */}
//           <div
//             className="w-[320px] hidden lg:flex flex-col border rounded-3xl overflow-hidden"
//             style={{ borderColor: colors.aqua, backgroundColor: colors.white }}
//           >
//             <div
//               className="p-4 border-b flex items-center justify-between"
//               style={{ borderColor: colors.aqua }}
//             >
//               <div className="text-sm font-black" style={{ color: colors.primary }}>
//                 Recruiters
//               </div>
//               <button
//                 className="h-9 w-9 rounded-xl border flex items-center justify-center"
//                 style={{ borderColor: colors.aqua }}
//                 title="New message"
//               >
//                 <FeatherEdit3 />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {filteredRecruiters.map((r) => {
//                 const active = r.userId === otherUserId;
//                 return (
//                   <button
//                     key={r.userId}
//                     className="w-full text-left px-4 py-3 border-b hover:bg-neutral-50"
//                     style={{
//                       borderColor: colors.cream,
//                       backgroundColor: active ? colors.mint : colors.white,
//                     }}
//                     onClick={() => navigate(`/chat/${r.userId}`)}
//                   >
//                     <div className="flex gap-3 items-start">
//                       <Avatar size="small" image={r.avatar} />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between gap-2">
//                           <div className="font-bold text-sm truncate" style={{ color: colors.primary }}>
//                             {r.name}
//                           </div>
//                           <div className="text-[10px] font-semibold opacity-70">{r.time}</div>
//                         </div>
//                         <div className="text-[11px] truncate" style={{ color: colors.secondary }}>
//                           {r.company}
//                         </div>
//                         <div className="text-[11px] truncate mt-1 opacity-80">
//                           {r.lastMessage || "Start a conversation"}
//                         </div>

//                         {r.unread ? (
//                           <div className="mt-2">
//                             <Badge
//                               className="border-none text-[10px] font-bold"
//                               style={{ backgroundColor: colors.cream, color: colors.secondary }}
//                             >
//                               {r.unread} new
//                             </Badge>
//                           </div>
//                         ) : null}
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* CHAT PANEL */}
//           <div
//             className="flex-1 border rounded-3xl overflow-hidden"
//             style={{ borderColor: colors.aqua, backgroundColor: colors.white }}
//           >
//             {/* Chat header (Recruiter details) */}
//             <div
//               className="px-4 py-3 border-b flex items-center justify-between"
//               style={{ borderColor: colors.aqua }}
//             >
//               <div className="flex items-center gap-3">
//                     <Avatar
//               size="small"
//               image={student.avatar}
//               style={{ boxShadow: `0 0 0 2px ${colors.aqua}` }}
//             />
//                 <div className="flex flex-col">
//                   <div className="text-sm font-black" style={{ color: colors.primary }}>
// {student.name}
//                   </div>
//                   <div className="text-[11px]" style={{ color: colors.secondary }}>
//                        {student.domain}

//                   </div>
//                 </div>
//               </div>

//               <button
//                 className="h-9 w-9 rounded-xl border flex items-center justify-center"
//                 style={{ borderColor: colors.aqua }}
//               >
//                 <FeatherMoreVertical />
//               </button>
//             </div>

//             {/* Messages */}
//             <div className="h-[70vh] overflow-y-auto p-4 space-y-3">
//               {!otherUserId ? (
//                 <div className="h-full flex items-center justify-center text-sm opacity-60">
//                   Select a recruiter to start chatting.
//                 </div>
//               ) : messages.length === 0 ? (
//                 <div className="h-full flex items-center justify-center text-sm opacity-60">
//                   Start the conversation…
//                 </div>
//               ) : null}

//               {messages.map((m, i) => {
//                 const isMe = m.senderId === currentUserId;
//                 return (
//                   <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                     <div className="max-w-[70%]">
//                       <div
//                         className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
//                           isMe ? "" : "border"
//                         }`}
//                         style={
//                           isMe
//                             ? { backgroundColor: colors.secondary, color: colors.white }
//                             : { backgroundColor: colors.white, borderColor: colors.cream, color: colors.primary }
//                         }
//                       >
//                         {m.text}
//                       </div>

//                       {m.time ? (
//                         <div className={`mt-1 text-[10px] font-semibold ${isMe ? "text-right" : "text-left"} opacity-60`}>
//                           {m.time} {isMe ? "You" : ""}
//                         </div>
//                       ) : null}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Composer */}
//             <div
//               className="p-3 border-t flex gap-2"
//               style={{ borderColor: colors.aqua, backgroundColor: colors.white }}
//             >
//               <input
//                 className="flex-1 border rounded-2xl px-4 py-3 text-sm outline-none"
//                 style={{ borderColor: colors.aqua, backgroundColor: colors.cream }}
//                 placeholder="Write a message…"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") sendMessage();
//                 }}
//                 disabled={!otherUserId}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="px-5 rounded-2xl font-bold disabled:opacity-50"
//                 style={{ backgroundColor: colors.primary, color: colors.white }}
//                 disabled={!otherUserId}
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile search */}
//         <div className="lg:hidden mt-4">
//           <div
//             className="flex items-center gap-2 w-full rounded-2xl border px-3 py-2"
//             style={{ borderColor: colors.aqua, backgroundColor: colors.cream }}
//           >
//             <FeatherSearch className="w-4 h-4" />
//             <input
//               className="w-full bg-transparent outline-none text-sm"
//               placeholder="Search recruiters"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

};
