// "use client";

// import React, { useState, useEffect } from "react";
// import { Badge } from "../ui/components/Badge";
// import { Button } from "../ui/components/Button";
// import { IconButton } from "../ui/components/IconButton";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import { Table } from "../ui/components/Table";
// import { FeatherAward } from "@subframe/core";
// import { FeatherBookOpen } from "@subframe/core";
// import { FeatherBriefcase } from "@subframe/core";
// import { FeatherCheckCircle } from "@subframe/core";
// import { FeatherCheckSquare } from "@subframe/core";
// import { FeatherCode } from "@subframe/core";
// import { FeatherCrosshair } from "@subframe/core";
// import { FeatherGlobe } from "@subframe/core";
// import { FeatherInstagram } from "@subframe/core";
// import { FeatherLayers } from "@subframe/core";
// import { FeatherLinkedin } from "@subframe/core";
// import { FeatherMap } from "@subframe/core";
// import { FeatherMapPin } from "@subframe/core";
// import { FeatherMedal } from "@subframe/core";
// import { FeatherScale } from "@subframe/core";
// import { FeatherSliders } from "@subframe/core";
// import { FeatherTarget } from "@subframe/core";
// import { FeatherTrophy } from "@subframe/core";
// import { FeatherTwitter } from "@subframe/core";
// import { FeatherUsers } from "@subframe/core";
// import { useNavigate } from "react-router-dom";
// import { colors } from "src/common/Colors";
// import Navbar from "src/ui/components/Navbar";
// import Footer from "../ui/components/Footer";

// // ============================================
// // LOGGER UTILITY - For cleaner console output
// // ============================================
// const Logger = {
//   section: (title: string) =>
//     console.log(`\n${"═".repeat(50)}\n📍 ${title}\n${"═".repeat(50)}`),
//   success: (msg: string) => console.log(`✅ ${msg}`),
//   error: (msg: string) => console.error(`❌ ${msg}`),
//   info: (msg: string) => console.log(`ℹ️ ${msg}`),
//   warning: (msg: string) => console.warn(`⚠️ ${msg}`),
//   event: (msg: string) => console.log(`🔔 ${msg}`),
//   render: (msg: string) => console.log(`🎨 ${msg}`),
//   debug: (msg: string, data?: any) => console.log(`🐛 ${msg}`, data || ""),
//   timer: (label: string) => {
//     console.time(`⏱️  ${label}`);
//     return () => console.timeEnd(`⏱️  ${label}`);
//   },
// };

// function TalentRankingPlatform() {
//   const navigate = useNavigate();
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   // ============================================
//   // LIFECYCLE HOOKS WITH LOGGING
//   // ============================================
//   useEffect(() => {
//     Logger.section("COMPONENT INITIALIZATION");
//     Logger.render("TalentRankingPlatform component mounted");
//     Logger.info(`Navigation available: ${!!navigate}`);
//     Logger.info(`Colors loaded: ${!!colors}`);
//     Logger.debug("Initial state", { mousePos });

//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//       // Uncomment next line for detailed mouse tracking
//       // Logger.debug(`Mouse position update`, { x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     Logger.success("Mouse move listener attached");

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       Logger.success("Mouse move listener removed");
//     };
//   }, [navigate]);

//   useEffect(() => {
//     Logger.render("Component re-rendered");
//     Logger.debug("Current mouse position", mousePos);
//   }, [mousePos]);

//   // ============================================
//   // GLASS CARD COMPONENT WITH LOGGING
//   // ============================================
//   const GlassCard = ({
//     children,
//     className = "",
//     delay = 0,
//     cardId = "default",
//   }: {
//     children: React.ReactNode;
//     className?: string;
//     delay?: number;
//     cardId?: string;
//   }) => {
//     useEffect(() => {
//       Logger.render(
//         `GlassCard [${cardId}] rendered with animation delay: ${delay}s`,
//       );
//       return () => {
//         Logger.info(`GlassCard [${cardId}] unmounted`);
//       };
//     }, [delay, cardId]);

//     return (
//       <div
//         className={`relative group transition-all duration-500 ${className}`}
//         style={{
//           animation: `slideUp 0.8s ease-out ${delay}s both`,
//         }}
//         onMouseEnter={() =>
//           Logger.event(`GlassCard [${cardId}] hover triggered`)
//         }
//         onMouseLeave={() => Logger.event(`GlassCard [${cardId}] hover ended`)}
//       >
//         {/* 3D Glass Background Layer */}
//         <div
//           className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
//           style={{
//             background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.3) 0%, transparent 80%)`,
//             zIndex: -1,
//           }}
//         />

//         {/* Glass Morphism Card */}
//         <div
//           className="relative rounded-3xl backdrop-blur-2xl border shadow-2xl overflow-hidden group-hover:shadow-3xl transition-all duration-500"
//           style={{
//             backgroundColor: "rgba(255, 255, 255, 0.7)",
//             borderColor: "rgba(255, 255, 255, 0.4)",
//             backdropFilter: "blur(20px)",
//             WebkitBackdropFilter: "blur(20px)",
//             boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
//           }}
//         >
//           {/* Gradient Border Effect */}
//           <div
//             className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//             style={{
//               background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)`,
//               pointerEvents: "none",
//             }}
//           />

//           {/* Inner Content */}
//           <div className="relative z-10">{children}</div>
//         </div>

//         <style>{`
//           @keyframes slideUp {
//             from {
//               opacity: 0;
//               transform: translateY(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           @keyframes float {
//             0%, 100% {
//               transform: translateY(0px);
//             }
//             50% {
//               transform: translateY(-10px);
//             }
//           }

//           @keyframes shimmer {
//             0% {
//               background-position: -1000px 0;
//             }
//             100% {
//               background-position: 1000px 0;
//             }
//           }
//         `}</style>
//       </div>
//     );
//   };

//   // ============================================
//   // SECTION RENDER HANDLERS WITH LOGGING
//   // ============================================
//   const handleCTAClick = () => {
//     Logger.section("USER ACTION");
//     Logger.event("CTA Button clicked - 'Finish Profile Setup'");
//     Logger.info("Navigating to /paywall route");
//     Logger.debug("Navigation function called", {
//       timestamp: new Date().toISOString(),
//     });
//     navigate("/paywall");
//   };

//   // Log each major section render
//   useEffect(() => {
//     Logger.render("Hero section loaded");
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="flex min-h-screen w-full flex-col items-center overflow-x-hidden relative">
//         {(Logger.render("Main container rendered"), null)}

//         {/* 🎨 Premium 3D Glass Background */}
//         <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
//           {/* Main Gradient */}
//           <div
//             className="absolute inset-0"
//             style={{
//               background: `
//         radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0%, transparent 50%),
//         radial-gradient(circle at 80% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
//         radial-gradient(circle at 50% 80%, rgba(255,255,255,0.2) 0%, transparent 50%),
//         linear-gradient(
//           135deg,
//           #e5e7eb 0%,
//           #d9dce1 25%,
//           #c4cad1 50%,
//           #94a3b8 75%,
//           #1e293b 100%
//         )
//       `,
//             }}
//           />

//           {/* Animated Glass Orbs */}
//           <div
//             className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
//             style={{
//               background:
//                 "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)",
//               top: "-10%",
//               left: "-5%",
//               animation: "float 8s ease-in-out infinite",
//             }}
//           />
//           <div
//             className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
//             style={{
//               background:
//                 "radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)",
//               bottom: "-5%",
//               right: "10%",
//               animation: "float 10s ease-in-out infinite 2s",
//             }}
//           />
//         </div>

//         {/* ============ HERO SECTION ============ */}
//         {/* ============ HERO SECTION ============ */}
//         <div className="flex w-full flex-col items-center px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative z-10">
//           {(Logger.render("Hero section initialized"), null)}

//           <div className="flex w-full max-w-3xl lg:max-w-3xl xl:max-w-4xl flex-col items-start gap-8">
//             <div className="flex flex-col items-start gap-6 animate-fadeIn">
//               <Badge
//                 className="text-[14px] backdrop-blur-md border border-white/30"
//                 variant="neutral"
//                 style={{
//                   backgroundColor: "rgba(255, 255, 255, 0.5)",
//                   color: colors.accent,
//                 }}
//               >
//                 ✨ Standardized Talent Infrastructure
//               </Badge>

//               <span
//                 className="font-['Sora']
//         text-[28px] sm:text-[36px] md:text-[40px] lg:text-[56px]
//         font-[700]
//         leading-tight sm:leading-[44px] lg:leading-[64px]
//         -tracking-[0.02em] max-w-2xl lg:max-w-3xl"
//                 style={{ color: colors.accent }}
//               >
//                 Welcome to UniTalent
//                 <span style={{ color: colors.primary }}>:</span> A New
//                 Data-Driven Approach To Early-Career Hiring
//               </span>

