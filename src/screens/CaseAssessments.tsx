"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@subframe/core";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { useRef } from "react";
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";


/* ==================== TYPES ==================== */

type Difficulty = "Easy" | "Medium" | "Hard";

type BackendCase = {
  _id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  maxAttempts: number;
  isActive: boolean;
  createdAt: string;
  isSubmitted?: boolean; 
};

type CaseItem = {
  _id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  minutes: number;
  icon: React.ReactNode;
  isSubmitted?: boolean;
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
      style={{ backgroundColor: colors.primary }}
    >
      {label}
    </span>
  );
}

function StepCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-4 sm:px-6 py-4 sm:py-6 shadow-sm">
      <div className="flex w-full items-center gap-3">
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: colors.primary, color: colors.white }}
        >
          {icon}
        </div>
        <span className="text-heading-3 font-heading-3 text-default-font">
          {title}
        </span>
      </div>
      <p className="text-sm text-subtext-color">
        {desc}
      </p>
    </div>
  );
}

function CaseCard({
  item,
  onStart,
   loading
}: {
  item: CaseItem;
  onStart: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-4 sm:px-6 py-4 sm:py-6 shadow-sm">
      <div style={{color: colors.white}} className="flex justify-between w-full items-center gap-3 ">
        {item.icon}
        <DifficultyChip label={item.difficulty} />
      </div>
      
      <div className="flex flex-col items-start gap-2">
        <span className="text-heading-3 font-heading-3 text-default-font">
          {item.title}
        </span>
        <span className="text-sm text-subtext-color">
          {item.description}
        </span>
      </div>

      <div className="flex w-full items-center gap-4">
        <div className="flex items-center gap-2">
          <FeatherClock className="text-body font-body text-subtext-color" />
          <span className="text-sm text-subtext-color">{item.minutes} min</span>
        </div>
        <div className="h-4 w-px bg-neutral-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-default-font">+{item.points} points</span>
        </div>
      </div>

      {/* <Button
        variant="brand-primary"
        style={{ backgroundColor: colors.primary, color: "black" }}
        className="w-full rounded-2xl hover:opacity-90"
        onClick={() => onStart(item._id)}
        iconRight={<FeatherArrowRight className="ml-2 w-4 h-4" />}
      >
        Start Case Study
      </Button> */}
      {/* <Button
  variant="brand-primary"
  style={{ backgroundColor: colors.accent }}
  className="
    w-full rounded-2xl hover:opacity-90
    [&_span]:!text-white
    [&_svg]:!text-white
  "
  onClick={() => onStart(item._id)}
  iconRight={<FeatherArrowRight className="ml-2 w-4 h-4" />}
>
  Start Case Study
</Button> */}

    <Button
  variant="brand-primary"
  disabled={item.isSubmitted}
  style={{
    backgroundColor: item.isSubmitted ? "#D1D5DB" : colors.accent
  }}
  className="
    w-full rounded-2xl hover:opacity-90
    [&_span]:!text-white
    [&_svg]:!text-white
  "
  onClick={() => onStart(item._id)}
  iconRight={!item.isSubmitted && <FeatherArrowRight className="ml-2 w-4 h-4" />}
>
  {item.isSubmitted ? "Already Submitted" : "Start Case Study"}
</Button>



    </div>
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
  // const [startingCaseId, setStartingCaseId] = useState<string | null>(null);
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
      const res = await API("GET", URL_PATH.getAllCases, {
        page: 1,
        limit: 20
      });
      setCases(res?.data || []);
    } catch (err) {
      console.error("fetchCases failed:", err);
    } finally {
      setLoadingCases(false);
    }
  }, []);

  const onStart = async (caseId: string) => {
    if (startingCaseId) return;
    try {
      const res = await API("POST", URL_PATH.startCase(caseId), {});
      const { attemptId, opening } = res;
      navigate("/case-assessment-opening", {
        state: {
          caseId,
          attemptId,
          opening,
        },
      });
    } catch (err) {
      console.error("Start case failed:", err);
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
        description: c.description || "No description provided",
        difficulty,
        points: c.totalQuestions * 2,
        minutes: c.totalQuestions * 5,
        isSubmitted: c.isSubmitted,
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

  const avatarLetter = (student.name?.trim()?.[0] || "S").toUpperCase();

  /* ==================== UI ==================== */
  return (
    <div
    style={{
      background: `linear-gradient(
        to bottom,
        #d9d9d9 0%,
        #cfd3d6 25%,
        #9aa6b2 55%,
        #2E4056 100%
      )`,
      width: "100%",
    }}
    className="min-h-screen relative overflow-hidden">
      {/* Blended background - Covers entire page */}
      
      <div className="w-full relative" style={{ borderColor: colors.aqua }}>
          <Navbar />
        </div>

      {/* Header and content with z-index to stay above background */}
      <div className="relative z-10">
        {/* <HeaderLogo /> */}
        
        <div className="flex min-h-screen w-full justify-center px-4 sm:px-6 lg:px-8 py-0 sm:py-0">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 sm:gap-8 py-8">
            <Button
              variant="neutral-tertiary"
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />

            {/* Hero Section */}
            <div className="flex w-full flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-3">
                <span className="text-xl sm:text-2xl md:text-[30px] font-heading-1 text-default-font text-center">
                  Product Management Case Assessments
                </span>
                <span className="max-w-[90%] sm:max-w-[800px] text-sm font-body text-center">
                  Complete real-world product case studies to showcase your skills and boost your Hireability Index.
                  Each case you complete adds points to your profile, making you more visible to recruiters.
                </span>
              </div>
            </div>

            {/* Steps Cards */}
            <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6">
              <StepCard
                title="Complete the Case"
                desc="Work through realistic scenarios that mirror actual PM challenges."
                icon={<FeatherFileText className="w-5 h-5" />}
              />
              <StepCard
                title="Get Evaluated"
                desc="Receive a score on your approach and decision-making."
                icon={<FeatherTarget className="w-5 h-5" />}
              />
              <StepCard
                title="Boost Your Index"
                desc="Points are added to your profile and visible to recruiters."
                icon={<FeatherGlobe className="w-5 h-5" />}
              />
            </div>

            {/* Filter Section */}
            {/* <div className="flex w-full flex-wrap items-center gap-2">
              {(["All", "Easy", "Medium", "Hard"] as const).map((t) => {
                const active = filter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className="px-4 py-2 rounded-full text-sm font-medium border transition"
                    style={{
                      // borderColor: active ? colors.primary : colors.background,
                      backgroundColor: active ? colors.accent : "white",
                      color: active ? "white" : colors.background,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div> */}
            <div className="flex w-full flex-wrap items-center gap-2">
  {(["All", "Easy", "Medium", "Hard"] as const).map((t) => {
    const active = filter === t;

    return (
      <button
        key={t}
        onClick={() => setFilter(t)}
        className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
        style={{
          backgroundColor: active ? colors.accent : colors.primaryGlow,
          color: active ? "white" : "#444",
          borderColor: active ? colors.accent : "#E5E7EB", // light gray border
        }}
      >
        {t}
      </button>
    );
  })}
</div>

            {/* Cases Grid */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-default-font">
                  Available Case Assessments
                </h3>
                <span className="text-xs text-subtext-color flex items-center gap-2">
                  <FeatherMapPin className="w-4 h-4" /> Recommended for your domain
                </span>
              </div>

              <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((c) => (
                  <CaseCard key={c._id} item={c} onStart={onStart}  loading={startingCaseId === c._id} />
                ))}
              </div>

              {filteredCases.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-subtext-color">No case assessments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}