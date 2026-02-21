// src/components/UploadResume.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "src/store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";

import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import {
  FeatherArrowLeft,
  FeatherFileText,
  FeatherUpload,
  FeatherX,
  FeatherCheckCircle,
  FeatherClock,
  FeatherBriefcase,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ============================================
// ILLUSTRATION COMPONENTS
// ============================================
const ResumeIllustration = () => (
  <motion.div
    className="w-full h-full flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    style={{
      marginLeft: window.innerWidth < 1024 ? "0px" : "-80px",
      paddingLeft: window.innerWidth < 1024 ? "0px" : "0px",
      overflow: "visible",
    }}
  >
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        maxWidth: window.innerWidth < 1024 ? "320px" : "480px", 
        minWidth: window.innerWidth < 1024 ? "280px" : "400px",
        width: "100%",
        height: "auto"
      }}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Define gradients for neon effects */}
      <defs>
        <linearGradient
          id="neonBlueGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#1E90FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#4169E1" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient
          id="electricBlueGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#1E90FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00BFFF" stopOpacity="0.8" />
        </linearGradient>

        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="strongNeonGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow circles */}
      <motion.circle
        cx="250"
        cy="250"
        r={window.innerWidth < 1024 ? "150" : "200"}
        fill="url(#neonBlueGradient)"
        opacity="0.08"
        animate={{
          r: window.innerWidth < 1024 ? [150, 165, 150] : [200, 215, 200],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx="250"
        cy="250"
        r={window.innerWidth < 1024 ? "130" : "180"}
        fill="url(#electricBlueGradient)"
        opacity="0.05"
        animate={{
          r: window.innerWidth < 1024 ? [130, 140, 130] : [180, 190, 180],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Document base */}
      <motion.rect
        x={window.innerWidth < 1024 ? "140" : "120"}
        y={window.innerWidth < 1024 ? "80" : "60"}
        width={window.innerWidth < 1024 ? "220" : "260"}
        height={window.innerWidth < 1024 ? "320" : "360"}
        rx="16"
        fill="white"
        stroke="url(#neonBlueGradient)"
        strokeWidth="3"
        strokeOpacity="0.5"
        filter="url(#neonGlow)"
        animate={{
          y: [0, -5, 0],
          strokeOpacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />

      {/* RESUME HEADER SECTION */}
      {/* Name */}
      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "110" : "100"}
        fontSize={window.innerWidth < 1024 ? "14" : "16"}
        fontWeight="bold"
        fill="#1E90FF"
        filter="url(#neonGlow)"
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ALEX RIVERA
      </motion.text>

      {/* Title */}
      <motion.text 
        x={window.innerWidth < 1024 ? "160" : "140"} 
        y={window.innerWidth < 1024 ? "125" : "120"} 
        fontSize={window.innerWidth < 1024 ? "9" : "10"} 
        fill="#666666"
      >
        Product Designer
      </motion.text>

      {/* Contact line */}
      <motion.text 
        x={window.innerWidth < 1024 ? "160" : "140"} 
        y={window.innerWidth < 1024 ? "140" : "135"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#999999"
      >
        alex.rivera@email.com | (415) 555-0123
      </motion.text>

      {/* Divider line */}
      <motion.line
        x1={window.innerWidth < 1024 ? "160" : "140"}
        y1={window.innerWidth < 1024 ? "150" : "145"}
        x2={window.innerWidth < 1024 ? "340" : "360"}
        y2={window.innerWidth < 1024 ? "150" : "145"}
        stroke="#E0E0E0"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* EXPERIENCE SECTION */}
      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "170" : "165"}
        fontSize={window.innerWidth < 1024 ? "9" : "10"}
        fontWeight="bold"
        fill="#00BFFF"
        filter="url(#neonGlow)"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1,
        }}
      >
        EXPERIENCE
      </motion.text>

      {/* Job 1 */}
      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "190" : "185"}
        fontSize={window.innerWidth < 1024 ? "8" : "9"}
        fontWeight="bold"
        fill="#333333"
      >
        Senior Product Designer
      </motion.text>
      <motion.text 
        x={window.innerWidth < 1024 ? "260" : "280"} 
        y={window.innerWidth < 1024 ? "190" : "185"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#999999"
      >
        2022-Present
      </motion.text>
      <motion.text 
        x={window.innerWidth < 1024 ? "160" : "140"} 
        y={window.innerWidth < 1024 ? "205" : "200"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#666666"
      >
        • Led redesign, inc. engagement 45%
      </motion.text>

      {/* Job 2 */}
      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "225" : "220"}
        fontSize={window.innerWidth < 1024 ? "8" : "9"}
        fontWeight="bold"
        fill="#333333"
      >
        UI/UX Designer
      </motion.text>
      <motion.text 
        x={window.innerWidth < 1024 ? "260" : "280"} 
        y={window.innerWidth < 1024 ? "225" : "220"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#999999"
      >
        2020-2022
      </motion.text>
      <motion.text 
        x={window.innerWidth < 1024 ? "160" : "140"} 
        y={window.innerWidth < 1024 ? "240" : "235"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#666666"
      >
        • Designed 20+ mobile interfaces
      </motion.text>

      {/* Job 3 */}
      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "260" : "255"}
        fontSize={window.innerWidth < 1024 ? "8" : "9"}
        fontWeight="bold"
        fill="#333333"
      >
        Junior Designer
      </motion.text>
      <motion.text 
        x={window.innerWidth < 1024 ? "260" : "280"} 
        y={window.innerWidth < 1024 ? "260" : "255"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#999999"
      >
        2019-2020
      </motion.text>
      <motion.text 
        x={window.innerWidth < 1024 ? "160" : "140"} 
        y={window.innerWidth < 1024 ? "275" : "270"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#666666"
      >
        • Created wireframes & prototypes
      </motion.text>

      {/* Divider line */}
      <motion.line
        x1={window.innerWidth < 1024 ? "160" : "140"}
        y1={window.innerWidth < 1024 ? "290" : "285"}
        x2={window.innerWidth < 1024 ? "340" : "360"}
        y2={window.innerWidth < 1024 ? "290" : "285"}
        stroke="#E0E0E0"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* EDUCATION SECTION */}
      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "310" : "305"}
        fontSize={window.innerWidth < 1024 ? "9" : "10"}
        fontWeight="bold"
        fill="#4169E1"
        filter="url(#neonGlow)"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      >
        EDUCATION
      </motion.text>

      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "330" : "325"}
        fontSize={window.innerWidth < 1024 ? "8" : "9"}
        fontWeight="bold"
        fill="#333333"
      >
        BFA in Digital Design
      </motion.text>
      <motion.text 
        x={window.innerWidth < 1024 ? "160" : "140"} 
        y={window.innerWidth < 1024 ? "345" : "340"} 
        fontSize={window.innerWidth < 1024 ? "6" : "7"} 
        fill="#666666"
      >
        Stanford University · 2020
      </motion.text>

      {/* Divider line */}
      <motion.line
        x1={window.innerWidth < 1024 ? "160" : "140"}
        y1={window.innerWidth < 1024 ? "360" : "355"}
        x2={window.innerWidth < 1024 ? "340" : "360"}
        y2={window.innerWidth < 1024 ? "360" : "355"}
        stroke="#E0E0E0"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* SKILLS SECTION */}
      <motion.text
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "380" : "375"}
        fontSize={window.innerWidth < 1024 ? "9" : "10"}
        fontWeight="bold"
        fill="#00CED1"
        filter="url(#neonGlow)"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        SKILLS
      </motion.text>

      {/* First row of skill tags */}
      <motion.rect
        x={window.innerWidth < 1024 ? "160" : "140"}
        y={window.innerWidth < 1024 ? "395" : "390"}
        width={window.innerWidth < 1024 ? "45" : "55"}
        height="18"
        rx="9"
        fill="#1E90FF"
        fillOpacity="0.1"
        stroke="#1E90FF"
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
      <motion.text 
        x={window.innerWidth < 1024 ? "170" : "153"} 
        y={window.innerWidth < 1024 ? "408" : "403"} 
        fontSize={window.innerWidth < 1024 ? "7" : "8"} 
        fill="#1E90FF"
      >
        Figma
      </motion.text>

      <motion.rect
        x={window.innerWidth < 1024 ? "215" : "205"}
        y={window.innerWidth < 1024 ? "395" : "390"}
        width={window.innerWidth < 1024 ? "50" : "60"}
        height="18"
        rx="9"
        fill="#00BFFF"
        fillOpacity="0.1"
        stroke="#00BFFF"
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
      <motion.text 
        x={window.innerWidth < 1024 ? "225" : "218"} 
        y={window.innerWidth < 1024 ? "408" : "403"} 
        fontSize={window.innerWidth < 1024 ? "7" : "8"} 
        fill="#00BFFF"
      >
        Sketch
      </motion.text>

      <motion.rect
        x={window.innerWidth < 1024 ? "275" : "275"}
        y={window.innerWidth < 1024 ? "395" : "390"}
        width={window.innerWidth < 1024 ? "55" : "65"}
        height="18"
        rx="9"
        fill="#4169E1"
        fillOpacity="0.1"
        stroke="#4169E1"
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
      <motion.text 
        x={window.innerWidth < 1024 ? "285" : "288"} 
        y={window.innerWidth < 1024 ? "408" : "403"} 
        fontSize={window.innerWidth < 1024 ? "7" : "8"} 
        fill="#4169E1"
      >
        InVision
      </motion.text>

      {/* Upload icon with neon blue */}
      <motion.g
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <circle
          cx="250"
          cy={window.innerWidth < 1024 ? "460" : "480"}
          r="24"
          fill="url(#neonBlueGradient)"
          fillOpacity="0.15"
          filter="url(#strongNeonGlow)"
        />
        <circle
          cx="250"
          cy={window.innerWidth < 1024 ? "460" : "480"}
          r="20"
          fill="white"
          fillOpacity="0.1"
          stroke="url(#neonBlueGradient)"
          strokeWidth="2"
          strokeOpacity="0.6"
        />
        <path
          d="M250 445L250 460M250 445L245 450M250 445L255 450"
          stroke="#1E90FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#neonGlow)"
        />
        <text
          x="230"
          y={window.innerWidth < 1024 ? "490" : "510"}
          fontSize="7"
          fill="#1E90FF"
          filter="url(#neonGlow)"
        >
          UPLOAD RESUME
        </text>
      </motion.g>

      {/* Floating particles - hide on mobile */}
      {window.innerWidth >= 768 && (
        <>
          <motion.circle
            cx="90"
            cy="120"
            r="6"
            fill="#1E90FF"
            opacity="0.15"
            filter="url(#neonGlow)"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="410"
            cy="300"
            r="8"
            fill="#00BFFF"
            opacity="0.15"
            filter="url(#neonGlow)"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}
    </motion.svg>
  </motion.div>
);

