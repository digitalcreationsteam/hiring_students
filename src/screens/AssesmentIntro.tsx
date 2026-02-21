"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/components/Button";
import { useNavigate } from "react-router-dom";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { 
  FeatherArrowLeft, 
  FeatherBook, 
  FeatherCheckSquare, 
  FeatherClock, 
  FeatherCompass, 
  FeatherFileText, 
  FeatherTarget, 
  FeatherTrendingUp, 
  FeatherZap,
  FeatherAward,
  FeatherBarChart,
  FeatherBrain
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";

// ============================================
// ENHANCED BACKGROUND GLASS LAYER
// ============================================
const BackgroundGlass: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
    <div className="absolute inset-0 bg-white/20 backdrop-blur-[150px]" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10" />
  </div>
);

// ============================================
// GLASS CARD COMPONENT
// ============================================
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`relative group ${className}`}
  >
    {/* Main glass layer */}
    <div
      className="absolute inset-0 rounded-3xl transition-all duration-500"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(255, 255, 255, 0.3) inset",
      }}
    />

    {/* Content */}
    <div className="relative z-10">{children}</div>
  </motion.div>
);

// ============================================
// ANIMATED ILLUSTRATION COMPONENTS (CONTAINED)
// ============================================
const FloatingIllustration: React.FC<{ delay?: number; className?: string }> = ({ 
  delay = 0, 
  className = "" 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 0.6, scale: 1 }}
    transition={{ duration: 0.8, delay }}
    className={`absolute pointer-events-none overflow-hidden ${className}`}
    style={{ maxWidth: '200px', maxHeight: '200px' }}
  >
    <div className="relative w-full h-full">
      {/* Floating circles */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute w-24 h-24 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}10, ${colors.primary}05)`,
          border: `1px solid ${colors.primary}15`,
          left: '20px',
          top: '20px',
        }}
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          x: [0, 8, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute w-20 h-20 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${colors.secondary}10, ${colors.secondary}05)`,
          border: `1px solid ${colors.secondary}15`,
          left: '60px',
          top: '50px',
        }}
      />
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute w-16 h-16 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${colors.accent}10, ${colors.accent}05)`,
          border: `1px solid ${colors.accent}15`,
          left: '30px',
          top: '80px',
        }}
      />
    </div>
  </motion.div>
);

const AssessmentCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: string[];
  delay?: number;
  gradient?: string;
}> = ({ title, icon, items, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="relative group h-full"
  >
    <div
      className="absolute inset-0 rounded-3xl transition-all duration-500"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(255, 255, 255, 0.3) inset",
      }}
    />

    <div className="relative z-10 flex flex-col gap-4 px-4 sm:px-6 py-4 sm:py-6 h-full">
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
            border: `1px solid ${colors.primary}30`,
            color: colors.primary,
          }}
        >
          {icon}
        </div>
        <span 
          className="text-lg font-medium truncate"
          style={{ color: colors.accent }}
        >
          {title}
        </span>
      </div>
      
      <div className="flex flex-col gap-2 overflow-hidden">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + idx * 0.05 }}
            className="flex items-start gap-2"
          >
            <span 
              className="text-xs mt-1 flex-shrink-0"
              style={{ color: colors.primary }}
            >
              •
            </span>
            <span 
              className="text-xs break-words"
              style={{ color: colors.neutral[600] }}
            >
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

function AssessmentIntro3() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [domainName, setDomainName] = useState<string | null>(null);
  const [domainLoading, setDomainLoading] = useState(true);
  const userId = useMemo(() => localStorage.getItem("userId"), []);
  const [domainError, setDomainError] = useState<string | null>(null);

  //============== GET API FOR FETCH THE DOMAIN==========
  useEffect(() => {
    const fetchDomain = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const res = await API(
          "GET",
          URL_PATH.getJobDomain,
          {},
          { "user-id": userId },
        );

        if (!Array.isArray(res) || res.length === 0) {
          throw new Error("No domain selected");
        }

        setDomainName(res[0].name);
        setDomainError(null);
      } catch (err) {
        console.error("Domain fetch failed", err);
        setDomainName(null);
        setDomainError(
          "Unable to load your selected domain. Please try again.",
        );
      } finally {
        setDomainLoading(false);
      }
    };

    fetchDomain();
  }, [userId, navigate]);

  //========= POST API FOR TO START THE ASSESSMENT ==============
  const handleBeginAssessment = async () => {
    if (loading) return;
    if (!userId) {
      console.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await API(
        "POST",
        URL_PATH.startAssessment,
        {},
        { "user-id": userId },
      );

      if (response?.attemptId) {
        navigate("/assessment", {
          state: {
            attemptId: response.attemptId,
            expiresAt: response.expiresAt,
          },
        });
        return;
      } else {
        console.error(response?.message || "Failed to start assessment");
      }
    } catch (err: any) {
      console.error(err?.message || "Failed to start assessment");
    } finally {
      setLoading(false);
    }
  };

  const knowledgeItems = [
    "Product lifecycle stages and trade-offs",
    "User-centric design and customer discovery",
    "Market sizing, competition, and positioning",
    "Metrics, KPIs, and outcome-based measurement",
    "Agile development and go-to-market fundamentals",
    "Stakeholder dynamics and business fundamentals",
  ];

  const decisionItems = [
    "Breaking down ambiguous problems",
    "Identifying and prioritizing user problems",
    "Making trade-offs between scope, speed, and impact",
    "Defining success metrics and evaluating outcomes",
    "Analyzing qualitative and quantitative inputs",
    "Prioritizing under real-world constraints",
    "Communicating and justifying decisions",
  ];

  const attributeItems = [
    "Structured and first-principles thinking",
    "Customer empathy and ownership",
    "Comfort with ambiguity",
    "Bias toward action and iteration",
    "Strategic judgment over short-term optimization",
    "Balancing data, intuition, and constraints",
    "Decision quality under uncertainty",
  ];

  return (
    <>
      <Navbar />
      <BackgroundGlass />
      
      {/* Animated Illustrations - Now contained within viewport */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingIllustration className="top-10 right-10" delay={0.2} />
        <FloatingIllustration className="bottom-10 left-10" delay={0.4} />
        
        {/* Additional floating elements - Now contained */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-20 right-20"
          style={{ maxWidth: '300px', maxHeight: '300px' }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-48 h-48 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          className="absolute top-20 left-20"
          style={{ maxWidth: '300px', maxHeight: '300px' }}
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              x: [0, 15, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="w-40 h-40 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.secondary}08 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
              style={{ color: colors.neutral[600] }}
            >
              <FeatherArrowLeft style={{ width: 20, height: 20, justifyContent:"center", }} />
            </button>
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="flex justify-center mb-4"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <FeatherBrain
                  style={{
                    color: colors.primary,
                    width: 40,
                    height: 40,
                    justifyContent:"center",
                  }}
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight mb-3 px-4"
              style={{ color: colors.accent }}
            >
              {domainLoading
                ? "Loading Assessment..."
                : `${domainName || "Product Management"} Skill Assessment`}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm max-w-2xl mx-auto px-4"
              style={{ color: colors.neutral[600] }}
            >
              This assessment evaluates your readiness for {domainName || "Product Management"} roles 
              through real-world scenarios. You'll be tested on three aspects —
            </motion.p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AssessmentCard
              title="Knowledge"
              icon={<FeatherBook className="w-5 h-5" />}
              items={knowledgeItems}
              delay={0.2}
            />
            <AssessmentCard
              title="Decision-Making Skills"
              icon={<FeatherTarget className="w-5 h-5" />}
              items={decisionItems}
              delay={0.3}
            />
            <AssessmentCard
              title="Attributes"
              icon={<FeatherCompass className="w-5 h-5" />}
              items={attributeItems}
              delay={0.4}
            />
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative group mb-8"
          >
            <div
              className="absolute inset-0 rounded-3xl transition-all duration-500"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(255, 255, 255, 0.3) inset",
              }}
            />

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-4 sm:px-6 py-4">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FeatherClock style={{ color: colors.primary }} className="w-5 h-5 flex-shrink-0" />
                <span 
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: colors.accent }}
                >
                  25 minutes
                </span>
              </motion.div>
              
              <div className="hidden sm:flex h-8 w-px" style={{ backgroundColor: colors.neutral[200] }} />
              
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FeatherCheckSquare style={{ color: colors.primary }} className="w-5 h-5 flex-shrink-0" />
                <span 
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: colors.accent }}
                >
                  20 scenario questions
                </span>
              </motion.div>
              
              <div className="hidden sm:flex h-8 w-px" style={{ backgroundColor: colors.neutral[200] }} />
              
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FeatherTrendingUp style={{ color: colors.primary }} className="w-5 h-5 flex-shrink-0" />
                <span 
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: colors.accent }}
                >
                  Counts toward your Skill Index
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-[320px]"
            >
              <button
                disabled={loading}
                onClick={handleBeginAssessment}
                className="group relative w-full h-14 rounded-full font-medium text-sm sm:text-base transition-all duration-300 overflow-hidden"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.75 : 1,
                }}
              >
                <div
                  className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
                  }}
                />

                <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <FeatherZap className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">Begin Skill Index Assessment</span>
                    </>
                  )}
                </div>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
              </button>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="text-sm transition-opacity hover:opacity-70 whitespace-nowrap"
              style={{ color: colors.neutral[400] }}
            >
              Skip for now
            </motion.button>
          </motion.div>
        </div>
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          overflow-x: hidden;
          width: 100%;
        }

        body {
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        #root {
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: ${colors.primary}4D;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.primary}80;
        }
      `}</style>
    </>
  );
}

export default AssessmentIntro3;