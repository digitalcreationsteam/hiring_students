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


  const [recruiterVisibility, setRecruiterVisibility] = useState(0);

  /* ==================== API CALLS ==================== */

  const fetchUserProfile = useCallback(async () => {
    const res = await API("GET", URL_PATH.getDemographics);

    setUser({
      name: res?.fullName || "",
      domain: res?.domain || "Professional",
      location: formatLocation(res?.city, res?.state),
    });

    setAvatar(res?.avatar || DEFAULT_AVATAR);
  }, []);

  const calculateExperienceIndex = useCallback(async () => {
    const res = await API("GET", URL_PATH.calculateExperienceIndex);
    const rank = res?.rank;

    setRankData({
      global: {
        rank: rank?.globalrank ?? "-",
        percentile: calculatePercentile(rank?.globalrank),
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
        rank: rank?.universityrank ?? "-",
        percentile: calculatePercentile(rank?.universityrank),
      },
    });
  }, []);

  const fetchHireabilityIndex = useCallback(async () => {
    const res = await API("GET", URL_PATH.calculateExperienceIndex);
    mapHireabilityFromAPI(res.hireabilityIndex);
  }, []);


  const mapHireabilityFromAPI = (hireabilityIndex: any) => {
    setHireability({
      totalScore: hireabilityIndex.hireabilityIndex,
      weeklyChange: 0,
      nextRankPoints:
        hireabilityIndex.experienceIndexTotal -
        hireabilityIndex.experienceIndexScore,
      skill: {
        score: hireabilityIndex.skillIndexScore,
        max: hireabilityIndex.skillIndexTotal,
      },
      experience: {
        score: hireabilityIndex.experienceIndexScore,
        max: hireabilityIndex.experienceIndexTotal,
      },
    });
  };

const fetchWorkExperience = useCallback(async () => {
  const res = await API("GET", URL_PATH.calculateExperienceIndex);

  setWorkExperience(
    (res?.data.workExperience || []).map((item: any) => ({
      jobTitle: item.jobTitle,
      companyName: item.companyName,
      startYear: item.startYear ?? null,
      endYear: item.endYear ?? null,
      duration: item.duration ?? null,
      description: item.description ?? "",
      location: item.location ?? "",
      currentlyWorking: item.currentlyWorking ?? false,
    }))
  );
}, []);

const fetchProjects = useCallback(async () => {
  const res = await API("GET", URL_PATH.calculateExperienceIndex);

  setProjects(
    (res?.data.projects || []).map((item: any) => ({
      title: item.projectName,
      summary: item.summary,
    }))
  );
}, []);

const fetchCertifications = useCallback(async () => {
  const res = await API("GET", URL_PATH.calculateExperienceIndex);

  setCertifications(
    (res?.data.certifications || []).map((item: any) => ({
      name: item.certificationName,
  issuedBy: item.issuer,
  issueYear: item.issueDate
    }))
  );
}, []);

const fetchEducation = useCallback(async () => {
  const res = await API("GET", URL_PATH.calculateExperienceIndex);

  setEducation(
    (res?.data.education || []).map((item: any) => ({
  schoolName: item.schoolName,
  degree: item.degree ,
  startYear: item.startYear,
  endYear: item.endYear,
  currentlyStudying: item.currentlyStudying
    }))
  );
}, []);

const fetchSkills = useCallback(async () => {
  const res = await API("GET", URL_PATH.calculateExperienceIndex);

  setEducation(
    (res?.data.skill || []).map((item: any) => ({
  name: item.skills
    }))
  );
}, []);

  /* ==================== EFFECTS ==================== */

  useEffect(() => {
    Promise.all([fetchUserProfile(), 
      calculateExperienceIndex(),
      fetchHireabilityIndex(),
      fetchWorkExperience(),
      fetchProjects(),
      fetchCertifications(),
      fetchEducation(),
    ]).catch(
      console.error
    );
  }, [
    fetchUserProfile, 
    calculateExperienceIndex, 
    fetchHireabilityIndex,
    fetchWorkExperience,
    fetchProjects,
    fetchCertifications,
    fetchEducation,

  ]);

  /* ==================== HANDLERS ==================== */

  const handleNavigate = (path: string) => navigate(path);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsSavingAvatar(true);
      await API("POST", URL_PATH.uploadProfile, formData);
      await fetchUserProfile();
    } catch (err) {
      console.error(err);
      alert("Avatar upload failed");
    } finally {
      setIsSavingAvatar(false);
    }
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

    return (
      CIRCUMFERENCE -
      (CIRCUMFERENCE * hireability.totalScore) / MAX_SCORE
    );
  }, [hireability.totalScore]);

  /* ==================== UI ==================== */

