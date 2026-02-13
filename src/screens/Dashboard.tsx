"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import API, { URL_PATH, BASE_URL } from "src/common/API";
import { Avatar } from "../ui/components/Avatar";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Progress } from "../ui/components/Progress";
import { colors } from "../common/Colors";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderLogo from "../ui/components/HeaderLogo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/components/Card";

// import Chat from "../ui/components/chat/Chat";

import {
  FeatherArrowRight,
  FeatherAward,
  FeatherBook,
  FeatherBookOpen,
  FeatherBriefcase,
  FeatherCalendar,
  FeatherCheckCircle,
  FeatherClock,
  FeatherFileText,
  FeatherFolderOpen,
  FeatherGift,
  FeatherGlobe,
  FeatherLock,
  FeatherMap,
  FeatherMapPin,
  FeatherPlus,
  FeatherRepeat,
  FeatherTarget,
  FeatherTool,
  FeatherTrophy,
  FeatherUniversity,
  FeatherUser2,
  FeatherUsers,
  FeatherZap,
  FeatherSettings,
  FeatherLogOut,
} from "@subframe/core";
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";
// import HeaderLogo from "@/ui/components/HeaderLogo";

/* ==================== TYPES ==================== */

type UserProfile = {
  name: string;
  domain: string;
  location: string;
};

type WorkExperience = {
  jobTitle: string;
  companyName: string;
  startYear: number | null;
  endYear: number | null;
  duration: number | null;
  description: string;
  location: string;
  currentlyWorking: boolean;
};

type Education = {
  schoolName: string;
  degree: string;
  startYear: number | null;
  endYear: number | null;
  currentlyStudying?: boolean;
};

type Skill = {
  name: string;
};

type Certification = {
  name: string;
  issuedBy: string;
  issueYear: number | null;
};

type Project = {
  title: string;
  summary: string;
  endYear: number | null;
};

type RankItem = {
  rank: number | string;
  percentile: string;
};
type Hireability = {
  totalScore: number;
  weeklyChange: number;
  nextRankPoints: number;
  skill: {
    score: number;
    max: number;
  };
  experience: {
    score: number;
    max: number;
  };
};

/* ==================== CONSTANTS ==================== */

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

/* ==================== HELPERS ==================== */

const formatLocation = (city?: string, state?: string): string =>
  `${city || ""}, ${state || ""}`.trim().replace(/^,\s*|,\s*$/g, "");

/**
 * ✅ FIXED
 * Always returns STRING
 */
const calculatePercentile = (rank?: number): string => {
  if (!rank || rank <= 0) return "-";
  if (rank === 1) return "1";
  if (rank <= 5) return "5";
  if (rank <= 10) return "10";
  return "25";
};

/* ==================== MAIN COMPONENT ==================== */

