"use client";

import React from "react";
import { Avatar } from "../ui/components/Avatar";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
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

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

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
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
const [isSavingAvatar, setIsSavingAvatar] = useState(false);

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

    setSkills(data.map((item: any) => ({ name: item.name || item.skill || "" })));
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
        title: item.title || "",
        summary: item.description || "",
        endYear: item.endYear ?? null,
      }))
    );
  }, []);

  const fetchGlobalRank = useCallback(async () => {
  const defaultRank: RankData = { rank: 0, percentile: 0, betterThan: 0 };

  const data = await safeApiCall(
    () => API("GET", "/user/global-rank"), // <-- your actual API path
    defaultRank,
    "Failed to fetch global rank"
  );

  setGlobalRank(data);
}, []);


  // ==================== FETCH ALL DATA ====================
  useEffect(() => {
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
        ]);

        await fetchGlobalRank();

        // Fetch rankings with error handling
        const globalRankData = await safeApiCall(
          () => API("GET", "/user/global-rank"),
          { rank: 0, percentile: 0, betterThan: 0 },
          "Global rank not available"
        );
        setGlobalRank(globalRankData);

        const locationData = await safeApiCall(
          () => API("GET", "/user/location-rank"),
          {
            state: { rank: 0, percentile: 0, betterThan: 0 },
            city: { rank: 0, percentile: 0, betterThan: 0 },
            university: { rank: 0, percentile: 0, betterThan: 0 },
          },
          "Location rank not available"
        );
        setLocationRank(locationData);

        const hireabilityData = await safeApiCall(
          () => API("GET", "/user/hireability-index"),
          {
            totalScore: 0,
            weeklyChange: 0,
            nextRankPoints: 0,
            skill: { score: 0, max: 400 },
            experience: { score: 0, max: 5000 },
          },
          "Hireability index not available"
        );
        setHireability(hireabilityData);

        const visibilityData = await safeApiCall(
          () => API("GET", "/user/recruiter-visibility"),
          { probability: 0 },
          "Recruiter visibility not available"
        );
        setRecruiterVisibility(visibilityData?.probability ?? 0);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchDashboardData();
  }, [
    fetchUserProfile,
    fetchWorkExperience,
    fetchEducation,
    fetchSkills,
    fetchCertifications,
    fetchProjects,
    fetchGlobalRank,
  ]);

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
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert("Please select a valid image (JPEG, PNG, or WebP)");
    return;
  }

  // Cleanup old preview
  if (avatar && avatar.startsWith('blob:')) {
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
      if (previewUrl.startsWith('blob:')) {
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
      <div className="min-h-screen w-full bg-yellow-50 overflow-y-auto px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <div className="flex w-full px-[em] justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col gap-8 py-6 lg:flex-row">
            {/* LEFT */}
            <div className="flex w-full flex-col gap-6 lg:w-[320px] xl:w-[340px] lg:flex-none">
              <div className="flex w-full flex-col items-center gap-3 rounded-3xl bg-white px-6 py-6 border border-neutral-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex w-full flex-col items-center gap-3">
                  {/* AVATAR */}
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Avatar size="x-large" image={avatar}>
                      PP
                    </Avatar>

                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="text-white text-xs">Change</span>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button
          onClick={() => handleSaveProfile()}
    disabled={!selectedAvatarFile || isSavingAvatar}
  >
    {isSavingAvatar ? "Saving..." : "Save Profile"}
  </Button>
                  </div>

                  <div className="flex w-full flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-heading-2 font-heading-2 text-default-font">
                        {user.name}
                      </span>
                      <FeatherCheckCircle className="text-body font-body text-green-600" />
                    </div>
                    <span className="text-body text-[16px] text-gray-600 text-center">
                      {user.domain}
                    </span>
                    <div className="flex items-center gap-1">
                      <FeatherMapPin className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption text-[14px] text-gray-600">
                        {user.location}
                      </span>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-gray-300" />
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-3">
                    <Badge
                      className="text-yellow-700 bg-yellow-100 rounded-full text-[12px]"
                      variant="warning"
                      icon={<FeatherTrophy />}
                    >
                      Global Rank{globalRank.rank}
                    </Badge>
                    <Badge
                      className="text-violet-700 bg-violet-100 rounded-full text-[12px]"
                      variant="brand"
                      icon={<FeatherAward />}
                    >
                      {locationRank.university.rank}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Activity This Week
                </span>
                <div className="flex w-full flex-col items-start gap-3">
                  <div className="flex w-full items-center gap-3">
                    <span className="w-28 text-[14px] text-gray-600">
                      Case Studies
                    </span>

                    {/* Progress */}
                    <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: "45%" }}
                      />
                    </div>

                    <span className="w-12 text-right text-[14px] font-semibold text-violet-600">
                      3/5
                    </span>
                  </div>
                  <div className="flex w-full items-center gap-3">
                    <span className="w-28 text-[14px] text-gray-600">
                      Hackathons
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: "50%" }}
                      />
                    </div>

                    <span className="w-12 text-right text-[14px] font-semibold text-yellow-600">
                      1/2
                    </span>
                  </div>

                  <div className="flex w-full items-center gap-3">
                    <span className="w-28 text-[14px] text-gray-600">
                      Interview Prep
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: "24%" }}
                      />
                    </div>

                    <span className="w-12 text-right text-[14px] font-semibold text-green-600">
                      1/10
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center justify-center rounded-full bg-green-50 px-4 py-3">
                  <span className="text-[12px] text-green-700 text-center">
                    You&#39;re more active than 78% of peers
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-end gap-2 px-2 py-2">
                <div className="flex w-full flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-heading-2 font-heading-2 text-default-font">
                      Professional Profile
                    </span>
                  </div>
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                            <FeatherBriefcase className="text-violet-600 text-[14px]" />
                          </div>

                          <span className="text-body-bold font-body-bold text-default-font">
                            Work Experience
                          </span>
                        </div>
                      </div>

                      
                      {workExperience?.map((exp: any, i: number) => (
                        <div key={i}>
                          <div className="flex w-full flex-col items-start gap-2">
                            <div className="flex w-full items-start justify-between">
                              <div className="flex flex-col items-start gap-1">
                                <span className="text-[16px] font-body-bold text-default-font">
                                  {exp.jobTitle}
                                </span>
                                <span className="text-[14px] text-neutral-600">
                                  {exp.companyName}
                                </span>
                                <span className="text-[14px] text-neutral-400">
                                  {exp.startYear} –{" "}
                                  {exp.currentlyWorking
                                    ? "Present"
                                    : exp.endYear || ""}
                                  {" · "}
                                  {exp.duration}
                                </span>
                                <span className="text-[16px] font-body-bold text-default-font">
                                  {exp.description}
                                </span>
                                <span className="text-[14px] text-neutral-400">
                                  {exp.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

        

                      {/* EDUCATION */}
                      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                      <div className="flex w-full flex-col items-start gap-3">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                              <FeatherAward className="text-yellow-600 text-[14px]" />
                            </div>

                            <span className="text-body-bold font-body-bold text-default-font">
                              Education
                            </span>
                          </div>
                        </div>
                     {education?.map((edu: any, i: number) => (
                      <div key={i}>
                       <div className="flex w-full flex-col items-start gap-2">
                         <div className="flex w-full items-start justify-between">
                           <div className="flex flex-col items-start gap-1">
                             <span className="text-[14px] text-neutral-800">
                                {edu.schoolName}
                             </span>
                             <span className="text-[12px] text-neutral-400">
                                 {edu.degree}
                             </span>
                             <span className="text-[12px] text-neutral-400">
                             {edu.startYear} – {edu.endYear || ""}
                             </span>
                           </div>
                         </div>
                       </div>
                     </div>
                    ))}
                  </div>

                      <div className="h-px w-full bg-neutral-200/60" />

                      <div className="flex w-full flex-col items-start gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                            <FeatherTool className="text-violet-600 text-[14px]" />
                          </div>
                          <span className="text-[16px] font-medium text-gray-700">
                            Skills
                          </span>
                        </div>

                        <div className="flex w-full flex-wrap gap-2">
                          {skills?.length > 0 ? (
                            skills.map((skill: any, i: number) => (
                            <Badge key={i}>
                             {typeof skill === "string" ? skill : skill.name}
                            </Badge>
                          ))
                       ) : (
                              <span className="text-sm text-gray-400">
                                 No skills added yet
                              </span>
                         )}
                          </div>
                      </div>

                      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                      <div className="flex w-full flex-col items-start gap-3">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                              <FeatherCheckCircle className="text-green-600 text-[14px]" />
                            </div>

                            <span className="text-body-bold font-body-bold text-default-font">
                              Certifications
                            </span>
                          </div>
                        </div>
                         {certifications?.map((cert: any, i: number) => (
                      <div key={i}>
                       <div className="flex w-full flex-col items-start gap-2">
                         <div className="flex w-full items-start justify-between">
                           <div className="flex flex-col items-start gap-1">
                             <span className="text-[14px] text-neutral-800">
                                {cert.certificationName}
                             </span>
                             <span className="text-[12px] text-neutral-400">
                                {cert.issuer}
                             </span>
                             <span className="text-[12px] text-neutral-400">
                         Issued {cert.issueDate}
                             </span>
                           </div>
                         </div>
                       </div>
                       </div>
                       ))}
                     </div>


                      </div>

                     {/* FEATURED PROJECTS */}
                      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                      <div className="flex w-full flex-col items-start gap-3">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                              <FeatherFolderOpen className="text-violet-600 text-[14px]" />
                            </div>

                            <span className="text-body-bold font-body-bold text-default-font">
                              Featured Projects
                            </span>
                          </div>
                        </div>
                        {projects?.map((proj: any, i: number) => (
                      <div key={i}>
                       <div className="flex w-full flex-col items-start gap-2">
                         <div className="flex w-full items-start justify-between">
                           <div className="flex flex-col items-start gap-1">
                             <span className="text-[14px] text-neutral-800">
                               {proj.title}
                             </span>
                             <span className="text-[12px] text-neutral-400">
                              {proj.summary}
                             </span>
                           </div>
                         </div>
                       </div>
                      </div>
                     ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          

            {/* CENTER */}
            <div className="flex w-full flex-col items-start gap-6 lg:w-[800px] lg:flex-none">
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[24px] sm:text-[28px] lg:text-[36px] font-semibold leading-tight text-gray-900">
                      Welcome back, {user.name} 👋
                    </span>
                  </div>

                  <span className="text-[14px] text-neutral-600">
                    Track progress, discover opportunities, and level up your
                    Hireability score.
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-center justify-between">
                  <span className="text-heading-2 font-heading-2 text-default-font">
                    Your Rankings
                  </span>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Global */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
                    <div
                      className={`h-14 w-14 flex items-center justify-center rounded-full ${GLOBAL_THEME.iconBg}`}
                    >
                      <FeatherGlobe className={GLOBAL_THEME.iconColor} />
                    </div>

                    <span className="text-[12px] text-neutral-600">Global</span>
                    <span className={`text-[32px] ${GLOBAL_THEME.valueColor}`}>
                      {globalRank.rank}
                    </span>

                    <Badge
                      className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs font-medium px-3 py-1 rounded-full"
                      variant={GLOBAL_THEME.badge}
                    >
                   Top {globalRank.percentile}%
                    </Badge>

                    <span className="text-[12px] text-green-500">
                    Better than {globalRank.betterThan} candidates
                    </span>
                  </div>

                  {/* California */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-md">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-neutral-100">
                      <FeatherMap className="text-neutral-500" />
                    </div>

                    <span className="text-[12px] text-neutral-600">
                      California
                    </span>
                    <span className="text-[28px] font-semibold text-gray-900">
                      {locationRank.state.rank}
                    </span>

                    <Badge
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 border-none py-1 rounded-full"
                      variant="neutral"
                    >
                    Top {locationRank.state.percentile}%
                    </Badge>

                    <span className="text-[12px] text-neutral-500 text-center">
                    Better than {locationRank.state.betterThan} candidates
                    </span>
                  </div>

                  {/* San Francisco */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-md">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-neutral-100">
                      <FeatherMapPin className="text-neutral-500" />
                    </div>

                    <span className="text-[12px] text-neutral-600">
                      San Francisco
                    </span>
                    <span className="text-[28px] font-semibold text-gray-900">
                      {locationRank.city.rank}
                    </span>

                    <Badge
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 border-none py-1 rounded-full"
                      variant="neutral"
                    >
                     Top {locationRank.city.percentile}%
                    </Badge>

                    <span className="text-[12px] text-neutral-500 text-center">
                       Better than {locationRank.city.betterThan} candidates
                    </span>
                  </div>

                  {/* Stanford */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-yellow-200 bg-gradient-to-b from-yellow-50 to-white px-6 py-8 shadow-md">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-yellow-100">
                      <FeatherUniversity className="text-yellow-600" />
                    </div>

                    <span className="text-[12px] text-neutral-600">
                      Stanford
                    </span>
                    <span className="text-[28px] font-semibold text-yellow-600">
                     {locationRank.university.rank}
                    </span>

                    <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-3 border-none py-1 rounded-full">
                       Top {locationRank.university.percentile}%
                    </Badge>

                    <span className="text-[12px] text-green-600 text-center">
                         Better than {locationRank.university.betterThan} peers
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full rounded-3xl border border-violet-200 mb-4 mt-4 bg-gradient-to-b from-[#F4F2FF] to-white px-8 py-8 shadow-md">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Hireability Index
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Evidence of job readiness and role-relevant knowledge
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <FeatherArrowUp className="h-4 w-4" />
                     {hireability.weeklyChange} this week
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-center">
                  {/* Circular Score */}
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="
      relative flex h-40 w-40 items-center justify-center rounded-full border-[8px] border-violet-100 bg-white
      shadow-[0_6px_20px_rgba(124,58,237,0.12)]
    "
                    >
                      {/* inner bold ring (SC1 thickness) */}
                      <div className="absolute h-[118px] w-[118px] rounded-full border-[8px] border-violet-500" />

                      {/* value */}
                      <span className="relative z-10 text-[40px] font-semibold leading-none text-violet-600">
                         {hireability.totalScore}
                      </span>
                    </div>

                    <Badge
                      variant="brand"
                      className="flex items-center rounded-full gap-1 bg-violet-100 text-violet-700 text-xs"
                      icon={<FeatherTarget className="h-3 w-3" />}
                    >
                   Just {hireability.nextRankPoints} points to next rank
                    </Badge>

                    <button className="text-sm font-medium text-violet-600 hover:underline">
                      Improve now
                    </button>
                  </div>

                  {/* Progress Section */}
                  <div className="flex w-full flex-col gap-6">
                    {/* Skill Index */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <FeatherTarget className="h-4 w-4 text-violet-600" />
                          <span className="font-medium">Skill Index</span>
                        </div>
                        <span className="text-violet-600">
                          {hireability.skill.score} / {hireability.skill.max}
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-neutral-200">
                        <div className ="h-2 rounded-full bg-violet-500"
                             style={{
                                width: `${
                                (hireability.skill.score / hireability.skill.max) * 100
                             }%`,
                         }} />
                      </div>
                    </div>

                    {/* Experience Index */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <FeatherBriefcase className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Experience Index</span>
                        </div>
                        <span className="text-green-600">                
                          {hireability.experience.score} / {hireability.experience.max}
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-neutral-200">
                        <div className="h-2 rounded-full bg-green-500"
                         style={{
                          width: `${
                          (hireability.experience.score /
                           hireability.experience.max) * 100
                                     }%`,
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full flex-col items-start gap-3">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[20px] text-default-font">
                      Improve Your Score
                    </span>
                    <div className="flex items-center gap-2">
                      <FeatherZap className="text-body font-body text-yellow-600" />
                      <span className="text-body font-body text-yellow-600">
                        4 actions available
                      </span>
                   </div>
                  </div>

                  <span className="text-body font-body text-gray-600">
                    Once you&#39;re out of retries, you can still take case
                    studies or participate in hackathons to increase your
                    Hireability Index.
                  </span>
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex w-full items-start gap-3 rounded-2xl border-2 border-solid border-violet-400 px-6 py-5 shadow-md bg-gradient-to-r from-violet-50 to-yellow-50">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-yellow-500">
                        <FeatherTarget className="text-heading-2 font-heading-2 text-white" />
                      </div>
                      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-heading-3 font-heading-3 text-default-font">
                            You&#39;re Almost There, {user.name}! 🎯
                          </span>
                          <FeatherZap className="text-body font-body text-yellow-600" />
                        </div>
                        <span className="text-body font-body text-default-font">
                          Just 10 points away from rank 22 at Stanford! Here are
                          the activities we recommend to jump to rank 22 in your
                          university
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border-2 border-solid border-violet-300 bg-white px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      {/* ICON — SC2 EXACT */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                        <FeatherFileText className="h-5 w-5 text-violet-600" />
                      </div>

                      <Badge
                        className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="brand"
                        icon={<FeatherZap />}
                      >
                        +50 Skill
                      </Badge>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Complete Assessment
                      </span>
                      <span className="text-[16px] font-body text-gray-600">
                        Begin Skill Index Assessment and boost your credibility
                        with role specific evaluation.
                      </span>
                    </div>

                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center gap-2">
                        <div className="flex items-center gap-1">
                          <FeatherRepeat className="text-caption font-caption text-violet-600" />
                          <span className="text-caption-bold font-caption-bold text-violet-600">
                            Paid retakes: 1
                          </span>
                        </div>
                        <div className="flex h-1 w-1 rounded-full bg-neutral-300" />
                        <div className="flex items-center gap-1">
                          <FeatherGift className="text-caption font-caption text-green-600" />
                          <span className="text-caption-bold font-caption-bold text-green-600">
                            Free retakes: 1
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherClock className="text-caption font-caption text-subtext-color" />
                        <span className="text-caption font-caption text-gray-600">
                          45 min
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-violet-700 hover:bg-violet-800"
                        variant="brand-primary"
                        icon={<FeatherArrowRight />}
                        onClick={() => handleNavigate("/assessment")}
                        >
                        Start Now
                      </Button>
                    </div>
                  </div>

                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border border-solid border-neutral-200 bg-neutral-50 px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-neutral-200">
                        <FeatherUsers className="text-heading-3 font-heading-3 text-neutral-500" />
                      </div>
                      <Badge
                        className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="neutral"
                        icon={<FeatherLock />}
                      >
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Participate in Hackathons
                      </span>
                      <span className="text-[16px] font-body text-gray-500">
                        Collaborate and build visibility with other product
                        managers in upcoming events.
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherCalendar className="text-caption font-caption text-neutral-400" />
                        <span className="text-caption font-caption text-neutral-400">
                          Starts in 5 days
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        disabled={true}
                        variant="neutral-tertiary"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {}}
                      >
                        Notify Me
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border-2 border-solid border-green-300 bg-white px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-green-100">
                        <FeatherBookOpen className="text-heading-3 font-heading-3 text-green-600" />
                      </div>
                      <Badge
                        className="flex items-center gap-1 bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="success"
                        icon={<FeatherZap />}
                      >
                        +40 Experience
                      </Badge>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Solve Case Studies
                      </span>
                      <span className="text-[16px] font-body text-gray-600">
                        Solving case studies adds to your experience score,
                        showing the recruiter you effort to increase your
                        knowledge base
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherClock className="text-caption font-caption text-subtext-color" />
                        <span className="text-caption font-caption text-gray-600">
                          15-20 min
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-violet-700 hover:bg-violet-800"
                        variant="brand-primary"
                        icon={<FeatherArrowRight />}
                         onClick={() => handleNavigate("")} //insert the link of the case study page
                      >
                        Start Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border border-solid border-neutral-200 bg-neutral-50 px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-neutral-200">
                        <FeatherBook className="text-heading-3 font-heading-3 text-neutral-500" />
                      </div>
                      <Badge
                        className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="neutral"
                        icon={<FeatherLock />}
                      >
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Courses
                      </span>
                      <span className="text-[16px] font-body text-gray-500">
                        {
                          "Complete structured learning path to earn verified PM certification badge."
                        }
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherClock className="text-caption font-caption text-neutral-400" />
                        <span className="text-caption font-caption text-neutral-400">
                          8 weeks
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        disabled={true}
                        variant="neutral-tertiary"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {}}
                      >
                        Notify Me
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
                <div className="flex w-full flex-col items-start gap-2 px-2 py-2" />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex w-full flex-col gap-6 lg:w-[320px] xl:w-[360px] lg:flex-none">
              {/* Top Product Managers */}
              <div className="w-full rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Top Product Managers at Your University
                </span>

                <div className="mt-4 max-h-[260px] overflow-y-auto pr-1 scrollbar-hide ">
                <div className="mt-4 flex flex-col gap-3 ">
                  {/* Rank 1 */}
                  <div className="flex items-center gap-3 rounded-3xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                    <Badge
                      className="rounded-full bg-yellow-200 icon-yellow-300"
                      variant="warning"
                      icon={<FeatherTrophy />}
                    >
                      #1
                    </Badge>
                    <Avatar
                      size="small"
                      image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
                    >
                      AS
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-body-bold text-default-font">
                        Anjali Sharma
                      </span>
                      <span className="text-caption text-subtext-color">
                        Hireability: 425
                      </span>
                    </div>
                  </div>

                  {/* Rank 2 */}
                  <div className="flex items-center gap-3 rounded-3xl border bg-white px-4 py-3">
                    <Badge variant="neutral">#2</Badge>
                    <Avatar
                      size="small"
                      image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64"
                    >
                      RK
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-body-bold text-default-font">
                        Rahul Kumar
                      </span>
                      <span className="text-caption text-subtext-color">
                        Hireability: 398
                      </span>
                    </div>
                  </div>

                  {/* You */}
                  <div className="flex items-center gap-3 rounded-3xl border border-brand-200 bg-violet-50 px-4 py-3">
                    <Badge className="rounded-full bg-violet-200 icon-violet-300">
                      #23
                    </Badge>
                    <Avatar
                      size="small"
                      image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64"
                    >
                      PP
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-body-bold text-violet-700">
                        You
                      </span>
                      <span className="text-caption text-violet-600">
                        Hireability: 350
                      </span>
                    </div>
                  </div>
                </div>
              </div>

                <Button
                  className="mt-4 h-8 text-[14px] rounded-full w-full"
                  variant="neutral-secondary"
                  size="small"
                  onClick={() => handleNavigate("/leaderboard")}

                >
                  View Full Leaderboard
                </Button>
                 {/* Hidden Avatar Input */}
                  <input
                  ref={fileRef}
                   type="file"
                   hidden
                   accept="image/*"
                    onChange={handleAvatarChange}
                />
              </div>

              {/* Recruiter Visibility */}
              <div className="w-full rounded-3xl border border-white bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <span className="text-body-bold text-default-font text-center block">
                  Recruiter Visibility Probability
                </span>

                <div className="mt-2 text-center">
                  <span className="text-[28px] text-yellow-600">            
                    {recruiterVisibility}%
                  </span>
                </div>

                <div className="mt-3 rounded-3xl border border-yellow-200 bg-yellow-50 px-4 py-2">
                  <span className="text-[12px]  text-yellow-700">
                    This probability is calculated from your rankings, effort
                    (case studies, hackathons, etc) and activity that recruiters
                    see, coupled with past data
                  </span>
                </div>
              </div>

              {/* Profile Views */}
              <div className="w-full rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-heading-3 font-heading-3 text-default-font">
                    Profile Views
                  </span>

                  <Badge
                    variant="brand"
                    icon={<FeatherUser2 />}
                    className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    15
                  </Badge>
                </div>

                {/* List */}
                <div className="mt-4 flex flex-col gap-3">
                  {[
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
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-3xl bg-neutral-100 px-4 py-3"
                    >
                      <Avatar size="small" image={p.img}>
                        {p.initials}
                      </Avatar>

                      <div className="flex flex-col flex-1">
                        <span className="text-body-bold font-body-bold text-default-font">
                          {p.name}
                        </span>
                        <span className="text-[14px] font-caption text-gray-600">
                          {p.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-neutral-400">
                        <FeatherClock className="h-3.5 w-3.5" />
                        <span className="text-caption font-caption">
                          {p.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-center gap-2 px-2 py-2">
                <div className="flex w-full flex-col items-start gap-6 rounded-3xl border border-solid border-neutral-100 bg-white px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[20px] font-heading-2 text-default-font">
                      Update Your Profile
                    </span>
                  </div>
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full flex-col items-start gap-3">
                      <span className="text-caption font-caption text-gray-600">
                        Got new updates? Add them over here!
                      </span>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-violet-100">
                            <FeatherFolderOpen className="text-caption font-caption text-violet-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Experience
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Showcase your impactful projects and product outcomes
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/experience")}
                      >
                        Add Experience
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-violet-100">
                            <FeatherFolderOpen className="text-caption font-caption text-violet-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Projects
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Showcase your impactful projects and product outcomes
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/projects")}
                      >
                        Add Project
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-yellow-100">
                            <FeatherAward className="text-caption font-caption text-yellow-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Education
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Update your educational background and achievements
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/education")}
                      >
                        Add Education
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-green-100">
                            <FeatherCheckCircle className="text-caption font-caption text-green-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Certifications
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Add relevant certifications to validate your expertise
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/certifications")}
                      >
                        Add Certification
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-violet-100">
                            <FeatherTool className="text-caption font-caption text-violet-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Skills
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        List your product management and technical skills
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/skills")}
                      >
                        Add Skills
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </DefaultPageLayout>
  );
}

// export default Dashboard;
