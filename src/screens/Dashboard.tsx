"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import API, { URL_PATH } from "src/common/API";
import { Avatar } from "../ui/components/Avatar";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Progress } from "../ui/components/Progress";
import { colors } from "../common/Colors";
import Chat from "../ui/components/chat/Chat";

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

  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
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


  /* ==================== API CALLS ==================== */
  const fetchDashboardData = useCallback(async () => {
    const res = await API("GET", URL_PATH.calculateExperienceIndex);

    if (!res) return;

      /* ==================== DEMOGRAPHICS (from same API) ==================== */
  const demo = res?.data?.demographics?.[0]; // ✅ first item
  setUser({
    name: demo?.fullName || "",
    domain: demo?.domain || "Professional", // if your backend doesn't send domain here, keep default
    location: formatLocation(demo?.city, demo?.state),
  });

    /* ==================== AVATAR ==================== */
    // setAvatar(res?.profileUrl || DEFAULT_AVATAR);
const url =
  res?.documents?.profileUrl ||
  res?.documents?.resumeUrl ||
  DEFAULT_AVATAR;

// ✅ cache buster so browser always loads latest image
const cacheBusted =
  url && url !== DEFAULT_AVATAR ? `${url}?t=${Date.now()}` : url;

setAvatar(cacheBusted);


    /* ==================== RANK ==================== */
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
        rank: rank?.universityRank ?? "0",
        percentile: calculatePercentile(rank?.universityRank),
      },
    });

    /* ==================== HIREABILITY ==================== */
    const hireabilityIndex = res?.hireabilityIndex;
    setHireability({
      totalScore: hireabilityIndex?.hireabilityIndex,
      weeklyChange: 0,
      nextRankPoints:
        hireabilityIndex?.experienceIndexTotal -
        hireabilityIndex?.experienceIndexScore,
      skill: {
        score: hireabilityIndex?.skillIndexScore,
        max: hireabilityIndex?.skillIndexTotal,
      },
      experience: {
        score: hireabilityIndex?.experienceIndexScore,
        max: hireabilityIndex?.experienceIndexTotal,
      },
    });

    /* ==================== WORK EXPERIENCE ==================== */
    setWorkExperience(
      (res?.data?.workExperience || []).map((item: any) => ({
        jobTitle: item.jobTitle,
        companyName: item.companyName,
        startYear: item.startYear ?? null,
        endYear: item.endYear ?? null,
        duration: item.duration ?? null,
        description: item.description ?? "",
        location: item.location ?? "",
        currentlyWorking: item.currentlyWorking ?? false,
      })),
    );

    /* ==================== PROJECTS ==================== */
    setProjects(
      (res?.data?.projects || []).map((item: any) => ({
        title: item.projectName,
        summary: item.summary,
      })),
    );

    /* ==================== CERTIFICATIONS ==================== */
    setCertifications(
      (res?.data?.certifications || []).map((item: any) => ({
        name: item.certificationName,
        issuedBy: item.issuer,
        issueYear: item.issueDate,
      })),
    );

    /* ==================== EDUCATION ==================== */
    setEducation(
      (res?.data?.education || []).map((item: any) => ({
        schoolName: item.schoolName,
        degree: item.degree,
        startYear: item.startYear,
        endYear: item.endYear,
        currentlyStudying: item.currentlyStudying,
      })),
    );

    /* ==================== SKILLS ==================== */
    setSkills(
      (res?.skills?.list || []).map((skill: string) => ({
        name: skill,
      })),
    );
  }, []);

  /* ==================== EFFECTS ==================== */

  useEffect(() => {
       fetchDashboardData(); // 👈 ONLY ONE CALL
  }, [ fetchDashboardData]);

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

  const handleNavigate = (path: string) => navigate(path);

  // POST API for the profile