//               <div className="flex flex-col items-start gap-6 w-full">
//                 <GlassCard className="w-full" cardId="hero-paradox">
//                   <div className="flex grow shrink-0 basis-0 flex-col items-start gap-3 p-6 md:p-8">
//                     <span
//                       className="font-['Sora'] text-[18px] font-[600] leading-[24px] -tracking-[0.01em]"
//                       style={{ color: colors.accent }}
//                     >
//                       The Traditional Résumé Paradox
//                     </span>

//                     <span
//                       className="whitespace-pre-wrap font-['Inter'] text-[15px] leading-[22px] text-opacity-90 max-w-2xl"
//                       style={{ color: colors.neutral[600] }}
//                     >
//                       {`High-performing students today often do everything the system asks of them. They maintain strong academic records, participate in competitive programs, build projects, gain practical experience through internships, and prepare rigorously for interviews. Years of consistent effort are invested with the reasonable expectation that this work will translate into opportunity.

// In practice, that connection is increasingly weak.

// Modern hiring processes frequently (and unfortunately) reward résumé optimisation, keyword alignment, and access to informal networks rather than demonstrated capability. Candidates who are adept at self-presentation or who benefit from the right introductions can advance more quickly, even when their underlying skills are comparable or weaker. As a result, many capable students are not filtered out because they lack ability, but because their effort is difficult to observe or compare at scale.

// This is not an isolated issue. Across universities and early-career pipelines, a structural gap has emerged between the work candidates put in and the signals employers are able to rely on. Talent is abundant, but visibility is uneven. Effort is real, but difficult to quantify.

// So we built UniTalent to fix this.

// Instead of rewarding résumé tricks, we quantify the work you've actually done — your projects, your experience, your consistency, your growth. Every hour you've invested counts for something measurable. And once quantified, your profile is benchmarked against peers in your university, your city, and nationwide.

// Recruiters can immediately identify real talent with data, not guesswork.

// No shortcuts.
// No keyword-hunting.
// No inflated résumés.

// Just genuine, deserving, hardworking talent rising to the top — exactly where it should be.`}
//                     </span>
//                   </div>
//                 </GlassCard>

//                 <span
//                   className="font-['Inter'] text-[18px] font-[400] leading-[28px] -tracking-[0.01em] max-w-2xl"
//                   style={{ color: colors.neutral[600] }}
//                 >
//                   UniTalent introduces a standardized ranking framework, through
//                   test assesments, designed to address structural
//                   inconsistencies in résumé-based evaluation. By shifting from
//                   narrative description to measured indicators of capability,
//                   the platform provides recruiters with transparent, data-backed
//                   methods for identifying qualified candidates while improving
//                   visibility for early-career talent.
//                 </span>
//               </div>
//             </div>

//             <div
//               className="flex h-px w-full flex-none flex-col items-center gap-2 my-8"
//               style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//             />

//             <div className="flex flex-col items-start gap-4 animate-fadeIn w-full">
//               <span
//                 className="font-['Sora'] text-[18px] font-[600] leading-[20px] uppercase -tracking-[0.02em] text-opacity-80"
//                 style={{ color: colors.accent }}
//               >
//                 Core Principles
//               </span>

//               <div className="flex flex-col items-start gap-3 w-full max-w-2xl">
//                 {[
//                   "Eliminates subjectivity and keyword optimization in candidate screening",
//                   "Provides verifiable, standardized capability metrics",
//                   "Supports signal-driven hiring with reduced ambiguity",
//                   "Enables fair, merit-based candidate discovery at scale",
//                 ].map((text, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1"
//                     onMouseEnter={() =>
//                       Logger.event(`Core principle ${idx + 1} hovered`)
//                     }
//                   >
//                     <FeatherCheckSquare
//                       style={{ color: colors.primary }}
//                       className="flex-shrink-0 mt-1"
//                     />
//                     <span
//                       className="font-['Inter'] text-[16px] font-[400] leading-[24px] -tracking-[0.01em]"
//                       style={{ color: colors.neutral[800] }}
//                     >
//                       {text}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* ============ HOW IT WORKS SECTION ============ */}
//         <div className="flex w-full flex-col items-center px-6 py-24 relative z-10">
//           {(Logger.render("How It Works section initialized"), null)}

//           <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
//             {/* Heading */}
//             <div className="flex flex-col items-start gap-3">
//               <span
//                 className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px]
//   font-[700] leading-tight sm:leading-[48px] lg:leading-[56px]
//   tracking-tight"
//                 style={{ color: colors.accent }}
//               >
//                 How UniTalent Works
//               </span>

//               <span
//                 className="font-['Inter'] text-[18px] font-[400] leading-[26px]"
//                 style={{ color: colors.neutral[600] }}
//               >
//                 A structured system that converts candidate data into clear,
//                 standardized measures of capability
//               </span>
//             </div>

//             {/* Cards */}
//             <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//               {[
//                 {
//                   num: 1,
//                   title: "Profile Creation",
//                   desc: "Candidates submit academic background, work experience, certifications, and project involvement through structured data fields.",
//                   cardId: "step-profile",
//                 },
//                 {
//                   num: 2,
//                   title: "Score Generation",
//                   desc: "The system processes inputs to generate your Experience Index.",
//                   cardId: "step-score",
//                 },
//                 {
//                   num: 3,
//                   title: "Skill Assessment",
//                   desc: "A role-specific assessment measures current job-ready capability and provides you with the Skill Index.",
//                   cardId: "step-skill",
//                 },
//                 {
//                   num: 4,
//                   title: "Recruiter Access",
//                   desc: "Your aggregated indexes feed into UniTalent's ranking system, enabling recruiters to efficiently discover high-performing candidates.",
//                   cardId: "step-recruiter",
//                 },
//               ].map((item, idx) => (
//                 <GlassCard key={idx} delay={idx * 0.1} cardId={item.cardId}>
//                   <div className="flex grow flex-col items-start gap-4 p-6">
//                     <div
//                       className="flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg"
//                       style={{
//                         backgroundColor: `${colors.primary}20`,
//                         color: colors.accent,
//                       }}
//                     >
//                       {item.num}
//                     </div>
//                     <div className="flex flex-col items-start gap-2">
//                       <span
//                         className="font-['Sora'] text-[20px] font-[600] leading-[24px]"
//                         style={{ color: colors.accent }}
//                       >
//                         {item.title}
//                       </span>
//                       <span
//                         className="font-['Inter'] text-[15px] leading-[22px]"
//                         style={{ color: colors.neutral[600] }}
//                       >
//                         {item.desc}
//                       </span>
//                     </div>
//                   </div>
//                 </GlassCard>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ============ THREE-SCORE ARCHITECTURE SECTION ============ */}
//         <div className="flex w-full flex-col items-center px-4 py-16 sm:px-6 sm:py-24 lg:py-32 relative z-10">
//           {
//             (Logger.render("Three-Score Architecture section initialized"),
//             null)
//           }

//           <div className="flex w-full max-w-[1280px] flex-col items-start gap-16">
//             <div className="flex flex-col items-start gap-4">
//               <span
//                 className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-tight sm:leading-[48px] lg:leading-[56px] -tracking-[0.02em]"
//                 style={{ color: colors.accent }}
//               >
//                 The Three-Score Architecture
//               </span>

//               <span
//                 className="w-full max-w-[768px] font-['Inter'] text-[18px] font-[400] leading-[26px] -tracking-[0.01em]"
//                 style={{ color: colors.neutral[600] }}
//               >
//                 UniTalent evaluates candidates using two standardized dimensions
//                 — a Skill Index (from assessments) and an Experience Index (from
//                 education, work, projects and awards) — which are combined into
//                 a single Hireability Index
//               </span>
//             </div>

//             <div className="flex w-full flex-col items-start gap-12">
//               {/* Experience Index Card */}
//               <GlassCard className="w-full" cardId="index-experience">
//                 <div className="flex w-full flex-col items-start gap-6 p-8">
//                   <div className="flex items-start gap-4">
//                     <div
//                       className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
//                       style={{
//                         backgroundColor: `${colors.primary}15`,
//                       }}
//                     >
//                       <FeatherBriefcase
//                         style={{ color: colors.accent, width: 32, height: 32 }}
//                       />
//                     </div>
//                     <div className="flex flex-col items-start gap-2">
//                       <span
//                         className="font-['Sora'] text-[28px] font-[700] leading-[32px]"
//                         style={{ color: colors.accent }}
//                       >
//                         Experience Index
//                       </span>
//                       <Badge
//                         className="rounded-full text-[12px] backdrop-blur-md border border-white/30"
//                         style={{
//                           backgroundColor: `${colors.primary}20`,
//                           color: colors.accent,
//                         }}
//                       >
//                         Quantifying Your Effort and Visibility
//                       </Badge>
//                     </div>
//                   </div>