export default function Dashboard() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  /* ==================== STATE ==================== */

  const [avatar, setAvatar] = useState<string>(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        // normalize stored URL if needed
        const raw = parsed?.profileUrl;
        if (raw) {
          try {
            const origin = BASE_URL.replace(/\/api\/?$/, "");
            if (/^https?:\/\//.test(raw)) return raw;
            if (raw.startsWith("/")) return origin + raw;
            return origin + "/" + raw;
          } catch (e) {
            return raw || DEFAULT_AVATAR;
          }
        }
        return DEFAULT_AVATAR;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_AVATAR;
  });
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );

  const [user, setUser] = useState<UserProfile>({
    name: "",
    domain: "",
    location: "",
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [rankData, setRankData] = useState<{
    global: RankItem;
    country: RankItem;
    state: RankItem;
    city: RankItem;
    university: RankItem;
  }>({
    global: { rank: "-", percentile: "-" },
    country: { rank: "-", percentile: "-" },
    state: { rank: "-", percentile: "-" },
    city: { rank: "-", percentile: "-" },
    university: { rank: "-", percentile: "-" },
  });

  const [hireability, setHireability] = useState<Hireability>({
    totalScore: 0,
    weeklyChange: 0,
    nextRankPoints: 0,
    skill: { score: 0, max: 0 },
    experience: { score: 0, max: 0 },
  });

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [recruiterVisibility, setRecruiterVisibility] = useState(0);

  const [chatUserId, setChatUserId] = useState("");
  const [testOtherUserId, setTestOtherUserId] = useState("");
  const [domain, setDomain] = useState("");
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);

  const openChat = () => {
    if (!chatUserId.trim()) return;
    navigate(`/chat/${chatUserId.trim()}`);
  };

  /* ==================== API CALLS ==================== */

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await API("GET", URL_PATH.calculateExperienceIndex);

      console.log("fetchDashboardData response:", res);
      if (!res) return;

      /* DEMOGRAPHICS */
      const demo = res?.data?.demographics?.[0];
      setUser({
        name: demo?.fullName || "",
        domain: "",
        location: formatLocation(demo?.city, demo?.state),
      });

      /* AVATAR */
      const profileFromServer = res?.documents?.profileUrl;
      let normalizedProfile: string | null = null;

      if (profileFromServer) {
        const origin = BASE_URL.replace(/\/api\/?$/, "");
        if (/^https?:\/\//.test(profileFromServer))
          normalizedProfile = profileFromServer;
        else if (profileFromServer.startsWith("/"))
          normalizedProfile = origin + profileFromServer;
        else normalizedProfile = origin + "/" + profileFromServer;
      }

      setAvatar(normalizedProfile || DEFAULT_AVATAR);

      // save in localStorage safely
      try {
        if (normalizedProfile) {
          const u = localStorage.getItem("user");
          const parsed = u ? JSON.parse(u) : {};
          parsed.profileUrl = normalizedProfile;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      } catch {}

      /* RANK */
      const rank = res?.rank;
      setRankData({
        global: {
          rank: rank?.globalRank ?? "-",
          percentile: calculatePercentile(rank?.globalRank),
        },
        country: {
          rank: rank?.countryRank ?? "-",
          percentile: calculatePercentile(rank?.countryRank),
        },
        state: {
          rank: rank?.stateRank ?? "-",
          percentile: calculatePercentile(rank?.stateRank),
        },
        city: {
          rank: rank?.cityRank ?? "-",
          percentile: calculatePercentile(rank?.cityRank),
        },
        university: {
          // ✅ FIX KEY (your response is universityRank, not universityrank)
          rank: rank?.universityRank ?? "-",
          percentile: calculatePercentile(rank?.universityRank),
        },
      });

      /* HIREABILITY */
      const hireabilityIndex = res?.hireabilityIndex;
      setHireability({
        totalScore: hireabilityIndex?.hireabilityIndex ?? 0,
        weeklyChange: 0,
        nextRankPoints:
          (hireabilityIndex?.experienceIndexTotal ?? 0) -
          (hireabilityIndex?.experienceIndexScore ?? 0),
        skill: {
          score: hireabilityIndex?.skillIndexScore ?? 0,
          max: hireabilityIndex?.skillIndexTotal ?? 0,
        },
        experience: {
          score: hireabilityIndex?.experienceIndexScore ?? 0,
          max: hireabilityIndex?.experienceIndexTotal ?? 0,
        },
      });

      /* LISTS */
      setWorkExperience(res?.data?.workExperience || []);
      setProjects(
        (res?.data?.projects || []).map((p: any) => ({
          title: p.projectName,
          summary: p.summary,
        })),
      );
      setCertifications(
        (res?.data?.certifications || []).map((c: any) => ({
          name: c.certificationName,
          issuedBy: c.issuer,
          issueYear: c.issueDate,
        })),
      );
      setEducation(res?.data?.education || []);
      setSkills((res?.skills?.list || []).map((s: string) => ({ name: s })));

      /* JOB DOMAIN */
      setDomain(res?.jobdomain || "");
    } catch (err: any) {
      console.error("fetchDashboardData FAILED:", err);
      console.error("message:", err?.message);
      console.error("response:", err?.response?.data);

      // fallback - avoid crash
      setAvatar(DEFAULT_AVATAR);
    }
  }, []);

  /* ==================== EFFECTS ==================== */
  useEffect(() => {
    const completed = localStorage.getItem("assessmentCompleted") === "true";
    setIsAssessmentCompleted(completed);
  }, []);

  useEffect(() => {
    fetchDashboardData(); // 👈 ONLY ONE CALL
  }, [fetchDashboardData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ==================== HANDLERS ==================== */
  const openMyChat = () => {
    const studentId = localStorage.getItem("userId");
    if (!studentId) {
      toast.error("User ID not found. Please login again.");
      return;
    }
    navigate(`/chat/${studentId}`);
  };

  // const handleNavigate = (path: string) => navigate(path);
  const handleNavigate = (path: string) => {
    navigate(path, {
      state: { source: "dashboard" },
    });
  };

  const handleAssessmentClick = () => {
    if (isAssessmentCompleted) {
      toast.success("Assessment already completed");
      return;
    }

    navigate("/assessment-intro", {
      state: { source: "dashboard" },
    });
  };

  // POST API for the profile
  const handleSaveProfile = async () => {
    if (!selectedAvatarFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedAvatarFile);

    try {
      setIsSavingAvatar(true);

      await API(
        "POST", // or "PUT" based on backend
        URL_PATH.uploadProfile, // "user/profile"
        formData,
        // ❌ DO NOT pass headers here
      );

      // Refresh profile image from server (dashboard includes documents.profileUrl)
      await fetchDashboardData();

      // Cleanup
      setSelectedAvatarFile(null);
    } catch (error) {
      console.error("Failed to save profile image", error);
      toast.error("Failed to save profile image");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("", e);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Cleanup old preview
    if (avatar && avatar.startsWith("blob:")) {
      URL.revokeObjectURL(avatar);
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    try {
      setIsSavingAvatar(true);

      // Upload to server
      const formData = new FormData();
      formData.append("avatar", file);

      await API("POST", URL_PATH.uploadProfile, formData);

      // Refresh from server (dashboard includes documents.profileUrl)
      await fetchDashboardData();

      // Revoke preview after successful upload
      setTimeout(() => {
        if (previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload profile picture");
      // Revert to old avatar if available
      // if (user?.avatarUrl) {
      //   setAvatar(user.avatarUrl);
      // }
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ==================== MEMOS ==================== */

  const skillProgress = useMemo(() => {
    return hireability.skill.max > 0
      ? (hireability.skill.score / hireability.skill.max) * 100
      : 0;
  }, [hireability.skill]);

  const experienceProgress = useMemo(() => {
    return hireability.experience.max > 0
      ? (hireability.experience.score / hireability.experience.max) * 100
      : 0;
  }, [hireability.experience]);

  const circleOffset = useMemo(() => {
    const CIRCUMFERENCE = 452.4;
    const MAX_SCORE = 1000;

    return CIRCUMFERENCE - (CIRCUMFERENCE * hireability.totalScore) / MAX_SCORE;
  }, [hireability.totalScore]);

  /* ==================== UI ==================== */

  return (
    // <DefaultPageLayout>
    <>
      <ToastContainer position="top-center" autoClose={3000} />
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
    fontFamily: "'Poppins', sans-serif",
  }}
        className="min-h-screen w-full relative"
        // style={{ backgroundColor: colors.white,  fontFamily: "'Inter', sans-serif" }}
      >

        {/* TOP WELCOME BANNER */}
        <div className="w-full relative" style={{ borderColor: colors.aqua }}>
          <Navbar />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* --- LEFT SIDEBAR --- */}
            <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">

              <Card
                className="flex w-full flex-col items-center gap-3 rounded-[2rem] shadow-sm text-center "
                style={{
                  backgroundColor: colors.white,
                  border: `1.5px solid ${colors.primaryGlow}`
                }}
                
              >
                <CardContent className="px-6 py-8 flex w-full flex-col items-center gap-3">
                  {/* Avatar Section */}
                  <div
                    className="relative cursor-pointer group mb-2"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Avatar
                      size="x-large"
                      image={avatar}
                      style={{ boxShadow: `0 0 0 4px ${colors.primaryGlow}` }}
                    >
                      PP
                    </Avatar>

                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="text-white text-xs font-bold uppercase">
                        Change
                      </span>
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  {/* User Info */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className="text-xl"
                        style={{ color: colors.accent }}
                      >
                        {user.name}
                      </span>
                    </div>

                    <p
                      className="text-sm "
                      style={{ color: colors.secondary }}
                    >
                      {user.domain}
                    </p>

                    <div
                      className="flex items-center justify-center gap-1 text-xs"
                      style={{ color: colors.neutral[400] }}
                    >
                      <span>{user.location}</span>
                    </div>
                  </div>

                  {/* Rank Section */}
                  <div className="mt-4 flex w-full justify-center">
                    <div
                      className="inline-flex items-center gap-3 rounded-2xl px-5 py-3 border shadow-sm"
                      style={{
                        backgroundColor: colors.background2,
                        color: colors.accent,
                      }}
                    >
                      {/* Icon bubble */}
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.white
                        }}
                      >
                        <FeatherTrophy className="w-5 h-5 ml-1" />
                      </div>

                      {/* Text */}
                      <div className="flex flex-col leading-none">
                        <span className="text-[13px] opacity-90">
                          Global Rank
                        </span>

                        <span className="text-[22px] font-extrabold mt-1">
                          #{rankData?.global?.rank ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="w-full rounded-[2rem] shadow-sm border"
                style={{
                  backgroundColor: colors.white,
                  color: colors.accent,
                  border: `1.5px solid ${colors.primaryGlow}`
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold">
                    Activity This Week
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  {[
                    {
                      label: "Case Studies",
                      pct: "45%",
                      color: colors.primary,
                      val: "3/5",
                    },
                    {
                      label: "Hackathons",
                      pct: "50%",
                      color: colors.primary,
                      val: "1/2",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span style={{ color: colors.accent }}>
                          {item.label}
                        </span>
                        <span style={{ color: colors.primary }}>
                          {item.val}
                        </span>
                      </div>

                      <div
                        className="h-1.5 w-full rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.background }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: item.pct,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div
                    className="mt-2 rounded-xl px-3 py-2 text-center text-[10px]"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.white,
                    }}
                  >
                    You're more active than 78% of peers
                  </div>
                </CardContent>
              </Card>
              <Card
                className="w-full rounded-[2rem] shadow-sm border"
                style={{ backgroundColor: colors.white, border: `1.5px solid ${colors.primaryGlow}` }}
              >
                <CardHeader className="pb-3 border-b">
                  <CardTitle
                    className="text-sm font-bold flex items-center gap-2"
                    style={{ color: colors.accent }}
                  >
                    <div className="w-9 h-9 rounded-full">
                      {/* <FeatherFileText
                        className="w-9 h-9 rounded-full pl-2.5"
                        style={{ color: colors.white, background: colors.primary }}
                      /> */}
                       <img
        src="/resume.png"   // change to your image name
        alt="Trophy"
        className="w-7 h-7 object-contain"
      />
                    </div>
                    
                    Professional Resume
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Experience */}
                  <div className="space-y-4">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: colors.accent }}
                    >
                      Experience
                    </p>

                    <div
                      className="space-y-4 border-l-2 ml-1"
                      style={{ borderColor: colors.accent }}
                    >
                      {workExperience?.slice(0, 2).map((exp, i) => (
                        <div key={i} className="pl-4 relative">
                          <div
                            className="absolute w-2 h-2 rounded-full -left-[5px] top-1 ring-2 ring-white"
                            style={{ backgroundColor: colors.accent }}
                          />

                          <h4
                            className="text-xs leading-tight"
                            style={{ color: colors.accent }}
                          >
                            {exp.jobTitle}
                          </h4>

                          <p
                            className="text-[10px]"
                            style={{ color: colors.accent }}
                          >
                            {exp.companyName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="space-y-3">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: colors.accent }}
                    >
                      Projects
                    </p>

                    {projects?.slice(0, 2).map((proj, i) => (
                      <div
                        key={i}
                        className="relative pl-4 pr-3 py-3 rounded-xl border transition hover:shadow-md"
                        style={{
                          backgroundColor: colors.background,
                        }}
                      >
                        <span
                          className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        />

                        <span
                          className="text-[9px] mb-1 inline-block"
                          style={{ color: colors.accent }}
                        >
                          Project {i + 1}
                        </span>

                        <h4
                          className="text-[12px] font-bold leading-tight truncate"
                          style={{ color: colors.primary }}
                        >
                          {proj.title}
                        </h4>

                        <p
                          className="text-[10px] mt-1 leading-snug line-clamp-2"
                          style={{ color: colors.secondary }}
                        >
                          {proj.summary}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="space-y-3">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: colors.accent }}
                    >
                      Certifications
                    </p>

                    {certifications?.slice(0, 2).map((cert, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl border shadow-sm"
                        style={{
                          backgroundColor: colors.background,
                        }}
                      >
                        <div className="mt-0.5">
                          <FeatherAward
                            className="w-4 h-4"
                            style={{ color: colors.accent }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[11px] truncate"
                            style={{ color: colors.primary }}
                          >
                            {cert.name}
                          </p>

                          <p
                            className="text-[9px] mt-0.5 truncate"
                            style={{ color: colors.secondary }}
                          >
                            Issued by {cert.issuedBy}
                          </p>
                        </div>

                        <p
                          className="text-[10px] whitespace-nowrap"
                          style={{ color: colors.primary }}
                        >
                          {cert.issueYear}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: colors.accent }}
                      >
                        Education
                      </p>

                      <div className="flex gap-1">
                        {certifications?.slice(0, 3).map((_, i) => (
                          <FeatherCheckCircle
                            key={i}
                            className="w-3 h-3 text-green-500"
                          />
                        ))}
                      </div>
                    </div>

                    {education?.map((edu, i) => (
                      <div key={i} className="text-[11px] space-y-0.5">
                        <p className="text-neutral-800 leading-tight">
                          {edu.schoolName}
                        </p>
                        <p className="text-neutral-500">{edu.degree}</p>
                        <p className="text-[10px] text-neutral-400 whitespace-nowrap">
                          {edu.startYear}
                          {edu.endYear ? ` – ${edu.endYear}` : " – Present"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: colors.accent }}
                    >
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {skills?.slice(0, 6).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 border rounded-md text-[9px] uppercase"
                          style={{
                            backgroundColor: colors.background,
                            // borderColor: colors.aqua,
                            color: colors.accent,
                          }}
                        >
                          {typeof skill === "string" ? skill : skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- CENTER DASHBOARD --- */}
            <div className="flex w-full flex-col gap-8 lg:max-w-[800px]">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    label: "Global Rank",
                    val: rankData.global,
                    pct: rankData.global.percentile,
                    icon: "/glob.png",
                    theme: colors.accent,
                  },
                  {
                    label: "California",
                    val: rankData.state,
                    pct: rankData.state.percentile,
                    icon: "/state.png",
                    theme: colors.secondary,
                  },
                  {
                    label: "San Francisco",
                    val: rankData.city,
                    pct: rankData.city.percentile,
                    icon: "/city.png",
                    theme: colors.primary,
                  },
                ].map((rank, i) => (
                  <Card
                    key={i}
                    className="rounded-3xl shadow-sm border"
                    style={{
                      backgroundColor: colors.white,
                      border: `1.5px solid ${colors.primaryGlow}`
                    }}
                  >
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      {/* <div
                        className="h-10 w-10 flex items-center justify-center rounded-full"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.white,
                        }}
                      >
                        {rank.icon}
                      </div> */}

                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-full"
                        // style={{
                        //   backgroundColor: colors.primary,
                        //   color: colors.white,
                        // }}
                      >
                        {typeof rank.icon === "string" ? (
                          <img
                            src={rank.icon}
                            alt={rank.label}
                            className="h-7 w-7 object-contain"
                          />
                        ) : (
                          rank.icon
                        )}
                      </div>

                      <span style={{color: "black"}} className="text-[10px] uppercase tracking-widest">
                        {rank.label}
                      </span>

                      <span
                        className="text-3xl font-black"
                        style={{ color: rank.theme }}
                      >
                        {rank.val.rank}
                      </span>

                      <Badge
                        className="border-none text-[10px]"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.accent,
                        }}
                      >
                        Top {rank.pct}%
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card
                className="w-full rounded-[2.5rem] shadow-xl overflow-hidden"
                style={{ backgroundColor: "white", color: colors.accent, border: `1.5px solid ${colors.primaryGlow}`   }}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Circular Progress */}
                    <div className="relative h-40 w-40 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="72"
                          stroke="rgba(0,0,0,0.08)"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="72"
                          stroke={colors.accent}
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray="452.4"
                          strokeDashoffset={
                            452.4 - 452.4 * (hireability.totalScore / 1000)
                          }
                          strokeLinecap="round"
                        />
                      </svg>

                      <div className="text-center">
                        <span
                          className="text-xl font-black"
                          style={{ color: colors.primary }}
                        >
                          {hireability.totalScore}
                        </span>

                        <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest">
                          Total Index
                        </p>
                      </div>
                    </div>

                    {/* Right Side Content */}
                    <div className="flex-1 space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-3">
                        <h3
                          className="text-lg sm:text-xl font-bold"
                          style={{ color: colors.accent }}
                        >
                          Hireability Index
                        </h3>

                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-green-600">
                            +{hireability?.weeklyChange ?? 0}
                          </span>

                          <span
                            className="text-xs"
                            style={{ color: colors.secondary }}
                          >
                            this week
                          </span>
                        </div>
                      </div>

                      {/* Skill + Experience Bars */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Skill */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-70">
                            <span>Skill Index</span>
                            <span>
                              {hireability.skill.score}/{hireability.skill.max}
                            </span>
                          </div>

                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${skillProgress}%`,
                                backgroundColor: colors.accent,
                              }}
                            />
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-70">
                            <span>Experience</span>
                            <span>
                              {hireability.experience.score}/
                              {hireability.experience.max}
                            </span>
                          </div>

                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${experienceProgress}%`,
                                backgroundColor: colors.background,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Button */}
                      <Button
                        className="border-none px-8 rounded-2xl h-12 transition-transform hover:scale-105"
                        style={{
                          backgroundColor: colors.secondary,
                          color: colors.white,
                        }}
                      >
                        Improve Score Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg sm:text-xl text-neutral-900">
                    Recommended Actions
                  </h3>

                  <span style={{background: colors.primaryGlow, color: colors.accent}} className="w-fit text-[10px] sm:text-xs px-3 py-1 rounded-full">
                    4 Actions Available
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
                  {/* ================= Assessment ================= */}
                  <Card style={{border: `1.5px solid ${colors.primaryGlow}`   }} className="border border-neutral-200 rounded-3xl sm:rounded-[2rem] shadow-sm bg-white transition-all">
                    <CardContent className="pt-2 pb-0 px-4 sm:pt-3 sm:pb-3 sm:px-3">
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div
                          // style={{ backgroundColor: colors.primary, color: colors.white }}
                          className=" rounded-2xl text-black"
                        >
                          {/* <FeatherFileText /> */}
                          <img
                          src="/assessment.png"   // change to your image name
                          alt="Trophy"
                          className="w-8 h-8 object-contain"
                        />
                        </div>

                        <Badge
                          style={{
                            backgroundColor: colors.aqua,
                            color: "black",
                          }}
                          className="border-none text-[10px] uppercase tracking-wider"
                        >
                          +50 Skill
                        </Badge>
                      </div>

                      <h4 className="text-base sm:text-lg mb-2">
                        Complete Assessment
                      </h4>

                      <p className="text-sm text-neutral-500 mb-4 sm:mb-6 leading-relaxed">
                        Begin evaluation and boost your credibility with
                        role-specific eval.
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] flex items-center gap-1">
                            <FeatherRepeat className="w-3 h-3" /> Paid retakes:
                            1
                          </span>
                          <span className="text-[10px] flex items-center gap-1">
                            <FeatherGift className="w-3 h-3" /> Free retakes: 1
                          </span>
                        </div>

                        {isAssessmentCompleted ? (
                          <Button
                            disabled
                            className="w-full sm:w-auto rounded-2xl bg-neutral-200 text-neutral-500 cursor-not-allowed border-none px-5 sm:px-6"
                          >
                            Completed
                          </Button>
                        ) : (
                          <Button
                            className="w-full sm:w-auto rounded-2xl px-5 sm:px-6"
                            style={{
                              backgroundColor: colors.secondary,
                              color: "white",
                            }}
                            onClick={handleAssessmentClick}
                          >
                            Start Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* ================= Case Studies ================= */}
                  <Card style={{border: `1.5px solid ${colors.primaryGlow}`}} className="border border-neutral-200 rounded-3xl sm:rounded-[2rem] shadow-sm bg-white transition-all">
                    <CardContent className="pt-2 pb-0 px-4 sm:pt-3 sm:pb-3 sm:px-3">
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div
                          style={{
                            // backgroundColor: colors.primary,
                            // color: colors.white,
                          }}
                          className="rounded-2xl"
                        >
                          {/* <FeatherBookOpen /> */}
                          <img
                          src="/book.png"   // change to your image name
                          alt="Trophy"
                          className="w-8 h-8 object-contain"
                        />
                        </div>

                        <Badge
                          style={{
                            backgroundColor: colors.aqua,
                            color: "black",
                          }}
                          className="border-none text-[10px] uppercase tracking-wider"
                        >
                          +40 Exp
                        </Badge>
                      </div>

                      <h4 className="text-base sm:text-lg mb-2">
                        Solve Case Studies
                      </h4>

                      <p className="text-sm text-neutral-500 mb-4 sm:mb-6 leading-relaxed">
                        Solving cases shows recruiters your effort to increase
                        your knowledge base.
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <FeatherClock className="w-3 h-3" /> 20 min
                        </span>

                        <Button
                          className="w-full sm:w-auto rounded-2xl px-5 sm:px-6"
                          style={{ backgroundColor: colors.secondary }}
                          onClick={() => handleNavigate("/case-assessments")}
                        >
                          Start Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ================= Hackathons ================= */}
                  <Card style={{border: `1.5px solid ${colors.primaryGlow}`, cursor: "not-allowed"}} className="bg-white border rounded-3xl sm:rounded-[2rem] shadow-sm opacity-80">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div className="p-3 bg-neutral-200 rounded-2xl text-neutral-500">
                          <FeatherUsers />
                        </div>

                        <Badge className="bg-gray-100 text-gray-600 border-none text-[10px] uppercase">
                          Coming Soon
                        </Badge>
                      </div>

                      <h4 className="text-base sm:text-lg mb-2 text-neutral-700">
                        Participate in Hackathons
                      </h4>

                      <p className="text-sm text-neutral-400 mb-4 sm:mb-6 leading-relaxed">
                        Collaborate and build visibility with other PMs in
                        upcoming events.
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <FeatherCalendar className="w-3 h-3" /> Starts in 5
                          days
                        </span>

                        <Button
                          disabled
                          className="w-full sm:w-auto rounded-2xl bg-neutral-200 text-neutral-500 cursor-not-allowed border-none px-5 sm:px-6"
                        >
                          Notify Me
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ================= Courses ================= */}
                  <Card style={{border: `1.5px solid ${colors.primaryGlow}`, cursor: "not-allowed"}} className="bg-white rounded-3xl sm:rounded-[2rem] shadow-sm opacity-80">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div className="p-3 bg-neutral-200 rounded-2xl text-neutral-500">
                          <FeatherBook />
                        </div>

                        <Badge className="bg-gray-100 text-gray-600 border-none text-[10px] uppercase">
                          Coming Soon
                        </Badge>
                      </div>

                      <h4 className="text-base sm:text-lg mb-2 text-neutral-700">
                        Courses
                      </h4>

                      <p className="text-sm text-neutral-400 mb-4 sm:mb-6 leading-relaxed">
                        Complete structured learning path to earn verified PM
                        badges.
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <FeatherClock className="w-3 h-3" /> 8 weeks
                        </span>

                        <Button
                          disabled
                          className="w-full sm:w-auto rounded-2xl bg-neutral-200 text-neutral-500 cursor-not-allowed border-none px-5 sm:px-6"
                        >
                          Notify Me
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* --- RIGHT SIDEBAR --- */}
            <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
              <Card style={{border: `1.5px solid ${colors.primaryGlow}`}} className="bg-white rounded-[2rem] border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-sm font-bold flex items-center gap-2"
                    style={{ color: colors.accent }}
                  >
                    {/* <FeatherTrophy
                      style={{backgroundColor: colors.primary, color: colors.white}}
                      className="w-8 h-8 rounded-full pl-2.5"
                    /> */}
                    <img
        src="/trophy.png"   // change to your image name
        alt="Trophy"
        className="w-7 h-7 object-contain"
      />
                    Top PMs at Stanford
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {[
                    {
                      rank: 1,
                      name: "Anjali Sharma",
                      score: 425,
                      theme: colors.accent,
                    },
                    {
                      rank: 2,
                      name: "Rahul Kumar",
                      score: 398,
                      theme: colors.secondary,
                    },
                    {
                      rank: 23,
                      name: "You",
                      score: 350,
                      theme: colors.primary,
                      isUser: true,
                    },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{
                        backgroundColor: p.isUser ? colors.aqua : colors.background,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                        style={{
                          backgroundColor: colors.white,
                          color: p.theme,
                        }}
                      >
                        #{p.rank}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs truncate"
                          style={{ color: p.theme }}
                        >
                          {p.name}
                        </p>
                        <p
                          className="text-[10px] opacity-60"
                          style={{ color: colors.accent }}
                        >
                          Score: {p.score}
                        </p>
                      </div>
                    </div>
                  ))}

                  <Button
                    className="w-full h-9 text-[11px] rounded-xl border-none"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.accent,
                    }}
                    onClick={() => handleNavigate("/leaderboard")}
                  >
                    Full Leaderboard
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="rounded-[2.5rem] shadow-lg text-center overflow-hidden"
                style={{ backgroundColor: colors.white, color: colors.accent, border: `1.5px solid ${colors.primaryGlow}`}}
              >
                <CardContent className="p-8">
                  <p className="text-xs font-black uppercase tracking-widest opacity-70">
                    Visibility Probability
                  </p>

                  <div className="text-6xl font-black my-4">
                    {recruiterVisibility}%
                  </div>

                  <div
                    className="p-3 rounded-2xl text-[10px] font-bold"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.white,
                    }}
                  >
                    Based on rankings and case studies solved.
                  </div>
                </CardContent>
              </Card>

              <Card style={{border: `1.5px solid ${colors.primaryGlow}`}}  className="bg-white rounded-[2rem] border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle
                    className="text-sm font-bold"
                    style={{ color: colors.accent }}
                  >
                    Profile Views
                  </CardTitle>

                  <Badge
                    className="border-none text-[10px]"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                    }}
                  >
                    15
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3">
                  {[
                    {
                      name: "Sarah Kim",
                      role: "Google",
                      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=64",
                    },
                    {
                      name: "Michael J.",
                      role: "Meta",
                      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64",
                    },
                  ].map((viewer, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Avatar
                        size="small"
                        image={viewer.img}
                        style={{ boxShadow: `0 0 0 2px ${colors.cream}` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs truncate"
                          style={{ color: colors.accent }}
                        >
                          {viewer.name}
                        </p>
                        <p
                          className="text-[10px] truncate opacity-60"
                          style={{ color: colors.accent }}
                        >
                          {viewer.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card style={{border: `1.5px solid ${colors.primaryGlow}`}}  className="rounded-3xl border bg-white overflow-hidden">
                <CardHeader>
                  <CardTitle
                    className="text-lg"
                    style={{ color: colors.accent }}
                  >
                    Update Your Profile
                  </CardTitle>
                  <p className="mt-1 text-xs" style={{ color: colors.accent }}>
                    Got new updates? Add them over here!
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  {[
                    {
                      label: "Experience",
                      sub: "Highlight your roles, responsibilities, and measurable impact",
                      icon: <FeatherPlus />,
                      path: "/experience",
                    },
                    {
                      label: "Projects",
                      sub: "Showcase your impactful projects and product outcomes",
                      icon: <FeatherFolderOpen />,
                      path: "/projects",
                    },
                    {
                      label: "Education",
                      sub: "Update your educational background and achievements",
                      icon: <FeatherUniversity />,
                      path: "/education",
                    },
                    {
                      label: "Certifications",
                      sub: "Add relevant certifications to validate your expertise",
                      icon: <FeatherTool />,
                      path: "/certifications",
                    },
                    {
                      label: "Awards",
                      sub: "Highlight awards, recognitions, or notable activities",
                      icon: <FeatherTool />,
                      path: "/awards",
                    },
                    {
                      label: "Skills",
                      sub: "List your product management and technical skills",
                      icon: <FeatherTool />,
                      path: "/skills",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border bg-white px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: colors.secondary,
                            color: colors.white,
                          }}
                        >
                          {item.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm"
                            style={{ color: colors.accent }}
                          >
                            {item.label}
                          </p>
                          <p
                            className="mt-1 text-xs leading-4"
                            style={{ color: colors.secondary }}
                          >
                            {item.sub}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleNavigate(item.path)}
                        className="mt-4 w-full rounded-2xl py-3 text-sm"
                        style={{
                          backgroundColor: colors.secondary,
                          color: "#fff",
                        }}
                      >
                        + Add {item.label}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
    // </DefaultPageLayout>
  );
}
