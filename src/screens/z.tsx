"use client";

import React from "react";
import { Avatar } from "../ui/components/Avatar";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { colors } from "../common/Colors"
import { Progress } from "../ui/components/Progress";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { FeatherArrowRight } from "@subframe/core";
import { FeatherArrowUp } from "@subframe/core";
import { FeatherAward } from "@subframe/core";
import { FeatherBook } from "@subframe/core";
import { FeatherBookOpen } from "@subframe/core";
import { FeatherBriefcase } from "@subframe/core";
import { FeatherCalendar } from "@subframe/core";
import { FeatherCheckCircle } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherFileText } from "@subframe/core";
import { FeatherFolderOpen } from "@subframe/core";
import { FeatherGift } from "@subframe/core";
import { FeatherGlobe } from "@subframe/core";
import { FeatherLock } from "@subframe/core";
import { FeatherMap } from "@subframe/core";
import { FeatherMapPin } from "@subframe/core";
import { FeatherPlus } from "@subframe/core";
import { FeatherRepeat } from "@subframe/core";
import { FeatherTarget } from "@subframe/core";
import { FeatherTool } from "@subframe/core";
import { FeatherTrophy } from "@subframe/core";
import { FeatherUniversity } from "@subframe/core";
import { FeatherUser2 } from "@subframe/core";
import { FeatherUsers } from "@subframe/core";
import { FeatherZap } from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Projects from "./Projects";


// // ==================== TYPES ====================
// type UserProfile = {
//   name: string;
//   domain: string;
//   location: string;
// };

// type WorkExperience = {
//   jobTitle: string;
//   companyName: string;
//   startYear: number | null;
//   endYear: number | null;
//   duration: number | null;
//   description: string;
//   location: string;
//   currentlyWorking: boolean;
// };

// type education = {
//   schoolName: string;
//   degree: string;
//   startYear: number | null;
//   endYear: number | null;
//   currentlyStudying?: boolean;
// };

// type Skill = {
//   name: string;
// };
// type Certification = {
//   name: string;
//   issuedBy: string;
//   issueYear: number | null;
// };
// type project ={
//   title: string;
//   summary: string;
//   endYear: number | null;
// };
// type RankData = {
//   rank: number;
//   percentile: number;
//   betterThan: number;
// };

// type LocationRank = {
//   state: RankData;
//   city: RankData;
//   university: RankData;
// };

// type Hireability = {
//   totalScore: number;
//   weeklyChange: number;
//   nextRankPoints: number;
//   skill: {
//     score: number;
//     max: number;
//   };
//   experience: {
//     score: number;
//     max: number;
//   };
// };

//  type BadgeVariant = "brand" | "neutral" | "warning" | "error" | "success";
//   type RankTheme = {
//     border: string;
//     bg: string;
//     iconBg: string;
//     iconColor: string;
//     valueColor: string;
//     badge: BadgeVariant;
//   };

// // type DashboardResponse = {
// //   user: {
// //     name: string;
// //     role: string;
// //     location: string;
// //     avatar: string;
// //     verified: boolean;
// //   };
// //   exp: {
// //     jobTitle: string;
// //     companyName: string;
// //     startYear: number;
// //     endYear: number;
// //     duration: number;
// //     description: string;
// //     location: string;
// //     currentlyWorking: boolean;
// //   };
// //   edu:{
// //     schoolName: string;
// //     degree: string;
// //     startYear: number;
// //     endYear: number;
// //   };
// //   skills:{
// //     skill : string;
// //   };

// //   certifications:{
// //   name: string;
// //   issuedBy: string;
// //   issueYear: number | null;
// // };
// // project :{
// //   title: string;
// //   summary: string;
// //   endYear: number | null;
// // };

// //   rank: {
// //     global: number;
// //     university: number;
// //     city: number;
// //     percentile: string;
// //   };
// //   hireability: {
// //     score: number;
// //     skillIndex: number;
// //     experienceIndex: number;
// //     weeklyChange: number;
// //   };
// //   activity: {
// //     caseStudies: { done: number; total: number };
// //     hackathons: { done: number; total: number };
// //     interviewPrep: { done: number; total: number };
// //   };
// // };

// export default function Dashboard() {
//   const navigate = useNavigate();

//     /* -------------------- NAVIGATION (UPDATED) -------------------- */
//   const handleNavigate = async (path: string) => {
//     if (path === "/assessment") {
//       const res = await fetch("/api/assessment/status");
//       const data = await res.json();

//       if (data.status === "IN_PROGRESS") {
//         navigate(`/assessment/continue/${data.attemptId}`);
//         return;
//       }
//     }
//     navigate(path);
//   };

//   /* -------------------- AVATAR -------------------- */
//   const fileRef = useRef<HTMLInputElement>(null);
//   const [avatar, setAvatar] = useState(
//     "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
//   );

// const [user, setUser] = useState<UserProfile>({
//   name: "",
//   domain: "",
//   location: "",
// });

//          /* -------------------- PROFETIONAL PROFILE -------------------- */

//   const [profile, setProfile] = useState({

//     workExperience: [],
//     education: [],
//     skills: [],
//     certifications: [],
//     projects: [],
//   });