//                   <div
//                     className="flex h-px w-full"
//                     style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//                   />

//                   <span
//                     className="font-['Inter'] text-[16px] font-[400] leading-[24px] whitespace-pre-wrap"
//                     style={{ color: colors.neutral[600] }}
//                   >
//                     {
//                       "Every project you built, every hackathon you joined, every award you earned — all the effort that deserves recognition. On our platform, every bit counts. Every internship, certification, and late-night project gets quantified because your hard work should matter."
//                     }
//                   </span>

//                   <div
//                     className="flex h-px w-full"
//                     style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//                   />

//                   <div className="flex flex-col items-start gap-3 w-full">
//                     <span
//                       className="font-['Sora'] text-[16px] font-[600] leading-[20px]"
//                       style={{ color: colors.accent }}
//                     >
//                       What Gets Measured
//                     </span>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
//                       {[
//                         {
//                           icon: FeatherBookOpen,
//                           text: "Education & coursework",
//                         },
//                         {
//                           icon: FeatherBriefcase,
//                           text: "Internships & work experience",
//                         },
//                         {
//                           icon: FeatherCode,
//                           text: "Projects & technical builds",
//                         },
//                         {
//                           icon: FeatherAward,
//                           text: "Certifications & training",
//                         },
//                         { icon: FeatherTrophy, text: "Awards & competitions" },
//                         {
//                           icon: FeatherUsers,
//                           text: "Leadership & campus involvement",
//                         },
//                       ].map(({ icon: Icon, text }, idx) => (
//                         <div
//                           key={text}
//                           className="flex items-start gap-3 group cursor-pointer transition-all duration-300 hover:translate-x-1"
//                           onMouseEnter={() =>
//                             Logger.event(
//                               `Experience metric ${idx + 1} hovered: ${text}`,
//                             )
//                           }
//                         >
//                           <Icon
//                             style={{ color: colors.primary }}
//                             className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform"
//                           />
//                           <span
//                             className="font-['Inter'] text-[15px] font-[400] leading-[20px]"
//                             style={{ color: colors.neutral[600] }}
//                           >
//                             {text}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </GlassCard>

//               {/* Skill Index Card */}
//               <GlassCard className="w-full" delay={0.1} cardId="index-skill">
//                 <div className="flex w-full flex-col items-start gap-6 p-8">
//                   <div className="flex items-start gap-4">
//                     <div
//                       className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
//                       style={{
//                         backgroundColor: `${colors.primary}15`,
//                       }}
//                     >
//                       <FeatherCrosshair
//                         style={{ color: colors.accent, width: 32, height: 32 }}
//                       />
//                     </div>
//                     <div className="flex flex-col items-start gap-2">
//                       <span
//                         className="font-['Sora'] text-[28px] font-[700] leading-[32px]"
//                         style={{ color: colors.accent }}
//                       >
//                         Skill Index
//                       </span>
//                       <Badge
//                         className="rounded-full text-[12px] backdrop-blur-md border border-white/30"
//                         style={{
//                           backgroundColor: `${colors.primary}20`,
//                           color: colors.accent,
//                         }}
//                       >
//                         Job-Ready Capability Assessment
//                       </Badge>
//                     </div>
//                   </div>

//                   <div
//                     className="flex h-px w-full"
//                     style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//                   />

//                   <span
//                     className="whitespace-pre-wrap font-['Inter'] text-[16px] font-[400] leading-[24px]"
//                     style={{ color: colors.neutral[600] }}
//                   >
//                     {
//                       "Impressive wording proves nothing about your actual ability. We created the Skill Index — a concise, role-specific assessment that reveals how strong you really are. No buzzwords. No padding. Just a clean, verifiable measure of actual capability."
//                     }
//                   </span>

//                   <div
//                     className="flex h-px w-full"
//                     style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//                   />

//                   <div className="flex flex-col items-start gap-3 w-full">
//                     <span
//                       className="font-['Sora'] text-[16px] font-[600] leading-[20px]"
//                       style={{ color: colors.accent }}
//                     >
//                       How We Measure It
//                     </span>

//                     <div className="flex flex-col items-start gap-3 w-full">
//                       {[
//                         {
//                           icon: FeatherTarget,
//                           text: "A short, targeted assessment built around the core tasks of desired role",
//                         },
//                         {
//                           icon: FeatherCheckCircle,
//                           text: "Evaluation based on correctness, clarity of thinking, and applied skill",
//                         },
//                         {
//                           icon: FeatherScale,
//                           text: "Standardized scoring to ensure fairness across varied educational backgrounds",
//                         },
//                       ].map(({ icon: Icon, text }, idx) => (
//                         <div
//                           key={text}
//                           className="flex items-start gap-3 group cursor-pointer transition-all duration-300 hover:translate-x-1"
//                           onMouseEnter={() =>
//                             Logger.event(
//                               `Skill metric ${idx + 1} hovered: ${text}`,
//                             )
//                           }
//                         >
//                           <Icon
//                             style={{ color: colors.primary }}
//                             className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform"
//                           />
//                           <span
//                             className="font-['Inter'] text-[15px] font-[400] leading-[20px]"
//                             style={{ color: colors.neutral[600] }}
//                           >
//                             {text}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </GlassCard>

//               {/* Hireability Index Card */}
//               <GlassCard
//                 className="w-full"
//                 delay={0.2}
//                 cardId="index-hireability"
//               >
//                 <div className="flex w-full flex-col items-start gap-6 p-8">
//                   <div className="flex items-start gap-4">
//                     <div
//                       className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
//                       style={{
//                         backgroundColor: `${colors.primary}15`,
//                       }}
//                     >
//                       <FeatherMedal
//                         style={{ color: colors.accent, width: 32, height: 32 }}
//                       />
//                     </div>
//                     <div className="flex flex-col items-start gap-2">
//                       <span
//                         className="font-['Sora'] text-[28px] font-[700] leading-[32px]"
//                         style={{ color: colors.accent }}
//                       >
//                         Hireability Index
//                       </span>
//                       <Badge
//                         className="rounded-full text-[12px] backdrop-blur-md border border-white/30"
//                         style={{
//                           backgroundColor: `${colors.primary}20`,
//                           color: colors.accent,
//                         }}
//                       >
//                         Unified Talent Benchmark
//                       </Badge>
//                     </div>
//                   </div>

//                   <div
//                     className="flex h-px w-full"
//                     style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//                   />

//                   <span
//                     className="font-['Inter'] text-[16px] font-[400] leading-[24px]"
//                     style={{ color: colors.neutral[600] }}
//                   >
//                     The Hireability Index is your central score — the unified
//                     measure that combines your skills and hard-earned experience
//                     to show how job-ready you truly are. It determines your rank
//                     across universities, cities, states, and nationally —
//                     helping recruiters instantly spot the best talent. Your
//                     ability finally has a spotlight.
//                   </span>

//                   <div
//                     className="flex h-px w-full"
//                     style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//                   />

//                   <div className="flex flex-col items-start gap-3 w-full">
//                     <span
//                       className="font-['Sora'] text-[16px] font-[600] leading-[20px]"
//                       style={{ color: colors.accent }}
//                     >
//                       How It's Measured
//                     </span>

//                     <div className="flex flex-col items-start gap-3 w-full">
//                       {[
//                         {
//                           icon: FeatherLayers,
//                           text: "A weighted blend of the Skill Index and Experience Index",
//                         },
//                         {
//                           icon: FeatherSliders,
//                           text: "Normalization to remove biases from background and institution",
//                         },
//                       ].map(({ icon: Icon, text }, idx) => (
//                         <div
//                           key={text}
//                           className="flex items-start gap-3 group cursor-pointer transition-all duration-300 hover:translate-x-1"
//                           onMouseEnter={() =>
//                             Logger.event(
//                               `Hireability metric ${idx + 1} hovered: ${text}`,
//                             )
//                           }
//                         >
//                           <Icon
//                             style={{ color: colors.primary }}
//                             className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform"
//                           />
//                           <span
//                             className="font-['Inter'] text-[15px] font-[400] leading-[20px]"
//                             style={{ color: colors.neutral[600] }}
//                           >
//                             {text}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </GlassCard>
//             </div>
//           </div>
//         </div>

