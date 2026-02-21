"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { 
  FeatherArrowRight, 
  FeatherAward, 
  FeatherBookOpen, 
  FeatherCalendar, 
  FeatherClock, 
  FeatherGlobe, 
  FeatherMap, 
  FeatherMapPin, 
  FeatherShield, 
  FeatherTarget, 
  FeatherUsers, 
  FeatherArrowLeft,
  FeatherStar,
  FeatherTrophy,
  FeatherZap
} from "@subframe/core";
import { useNavigate, useLocation } from "react-router-dom";
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
  onClick?: () => void;
}> = ({ children, className = "", delay = 0, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`relative group cursor-pointer ${className}`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Main glass layer */}
    <div
      className="absolute inset-0 rounded-3xl transition-all duration-500 group-hover:shadow-xl"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(255, 255, 255, 0.3) inset",
      }}
    />

    {/* Hover glow effect */}
    <div
      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${colors.primary}40, transparent 70%)`,
      }}
    />

    {/* Content */}
    <div className="relative z-10">{children}</div>
  </motion.div>
);

// ============================================
// ANIMATED ILLUSTRATION COMPONENTS
// ============================================
const FloatingOrbs: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Top right orb */}
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.4, scale: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute -top-20 -right-20 w-64 h-64"
    >
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
    </motion.div>

    {/* Bottom left orb */}
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.4, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      className="absolute -bottom-20 -left-20 w-72 h-72"
    >
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          x: [0, 20, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
    </motion.div>

    {/* Center right orb */}
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.3, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.6 }}
      className="absolute top-1/2 right-20 w-48 h-48"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 15, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.accent}15 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
    </motion.div>

    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: i * 0.1 }}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          background: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          filter: "blur(1px)",
        }}
      >
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
          className="w-full h-full"
        />
      </motion.div>
    ))}
  </div>
);

// ============================================
// CONFETTI COMPONENT
// ============================================
const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: -20,
            rotate: 0,
            scale: 0
          }}
          animate={{ 
            y: '120vh',
            rotate: Math.random() * 720,
            scale: 1
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            background: `hsl(${Math.random() * 360}, 80%, 60%)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
          }}
        />
      ))}
    </div>
  );
};

type RankItem = {
  rank: number | string;
};

type Violation = {
  type: "COPY" | "PASTE" | "TAB_SWITCH";
  at: string;
};

type IntegrityReport = {
  attemptId: string;
  integrityScore: number;
  integrityLevel: string;
  cheatAlertSent: boolean;
  totalViolations: number;
  level: string;
  violationBreakdown: {
    COPY: number;
    PASTE: number;
    TAB_SWITCH: number;
  };
  violationTimeline: Violation[];
};

function AssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isResultLoading, setIsResultLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [scoreAnimating, setScoreAnimating] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const [result, setResult] = useState<{
    skillIndex: number;
    maxSkillIndex: number;
  } | null>(null);

  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number | null>(null);
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = sessionStorage.getItem("userId");

  const [rankData, setRankData] = useState<{
    global: RankItem;
    country: RankItem;
    state: RankItem;
    city: RankItem;
    university: RankItem;
  }>({
    global: { rank: "-" },
    country: { rank: "-" },
    state: { rank: "-" },
    city: { rank: "-" },
    university: { rank: "-" },
  });

  // Trigger celebration animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebration(true);

      // Remove after animation
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Animate score on load
  useEffect(() => {
    if (result?.skillIndex) {
      setScoreAnimating(true);
      let start = 0;
      const end = result.skillIndex;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedScore(end);
          setScoreAnimating(false);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [result?.skillIndex]);

  const fetchResult = useCallback(async () => {
    const attemptId =
      location.state?.attemptId ||
      localStorage.getItem("attemptId") ||
      sessionStorage.getItem("attemptId");

    if (!attemptId) {
      setIsResultLoading(false);
      return;
    }

    const localSubmitted = sessionStorage.getItem(`submittedAt-${attemptId}`);
    if (localSubmitted) {
      setSubmittedAt(new Date(Number(localSubmitted)).toISOString());
    }

    const localStart = sessionStorage.getItem(`startedAt-${attemptId}`);
    if (localStart && localSubmitted) {
      const diff = Math.max(
        0,
        Math.floor((Number(localSubmitted) - Number(localStart)) / 1000),
      );
      setTimeTakenSeconds(diff);
    }

    try {
      const res = await API("GET", `${URL_PATH.result}?attemptId=${attemptId}`);

      console.log("FINAL RESPONSE:", res);

      if (res?.integrity) {
        setReport({
          attemptId: res?.attempt?._id || "",
          integrityScore: res.integrity.score,
          integrityLevel: res.integrity.level,
          cheatAlertSent: res.integrity.cheatAlertSent,
          totalViolations: res.integrity.totalViolations,
          level: res.integrity.level,
          violationBreakdown: {
            COPY: 0,
            PASTE: 0,
            TAB_SWITCH: 0,
          },
          violationTimeline: [],
        });
      }

      setResult({
        skillIndex: res?.hireabilityIndex?.skillIndexScore ?? 0,
        maxSkillIndex: res?.hireabilityIndex?.skillIndexTotal ?? 0,
      });

      const submitted: string | null =
        res?.attempt?.submittedAt ||
        res?.submittedAt ||
        res?.attempt?.endedAt ||
        null;

      if (submitted) {
        setSubmittedAt(submitted);
      } else {
        const localSubmitted = sessionStorage.getItem(
          `submittedAt-${attemptId}`,
        );
        if (localSubmitted) {
          setSubmittedAt(new Date(Number(localSubmitted)).toISOString());
        }
      }

      const takenSeconds: number | null =
        res?.attempt?.timeTakenSeconds ??
        res?.timeTakenSeconds ??
        res?.attempt?.durationSeconds ??
        null;

      if (typeof takenSeconds === "number") {
        setTimeTakenSeconds(takenSeconds);
      } else {
        const start = sessionStorage.getItem(`startedAt-${attemptId}`);
        const end = sessionStorage.getItem(`submittedAt-${attemptId}`);
        if (start && end) {
          const diff = Math.max(
            0,
            Math.floor((Number(end) - Number(start)) / 1000),
          );
          setTimeTakenSeconds(diff);
        }
      }
    } catch (error) {
      console.error("Failed to fetch result", error);
      setResult(null);
    } finally {
      setIsResultLoading(false);
    }
  }, [location.state?.attemptId]);

  const fetchRanks = useCallback(async () => {
    try {
      const res = await API("GET", URL_PATH.calculateExperienceIndex);

      console.log("fetchRanks response:", res);
      if (!res) return;

      const rank = res?.rank ?? {};

      setRankData({
        global: { rank: rank?.globalRank ?? "-" },
        country: { rank: rank?.countryRank ?? "-" },
        state: { rank: rank?.stateRank ?? "-" },
        city: { rank: rank?.cityRank ?? "-" },
        university: {
          rank: rank?.universityRank ?? rank?.universityrank ?? "-",
        },
      });
    } catch (err) {
      console.error("fetchRanks failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchResult();
    fetchRanks();
  }, [fetchResult, fetchRanks, navigate]);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "--";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (seconds?: number | null) => {
    if (typeof seconds !== "number" || seconds < 0) return "--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} min ${s} sec`;
  };

  const formattedSubmittedDate = formatDate(submittedAt);
  const formattedTimeTaken = formatDuration(timeTakenSeconds);

  const getIntegrityColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "excellent":
        return "#10b981";
      case "good":
        return "#3b82f6";
      case "fair":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (isResultLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <BackgroundGlass />
        <FloatingOrbs />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-sm"
          >
            Loading...
          </motion.span>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <BackgroundGlass />
      <FloatingOrbs />
      <Confetti show={showCelebration} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
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
              <FeatherArrowLeft style={{ width: 20, height: 20 }} />
            </button>
          </motion.div>

          {/* Header with celebration animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <motion.h1 
                  className="text-3xl font-light tracking-tight"
                  style={{ color: colors.accent }}
                >
                  Assessment Results
                </motion.h1>
                {showCelebration && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl"
                  >
                    🎉
                  </motion.span>
                )}
              </div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm flex items-center gap-2"
                style={{ color: colors.neutral[600] }}
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
                Product Management · Skill Index
              </motion.span>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="relative px-4 py-2 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${colors.primary}30`,
                  }}
                />
                <span
                  className="relative z-10 text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <FeatherTrophy className="w-4 h-4" />
                  Top Performer
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Score Card */}
          <GlassCard delay={0.2}>
            <div className="p-6 sm:p-8 md:p-10">
              {/* Score with animation */}
              <motion.div 
                className="flex flex-col items-center gap-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <div className="flex items-end gap-2">
                  <motion.span
                    style={{ color: colors.primary }}
                    className={`text-5xl sm:text-6xl md:text-7xl font-light transition-all duration-300 ${
                      scoreAnimating ? "scale-110" : ""
                    }`}
                  >
                    {animatedScore || result?.skillIndex || "--"}
                  </motion.span>
                  <span className="text-xl sm:text-2xl font-light" style={{ color: colors.neutral[400] }}>
                    / {result?.maxSkillIndex || "--"}
                  </span>
                </div>

                {/* Achievement badges */}
                <motion.div 
                  className="flex gap-3 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                      border: `1px solid ${colors.primary}30`,
                      color: colors.primary,
                    }}
                  >
                    ⭐ Top 15%
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.secondary}05)`,
                      border: `1px solid ${colors.secondary}30`,
                      color: colors.secondary,
                    }}
                  >
                    🎯 Excellent
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Performance Tier */}
              <motion.div 
                className="mt-8 flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center">
                  <span className="text-xs uppercase tracking-widest" style={{ color: colors.neutral[400] }}>
                    Performance Tier
                  </span>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="text-lg font-medium mt-1"
                    style={{ color: colors.primary }}
                  >
                    Elite Performer
                  </motion.div>
                </div>

                {/* Animated tier progress */}
                <div className="flex w-full items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
                  {[
                    { name: "Development", percent: 40, color: "gray" },
                    { name: "Competent", percent: 25, color: "gray" },
                    {
                      name: "You are here",
                      percent: 15,
                      color: "primary",
                      active: true,
                    },
                    { name: "Advanced", percent: 10, color: "primary" },
                    { name: "Master", percent: 10, color: "gray" },
                  ].map((tier, index) => (
                    <React.Fragment key={tier.name}>
                      <motion.div 
                        className="flex flex-col items-center gap-2 shrink-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div
                          className={`relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full`}
                          style={{
                            background: tier.active 
                              ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                              : tier.color === "primary"
                                ? `linear-gradient(135deg, ${colors.primary}40, ${colors.primary}20)`
                                : `linear-gradient(135deg, ${colors.neutral[400]}, ${colors.neutral[200]})`,
                          }}
                        >
                          <span className="text-xs font-medium text-white">
                            {tier.percent}%
                          </span>
                          {tier.active && (
                            <>
                              <motion.div
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)`,
                                }}
                              />
                            </>
                          )}
                        </div>
                        <span 
                          className={`text-[10px] sm:text-xs whitespace-nowrap ${tier.active ? 'font-medium' : ''}`}
                          style={{ color: tier.active ? colors.primary : colors.neutral[400] }}
                        >
                          {tier.name}
                        </span>
                      </motion.div>
                      {index < 4 && (
                        <motion.div 
                          className="hidden sm:block h-0.5 w-4 sm:w-8 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          style={{
                            background: index === 2 
                              ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                              : colors.neutral[200],
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Info Bar */}
                <motion.div 
                  className="mt-4 w-full max-w-md mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div
                    className="relative px-4 py-2 rounded-full text-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}10, ${colors.primary}05)`,
                      border: `1px solid ${colors.primary}20`,
                    }}
                  >
                    <motion.span 
                      className="text-xs sm:text-sm"
                      style={{ color: colors.primary }}
                    >
                      ✨ Just 3 points away from Top 10%! Keep going!
                    </motion.span>
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${colors.primary}10, transparent)`,
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </GlassCard>

          {/* Metrics Cards */}
          <GlassCard delay={0.3}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8">
                {[
                  {
                    icon: FeatherCalendar,
                    label: "Completed",
                    value: formattedSubmittedDate,
                    color: colors.primary,
                  },
                  {
                    icon: FeatherClock,
                    label: "Time Taken",
                    value: formattedTimeTaken,
                    color: colors.secondary,
                  },
                  {
                    icon: FeatherShield,
                    label: "Integrity Score",
                    value: report ? report.integrityLevel : "—",
                    color: getIntegrityColor(report?.integrityLevel || ""),
                  },
                ].map((item, index) => (
                  <React.Fragment key={item.label}>
                    <motion.div 
                      className="flex items-center gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`,
                          border: `1px solid ${item.color}30`,
                        }}
                      >
                        <item.icon style={{ color: item.color }} className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium" style={{ color: colors.accent }}>
                          {item.value}
                        </span>
                        <span className="text-xs" style={{ color: colors.neutral[400] }}>
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                    {index < 2 && (
                      <motion.div 
                        className="hidden sm:block h-8 w-px"
                        initial={{ height: 0 }}
                        animate={{ height: 32 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        style={{ backgroundColor: colors.neutral[200] }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Ranking Cards */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {[
              {
                icon: FeatherMapPin,
                title: "City Ranking",
                value: rankData.city.rank,
                delay: 0.4,
              },
              {
                icon: FeatherMap,
                title: "Country Ranking",
                value: rankData.country.rank,
                delay: 0.5,
              },
              {
                icon: FeatherGlobe,
                title: "Global Ranking",
                value: rankData.global.rank,
                delay: 0.6,
              },
            ].map((item) => (
              <GlassCard key={item.title} delay={item.delay}>
                <div className="p-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex justify-center mb-3"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                        border: `1px solid ${colors.primary}30`,
                      }}
                    >
                      <item.icon style={{ color: colors.primary }} className="w-5 h-5" />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-2xl font-light mb-1"
                    style={{ color: colors.primary }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: item.delay + 0.2, type: "spring" }}
                  >
                    {item.value !== "-" ? `#${item.value}` : "--"}
                  </motion.div>
                  
                  <span className="text-xs uppercase tracking-widest" style={{ color: colors.neutral[400] }}>
                    {item.title}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Dashboard Button */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7 }}
  className="flex justify-center mt-8"
>
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
<button
  onClick={() => navigate("/dashboard")}
  className="group relative flex h-[50px] w-40 items-center justify-center overflow-hidden rounded-full shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-orange-600 before:duration-500 before:ease-out hover:shadow-orange-600 hover:before:h-56 hover:before:w-56 mx-4"
  style={{
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
  }}
>
  <div className="relative z-10 flex items-center justify-center gap-2 text-white">
    <span>Go to Dashboard</span>
    <FeatherArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
  </div>
</button>
  </motion.div>
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

export default AssessmentResult;