//   const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);

//   const [education, setEducation] = useState<education[]>([]);

//   const [skills, setSkills] = useState<Skill[]>([]);

//   const [certifications, setcertifications] = useState<Certification[]>([]);

//   const [project, setProject] = useState<project[]>([]);

//   /* -------------------- GLOBAL RANK STATE -------------------- */
//   const [globalRank, setGlobalRank] = useState({
//     rank: 0,
//     percentile: 0,
//     betterThan: 0,
//   });
//   /* -------------------- California, San Francisco, Stanford RANK STATE --------- */

//     const [locationRank, setLocationRank] = useState({
//     state: { rank: 0, percentile: 0, betterThan: 0 },
//     city: { rank: 0, percentile: 0, betterThan: 0 },
//     university: { rank: 0, percentile: 0, betterThan: 0 },
//   });

//     /* -------------------- Hireability Index -------------------- */

//     const [hireability, setHireability] = useState({
//     totalScore: 0,
//     weeklyChange: 0,
//     nextRankPoints: 0,
//     skill: {
//       score: 0,
//       max: 400,
//     },
//     experience: {
//       score: 0,
//       max: 5000,
//     },
//   });

//    /* -------------------- RECRUITER VISIBILITY -------------------- */
//   const [recruiterVisibility, setRecruiterVisibility] = useState(0);

//   /* -------------------- FETCH DATA -------------------- */
//   useEffect(() => {
//   // Fetch all dashboard data on component mount
//   const fetchDashboardData = async () => {
//     try {
//       // 1. User Profile
//       await fetchUserProfile();

//       // 2. Profile Details
//       const profileData = await API("GET", URL_PATH.getDemographics);
//       setProfile(profileData);

//       //     Working Experience

//       // 3. Global Rank
//       try {
//         const globalRankData = await API("GET", "/user/global-rank");
//         setGlobalRank({
//           rank: globalRankData?.rank ?? 0,
//           percentile: globalRankData?.percentile ?? 0,
//           betterThan: globalRankData?.betterThan ?? 0,
//         });
//       } catch (err) {
//         console.warn("Global rank not available:", err);
//       }

//       // 4. Location Rank
//       try {
//         const locationData = await API("GET", "/user/location-rank");
//         setLocationRank({
//           state: {
//             rank: locationData?.state?.rank ?? 0,
//             percentile: locationData?.state?.percentile ?? 0,
//             betterThan: locationData?.state?.betterThan ?? 0,
//           },
//           city: {
//             rank: locationData?.city?.rank ?? 0,
//             percentile: locationData?.city?.percentile ?? 0,
//             betterThan: locationData?.city?.betterThan ?? 0,
//           },
//           university: {
//             rank: locationData?.university?.rank ?? 0,
//             percentile: locationData?.university?.percentile ?? 0,
//             betterThan: locationData?.university?.betterThan ?? 0,
//           },
//         });
//       } catch (err) {
//         console.warn("Location rank not available:", err);
//       }

//       // 5. Hireability Index
//       try {
//         const hireabilityData = await API("GET", "/user/hireability-index");
//         setHireability({
//           totalScore: hireabilityData?.totalScore ?? 0,
//           weeklyChange: hireabilityData?.weeklyChange ?? 0,
//           nextRankPoints: hireabilityData?.nextRankPoints ?? 0,
//           skill: {
//             score: hireabilityData?.skill?.score ?? 0,
//             max: hireabilityData?.skill?.max ?? 400,
//           },
//           experience: {
//             score: hireabilityData?.experience?.score ?? 0,
//             max: hireabilityData?.experience?.max ?? 5000,
//           },
//         });
//       } catch (err) {
//         console.warn("Hireability index not available:", err);
//       }

//       // 6. Recruiter Visibility
//       try {
//         const visibilityData = await API("GET", "/user/recruiter-visibility");
//         setRecruiterVisibility(visibilityData?.probability ?? 0);
//       } catch (err) {
//         console.warn("Recruiter visibility not available:", err);
//       }

//     } catch (error) {
//       console.error("Error loading dashboard:", error);
//     }
//   };