//         {/* ============ GLOBAL BENCHMARKING SECTION ============ */}
//         <div className="flex w-full flex-col items-center px-6 py-24 relative z-10">
//           {(Logger.render("Global Benchmarking section initialized"), null)}

//           <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
//             <div className="flex flex-col items-start gap-4">
//               <span
//                 className="font-['Sora'] text-[14px] font-[600] leading-[20px] uppercase -tracking-[0.02em]"
//                 style={{ color: colors.primary }}
//               >
//                 Global Benchmarking Layer
//               </span>

//               <span
//                 className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-tight sm:leading-[48px] lg:leading-[56px]"
//                 style={{ color: colors.accent }}
//               >
//                 Ranking Methodology
//               </span>

//               <span
//                 className="w-full max-w-[768px] font-['Inter'] text-[16px] font-[400] leading-[24px]"
//                 style={{ color: colors.neutral[600] }}
//               >
//                 Candidates are ranked across multi-layer cohorts within their
//                 chosen job role. Rankings update automatically when scores
//                 change, providing recruiters with granular visibility and
//                 supporting targeted talent discovery.
//               </span>
//             </div>

//             <GlassCard className="w-full" cardId="ranking-methodology">
//               <div className="flex flex-col items-start gap-6 p-8">
//                 <div className="flex flex-col items-start gap-2">
//                   <span
//                     className="font-['Sora'] text-[22px] font-[600] leading-[28px]"
//                     style={{ color: colors.accent }}
//                   >
//                     Ranking Structure
//                   </span>

//                   <span
//                     className="font-['Inter'] text-[14px] font-[400] leading-[20px]"
//                     style={{ color: colors.neutral[600] }}
//                   >
//                     Candidates are positioned across four hierarchical levels
//                     for each job role
//                   </span>
//                 </div>

//                 <div className="flex w-full flex-col items-start overflow-x-auto">
//                   <Table
//                     header={
//                       <Table.HeaderRow>
//                         <Table.HeaderCell>Ranking Level</Table.HeaderCell>
//                         <Table.HeaderCell>Cohort Scope</Table.HeaderCell>
//                         <Table.HeaderCell>Update Frequency</Table.HeaderCell>
//                         <Table.HeaderCell>Recruiter Use Case</Table.HeaderCell>
//                       </Table.HeaderRow>
//                     }
//                   >
//                     {[
//                       {
//                         icon: FeatherGlobe,
//                         level: "Global",
//                         scope: "All candidates within job role",
//                         freq: "Real-time",
//                         use: "Top-tier talent identification",
//                       },
//                       {
//                         icon: FeatherMap,
//                         level: "State",
//                         scope: "Candidates within specific state",
//                         freq: "Real-time",
//                         use: "Regional hiring strategies",
//                       },
//                       {
//                         icon: FeatherMapPin,
//                         level: "City",
//                         scope: "Candidates within specific city",
//                         freq: "Real-time",
//                         use: "Local market recruitment",
//                       },
//                       {
//                         icon: FeatherBookOpen,
//                         level: "University",
//                         scope: "Candidates within specific university",
//                         freq: "Real-time",
//                         use: "Campus recruitment programs",
//                       },
//                     ].map((item) => (
//                       <Table.Row
//                         key={item.level}
//                         onMouseEnter={() =>
//                           Logger.event(`Ranking level ${item.level} hovered`)
//                         }
//                       >
//                         <Table.Cell>
//                           <div className="flex items-center gap-2">
//                             <item.icon style={{ color: colors.primary }} />
//                             <span
//                               className="whitespace-nowrap text-body-bold font-body-bold"
//                               style={{ color: colors.accent }}
//                             >
//                               {item.level}
//                             </span>
//                           </div>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <span
//                             className="whitespace-nowrap text-body font-body"
//                             style={{ color: colors.neutral[600] }}
//                           >
//                             {item.scope}
//                           </span>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <span
//                             className="whitespace-nowrap text-body font-body"
//                             style={{ color: colors.neutral[600] }}
//                           >
//                             {item.freq}
//                           </span>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <span
//                             className="whitespace-nowrap text-body font-body"
//                             style={{ color: colors.neutral[600] }}
//                           >
//                             {item.use}
//                           </span>
//                         </Table.Cell>
//                       </Table.Row>
//                     ))}
//                   </Table>
//                 </div>

//                 <div
//                   className="flex h-px w-full"
//                   style={{ backgroundColor: "rgba(255,255,255, 0.2)" }}
//                 />

//                 <div className="flex flex-col items-start gap-3 w-full">
//                   <span
//                     className="font-['Sora'] text-[14px] font-[600] leading-[20px]"
//                     style={{ color: colors.accent }}
//                   >
//                     Key Characteristics
//                   </span>

//                   {[
//                     "Rankings update automatically upon score recalculation",
//                     "All rankings are role-specific and maintain separate hierarchies per job track",
//                     "Recruiters can filter and search across all ranking levels simultaneously",
//                   ].map((text, idx) => (
//                     <div
//                       key={text}
//                       className="flex items-start gap-3 cursor-pointer group transition-all duration-300 hover:translate-x-1"
//                       onMouseEnter={() =>
//                         Logger.event(
//                           `Ranking characteristic ${idx + 1} hovered`,
//                         )
//                       }
//                     >
//                       <FeatherCheckSquare
//                         style={{ color: colors.primary }}
//                         className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform"
//                       />
//                       <span
//                         className="font-['Inter'] text-[14px] font-[400] leading-[20px]"
//                         style={{ color: colors.neutral[600] }}
//                       >
//                         {text}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </GlassCard>
//           </div>
//         </div>

//         {/* ============ IMPACT ON HIRING SECTION ============ */}
//         <div className="flex w-full flex-col items-center px-6 py-24 relative z-10">
//           {(Logger.render("Impact on Hiring section initialized"), null)}

//           <div className="flex w-full max-w-[768px] flex-col items-start gap-12">
//             <span
//               className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-tight sm:leading-[48px] lg:leading-[56px]"
//               style={{ color: colors.accent }}
//             >
//               Impact on Hiring Operations
//             </span>

//             <GlassCard className="w-full" cardId="impact-hiring">
//               <div className="flex flex-col items-start gap-6 p-8">
//                 {[
//                   {
//                     title: "Increased Transparency",
//                     desc: "Standardized metrics eliminate ambiguity in candidate evaluation",
//                   },
//                   {
//                     title: "Reduced Signal Noise",
//                     desc: "Verified capability indicators replace unverifiable résumé claims",
//                   },
//                   {
//                     title: "Accelerated Shortlisting",
//                     desc: "National rankings enable rapid candidate identification without manual screening",
//                   },
//                   {
//                     title: "Merit-Based Discovery",
//                     desc: "Capability gains visibility regardless of institutional affiliation",
//                   },
//                 ].map((item, idx) => (
//                   <div
//                     key={item.title}
//                     className="flex items-start gap-4 group transition-all duration-300 hover:translate-x-1 cursor-pointer"
//                     onMouseEnter={() =>
//                       Logger.event(
//                         `Impact item ${idx + 1} hovered: ${item.title}`,
//                       )
//                     }
//                   >
//                     <div
//                       className="flex h-10 w-10 flex-none items-center justify-center rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"
//                       style={{ backgroundColor: `${colors.primary}20` }}
//                     >
//                       <FeatherCheckCircle style={{ color: colors.primary }} />
//                     </div>

//                     <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
//                       <span
//                         className="font-['Sora'] text-[16px] font-[600] leading-[24px]"
//                         style={{ color: colors.accent }}
//                       >
//                         {item.title}
//                       </span>

//                       <span
//                         className="font-['Inter'] text-[14px] font-[400] leading-[20px]"
//                         style={{ color: colors.neutral[600] }}
//                       >
//                         {item.desc}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </GlassCard>
//           </div>
//         </div>

//         {/* ============ CTA SECTION ============ */}
//         <div className="flex w-full flex-col items-center px-6 py-32 relative z-10">
//           {(Logger.render("CTA section initialized"), null)}

//           <div className="flex w-full max-w-[768px] flex-col items-center gap-12 text-center">
//             <div className="flex flex-col items-center gap-4">
//               <span
//                 className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-[56px]"
//                 style={{ color: colors.accent }}
//               >
//                 Generate Your Hireability Index
//               </span>

