// "use client";

// import React from "react";
// import { useNavigate } from "react-router-dom";

// import { colors } from "../common/Colors";
// import Navbar from "../ui/components/Navbar";
// import Footer from "../ui/components/Footer";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../ui/components/Card";
// import { Button } from "../ui/components/Button";
// import {
//   FeatherFolderOpen,
//   FeatherUniversity,
//   FeatherTool,
//   FeatherBriefcase,
//   FeatherAward,
//   FeatherPlus,
// } from "@subframe/core";

// function ProfilePage() {
//   const navigate = useNavigate();

//   const handleNavigate = (path: string) => {
//     navigate(path);
//   };

//   const profileSections = [
//     {
//       label: "Experience",
//       sub: "Highlight your roles, responsibilities, and measurable impact",
//       icon: <FeatherBriefcase />,
//       path: "/experience",
//     },
//     {
//       label: "Projects",
//       sub: "Showcase your impactful projects and product outcomes",
//       icon: <FeatherFolderOpen />,
//       path: "/projects",
//     },
//     {
//       label: "Education",
//       sub: "Update your educational background and achievements",
//       icon: <FeatherUniversity />,
//       path: "/education",
//     },
//     {
//       label: "Certifications",
//       sub: "Add relevant certifications to validate your expertise",
//       icon: <FeatherTool />,
//       path: "/certifications",
//     },
//     {
//       label: "Awards",
//       sub: "Highlight awards, recognitions, or notable activities",
//       icon: <FeatherAward />,
//       path: "/awards",
//     },
//     {
//       label: "Skills",
//       sub: "List your product management and technical skills",
//       icon: <FeatherTool />,
//       path: "/skills",
//     },
//   ];

//   return (
//     <div
//       style={{
//         background: `linear-gradient(
//           to bottom,
//           #d9d9d9 0%,
//           #cfd3d6 25%,
//           #9aa6b2 55%,
//           #2E4056 100%
//         )`,
//         minHeight: "100vh",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//       className="w-full relative"
//     >
//       <Navbar />
      
//       <div className="container mx-auto px-4 py-8 md:py-12">
//         {/* Header Section */}
//         <div className="text-center mb-8 md:mb-12">
//           <h1 
//             className="text-2xl md:text-4xl font-bold mb-2 md:mb-4"
//             style={{ color: colors.accent }}
//           >
//             Complete Your Profile
//           </h1>
//           <p className="text-sm md:text-base max-w-2xl mx-auto px-4" style={{ color: colors.accent }}>
//             Build a compelling professional story that stands out to recruiters
//           </p>
//         </div>

//         {/* Profile Sections Grid */}
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//             {profileSections.map((item, index) => (
//               <Card
//                 key={index}
//                 style={{ border: `1.5px solid ${colors.primaryGlow}` }}
//                 className="border bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
//               >
//                 <CardContent className="p-4 md:p-5">
//                   <div className="flex items-start gap-3 md:gap-4">
//                     {/* Icon */}
//                     <div
//                       className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full"
//                       style={{
//                         backgroundColor: colors.secondary,
//                         color: colors.white,
//                       }}
//                     >
//                       {item.icon}
//                     </div>

//                     {/* Content */}
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-sm md:text-base font-medium" style={{ color: colors.accent }}>
//                         {item.label}
//                       </h3>
//                       <p className="mt-1 text-xs leading-4 md:text-sm" style={{ color: colors.secondary }}>
//                         {item.sub}
//                       </p>
                      
//                       {/* Status Badge - Using your colors */}
//                       <div className="flex items-center gap-2 mt-3">
//                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
//                         <span className="text-xs" style={{ color: colors.accent }}>
//                           Not started
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   <Button
//                     onClick={() => handleNavigate(item.path)}
//                     className="mt-4 w-full rounded-xl py-2.5 md:py-3 text-xs md:text-sm font-medium transition-all duration-200 hover:opacity-90"
//                     style={{
//                       backgroundColor: colors.secondary,
//                       color: colors.white,
//                     }}
//                   >
//                     + Add {item.label}
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default ProfilePage;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { colors } from "../common/Colors";
import Navbar from "../ui/components/Navbar";
import Footer from "../ui/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/components/Card";
import { Button } from "../ui/components/Button";
import {
  FeatherFolderOpen,
  FeatherUniversity,
  FeatherTool,
  FeatherBriefcase,
  FeatherAward,
  FeatherPlus,
  FeatherUser,
  FeatherMapPin,
  FeatherGlobe,
  FeatherAward as FeatherRank,
  FeatherTrendingUp,
  FeatherStar,
} from "@subframe/core";

// API imports (adjust paths based on your project structure)
import API, { BASE_URL,  URL_PATH } from "../common/API";


// Helper function from your original code
const calculatePercentile = (rank?: number): string => {
  if (!rank || rank === 0) return "-";
  // This is a placeholder - adjust based on your actual percentile calculation
  const percentile = Math.max(0, 100 - rank).toFixed(1);
  return `${percentile}%`;
};

