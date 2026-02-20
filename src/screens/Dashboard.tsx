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
      className="bg-white rounded-[2rem] border shadow-sm"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
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

            {/* Skills preview */}
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

            {/* Domain score progress */}
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

const ExperienceBadge = ({
  years,
  cohort,
}: {
  years: number;
  cohort: string;
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Badge
        className="px-3 py-1 rounded-full text-xs"
        style={{
          backgroundColor: colors.primary,
          color: "white",
        }}
      >
        {years} YOE
      </Badge>
      <Badge
        className="px-3 py-1 rounded-full text-xs"
        style={{
          backgroundColor: colors.background,
          color: colors.accent,
        }}
      >
        Cohort {cohort}
      </Badge>
    </div>
  );
};

/* ==================== MAIN COMPONENT ==================== */

export default function Dashboard() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  /* ==================== STATE ==================== */

  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );

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

  // New states for domains and experience
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

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setCurrentUserId(parsed?._id || null);

      // Initialize avatar from localStorage
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

  // Update the calculatePercentile function with proper types
  const calculatePercentile = (
    rank: number | undefined,
    total: number,
  ): string => {
    if (!rank || rank <= 0 || !total || total <= 0) return "-";

    // Calculate percentile: (1 - rank/total) * 100
    // If rank is 1 out of 100, percentile = 99% (top 1%)
    const percentile = ((total - rank) / total) * 100;

    // Round to nearest integer and return as string
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

      /* DEMOGRAPHICS */
      const demo = res?.data?.demographics?.[0];

      setUser({
        name: demo?.fullName || "",
        domain: res?.jobdomain?.domain || "",
        location: formatLocation(demo?.city, demo?.state),
      });

      setUserCity(demo?.city || "City");
      setUserState(demo?.state || "State");

      /* AVATAR */
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

      /* RANK */
      const rank = res?.rank;
      const totals = res?.totalCounts || {};

      setTotalCounts(totals);

      // Calculate percentiles using the new function
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
          percentile: calculatePercentile(
            rank?.universityRank,
            totals.university,
          ),
        },
      };

      setRankData(newRankData);

      /* NEW: Domain and Experience Data */
      if (res?.domains) {
        setDomains(res.domains);
      }

      if (res?.primaryDomain) {
        setPrimaryDomain(res.primaryDomain);
      }

      if (res?.experience) {
        setExperienceInfo(res.experience);
      }

      /* HIREABILITY */
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

      /* LISTS */
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

      /* JOB DOMAIN */
      const jobDomain = res?.jobdomain?.domain || "Professional";
      setDomain(jobDomain);

      /* UNIVERSITY NAME + LEADERBOARD */
      const userUniversity = educationList?.[0]?.schoolName;

      if (userUniversity) {
        setUserUniversityName(userUniversity);

        try {
          const leaderboardRes = await API(
            "GET",
            `${URL_PATH.getStudentsBySchool}?schoolName=${encodeURIComponent(
              userUniversity,
            )}`,
          );

          const students = leaderboardRes?.data || [];
          setUniversityLeaderboard(students);
        } catch (error) {
          console.error("University leaderboard fetch failed:", error);
        }
      }

      /* FETCH CASE STUDY ATTEMPTS THIS WEEK */
      const demoId = demo?.id || demo?._id;

      if (demoId) {
        try {
          const caseStudyRes = await API(
            "GET",
            `${URL_PATH.getWeeklyCaseAttempts}/${demoId}`,
          );

          const weeklyAttempts = caseStudyRes?.totalAttempts ?? 0;
          const totalCaseStudies = 5;
          const pct = Math.round((weeklyAttempts / totalCaseStudies) * 100);

          setWeeklyActivity({
            caseStudies: {
              val: `${weeklyAttempts}/${totalCaseStudies}`,
              pct: `${pct}%`,
            },
            hackathons: {
              val: `1/2`,
              pct: `50%`,
            },
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
    const CIRCUMFERENCE = 452.4;
    const MAX_SCORE = 1000;
    return CIRCUMFERENCE - (CIRCUMFERENCE * hireability.totalScore) / MAX_SCORE;
  }, [hireability.totalScore]);

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
        {/* TOP WELCOME BANNER */}
        <div
          className="w-full relative flex-shrink-0"
          style={{ borderColor: colors.aqua }}
        >
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10 mb-10">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* --- LEFT SIDEBAR --- */}
            <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
              {/* Experience Badge - New */}
              {/* <ExperienceBadge
                years={experienceInfo.years}
                cohort={experienceInfo.cohort}
              /> */}

              <Card
                className="w-full rounded-[2rem] shadow-sm"
                style={{
                  backgroundColor: colors.white,
                  border: `1.5px solid ${colors.primaryGlow}`,
                }}
              >
                <CardContent className="p-6">
                  {/* Header with Avatar and User Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="relative cursor-pointer group flex-shrink-0"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Avatar
                        size="x-large"
                        image={avatar}
                        style={{ boxShadow: `0 0 0 4px ${colors.primaryGlow}` }}
                        className="rounded-xl w-16 h-16"
                      >
                        PP
                      </Avatar>

                      <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
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

                    <div className="flex-1">
                      <h2
                        className="text-xl font-semibold"
                        style={{ color: colors.accent }}
                      >
                        {user.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-sm"
                          style={{ color: colors.secondary }}
                        >
                          {user.domain}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: colors.neutral[400] }}
                        >
                          {user.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resume Content */}
                  <div
                    className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide mb-6"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
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
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* --- CENTER DASHBOARD --- */}
            <div className="flex w-full flex-col gap-8 lg:max-w-[800px]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Global Rank",
                    val: rankData.global,
                    pct: rankData.global.percentile,
                    icon: "/glob.png",
                    theme: colors.accent,
                  },
                  {
                    label: userState || "State",
                    val: rankData.state,
                    pct: rankData.state.percentile,
                    icon: "/state.png",
                    theme: colors.secondary,
                  },
                  {
                    label: userCity || "City",
                    val: rankData.city,
                    pct: rankData.city.percentile,
                    icon: "/city.png",
                    theme: colors.primary,
                  },
                  {
                    label: userUniversityName || "University",
                    val: rankData.university,
                    pct: rankData.university.percentile,
                    icon: "/university.svg",
                    theme: colors.accent,
                  },
                ].map((rank, i) => (
                  <Card
                    key={i}
                    className="rounded-3xl shadow-sm border"
                    style={{
                      backgroundColor: colors.white,
                      border: `1.5px solid ${colors.primaryGlow}`,
                    }}
                  >
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full">
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

                      <span
                        style={{ color: "black" }}
                        className="text-[10px] uppercase tracking-widest"
                      >
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
                        {rank.val.percentile !== "-"
                          ? `Top ${rank.val.percentile}%`
                          : "Top -%"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card
                className="w-full rounded-[2.5rem] shadow-xl overflow-hidden"
                style={{
                  backgroundColor: "white",
                  color: colors.accent,
                  border: `1.5px solid ${colors.primaryGlow}`,
                }}
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
                          strokeDashoffset={circleOffset}
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

                      <div className="grid grid-cols-2 gap-4">
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
                                backgroundColor: colors.primary,
                              }}
                            />
                          </div>
                        </div>

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
                                backgroundColor: colors.primary,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="neutral-primary"
                        className="text-black border-none px-8 rounded-2xl h-12 transition-transform hover:scale-105"
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

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
                  <Card
                    style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                    className="border p-3 border-neutral-200 rounded-3xl sm:rounded-[2rem] shadow-sm bg-white transition-all"
                  >
                    <CardContent className="pt-2 pb-0 px-4 sm:pt-3 sm:pb-3 sm:px-3">
                      <h4 className="text-base sm:text-lg mb-2">
                        Complete Assessment
                      </h4>

                      <p className="text-sm text-neutral-500 mb-4 sm:mb-6 leading-relaxed">
                        Begin evaluation and boost your credibility with
                        role-specific eval.
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <FeatherClock className="w-3 h-3" /> 20 min
                        </span>

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

                  <Card
                    style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                    className="border p-3 border-neutral-200 rounded-3xl sm:rounded-[2rem] shadow-sm bg-white transition-all"
                  >
                    <CardContent className="pt-2 pb-0 px-4 sm:pt-3 sm:pb-3 sm:px-3">
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
                </div>
              </div>
            </div>

            {/* --- RIGHT SIDEBAR --- */}
            <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
              {/* New Domain Rankings Card */}
              <DomainRankingsCard
                domains={domains}
                primaryDomain={primaryDomain}
              />

              <Card
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="bg-white rounded-[2rem] border shadow-sm"
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-sm font-bold flex flex-col items-start gap-1"
                    style={{ color: colors.accent }}
                  >
                    <div className="flex gap-2">
                      <div>
                        <img
                          src="/trophy.png"
                          alt="Trophy"
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span style={{ color: colors.accent }}>
                          Top PMs at {universityName}
                        </span>
                        <span className="text-xs font-normal opacity-70">
                          Full Leaderboard
                        </span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
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
                            className="flex items-center gap-3 p-3 rounded-2xl"
                            style={{
                              backgroundColor: isUser
                                ? colors.aqua
                                : colors.background,
                            }}
                          >
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                              style={{
                                backgroundColor: colors.white,
                                color: isUser ? colors.primary : colors.accent,
                              }}
                            >
                              #{index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs truncate font-semibold"
                                style={{
                                  color: isUser
                                    ? colors.primary
                                    : colors.accent,
                                }}
                              >
                                {fullName || p.userId?.email}{" "}
                                {isUser && "(You)"}
                              </p>

                              <p
                                className="text-[10px] opacity-60"
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

              <Card
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="bg-white rounded-[2rem] border shadow-sm"
              >
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
                    0
                  </Badge>
                </CardHeader>

                <CardContent className="flex items-center justify-center py-6">
                  <p
                    className="text-xs opacity-60"
                    style={{ color: colors.accent }}
                  >
                    No profile views yet
                  </p>
                </CardContent>
              </Card>

              <Card
                className="w-full rounded-[2rem] shadow-sm border"
                style={{
                  backgroundColor: colors.white,
                  color: colors.accent,
                  border: `1.5px solid ${colors.primaryGlow}`,
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
                      ...weeklyActivity.caseStudies,
                      color: colors.primary,
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
                      backgroundColor: colors.background2,
                      color: "black",
                    }}
                  >
                    You're more active than 78% of peers
                  </div>
                </CardContent>
              </Card>

              <Card
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="bg-white rounded-[2rem] border shadow-sm overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="space-y-2">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: colors.accent }}
                      >
                        Talk to Recruiters
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.secondary }}
                      >
                        Directly message recruiters and explore new
                        opportunities.
                      </p>
                    </div>

                    <Button
                      onClick={() => navigate("/chat")}
                      className="w-full rounded-2xl h-12 transition-transform hover:scale-105 mt-2"
                      style={{
                        backgroundColor: colors.primary,
                        color: "white",
                      }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Send a Message</span>
                        <FeatherArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
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
