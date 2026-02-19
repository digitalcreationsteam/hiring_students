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
  FeatherUser,
} from "@subframe/core";
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";
import { Eye } from "lucide-react";
import { clearUserData } from "src/utils/authUtils";
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

type RecruiterMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  company: string;
  message: string;
  time: string;
  avatar: string;
  unread: boolean;
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
  console.log("calculatePercentile called with rank:", rank);
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

  console.log("Dashboard component rendering");

  /* ==================== STATE ==================== */

  const [avatar, setAvatar] = useState<string>(() => {
    console.log("Initializing avatar state from localStorage");
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        console.log("User from localStorage:", parsed);
        // normalize stored URL if needed
        const raw = parsed?.profileUrl;
        if (raw) {
          try {
            const origin = BASE_URL.replace(/\/api\/?$/, "");
            console.log("Avatar origin:", origin);
            if (/^https?:\/\//.test(raw)) return raw;
            if (raw.startsWith("/")) return origin + raw;
            return origin + "/" + raw;
          } catch (e) {
            console.error("Error normalizing avatar URL:", e);
            return raw || DEFAULT_AVATAR;
          }
        }
        return DEFAULT_AVATAR;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
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

  // State for recruiter messages
  const [recentRecruiterMessages, setRecentRecruiterMessages] = useState<
    RecruiterMessage[]
  >([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Log when component mounts
  useEffect(() => {
    console.log("\n========== 🚀 DASHBOARD MOUNTED ==========");
    console.log(
      "Current User ID from localStorage:",
      localStorage.getItem("userId"),
    );
    console.log(
      "Current User from localStorage:",
      localStorage.getItem("user"),
    );
  }, []);

  // State for recruiter messages
  const [recentRecruiterMessages, setRecentRecruiterMessages] = useState<
    RecruiterMessage[]
  >([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Log when component mounts
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      console.log("Current user from localStorage:", parsed);
      setCurrentUserId(parsed?._id || null);
      console.log("✅ Current User ID set:", parsed?._id);
    }
  }, []);

  const openMyChat = () => {
    console.log("\n========== 💬 OPENING CHAT ==========");
    const studentId = localStorage.getItem("userId");
    console.log("Student ID from localStorage:", studentId);

    if (!studentId) {
      console.error("❌ No student ID found");
      toast.error("User ID not found. Please login again.");
      return;
    }
    console.log("✅ Navigating to chat with ID:", studentId);
    navigate(`/chat/${studentId}`);
  };

  // Fetch recent recruiter messages
  const fetchRecentRecruiterMessages = useCallback(async () => {
    console.log(
      "\n========== 💬 FETCHING RECENT RECRUITER MESSAGES ==========",
    );
    const studentId = localStorage.getItem("userId");

    if (!studentId) {
      console.log("❌ No student ID found");
      return;
    }

    setLoadingMessages(true);
    try {
      console.log("📡 Fetching recent messages for student:", studentId);
      const response = await API("GET", `/chat/recent/${studentId}`);

      console.log("📥 Recent messages response:", response);

      if (response?.data) {
        // Filter to only show messages from recruiters
        const recruiterMessages = response.data.filter(
          (msg: any) =>
            msg.senderRole === "recruiter" || msg.receiverRole === "recruiter",
        );

        console.log(
          `✅ Found ${recruiterMessages.length} recent recruiter messages`,
        );
        setRecentRecruiterMessages(recruiterMessages.slice(0, 3));
      }
    } catch (err) {
      console.error("❌ Failed to fetch recent messages:", err);
      // Fallback demo data
      console.log("📋 Using fallback demo messages");
      setRecentRecruiterMessages([
        {
          id: "recruiter1",
          senderId: "recruiter1",
          senderName: "Sarah Kim",
          senderRole: "recruiter",
          company: "TechWave Inc",
          message:
            "Hi! I reviewed your profile and would love to connect about a Product Manager role at TechWave.",
          time: "2m ago",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
          unread: true,
        },
        {
          id: "recruiter2",
          senderId: "recruiter2",
          senderName: "Michael Chen",
          senderRole: "recruiter",
          company: "DesignHub",
          message:
            "Your portfolio is impressive! When are you available for a quick call this week?",
          time: "1h ago",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
          unread: false,
        },
        {
          id: "recruiter3",
          senderId: "recruiter3",
          senderName: "Jessica Williams",
          senderRole: "recruiter",
          company: "Startup Labs",
          message:
            "Thanks for connecting! We have an opening that matches your profile.",
          time: "1d ago",
          avatar:
            "https://images.unsplash.com/photo-1494790108777-2f3bdbce8d9d?w=200",
          unread: false,
        },
      ]);
    } finally {
      setLoadingMessages(false);
      console.log("🏁 Recent messages fetch complete");
    }
  }, []);

  // Open chat with specific recruiter
  const openChatWithRecruiter = (recruiterId: string) => {
    console.log("Opening chat with recruiter:", recruiterId);
    navigate(`/chat/${recruiterId}`);
  };

  /* ==================== API CALLS ==================== */

  const fetchDashboardData = useCallback(async () => {
    console.log("\n========== 📊 FETCHING DASHBOARD DATA ==========");
    try {
      console.log("Making API call to:", URL_PATH.calculateExperienceIndex);
      const res = await API("GET", URL_PATH.calculateExperienceIndex);

      console.log("📥 Dashboard API Response:", res);
      if (!res) {
        console.log("⚠️ No response received");
        return;
      }

      /* DEMOGRAPHICS */
      const demo = res?.data?.demographics?.[0];
      console.log("Demographics data:", demo);

      console.log("Demographics data:", demo);

      setUser({
        name: demo?.fullName || "",
        domain: res?.jobdomain?.domain || "",
        location: formatLocation(demo?.city, demo?.state),
      });

      console.log("Setting user city/state:", demo?.city, demo?.state);
      setUserCity(demo?.city || "City");
      setUserState(demo?.state || "State");

      /* AVATAR */
      const profileFromServer = res?.documents?.profileUrl;
      console.log("Profile from server:", profileFromServer);
      let normalizedProfile: string | null = null;

      if (profileFromServer) {
        const origin = BASE_URL.replace(/\/api\/?$/, "");
        console.log("Origin for avatar:", origin);
        if (/^https?:\/\//.test(profileFromServer))
          normalizedProfile = profileFromServer;
        else if (profileFromServer.startsWith("/"))
          normalizedProfile = origin + profileFromServer;
        else normalizedProfile = origin + "/" + profileFromServer;

        console.log("Profile image URL:", normalizedProfile);
      }

      setAvatar(normalizedProfile || DEFAULT_AVATAR);

      // save in localStorage safely
      try {
        if (normalizedProfile) {
          const u = localStorage.getItem("user");
          const parsed = u ? JSON.parse(u) : {};
          parsed.profileUrl = normalizedProfile;
          localStorage.setItem("user", JSON.stringify(parsed));
          console.log("✅ Avatar URL saved to localStorage");
        }
      } catch (e) {
        console.error("Failed to save avatar to localStorage:", e);
      }

      /* RANK */
      const rank = res?.rank;
      console.log("Rank data:", rank);

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
          rank: rank?.universityRank ?? "-",
          percentile: calculatePercentile(rank?.universityRank),
        },
      };

      console.log("Setting rankData:", newRankData);
      setRankData(newRankData);

      /* HIREABILITY */
      const hireabilityIndex = res?.hireabilityIndex;
      console.log("Hireability index:", hireabilityIndex);

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
      };

      console.log("Setting hireability:", newHireability);
      setHireability(newHireability);

      /* LISTS */
      console.log(
        "Setting work experience:",
        res?.data?.workExperience?.length || 0,
      );
      setWorkExperience(res?.data?.workExperience || []);

      const mappedProjects = (res?.data?.projects || []).map((p: any) => ({
        title: p.projectName,
        summary: p.summary,
      }));
      console.log("Setting projects:", mappedProjects.length);
      setProjects(mappedProjects);

      const mappedCertifications = (res?.data?.certifications || []).map(
        (c: any) => ({
          name: c.certificationName,
          issuedBy: c.issuer,
          issueYear: c.issueDate,
        }),
      );
      console.log("Setting certifications:", mappedCertifications.length);
      setCertifications(mappedCertifications);

      const educationList = res?.data?.education || [];
      console.log("Setting education:", educationList.length);
      setEducation(educationList);

      const skillsList = (res?.skills?.list || []).map((s: string) => ({
        name: s,
      }));
      console.log("Setting skills:", skillsList.length);
      setSkills(skillsList);

      /* JOB DOMAIN */
      const jobDomain = res?.jobdomain?.domain || "Professional";
      console.log("Setting domain:", jobDomain);
      setDomain(jobDomain);

      /* UNIVERSITY NAME + LEADERBOARD */
      const userUniversity = educationList?.[0]?.schoolName;
      console.log("User university:", userUniversity);
      console.log("User university:", userUniversity);

      if (userUniversity) {
        // ✅ Set university name so leaderboard title shows it dynamically
        setUserUniversityName(userUniversity);
        console.log("userUniversityName set to:", userUniversity);

        try {
          console.log(
            "📡 Fetching university leaderboard for:",
            userUniversity,
          );
          const leaderboardRes = await API(
            "GET",
            `${URL_PATH.getStudentsBySchool}?schoolName=${encodeURIComponent(
              userUniversity,
            )}`,
          );

          const students = leaderboardRes?.data || [];
          console.log(`✅ Found ${students.length} students from university`);
          setUniversityLeaderboard(students);
        } catch (error) {
          console.error("❌ University leaderboard fetch failed:", error);
        }
      } else {
        console.warn(
          "No university found in education list — skipping leaderboard fetch",
        );
      }

      /* FETCH CASE STUDY ATTEMPTS THIS WEEK */
      const demoId = demo?.id || demo?._id;
      console.log("demoId for weekly case studies:", demoId);

      if (demoId) {
        try {
          console.log(
            "📡 Fetching weekly case study attempts for user:",
            demo.id,
          );
          const caseStudyRes = await API(
            "GET",
            `/api/user-case-attempts/${demo.id}/weekly`,
          );

          const weeklyAttempts = caseStudyRes?.totalAttempts ?? 0;
          const totalCaseStudies = 5;
          const totalCaseStudies = 5;
          const pct = Math.round((weeklyAttempts / totalCaseStudies) * 100);

          console.log(
            `Weekly case studies: ${weeklyAttempts}/${totalCaseStudies} (${pct}%)`,
          );

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
          console.error("❌ Weekly case study fetch failed:", error);
        }
      } else {
        console.warn("No demoId found — skipping weekly case study fetch");
      }

      console.log("✅ Dashboard data fetch complete");
    } catch (err: any) {
      console.error("❌ fetchDashboardData FAILED:", err);
      console.error("message:", err?.message);
      console.error("response:", err?.response?.data);
      setAvatar(DEFAULT_AVATAR);
    }
  }, []);

  /* ==================== EFFECTS ==================== */
  useEffect(() => {
    console.log("useEffect: Checking assessment completion status");
    const completed = localStorage.getItem("assessmentCompleted") === "true";
    console.log("Assessment completed:", completed);
    setIsAssessmentCompleted(completed);
    console.log("Assessment completed status:", completed);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchRecentRecruiterMessages();
  }, [fetchRecentRecruiterMessages]);

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

  const handleNavigate = (path: string) => {
    console.log(`Navigating to: ${path} with source: dashboard`);
    navigate(path, {
      state: { source: "dashboard" },
    });
  };

  const handleAssessmentClick = () => {
    console.log(
      "handleAssessmentClick called, completed:",
      isAssessmentCompleted,
    );
    if (isAssessmentCompleted) {
      console.log("Assessment already completed");
      toast.success("Assessment already completed");
      return;
    }

    console.log("Starting assessment");
    navigate("/assessment-intro", {
      state: { source: "dashboard" },
    });
  };

  // POST API for the profile
  const handleSaveProfile = async () => {
    if (!selectedAvatarFile) return;

    console.log("Saving profile image:", selectedAvatarFile.name);
    const formData = new FormData();
    formData.append("avatar", selectedAvatarFile);

    try {
      setIsSavingAvatar(true);
      console.log("📡 Uploading profile image...");

      await API("POST", URL_PATH.uploadProfile, formData);

      console.log("✅ Profile image uploaded successfully");
      await fetchDashboardData();
      setSelectedAvatarFile(null);
    } catch (error) {
      console.error("❌ Failed to save profile image:", error);
      toast.error("Failed to save profile image");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Avatar file selected:", e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (!file) {
      console.warn("No file selected");
      return;
    }

    console.log(
      "Selected file:",
      file.name,
      "size:",
      file.size,
      "type:",
      file.type,
    );

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.warn("File size too large:", file.size);
      toast.error("File size should be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      console.warn("Invalid file type:", file.type);
      toast.error("Please select a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Cleanup old preview
    if (avatar && avatar.startsWith("blob:")) {
      console.log("Revoking old blob URL:", avatar);
      URL.revokeObjectURL(avatar);
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    console.log("Created preview URL:", previewUrl);
    setAvatar(previewUrl);
    console.log("Avatar preview created");

    try {
      setIsSavingAvatar(true);

      // Upload to server
      const formData = new FormData();
      formData.append("avatar", file);

      console.log("📡 Uploading avatar...");
      await API("POST", URL_PATH.uploadProfile, formData);

      console.log("✅ Avatar uploaded successfully");
      await fetchDashboardData();

      // Dispatch custom event to notify Navbar about avatar update
      window.dispatchEvent(new Event("avatar-updated"));
      console.log("Avatar updated event dispatched");

      // Revoke preview after successful upload
      setTimeout(() => {
        if (previewUrl.startsWith("blob:")) {
          console.log("Revoking preview URL after timeout");
          URL.revokeObjectURL(previewUrl);
        }
      }, 1000);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    clearUserData();
    navigate("/login");
  };

  /* ==================== MEMOS ==================== */

  const skillProgress = useMemo(() => {
    const progress =
      hireability.skill.max > 0
        ? (hireability.skill.score / hireability.skill.max) * 100
        : 0;
    console.log("skillProgress calculated:", progress);
    return progress;
  }, [hireability.skill]);

  const experienceProgress = useMemo(() => {
    const progress =
      hireability.experience.max > 0
        ? (hireability.experience.score / hireability.experience.max) * 100
        : 0;
    console.log("experienceProgress calculated:", progress);
    return progress;
  }, [hireability.experience]);

  const circleOffset = useMemo(() => {
    const CIRCUMFERENCE = 452.4;
    const MAX_SCORE = 1000;

    const offset =
      CIRCUMFERENCE - (CIRCUMFERENCE * hireability.totalScore) / MAX_SCORE;
    console.log(
      "circleOffset calculated:",
      offset,
      "totalScore:",
      hireability.totalScore,
    );
    return offset;
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

        {/* Main Content - Flex grow to push footer down */}
        <div className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10 mb-10">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* --- LEFT SIDEBAR --- */}
            <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
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
                    {/* Avatar Section */}
                    <div
                      className="relative cursor-pointer group flex-shrink-0"
                      onClick={() => {
                        console.log("Avatar clicked, triggering file input");
                        fileRef.current?.click();
                      }}
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

                    {/* User Name and Location */}
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

                  {/* Resume Content - REMOVED SCROLL EFFECT */}
                  <div className="space-y-6 mb-6">
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
                    onClick={() => {
                      console.log("Edit Profile button clicked");
                      navigate("/profile");
                    }}
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
                {/* Global Rank */}
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
                    label: "University",
                    val: rankData.university,
                    pct: rankData.university.percentile,
                    icon: "/university.jpg",
                    theme: colors.primary,
                  },
                ].map((rank, i) => {
                  console.log(`Rendering ${rank.label} card:`, rank.val);
                  return (
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
                              onError={(e) => {
                                console.log(
                                  `Failed to load icon for ${rank.label}`,
                                );
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            rank.icon
                          )}
                        </div>
                        <Badge
                          className="border-none text-[15px] font-black"
                          style={{
                            backgroundColor: colors.background,
                            color: rank.theme, // This was originally on the span
                          }}
                        >
                          Top {rank.pct}%
                        </Badge>

                        <span
                          style={{ color: "black" }}
                          className="text-[10px] uppercase tracking-widest"
                        >
                          {rank.label}
                        </span>
                        <span
                          style={{ color: "black" }}
                          className="text-[10px] uppercase tracking-widest"
                        >
                          {rank.label}
                        </span>

                        {/* REVERSED: Rank now gets the badge styling (text-[10px], colors.accent) */}
                        <span
                          className="text-[30px]"
                          style={{ color: colors.accent }} // This was originally on the badge
                        >
                          {rank.val.rank}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
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
                                backgroundColor: colors.primary,
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
                                backgroundColor: colors.primary,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Button */}
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
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
                  {/* Assessment */}
                  {/* Assessment */}
                  <Card
                    style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                    className="border p-3 border-neutral-200 rounded-3xl sm:rounded-[2rem] shadow-sm bg-white transition-all"
                  >
                    <CardContent className="pt-2 pb-0 px-4 sm:pt-3 sm:pb-3 sm:px-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base sm:text-lg">
                          Complete Assessment
                        </h4>
                        {isAssessmentCompleted && (
                          <Badge
                            className="border-none text-[10px] px-2 py-1"
                            style={{
                              backgroundColor: "#10b981",
                              color: "white",
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <FeatherCheckCircle className="w-3 h-3" />
                              Completed
                            </div>
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-neutral-500 mb-4 sm:mb-6 leading-relaxed">
                        {isAssessmentCompleted
                          ? "You've successfully completed the assessment. Your results have been added to your profile."
                          : "Begin evaluation and boost your credibility with role-specific assessment."}
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <FeatherClock className="w-3 h-3" /> 20 min
                        </span>

                        {!isAssessmentCompleted && (
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

                  {/* Case Studies */}
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
                          onClick={() => {
                            console.log("Navigate to case assessments");
                            handleNavigate("/case-assessments");
                          }}
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
                            {/* Rank */}
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                              style={{
                                backgroundColor: colors.white,
                                color: isUser ? colors.primary : colors.accent,
                              }}
                            >
                              #{index + 1}
                            </div>

                            {/* Name + Score */}
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

              {/* Talk to Recruiters Card */}
              <Card
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="bg-white rounded-[2rem] border shadow-sm overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: colors.background2,
                          }}
                        >
                          <FeatherUser2
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <div>
                          <h3
                            className="text-base font-semibold"
                            style={{ color: colors.accent }}
                          >
                            Recruiter Messages
                          </h3>
                          <p
                            className="text-xs"
                            style={{ color: colors.secondary }}
                          >
                            {
                              recentRecruiterMessages.filter((m) => m.unread)
                                .length
                            }{" "}
                            unread conversations
                          </p>
                        </div>
                      </div>

                      {/* View All Button */}
                      <Button
                        onClick={openMyChat}
                        className="!p-2 !h-8 !w-8 rounded-full"
                        style={{
                          backgroundColor: colors.primary,
                          color: "white",
                        }}
                      >
                        <FeatherArrowRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Recent Messages List */}
                    <div className="space-y-3 mt-2">
                      {loadingMessages ? (
                        <div className="flex justify-center py-4">
                          <div
                            className="animate-spin rounded-full h-6 w-6 border-b-2"
                            style={{ borderColor: colors.primary }}
                          ></div>
                        </div>
                      ) : recentRecruiterMessages.length > 0 ? (
                        recentRecruiterMessages.map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => openChatWithRecruiter(msg.senderId)}
                            className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all hover:shadow-md"
                            style={{
                              backgroundColor: msg.unread
                                ? `${colors.primary}08`
                                : colors.background,
                              border: `1px solid ${msg.unread ? colors.primary : colors.neutral[200]}`,
                            }}
                          >
                            {/* Avatar */}
                            <Avatar
                              size="small"
                              image={msg.avatar}
                              className="w-8 h-8 rounded-full"
                            />

                            {/* Message Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className="text-sm font-medium truncate"
                                  style={{ color: colors.accent }}
                                >
                                  {msg.senderName}
                                </span>
                                <span
                                  className="text-[10px] whitespace-nowrap"
                                  style={{ color: colors.neutral[400] }}
                                >
                                  {msg.time}
                                </span>
                              </div>

                              <p
                                className="text-xs truncate mt-0.5"
                                style={{ color: colors.secondary }}
                              >
                                {msg.company}
                              </p>

                              <p
                                className="text-xs truncate mt-1"
                                style={{
                                  color: msg.unread
                                    ? colors.primary
                                    : colors.neutral[500],
                                  fontWeight: msg.unread ? 500 : 400,
                                }}
                              >
                                {msg.message}
                              </p>
                            </div>

                            {/* Unread Indicator */}
                            {msg.unread && (
                              <div
                                className="w-2 h-2 rounded-full mt-1"
                                style={{ backgroundColor: colors.primary }}
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        // Empty State
                        <div className="text-center py-6">
                          <div
                            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                            style={{ backgroundColor: colors.background2 }}
                          >
                            <FeatherUser2
                              className="w-6 h-6"
                              style={{ color: colors.primary }}
                            />
                          </div>
                          <p
                            className="text-sm"
                            style={{ color: colors.accent }}
                          >
                            No messages yet
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: colors.secondary }}
                          >
                            Start connecting with recruiters
                          </p>
                          <Button
                            onClick={openMyChat}
                            className="mt-4 !px-4 !py-2 !h-8 rounded-full text-xs"
                            style={{
                              backgroundColor: colors.primary,
                              color: "white",
                            }}
                          >
                            Browse Recruiters
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* View All Link */}
                    {recentRecruiterMessages.length > 0 && (
                      <button
                        onClick={openMyChat}
                        className="text-xs text-center mt-2 py-2 transition-opacity hover:opacity-70"
                        style={{ color: colors.primary }}
                      >
                        View all conversations →
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer - Sticks to bottom */}
        <Footer />
      </div>
    </>
  );
}
