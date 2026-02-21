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
  FeatherUser,
} from "@subframe/core";
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";
import { Eye } from "lucide-react";
import { clearUserData } from "src/utils/authUtils";

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

type DomainRank = {
  domainId: string;
  domainName: string;
  subDomainName?: string;
  skills: string[];
  score: number;
  domainRank: number | null;
  domainCohortRank: number | null;
};

type ExperienceInfo = {
  years: number;
  cohort: string;
};

/* ==================== CONSTANTS ==================== */

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

/* ==================== HELPERS ==================== */

const formatLocation = (city?: string, state?: string): string =>
  `${city || ""}, ${state || ""}`.trim().replace(/^,\s*|,\s*$/g, "");

/* ==================== RESPONSIVE CIRCLE HOOK ==================== */
function useCircleSize() {
  const [size, setSize] = useState(72);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setSize(56);
      else if (w < 1024) setSize(64);
      else setSize(72);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

/* ==================== COMPONENTS ==================== */

const DomainRankingsCard = ({
  domains,
  primaryDomain,
}: {
  domains: DomainRank[];
  primaryDomain: any;
}) => {
  if (!domains || domains.length === 0) return null;

  return (
    <Card
      style={{ border: `1.5px solid ${colors.primaryGlow}` }}
      className="bg-white rounded-2xl lg:rounded-[2rem] border shadow-sm"
    >
      <CardHeader>
        <CardTitle
          className="text-sm font-bold flex items-center gap-2"
          style={{ color: colors.accent }}
        >
          <FeatherTarget className="w-4 h-4" />
          Domain Rankings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {domains.map((domain, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-semibold"
                  style={{
                    color:
                      domain.domainId === primaryDomain?.id
                        ? colors.primary
                        : colors.accent,
                  }}
                >
                  {domain.domainName}
                  {domain.domainId === primaryDomain?.id && " (Primary)"}
                </span>
                {domain.subDomainName && (
                  <Badge
                    className="text-[8px]"
                    style={{ backgroundColor: colors.background }}
                  >
                    {domain.subDomainName}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold"
                  style={{ color: colors.primary }}
                >
                  #{domain.domainRank || "-"}
                </span>
                <span className="text-[8px] text-neutral-400">
                  (Cohort: #{domain.domainCohortRank || "-"})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {domain.skills?.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-neutral-100 rounded-full text-[8px]"
                  style={{ color: colors.accent }}
                >
                  {skill}
                </span>
              ))}
              {domain.skills?.length > 3 && (
                <span className="text-[8px] text-neutral-400">
                  +{domain.skills.length - 3} more
                </span>
              )}
            </div>

            {domain.score > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-[8px]">
                  <span>Domain Score</span>
                  <span>{domain.score}</span>
                </div>
                <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((domain.score / 100) * 100, 100)}%`,
                      backgroundColor:
                        domain.domainId === primaryDomain?.id
                          ? colors.primary
                          : colors.secondary,
                    }}
                  />
                </div>
              </div>
            )}

            {idx < domains.length - 1 && (
              <hr className="my-3 border-neutral-100" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

/* ==================== MAIN COMPONENT ==================== */

export default function Dashboard() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  /* ==================== STATE ==================== */

  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);

  const [user, setUser] = useState<UserProfile>({
    name: "",
    domain: "",
    location: "",
  });
  const [totalCounts, setTotalCounts] = useState({
    global: 0,
    country: 0,
    state: 0,
    city: 0,
    university: 0,
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userCity, setUserCity] = useState("");
  const [userState, setUserState] = useState("");
  const [userUniversityName, setUserUniversityName] = useState("");

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

  const [domains, setDomains] = useState<DomainRank[]>([]);
  const [primaryDomain, setPrimaryDomain] = useState<any>(null);
  const [experienceInfo, setExperienceInfo] = useState<ExperienceInfo>({
    years: 0,
    cohort: "0-1",
  });

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [recruiterVisibility, setRecruiterVisibility] = useState(0);
  const [chatUserId, setChatUserId] = useState("");
  const [testOtherUserId, setTestOtherUserId] = useState("");
  const [domain, setDomain] = useState("");
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);

  const [universityLeaderboard, setUniversityLeaderboard] = useState<any[]>([]);
  const universityName =
    userUniversityName || education?.[0]?.schoolName || "Your University";

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [weeklyActivity, setWeeklyActivity] = useState({
    caseStudies: { val: "0/0", pct: "0%" },
    hackathons: { val: "0/0", pct: "0%" },
  });

  // Reactive circle radius via hook (fixes SSR/resize bug)
  const circleRadius = useCircleSize();
  const circleCenter = circleRadius + 8;
  const circleViewBox = circleCenter * 2;
  const CIRCUMFERENCE = 2 * Math.PI * circleRadius;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setCurrentUserId(parsed?._id || null);
      if (parsed?.profileUrl) {
        const origin = BASE_URL.replace(/\/api\/?$/, "");
        let normalizedProfile = parsed.profileUrl;
        if (/^https?:\/\//.test(parsed.profileUrl)) {
          normalizedProfile = parsed.profileUrl;
        } else if (parsed.profileUrl.startsWith("/")) {
          normalizedProfile = origin + parsed.profileUrl;
        } else {
          normalizedProfile = origin + "/" + parsed.profileUrl;
        }
        setAvatar(normalizedProfile);
      }
    }
  }, []);

  const openChat = () => {
    if (!chatUserId.trim()) return;
    navigate(`/chat/${chatUserId.trim()}`);
  };

  const calculatePercentile = (
    rank: number | undefined,
    total: number,
  ): string => {
    if (!rank || rank <= 0 || !total || total <= 0) return "-";
    const percentile = ((total - rank) / total) * 100;
    return Math.round(percentile).toString();
  };

  /* ==================== API CALLS ==================== */
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await API("GET", URL_PATH.calculateExperienceIndex);

      if (!res) {
        console.warn("No response from API");
        return;
      }

      const demo = res?.data?.demographics?.[0];

      setUser({
        name: demo?.fullName || "",
        domain: res?.jobdomain?.domain || "",
        location: formatLocation(demo?.city, demo?.state),
      });

      setUserCity(demo?.city || "City");
      setUserState(demo?.state || "State");

      const profileFromServer = res?.documents?.profileUrl;
      if (profileFromServer) {
        const origin = BASE_URL.replace(/\/api\/?$/, "");
        let normalizedProfile = profileFromServer;
        if (/^https?:\/\//.test(profileFromServer)) {
          normalizedProfile = profileFromServer;
        } else if (profileFromServer.startsWith("/")) {
          normalizedProfile = origin + profileFromServer;
        } else {
          normalizedProfile = origin + "/" + profileFromServer;
        }
        setAvatar(normalizedProfile);
        try {
          const u = localStorage.getItem("user");
          const parsed = u ? JSON.parse(u) : {};
          parsed.profileUrl = normalizedProfile;
          localStorage.setItem("user", JSON.stringify(parsed));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }

      const rank = res?.rank;
      const totals = res?.totalCounts || {};
      setTotalCounts(totals);

      const newRankData = {
        global: {
          rank: rank?.globalRank ?? "-",
          percentile: calculatePercentile(rank?.globalRank, totals.global),
        },
        country: {
          rank: rank?.countryRank ?? "-",
          percentile: calculatePercentile(rank?.countryRank, totals.country),
        },
        state: {
          rank: rank?.stateRank ?? "-",
          percentile: calculatePercentile(rank?.stateRank, totals.state),
        },
        city: {
          rank: rank?.cityRank ?? "-",
          percentile: calculatePercentile(rank?.cityRank, totals.city),
        },
        university: {
          rank: rank?.universityRank ?? "-",
          percentile: calculatePercentile(rank?.universityRank, totals.university),
        },
      };
      setRankData(newRankData);

      if (res?.domains) setDomains(res.domains);
      if (res?.primaryDomain) setPrimaryDomain(res.primaryDomain);
      if (res?.experience) setExperienceInfo(res.experience);

      const hireabilityIndex = res?.hireabilityIndex;
      const newHireability = {
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
      };
      setHireability(newHireability);

      setWorkExperience(res?.data?.workExperience || []);

      const mappedProjects = (res?.data?.projects || []).map((p: any) => ({
        title: p.projectName,
        summary: p.summary,
      }));
      setProjects(mappedProjects);

      const mappedCertifications = (res?.data?.certifications || []).map(
        (c: any) => ({
          name: c.certificationName,
          issuedBy: c.issuer,
          issueYear: c.issueDate,
        }),
      );
      setCertifications(mappedCertifications);

      const educationList = res?.data?.education || [];
      setEducation(educationList);

      const skillsList = (res?.skills?.list || []).map((s: string) => ({
        name: s,
      }));
      setSkills(skillsList);

      const jobDomain = res?.jobdomain?.domain || "Professional";
      setDomain(jobDomain);

      const userUniversity = educationList?.[0]?.schoolName;
      if (userUniversity) {
        setUserUniversityName(userUniversity);
        try {
          const leaderboardRes = await API(
            "GET",
            `${URL_PATH.getStudentsBySchool}?schoolName=${encodeURIComponent(userUniversity)}`,
          );
          const students = leaderboardRes?.data || [];
          setUniversityLeaderboard(students);
        } catch (error) {
          console.error("University leaderboard fetch failed:", error);
        }
      }

      const demoId = demo?.id || demo?._id;
      if (demoId) {
        try {
          const caseStudyRes = await API(
            "GET",
            URL_PATH.getWeeklyCaseAttempts(demoId),
          );
          const weeklyAttempts = caseStudyRes?.totalAttempts ?? 0;
          const totalCaseStudies = 5;
          const pct = Math.round((weeklyAttempts / totalCaseStudies) * 100);
          setWeeklyActivity({
            caseStudies: {
              val: `${weeklyAttempts}/${totalCaseStudies}`,
              pct: `${pct}%`,
            },
            hackathons: { val: `1/2`, pct: `50%` },
          });
        } catch (error) {
          console.error("Weekly case study fetch failed:", error);
        }
      }
    } catch (err: any) {
      console.error("fetchDashboardData FAILED:", err);
      setAvatar(DEFAULT_AVATAR);
    }
  }, []);

  /* ==================== EFFECTS ==================== */
  useEffect(() => {
    const completed = localStorage.getItem("assessmentCompleted") === "true";
    setIsAssessmentCompleted(completed);
  }, []);

  useEffect(() => {
    fetchDashboardData();
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

  const handleNavigate = (path: string) => {
    navigate(path, { state: { source: "dashboard" } });
  };

  const handleAssessmentClick = () => {
    if (isAssessmentCompleted) {
      toast.success("Assessment already completed");
      return;
    }
    navigate("/assessment-intro", { state: { source: "dashboard" } });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image (JPEG, PNG, or WebP)");
      return;
    }
    if (avatar && avatar.startsWith("blob:")) {
      URL.revokeObjectURL(avatar);
    }
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
    try {
      setIsSavingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);
      await API("POST", URL_PATH.uploadProfile, formData);
      await fetchDashboardData();
      window.dispatchEvent(new Event("avatar-updated"));
      setTimeout(() => {
        if (previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleLogout = () => {
    clearUserData();
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
    const MAX_SCORE = 1000;
    return CIRCUMFERENCE - (CIRCUMFERENCE * hireability.totalScore) / MAX_SCORE;
  }, [hireability.totalScore, CIRCUMFERENCE]);

  /* ==================== UI ==================== */
  return (
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
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        className="min-h-screen w-full relative"
      >
        {/* NAVBAR */}
        <div
          className="w-full relative flex-shrink-0"
          style={{ borderColor: colors.aqua }}
        >
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-grow w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 mt-4 sm:mt-6 lg:mt-10 mb-4 sm:mb-6 lg:mb-10">
          {/*
            Layout:
            - Mobile/Tablet (<lg): Single column stack
            - Desktop (lg+): Three columns [left sidebar | center | right sidebar]
          */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start">

            {/* ============ LEFT SIDEBAR ============ */}
            <div className="w-full lg:w-72 xl:w-80 lg:flex-none flex flex-col gap-4 sm:gap-6">
              <Card
                className="w-full rounded-2xl lg:rounded-[2rem] shadow-sm"
                style={{
                  backgroundColor: colors.white,
                  border: `1.5px solid ${colors.primaryGlow}`,
                }}
              >
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  {/* Avatar + User Info */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div
                      className="relative cursor-pointer group flex-shrink-0"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Avatar
                        size="x-large"
                        image={avatar}
                        style={{ boxShadow: `0 0 0 4px ${colors.primaryGlow}` }}
                        className="rounded-xl w-14 h-14 sm:w-16 sm:h-16"
                      >
                        PP
                      </Avatar>
                      <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <span className="text-white text-[10px] font-bold uppercase">
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

                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-base sm:text-lg font-semibold truncate"
                        style={{ color: colors.accent }}
                      >
                        {user.name}
                      </h2>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span
                          className="text-xs truncate"
                          style={{ color: colors.secondary }}
                        >
                          {user.domain}
                        </span>
                        <span
                          className="text-[10px] truncate"
                          style={{ color: colors.neutral[400] }}
                        >
                          {user.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resume Content */}
                  <div className="space-y-4 sm:space-y-5 mb-4 sm:mb-5">
                    {/* Experience */}
                    <div className="space-y-2">
                      <p
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: colors.accent }}
                      >
                        Experience
                      </p>
                      <div
                        className="space-y-3 border-l-2 ml-1"
                        style={{ borderColor: colors.accent }}
                      >
                        {workExperience?.slice(0, 2).map((exp, i) => (
                          <div key={i} className="pl-3 relative">
                            <div
                              className="absolute w-2 h-2 rounded-full -left-[5px] top-1 ring-2 ring-white"
                              style={{ backgroundColor: colors.accent }}
                            />
                            <h4
                              className="text-xs leading-tight truncate"
                              style={{ color: colors.accent }}
                            >
                              {exp.jobTitle}
                            </h4>
                            <p
                              className="text-[9px] truncate"
                              style={{ color: colors.accent }}
                            >
                              {exp.companyName}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="space-y-2">
                      <p
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: colors.accent }}
                      >
                        Projects
                      </p>
                      {projects?.slice(0, 2).map((proj, i) => (
                        <div
                          key={i}
                          className="relative pl-3 pr-2 py-2 rounded-xl border transition hover:shadow-md"
                          style={{ backgroundColor: colors.background }}
                        >
                          <span
                            className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
                            style={{ backgroundColor: colors.accent }}
                          />
                          <span
                            className="text-[8px] mb-0.5 inline-block"
                            style={{ color: colors.accent }}
                          >
                            Project {i + 1}
                          </span>
                          <h4
                            className="text-[11px] font-bold leading-tight truncate"
                            style={{ color: colors.primary }}
                          >
                            {proj.title}
                          </h4>
                          <p
                            className="text-[9px] mt-0.5 leading-snug line-clamp-2"
                            style={{ color: colors.secondary }}
                          >
                            {proj.summary}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div className="space-y-2">
                      <p
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: colors.accent }}
                      >
                        Certifications
                      </p>
                      {certifications?.slice(0, 2).map((cert, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2 rounded-xl border shadow-sm"
                          style={{ backgroundColor: colors.background }}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            <FeatherAward
                              className="w-3 h-3"
                              style={{ color: colors.accent }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[10px] truncate"
                              style={{ color: colors.primary }}
                            >
                              {cert.name}
                            </p>
                            <p
                              className="text-[8px] mt-0.5 truncate"
                              style={{ color: colors.secondary }}
                            >
                              Issued by {cert.issuedBy}
                            </p>
                          </div>
                          <p
                            className="text-[9px] whitespace-nowrap flex-shrink-0"
                            style={{ color: colors.primary }}
                          >
                            {cert.issueYear}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <p
                          className="text-[9px] font-black uppercase tracking-widest"
                          style={{ color: colors.accent }}
                        >
                          Education
                        </p>
                        <div className="flex gap-1">
                          {certifications?.slice(0, 3).map((_, i) => (
                            <FeatherCheckCircle
                              key={i}
                              className="w-2.5 h-2.5 text-green-500"
                            />
                          ))}
                        </div>
                      </div>
                      {education?.map((edu, i) => (
                        <div key={i} className="text-[10px] space-y-0.5">
                          <p className="text-neutral-800 leading-tight truncate">
                            {edu.schoolName}
                          </p>
                          <p className="text-neutral-500 truncate">{edu.degree}</p>
                          <p className="text-[9px] text-neutral-400">
                            {edu.startYear}
                            {edu.endYear ? ` – ${edu.endYear}` : " – Present"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="space-y-1.5">
                      <p
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: colors.accent }}
                      >
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {skills?.slice(0, 6).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 border rounded-md text-[8px] uppercase"
                            style={{
                              backgroundColor: colors.background,
                              color: colors.accent,
                            }}
                          >
                            {typeof skill === "string" ? skill : skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button
                    onClick={() => navigate("/profile")}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full text-sm py-2"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* ============ CENTER DASHBOARD ============ */}
            <div className="w-full flex flex-col gap-4 sm:gap-6 lg:flex-1 min-w-0">

              {/*
                RANK CARDS:
                - Mobile/Tablet: 2 columns (2×2 grid)
                - Large screens (lg+): 4 columns (single row)
              */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  {
                    label: "Global Rank",
                    val: rankData.global,
                    icon: "/glob.png",
                    theme: colors.accent,
                  },
                  {
                    label: userState || "State",
                    val: rankData.state,
                    icon: "/state.png",
                    theme: colors.secondary,
                  },
                  {
                    label: userCity || "City",
                    val: rankData.city,
                    icon: "/city.png",
                    theme: colors.primary,
                  },
                  {
                    label: userUniversityName || "University",
                    val: rankData.university,
                    icon: "/university.svg",
                    theme: colors.accent,
                  },
                ].map((rank, i) => (
                  <Card
                    key={i}
                    className="rounded-2xl sm:rounded-3xl shadow-sm border"
                    style={{
                      backgroundColor: colors.white,
                      border: `1.5px solid ${colors.primaryGlow}`,
                    }}
                  >
                    <CardContent className="flex flex-col items-center gap-1 sm:gap-2 p-3 lg:p-3 text-center">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full">
                        <img
                          src={rank.icon}
                          alt={rank.label}
                          className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                        />
                      </div>

                      <Badge
                        className="border-none text-[7px] sm:text-[9px] whitespace-nowrap"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.accent,
                        }}
                      >
                        {rank.val.percentile !== "-"
                          ? `Top ${rank.val.percentile}%`
                          : "Top -%"}
                      </Badge>

                      <span
                        style={{ color: "black" }}
                        className="text-[7px] sm:text-[9px] uppercase tracking-widest truncate max-w-full px-0.5 text-center"
                      >
                        {rank.label}
                      </span>

                      <span
                        className="text-xl sm:text-2xl lg:text-2xl font-black"
                        style={{ color: rank.theme }}
                      >
                        {rank.val.rank}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hireability Index Card */}
              <Card
                className="w-full rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden"
                style={{
                  backgroundColor: "white",
                  color: colors.accent,
                  border: `1.5px solid ${colors.primaryGlow}`,
                }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    {/* Circular Progress — reactive via hook */}
                    <div
                      className="relative flex items-center justify-center flex-shrink-0"
                      style={{ width: circleViewBox, height: circleViewBox }}
                    >
                      <svg
                        width={circleViewBox}
                        height={circleViewBox}
                        className="transform -rotate-90"
                      >
                        <circle
                          cx={circleCenter}
                          cy={circleCenter}
                          r={circleRadius}
                          stroke="rgba(0,0,0,0.08)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx={circleCenter}
                          cy={circleCenter}
                          r={circleRadius}
                          stroke={colors.accent}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={CIRCUMFERENCE}
                          strokeDashoffset={circleOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span
                          className="text-base sm:text-lg font-black"
                          style={{ color: colors.primary }}
                        >
                          {hireability.totalScore}
                        </span>
                        <p className="text-[8px] uppercase opacity-60 font-bold tracking-widest leading-tight">
                          Total Index
                        </p>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <h3
                          className="text-base sm:text-lg font-bold"
                          style={{ color: colors.accent }}
                        >
                          Hireability Index
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-green-600">
                            +{hireability?.weeklyChange ?? 0}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: colors.secondary }}
                          >
                            this week
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-70">
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
                                backgroundColor: colors.primary,
                              }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-70">
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
                                backgroundColor: colors.primary,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="neutral-primary"
                        className="text-black border-none px-5 sm:px-6 rounded-xl h-10 text-sm transition-transform hover:scale-105 w-full sm:w-auto"
                        style={{
                          backgroundColor: colors.background2,
                          color: "#000000",
                        }}
                      >
                        Improve Score Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment + Case Studies Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Card
                  style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                  className="border rounded-2xl sm:rounded-3xl shadow-sm bg-white"
                >
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base mb-1 sm:mb-2">
                      Complete Assessment
                    </h4>
                    <p className="text-xs text-neutral-500 mb-3 sm:mb-4 leading-relaxed">
                      Begin evaluation and boost your credibility with
                      role-specific eval.
                    </p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <FeatherClock className="w-3 h-3" /> 20 min
                      </span>
                      {isAssessmentCompleted ? (
                        <Button
                          disabled
                          className="rounded-xl bg-neutral-200 text-neutral-500 cursor-not-allowed border-none px-4 text-xs"
                        >
                          Completed
                        </Button>
                      ) : (
                        <Button
                          className="rounded-xl px-4 text-xs"
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

                <Card
                  style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                  className="border rounded-2xl sm:rounded-3xl shadow-sm bg-white"
                >
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base mb-1 sm:mb-2">
                      Solve Case Studies
                    </h4>
                    <p className="text-xs text-neutral-500 mb-3 sm:mb-4 leading-relaxed">
                      Solving cases shows recruiters your effort to increase
                      your knowledge base.
                    </p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <FeatherClock className="w-3 h-3" /> 20 min
                      </span>
                      <Button
                        className="rounded-xl px-4 text-xs"
                        style={{ backgroundColor: colors.secondary, color: "white" }}
                        onClick={() => handleNavigate("/case-assessments")}
                      >
                        Start Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ============ RIGHT SIDEBAR ============ */}
            <div className="w-full lg:w-72 xl:w-80 lg:flex-none flex flex-col gap-4 sm:gap-6">

              {/* Domain Rankings */}
              <DomainRankingsCard
                domains={domains}
                primaryDomain={primaryDomain}
              />

              {/* University Leaderboard */}
              <Card
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="bg-white rounded-2xl lg:rounded-[2rem] border shadow-sm"
              >
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle
                    className="text-sm font-bold flex flex-col items-start gap-1"
                    style={{ color: colors.accent }}
                  >
                    <div className="flex gap-2 w-full">
                      <div className="flex-shrink-0">
                        <img
                          src="/trophy.png"
                          alt="Trophy"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate" style={{ color: colors.accent }}>
                          Top PMs at {universityName}
                        </span>
                        <span className="text-[10px] font-normal opacity-70">
                          Full Leaderboard
                        </span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  {universityLeaderboard?.length === 0 ? (
                    <p className="text-xs">No students found</p>
                  ) : (
                    universityLeaderboard
                      .filter((p: any) => p.userId)
                      .slice(0, 5)
                      .map((p: any, index: number) => {
                        const isUser = p.userId?._id === currentUserId;
                        const fullName = `${p.userId?.firstname || ""} ${
                          p.userId?.lastname || ""
                        }`.trim();

                        return (
                          <div
                            key={p._id}
                            className="flex items-center gap-2 p-2 rounded-xl"
                            style={{
                              backgroundColor: isUser
                                ? colors.aqua
                                : colors.background,
                            }}
                          >
                            <div
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-[8px] font-black flex-shrink-0"
                              style={{
                                backgroundColor: colors.white,
                                color: isUser ? colors.primary : colors.accent,
                              }}
                            >
                              #{index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[11px] truncate font-semibold"
                                style={{
                                  color: isUser ? colors.primary : colors.accent,
                                }}
                              >
                                {fullName || p.userId?.email}{" "}
                                {isUser && "(You)"}
                              </p>
                              <p
                                className="text-[9px] opacity-60 truncate"
                                style={{ color: colors.accent }}
                              >
                                Score: {p.educationScore}
                              </p>
                            </div>
                          </div>
                        );
                      })
                  )}
                </CardContent>
              </Card>

              {/* Profile Views */}
              <Card
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="bg-white rounded-2xl lg:rounded-[2rem] border shadow-sm"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
                  <CardTitle
                    className="text-sm font-bold"
                    style={{ color: colors.accent }}
                  >
                    Profile Views
                  </CardTitle>
                  <Badge
                    className="border-none text-[8px]"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                    }}
                  >
                    0
                  </Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-4 sm:py-6">
                  <p
                    className="text-[11px] opacity-60"
                    style={{ color: colors.accent }}
                  >
                    No profile views yet
                  </p>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card
                className="w-full rounded-2xl lg:rounded-[2rem] shadow-sm border"
                style={{
                  backgroundColor: colors.white,
                  color: colors.accent,
                  border: `1.5px solid ${colors.primaryGlow}`,
                }}
              >
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-sm font-bold">
                    Activity This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {[
                    {
                      label: "Case Studies",
                      ...weeklyActivity.caseStudies,
                      color: colors.primary,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span style={{ color: colors.accent }}>{item.label}</span>
                        <span style={{ color: colors.primary }}>{item.val}</span>
                      </div>
                      <div
                        className="h-1.5 w-full rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.background }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: item.pct, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    className="mt-1 rounded-lg px-2 py-1.5 text-center text-[9px]"
                    style={{
                      backgroundColor: colors.background2,
                      color: "black",
                    }}
                  >
                    You're more active than 78% of peers
                  </div>
                </CardContent>
              </Card>

              {/* Recruiter Messages */}
              <Card
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="bg-white rounded-2xl lg:rounded-[2rem] border shadow-sm overflow-hidden"
              >
                <CardContent className="p-4 sm:p-5">
                  <h3
                    className="text-base font-semibold mb-3"
                    style={{ color: colors.accent }}
                  >
                    Recruiter Messages
                  </h3>
                  <div className="space-y-2 w-full">
                    <div
                      className="flex items-start gap-2 p-2 sm:p-3 rounded-xl text-left"
                      style={{ backgroundColor: `${colors.primary}08` }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <span className="text-white text-[10px]">R</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: colors.accent }}
                        >
                          Sarah Johnson
                        </p>
                        <p
                          className="text-[10px] truncate"
                          style={{ color: colors.secondary }}
                        >
                          Interested in your profile for a Product Manager...
                        </p>
                        <p
                          className="text-[8px] mt-0.5"
                          style={{ color: colors.neutral[400] }}
                        >
                          2 hours ago
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-2 p-2 sm:p-3 rounded-xl text-left"
                      style={{ backgroundColor: `${colors.primary}08` }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.secondary }}
                      >
                        <span className="text-white text-[10px]">M</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: colors.accent }}
                        >
                          Michael Chen
                        </p>
                        <p
                          className="text-[10px] truncate"
                          style={{ color: colors.secondary }}
                        >
                          Would you be available for a quick call this week?...
                        </p>
                        <p
                          className="text-[8px] mt-0.5"
                          style={{ color: colors.neutral[400] }}
                        >
                          1 day ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}