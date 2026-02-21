"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API, { URL_PATH, BASE_URL } from "src/common/API";
import { colors } from "../common/Colors";
import { Button } from "../ui/components/Button";
import { Avatar } from "../ui/components/Avatar";
import {
  FeatherArrowLeft,
  FeatherArrowRight,
  FeatherClock,
  FeatherFileText,
  FeatherGlobe,
  FeatherMapPin,
  FeatherTarget,
  FeatherCheckCircle,
} from "@subframe/core";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { useRef } from "react";
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";

// ============================================
// ENHANCED BACKGROUND GLASS LAYER
// ============================================
const BackgroundGlass: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none">
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

/* ==================== TYPES ==================== */

type Difficulty = "Easy" | "Medium" | "Hard";

type AttemptInfo = {
  totalAttempts: number;
  completedAttempts: number;
  remainingAttempts: number;
  maxAttemptsReached: boolean;
  hasActiveAttempt: boolean;
  activeAttemptId: string | null;
  isSubmitted: boolean;
};


type BackendCase = {
  _id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  maxAttempts: number;
  isActive: boolean;
  createdAt: string;
  // isSubmitted?: boolean; 
    attemptInfo: AttemptInfo; // New field

};
type CaseItem = {
  _id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  minutes: number;
  totalQuestions: number; // Add this
  icon: React.ReactNode;
  isSubmitted?: boolean;
  attemptInfo?: AttemptInfo;
};

type StudentProfile = {
  name: string;
  email: string;
  location: string;
  avatar: string;
};

/* ==================== CONSTANTS ==================== */

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

/* ==================== HELPERS ==================== */

const formatLocation = (city?: string, state?: string): string =>
  `${city || ""}, ${state || ""}`.trim().replace(/^,\s*|,\s*$/g, "");

const normalizeAvatarUrl = (raw?: string): string => {
  if (!raw) return DEFAULT_AVATAR;
  const origin = BASE_URL.replace(/\/api\/?$/, "");
  if (/^https?:\/\//.test(raw)) return raw;
  if (raw.startsWith("/")) return origin + raw;
  return origin + "/" + raw;
};

const difficultyBadge = (d: Difficulty) => {
  if (d === "Easy") return { bg: colors.primary + "20", text: colors.primary };
  if (d === "Medium") return { bg: colors.secondary + "20", text: colors.secondary };
  return { bg: colors.accent + "20", text: colors.accent };
};

function DifficultyChip({ label }: { label: Difficulty }) {
  const s = difficultyBadge(label);
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
      style={{ 
        backgroundColor: s.bg,
        color: s.text 
      }}
    >
      {label}
    </span>
  );
}