return (
    <DefaultPageLayout>
      <div className="min-h-screen w-full overflow-y-auto pb-12" style={{ backgroundColor: colors.cream }}>
        
        {/* TOP WELCOME BANNER */}
        <div className="w-full border-b" style={{ backgroundColor: colors.white, borderColor: colors.aqua }}>
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-end gap-4 px-4 sm:px-8 py-8 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: colors.primary }}>
                Welcome back, {user.name} 👋
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
                    <span className="text-xl font-bold" style={{ color: colors.primary }}>{user.name}</span>
                    <FeatherCheckCircle className="w-4 h-4" style={{ color: colors.secondary }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: colors.secondary }}>{user.domain}</p>
                  <div className="flex items-center justify-center gap-1 text-xs" style={{ color: colors.neutral[400] }}>
                    <FeatherMapPin className="w-3 h-3" />
                    <span>{user.location}</span>
                  </div>
                </div>

                <div className="flex w-full gap-2 mt-4">
                  <Badge className="flex-1 rounded-xl py-2 justify-center border-none" 
                         style={{ backgroundColor: colors.cream, color: colors.accent }} variant="warning" icon={<FeatherTrophy className="w-3 h-3"/>}>
                   Global Rank #{rankData.global.rank}
                  </Badge>
                  <Badge className="flex-1 rounded-xl py-2 justify-center border-none" 
                         style={{ backgroundColor: colors.mint, color: colors.secondary }} variant="brand" icon={<FeatherAward className="w-3 h-3"/>}>
                    University Rank #{rankData.university.rank}
                  </Badge>
                </div>
{/* 
                {selectedAvatarFile && (
                  <Button className="w-full mt-2 rounded-xl h-10 border-none font-bold" 
                          style={{ backgroundColor: colors.accent, color: colors.primary }} 
                          onClick={() => handleSaveProfile()} disabled={isSavingAvatar}>
                    {isSavingAvatar ? "Saving..." : "Save Profile Image"}
                  </Button>
                )} */}
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
                  { label: "Global Rank", val: rankData.global, pct: rankData.global.percentile, icon: <FeatherGlobe />, theme: colors.accent },
                  { label: "California", val: rankData.state, pct:rankData.state.percentile, icon: <FeatherMap />, theme: colors.secondary },
                  { label: "San Francisco", val: rankData.city, pct: rankData.city.percentile, icon: <FeatherMapPin />, theme: colors.primary },
                  { label: "Stanford", val: rankData.university, pct: rankData.university.percentile, icon: <FeatherUniversity />, theme: colors.accent }
                ].map((rank, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 rounded-3xl border p-6 shadow-sm text-center" 
                       style={{ backgroundColor: colors.white, borderColor: colors.aqua }}>
                    <div className="h-10 w-10 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.cream, color: rank.theme }}>
                      {rank.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{rank.label}</span>
                    <span className="text-3xl font-black" style={{ color: rank.theme }}>{rank.val.rank}</span>
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
                      {/* <p className="opacity-80 text-sm">You are just {hireability.nextRankPoints} points away from rank 22 at Stanford!</p> */}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
                           <span>Skill Index</span>
                           <span>{hireability.skill.score}/{hireability.skill.max}</span>
                         </div>
                         <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${skillProgress}%`, backgroundColor: colors.accent }} />
                         </div>
                       </div>
                       <div className="space-y-1">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
                           <span>Experience</span>
                           <span>{hireability.experience.score}/{hireability.experience.max}</span>
                         </div>
                         <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${experienceProgress}%`, backgroundColor: colors.aqua }} />
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