// POST API for the profile
const handleSaveProfile = async () => {
  if (!selectedAvatarFile) return;

  const formData = new FormData();
  formData.append("avatar", selectedAvatarFile);

  try {
    setIsSavingAvatar(true);

    const uploadRes = await API("POST", URL_PATH.uploadProfile, formData);


    // ✅ If backend returns profileUrl, show instantly (optional but best UX)
    const newUrl = uploadRes?.data?.profileUrl; // ✅ FIX
if (newUrl) setAvatar(`${newUrl}?t=${Date.now()}`); // ✅ cache-bust



    // ✅ Refresh from DB (this is the important fix)
    await fetchDashboardData();

    // Cleanup
    setSelectedAvatarFile(null);
  } catch (error) {
    console.error("Failed to save profile image", error);
    alert("Failed to save profile image");
  } finally {
    setIsSavingAvatar(false);
  }
};

const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file size (e.g., max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("File size should be less than 5MB");
    return;
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    alert("Please select a valid image (JPEG, PNG, or WebP)");
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

    const formData = new FormData();
    formData.append("avatar", file);

    const uploadRes = await API("POST", URL_PATH.uploadProfile, formData);

    // ✅ If backend returns profileUrl, show instantly (optional)
   const newUrl = uploadRes?.data?.profileUrl; // ✅ FIX
if (newUrl) setAvatar(`${newUrl}?t=${Date.now()}`); // cache buster

    // ✅ Refresh from DB (this is the important fix)
    await fetchDashboardData();

    // Revoke preview after successful upload
    setTimeout(() => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    }, 1000);
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Failed to upload profile picture");
    // If upload fails, fallback to DB value
    await fetchDashboardData();
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
    <div
      className="min-h-screen w-full overflow-y-auto pb-12"
      style={{ backgroundColor: colors.white }}
    >
      {/* TOP WELCOME BANNER */}
      <div className="w-full " style={{ borderColor: colors.aqua }}>
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-end gap-4 px-4 sm:px-8 py-8 mb-8">
          <div className="space-y-1">
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: colors.primary }}
            >
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-lg" style={{ color: colors.secondary }}>
              Track progress, discover opportunities, and level up your
              Hireability score.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Weekly Growth Badge */}
            <Badge
              className="px-4 py-2 rounded-xl text-sm border-none font-bold"
              style={{ backgroundColor: colors.mint, color: colors.secondary }}
            >
              {hireability.weeklyChange} growth this week
            </Badge>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={profileMenuRef}>
              <div
                className="cursor-pointer"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              >
                <Avatar
                  size="large"
                  image={avatar}
                  style={{ boxShadow: `0 0 0 2px ${colors.aqua}` }}
                />
              </div>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg z-50"
                  style={{ borderColor: colors.aqua }}
                >
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-neutral-100 rounded-t-xl"
                  >
                    <FeatherUser2 className="w-4 h-4" />
                    Profile
                  </button>

                  <button
                    onClick={() => handleNavigate("/settings")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
                  >
                    <FeatherSettings className="w-4 h-4" />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-neutral-100 rounded-b-
          xl text-red-600"
                  >
                    <FeatherLogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* --- LEFT SIDEBAR --- */}
          <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
            {/* Profile Card */}
            <div
              className="flex w-full flex-col items-center gap-3 rounded-[2rem] border shadow-sm text-center px-6 py-8"
              style={{
                backgroundColor: colors.white,
                borderColor: colors.aqua,
              }}
            >
              <div
                className="relative cursor-pointer group mb-2"
                onClick={() => fileRef.current?.click()}
              >
                <Avatar
                  size="x-large"
                  image={avatar}
                  style={{ boxShadow: `0 0 0 4px ${colors.aqua}` }}
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

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="text-xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {user.name}
                  </span>
                  <FeatherCheckCircle
                    className="w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                </div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.secondary }}
                >
                  {user.domain}
                </p>
                <div
                  className="flex items-center justify-center gap-1 text-xs"
                  style={{ color: colors.neutral[400] }}
                >
                  <FeatherMapPin className="w-3 h-3" />
                  <span>{user.location}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-3 mt-4">
                {/* Global Rank */}
                <Badge
                  className="
      flex-1
      rounded-xl
      py-4 sm:py-6
      text-sm sm:text-base
      justify-center
      items-center
      border-none
      text-center
    "
                  style={{
                    backgroundColor: colors.cream,
                    color: colors.accent,
                  }}
                  variant="warning"
                  icon={<FeatherTrophy className="w-4 h-4 sm:w-5 sm:h-5" />}
                >
                  <span className="block font-semibold">Global Rank</span>
                  <span className="block text-lg sm:text-xl font-black">
                    #{rankData.global.rank}
                  </span>
                </Badge>

                {/* University Rank */}
                <Badge
                  className="
      flex-1
      rounded-xl
      py-4 sm:py-6
      text-sm sm:text-base
      justify-center
      items-center
      border-none
      text-center
    "
                  style={{
                    backgroundColor: colors.mint,
                    color: colors.secondary,
                  }}
                  variant="brand"
                  icon={<FeatherAward className="w-4 h-4 sm:w-5 sm:h-5" />}
                >
                  <span className="block font-semibold">University Rank</span>
                  <span className="block text-lg sm:text-xl font-black">
                    #{rankData.university.rank}
                  </span>
                </Badge>
              </div>
            </div>
            {/* Quick Update Buttons */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Exp", icon: <FeatherPlus />, path: "/experience" },
                {
                  label: "Proj",
                  icon: <FeatherFolderOpen />,
                  path: "/projects",
                },
                {
                  label: "Edu",
                  icon: <FeatherUniversity />,
                  path: "/education",
                },
                { label: "Skills", icon: <FeatherTool />, path: "/skills" },
                {
                  label: "Certification",
                  icon: <FeatherTool />,
                  path: "/certifications",
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigate(item.path)}
                  className="p-4 bg-white border rounded-2xl flex flex-col items-center gap-2 transition-all hover:scale-105"
                  style={{ borderColor: colors.aqua }}
                >
                  <div style={{ color: colors.accent }}>{item.icon}</div>
                  <span
                    className="text-[9px] font-black uppercase"
                    style={{ color: colors.primary }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* PROFESSIONAL RESUME (SIDEBAR) */}
            <div
              className="rounded-[2rem] p-6 border shadow-sm space-y-6"
              style={{
                backgroundColor: colors.white,
                borderColor: colors.aqua,
              }}
            >
              <h3
                className="text-sm font-bold border-b pb-3 flex items-center gap-2"
                style={{ color: colors.primary, borderColor: colors.mint }}
              >
                <FeatherFileText
                  className="w-4 h-4"
                  style={{ color: colors.aqua }}
                />{" "}
                Professional Resume
              </h3>

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
                  style={{ borderColor: colors.mint }}
                >
                  {workExperience?.slice(0, 2).map((exp, i) => (
                    <div key={i} className="pl-4 relative">
                      <div
                        className="absolute w-2 h-2 rounded-full -left-[5px] top-1 ring-2 ring-white"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <h4
                        className="text-xs font-bold leading-tight"
                        style={{ color: colors.primary }}
                      >
                        {exp.jobTitle}
                      </h4>
                      <p
                        className="text-[10px]"
                        style={{ color: colors.secondary }}
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
                  style={{ color: colors.primary }}
                >
                  Projects
                </p>

                {projects?.slice(0, 2).map((proj, i) => (
                  <div
                    key={i}
                    className="relative pl-4 pr-3 py-3 rounded-xl border transition hover:shadow-md"
                    style={{
                      backgroundColor: colors.cream,
                      borderColor: colors.aqua,
                    }}
                  >
                    {/* Left accent bar */}
                    <span
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    />

                    {/* Project index */}
                    <span
                      className="text-[9px] font-bold mb-1 inline-block"
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
                  style={{ color: colors.secondary }}
                >
                  Certifications
                </p>

                {certifications?.slice(0, 2).map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border shadow-sm"
                    style={{
                      backgroundColor: colors.mint,
                      borderColor: colors.aqua,
                    }}
                  >
                    {/* Icon */}
                    <div className="mt-0.5">
                      <FeatherAward
                        className="w-4 h-4"
                        style={{ color: colors.accent }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] font-bold truncate"
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

                    {/* Date */}
                    <p
                      className="text-[10px] font-semibold whitespace-nowrap"
                      style={{ color: colors.primary }}
                    >
                      {cert.issueYear}
                    </p>
                  </div>
                ))}
              </div>

              {/* Education & Certs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">
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
                    <p className="font-bold text-neutral-800 leading-tight">
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
                  style={{ color: colors.neutral[400] }}
                >
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills?.slice(0, 6).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 border rounded-md text-[9px] font-bold uppercase"
                      style={{
                        backgroundColor: colors.white,
                        borderColor: colors.aqua,
                        color: colors.primary,
                      }}
                    >
                      {typeof skill === "string" ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- CENTER DASHBOARD --- */}
          <div className="flex w-full flex-col gap-8 lg:max-w-[800px]">
            {/* Rankings Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Global Rank",
                  val: rankData.global,
                  pct: rankData.global.percentile,
                  icon: <FeatherGlobe />,
                  theme: colors.accent,
                },
                {
                  label: "California",
                  val: rankData.state,
                  pct: rankData.state.percentile,
                  icon: <FeatherMap />,
                  theme: colors.secondary,
                },
                {
                  label: "San Francisco",
                  val: rankData.city,
                  pct: rankData.city.percentile,
                  icon: <FeatherMapPin />,
                  theme: colors.primary,
                },
                {
                  label: "Stanford",
                  val: rankData.university,
                  pct: rankData.university.percentile,
                  icon: <FeatherUniversity />,
                  theme: colors.accent,
                },
              ].map((rank, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 rounded-3xl border p-6 shadow-sm text-center"
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.aqua,
                  }}
                >
                  <div
                    className="h-10 w-10 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.cream, color: rank.theme }}
                  >
                    {rank.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                    {rank.label}
                  </span>
                  <span
                    className="text-3xl font-black"
                    style={{ color: rank.theme }}
                  >
                    {rank.val.rank}
                  </span>
                  <Badge
                    className="border-none text-[10px] font-bold"
                    style={{
                      backgroundColor: colors.mint,
                      color: colors.secondary,
                    }}
                  >
                    Top {rank.pct}%
                  </Badge>
                </div>
              ))}
            </div>

            {/* Hireability Hero Index */}
            <div
              className="w-full rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden"
              style={{ backgroundColor: colors.primary }}
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="relative h-40 w-40 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="72"
                      stroke="rgba(255,255,255,0.1)"
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
                      className="text-4xl font-black"
                      style={{ color: colors.accent }}
                    >
                      {hireability.totalScore}
                    </span>
                    <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest">
                      Total Index
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">Hireability Index</h3>
                    {/* <p className="opacity-80 text-sm">You are just {hireability.nextRankPoints} points away from rank 22 at Stanford!</p> */}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
                        <span>Skill Index</span>
                        <span>
                          {hireability.skill.score}/{hireability.skill.max}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${skillProgress}%`,
                            backgroundColor: colors.accent,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
                        <span>Experience</span>
                        <span>
                          {hireability.experience.score}/
                          {hireability.experience.max}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${experienceProgress}%`,
                            backgroundColor: colors.aqua,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className="border-none px-8 rounded-2xl font-bold h-12 transition-transform hover:scale-105"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary,
                    }}
                  >
                    Improve Score Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                  Recommended Actions
                </h3>

                <span className="w-fit text-[10px] sm:text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                  4 Actions Available
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Assessment */}
                <div className="bg-white border border-neutral-200 p-4 sm:p-6 rounded-3xl sm:rounded-[2rem] hover:border-violet-300 transition-all group shadow-sm">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="p-3 bg-violet-50 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <FeatherFileText />
                    </div>

                    <Badge className="bg-violet-50 text-violet-600 border-none font-bold text-[10px] uppercase tracking-wider">
                      +50 Skill
                    </Badge>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold mb-2">
                    Complete Assessment
                  </h4>
                  <p className="text-sm text-neutral-500 mb-4 sm:mb-6 leading-relaxed">
                    Begin evaluation and boost your credibility with
                    role-specific eval.
                  </p>

                  {/* Footer row responsive */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-violet-600 flex items-center gap-1">
                        <FeatherRepeat className="w-3 h-3" /> Paid retakes: 1
                      </span>
                      <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                        <FeatherGift className="w-3 h-3" /> Free retakes: 1
                      </span>
                    </div>

                    <Button
                      variant="brand-primary"
                      className="w-full sm:w-auto rounded-2xl bg-violet-700 hover:bg-violet-800 px-5 sm:px-6"
                      onClick={() => handleNavigate("/assessment")}
                    >
                      Start Now
                    </Button>
                  </div>
                </div>

                {/* Case Studies */}
                <div className="bg-white border border-neutral-200 p-4 sm:p-6 rounded-3xl sm:rounded-[2rem] hover:border-green-300 transition-all group shadow-sm">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="p-3 bg-green-50 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <FeatherBookOpen />
                    </div>

                    <Badge className="bg-green-50 text-green-600 border-none font-bold text-[10px] uppercase tracking-wider">
                      +40 Exp
                    </Badge>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold mb-2">
                    Solve Case Studies
                  </h4>
                  <p className="text-sm text-neutral-500 mb-4 sm:mb-6 leading-relaxed">
                    Solving cases shows recruiters your effort to increase your
                    knowledge base.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                      <FeatherClock className="w-3 h-3" /> 20 min
                    </span>

                    <Button
                      variant="brand-primary"
                      className="w-full sm:w-auto rounded-2xl bg-violet-700 hover:bg-violet-800 px-5 sm:px-6"
                      onClick={() => handleNavigate("/cases")}
                    >
                      Start Now
                    </Button>
                  </div>
                </div>

                {/* Hackathons */}
                <div className="bg-neutral-50 border border-neutral-200 p-4 sm:p-6 rounded-3xl sm:rounded-[2rem] opacity-80 group shadow-sm">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="p-3 bg-neutral-200 rounded-2xl text-neutral-500">
                      <FeatherUsers />
                    </div>

                    <Badge
                      variant="neutral"
                      icon={<FeatherLock />}
                      className="bg-gray-100 text-gray-600 border-none font-bold text-[10px] uppercase"
                    >
                      Coming Soon
                    </Badge>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold mb-2 text-neutral-700">
                    Participate in Hackathons
                  </h4>
                  <p className="text-sm text-neutral-400 mb-4 sm:mb-6 leading-relaxed">
                    Collaborate and build visibility with other PMs in upcoming
                    events.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                      <FeatherCalendar className="w-3 h-3" /> Starts in 5 days
                    </span>

                    <Button
                      disabled
                      className="w-full sm:w-auto rounded-2xl bg-neutral-200 text-neutral-500 cursor-not-allowed border-none px-5 sm:px-6"
                    >
                      Notify Me
                    </Button>
                  </div>
                </div>

                {/* Courses */}
                <div className="bg-neutral-50 border border-neutral-200 p-4 sm:p-6 rounded-3xl sm:rounded-[2rem] opacity-80 group shadow-sm">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="p-3 bg-neutral-200 rounded-2xl text-neutral-500">
                      <FeatherBook />
                    </div>

                    <Badge
                      variant="neutral"
                      icon={<FeatherLock />}
                      className="bg-gray-100 text-gray-600 border-none font-bold text-[10px] uppercase"
                    >
                      Coming Soon
                    </Badge>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold mb-2 text-neutral-700">
                    Courses
                  </h4>
                  <p className="text-sm text-neutral-400 mb-4 sm:mb-6 leading-relaxed">
                    Complete structured learning path to earn verified PM
                    badges.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                      <FeatherClock className="w-3 h-3" /> 8 weeks
                    </span>

                    <Button
                      disabled
                      className="w-full sm:w-auto rounded-2xl bg-neutral-200 text-neutral-500 cursor-not-allowed border-none px-5 sm:px-6"
                    >
                      Notify Me
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDEBAR --- */}
          <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
            {/* Visibility Probability */}
            <div
              className="rounded-[2.5rem] p-8 shadow-lg text-center relative overflow-hidden"
              style={{ backgroundColor: colors.accent, color: colors.primary }}
            >
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-widest opacity-70">
                  Visibility Probability
                </p>
                <div className="text-6xl font-black my-4">
                  {recruiterVisibility}%
                </div>
                <div
                  className="p-3 rounded-2xl text-[10px] font-bold"
                  style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                >
                  Based on rankings and case studies solved.
                </div>
              </div>
            </div>

            {/* Mini Leaderboard */}
            <div
              className="bg-white rounded-[2rem] border shadow-sm p-6"
              style={{ borderColor: colors.aqua }}
            >
              <h3
                className="text-sm font-bold mb-4 flex items-center gap-2"
                style={{ color: colors.primary }}
              >
                <FeatherTrophy
                  className="w-4 h-4"
                  style={{ color: colors.accent }}
                />{" "}
                Top PMs at Stanford
              </h3>
              <div className="space-y-3 mb-4">
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
                      backgroundColor: p.isUser ? colors.mint : colors.cream,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                      style={{ backgroundColor: colors.white, color: p.theme }}
                    >
                      #{p.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-bold truncate"
                        style={{ color: p.theme }}
                      >
                        {p.name}
                      </p>
                      <p
                        className="text-[10px] opacity-60"
                        style={{ color: colors.primary }}
                      >
                        Score: {p.score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full h-9 text-[11px] font-bold rounded-xl border-none"
                style={{ backgroundColor: colors.primary, color: colors.white }}
                onClick={() => handleNavigate("/leaderboard")}
              >
                Full Leaderboard
              </Button>
            </div>

            {/* ACTIVITY INTENSITY (Placed here as requested) */}
            <div
              className="flex w-full flex-col gap-4 rounded-[2rem] border shadow-sm px-6 py-6"
              style={{
                backgroundColor: colors.white,
                borderColor: colors.aqua,
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: colors.primary }}
              >
                Activity This Week
              </span>
              <div className="space-y-4">
                {[
                  {
                    label: "Case Studies",
                    pct: "45%",
                    color: colors.accent,
                    val: "3/5",
                  },
                  {
                    label: "Hackathons",
                    pct: "50%",
                    color: colors.secondary,
                    val: "1/2",
                  },
                  {
                    label: "Interview Prep",
                    pct: "24%",
                    color: colors.aqua,
                    val: "1/10",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span style={{ color: colors.neutral[600] }}>
                        {item.label}
                      </span>
                      <span style={{ color: colors.primary }}>{item.val}</span>
                    </div>
                    <div
                      className="h-1.5 w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: colors.cream }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: item.pct, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-2 rounded-xl px-3 py-2 text-center text-[10px] font-bold"
                style={{
                  backgroundColor: colors.mint,
                  color: colors.secondary,
                }}
              >
                You're more active than 78% of peers
              </div>
            </div>

            {/* Profile Views */}
            <div
              className="bg-white rounded-[2rem] border shadow-sm p-6"
              style={{ borderColor: colors.aqua }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-sm font-bold"
                  style={{ color: colors.primary }}
                >
                  Profile Views
                </h3>
                <Badge
                  className="border-none font-bold text-[10px]"
                  style={{
                    backgroundColor: colors.mint,
                    color: colors.secondary,
                  }}
                >
                  15
                </Badge>
              </div>
              <div className="space-y-3">
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
                        className="text-xs font-bold truncate"
                        style={{ color: colors.primary }}
                      >
                        {viewer.name}
                      </p>
                      <p
                        className="text-[10px] truncate opacity-60"
                        style={{ color: colors.secondary }}
                      >
                        {viewer.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </DefaultPageLayout>
  );
}

// export default Dashboard;
