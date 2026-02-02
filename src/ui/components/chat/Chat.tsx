"use client";

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "./socket";
import { colors } from "src/common/Colors";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import {
  FeatherArrowLeft,
  FeatherEdit3,
  FeatherMoreVertical,
  FeatherSearch,
  FeatherSend,
  FeatherCheck,
} from "@subframe/core";
import API, { URL_PATH, BASE_URL } from "src/common/API";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

type Student = {
  name: string;
  domain: string;
  avatar: string;
};

type Recruiter = {
  userId: string;
  name: string;
  company?: string;
  title?: string;
  avatar?: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  lastMessageTime?: Date;
};

type Msg = {
  _id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp?: Date | string;
  time?: string;
  read?: boolean;
};

export default function Chat() {
  const navigate = useNavigate();
  const { otherUserId } = useParams();
  const currentUserId = localStorage.getItem("userId") || "";
  const currentUserRole = localStorage.getItem("role") || "student";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);
  const [sending, setSending] = useState(false);

  const [student, setStudent] = useState<Student>({
    name: "",
    domain: "",
    avatar: DEFAULT_AVATAR,
  });

  // Helper function to format time
  const formatMessageTime = useCallback((date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatTimeAgo = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  // Fetch recruiters list (people you've chatted with)
  const fetchRecruiters = useCallback(async () => {
    if (!currentUserId) return;
    
    setLoadingRecruiters(true);
    try {
      // You might need to create this endpoint or use a different one
      // Based on your backend, you might fetch from the Chat model
      const response = await API("GET", "/chat/participants");
      
      if (response?.data) {
        const formattedRecruiters = response.data.map((r: any) => {
          const otherUser = r.participants.find((p: any) => p._id !== currentUserId);
          const lastMessage = r.messages?.[r.messages.length - 1];
          
          return {
            userId: otherUser._id,
            name: otherUser.name || "Unknown User",
            company: otherUser.company,
            title: otherUser.title,
            avatar: otherUser.avatar || DEFAULT_AVATAR,
            lastMessage: lastMessage?.text,
            time: lastMessage?.timestamp ? formatTimeAgo(new Date(lastMessage.timestamp)) : "",
            unread: r.messages?.filter((m: any) => 
              m.senderId === otherUser._id && !m.read
            ).length || 0,
            lastMessageTime: lastMessage?.timestamp ? new Date(lastMessage.timestamp) : new Date(),
          };
        }).sort((a: Recruiter, b: Recruiter) => 
          (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0)
        );
        
        setRecruiters(formattedRecruiters);
      }
    } catch (err) {
      console.error("Failed to fetch recruiters:", err);
      // Fallback to demo data if API fails
      setRecruiters([
        {
          userId: "RECRUITER_ID_1",
          name: "Sarah Kim",
          company: "TechWave Inc",
          title: "Senior Recruiter",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
          lastMessage: "Perfect! I'll send over the JD in a moment...",
          time: "2m ago",
          unread: 2,
        },
        // ... other demo recruiters
      ]);
    } finally {
      setLoadingRecruiters(false);
    }
  }, [currentUserId, formatTimeAgo]);

  // Fetch messages when chat is selected
  const fetchMessages = useCallback(async () => {
    if (!otherUserId || !currentUserId) return;

    setLoading(true);
    try {
      const response = await API("GET", URL_PATH.getChatHistory(otherUserId));
      
      if (response?.data) {
        const formattedMessages = response.data.map((msg: any) => ({
          ...msg,
          time: formatMessageTime(msg.timestamp || new Date()),
          timestamp: new Date(msg.timestamp),
        }));
        
        setMessages(formattedMessages);
        
        // Mark messages as read when we open the chat
        markMessagesAsRead();
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [otherUserId, currentUserId, formatMessageTime]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    if (!otherUserId || !currentUserId) return;
    
    try {
      await API("POST", URL_PATH.markMessagesRead, {
        senderId: otherUserId,
        receiverId: currentUserId,
      });
      
      // Update local state to mark messages as read
      setMessages(prev => prev.map(msg => 
        msg.senderId === otherUserId ? { ...msg, read: true } : msg
      ));
      
      // Update recruiter's unread count
      setRecruiters(prev => prev.map(r => 
        r.userId === otherUserId ? { ...r, unread: 0 } : r
      ));
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  }, [otherUserId, currentUserId]);

  // Socket setup
  useEffect(() => {
    if (!currentUserId) return;

    // Join user's room
    socket.emit("join", currentUserId);

    const onReceiveMessage = async (msg: Msg) => {
      // Check if this message is for the current chat
      if (msg.senderId === otherUserId || msg.receiverId === otherUserId) {
        const formattedMsg = {
          ...msg,
          time: formatMessageTime(msg.timestamp || new Date()),
          timestamp: new Date(msg.timestamp || new Date()),
        };
        
        setMessages(prev => [...prev, formattedMsg]);
        
        // Mark as read if we received it while viewing
        if (msg.senderId === otherUserId) {
          await markMessagesAsRead();
        }
      }
      
      // Update recruiter's last message in the list
      const senderId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
      const isFromOtherUser = msg.senderId !== currentUserId;
      
      setRecruiters(prev => prev.map(r => {
        if (r.userId === senderId) {
          return {
            ...r,
            lastMessage: msg.text,
            time: formatTimeAgo(new Date()),
            unread: isFromOtherUser ? (r.unread || 0) + 1 : 0,
            lastMessageTime: new Date(),
          };
        }
        return r;
      }).sort((a, b) => 
        (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0)
      ));
    };

    const onMessageSent = (msg: Msg) => {
      // Update message with server data (replace temp ID)
      setMessages(prev => prev.map(m => 
        m.text === msg.text && m.senderId === currentUserId && !m._id 
          ? { ...m, ...msg, time: formatMessageTime(msg.timestamp || new Date()) }
          : m
      ));
      setSending(false);
    };

    const onTyping = (data: { senderId: string; isTyping: boolean }) => {
      if (data.senderId === otherUserId) {
        setOtherIsTyping(data.isTyping);
      }
    };

    socket.on("receive-message", onReceiveMessage);
    socket.on("message-sent", onMessageSent);
    socket.on("user-typing", onTyping);

    return () => {
      socket.off("receive-message", onReceiveMessage);
      socket.off("message-sent", onMessageSent);
      socket.off("user-typing", onTyping);
    };
  }, [currentUserId, otherUserId, formatMessageTime, formatTimeAgo, markMessagesAsRead]);

  // Fetch data on component mount
  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  // Fetch messages when otherUserId changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const isNearBottom = 
        chatContainerRef.current.scrollHeight - 
        chatContainerRef.current.scrollTop - 
        chatContainerRef.current.clientHeight < 100;
      
      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, otherIsTyping]);

  // Typing indicator handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    if (!isTyping && otherUserId) {
      setIsTyping(true);
      socket.emit("typing", {
        senderId: currentUserId,
        receiverId: otherUserId,
        isTyping: true
      });
      
      if (typingTimeoutRef.current) {
  clearTimeout(typingTimeoutRef.current);
  typingTimeoutRef.current = null;
}
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("typing", {
          senderId: currentUserId,
          receiverId: otherUserId,
          isTyping: false
        });
      }, 2000);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !otherUserId || !currentUserId || sending) return;

    const text = input.trim();
    const tempId = `temp_${Date.now()}`;
    
    // Optimistic update
    const tempMessage: Msg = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: otherUserId,
      text,
      timestamp: new Date(),
      time: formatMessageTime(new Date()),
      read: false,
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setInput("");
    setSending(true);
    
    // Clear typing indicator
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("typing", {
      senderId: currentUserId,
      receiverId: otherUserId,
      isTyping: false
    });

    try {
      // Send via socket - your backend will save to database
      socket.emit("send-message", {
        senderId: currentUserId,
        receiverId: otherUserId,
        text,
        timestamp: new Date().toISOString(),
      });
      
      // Update recruiter list with new last message
      setRecruiters(prev => prev.map(r => {
        if (r.userId === otherUserId) {
          return {
            ...r,
            lastMessage: text,
            time: "Just now",
            lastMessageTime: new Date(),
          };
        }
        return r;
      }).sort((a, b) => 
        (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0)
      ));
      
    } catch (err) {
      console.error("Failed to send message:", err);
      setSending(false);
      
      // Remove optimistic update on error
      setMessages(prev => prev.filter(m => m._id !== tempId));
      
      // Show error to user
      alert("Failed to send message. Please try again.");
    }
  };

  // Filter recruiters based on search
  const filteredRecruiters = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return recruiters;
    return recruiters.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        (r.company || "").toLowerCase().includes(s) ||
        (r.title || "").toLowerCase().includes(s) ||
        (r.lastMessage || "").toLowerCase().includes(s)
    );
  }, [search, recruiters]);

  const activeRecruiter = useMemo(() => {
    return recruiters.find((r) => r.userId === otherUserId) || null;
  }, [recruiters, otherUserId]);

  // Fetch student profile
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await API("GET", URL_PATH.calculateExperienceIndex);
        const demo = res?.data?.demographics?.[0];
        const domain = typeof res?.jobdomain === "string"
          ? res.jobdomain
          : res?.jobdomain?.domain || "";

        const profileFromServer = res?.documents?.profileUrl;
        let avatar = DEFAULT_AVATAR;
        
        if (profileFromServer) {
          const origin = BASE_URL.replace(/\/api\/?$/, "");
          if (/^https?:\/\//.test(profileFromServer)) {
            avatar = profileFromServer;
          } else if (profileFromServer.startsWith("/")) {
            avatar = origin + profileFromServer;
          } else {
            avatar = origin + "/" + profileFromServer;
          }
        }

        setStudent({
          name: demo?.fullName || "Student",
          domain,
          avatar,
        });
      } catch (err) {
        console.error("fetchStudent failed", err);
        setStudent((prev) => ({ ...prev, avatar: DEFAULT_AVATAR }));
      }
    };

    fetchStudent();
  }, []);

  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Loading states
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to use chat</p>
      </div>
    );
  }

  // CHECK - For when no recruiter is selected
  if (!otherUserId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3 text-gray-800">Welcome to Chat</h1>
          <p className="text-gray-600 mb-6">
            {currentUserRole === "recruiter" 
              ? "Select a student from your inbox to start chatting." 
              : "Select a recruiter to start chatting."}
          </p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: colors.white }}>
      {/* TOP BAR */}
      <div className="w-full border-b" style={{ borderColor: colors.aqua }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-gray-50 transition"
              style={{ borderColor: colors.aqua }}
              title="Back"
            >
              <FeatherArrowLeft />
            </button>

            <div className="flex flex-col">
              <div className="text-sm font-black" style={{ color: colors.primary }}>
                {student.name}
              </div>
              <div className="text-[11px] font-semibold" style={{ color: colors.secondary }}>
                {student.domain}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-[520px]">
            <div
              className="flex items-center gap-2 w-full rounded-2xl border px-3 py-2"
              style={{ borderColor: colors.aqua, backgroundColor: colors.cream }}
            >
              <FeatherSearch className="w-4 h-4" />
              <input
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Search recruiters"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold" style={{ color: colors.primary }}>
              Messages
            </span>
            <Avatar
              size="small"
              image={student.avatar}
              style={{ boxShadow: `0 0 0 2px ${colors.aqua}` }}
            />
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-4">
          {/* LEFT SIDEBAR */}
          <div
            className="w-[320px] hidden lg:flex flex-col border rounded-3xl overflow-hidden"
            style={{ borderColor: colors.aqua, backgroundColor: colors.white }}
          >
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: colors.aqua }}
            >
              <div className="text-sm font-black" style={{ color: colors.primary }}>
                Recruiters
              </div>
              <button
                className="h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-gray-50 transition"
                style={{ borderColor: colors.aqua }}
                title="New message"
              >
                <FeatherEdit3 />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingRecruiters ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : filteredRecruiters.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No recruiters found</div>
              ) : (
                filteredRecruiters.map((r) => {
                  const active = r.userId === otherUserId;
                  return (
                    <button
                      key={r.userId}
                      className="w-full text-left px-4 py-3 border-b hover:bg-neutral-50 transition"
                      style={{
                        borderColor: colors.cream,
                        backgroundColor: active ? colors.mint : colors.white,
                      }}
                      onClick={() => navigate(`/chat/${r.userId}`)}
                    >
                      <div className="flex gap-3 items-start">
                        <Avatar size="small" image={r.avatar} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-bold text-sm truncate" style={{ color: colors.primary }}>
                              {r.name}
                            </div>
                            <div className="text-[10px] font-semibold opacity-70">{r.time}</div>
                          </div>
                          <div className="text-[11px] truncate" style={{ color: colors.secondary }}>
                            {r.company}
                          </div>
                          <div className="text-[11px] truncate mt-1 opacity-80">
                            {r.lastMessage || "Start a conversation"}
                          </div>
                          {r.unread ? (
                            <div className="mt-2">
                              <Badge
                                className="border-none text-[10px] font-bold"
                                style={{ backgroundColor: colors.cream, color: colors.secondary }}
                              >
                                {r.unread} new
                              </Badge>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* CHAT PANEL */}
          <div
            className="flex-1 border rounded-3xl overflow-hidden flex flex-col"
            style={{ borderColor: colors.aqua, backgroundColor: colors.white }}
          >
            {/* Chat header */}
            <div
              className="px-4 py-3 border-b flex items-center justify-between"
              style={{ borderColor: colors.aqua }}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  size="small"
                  image={activeRecruiter?.avatar || DEFAULT_AVATAR}
                  style={{ boxShadow: `0 0 0 2px ${colors.aqua}` }}
                />
                <div className="flex flex-col">
                  <div className="text-sm font-black" style={{ color: colors.primary }}>
                    {activeRecruiter?.name || "Select a recruiter"}
                  </div>
                  <div className="text-[11px]" style={{ color: colors.secondary }}>
                    {activeRecruiter?.company || ""} {activeRecruiter?.title ? `• ${activeRecruiter.title}` : ""}
                  </div>
                </div>
              </div>

              <button
                className="h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-gray-50 transition"
                style={{ borderColor: colors.aqua }}
              >
                <FeatherMoreVertical />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ maxHeight: "calc(70vh - 60px)" }}
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => {
                    const isMe = m.senderId === currentUserId;
                    return (
                      <div key={m._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[70%]">
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              isMe ? "" : "border"
                            } ${m._id?.startsWith('temp_') ? 'opacity-80' : ''}`}
                            style={
                              isMe
                                ? { backgroundColor: colors.secondary, color: colors.white }
                                : { backgroundColor: colors.white, borderColor: colors.cream, color: colors.primary }
                            }
                          >
                            {m.text}
                            {m._id?.startsWith('temp_') && (
                              <span className="ml-2 text-xs opacity-70">Sending...</span>
                            )}
                          </div>
                          <div className={`mt-1 text-[10px] font-semibold ${isMe ? "text-right" : "text-left"} opacity-60 flex items-center gap-1`}>
                            {m.time}
                            {isMe && (
                              <FeatherCheck className={`w-3 h-3 ${m.read ? 'text-blue-400' : 'text-gray-400'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Typing indicator */}
                  {otherIsTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%]">
                        <div
                          className="px-4 py-3 rounded-2xl text-sm border"
                          style={{ backgroundColor: colors.white, borderColor: colors.cream }}
                        >
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Composer */}
            <div
              className="p-3 border-t"
              style={{ borderColor: colors.aqua, backgroundColor: colors.white }}
            >
              <div className="flex gap-2">
                <input
                  className="flex-1 border rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
                  style={{ borderColor: colors.aqua, backgroundColor: colors.cream }}
                  placeholder="Write a message…"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={!otherUserId || sending}
                />
                <button
                  onClick={sendMessage}
                  className="px-5 rounded-2xl font-bold disabled:opacity-50 flex items-center gap-2 hover:opacity-90 transition"
                  style={{ backgroundColor: colors.primary, color: colors.white }}
                  disabled={!otherUserId || !input.trim() || sending}
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending
                    </>
                  ) : (
                    <>
                      <FeatherSend className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden mt-4">
          <div
            className="flex items-center gap-2 w-full rounded-2xl border px-3 py-2"
            style={{ borderColor: colors.aqua, backgroundColor: colors.cream }}
          >
            <FeatherSearch className="w-4 h-4" />
            <input
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Search recruiters"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}