"use client";

import React from "react";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { FeatherArrowLeft } from "@subframe/core";
import { FeatherInfo } from "@subframe/core";
import { useNavigate } from "react-router-dom";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// SVG Illustration Component for Skill Index
const SkillIndexIllustration = () => (
  <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background decorative elements */}
    <circle cx="150" cy="100" r="80" fill="url(#skillGrad1)" opacity="0.2" />
    <circle cx="350" cy="300" r="100" fill="url(#skillGrad2)" opacity="0.15" />
    
    {/* Main illustration - Skill Index theme */}
    <g filter="url(#skillShadow)">
      {/* Central platform */}
      <circle cx="250" cy="200" r="110" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      
      {/* Skill bars / Growth chart */}
      <g transform="translate(200, 160)">
        {/* Bar 1 */}
        <rect x="0" y="60" width="25" height="40" rx="8" fill="url(#barGrad1)" opacity="0.9">
          <animate attributeName="height" values="40;60;40" dur="3s" repeatCount="indefinite" />
        </rect>
        {/* Bar 2 */}
        <rect x="40" y="30" width="25" height="70" rx="8" fill="url(#barGrad2)" opacity="0.9">
          <animate attributeName="height" values="70;90;70" dur="3.2s" repeatCount="indefinite" />
        </rect>
        {/* Bar 3 */}
        <rect x="80" y="10" width="25" height="90" rx="8" fill="url(#barGrad3)" opacity="0.9">
          <animate attributeName="height" values="90;100;90" dur="3.5s" repeatCount="indefinite" />
        </rect>
        {/* Bar 4 */}
        <rect x="120" y="20" width="25" height="80" rx="8" fill="url(#barGrad4)" opacity="0.9">
          <animate attributeName="height" values="80;95;80" dur="3.8s" repeatCount="indefinite" />
        </rect>
        {/* Bar 5 */}
        <rect x="160" y="40" width="25" height="60" rx="8" fill="url(#barGrad5)" opacity="0.9">
          <animate attributeName="height" values="60;75;60" dur="3.1s" repeatCount="indefinite" />
        </rect>
      </g>
      
      {/* Connection line for bars */}
      <path d="M212 150 L252 130 L292 120 L332 130 L372 150" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.8" />
      
      {/* Score indicator */}
      <circle cx="292" cy="120" r="25" fill="url(#scoreGrad)" filter="url(#glow)" />
      <text x="292" y="128" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">82</text>
      
      {/* Floating elements */}
      <circle cx="150" cy="80" r="6" fill="#4F46E5" opacity="0.4">
        <animate attributeName="r" values="6;9;6" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="180" r="5" fill="#059669" opacity="0.3">
        <animate attributeName="r" values="5;8;5" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="280" r="4" fill="#DC2626" opacity="0.3">
        <animate attributeName="r" values="4;7;4" dur="4.2s" repeatCount="indefinite" />
      </circle>
      
      {/* Small decorative elements */}
      <circle cx="220" cy="220" r="3" fill="#F59E0B" opacity="0.5" />
      <circle cx="280" cy="180" r="4" fill="#10B981" opacity="0.4" />
      <circle cx="320" cy="250" r="3" fill="#7C3AED" opacity="0.4" />
    </g>
    
    {/* Gradients */}
    <defs>
      <linearGradient id="skillGrad1" x1="70" y1="20" x2="230" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
      
      <linearGradient id="skillGrad2" x1="250" y1="200" x2="450" y2="400" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      
      <linearGradient id="barGrad1" x1="0" y1="0" x2="25" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#818CF8" />
      </linearGradient>
      
      <linearGradient id="barGrad2" x1="40" y1="0" x2="65" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#34D399" />
      </linearGradient>
      
      <linearGradient id="barGrad3" x1="80" y1="0" x2="105" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DC2626" />
        <stop offset="1" stopColor="#F87171" />
      </linearGradient>
      
      <linearGradient id="barGrad4" x1="120" y1="0" x2="145" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#FBBF24" />
      </linearGradient>
      
      <linearGradient id="barGrad5" x1="160" y1="0" x2="185" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C3AED" />
        <stop offset="1" stopColor="#A78BFA" />
      </linearGradient>
      
      <linearGradient id="scoreGrad" x1="267" y1="95" x2="317" y2="145" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#FBBF24" />
      </linearGradient>
      
      <filter id="skillShadow" x="-50" y="-50" width="600" height="500" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.1" />
      </filter>
      
      <filter id="glow" x="-50" y="-50" width="200" height="200" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

