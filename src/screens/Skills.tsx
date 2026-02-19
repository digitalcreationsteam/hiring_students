"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FeatherArrowLeft, FeatherX } from "@subframe/core";

import HeaderLogo from "src/ui/components/HeaderLogo";
import { IconButton } from "../ui/components/IconButton";
import { TextField } from "../ui/components/TextField";
import { Button } from "../ui/components/Button";

import API, { URL_PATH } from "src/common/API";
import { colors } from "../common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// SVG Illustration Component for Skills
const SkillsIllustration = () => (
  <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background decorative elements */}
    <circle cx="150" cy="100" r="80" fill="url(#skillsGrad1)" opacity="0.2" />
    <circle cx="350" cy="300" r="100" fill="url(#skillsGrad2)" opacity="0.15" />
    
    {/* Main illustration - Skills theme */}
    <g filter="url(#skillsShadow)">
      {/* Central hexagon - representing skill clusters */}
      <path d="M250 120 L320 160 L320 240 L250 280 L180 240 L180 160 L250 120" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      
      {/* Floating skill bubbles with animations */}
      {/* Skill 1 - Purple */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="25" fill="url(#skillBubble1)" filter="url(#glow)">
          <animate attributeName="r" values="25;28;25" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">React</text>
      </g>
      
      {/* Skill 2 - Green */}
      <g transform="translate(300, 180)">
        <circle cx="0" cy="0" r="22" fill="url(#skillBubble2)" filter="url(#glow)">
          <animate attributeName="r" values="22;25;22" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Python</text>
      </g>
      
      {/* Skill 3 - Blue */}
      <g transform="translate(250, 250)">
        <circle cx="0" cy="0" r="28" fill="url(#skillBubble3)" filter="url(#glow)">
          <animate attributeName="r" values="28;32;28" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">SQL</text>
      </g>
      
      {/* Skill 4 - Orange */}
      <g transform="translate(180, 230)">
        <circle cx="0" cy="0" r="20" fill="url(#skillBubble4)" filter="url(#glow)">
          <animate attributeName="r" values="20;23;20" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">UX</text>
      </g>
      
      {/* Skill 5 - Pink */}
      <g transform="translate(320, 240)">
        <circle cx="0" cy="0" r="23" fill="url(#skillBubble5)" filter="url(#glow)">
          <animate attributeName="r" values="23;26;23" dur="3.3s" repeatCount="indefinite" />
        </circle>
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Agile</text>
      </g>
      
      {/* Connecting lines - skill network */}
      <path d="M200 150 L250 120" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <path d="M300 180 L320 160" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <path d="M250 250 L250 280" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <path d="M180 230 L180 200" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <path d="M320 240 L320 200" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      
      {/* Floating particles */}
      <circle cx="120" cy="120" r="4" fill="#4F46E5" opacity="0.4">
        <animate attributeName="r" values="4;7;4" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="150" r="5" fill="#059669" opacity="0.3">
        <animate attributeName="r" values="5;8;5" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="320" r="3" fill="#DC2626" opacity="0.3">
        <animate attributeName="r" values="3;6;3" dur="4.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="280" r="4" fill="#F59E0B" opacity="0.3">
        <animate attributeName="r" values="4;7;4" dur="3.8s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* Gradients */}
    <defs>
      <linearGradient id="skillsGrad1" x1="70" y1="20" x2="230" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
      
      <linearGradient id="skillsGrad2" x1="250" y1="200" x2="450" y2="400" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      
      <radialGradient id="skillBubble1" cx="0" cy="0" r="25" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#7C3AED" />
      </radialGradient>
      
      <radialGradient id="skillBubble2" cx="0" cy="0" r="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#10B981" />
      </radialGradient>
      
      <radialGradient id="skillBubble3" cx="0" cy="0" r="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#60A5FA" />
      </radialGradient>
      
      <radialGradient id="skillBubble4" cx="0" cy="0" r="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#FBBF24" />
      </radialGradient>
      
      <radialGradient id="skillBubble5" cx="0" cy="0" r="23" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EC4899" />
        <stop offset="1" stopColor="#F472B6" />
      </radialGradient>
      
      <filter id="skillsShadow" x="-50" y="-50" width="600" height="500" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.1" />
      </filter>
      
      <filter id="glow" x="-50" y="-50" width="200" height="200" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

export default function Skills() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source; // "dashboard" | undefined

  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const suggested = [
    "Data Analysis",
    "A/B Testing",
    "Stakeholder Management",
    "Feature Prioritization",
    "Agile Methodology",
    "Product Analytics",
    "Customer Development",
    "Wireframing",
    "SQL",
    "Go-to-Market Strategy",
    "API Integration",
    "Metrics & KPIs",
  ];

  const addSkill = (raw: string) => {
    const s = raw.trim();
    if (!s) return;

    const exists = skills.some((k) => k.toLowerCase() === s.toLowerCase());
    if (!exists) setSkills((prev) => [...prev, s]);
  };

  const removeSkill = (s: string) => {
    setSkills((prev) => prev.filter((k) => k !== s));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    }
  };

  const handleContinue = async () => {
    if (skills.length === 0) {
      alert("Add at least one skill to continue.");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const domainId = localStorage.getItem("domainId");

      if (!domainId) {
        alert("Domain selection missing. Please select domain again.");
        navigate("/job-domain");
        return;
      }

      await API(
        "POST",
        URL_PATH.updateUserDomainSkills,
        { userId, domainId, skills },
        { Authorization: `Bearer ${token}` }
      );

      navigate(source === "dashboard" ? "/dashboard" : "/assessment-intro");
    } catch (error: any) {
      console.error("Skill save failed:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to save skills. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await API("GET", URL_PATH.getUserDomainSkils, undefined, {
          Authorization: `Bearer ${token}`,
          "user-id": userId,
        });

        const skillsFromApi = res?.[0]?.skills;
        if (Array.isArray(skillsFromApi)) setSkills(skillsFromApi);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  const isDisabled = skills.length === 0 || isSubmitting;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🎨 Enhanced gradient background with soft blur - matching jobdomain page */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 20% 20%, rgba(210, 215, 220, 0.4) 0%, rgba(150, 165, 180, 0.3) 50%, rgba(40, 64, 86, 0.4) 100%)`,
        }}
      >
        {/* Animated blur elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex items-center justify-center">
          <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left side - SVG Illustration Component with animations */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] lg:max-w-[500px]">
                {/* Decorative blur elements behind illustration */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
                
                {/* SVG Illustration Component with animations */}
                <div className="relative z-10 drop-shadow-2xl">
                  <SkillsIllustration />
                </div>
              </div>
            </div>

            {/* Right side - Glass card */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
              <div className="w-full max-w-[500px]">
                <div
                  className="flex w-full flex-col gap-6 sm:gap-8 rounded-3xl border px-6 sm:px-8 md:px-10 py-7 sm:py-8 shadow-2xl backdrop-blur-xl bg-white/70"
                  style={{
                    borderColor: "rgba(255,255,255,0.4)",
                  }}
                >
                  {/* Top row with progress */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <IconButton
                      size="small"
                      icon={<FeatherArrowLeft className="w-4 h-4" />}
                      onClick={() => {
                        if (source === "dashboard") navigate("/dashboard");
                        else navigate(-1);
                      }}
                      className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={`p-${i}`}
                            className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-gray-600 to-gray-800"
                          />
                        ))}
                        {Array.from({ length: 2 }).map((_, i) => (
                          <div
                            key={`n-${i}`}
                            className="flex-1 h-1.5 rounded-full bg-white/30"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Step 4 of 5 • Skills</p>
                    </div>
                  </div>

                  {/* Header with refined typography */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl sm:text-2xl md:text-3xl font-light tracking-tight text-gray-800">
                      Add your 
                      <span className="block font-semibold text-gray-900 mt-1">Skills</span>
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed mt-2">
                      Add your key skills to help recruiters discover your profile and
                      match you with relevant opportunities
                    </p>
                  </div>

                  {/* Your Skills Section */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Your Skills <span className="text-red-500">*</span>
                    </span>

                    {/* Input field */}
                    <div className="flex flex-col gap-1">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a skill and press Enter"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {skills.map((s) => (
                        <div
                          key={s}
                          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 bg-white/50 backdrop-blur-sm border border-white/40"
                        >
                          <span className="text-sm text-gray-700">
                            {s}
                          </span>

                          <button
                            onClick={() => removeSkill(s)}
                            className="text-gray-400 hover:text-gray-600 transition"
                            aria-label={`Remove ${s}`}
                          >
                            <FeatherX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Skills */}
                  <div className="mt-2">
                    <div className="rounded-xl px-5 py-5 flex flex-col gap-3 bg-white/30 backdrop-blur-sm border border-white/40">
                      <span className="text-sm font-medium text-gray-700">
                        Suggested Skills for Product Managers
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {suggested.map((s) => {
                          const isAdded = skills.some(
                            (k) => k.toLowerCase() === s.toLowerCase()
                          );

                          return (
                            <button
                              key={s}
                              type="button"
                              disabled={isAdded}
                              onClick={() => addSkill(s)}
                              className="px-3 py-1.5 rounded-xl text-xs transition-all duration-200 border"
                              style={{
                                backgroundColor: isAdded ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)",
                                borderColor: "rgba(255,255,255,0.4)",
                                color: isAdded ? colors.neutral[400] : colors.neutral[600],
                                cursor: isAdded ? "default" : "pointer",
                              }}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-2" />

                  {/* Footer Button */}
                  <footer>
                    <Button
                      onClick={handleContinue}
                      disabled={isDisabled}
                      className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                      style={{
                        background: isDisabled
                          ? "linear-gradient(135deg, #e0e0e0, #f0f0f0)"
                          : "linear-gradient(135deg, #2c3e50, #1e2a36)",
                        color: "#ffffff",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        boxShadow: isDisabled
                          ? "none"
                          : "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)",
                        opacity: isDisabled ? 0.6 : 1,
                      }}
                    >
                      {isSubmitting ? "Saving..." : "Continue →"}
                    </Button>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}