const formatLocation = (city?: string, state?: string): string => {
  if (!city && !state) return "Not specified";
  if (city && state) return `${city}, ${state}`;
  return city || state || "Not specified";
};

interface UserData {
  name: string;
  domain: string;
  location: string;
  avatar: string;
}

interface RankData {
  global: { rank: string | number; percentile: string };
  country: { rank: string | number; percentile: string };
  state: { rank: string | number; percentile: string };
  city: { rank: string | number; percentile: string };
  university: { rank: string | number; percentile: string };
}

interface HireabilityData {
  totalScore: number;
  weeklyChange: number;
  nextRankPoints: number;
  skill: { score: number; max: number };
  experience: { score: number; max: number };
}

interface WeeklyActivityData {
  caseStudies: { val: string; pct: string };
  hackathons: { val: string; pct: string };
}

function ProfilePage() {
  const navigate = useNavigate();
  
  // State for user data
  const [user, setUser] = useState<UserData>({
    name: "",
    domain: "",
    location: "",
    avatar: "",
  });
  
  const [rankData, setRankData] = useState<RankData>({
    global: { rank: "-", percentile: "-" },
    country: { rank: "-", percentile: "-" },
    state: { rank: "-", percentile: "-" },
    city: { rank: "-", percentile: "-" },
    university: { rank: "-", percentile: "-" },
  });
  
  const [hireability, setHireability] = useState<HireabilityData>({
    totalScore: 0,
    weeklyChange: 0,
    nextRankPoints: 0,
    skill: { score: 0, max: 0 },
    experience: { score: 0, max: 0 },
  });
  
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityData>({
    caseStudies: { val: "0/5", pct: "0%" },
    hackathons: { val: "0/2", pct: "0%" },
  });
  
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityLeaderboard, setUniversityLeaderboard] = useState<any[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API("GET", URL_PATH.calculateExperienceIndex);

      console.log("fetchDashboardData response:", res);
      if (!res) return;

      /* DEMOGRAPHICS */
      const demo = res?.data?.demographics?.[0];
      setUser({
        name: demo?.fullName || "",
        domain: res?.jobdomain || "",
        location: formatLocation(demo?.city, demo?.state),
        avatar: "", // Will be updated below
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

      setUser(prev => ({
        ...prev,
        avatar: normalizedProfile || ""
      }));

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

      /* EDUCATION */
      const educationList = res?.data?.education || [];
      setEducation(educationList);

      /* GET UNIVERSITY NAME */
      const userUniversity = educationList?.[0]?.schoolName;

      if (userUniversity) {
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

      /* 🔥 FETCH CASE STUDY ATTEMPTS THIS WEEK */
      if (demo?.id) {
        try {
          const caseStudyRes = await API(
            "GET",
            `/api/user-case-attempts/${demo.id}/weekly`, // your API path
          );

          const weeklyAttempts = caseStudyRes?.totalAttempts ?? 0;
          const totalCaseStudies = 5; // replace with dynamic if available
          const pct = Math.round((weeklyAttempts / totalCaseStudies) * 100);

          // Save in state for your card
          setWeeklyActivity({
            caseStudies: {
              val: `${weeklyAttempts}/${totalCaseStudies}`,
              pct: `${pct}%`,
            },
            // Add hackathons later if you have API
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
      console.error("message:", err?.message);
      console.error("response:", err?.response?.data);

      // fallback - avoid crash
      setUser(prev => ({
        ...prev,
        avatar: ""
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const profileSections = [
    {
      label: "Experience",
      sub: "Highlight your roles, responsibilities, and measurable impact",
      icon: <FeatherBriefcase />,
      path: "/experience",
      count: workExperience.length,
    },
    {
      label: "Projects",
      sub: "Showcase your impactful projects and product outcomes",
      icon: <FeatherFolderOpen />,
      path: "/projects",
      count: projects.length,
    },
    {
      label: "Education",
      sub: "Update your educational background and achievements",
      icon: <FeatherUniversity />,
      path: "/education",
      count: education.length,
    },
    {
      label: "Certifications",
      sub: "Add relevant certifications to validate your expertise",
      icon: <FeatherTool />,
      path: "/certifications",
      count: certifications.length,
    },
    {
      label: "Awards",
      sub: "Highlight awards, recognitions, or notable activities",
      icon: <FeatherAward />,
      path: "/awards",
      count: 0, // Add awards count if you have the data
    },
    {
      label: "Skills",
      sub: "List your product management and technical skills",
      icon: <FeatherTool />,
      path: "/skills",
      count: skills.length,
    },
  ];

  if (loading) {
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
          minHeight: "100vh",
          fontFamily: "'Poppins', sans-serif",
        }}
        className="w-full relative flex items-center justify-center"
      >
        <Navbar />
        <div className="text-center" style={{ color: colors.accent }}>
          Loading your profile...
        </div>
        <Footer />
      </div>
    );
  }

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
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
      className="w-full relative"
    >
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* User Profile Header Card */}
        <Card
          style={{ border: `1.5px solid ${colors.primaryGlow}` }}
          className="border bg-white overflow-hidden mb-8 hover:shadow-lg transition-shadow duration-300"
        >
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4" style={{ borderColor: colors.secondary }}>
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                </div>
                <Button
                  onClick={() => handleNavigate("/profile/edit")}
                  className="absolute -bottom-2 -right-2 rounded-full p-2 w-10 h-10"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.white,
                  }}
                >
                  <FeatherPlus />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.accent }}>
                      {user.name || "Add Your Name"}
                    </h1>
                    <div className="flex flex-wrap gap-4">
                      {user.domain && (
                        <div className="flex items-center gap-2">
                          <FeatherBriefcase style={{ color: colors.secondary }} />
                          <span className="text-sm" style={{ color: colors.accent }}>{user.domain}</span>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-2">
                          <FeatherMapPin style={{ color: colors.secondary }} />
                          <span className="text-sm" style={{ color: colors.accent }}>{user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleNavigate("/profile/edit")}
                    className="px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.white,
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                    <div className="text-xl font-bold" style={{ color: colors.secondary }}>{hireability.totalScore}</div>
                    <div className="text-xs" style={{ color: colors.accent }}>Hireability Score</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                    <div className="text-xl font-bold" style={{ color: colors.secondary }}>{rankData.global.rank}</div>
                    <div className="text-xs" style={{ color: colors.accent }}>Global Rank</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                    <div className="text-xl font-bold" style={{ color: colors.secondary }}>{workExperience.length}</div>
                    <div className="text-xs" style={{ color: colors.accent }}>Experiences</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                    <div className="text-xl font-bold" style={{ color: colors.secondary }}>{skills.length}</div>
                    <div className="text-xs" style={{ color: colors.accent }}>Skills</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rank Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(rankData).map(([key, value]) => (
            <Card
              key={key}
              style={{ border: `1.5px solid ${colors.primaryGlow}` }}
              className="border bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs capitalize" style={{ color: colors.accent }}>{key} Rank</span>
                  <FeatherRank style={{ color: colors.secondary }} />
                </div>
                <div className="text-xl font-bold" style={{ color: colors.secondary }}>{value.rank}</div>
                <div className="text-xs mt-1" style={{ color: colors.accent }}>Percentile: {value.percentile}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Activity & Hireability */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Activity */}
          <Card
            style={{ border: `1.5px solid ${colors.primaryGlow}` }}
            className="border bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 lg:col-span-2"
          >
            <CardHeader>
              <CardTitle style={{ color: colors.accent }}>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: colors.accent }}>Case Studies</span>
                    <FeatherTrendingUp style={{ color: colors.secondary }} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: colors.secondary }}>{weeklyActivity.caseStudies.val}</div>
                  <div className="text-xs mt-1" style={{ color: colors.accent }}>Completion: {weeklyActivity.caseStudies.pct}</div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: colors.accent }}>Hackathons</span>
                    <FeatherStar style={{ color: colors.secondary }} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: colors.secondary }}>{weeklyActivity.hackathons.val}</div>
                  <div className="text-xs mt-1" style={{ color: colors.accent }}>Participation: {weeklyActivity.hackathons.pct}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hireability Breakdown */}
          <Card
            style={{ border: `1.5px solid ${colors.primaryGlow}` }}
            className="border bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle style={{ color: colors.accent }}>Hireability Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: colors.accent }}>Skills</span>
                    <span style={{ color: colors.secondary }}>{hireability.skill.score}/{hireability.skill.max}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.secondary}20` }}>
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(hireability.skill.score / hireability.skill.max) * 100}%`,
                        backgroundColor: colors.secondary 
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: colors.accent }}>Experience</span>
                    <span style={{ color: colors.secondary }}>{hireability.experience.score}/{hireability.experience.max}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.secondary}20` }}>
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(hireability.experience.score / hireability.experience.max) * 100}%`,
                        backgroundColor: colors.secondary 
                      }}
                    />
                  </div>
                </div>
                <div className="pt-2 text-sm" style={{ color: colors.accent }}>
                  Next rank: <span style={{ color: colors.secondary }}>{hireability.nextRankPoints}</span> points needed
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Sections Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: colors.accent }}>
            Complete Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {profileSections.map((item, index) => (
              <Card
                key={index}
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="border bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Icon */}
                    <div
                      className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: colors.secondary,
                        color: colors.white,
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm md:text-base font-medium" style={{ color: colors.accent }}>
                        {item.label}
                      </h3>
                      <p className="mt-1 text-xs leading-4 md:text-sm" style={{ color: colors.secondary }}>
                        {item.sub}
                      </p>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ 
                          backgroundColor: item.count > 0 ? colors.secondary : colors.accent 
                        }} />
                        <span className="text-xs" style={{ color: colors.accent }}>
                          {item.count > 0 ? `${item.count} added` : "Not started"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleNavigate(item.path)}
                    className="mt-4 w-full rounded-xl py-2.5 md:py-3 text-xs md:text-sm font-medium transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.white,
                    }}
                  >
                    {item.count > 0 ? `Edit ${item.label}` : `+ Add ${item.label}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProfilePage;