function SkillIndexIntro() {
  const navigate = useNavigate();
  
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
            
            {/* Left side - SVG Illustration Component */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] lg:max-w-[500px]">
                {/* Decorative blur elements behind illustration */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
                
                {/* SVG Illustration Component */}
                <div className="relative z-10 drop-shadow-2xl">
                  <SkillIndexIllustration />
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
                  {/* Header with progress */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <IconButton
                      size="small"
                      icon={<FeatherArrowLeft className="w-4 h-4" />}
                      onClick={() => navigate("/projects")}
                      className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                    />

                    <div className="flex flex-1 gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-gray-600 to-gray-800"
                        />
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className="h-1.5 flex-1 rounded-full bg-white/30"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title with refined typography */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl sm:text-2xl md:text-3xl font-light tracking-tight text-gray-800">
                      Now let's calculate your 
                      <span className="block font-semibold text-gray-900 mt-1">Skill Index</span>
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed mt-2">
                      The Skill Index is the foundation of UniTalent's hiring system and
                      the most important step in your evaluation. It provides evidence
                      of job readiness and role-relevant knowledge, enabling
                      transparent, skill-first hiring
                    </p>
                  </div>

                  {/* Steps Section */}
                  <div className="flex w-full flex-col gap-5">
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                      What happens next
                    </span>

                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex items-center justify-center h-7 w-7 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 text-white text-xs font-medium shrink-0">
                        1
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-gray-800">
                          Choose your job domain
                        </p>
                        <p className="text-xs text-gray-500">
                          You will be asked to select your primary job domain — the role
                          you want to be evaluated for.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex items-center justify-center h-7 w-7 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 text-white text-xs font-medium shrink-0">
                        2
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-gray-800">
                          Take the Skill Index Assessment
                        </p>
                        <p className="text-xs text-gray-500">
                          You will complete a focused, role-specific assessment designed
                          to objectively evaluate your readiness for this role.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex items-center justify-center h-7 w-7 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 text-white text-xs font-medium shrink-0">
                        3
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-gray-800">
                          Get your Hireability Score
                        </p>
                        <p className="text-xs text-gray-500">
                          Your performance here directly impacts how recruiters
                          discover, evaluate, and rank your profile on UniTalent.
                        </p>
                      </div>
                    </div>

                    {/* Note Box with glass effect */}
                    <div
                      className="w-full rounded-xl border px-5 py-5 backdrop-blur-sm mt-2"
                      style={{
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                        borderColor: "rgba(79, 70, 229, 0.3)",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <FeatherInfo
                            className="h-4 w-4"
                            style={{ color: colors.white }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-800">
                            Note :
                          </p>
                          <p className="text-xs leading-relaxed text-gray-600">
                            This is the most critical part of the process.
                            <br /> Recruiters rely on the Skill Index to make decisions.
                            <br /> Your performance here determines how you stand among
                            others competing for the same roles.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-2" />

                  {/* Footer Buttons */}
                  <div className="flex w-full flex-col gap-3">
                    <Button
                      size="large"
                      onClick={() => navigate("/paywall")}
                      className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, #2c3e50, #1e2a36)",
                        color: "#ffffff",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)",
                      }}
                    >
                      Proceed to Skill Index Assessment
                    </Button>

                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full text-center text-xs sm:text-sm font-medium transition hover:text-gray-900 py-2"
                      style={{ color: colors.neutral[600] }}
                    >
                      Skip for now
                    </button>
                  </div>

                  {/* Step indicator */}
                  <p className="text-xs text-center text-gray-400 mt-2">
                    Step 3 of 5 • Skill Index Introduction
                  </p>
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

export default SkillIndexIntro;