//               <span
//                 className="font-['Inter'] text-[16px] font-[400] leading-[24px] -tracking-[0.01em]"
//                 style={{ color: colors.neutral[600] }}
//               >
//                 Be part of a new, merit-first way of showcasing talent
//               </span>
//             </div>
//             <Button
//               size="large"
//               onClick={() => navigate("/upload-resume")}
//               className="w-full h-11 sm:h-12 rounded-3xl text-[15px] sm:text-[16px] font-semibold transition active:scale-[0.99] shadow-lg"
//               style={{
//                 backgroundColor: colors.primary,
//                 color: colors.white,
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
//               onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//             >
//               <span
//                 className="text-[15px] sm:text-[16px] font-semibold"
//                 style={{ color: colors.white }}
//               >
//                 Finish Profile Setup
//               </span>
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div>
//         <Footer />
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-20px);
//           }
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes shimmer {
//           0% {
//             background-position: -1000px 0;
//           }
//           100% {
//             background-position: 1000px 0;
//           }
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes orbit {
//           0% {
//             opacity: 0;
//             transform: scale(0);
//           }
//           50% {
//             opacity: 1;
//           }
//           100% {
//             opacity: 0;
//             transform: scale(1) translateY(-20px);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.8s ease-out;
//         }

//         .magnetic-btn {
//           position: relative;
//           transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
//         }

//         .magnetic-btn:hover {
//           transform: scale(1.08);
//         }

//         .magnetic-btn:active {
//           transform: scale(0.95);
//         }

//         /* Smooth scrolling behavior */
//         html {
//           scroll-behavior: smooth;
//         }

//         /* Custom scrollbar */
//         ::-webkit-scrollbar {
//           width: 10px;
//         }

//         ::-webkit-scrollbar-track {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         ::-webkit-scrollbar-thumb {
//           background: rgba(59, 130, 246, 0.4);
//           border-radius: 10px;
//         }

//         ::-webkit-scrollbar-thumb:hover {
//           background: rgba(59, 130, 246, 0.6);
//         }
//       `}</style>
//     </>
//   );
// }

// export default TalentRankingPlatform;
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import {
  FeatherAward,
  FeatherBookOpen,
  FeatherBriefcase,
  FeatherCheckCircle,
  FeatherCheckSquare,
  FeatherCode,
  FeatherCrosshair,
  FeatherGlobe,
  FeatherLayers,
  FeatherMap,
  FeatherMapPin,
  FeatherMedal,
  FeatherScale,
  FeatherSliders,
  FeatherTarget,
  FeatherTrophy,
  FeatherUsers,
  FeatherArrowRight,
  FeatherStar,
  FeatherZap,
} from "@subframe/core";
import { useNavigate } from "react-router-dom";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";
import { Table } from "../ui/components/Table";

// ============================================
// TYPES
// ============================================
interface GlassCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  cardId?: string;
  glowColor?: string;
}

interface IllustrationProps {
  className?: string;
}

// ============================================
// ILLUSTRATION COMPONENTS (Vector SVG Illustrations)
// ============================================

const HeroIllustration: React.FC<IllustrationProps> = ({ className = "" }) => (
  <div className={`w-full h-full ${className}`}>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Outer circles */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke={colors.primary}
        strokeWidth="1"
        strokeDasharray="5 5"
        fill="none"
        opacity="0.3"
      />
      <circle
        cx="200"
        cy="200"
        r="140"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <circle
        cx="200"
        cy="200"
        r="100"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <circle
        cx="200"
        cy="200"
        r="60"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
      />

      {/* Data points - larger and more visible */}
      <circle cx="140" cy="140" r="10" fill={colors.primary} opacity="0.3" />
      <circle cx="280" cy="160" r="14" fill={colors.primary} opacity="0.2" />
      <circle cx="160" cy="300" r="12" fill={colors.primary} opacity="0.3" />
      <circle cx="320" cy="260" r="8" fill={colors.primary} opacity="0.35" />
      <circle cx="100" cy="220" r="9" fill={colors.primary} opacity="0.25" />

      {/* Connection lines - enhanced */}
      <path
        d="M140 140 L200 200 L280 160 L200 200 L160 300 L200 200 L320 260 L200 200 L100 220"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.25"
        strokeDasharray="4 4"
      />

      {/* Central hexagon - larger */}
      <path
        d="M200 120 L280 160 L280 240 L200 280 L120 240 L120 160 L200 120"
        stroke={colors.primary}
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* Inner details */}
      <circle
        cx="200"
        cy="200"
        r="25"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <circle cx="200" cy="200" r="15" fill={colors.primary} opacity="0.15" />

      {/* Additional accent elements */}
      <path
        d="M200 120 L200 280"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.2"
      />
      <path
        d="M120 200 L280 200"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.2"
      />
    </svg>
  </div>
);

const ParadoxIllustration: React.FC<IllustrationProps> = ({
  className = "",
}) => (
  <div className={`w-full h-full ${className}`}>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Scale balance */}
      <line
        x1="50"
        y1="150"
        x2="250"
        y2="150"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.3"
      />
      <circle
        cx="100"
        cy="120"
        r="20"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="200"
        cy="180"
        r="20"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M100 140 L100 180 M200 140 L200 180"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="100" cy="180" r="6" fill={colors.primary} opacity="0.3" />
      <circle cx="200" cy="140" r="6" fill={colors.primary} opacity="0.3" />
    </svg>
  </div>
);

const PrinciplesIllustration: React.FC<IllustrationProps> = ({
  className = "",
}) => (
  <div className={`w-full h-full ${className}`}>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pyramid/ranking illustration */}
      <path
        d="M150 50 L250 250 L50 250 L150 50"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <line
        x1="150"
        y1="80"
        x2="220"
        y2="230"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.2"
      />
      <line
        x1="150"
        y1="120"
        x2="200"
        y2="230"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.2"
      />
      <line
        x1="150"
        y1="160"
        x2="180"
        y2="230"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.2"
      />
      <line
        x1="150"
        y1="80"
        x2="80"
        y2="230"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.2"
      />
      <line
        x1="150"
        y1="120"
        x2="100"
        y2="230"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.2"
      />
      <line
        x1="150"
        y1="160"
        x2="120"
        y2="230"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.2"
      />

      {/* Stars at top */}
      <circle cx="150" cy="70" r="4" fill={colors.primary} />
      <circle cx="170" cy="90" r="3" fill={colors.primary} opacity="0.6" />
      <circle cx="130" cy="90" r="3" fill={colors.primary} opacity="0.6" />
    </svg>
  </div>
);

// ============================================
// ENHANCED BACKGROUND GLASS LAYER WITH DEEPER EFFECTS
// ============================================
const BackgroundGlass: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none">
    {/* Multi-layer gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

    {/* Glass blur layers with varying opacity */}
    <div className="absolute inset-0 bg-white/20 backdrop-blur-[150px]" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10" />

    {/* Animated glass orbs with enhanced effects */}
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)`,
        top: "-30%",
        left: "-15%",
        filter: "blur(100px)",
      }}
      animate={{
        y: [0, -50, 0],
        x: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.01) 50%, transparent 70%)`,
        bottom: "-20%",
        right: "-10%",
        filter: "blur(100px)",
      }}
      animate={{
        y: [0, 40, 0],
        x: [0, -30, 0],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 22,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)`,
        top: "40%",
        left: "60%",
        filter: "blur(80px)",
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
    />

    {/* Subtle noise texture */}
    <div
      className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
      style={{
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E')",
      }}
    />
  </div>
);

// ============================================
// ENHANCED GLASS CARD WITH AWWARDS-INSPIRED EFFECTS
// ============================================
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  delay = 0,
  className = "",
  cardId = "default",
  glowColor = "#3B82F6",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    whileHover={{
      y: -8,
      transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
    }}
    className={`relative group cursor-pointer ${className}`}
  >
    {/* Animated glow effect */}
    <motion.div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}20, transparent 40%)`,
        filter: "blur(30px)",
      }}
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Main glass layer with enhanced blur */}
    <div
      className="absolute inset-0 rounded-2xl transition-all duration-500 group-hover:backdrop-blur-2xl"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(255, 255, 255, 0.3) inset",
      }}
    />

    {/* Gradient overlay for depth */}
    <div
      className="absolute inset-0 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
        pointerEvents: "none",
      }}
    />

    {/* Inner glow border */}
    <div
      className="absolute inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        border: `1px solid ${glowColor}30`,
        boxShadow: `0 0 30px ${glowColor}20`,
        pointerEvents: "none",
      }}
    />

    {/* Content */}
    <div className="relative z-10 p-8">{children}</div>
  </motion.div>
);

