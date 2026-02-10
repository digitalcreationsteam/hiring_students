"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { FeatherArrowRight } from "@subframe/core";
import { FeatherAward } from "@subframe/core";
import { FeatherBookOpen } from "@subframe/core";
import { FeatherCalendar } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherGlobe } from "@subframe/core";
import { FeatherMap } from "@subframe/core";
import { FeatherMapPin } from "@subframe/core";
import { FeatherShield } from "@subframe/core";
import { FeatherTarget } from "@subframe/core";
import { FeatherUsers } from "@subframe/core";
import { FeatherArrowLeft } from "@subframe/core";
import { useNavigate, useLocation } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { colors } from "src/common/Colors";
// At the top of AssessmentResult.tsx, add this import:



type RankItem = {
  rank: number | string;
};

type Violation = {
  type: "COPY" | "PASTE" | "TAB_SWITCH";
  at: string;
};

type IntegrityReport = {
  attemptId: string;
  integrityScore: number;
  integrityLevel: string;
  cheatAlertSent: boolean;
  totalViolations: number;
  level: string;
  violationBreakdown: {
    COPY: number;
    PASTE: number;
    TAB_SWITCH: number;
  };
  violationTimeline: Violation[];
};

function AssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isResultLoading, setIsResultLoading] = useState(true);

  const [result, setResult] = useState<{
    skillIndex: number;
    maxSkillIndex: number;
  } | null>(null);

  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number | null>(null);
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [loading, setLoading] = useState(false);

    const userId = sessionStorage.getItem("userId"); // or however you store


  const [rankData, setRankData] = useState<{
    global: RankItem;
    country: RankItem;
    state: RankItem;
    city: RankItem;
    university: RankItem;
  }>({
    global: { rank: "-" },
    country: { rank: "-" },
    state: { rank: "-" },
    city: { rank: "-" },
    university: { rank: "-" },
  });

  // ✅ GET API TO FETCH THE RESULT
  const fetchResult = useCallback(async () => {
    const attemptId =
      location.state?.attemptId ||
      localStorage.getItem("attemptId") ||
      sessionStorage.getItem("attemptId");

    if (!attemptId) {
      setIsResultLoading(false);
      return;
    }

      const localSubmitted = sessionStorage.getItem(`submittedAt-${attemptId}`);
  if (localSubmitted) {
    setSubmittedAt(new Date(Number(localSubmitted)).toISOString());
  }

  const localStart = sessionStorage.getItem(`startedAt-${attemptId}`);
  if (localStart && localSubmitted) {
    const diff = Math.max(
      0,
      Math.floor((Number(localSubmitted) - Number(localStart)) / 1000)
    );
    setTimeTakenSeconds(diff);
  }

    try {
      const res = await API("GET", `${URL_PATH.result}?attemptId=${attemptId}`);

      console.log("FINAL RESPONSE:", res);
 // ✅ Integrity Data
if (res?.integrity) {
  setReport({
    attemptId: res?.attempt?._id || "",
    integrityScore: res.integrity.score,
    integrityLevel: res.integrity.level,
    cheatAlertSent: res.integrity.cheatAlertSent,
    totalViolations: res.integrity.totalViolations,
    level: res.integrity.level,
    violationBreakdown: {
      COPY: 0,
      PASTE: 0,
      TAB_SWITCH: 0,
    },
    violationTimeline: [],
  });
}

      setResult({
        skillIndex: res?.hireabilityIndex?.skillIndexScore ?? 0,
        maxSkillIndex: res?.hireabilityIndex?.skillIndexTotal ?? 0,
      });

      // ✅ 1) submittedAt (backend first)
      const submitted: string | null =
        res?.attempt?.submittedAt ||
        res?.submittedAt ||
        res?.attempt?.endedAt ||
        null;

      if (submitted) {
        setSubmittedAt(submitted);
      } else {
        // fallback: if you stored locally
        const localSubmitted = sessionStorage.getItem(`submittedAt-${attemptId}`);
        if (localSubmitted) {
          setSubmittedAt(new Date(Number(localSubmitted)).toISOString());
        }
      }

      // ✅ 2) time taken (backend first)
      const takenSeconds: number | null =
        res?.attempt?.timeTakenSeconds ??
        res?.timeTakenSeconds ??
        res?.attempt?.durationSeconds ??
        null;

      if (typeof takenSeconds === "number") {
        setTimeTakenSeconds(takenSeconds);
      } else {
        // fallback compute using stored startedAt/submittedAt
        const start = sessionStorage.getItem(`startedAt-${attemptId}`);
        const end = sessionStorage.getItem(`submittedAt-${attemptId}`);
        if (start && end) {
          const diff = Math.max(0, Math.floor((Number(end) - Number(start)) / 1000));
          setTimeTakenSeconds(diff);
        }
      }
    } catch (error) {
      console.error("Failed to fetch result", error);
      setResult(null);
    } finally {
      setIsResultLoading(false);
    }
  }, [location.state?.attemptId]);

  // ✅ FETCH RANKS
  const fetchRanks = useCallback(async () => {
    try {
      const res = await API("GET", URL_PATH.calculateExperienceIndex);

      console.log("fetchRanks response:", res);
      if (!res) return;

      const rank = res?.rank ?? {};

      setRankData({
        global: { rank: rank?.globalRank ?? "-" },
        country: { rank: rank?.countryRank ?? "-" },
        state: { rank: rank?.stateRank ?? "-" },
        city: { rank: rank?.cityRank ?? "-" },
        university: { rank: rank?.universityRank ?? rank?.universityrank ?? "-" },
      });
    } catch (err) {
      console.error("fetchRanks failed:", err);
    }
  }, []);




  useEffect(() => {
    fetchResult();
    fetchRanks();

     // Optional: Auto-redirect after 10 seconds
  // const timer = setTimeout(() => {
  //   navigate('/dashboard', { replace: true });
  // }, 10000);

  // return () => clearTimeout(timer);

  }, [fetchResult, fetchRanks, navigate]);

  // ✅ LOADING STATE
  if (isResultLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <span className="text-subtext-color text-lg">Loading result...</span>
      </div>
    );
  }

  // ✅ HELPERS (add exactly here)
  const formatDate = (iso?: string | null) => {
    if (!iso) return "--";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (seconds?: number | null) => {
    if (typeof seconds !== "number" || seconds < 0) return "--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} min ${s} sec`;
  };

  const formattedSubmittedDate = formatDate(submittedAt);
  const formattedTimeTaken = formatDuration(timeTakenSeconds);


//   return (
//     <div className="w-full bg-neutral-50 py-12">
//       <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-8 px-4">
//         {/* Header */}
//         <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-col gap-1">
//             <span className="text-xl font-semibold text-default-font">
//               Assessment Results
//             </span>
//             <span className="text-sm text-subtext-color">
//               Product Management · Skill Index
//             </span>
//           </div>
//         </div>

//         <div className="relative w-full overflow-hidden rounded-3xl border-[3px] border-violet-300 bg-gradient-to-b from-[#F4F2FF] to-white px-4 py-8 sm:px-12 sm:py-14 shadow-lg">
//           {/* Score */}
//           <div className="flex flex-col items-center gap-6">
//             <div className="flex items-end gap-3">
//               <span className="text-[64px] sm:text-[80px] lg:text-[96px] font-bold leading-none text-violet-600">
//                 {result?.skillIndex ?? "--"}
//               </span>

//               <span className="text-[20px] sm:text-[28px] lg:text-[32px] font-medium text-subtext-color pb-2 sm:pb-4">
//                 / {result?.maxSkillIndex ?? "--"}
//               </span>
//             </div>
//           </div>

//           {/* Performance Tier */}
//           <div className="mt-8 flex w-full max-w-[768px] flex-col items-center gap-6 mx-auto">
//             <div className="flex flex-col items-center">
//               <span className="text-sm text-subtext-color">
//                 Performance Tier
//               </span>
//               <span className="text-base font-semibold text-violet-600">
//                 Top 15%
//               </span>
//             </div>

//             {/* Tier Progress */}
//             <div className="flex w-full items-center gap-4 overflow-x-auto sm:overflow-visible px-2 sm:px-0">
//               {/* Development */}
//               <div className="flex flex-col items-center gap-2 shrink-0">
//                 <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-neutral-300">
//                   <span className="text-xs font-medium text-neutral-600">
//                     40%
//                   </span>
//                 </div>
//                 <span className="text-xs text-neutral-600">Development</span>
//               </div>

//               <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

//               {/* Competent */}
//               <div className="flex flex-col items-center gap-2 shrink-0">
//                 <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-neutral-300">
//                   <span className="text-xs font-medium text-neutral-600">
//                     25%
//                   </span>
//                 </div>
//                 <span className="text-xs text-neutral-600">Competent</span>
//               </div>

//               <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

//               {/* You are here (Blinking) */}
//               <div className="flex flex-col items-center gap-2 shrink-0 animate-soft-blink">
//                 <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-violet-500">
//                   <span className="text-sm font-semibold text-white">15%</span>
//                 </div>
//                 <span className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
//                   You are here
//                 </span>
//               </div>

//               <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

//               {/* Advanced */}
//               <div className="flex flex-col items-center gap-2 shrink-0">
//                 <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-dashed border-violet-300 bg-white">
//                   <span className="text-xs font-medium text-violet-600">
//                     10%
//                   </span>
//                 </div>
//                 <span className="text-xs text-violet-600">Advanced</span>
//               </div>

//               <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

//               {/* Master */}
//               <div className="flex flex-col items-center gap-2 shrink-0">
//                 <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-dashed border-neutral-300 bg-white">
//                   <span className="text-xs font-medium text-neutral-500">
//                     10%
//                   </span>
//                 </div>
//                 <span className="text-xs text-neutral-500">Master</span>
//               </div>
//             </div>

//             {/* Info Bar */}
//             <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-100 px-4 py-3">
//               <span className="text-sm font-medium text-violet-700">
//                 → Just 3 points from Top 10%
//               </span>
//             </div>
//           </div>
//         </div>

//        <div className="w-full rounded-3xl border border-neutral-200 bg-white shadow-md">
//   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8 px-4 sm:px-8 py-4">
//     {/* Item 1 */}
//     <div className="flex items-center gap-3 sm:gap-2">
//       <FeatherCalendar className="text-sm text-green-600 shrink-0" />
//       <div className="flex flex-col min-w-0">
//         <span className="text-[14px] font-medium text-default-font truncate">
//           {formattedSubmittedDate}
//         </span>
//         <span className="text-xs text-subtext-color">Completed</span>
//       </div>
//     </div>

//     {/* Divider */}
//     <div className="h-px w-full bg-neutral-200 sm:h-6 sm:w-px" />

//     {/* Item 2 */}
//     <div className="flex items-center gap-3 sm:gap-2">
//       <FeatherClock className="text-sm text-violet-600 shrink-0" />
//       <div className="flex flex-col min-w-0">
//         <span className="text-[14px] font-medium text-default-font truncate">
//           {formattedTimeTaken}
//         </span>
//         <span className="text-xs text-subtext-color">Time Taken</span>
//       </div>
//     </div>

//     {/* Divider */}
//     <div className="h-px w-full bg-neutral-200 sm:h-6 sm:w-px" />

//     {/* Item 3 */}
  

//     <div className="flex items-center gap-3 sm:gap-2">
//   <FeatherShield className="text-sm text-green-600 shrink-0" />
//   <div className="flex flex-col min-w-0">
//     <span className="text-[14px] font-medium text-default-font truncate">
//       {/* {report ? `${report.integrityScore}/100 • ${report.integrityLevel}` : "—"} */}
//       {report ? ` ${report.integrityLevel}` : "—"}
//     </span>
//     <span className="text-xs text-subtext-color">Integrity Score</span>
//   </div>
// </div>

//   </div>
// </div>


//         <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//   {/* University */}
//   {/* <div className="flex min-w-[220px] grow flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
//     <IconWithBackground
//       className="text-yellow-700 bg-yellow-100 rounded-full text-[20px]"
//       variant="warning"
//       size="large"
//       icon={<FeatherAward />}
//     />
//     <span className="text-lg font-semibold text-default-font">
//       {rankData.university.rank !== "-" ? `#${rankData.university.rank}` : "--"}
//     </span>
//     <span className="text-sm text-subtext-color">University Ranking</span>
//   </div> */}

//   {/* City */}
//   <div className="flex min-w-[220px] grow flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
//     <IconWithBackground
//       className="text-violet-700 bg-violet-100 rounded-full text-[20px]"
//       variant="brand"
//       size="large"
//       icon={<FeatherMapPin />}
//     />
//     <span className="text-lg font-semibold text-default-font">
//       {rankData.city.rank !== "-" ? `#${rankData.city.rank}` : "--"}
//     </span>
//     <span className="text-sm text-subtext-color">City Ranking</span>
//   </div>

//   {/* Country */}
//   <div className="flex min-w-[220px] grow flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
//     <IconWithBackground
//       className="text-violet-700 bg-violet-100 rounded-full text-[20px]"
//       variant="brand"
//       size="large"
//       icon={<FeatherMap />}
//     />
//     <span className="text-lg font-semibold text-default-font">
//       {rankData.country.rank !== "-" ? `#${rankData.country.rank}` : "--"}
//     </span>
//     <span className="text-sm text-subtext-color">Country Ranking</span>
//   </div>

//   {/* Global */}
//   <div className="flex min-w-[220px] grow flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
//     <IconWithBackground
//       className="text-violet-700 bg-violet-100 rounded-full text-[20px]"
//       variant="brand"
//       size="large"
//       icon={<FeatherGlobe />}
//     />
//     <span className="text-lg font-semibold text-default-font">
//       {rankData.global.rank !== "-" ? `#${rankData.global.rank}` : "--"}
//     </span>
//     <span className="text-sm text-subtext-color">Global Ranking</span>
//   </div>
// </div>



//         {/* <div className="flex w-full flex-col items-start gap-6 rounded-3xl border border-solid border-neutral-border bg-white px-8 py-8 shadow-md">
//           <div className="flex w-full items-center gap-3">
//             <FeatherTarget className="text-heading-3 font-heading-3 text-violet-700" />
//             <span className="text-heading-3 font-heading-3 text-default-font">
//               Your Next Moves
//             </span>
//           </div>
//           <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <div className="flex min-w-[288px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border-2 border-solid border-yellow-400 bg-yellow-50 px-6 py-6 shadow-lg">
//               <div className="flex items-center gap-2">
//                 <FeatherClock className="text-body font-body text-yellow-700" />
//                 <Badge
//                   className="rounded-3xl  bg-yellow-100 text-yellow-700 border-none"
//                   variant="warning"
//                 >
//                   Limited Time
//                 </Badge>
//               </div>
//               <span className="text-bold font-body-bold text-default-font">
//                 Retake Assessment
//               </span>
//               <span className="text-sm font-body text-subtext-color">
//                 You have 1 free retake, and 1 paid retake remaining. Improve
//                 your score to increase your rankings.
//               </span>
//               <Button
//                 className="h-10 w-full flex-none rounded-2xl text-violet-700 bg-violet-700"
//                 variant="brand-primary"
//                 size="large"
//                 iconRight={<FeatherArrowRight />}
//                 onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
//               >
//                 Retake Now
//               </Button>
//             </div>
//             <div className="flex min-w-[288px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-md">
//               <FeatherUsers className="text-heading-3 font-heading-3 text-violet-700" />
//               <span className="text-bold font-body-bold text-default-font mb-2">
//                 Compare with Top Performers
//               </span>
//               <span className="text-sm font-body text-subtext-color">
//                 See how you stack up against top performers in your region.
//               </span>
//               <Button
//                 className="h-10 w-full flex-none rounded-2xl text-violet-700 bg-violet-100"
//                 variant="brand-secondary"
//                 size="large"
//                 onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
//               >
//                 View Leaderboard
//               </Button>
//             </div>
//             <div className="flex min-w-[288px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-md">
//               <FeatherBookOpen className="text-heading-3 font-heading-3 text-violet-700" />
//               <span className="text-bold font-body-bold text-default-font mb-2">
//                 Improve Score
//               </span>
//               <span className="text-sm font-body text-subtext-color">
//                 Out of retakes? See how you can improve your score
//               </span>
//               <Button
//                 className="h-10 w-full flex-none rounded-2xl text-violet-700 bg-violet-100 "
//                 variant="brand-secondary"
//                 size="large"
//                 onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
//               >
//                 View Resources
//               </Button>
//             </div>
//           </div>
//         </div> */}

        
//         <div className="flex w-full items-center justify-center opacity-60">
//           <Button
//             className="w-full max-w-[180px] h-10 rounded-2xl bg-violet-600 hover:bg-violet-800 text-white font-semibold"
//             size="large"
//             iconRight={<FeatherArrowRight />}
//             onClick={() => navigate("/dashboard")}
//           >
//             Go to Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
    return (
  <div className="min-h-screen relative overflow-hidden">
    {/* Blended background - Covers entire page */}
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: colors.background }}
      />

      <div
        className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
        style={{
          background: `radial-gradient(circle at 60% 60%, ${colors.primary || "#7c3aed"}AA, transparent 52%)`,
        }}
      />

      <div
        className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${colors.secondary || "#4f46e5"}99, transparent 62%)`,
        }}
      />

      <div
        className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.accent || "#ec4899"}44, transparent 62%)`,
        }}
      />
    </div>

    {/* Header and content with z-index to stay above background */}
    <div className="relative z-10">
      <div className="w-full py-12">
        <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-8 px-4">
          {/* Header */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-default-font">
                Assessment Results
              </span>
              <span className="text-sm text-subtext-color">
                Product Management · Skill Index
              </span>
            </div>
          </div>

          <div style={{backgroundColor: colors.white}} className="relative w-full overflow-hidden rounded-3xl border-[3px] bg-gradient-to-b from-[#F4F2FF] to-white px-4 py-8 sm:px-12 sm:py-14 shadow-lg">
            {/* Score */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-end gap-3">
                <span style={{color: colors.accent}} className="text-[64px] sm:text-[80px] lg:text-[96px] font-bold leading-none">
                  {result?.skillIndex ?? "--"}
                </span>

                <span className="text-[20px] sm:text-[28px] lg:text-[32px] font-medium text-subtext-color pb-2 sm:pb-4">
                  / {result?.maxSkillIndex ?? "--"}
                </span>
              </div>
            </div>

            {/* Performance Tier */}
            <div className="mt-8 flex w-full max-w-[768px] flex-col items-center gap-6 mx-auto">
              <div className="flex flex-col items-center">
                <span className="text-sm text-subtext-color">
                  Performance Tier
                </span>
                <span className="text-base font-semibold">
                  Top 15%
                </span>
              </div>

              {/* Tier Progress */}
              <div className="flex w-full items-center gap-4 overflow-x-auto sm:overflow-visible px-2 sm:px-0">
                {/* Development */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div style={{backgroundColor: colors.primaryGlow}} className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-neutral-300">
                    <span className="text-xs font-medium text-neutral-600">
                      40%
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600">Development</span>
                </div>

                <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

                {/* Competent */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div style={{backgroundColor: colors.primaryGlow}} className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-neutral-300">
                    <span className="text-xs font-medium text-neutral-600">
                      25%
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600">Competent</span>
                </div>

                <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

                {/* You are here (Blinking) */}
                <div className="flex flex-col items-center gap-2 shrink-0 animate-soft-blink">
                  <div style={{backgroundColor: colors.primary}} className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-violet-500">
                    <span className="text-sm font-semibold text-black">15%</span>
                  </div>
                  <span style={{backgroundColor: colors.primaryGlow, color: "black"}} className="rounded-full px-3 py-1 text-xs text-violet-700">
                    You are here
                  </span>
                </div>

                <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

                {/* Advanced */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div style={{backgroundColor: colors.primary}} className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-dashed border-violet-300 bg-white">
                    <span style={{color: "black"}} className="text-xs font-medium">
                      10%
                    </span>
                  </div>
                  <span style={{color: "black"}} className="text-xs">Advanced</span>
                </div>

                <div className="hidden sm:block h-1 flex-1 rounded-full bg-neutral-300" />

                {/* Master */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div style={{backgroundColor: colors.primary}} className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-dashed border-neutral-300 bg-white">
                    <span style={{color: "black"}} className="text-xs font-medium text-neutral-500">
                      10%
                    </span>
                  </div>
                  <span style={{color: "black"}} className="text-xs text-neutral-500">Master</span>
                </div>
              </div>

              {/* Info Bar */}
              <div style={{backgroundColor: colors.primaryGlow}} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3">
                <span className="text-sm font-medium">
                  → Just 3 points from Top 10%
                </span>
              </div>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-neutral-200 bg-white shadow-md bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8 px-4 sm:px-8 py-4">
              {/* Item 1 */}
              <div className="flex items-center gap-3 sm:gap-2">
                <FeatherCalendar className="text-sm  shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium text-default-font truncate">
                    {formattedSubmittedDate}
                  </span>
                  <span className="text-xs text-subtext-color">Completed</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-neutral-200 sm:h-6 sm:w-px" />

              {/* Item 2 */}
              <div className="flex items-center gap-3 sm:gap-2">
                <FeatherClock className="text-sm shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium text-default-font truncate">
                    {formattedTimeTaken}
                  </span>
                  <span className="text-xs text-subtext-color">Time Taken</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-neutral-200 sm:h-6 sm:w-px" />

              {/* Item 3 */}
              <div className="flex items-center gap-3 sm:gap-2">
                <FeatherShield className="text-sm shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium text-default-font truncate">
                    {report ? ` ${report.integrityLevel}` : "—"}
                  </span>
                  <span className="text-xs text-subtext-color">Integrity Score</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* City */}
            <div className="flex min-w-[220px] grow flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
              <IconWithBackground
                style={{backgroundColor: colors.primary, color: colors.accent}}
                className="rounded-full text-[20px]"
                variant="brand"
                size="large"
                icon={<FeatherMapPin />}
              />
              <span className="text-lg font-semibold text-default-font">
                {rankData.city.rank !== "-" ? `#${rankData.city.rank}` : "--"}
              </span>
              <span className="text-sm text-subtext-color">City Ranking</span>
            </div>

            {/* Country */}
            <div className="flex min-w-[220px] grow flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
              <IconWithBackground
                style={{backgroundColor: colors.primary, color: colors.accent}}
                className="rounded-full text-[20px]"
                variant="brand"
                size="large"
                icon={<FeatherMap />}
              />
              <span className="text-lg font-semibold text-default-font">
                {rankData.country.rank !== "-" ? `#${rankData.country.rank}` : "--"}
              </span>
              <span className="text-sm text-subtext-color">Country Ranking</span>
            </div>

            {/* Global */}
            <div className="flex min-w-[220px] grow flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
              <IconWithBackground
                style={{backgroundColor: colors.primary, color: colors.accent}}
                className="rounded-full text-[20px]"
                variant="brand"
                size="large"
                icon={<FeatherGlobe />}
              />
              <span className="text-lg font-semibold text-default-font">
                {rankData.global.rank !== "-" ? `#${rankData.global.rank}` : "--"}
              </span>
              <span className="text-sm text-subtext-color">Global Ranking</span>
            </div>
          </div>

          {/* Dashboard Button */}
          {/* <div className="flex w-full items-center justify-center opacity-60">
            <Button
              style={{ backgroundColor: colors.primary, color: "black" }}
              className="w-full max-w-[180px] h-10 rounded-2xl hover:opacity-90 font-semibold"
              size="large"
              iconRight={<FeatherArrowRight />}
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div> */}
          <div className="flex w-full items-center justify-center">
  <Button
    style={{ backgroundColor: colors.accent }}
    className="
      w-full max-w-[180px] h-10 rounded-2xl hover:opacity-90 font-semibold
      [&_span]:!text-white
      [&_svg]:!text-white
    "
    size="large"
    iconRight={<FeatherArrowRight />}
    onClick={() => navigate('/dashboard')}
  >
    Go to Dashboard
  </Button>
</div>

        </div>
      </div>
    </div>
  </div>
);
}

export default AssessmentResult;