const fetchStatusWithRetry = async (
  token: string,
  retries = 15,
  delay = 300,
) => {
  for (let i = 0; i < retries; i++) {
    const res = await API("GET", URL_PATH.getUserStatus, undefined, {
      Authorization: `Bearer ${token}`,
    });

    const navigation = res?.navigation || res?.data?.navigation;

    if (navigation?.completedSteps?.includes("resume")) {
      return navigation;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const finalRes = await API("GET", URL_PATH.getUserStatus, undefined, {
    Authorization: `Bearer ${token}`,
  });

  return finalRes?.navigation || finalRes?.data?.navigation;
};

function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [existingResume, setExistingResume] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [focused, setFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBrowseFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploaded = e.target.files[0];

    if (
      uploaded.type !== "application/pdf" &&
      !uploaded.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF file is allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (uploaded.size > MAX_FILE_SIZE) {
      toast.error("File size must be 5MB or less.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(uploaded);
    if (e.currentTarget) e.currentTarget.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocused(false);

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const uploaded = e.dataTransfer.files[0];

    if (
      uploaded.type !== "application/pdf" &&
      !uploaded.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF file is allowed.");
      return;
    }

    if (uploaded.size > MAX_FILE_SIZE) {
      toast.error("File size must be 5MB or less.");
      return;
    }

    setFile(uploaded);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocused(true);
  };

  const handleDragLeave = () => {
    setFocused(false);
  };

  const removeFile = () => {
    setFile(null);
    setExistingResume(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDropZoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBrowseFile();
    } else if (e.key === "Escape") {
      if (file || existingResume) {
        e.preventDefault();
        removeFile();
      }
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return;

        const res = await API("GET", URL_PATH.getResume, undefined, {
          "user-id": userId,
          Authorization: `Bearer ${token}`,
        });

        const resumeUrl = res?.data?.resumeUrl;
        const resumeName = res?.data?.resumeOriginalName;

        if (resumeUrl) {
          setExistingResume({
            name: resumeName || "resume.pdf",
            url: resumeUrl,
          });
        }
      } catch (err) {
        console.error("Resume fetch failed", err);
      }
    };

    fetchResume();
  }, []);

  // Add this at the top of your UploadResume component
  useEffect(() => {
    console.log("📋 UploadResume mounted - checking localStorage:");
    console.log(
      "   - token:",
      localStorage.getItem("token") ? "✅ Present" : "❌ Missing",
    );
    console.log("   - userId:", localStorage.getItem("userId") || "❌ Missing");
    console.log(
      "   - userEmail:",
      localStorage.getItem("userEmail") || "❌ Missing",
    );
    console.log(
      "   - signupEmail:",
      localStorage.getItem("signupEmail") || "❌ Missing",
    );

    // If userId is missing but we have token, try to recover
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && !userId) {
      console.log(
        "⚠️ Token exists but userId missing! Attempting to recover...",
      );

      try {
        // Try to decode JWT token
        const base64Url = token.split(".")[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));
          const extractedUserId = payload.userId || payload.sub || payload.id;

          if (extractedUserId) {
            localStorage.setItem("userId", extractedUserId);
            console.log("✅ Recovered userId from token:", extractedUserId);
          }
        }
      } catch (e) {
        console.error("❌ Failed to extract userId from token:", e);
      }
    }
  }, []);

  const uploadResume = async () => {
    if (uploading) return;

    // ✅ CASE 1: resume already exists → just continue
    if (!file && existingResume) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Session expired. Please login again.");
          return;
        }

        setUploading(true);
        const navigation = await fetchStatusWithRetry(token);

        dispatch(setNavigation(navigation));
        navigate(navigation.nextRoute);
      } catch (error) {
        console.error(error);
        toast.error("Navigation failed. Please refresh.");
      } finally {
        setUploading(false);
      }
      return;
    }

    // ❌ no file & no existing resume
    if (!file) {
      toast.error("Please select a resume to upload");
      return;
    }

    // ✅ CASE 2: new upload
    try {
      setUploading(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      // Upload resume
      await API("POST", URL_PATH.uploadResume, formData, {
        "user-id": userId,
        Authorization: `Bearer ${token}`,
      });

      toast.success("Resume uploaded successfully");

      // Wait for backend to update status
      const navigation = await fetchStatusWithRetry(token);

      dispatch(setNavigation(navigation));
      navigate(navigation.nextRoute);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar />

      <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden">
        {/* Minimalistic gradient background */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background: `linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.03) 100%
          )`,
          }}
        />

        {/* Decorative circles - hide on mobile */}
        {windowWidth >= 768 && (
          <>
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-5"
              style={{ backgroundColor: colors.primary }}
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-5"
              style={{ backgroundColor: colors.accent }}
              animate={{ y: [0, 30, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </>
        )}

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 xl:gap-16 items-start lg:items-center">
          {/* LEFT - Illustration & Benefits - hidden on mobile, visible on lg screens */}
          <motion.div
            className="hidden lg:flex flex-col gap-8 xl:gap-12"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Illustration */}
            <div className="w-full aspect-square max-w-sm mx-auto">
              <ResumeIllustration />
            </div>

            {/* Benefits */}
            <div className="space-y-4 xl:space-y-6 max-w-md mx-auto">
              {[
                {
                  icon: FeatherCheckCircle,
                  title: "AI-Powered Analysis",
                  desc: "Our system extracts key skills and experience from your resume",
                },
                {
                  icon: FeatherClock,
                  title: "Save Time",
                  desc: "Skip manual data entry - we'll populate your profile automatically",
                },
                {
                  icon: FeatherBriefcase,
                  title: "Better Matches",
                  desc: "Get more relevant job recommendations based on your resume",
                },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3 xl:gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 xl:w-6 xl:h-6"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill={colors.primary}
                        opacity="0.15"
                      />
                      <path
                        d="M16 10L11 15L8 12"
                        stroke={colors.primary}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="font-medium text-sm xl:text-base"
                      style={{ color: colors.accent }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="text-xs xl:text-sm mt-1"
                      style={{ color: colors.neutral[600] }}
                    >
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT - Upload Form */}
          <motion.div
            className="w-full max-w-lg mx-auto lg:mx-0"
            initial={{ opacity: 0, x: windowWidth >= 1024 ? 40 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back + Progress Bar */}
            <div className="flex w-full items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <IconButton
                size="small"
                icon={<FeatherArrowLeft />}
                onClick={() =>
                  window.history.length > 1 ? navigate(-1) : navigate("/")
                }
                className="!bg-transparent !text-neutral-600"
                aria-label="Back"
              />
            </div>

            {/* Title */}
            <div className="flex w-full flex-col items-start gap-2 mb-4 sm:mb-6">
              <span
                className="text-lg sm:text-xl lg:text-2xl font-medium"
                style={{ color: colors.accent }}
              >
                Upload your Resume
              </span>

              <span
                className="text-xs sm:text-sm"
                style={{ color: colors.neutral[600] }}
              >
                Upload your most recent resume to help us understand your skills
              </span>
            </div>

            {/* Resume Upload Section */}
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-sm font-semibold" style={{ color: colors.neutral[800] }}>
                Resume / CV
              </span>

              {/* Upload Drop Zone */}
              <motion.div
                role="button"
                tabIndex={0}
                aria-label="Upload resume. Click or press Enter to browse files. Or drag and drop a file here. Press Escape to remove the selected file."
                className="w-full flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl border-2 border-dashed bg-white px-4 sm:px-6 py-6 sm:py-8 cursor-pointer transition-all"
                style={{
                  borderColor: focused ? colors.primary : colors.neutral[400],
                  backgroundColor: focused
                    ? `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.02)`
                    : "white",
                }}
                onClick={handleBrowseFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={handleDropZoneKeyDown}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                animate={{
                  borderColor: focused ? colors.primary : colors.neutral[400],
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{
                    y: focused ? [-2, 2, -2] : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: focused ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  <IconWithBackground
                    variant="neutral"
                    size={windowWidth < 640 ? "medium" : "large"}
                    icon={<FeatherUpload className="w-4 h-4 sm:w-5 sm:h-5" />}
                    className="!p-2 sm:!p-3 !bg-neutral-100"
                    style={{
                      backgroundColor: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.1)`,
                    }}
                  />
                </motion.div>

                <div className="flex flex-col items-center justify-center gap-1">
                  <span
                    className="text-xs sm:text-sm font-medium text-center"
                    style={{ color: colors.accent }}
                  >
                    Click to select file or drag to upload
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: colors.neutral[600] }}
                  >
                    PDF (max 5MB)
                  </span>
                </div>

                {/* hidden input */}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </motion.div>

              {/* Uploaded File Preview */}
              {(file || existingResume) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex items-center gap-3 rounded-lg border p-3"
                  style={{ borderColor: colors.neutral[200] }}
                >
                  <IconWithBackground
                    variant="neutral"
                    size="medium"
                    icon={
                      <FeatherFileText className="w-4 h-4 text-neutral-700" />
                    }
                    className="!p-2 !bg-neutral-100 flex-shrink-0"
                    style={{
                      backgroundColor: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.1)`,
                    }}
                  />

                  <div className="flex grow flex-col min-w-0">
                    <span className="text-xs sm:text-sm text-neutral-900 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                      {file?.name || existingResume?.name}
                    </span>

                    {!file && existingResume && (
                      <a
                        href={existingResume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:underline truncate"
                        style={{ color: colors.primary }}
                      >
                        View resume
                      </a>
                    )}

                    {file && (
                      <span
                        className="text-xs"
                        style={{ color: colors.neutral[600] }}
                      >
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </div>

                  <IconButton
                    size="small"
                    icon={<FeatherX />}
                    onClick={removeFile}
                    className="!bg-transparent !text-neutral-500 flex-shrink-0"
                  />
                </motion.div>
              )}
            </div>

            {/* Continue Button */}
            <div className="flex flex-col items-center w-full border-t pt-6 mt-6">
              <button
                className={`h-10 sm:h-12 w-full sm:max-w-md rounded-full font-semibold shadow-md transition ${
                  uploading ? "pointer-events-none opacity-70" : ""
                }`}
                style={{
                  backgroundColor:
                    (!file && !existingResume) || uploading
                      ? colors.neutral[400]
                      : colors.primary,
                  color: colors.white,
                  border: "none",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if ((!file && !existingResume) || uploading) return;
                  e.currentTarget.style.backgroundColor = colors.secondary;
                  e.currentTarget.style.color = colors.white;
                }}
                onMouseLeave={(e) => {
                  if ((!file && !existingResume) || uploading) return;
                  e.currentTarget.style.backgroundColor = colors.primary;
                  e.currentTarget.style.color = colors.white;
                }}
                onClick={uploadResume}
                disabled={(!file && !existingResume) || uploading}
              >
                {uploading ? "Uploading..." : "Continue"}
              </button>

              {/* Skip option - if allowed */}
              {!existingResume && !file && (
                <p className="text-center mt-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-xs transition hover:opacity-70"
                    style={{ color: colors.neutral[600] }}
                  >
                    Skip for now
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UploadResume;