// ============================================
// ENHANCED BUTTON WITH HOVER EFFECTS
// ============================================
const GlassButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
}> = ({ children, onClick, className = "", variant = "primary", icon }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          color: "white",
          border: "none",
          boxShadow: `0 8px 32px ${colors.primary}4D`,
        };
      case "secondary":
        return {
          background: "rgba(255, 255, 255, 0.8)",
          color: colors.accent,
          border: "1px solid rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
        };
      case "outline":
        return {
          background: "transparent",
          color: colors.accent,
          border: `1px solid ${colors.primary}4D`,
          backdropFilter: "blur(8px)",
        };
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-full font-medium ${className}`}
      style={getVariantStyles()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          transform: "translateX(-100%)",
        }}
        animate={{
          transform: ["translateX(-100%)", "translateX(100%)"],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />

      {/* Button content */}
      <div className="relative z-10 px-6 py-3 flex items-center gap-2">
        {icon && (
          <span className="group-hover:rotate-12 transition-transform">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {variant === "primary" && (
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FeatherArrowRight />
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

// ============================================
// MAIN COMPONENT - FULL WIDTH LAYOUT WITH ENHANCED EFFECTS
// ============================================
const TalentRankingPlatform: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full overflow-x-hidden">
        {/* Enhanced glass background */}
        <BackgroundGlass />

        {/* Content - Full width sections */}
        <div className="relative z-10">
          {/* ============ HERO SECTION - FULL WIDTH ============ */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto">
              {/* Hero with illustration on left, content on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
                {/* Left illustration */}
                <motion.div
                  className="hidden lg:flex items-start justify-center"
                  initial={{ opacity: 0, scale: 0.8, x: -40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <motion.div
                    className="w-full h-full max-w-xl"
                    animate={{
                      y: [0, -30, 0],
                      rotate: [0, -3, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <HeroIllustration />
                  </motion.div>
                </motion.div>

                {/* Right content */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <Badge
                        className="text-xs font-medium px-3 py-1.4 rounded-full mb-9 inline-block cursor-pointer"
                        style={{
                          background: `${colors.primary}1A`,
                          color: colors.primary,
                          border: `1px solid ${colors.primary}33`,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block mr-1"
                        >
                          ✨
                        </motion.span>
                        Standardized Talent Infrastructure
                      </Badge>
                    </motion.div>
                  </motion.div>

                  <motion.h1
                    className="font-['Sora'] text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-6"
                    style={{ color: colors.accent }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome to UniTalent
                    <motion.span
                      style={{ color: colors.primary }}
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      :
                    </motion.span>{" "}
                    A New Data-Driven Approach To Early-Career Hiring
                  </motion.h1>

                  <motion.p
                    className="font-['Inter'] text-[18px] font-[400] leading-[28px] -tracking-[0.01em] max-w-2xl"
                    style={{ color: colors.neutral[600] }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    UniTalent introduces a standardized ranking framework,
                    through test assesments, designed to address structural
                    inconsistencies in résumé-based evaluation. By shifting from
                    narrative description to measured indicators of capability,
                    the platform provides recruiters with transparent,
                    data-backed methods for identifying qualified candidates
                    while improving visibility for early-career talent.
                  </motion.p>

                  <motion.div
                    className="flex h-px w-full my-8"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${colors.primary}33, transparent)`,
                    }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 }}
                  />

                  <motion.div
                    className="flex flex-col items-start gap-4 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.span
                      className="font-['Sora'] text-[18px] font-[600] leading-[20px] uppercase -tracking-[0.02em] text-opacity-80 flex items-center gap-2"
                      style={{ color: colors.accent }}
                    >
                      <FeatherStar style={{ color: colors.primary }} />
                      Core Principles
                    </motion.span>

                    <div className="flex flex-col items-start gap-3 w-full max-w-2xl">
                      {[
                        "Eliminates subjectivity and keyword optimization in candidate screening",
                        "Provides verifiable, standardized capability metrics",
                        "Supports signal-driven hiring with reduced ambiguity",
                        "Enables fair, merit-based candidate discovery at scale",
                      ].map((text, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3 group cursor-pointer"
                          whileHover={{ x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FeatherCheckSquare
                              style={{ color: colors.primary }}
                              className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform"
                            />
                          </motion.div>
                          <span
                            className="font-['Inter'] text-[16px] font-[400] leading-[24px] -tracking-[0.01em]"
                            style={{ color: colors.neutral[800] }}
                          >
                            {text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <GlassButton
                      onClick={() => navigate("/upload-resume")}
                      variant="primary"
                      icon={<FeatherZap />}
                    >
                      Get Started Now
                    </GlassButton>
                  </motion.div>
                </motion.div>
              </div>

              {/* Full width Paradox card below */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <GlassCard
                  className="w-full"
                  cardId="hero-paradox"
                  glowColor={colors.primary}
                >
                  <div className="relative">
                    {/* Top right illustration */}
                    <motion.div
                      className="absolute -top-12 -right-12 w-48 h-48 opacity-50"
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ParadoxIllustration />
                    </motion.div>

                    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-3">
                      <motion.span
                        className="font-['Sora'] text-[18px] font-[600] leading-[24px] -tracking-[0.01em] flex items-center gap-2"
                        style={{ color: colors.accent }}
                      >
                        <FeatherZap style={{ color: colors.primary }} />
                        The Traditional Résumé Paradox
                      </motion.span>

                      <span
                        className="whitespace-pre-wrap font-['Inter'] text-[15px] leading-[22px] text-opacity-90 max-w-3xl"
                        style={{ color: colors.neutral[600] }}
                      >
                        {`High-performing students today often do everything the system asks of them. They maintain strong academic records, participate in competitive programs, build projects, gain practical experience through internships, and prepare rigorously for interviews. Years of consistent effort are invested with the reasonable expectation that this work will translate into opportunity.

In practice, that connection is increasingly weak.

Modern hiring processes frequently (and unfortunately) reward résumé optimisation, keyword alignment, and access to informal networks rather than demonstrated capability. Candidates who are adept at self-presentation or who benefit from the right introductions can advance more quickly, even when their underlying skills are comparable or weaker. As a result, many capable students are not filtered out because they lack ability, but because their effort is difficult to observe or compare at scale.

This is not an isolated issue. Across universities and early-career pipelines, a structural gap has emerged between the work candidates put in and the signals employers are able to rely on. Talent is abundant, but visibility is uneven. Effort is real, but difficult to quantify.

So we built UniTalent to fix this.

Instead of rewarding résumé tricks, we quantify the work you've actually done — your projects, your experience, your consistency, your growth. Every hour you've invested counts for something measurable. And once quantified, your profile is benchmarked against peers in your university, your city, and nationwide.

Recruiters can immediately identify real talent with data, not guesswork.

No shortcuts.
No keyword-hunting.
No inflated résumés.

Just genuine, deserving, hardworking talent rising to the top — exactly where it should be.`}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </section>

          {/* ============ HOW IT WORKS SECTION ============ */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 bg-white/30 backdrop-blur-md border-y border-white/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-start gap-12">
                {/* Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-start gap-3"
                >
                  <motion.span
                    className="font-['Sora'] text-[28px] sm:text-[40px] lg:text-[48px] font-[700] leading-tight sm:leading-[48px] lg:leading-[56px] tracking-tight"
                    style={{ color: colors.accent }}
                  >
                    How UniTalent Works
                  </motion.span>

                  <span
                    className="font-['Inter'] text-[18px] font-[400] leading-[26px]"
                    style={{ color: colors.neutral[600] }}
                  >
                    A structured system that converts candidate data into clear,
                    standardized measures of capability
                  </span>
                </motion.div>

                {/* Cards */}
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      num: 1,
                      title: "Profile Creation",
                      desc: "Candidates submit academic background, work experience, certifications, and project involvement through structured data fields.",
                      cardId: "step-profile",
                      color: colors.primary,
                    },
                    {
                      num: 2,
                      title: "Score Generation",
                      desc: "The system processes inputs to generate your Experience Index.",
                      cardId: "step-score",
                      color: "#8B5CF6",
                    },
                    {
                      num: 3,
                      title: "Skill Assessment",
                      desc: "A role-specific assessment measures current job-ready capability and provides you with the Skill Index.",
                      cardId: "step-skill",
                      color: "#10B981",
                    },
                    {
                      num: 4,
                      title: "Recruiter Access",
                      desc: "Your aggregated indexes feed into UniTalent's ranking system, enabling recruiters to efficiently discover high-performing candidates.",
                      cardId: "step-recruiter",
                      color: "#F59E0B",
                    },
                  ].map((item, idx) => (
                    <GlassCard
                      key={idx}
                      delay={idx * 0.1}
                      cardId={item.cardId}
                      glowColor={item.color}
                    >
                      <div className="flex grow flex-col items-start gap-4">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`,
                            color: item.color,
                            border: `1px solid ${item.color}30`,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.num}
                        </motion.div>
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className="font-['Sora'] text-[20px] font-[600] leading-[24px]"
                            style={{ color: colors.accent }}
                          >
                            {item.title}
                          </span>
                          <span
                            className="font-['Inter'] text-[15px] leading-[22px]"
                            style={{ color: colors.neutral[600] }}
                          >
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============ THREE-SCORE ARCHITECTURE SECTION ============ */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-start gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-start gap-4"
                >
                  <span
                    className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-tight sm:leading-[48px] lg:leading-[56px] -tracking-[0.02em]"
                    style={{ color: colors.accent }}
                  >
                    The Three-Score Architecture
                  </span>

                  <span
                    className="w-full max-w-[768px] font-['Inter'] text-[18px] font-[400] leading-[26px] -tracking-[0.01em]"
                    style={{ color: colors.neutral[600] }}
                  >
                    UniTalent evaluates candidates using two standardized
                    dimensions — a Skill Index (from assessments) and an
                    Experience Index (from education, work, projects and awards)
                    — which are combined into a single Hireability Index
                  </span>
                </motion.div>

                <div className="flex w-full flex-col items-start gap-12">
                  {/* Experience Index Card */}
                  <GlassCard
                    className="w-full"
                    cardId="index-experience"
                    glowColor={colors.primary}
                  >
                    <div className="flex w-full flex-col items-start gap-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
                            border: `1px solid ${colors.primary}30`,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FeatherBriefcase
                            style={{
                              color: colors.primary,
                              width: 32,
                              height: 32,
                              justifyContent: "center",
                            }}
                          />
                        </motion.div>
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className="font-['Sora'] text-[28px] font-[700] leading-[32px]"
                            style={{ color: colors.accent }}
                          >
                            Experience Index
                          </span>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              className="rounded-full text-[12px] backdrop-blur-md"
                              style={{
                                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                                color: colors.primary,
                                border: `1px solid ${colors.primary}40`,
                              }}
                            >
                              Quantifying Your Effort and Visibility
                            </Badge>
                          </motion.div>
                        </div>
                      </div>

                      <div
                        className="flex h-px w-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
                        }}
                      />

                      <span
                        className="font-['Inter'] text-[16px] font-[400] leading-[24px] whitespace-pre-wrap"
                        style={{ color: colors.neutral[600] }}
                      >
                        {
                          "Every project you built, every hackathon you joined, every award you earned — all the effort that deserves recognition. On our platform, every bit counts. Every internship, certification, and late-night project gets quantified because your hard work should matter."
                        }
                      </span>

                      <div
                        className="flex h-px w-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
                        }}
                      />

                      <div className="flex flex-col items-start gap-3 w-full">
                        <span
                          className="font-['Sora'] text-[16px] font-[600] leading-[20px] flex items-center gap-2"
                          style={{ color: colors.accent }}
                        >
                          <FeatherStar style={{ color: colors.primary }} />
                          What Gets Measured
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                          {[
                            {
                              icon: FeatherBookOpen,
                              text: "Education & coursework",
                            },
                            {
                              icon: FeatherBriefcase,
                              text: "Internships & work experience",
                            },
                            {
                              icon: FeatherCode,
                              text: "Projects & technical builds",
                            },
                            {
                              icon: FeatherAward,
                              text: "Certifications & training",
                            },
                            {
                              icon: FeatherTrophy,
                              text: "Awards & competitions",
                            },
                            {
                              icon: FeatherUsers,
                              text: "Leadership & campus involvement",
                            },
                          ].map(({ icon: Icon, text }, idx) => (
                            <motion.div
                              key={text}
                              className="flex items-start gap-3 group cursor-pointer"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0"
                              >
                                <Icon
                                  style={{ color: colors.primary }}
                                  className="mt-1 group-hover:scale-110 transition-transform"
                                />
                              </motion.div>
                              <span
                                className="font-['Inter'] text-[15px] font-[400] leading-[20px]"
                                style={{ color: colors.neutral[600] }}
                              >
                                {text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Skill Index Card */}
                  <GlassCard
                    className="w-full"
                    delay={0.1}
                    cardId="index-skill"
                    glowColor="#8B5CF6"
                  >
                    <div className="flex w-full flex-col items-start gap-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            background:
                              "linear-gradient(135deg, #8B5CF615, #8B5CF605)",
                            border: "1px solid #8B5CF630",
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FeatherCrosshair
                            style={{
                              color: "#8B5CF6",
                              width: 32,
                              height: 32,
                              justifyContent: "center",
                            }}
                          />
                        </motion.div>
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className="font-['Sora'] text-[28px] font-[700] leading-[32px]"
                            style={{ color: colors.accent }}
                          >
                            Skill Index
                          </span>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              className="rounded-full text-[12px] backdrop-blur-md"
                              style={{
                                background:
                                  "linear-gradient(135deg, #8B5CF620, #8B5CF605)",
                                color: "#8B5CF6",
                                border: "1px solid #8B5CF640",
                              }}
                            >
                              Job-Ready Capability Assessment
                            </Badge>
                          </motion.div>
                        </div>
                      </div>

                      <div
                        className="flex h-px w-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, #8B5CF640, transparent)",
                        }}
                      />

                      <span
                        className="whitespace-pre-wrap font-['Inter'] text-[16px] font-[400] leading-[24px]"
                        style={{ color: colors.neutral[600] }}
                      >
                        {
                          "Impressive wording proves nothing about your actual ability. We created the Skill Index — a concise, role-specific assessment that reveals how strong you really are. No buzzwords. No padding. Just a clean, verifiable measure of actual capability."
                        }
                      </span>

                      <div
                        className="flex h-px w-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, #8B5CF640, transparent)",
                        }}
                      />

                      <div className="flex flex-col items-start gap-3 w-full">
                        <span
                          className="font-['Sora'] text-[16px] font-[600] leading-[20px] flex items-center gap-2"
                          style={{ color: colors.accent }}
                        >
                          <FeatherStar style={{ color: "#8B5CF6" }} />
                          How We Measure It
                        </span>

                        <div className="flex flex-col items-start gap-3 w-full">
                          {[
                            {
                              icon: FeatherTarget,
                              text: "A short, targeted assessment built around the core tasks of desired role",
                            },
                            {
                              icon: FeatherCheckCircle,
                              text: "Evaluation based on correctness, clarity of thinking, and applied skill",
                            },
                            {
                              icon: FeatherScale,
                              text: "Standardized scoring to ensure fairness across varied educational backgrounds",
                            },
                          ].map(({ icon: Icon, text }, idx) => (
                            <motion.div
                              key={text}
                              className="flex items-start gap-3 group cursor-pointer"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0"
                              >
                                <Icon
                                  style={{ color: colors.primary }}
                                  className="mt-1 group-hover:scale-110 transition-transform"
                                />
                              </motion.div>
                              <span
                                className="font-['Inter'] text-[15px] font-[400] leading-[20px]"
                                style={{ color: colors.neutral[600] }}
                              >
                                {text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Hireability Index Card */}
                  <GlassCard
                    className="w-full"
                    delay={0.2}
                    cardId="index-hireability"
                    glowColor="#10B981"
                  >
                    <div className="flex w-full flex-col items-start gap-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            background:
                              "linear-gradient(135deg, #10B98115, #10B98105)",
                            border: "1px solid #10B98130",
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FeatherMedal
                            style={{
                              color: "#10B981",
                              width: 32,
                              height: 32,
                              justifyContent: "center",
                            }}
                          />
                        </motion.div>
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className="font-['Sora'] text-[28px] font-[700] leading-[32px]"
                            style={{ color: colors.accent }}
                          >
                            Hireability Index
                          </span>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              className="rounded-full text-[12px] backdrop-blur-md"
                              style={{
                                background:
                                  "linear-gradient(135deg, #10B98120, #10B98105)",
                                color: "#10B981",
                                border: "1px solid #10B98140",
                              }}
                            >
                              Unified Talent Benchmark
                            </Badge>
                          </motion.div>
                        </div>
                      </div>

                      <div
                        className="flex h-px w-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, #10B98140, transparent)",
                        }}
                      />

                      <span
                        className="font-['Inter'] text-[16px] font-[400] leading-[24px]"
                        style={{ color: colors.neutral[600] }}
                      >
                        The Hireability Index is your central score — the
                        unified measure that combines your skills and
                        hard-earned experience to show how job-ready you truly
                        are. It determines your rank across universities,
                        cities, states, and nationally — helping recruiters
                        instantly spot the best talent. Your ability finally has
                        a spotlight.
                      </span>

                      <div
                        className="flex h-px w-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, #10B98140, transparent)",
                        }}
                      />

                      <div className="flex flex-col items-start gap-3 w-full">
                        <span
                          className="font-['Sora'] text-[16px] font-[600] leading-[20px] flex items-center gap-2"
                          style={{ color: colors.accent }}
                        >
                          <FeatherStar style={{ color: "#10B981" }} />
                          How It's Measured
                        </span>

                        <div className="flex flex-col items-start gap-3 w-full">
                          {[
                            {
                              icon: FeatherLayers,
                              text: "A weighted blend of the Skill Index and Experience Index",
                            },
                            {
                              icon: FeatherSliders,
                              text: "Normalization to remove biases from background and institution",
                            },
                          ].map(({ icon: Icon, text }, idx) => (
                            <motion.div
                              key={text}
                              className="flex items-start gap-3 group cursor-pointer"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0"
                              >
                                <Icon
                                  style={{ color: colors.primary }}
                                  className="mt-1 group-hover:scale-110 transition-transform"
                                />
                              </motion.div>
                              <span
                                className="font-['Inter'] text-[15px] font-[400] leading-[20px]"
                                style={{ color: colors.neutral[600] }}
                              >
                                {text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </section>

          {/* ============ GLOBAL BENCHMARKING SECTION ============ */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 bg-white/30 backdrop-blur-md border-y border-white/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-start gap-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-start gap-4"
                >
                  <motion.span
                    className="font-['Sora'] text-[14px] font-[600] leading-[20px] uppercase -tracking-[0.02em]"
                    style={{ color: colors.primary }}
                  >
                    Global Benchmarking Layer
                  </motion.span>

                  <span
                    className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-tight sm:leading-[48px] lg:leading-[56px]"
                    style={{ color: colors.accent }}
                  >
                    Ranking Methodology
                  </span>

                  <span
                    className="w-full max-w-[768px] font-['Inter'] text-[16px] font-[400] leading-[24px]"
                    style={{ color: colors.neutral[600] }}
                  >
                    Candidates are ranked across multi-layer cohorts within
                    their chosen job role. Rankings update automatically when
                    scores change, providing recruiters with granular visibility
                    and supporting targeted talent discovery.
                  </span>
                </motion.div>

                <GlassCard
                  className="w-full"
                  cardId="ranking-methodology"
                  glowColor={colors.primary}
                >
                  <div className="flex flex-col items-start gap-6">
                    <div className="flex flex-col items-start gap-2">
                      <span
                        className="font-['Sora'] text-[22px] font-[600] leading-[28px]"
                        style={{ color: colors.accent }}
                      >
                        Ranking Structure
                      </span>

                      <span
                        className="font-['Inter'] text-[14px] font-[400] leading-[20px]"
                        style={{ color: colors.neutral[600] }}
                      >
                        Candidates are positioned across four hierarchical
                        levels for each job role
                      </span>
                    </div>

                    <div className="flex w-full flex-col items-start overflow-x-auto">
                      <Table
                        header={
                          <Table.HeaderRow>
                            <Table.HeaderCell>Ranking Level</Table.HeaderCell>
                            <Table.HeaderCell>Cohort Scope</Table.HeaderCell>
                            <Table.HeaderCell>
                              Update Frequency
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                              Recruiter Use Case
                            </Table.HeaderCell>
                          </Table.HeaderRow>
                        }
                      >
                        {[
                          {
                            icon: FeatherGlobe,
                            level: "Global",
                            scope: "All candidates within job role",
                            freq: "Real-time",
                            use: "Top-tier talent identification",
                          },
                          {
                            icon: FeatherMap,
                            level: "State",
                            scope: "Candidates within specific state",
                            freq: "Real-time",
                            use: "Regional hiring strategies",
                          },
                          {
                            icon: FeatherMapPin,
                            level: "City",
                            scope: "Candidates within specific city",
                            freq: "Real-time",
                            use: "Local market recruitment",
                          },
                          {
                            icon: FeatherBookOpen,
                            level: "University",
                            scope: "Candidates within specific university",
                            freq: "Real-time",
                            use: "Campus recruitment programs",
                          },
                        ].map((item) => (
                          <Table.Row key={item.level}>
                            <Table.Cell>
                              <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <item.icon
                                    style={{ color: colors.primary }}
                                  />
                                </motion.div>
                                <span
                                  className="whitespace-nowrap text-body-bold font-body-bold"
                                  style={{ color: colors.accent }}
                                >
                                  {item.level}
                                </span>
                              </motion.div>
                            </Table.Cell>
                            <Table.Cell>
                              <span
                                className="whitespace-nowrap text-body font-body"
                                style={{ color: colors.neutral[600] }}
                              >
                                {item.scope}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              <span
                                className="whitespace-nowrap text-body font-body"
                                style={{ color: colors.neutral[600] }}
                              >
                                {item.freq}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              <span
                                className="whitespace-nowrap text-body font-body"
                                style={{ color: colors.neutral[600] }}
                              >
                                {item.use}
                              </span>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table>
                    </div>

                    <div
                      className="flex h-px w-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
                      }}
                    />

                    <div className="flex flex-col items-start gap-3 w-full">
                      <span
                        className="font-['Sora'] text-[14px] font-[600] leading-[20px] flex items-center gap-2"
                        style={{ color: colors.accent }}
                      >
                        <FeatherStar style={{ color: colors.primary }} />
                        Key Characteristics
                      </span>

                      {[
                        "Rankings update automatically upon score recalculation",
                        "All rankings are role-specific and maintain separate hierarchies per job track",
                        "Recruiters can filter and search across all ranking levels simultaneously",
                      ].map((text, idx) => (
                        <motion.div
                          key={text}
                          className="flex items-start gap-3 cursor-pointer group"
                          whileHover={{ x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FeatherCheckSquare
                              style={{ color: colors.primary }}
                              className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform"
                            />
                          </motion.div>
                          <span
                            className="font-['Inter'] text-[14px] font-[400] leading-[20px]"
                            style={{ color: colors.neutral[600] }}
                          >
                            {text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </section>

          {/* ============ IMPACT ON HIRING SECTION ============ */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-start gap-12">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-tight sm:leading-[48px] lg:leading-[56px]"
                  style={{ color: colors.accent }}
                >
                  Impact on Hiring Operations
                </motion.span>

                <GlassCard
                  className="w-full"
                  cardId="impact-hiring"
                  glowColor={colors.primary}
                >
                  <div className="flex flex-col items-start gap-6">
                    {[
                      {
                        title: "Increased Transparency",
                        desc: "Standardized metrics eliminate ambiguity in candidate evaluation",
                        color: colors.primary,
                      },
                      {
                        title: "Reduced Signal Noise",
                        desc: "Verified capability indicators replace unverifiable résumé claims",
                        color: "#8B5CF6",
                      },
                      {
                        title: "Accelerated Shortlisting",
                        desc: "National rankings enable rapid candidate identification without manual screening",
                        color: "#10B981",
                      },
                      {
                        title: "Merit-Based Discovery",
                        desc: "Capability gains visibility regardless of institutional affiliation",
                        color: "#F59E0B",
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={item.title}
                        className="flex items-start gap-4 group cursor-pointer"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="flex h-10 w-10 flex-none items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`,
                            border: `1px solid ${item.color}30`,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FeatherCheckCircle style={{ color: item.color }} />
                        </motion.div>

                        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                          <span
                            className="font-['Sora'] text-[16px] font-[600] leading-[24px]"
                            style={{ color: colors.accent }}
                          >
                            {item.title}
                          </span>

                          <span
                            className="font-['Inter'] text-[14px] font-[400] leading-[20px]"
                            style={{ color: colors.neutral[600] }}
                          >
                            {item.desc}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </section>

          {/* ============ CTA SECTION ============ */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 bg-white/30 backdrop-blur-md border-y border-white/30">
            <div className="max-w-4xl mx-auto text-center">
              <GlassCard>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-8"
                >
                  <div className="flex flex-col items-center gap-4">
                    <motion.span
                      className="font-['Sora'] text-[32px] sm:text-[40px] lg:text-[48px] font-[700] leading-[56px]"
                      style={{ color: colors.accent }}
                    >
                      Generate Your{" "}
                      <motion.span
                        style={{ color: colors.primary }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Hireability Index
                      </motion.span>
                    </motion.span>

                    <span
                      className="font-['Inter'] text-[16px] font-[400] leading-[24px] -tracking-[0.01em]"
                      style={{ color: colors.neutral[600] }}
                    >
                      Be part of a new, merit-first way of showcasing talent
                    </span>
                  </div>

                  <GlassButton
                    onClick={() => navigate("/upload-resume")}
                    variant="primary"
                    icon={<FeatherZap />}
                  >
                    Finish Profile Setup
                  </GlassButton>
                </motion.div>
              </GlassCard>
            </div>
          </section>
        </div>

        <Footer />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </>
  );
};

export default TalentRankingPlatform;