function StepCard({
  title,
  desc,
  icon,
  delay = 0,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
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
      
      <div className="relative z-10 flex flex-col items-start gap-4 px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex w-full items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
              border: `1px solid ${colors.primary}30`,
              color: colors.primary 
            }}
          >
            {icon}
          </div>
          <span 
            className="text-lg font-medium"
            style={{ color: colors.accent }}
          >
            {title}
          </span>
        </div>
        <p 
          className="text-sm"
          style={{ color: colors.neutral[600] }}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function CaseCard({
  item,
  onStart,
  loading,
  delay = 0,
}: {
  item: CaseItem;
  onStart: (id: string) => void;
  loading: boolean;
  delay?: number;
}) {
  const isDisabled = item.attemptInfo?.maxAttemptsReached || item.isSubmitted || loading;
  
  const buttonText = () => {
    if (loading) return "Starting...";
    if (item.attemptInfo?.maxAttemptsReached) return "Max Attempts Reached";
    if (item.attemptInfo?.hasActiveAttempt) return "Resume Attempt";
    if (item.isSubmitted) return "Already Submitted";
    return "Start Case Study";
  };

  // Generate a dynamic description based on case data if none exists
  const displayDescription = item.description || 
    `Test your product management skills with this ${item.difficulty.toLowerCase()} difficulty case study featuring ${item.totalQuestions} questions.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
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
      
      <div className="relative z-10 flex flex-col items-start gap-4 px-4 sm:px-6 py-4 sm:py-6">
        {/* Header with difficulty and status */}
        <div className="flex justify-between w-full items-center">
          <DifficultyChip label={item.difficulty} />
          {item.attemptInfo?.maxAttemptsReached ? (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
              Max Attempts ({item.attemptInfo.totalAttempts}/{item.attemptInfo.totalAttempts})
            </span>
          ) : item.isSubmitted ? (
            <div className="flex items-center gap-1">
              <FeatherCheckCircle 
                style={{ color: colors.primary }} 
                className="w-4 h-4"
              />
              <span className="text-xs text-green-600 font-medium">Completed</span>
            </div>
          ) : item.attemptInfo?.hasActiveAttempt ? (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600 font-medium">
              In Progress
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
              New
            </span>
          )}
        </div>
        
        {/* Case Title */}
        <div className="flex flex-col items-start gap-2 w-full">
          <span 
            className="text-xl font-semibold"
            style={{ color: colors.accent }}
          >
            {item.title}
          </span>
          
          {/* Description */}
          <span 
            className="text-sm line-clamp-2"
            style={{ color: colors.neutral[600] }}
          >
            {displayDescription}
          </span>
        </div>

        {/* Case Stats */}
        <div className="flex w-full items-center gap-4 mt-1">
          <div className="flex items-center gap-2">
            <FeatherClock 
              style={{ color: colors.neutral[400] }} 
              className="w-4 h-4" 
            />
            <span 
              className="text-sm"
              style={{ color: colors.neutral[600] }}
            >
              {item.minutes} min
            </span>
          </div>
          
          <div className="h-4 w-px" style={{ backgroundColor: colors.neutral[200] }} />
          
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-semibold"
              style={{ color: colors.primary }}
            >
              +{item.points} points
            </span>
          </div>

          <div className="h-4 w-px" style={{ backgroundColor: colors.neutral[200] }} />
          
          <div className="flex items-center gap-2">
            <span 
              className="text-sm"
              style={{ color: colors.neutral[500] }}
            >
              {item.totalQuestions} questions
            </span>
          </div>
        </div>

        {/* Attempt Info */}
        {item.attemptInfo && (
          <div className="flex items-center gap-3 mt-1 text-xs w-full">
            <div className="flex items-center gap-1">
              <span style={{ color: colors.neutral[500] }}>Attempts:</span>
              <span className="font-medium" style={{ color: colors.accent }}>
                {item.attemptInfo.completedAttempts}/{item.attemptInfo.totalAttempts}
              </span>
            </div>
            <div className="h-3 w-px" style={{ backgroundColor: colors.neutral[200] }} />
            <div className="flex items-center gap-1">
              <span style={{ color: colors.neutral[500] }}>Remaining:</span>
              <span className="font-medium" style={{ color: colors.primary }}>
                {item.attemptInfo.remainingAttempts}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={isDisabled}
          onClick={() => onStart(item._id)}
          className="group relative w-full h-12 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden mt-3"
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.75 : 1,
          }}
        >
          <div
            className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
            }}
          />

          <div className="relative z-10 flex items-center justify-center gap-2 text-white">
            {buttonText()}
            {!isDisabled && (
              <FeatherArrowRight 
                style={{
                  width: 18,
                  height: 18,
                  transition: "transform 0.3s ease",
                }}
                className="group-hover:translate-x-1"
              />
            )}
          </div>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "rgba(255,255,255,0.1)",
            }}
          />
        </button>
      </div>
    </motion.div>
  );
}
/* ==================== MAIN COMPONENT ==================== */

export default function CaseAssessmentsPage() {
  const navigate = useNavigate();

  /* ==================== STATE ==================== */
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Difficulty>("All");
  const [cases, setCases] = useState<BackendCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [student, setStudent] = useState<StudentProfile>({
    name: "",
    email: "",
    location: "",
    avatar: DEFAULT_AVATAR,
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const isStartingRef = useRef(false);
  const [startingCaseId, setStartingCaseId] = useState<string | null>(null);

  /* ==================== API CALLS ==================== */
  const fetchStudentProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const res = await API("GET", URL_PATH.calculateExperienceIndex);
      const demo = res?.data?.demographics?.[0];
      const avatarFromServer = res?.documents?.profileUrl;

      setStudent({
        name: demo?.fullName || "",
        email: demo?.email || "",
        location: formatLocation(demo?.city, demo?.state),
        avatar: normalizeAvatarUrl(avatarFromServer),
      });
    } catch (err) {
      console.log("fetchStudentProfile failed:", err);
      setStudent((p) => ({ ...p, avatar: DEFAULT_AVATAR }));
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const fetchCases = useCallback(async () => {
    try {
      setLoadingCases(true);
      const res = await API("GET", URL_PATH.getAllCases);
      console.log("Cases Response:", res);
      if (Array.isArray(res)) {
        setCases(res);
      } else {
        setCases([]);
      }
    } catch (err: any) {
      console.error("fetchCases failed:", err);
    } finally {
      setLoadingCases(false);
    }
  }, []);

 const onStart = async (caseId: string) => {
  if (startingCaseId) return;

  // Find the case to check if max attempts reached
  const selectedCase = cases.find(c => c._id === caseId);
  
  if (selectedCase?.attemptInfo?.maxAttemptsReached) {
    alert(`You have reached the maximum number of attempts (${selectedCase.maxAttempts}) for this case.`);
    return;
  }

  try {
    setStartingCaseId(caseId);
    const startRes = await API("POST", URL_PATH.startCase(caseId));
    console.log("Start Response:", startRes);
    
    // If there's an active attempt, you might want to resume it
    if (selectedCase?.attemptInfo?.hasActiveAttempt) {
      const confirmResume = window.confirm(
        "You have an incomplete attempt. Do you want to resume it?"
      );
      
      if (confirmResume) {
        navigate("/case-assessment-questions", {
          state: {
            caseId,
            attemptId: selectedCase.attemptInfo.activeAttemptId,
          }
        });
        return;
      }
    }
    
    const openingRes = await API("GET", URL_PATH.getOpening(caseId));
    console.log("Opening Response:", openingRes);

    navigate("/case-assessment-opening", {
      state: {
        caseId,
        attemptId: startRes.attemptId,
        attemptNumber: startRes.attemptNumber,
        opening: openingRes
      }
    });
  } catch (err: any) {
    console.error("Start case failed:", err);
    // This error might not happen now since we check on frontend
    if (err?.response?.data?.message === "Maximum attempts reached") {
      alert("You have already used all attempts for this case.");
    }
  } finally {
    setStartingCaseId(null);
  }
};
  /* ==================== EFFECTS ==================== */
  useEffect(() => {
    fetchStudentProfile();
    fetchCases();
  }, [fetchStudentProfile, fetchCases]);

const mappedCases: CaseItem[] = useMemo(() => {
  return cases.map((c) => {
    let difficulty: Difficulty = "Easy";
    if (c.totalQuestions > 10 && c.totalQuestions <= 20) difficulty = "Medium";
    if (c.totalQuestions > 20) difficulty = "Hard";

    return {
      _id: c._id,
      title: c.title,
      description: c.description || `${c.title} - A comprehensive case study to test your product management skills.`, // Better fallback
      difficulty,
      points: c.totalQuestions * 2,
      minutes: c.totalQuestions * 5,
      totalQuestions: c.totalQuestions, // Add this
      isSubmitted: c.attemptInfo?.completedAttempts > 0 || false,
      attemptInfo: c.attemptInfo,
      icon: (
        <div
          className="h-10 w-10 rounded-2xl grid place-items-center"
          style={{ backgroundColor: colors.primary, color: colors.white }}
        >
          ⌁
        </div>
      ),
    };
  });
}, [cases]);
  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mappedCases.filter((c) => {
      const okFilter = filter === "All" ? true : c.difficulty === filter;
      const okQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q);
      return okFilter && okQuery;
    });
  }, [mappedCases, query, filter]);

  /* ==================== UI ==================== */
  return (
    <>
      <Navbar />
      <BackgroundGlass />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
              <FeatherArrowLeft style={{ width: 20, height: 20 }} />
            </button>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <FeatherFileText
                  style={{
                    color: colors.primary,
                    width: 32,
                    height: 32,
                    justifyContent:"center",
                  }}
                />
              </div>
            </div>

            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight mb-3"
              style={{ color: colors.accent }}
            >
              Product Management Case Assessments
            </h1>

            <p
              className="text-sm max-w-2xl mx-auto"
              style={{ color: colors.neutral[600] }}
            >
              Complete real-world product case studies to showcase your skills and boost your Hireability Index.
              Each case you complete adds points to your profile, making you more visible to recruiters.
            </p>
          </motion.div>

          {/* Steps Cards */}
          <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StepCard
              title="Complete the Case"
              desc="Work through realistic scenarios that mirror actual PM challenges."
              icon={<FeatherFileText className="w-5 h-5"  />}
              delay={0.2}
            />
            <StepCard
              title="Get Evaluated"
              desc="Receive a score on your approach and decision-making."
              icon={<FeatherTarget className="w-5 h-5" />}
              delay={0.3}
            />
            <StepCard
              title="Boost Your Index"
              desc="Points are added to your profile and visible to recruiters."
              icon={<FeatherGlobe className="w-5 h-5" />}
              delay={0.4}
            />
          </div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex w-full flex-wrap items-center gap-2 mb-8"
          >
            {(["All", "Easy", "Medium", "Hard"] as const).map((t, index) => {
              const active = filter === t;
              return (
                <motion.button
                  key={t}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => setFilter(t)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: active ? colors.primary : "rgba(255, 255, 255, 0.8)",
                    color: active ? "white" : colors.neutral[600],
                    border: `1px solid ${active ? colors.primary : colors.neutral[200]}`,
                    backdropFilter: active ? "none" : "blur(8px)",
                  }}
                >
                  {t}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Cases Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-lg sm:text-xl font-light"
                style={{ color: colors.accent }}
              >
                Available Case Assessments
              </h3>
              <span 
                className="text-xs flex items-center gap-2"
                style={{ color: colors.neutral[400] }}
              >
                <FeatherMapPin className="w-4 h-4" /> Recommended for your domain
              </span>
            </div>

            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((c, index) => (
                <CaseCard 
                  key={c._id} 
                  item={c} 
                  onStart={onStart}  
                  loading={startingCaseId === c._id}
                  delay={0.7 + index * 0.1}
                />
              ))}
            </div>

            {filteredCases.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center py-12"
              >
                <p style={{ color: colors.neutral[400] }}>No case assessments found.</p>
              </motion.div>
            )}
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