//   fetchDashboardData();
// }, []);
//   // useEffect(() => {
//   //   fetch("/api/user/profile")
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       setuser({
//   //         name: data.name,
//   //         domain: data.domain,
//   //         location: data.location,
//   //       });
//   //       setAvatar(data.avatar);
//   //     });  }, []);

//         /* -------------------- GlobalRank DATA -------------------- */

//     fetch("/api/user/profile-details")
//       .then((res) => res.json())
//       .then((data) => setProfile(data));
//       fetch("/api/user/global-rank")
//       .then((res) => res.json())
//       .then((data) => {
//         setGlobalRank({
//           rank: data?.rank ?? 0,
//           percentile: data?.percentile ?? 0,
//           betterThan: data?.betterThan ?? 0,
//         });
//       })
//       .catch(() => { }); // new user → defaults remain 0

//               /* -------------------- State Rank DATA -------------------- */
//       fetch("/api/user/location-rank")
//       .then((res) => res.json())
//       .then((data) => {
//         setLocationRank({
//           state: {
//             rank: data?.state?.rank ?? 0,
//             percentile: data?.state?.percentile ?? 0,
//             betterThan: data?.state?.betterThan ?? 0,
//           },
//           city: {
//             rank: data?.city?.rank ?? 0,
//             percentile: data?.city?.percentile ?? 0,
//             betterThan: data?.city?.betterThan ?? 0,
//           },
//           university: {
//             rank: data?.university?.rank ?? 0,
//             percentile: data?.university?.percentile ?? 0,
//             betterThan: data?.university?.betterThan ?? 0,
//           },
//         });
//       })
//       .catch(() => {});

//                     /* -------------------- Hireability DATA -------------------- */
//       fetch("/api/user/hireability-index")
//       .then((res) => res.json())
//       .then((data) => {
//         setHireability({
//           totalScore: data?.totalScore ?? 0,
//           weeklyChange: data?.weeklyChange ?? 0,
//           nextRankPoints: data?.nextRankPoints ?? 0,
//           skill: {
//             score: data?.skill?.score ?? 0,
//             max: data?.skill?.max ?? 400,
//           },
//           experience: {
//             score: data?.experience?.score ?? 0,
//             max: data?.experience?.max ?? 5000,
//           },
//         });
//       })
//       .catch(() => {}); // new user → keep defaults (0)

//          /* -------------------- RECRUITER VISIBILITY -------------------- */
//         fetch("/api/user/recruiter-visibility")
//       .then((res) => res.json())
//       .then((data) => {
//         setRecruiterVisibility(data?.probability ?? 0);
//       })
//       .catch(() => {});

//   // }, []);

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setAvatar(URL.createObjectURL(file));
//   };

// // ==================== CONSTANTS ====================

//   const GLOBAL_THEME: RankTheme = {
//     border: "border-violet-200",
//     bg: "bg-violet-50",
//     iconBg: "bg-violet-100",
//     iconColor: "text-violet-600",
//     valueColor: "text-violet-600",
//     badge: "brand",
//   };

// /* --------------------  USER PROFILE API -------------------- */
// const fetchUserProfile = useCallback(async () => {
//   try {
//     const res = await API("GET", URL_PATH.getDemographics);
// console.log("Response in Dashboard :::::::::::::::::::", res)
//     // Map API response to UI state (API returns fullName, not name)

// setUser({
//   name: res.fullName || "",           // User's full name
//   domain: res.domain || "Professional", // User's role/domain
//   location: `${res.city || ""}, ${res.state || ""}`
//     .trim()
//     .replace(/^,\s*|,\s*$/g, ""),     // City + State
// });

//     setAvatar(res.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400");
//   } catch (err) {
//     console.error("Failed to fetch user profile:", err);
//   }
// }, []);

// /* --------------------  Work Experience API -------------------- */
// const fetchworkexp = useCallback(async () => {
//   try {
//     const response = await API("GET", URL_PATH.experience);
//     const data = response?.data;

//     if (!Array.isArray(data)) return;

//     setWorkExperience(
//       data.map((item: any) => ({
//         jobTitle: item.jobTitle || "",
//         companyName: item.companyName || "",
//         startYear: item.startYear ?? null,
//         endYear: item.endYear ?? null,
//         duration: item.duration ?? null,
//         description: item.description || "",
//         location: `${item.city || ""}, ${item.state || ""}`
//           .trim()
//           .replace(/^,\s*|,\s*$/g, ""),
//         currentlyWorking: item.currentlyWorking ?? false,
//       }))
//     );
//   } catch (err) {
//     console.error("Failed to fetch work experience:", err);
//   }
// }, []);

// /* -------------------- Education API -------------------- */
//  const fetcheducation = useCallback(async () => {
//   try {
//     const response = await API("GET", URL_PATH.education);
//     const data = response?.data;

//     if (!Array.isArray(data)) return;

//     setEducation(
//       data.map((item: any) => ({
//     schoolName: item.schoolName || "",
//     degree: item.degree || "",
//     startYear: item.startYear ?? null,
//     endYear: item.endYear ?? null,
//   }))
//     );
//   } catch (err) {
//     console.error("Failed to fetch Education: ", err);
//   }
// }, []);

// /* -------------------- Skills API -------------------- */
//   const fetchskill = useCallback(async () => {
//   try {
//     const response = await API("GET", URL_PATH.getUserDomainSkils);
//     const data = response?.data;

//     if (!Array.isArray(data)) return;

//     setSkills(
//       data.map((item: any) => ({
//     name: item.name || item.skill || "",

//   }))
//     );
//   } catch (err) {
//     console.error("Failed to fetch Skills: ", err);
//   }
// }, []);

// /* -------------------- Certification API -------------------- */

// const fetchcertification = useCallback(async () => {
//   try {
//     const response = await API("GET", URL_PATH.certification);
//     const data = response?.data;

//     if (!Array.isArray(data)) return;

//     setEducation(
//       data.map((item: any) => ({
//     schoolName: item.schoolName || "",
//     degree: item.degree || "",
//     startYear: item.startYear ?? null,
//     endYear: item.endYear ?? null,
//   }))
//     );
//   } catch (err) {
//     console.error("Failed to fetch Certification ", err);
//   }
// }, []);

// /* -------------------- Project API -------------------- */

// const fetchprojects = useCallback(async () => {
//   try {
//     const response = await API("GET", URL_PATH.projects);
//     const data = response?.data;

//     if (!Array.isArray(data)) return;

//     setProject(
//       data.map((item: any) => ({
//    title: item.title || "",
//     summary: item.description || "",
//     endYear: item.endYear ?? null,
//   }))
//     );
//   } catch (err) {
//     console.error("Failed to fetch Projects ", err);
//   }
// }, []);

// /* -------------------- FETCH ALL DATA -------------------- */
// useEffect(() => {
//   const fetchDashboardData = async () => {
//     try {
//       // 1. User Profile (demographics)
//       await fetchUserProfile();

//       // 2. workExperience (experience)
//        await fetchworkexp();

//       // 3. education (education)
//        await fetcheducation();

//        // 4. Skill
//        await fetchskill();

//        // 5. Certification (certification)
//        await fetchcertification();

//        // 6. Projects (projects)
//        await fetchprojects();

//     } catch (error) {
//       console.error("Error loading dashboard:", error);
//     }
//   };

//   fetchDashboardData();
// }, [fetchUserProfile, fetchworkexp, fetcheducation, fetchskill, fetchcertification, fetchprojects]);

//          /* --------------------    USER PROFILE API -------------------- */

//    console.log("education", education)

// ==================== TYPES ====================
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

type RankData = {
  rank: number;
  percentile: number;
  betterThan: number;
};

type LocationRank = {
  state: RankData;
  city: RankData;
  university: RankData;
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

type BadgeVariant = "brand" | "neutral" | "warning" | "error" | "success";

type RankTheme = {
  border: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  badge: BadgeVariant;
};

// ==================== CONSTANTS ====================
const GLOBAL_THEME: RankTheme = {
  border: "border-violet-200",
  bg: "bg-violet-50",
  iconBg: "bg-violet-100",
  iconColor: "text-violet-600",
  valueColor: "text-violet-600",
  badge: "brand",
};

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

const PROFILE_VIEWERS = [
  {
    name: "Sarah Kim",
    role: "Senior Recruiter at Google",
    time: "2h ago",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=64",
    initials: "SK",
  },
  {
    name: "Michael Johnson",
    role: "Hiring Manager at Meta",
    time: "5h ago",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64",
    initials: "MJ",
  },
  {
    name: "Emily Patel",
    role: "Product Lead at Amazon",
    time: "1d ago",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64",
    initials: "EP",
  },
  {
    name: "David Lee",
    role: "VP of Product at Stripe",
    time: "2d ago",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64",
    initials: "DL",
  },
];

// ==================== HELPER FUNCTIONS ====================
const formatLocation = (city?: string, state?: string): string => {
  return `${city || ""}, ${state || ""}`.trim().replace(/^,\s*|,\s*$/g, "");
};

const safeApiCall = async <T,>(
  apiCall: () => Promise<T>,
  defaultValue: T,
  errorMessage: string
): Promise<T> => {
  try {
    return await apiCall();
  } catch (err) {
    console.warn(errorMessage, err);
    return defaultValue;
  }
};

// ==================== MAIN COMPONENT ====================
export default function Dashboard() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  // ==================== STATE ====================
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const [userId, setUser] = useState<UserProfile>({
    
    name: "",
    domain: "",
    location: "",
  });
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiencePoints, setExperiencePoints] = useState<number | null>(null);
  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);

  const [globalRank, setGlobalRank] = useState<RankData>({
    rank: 0,
    percentile: 0,
    betterThan: 0,
  });
  const [locationRank, setLocationRank] = useState<LocationRank>({
    state: { rank: 0, percentile: 0, betterThan: 0 },
    city: { rank: 0, percentile: 0, betterThan: 0 },
    university: { rank: 0, percentile: 0, betterThan: 0 },
  });
  const [hireability, setHireability] = useState<Hireability>({
    totalScore: 0,
    weeklyChange: 0,
    nextRankPoints: 0,
    skill: { score: 0, max: 400 },
    experience: { score: 0, max: 5000 },
  });
  const [recruiterVisibility, setRecruiterVisibility] = useState(0);

  // ==================== API FETCH FUNCTIONS ====================
  const fetchUserProfile = useCallback(async () => {
    const res = await API("GET", URL_PATH.getDemographics);
    console.log("Response in Dashboard:", res);

    setUser({
      name: res.fullName || "",
      domain: res.domain || "Professional",
      location: formatLocation(res.city, res.state),
    });

    setAvatar(res.avatar || DEFAULT_AVATAR);
  }, []);

  const fetchWorkExperience = useCallback(async () => {
    const response = await API("GET", URL_PATH.experience);
    const data = response?.data;

    if (!Array.isArray(data)) return;

    setWorkExperience(
      data.map((item: any) => ({
        jobTitle: item.jobTitle || "",
        companyName: item.companyName || "",
        startYear: item.startYear ?? null,
        endYear: item.endYear ?? null,
        duration: item.duration ?? null,
        description: item.description || "",
        location: formatLocation(item.city, item.state),
        currentlyWorking: item.currentlyWorking ?? false,
      }))
    );
  }, []);

  const fetchEducation = useCallback(async () => {
    const response = await API("GET", URL_PATH.education);
    const data = response?.data;

    if (!Array.isArray(data)) return;

    setEducation(
      data.map((item: any) => ({
        schoolName: item.schoolName || "",
        degree: item.degree || "",
        startYear: item.startYear ?? null,
        endYear: item.endYear ?? null,
      }))
    );
  }, []);

  const fetchSkills = useCallback(async () => {
    const response = await API("GET", URL_PATH.getUserDomainSkils);
    const data = response?.data;

    if (!Array.isArray(data)) return;

    setSkills(
      data.map((item: any) => ({ name: item.name || item.skills || "" }))
    );
  }, []);

  const fetchCertifications = useCallback(async () => {
    const response = await API("GET", URL_PATH.certification);
    const data = response?.data;

    if (!Array.isArray(data)) return;

    setCertifications(
      data.map((item: any) => ({
        name: item.certificationName || "",
        issuedBy: item.issuer || "",
        issueYear: item.issueDate ?? null,
      }))
    );
  }, []);

  const fetchProjects = useCallback(async () => {
    const response = await API("GET", URL_PATH.projects);
    const data = response?.data;

    if (!Array.isArray(data)) return;

    setProjects(
      data.map((item: any) => ({
        title: item.projectName || "",
        summary: item.summary || "",
        endYear: item.endYear ?? null,
      }))
    );
  }, []);

  const fetchExperienceIndex = React.useCallback(async () => {
 const response = await API("GET", URL_PATH.calculateExperienceIndex);
    const data = response?.data;
    const rank = data.rank;
console.log("message" , data.rank);
console.log("message" , rank);
    if (!Array.isArray(data)) return;

  setIsExpIndexLoading(true);

  try {
    const res = await API(
      "GET",
      URL_PATH.calculateExperienceIndex,
      undefined,
      { "user-id": userId }
    );

    setExperiencePoints(res?.points ?? 0);
  } catch {
    setExperiencePoints(0);
  } finally {
    setIsExpIndexLoading(false);
  }
}, [userId]);



  // ==================== FETCH ALL DATA ====================
  useEffect(() => {
     if (!userId) return;
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile and related data
        await Promise.all([
          fetchUserProfile(),
          fetchWorkExperience(),
          fetchEducation(),
          fetchSkills(),
          fetchCertifications(),
          fetchProjects(),
          fetchExperienceIndex(),
        ]);

      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // ==================== HANDLERS ====================
  const handleNavigate = async (path: string) => {
    if (path === "/assessment") {
      const res = await fetch("/api/assessment/status");
      const data = await res.json();

      if (data.status === "IN_PROGRESS") {
        navigate(`/assessment/continue/${data.attemptId}`);
        return;
      }
    }
    navigate(path);
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
        formData
        // ❌ DO NOT pass headers here
      );

      // Refresh profile image from server
      await fetchUserProfile();

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

      // Upload to server
      const formData = new FormData();
      formData.append("avatar", file);

      await API("POST", URL_PATH.uploadProfile, formData);

      // Refresh from server
      await fetchUserProfile();

      // Revoke preview after successful upload
      setTimeout(() => {
        if (previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload profile picture");
      // Revert to old avatar if available
      // if (user?.avatarUrl) {
      //   setAvatar(user.avatarUrl);
      // }
    } finally {
      setIsSavingAvatar(false);
    }
  };

  // ==================== MEMOIZED VALUES ====================
  const skillProgress = useMemo(
    () => (hireability.skill.score / hireability.skill.max) * 100,
    [hireability.skill.score, hireability.skill.max]
  );

  const experienceProgress = useMemo(
    () => (hireability.experience.score / hireability.experience.max) * 100,
    [hireability.experience.score, hireability.experience.max]
  );



return (
    <DefaultPageLayout>
      <div className="min-h-screen w-full overflow-y-auto pb-12" style={{ backgroundColor: colors.cream }}>
        
        {/* TOP WELCOME BANNER */}
        <div className="w-full border-b" style={{ backgroundColor: colors.white, borderColor: colors.aqua }}>
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-end gap-4 px-4 sm:px-8 py-8 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: colors.primary }}>
                Welcome back, {userId.name} 👋
              </h1>
              <p className="text-lg" style={{ color: colors.secondary }}>
                Track progress, discover opportunities, and level up your Hireability score.
              </p>
            </div>
            <div className="flex gap-3">
               <Badge className="px-4 py-2 rounded-xl text-sm border-none font-bold" 
                      style={{ backgroundColor: colors.mint, color: colors.secondary }}>
                 {hireability.weeklyChange} growth this week
               </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            
            {/* --- LEFT SIDEBAR --- */}
            <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
              
              {/* Profile Card */}
              <div className="flex w-full flex-col items-center gap-3 rounded-[2rem] border shadow-sm text-center px-6 py-8" 
                   style={{ backgroundColor: colors.white, borderColor: colors.aqua }}>
                <div className="relative cursor-pointer group mb-2" onClick={() => fileRef.current?.click()}>
                  <Avatar size="x-large" image={avatar} style={{ boxShadow: `0 0 0 4px ${colors.aqua}` }}>PP</Avatar>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <span className="text-white text-xs font-bold uppercase">Change</span>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold" style={{ color: colors.primary }}>{userId.name}</span>
                    <FeatherCheckCircle className="w-4 h-4" style={{ color: colors.secondary }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: colors.secondary }}>{userId.domain}</p>
                  <div className="flex items-center justify-center gap-1 text-xs" style={{ color: colors.neutral[400] }}>
                    <FeatherMapPin className="w-3 h-3" />
                    <span>{userId.location}</span>
                  </div>
                </div>

                <div className="flex w-full gap-2 mt-4">
                  <Badge className="flex-1 rounded-xl py-2 justify-center border-none" 
                         style={{ backgroundColor: colors.cream, color: colors.accent }} variant="warning" icon={<FeatherTrophy className="w-3 h-3"/>}>
                   Global Rank #{globalRank.rank}
                  </Badge>
                  <Badge className="flex-1 rounded-xl py-2 justify-center border-none" 
                         style={{ backgroundColor: colors.mint, color: colors.secondary }} variant="brand" icon={<FeatherAward className="w-3 h-3"/>}>
                    University Rank #{locationRank.university.rank}
                  </Badge>
                </div>

                {selectedAvatarFile && (
                  <Button className="w-full mt-2 rounded-xl h-10 border-none font-bold" 
                          style={{ backgroundColor: colors.accent, color: colors.primary }} 
                          onClick={() => handleSaveProfile()} disabled={isSavingAvatar}>
                    {isSavingAvatar ? "Saving..." : "Save Profile Image"}
                  </Button>
                )}
              </div>

              {/* PROFESSIONAL RESUME (SIDEBAR) */}
              <div className="rounded-[2rem] p-6 border shadow-sm space-y-6" 
                   style={{ backgroundColor: colors.white, borderColor: colors.aqua }}>
                <h3 className="text-sm font-bold border-b pb-3 flex items-center gap-2" 
                    style={{ color: colors.primary, borderColor: colors.mint }}>
                  <FeatherFileText className="w-4 h-4" style={{ color: colors.aqua }} /> Professional Resume
                </h3>

                {/* Experience */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.accent }}>Experience</p>
                  <div className="space-y-4 border-l-2 ml-1" style={{ borderColor: colors.mint }}>
                    {workExperience?.slice(0, 2).map((exp, i) => (
                      <div key={i} className="pl-4 relative">
                        <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1 ring-2 ring-white" 
                             style={{ backgroundColor: colors.accent }} />
                        <h4 className="text-xs font-bold leading-tight" style={{ color: colors.primary }}>{exp.jobTitle}</h4>
                        <p className="text-[10px]" style={{ color: colors.secondary }}>{exp.companyName}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.primary }}>Projects</p>
                  {projects?.slice(0, 2).map((proj, i) => (
                    <div key={i} className="p-2.5 rounded-xl border" style={{ backgroundColor: colors.cream, borderColor: colors.aqua }}>
                      <h4 className="text-[11px] font-bold truncate" style={{ color: colors.primary }}>{proj.title}</h4>
                      <p className="text-[10px] line-clamp-1 opacity-70" style={{ color: colors.secondary }}>{proj.summary}</p>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.secondary }}>Certifications</p>
                  {certifications?.slice(0, 2).map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl border" style={{ backgroundColor: colors.mint, borderColor: colors.aqua }}>
                      <FeatherAward className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accent }} />
                      <p className="text-[10px] font-bold truncate" style={{ color: colors.primary }}>{cert.name}</p>
 <p
          className="ml-auto text-[10px] font-bold whitespace-nowrap"
          style={{ color: colors.primary }}
        >
          {cert.issueYear}
        </p>
       
        <p
          className="text-[9px] opacity-70 ml-5 truncate"
          style={{ color: colors.secondary }}
        >
          Issued by {cert.issuedBy}
        </p>
                    </div>
                  ))}
                </div>
                 {/* Education & Certs */}
                <div className="space-y-3 pt-2">
                   <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Education</p>
                     <div className="flex gap-1">
                       {certifications?.slice(0, 3).map((_, i) => (
                         <FeatherCheckCircle key={i} className="w-3 h-3 text-green-500" />
                       ))}
                     </div>
                   </div>
                   {education?.slice(0, 1).map((edu, i) => (
                      <div key={i} className="text-[11px]">
                        <p className="font-bold text-neutral-800 leading-tight">{edu.schoolName}</p>
                        <p className="text-neutral-500">{edu.degree}</p>
                        <p className="text-[10px] text-neutral-400 whitespace-nowrap">
            {edu.startYear}
            {edu.endYear
              ? ` – ${edu.endYear}`
              : " – Present"}
          </p>
                      </div>
                   ))}
                </div>
              


                {/* Skills */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.neutral[400] }}>Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills?.slice(0, 6).map((skill, i) => (
                      <span key={i} className="px-2 py-1 border rounded-md text-[9px] font-bold uppercase" 
                            style={{ backgroundColor: colors.white, borderColor: colors.aqua, color: colors.primary }}>
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Update Buttons */}
              <div className="grid grid-cols-2 gap-2">
                 {[
                   { label: "Exp", icon: <FeatherPlus />, path: "/experience" },
                   { label: "Proj", icon: <FeatherFolderOpen />, path: "/projects" },
                   { label: "Edu", icon: <FeatherUniversity />, path: "/education" },
                   { label: "Skills", icon: <FeatherTool />, path: "/skills" },
                   { label: "Certification", icon: <FeatherTool />, path: "/certifications" }

                 ].map((item, i) => (
                   <button key={i} onClick={() => handleNavigate(item.path)} 
                           className="p-4 bg-white border rounded-2xl flex flex-col items-center gap-2 transition-all hover:scale-105"
                           style={{ borderColor: colors.aqua }}>
                      <div style={{ color: colors.accent }}>{item.icon}</div>
                      <span className="text-[9px] font-black uppercase" style={{ color: colors.primary }}>{item.label}</span>
                   </button>
                 ))}
              </div>
            </div>

            {/* --- CENTER DASHBOARD --- */}
            <div className="flex w-full flex-col gap-8 lg:max-w-[800px]">
              
              {/* Rankings Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Global Rank", val: globalRank.rank, pct: globalRank.percentile, icon: <FeatherGlobe />, theme: colors.accent },
                  { label: "California", val: locationRank.state.rank, pct: locationRank.state.percentile, icon: <FeatherMap />, theme: colors.secondary },
                  { label: "San Francisco", val: locationRank.city.rank, pct: locationRank.city.percentile, icon: <FeatherMapPin />, theme: colors.primary },
                  { label: "Stanford", val: locationRank.university.rank, pct: locationRank.university.percentile, icon: <FeatherUniversity />, theme: colors.accent }
                ].map((rank, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 rounded-3xl border p-6 shadow-sm text-center" 
                       style={{ backgroundColor: colors.white, borderColor: colors.aqua }}>
                    <div className="h-10 w-10 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.cream, color: rank.theme }}>
                      {rank.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{rank.label}</span>
                    <span className="text-3xl font-black" style={{ color: rank.theme }}>{rank.val}</span>
                    <Badge className="border-none text-[10px] font-bold" style={{ backgroundColor: colors.mint, color: colors.secondary }}>
                      Top {rank.pct}%
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Hireability Hero Index */}
              <div className="w-full rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden" 
                   style={{ backgroundColor: colors.primary }}>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative h-40 w-40 flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
                      <circle cx="80" cy="80" r="72" stroke={colors.accent} strokeWidth="10" fill="transparent" 
                        strokeDasharray="452.4" strokeDashoffset={452.4 - (452.4 * (hireability.totalScore / 1000))}
                        strokeLinecap="round" />
                    </svg>
                    <div className="text-center">
                      <span className="text-4xl font-black" style={{ color: colors.accent }}>{hireability.totalScore}</span>
                      <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest">Total Index</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold">Hireability Index</h3>
                      <p className="opacity-80 text-sm">You are just {hireability.nextRankPoints} points away from rank 22 at Stanford!</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
                           <span>Skill Index</span>
                           <span>{hireability.skill.score}/{hireability.skill.max}</span>
                         </div>
                         <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${(hireability.skill.score/hireability.skill.max)*100}%`, backgroundColor: colors.accent }} />
                         </div>
                       </div>
                       <div className="space-y-1">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
                           <span>Experience</span>
                           <span>{hireability.experience.score}/{hireability.experience.max}</span>
                         </div>
                         <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${(hireability.experience.score/hireability.experience.max)*100}%`, backgroundColor: colors.aqua }} />
                         </div>
                       </div>
                    </div>
                    <Button className="border-none px-8 rounded-2xl font-bold h-12 transition-transform hover:scale-105" 
                            style={{ backgroundColor: colors.accent, color: colors.primary }}>
                       Improve Score Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: colors.primary }}>Recommended Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Complete Assessment", desc: "Begin evaluation and boost your credibility with role-specific eval", icon: <FeatherFileText />, badge: "+50 Skill", theme: colors.secondary, path: "/assessment" },
                    { title: "Solve Case Studies", desc: "Showing recruiters your effort to increase your knowledge base.", icon: <FeatherBookOpen />, badge: "+40 Exp", theme: colors.accent, path: "/cases" }
                  ].map((act, i) => (
                    <div key={i} className="bg-white border p-6 rounded-[2rem] shadow-sm flex flex-col justify-between" 
                         style={{ borderColor: colors.aqua }}>
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 rounded-2xl" style={{ backgroundColor: colors.mint, color: act.theme }}>{act.icon}</div>
                          <Badge className="border-none font-bold text-[10px]" style={{ backgroundColor: colors.cream, color: colors.accent }}>{act.badge}</Badge>
                        </div>
                        <h4 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>{act.title}</h4>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: colors.secondary }}>{act.desc}</p>
                      </div>
                      <Button className="rounded-2xl px-6 h-10 border-none font-bold w-fit" 
                              style={{ backgroundColor: colors.primary, color: colors.white }} onClick={() => handleNavigate(act.path)}>
                        Start Now
                      </Button>
                    </div>
                  ))}
                  
                  {/* Coming Soon Actions */}
                  <div className="p-6 rounded-[2rem] opacity-60 border bg-neutral-100" style={{ borderColor: colors.neutral[200] }}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white rounded-2xl text-neutral-400"><FeatherUsers /></div>
                      <Badge variant="neutral" className="bg-white text-neutral-400 border-none text-[10px]">COMING SOON</Badge>
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-neutral-600">Participate in Hackathons</h4>
                    <Button disabled className="rounded-2xl px-6 bg-neutral-200 text-neutral-400 border-none mt-4">Notify Me</Button>
                  </div>

                  <div className="p-6 rounded-[2rem] opacity-60 border bg-neutral-100" style={{ borderColor: colors.neutral[200] }}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white rounded-2xl text-neutral-400"><FeatherBook /></div>
                      <Badge variant="neutral" className="bg-white text-neutral-400 border-none text-[10px]">COMING SOON</Badge>
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-neutral-600">Courses</h4>
                    <Button disabled className="rounded-2xl px-6 bg-neutral-200 text-neutral-400 border-none mt-4">Notify Me</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT SIDEBAR --- */}
            <div className="flex w-full flex-col gap-6 lg:w-[340px] lg:flex-none">
              
              {/* Visibility Probability */}
              <div className="rounded-[2.5rem] p-8 shadow-lg text-center relative overflow-hidden" 
                   style={{ backgroundColor: colors.accent, color: colors.primary }}>
                 <div className="relative z-10">
                   <p className="text-xs font-black uppercase tracking-widest opacity-70">Visibility Probability</p>
                   <div className="text-6xl font-black my-4">{recruiterVisibility}%</div>
                   <div className="p-3 rounded-2xl text-[10px] font-bold" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                     Based on rankings and case studies solved.
                   </div>
                 </div>
              </div>

              {/* Mini Leaderboard */}
              <div className="bg-white rounded-[2rem] border shadow-sm p-6" style={{ borderColor: colors.aqua }}>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
                  <FeatherTrophy className="w-4 h-4" style={{ color: colors.accent }} /> Top PMs at Stanford
                </h3>
                <div className="space-y-3 mb-4">
                  {[
                    { rank: 1, name: "Anjali Sharma", score: 425, theme: colors.accent }, 
                    { rank: 2, name: "Rahul Kumar", score: 398, theme: colors.secondary }, 
                    { rank: 23, name: "You", score: 350, theme: colors.primary, isUser: true }
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl" 
                         style={{ backgroundColor: p.isUser ? colors.mint : colors.cream }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black" 
                           style={{ backgroundColor: colors.white, color: p.theme }}>
                        #{p.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: p.theme }}>{p.name}</p>
                        <p className="text-[10px] opacity-60" style={{ color: colors.primary }}>Score: {p.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-9 text-[11px] font-bold rounded-xl border-none" 
                        style={{ backgroundColor: colors.primary, color: colors.white }} 
                        onClick={() => handleNavigate("/leaderboard")}>
                  Full Leaderboard
                </Button>
              </div>

              {/* ACTIVITY INTENSITY (Placed here as requested) */}
              <div className="flex w-full flex-col gap-4 rounded-[2rem] border shadow-sm px-6 py-6" 
                   style={{ backgroundColor: colors.white, borderColor: colors.aqua }}>
                <span className="text-sm font-bold" style={{ color: colors.primary }}>Activity This Week</span>
                <div className="space-y-4">
                  {[
                    { label: "Case Studies", pct: "45%", color: colors.accent, val: "3/5" },
                    { label: "Hackathons", pct: "50%", color: colors.secondary, val: "1/2" },
                    { label: "Interview Prep", pct: "24%", color: colors.aqua, val: "1/10" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span style={{ color: colors.neutral[600] }}>{item.label}</span>
                        <span style={{ color: colors.primary }}>{item.val}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.cream }}>
                        <div className="h-full rounded-full transition-all" style={{ width: item.pct, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 rounded-xl px-3 py-2 text-center text-[10px] font-bold" 
                     style={{ backgroundColor: colors.mint, color: colors.secondary }}>
                  You're more active than 78% of peers
                </div>
              </div>

              {/* Profile Views */}
              <div className="bg-white rounded-[2rem] border shadow-sm p-6" style={{ borderColor: colors.aqua }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold" style={{ color: colors.primary }}>Profile Views</h3>
                  <Badge className="border-none font-bold text-[10px]" style={{ backgroundColor: colors.mint, color: colors.secondary }}>15</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Kim", role: "Google", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=64" },
                    { name: "Michael J.", role: "Meta", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64" }
                  ].map((viewer, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                       <Avatar size="small" image={viewer.img} style={{ boxShadow: `0 0 0 2px ${colors.cream}` }} />
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: colors.primary }}>{viewer.name}</p>
                          <p className="text-[10px] truncate opacity-60" style={{ color: colors.secondary }}>{viewer.role}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              

            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

// export default Dashboard;
