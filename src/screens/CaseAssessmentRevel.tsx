// "use client";

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import API, { URL_PATH } from "src/common/API";
// import { Button } from "../ui/components/Button";
// import { FeatherArrowLeft, FeatherCheckCircle, FeatherAlertCircle, FeatherBookOpen } from "@subframe/core";
// import { colors } from "src/common/Colors";

// type Reveal = {
//   instructions?: string;
//   solution?: string;
//   [key: string]: any;
// };

// export default function CaseAssessmentReveal() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { caseId } = useParams();

//   const [score, setScore] = useState<number | null>(null);
//   const [reveal, setReveal] = useState<Reveal | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [maxScore, setMaxScore] = useState<number>(100);

//   useEffect(() => {
//     const fetchReveal = async () => {
//       try {
//         setLoading(true);

//         const res = await API(
//           "GET",
//           URL_PATH.getCaseReveal(caseId)
//         );

//         setScore(res.score);
//         setReveal(res.reveal);
//         setMaxScore(res.maxScore || 100);
//       } catch (err) {
//         console.error("Fetch reveal failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReveal();
//   }, [caseId, navigate]);

//   if (loading) return (
//     <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.background }}>
//       <div className="relative z-10 flex items-center justify-center min-h-screen">
//         <div className="text-lg text-default-font">Loading reveal...</div>
//       </div>
//     </div>
//   );

//   if (!reveal)
//     return (
//       <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.background }}>
//         <div className="relative z-10 flex items-center justify-center min-h-screen">
//           <div className="text-center text-red-500 p-6 bg-white rounded-2xl shadow-lg">
//             <FeatherAlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
//             <p className="text-lg font-semibold">Reveal not available</p>
//             <p className="mt-2">Complete the case first to see the reveal.</p>
//             <Button
//               onClick={() => navigate("/case-assessments")}
//               style={{ backgroundColor: colors.primary }}
//               className="mt-4 rounded-full px-6 [&_span]:!text-black"
//             >
//               Back to Case Assessments
//             </Button>
//           </div>
//         </div>
//       </div>
//     );

//   // Calculate percentage
//   const percentage = score !== null ? Math.round((score / maxScore) * 100) : 0;

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Blended background - Covers entire page */}
//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="absolute inset-0"
//           style={{ backgroundColor: colors.background }}
//         />

//         <div
//           className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
//           style={{
//             background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
//           }}
//         />

//         <div
//           className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
//           style={{
//             background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
//           }}
//         />

//         <div
//           className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
//           style={{
//             background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
//           }}
//         />
//       </div>

//       {/* Header and content with z-index to stay above background */}
//       <div className="relative z-10">
//         <div className="min-h-screen w-full flex justify-center px-4 py-4 sm:py-6 lg:py-12">
//           <div className="flex w-full max-w-[900px] flex-col items-stretch gap-6">
//             {/* Back Button */}
//             <div className="flex items-center">
//               <Button
//                 onClick={() => navigate("/case-assessments")}
//                 variant="neutral-secondary"
//                 className="rounded-full"
//                 // iconLeft={<FeatherArrowLeft />}
//               >
//                 Back to Cases
//               </Button>
//             </div>

//             {/* Main Content Card */}
//             <div
//               className="
//                 flex w-full flex-col items-start gap-6
//                 rounded-2xl border bg-white shadow-lg
//                 px-4 py-6
//                 sm:px-8 sm:py-8
//                 lg:px-10 lg:py-10
//               "
//             >
//               {/* Header Section */}
//               <div className="flex w-full flex-col items-center text-center gap-4">
//                 <div className="flex items-center gap-3">
//                   <div 
//                     className="p-3 rounded-full"
//                     style={{ backgroundColor: colors.primary + "20" }}
//                   >
//                     <FeatherBookOpen className="w-8 h-8" style={{ color: colors.primary }} />
//                   </div>
//                   <div>
//                     <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
//                       Case Study Reveal
//                     </h1>
//                     <p className="text-sm text-subtext-color mt-1">
//                       Review your performance and learn from the solution
//                     </p>
//                   </div>
//                 </div>

//                 {/* Score Display */}
//                 <div className="w-full max-w-md mt-2">
//                   <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-neutral-200 rounded-2xl p-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                       <div className="flex items-center gap-3">
//                         <div 
//                           className="p-2 rounded-full"
//                           style={{ backgroundColor: colors.accent }}
//                         >
//                           <FeatherCheckCircle className="w-6 h-6 text-white" />
//                         </div>
//                         <div className="text-left">
//                           <p className="text-sm text-subtext-color">Your Score</p>
//                           <div className="flex items-baseline gap-2">
//                             <span className="text-3xl font-bold text-neutral-800">{score}</span>
//                             <span className="text-sm text-subtext-color">/ {maxScore} points</span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Percentage Circle */}
//                       <div className="relative w-24 h-24">
//                         <svg className="w-full h-full" viewBox="0 0 100 100">
//                           {/* Background circle */}
//                           <circle
//                             cx="50"
//                             cy="50"
//                             r="45"
//                             fill="none"
//                             stroke="#e5e7eb"
//                             strokeWidth="8"
//                           />
//                           {/* Progress circle */}
//                           <circle
//                             cx="50"
//                             cy="50"
//                             r="45"
//                             fill="none"
//                             stroke={percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444"}
//                             strokeWidth="8"
//                             strokeLinecap="round"
//                             strokeDasharray={`${2 * Math.PI * 45}`}
//                             strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
//                             transform="rotate(-90 50 50)"
//                           />
//                         </svg>
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <span className="text-xl font-bold text-neutral-800">{percentage}%</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Performance Message */}
//                     <div className="mt-4 text-center">
//                       <p className={`text-sm font-medium ${
//                         percentage >= 70 ? "text-green-600" : 
//                         percentage >= 50 ? "text-yellow-600" : 
//                         "text-red-600"
//                       }`}>
//                         {percentage >= 70 ? "Excellent! You've mastered this case." :
//                          percentage >= 50 ? "Good job! You're on the right track." :
//                          "Keep practicing! Review the solution carefully."}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Horizontal Divider */}
//               <div className="w-full h-[1px] bg-gray-200 my-2" />

//               {/* Reveal Content */}
//               <div className="w-full space-y-6">
//                 {/* Instructions Section */}
//                 {reveal.instructions && (
//                   <div 
//                     className="p-6 rounded-xl border transition-all duration-300 hover:shadow-md"
//                     style={{ 
//                       backgroundColor: colors.primary + "08",
//                       borderColor: colors.primary + "30"
//                     }}
//                   >
//                     <div className="flex items-center gap-3 mb-4">
//                       <div 
//                         className="p-2 rounded-lg"
//                         style={{ backgroundColor: colors.primary + "20" }}
//                       >
//                         <span className="font-semibold" style={{ color: colors.primary }}>📋</span>
//                       </div>
//                       <h3 className="text-lg font-semibold text-neutral-800">Instructions</h3>
//                     </div>
//                     <div className="pl-12">
//                       <p className="text-neutral-700 leading-relaxed">{reveal.instructions}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Solution Section */}
//                 {reveal.solution && (
//                   <div 
//                     className="p-6 rounded-xl border transition-all duration-300 hover:shadow-md"
//                     style={{ 
//                       backgroundColor: colors.accent + "08",
//                       borderColor: colors.accent + "30"
//                     }}
//                   >
//                     <div className="flex items-center gap-3 mb-4">
//                       <div 
//                         className="p-2 rounded-lg"
//                         style={{ backgroundColor: colors.accent + "20" }}
//                       >
//                         <span className="font-semibold" style={{ color: colors.accent }}>💡</span>
//                       </div>
//                       <h3 className="text-lg font-semibold text-neutral-800">Solution</h3>
//                     </div>
//                     <div className="pl-12">
//                       <p className="text-neutral-700 leading-relaxed">{reveal.solution}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Additional Reveal Sections */}
//                 {Object.keys(reveal).map((key) => {
//                   if (key === "instructions" || key === "solution") return null;

//                   const value = reveal[key];
//                   const sectionColors = [
//                     { bg: colors.secondary + "08", border: colors.secondary + "30", icon: "📊" },
//                     { bg: colors.accent + "08", border: colors.accent + "30", icon: "🎯" },
//                     { bg: colors.primary + "08", border: colors.primary + "30", icon: "🔍" },
//                     { bg: colors.secondary + "08", border: colors.secondary + "30", icon: "📈" },
//                   ];
                  
//                   const colorIndex = Object.keys(reveal).indexOf(key) % sectionColors.length;
//                   const colorset = sectionColors[colorIndex];

//                   return (
//                     <div 
//                       key={key}
//                       className="p-6 rounded-xl border transition-all duration-300 hover:shadow-md"
//                       style={{ 
//                         backgroundColor: colorset.bg,
//                         borderColor: colorset.border
//                       }}
//                     >
//                       <div className="flex items-center gap-3 mb-4">
//                         <div 
//                           className="p-2 rounded-lg"
//                           style={{ backgroundColor: colorset.bg.replace('08', '20') }}
//                         >
//                           <span className="font-semibold">{colorset.icon}</span>
//                         </div>
//                         <h3 className="text-lg font-semibold text-neutral-800 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                         </h3>
//                       </div>
                      
//                       <div className="pl-12">
//                         {Array.isArray(value) ? (
//                           <div className="space-y-3">
//                             {value.map((item: any, idx: number) => (
//                               <div
//                                 key={item._id || idx}
//                                 className="p-4 rounded-lg border bg-white"
//                                 style={{ borderColor: colors.primary + "20" }}
//                               >
//                                 {Object.entries(item).map(([k, v]) => (
//                                   <div key={k} className="mb-2 last:mb-0">
//                                     <span className="font-medium text-neutral-700 capitalize">
//                                       {k.replace(/([A-Z])/g, ' $1')}:{" "}
//                                     </span>
//                                     <span className="text-neutral-600">
//                                       {typeof v === 'object' ? JSON.stringify(v) : String(v)}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             ))}
//                           </div>
//                         ) : typeof value === "object" && value !== null ? (
//                           <pre className="whitespace-pre-wrap bg-white p-4 rounded-lg border text-sm overflow-x-auto">
//                             {JSON.stringify(value, null, 2)}
//                           </pre>
//                         ) : (
//                           <p className="text-neutral-700 leading-relaxed">{String(value)}</p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Horizontal Divider */}
//               <div className="w-full h-[1px] bg-gray-200 my-2" />

//               {/* Action Buttons */}
//               <div className="flex w-full flex-col sm:flex-row gap-3 justify-between items-center">
//                 <div className="text-sm text-subtext-color">
//                   Ready for your next challenge?
//                 </div>
//                 <div className="flex gap-3">
//                   <Button
//                     onClick={() => navigate("/case-assessments")}
//                     variant="neutral-secondary"
//                     className="rounded-full px-6"
//                   >
//                     View All Cases
//                   </Button>
//                   <Button
//                     onClick={() => navigate("/assessment")}
//                     style={{ backgroundColor: colors.primary }}
//                     className="rounded-full px-6 [&_span]:!text-black"
//                   >
//                     Take Regular Assessment
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Footer Note */}
//             <div className="text-center text-sm text-subtext-color">
//               <p>Your performance data is saved to your learning profile. Review regularly to track your progress.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import API, { URL_PATH } from "src/common/API";
// import { Button } from "../ui/components/Button";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import HeaderLogo from "src/ui/components/HeaderLogo";
// import { 
//   FeatherArrowLeft, 
//   FeatherCheckCircle, 
//   FeatherAlertCircle, 
//   FeatherBookOpen,
//   FeatherAward,
//   FeatherTrendingUp,
//   FeatherInfo,
//   FeatherClock,
//   FeatherTarget,
//   FeatherUser,
//   FeatherEye,
//   FeatherHome,
//   FeatherFileText,
//   FeatherArrowRight
// } from "@subframe/core";
// import { colors } from "src/common/Colors";

// type Reveal = {
//   instructions?: string;
//   solution?: string;
//   [key: string]: any;
// };

// // Helper function to safely get color value
// const getColorString = (color: any, fallback = "#000000"): string => {
//   if (typeof color === "string") return color;
//   if (color && typeof color === "object") {
//     return color[600] || color[800] || color[400] || color[200] || color[100] || color[50] || fallback;
//   }
//   return fallback;
// };

// export default function CaseAssessmentReveal() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { caseId } = useParams();

//   const [score, setScore] = useState<number | null>(null);
//   const [reveal, setReveal] = useState<Reveal | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [maxScore, setMaxScore] = useState<number>(100);

//   useEffect(() => {
//     const fetchReveal = async () => {
//       try {
//         setLoading(true);
//         const res = await API("GET", URL_PATH.getCaseReveal(caseId));
//         console.log("Reveal API Response:", res);
//         setScore(res.score);
//         setReveal(res.reveal);
//         setMaxScore(res.maxScore || 100);
//       } catch (err) {
//         console.error("Fetch reveal failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReveal();
//   }, [caseId, navigate]);

//   if (loading) return (
//     <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
//       {/* Blended background */}
//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="absolute inset-0"
//           style={{ backgroundColor: colors.background }}
//         />
//         <div
//           className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
//           style={{
//             background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
//           }}
//         />
//         <div
//           className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
//           style={{
//             background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
//           }}
//         />
//         <div
//           className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
//           style={{
//             background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
//           }}
//         />
//       </div>
//       <div className="relative z-10 flex items-center justify-center min-h-screen">
//         <div className="text-lg text-default-font">Loading reveal...</div>
//       </div>
//     </div>
//   );

//   if (!reveal) return (
//     <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
//       {/* Blended background */}
//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="absolute inset-0"
//           style={{ backgroundColor: colors.background }}
//         />
//         <div
//           className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
//           style={{
//             background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
//           }}
//         />
//         <div
//           className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
//           style={{
//             background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
//           }}
//         />
//         <div
//           className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
//           style={{
//             background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
//           }}
//         />
//       </div>
//       <div className="relative z-10 flex items-center justify-center min-h-screen">
//         <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
//           <FeatherAlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
//           <p className="text-lg font-semibold text-red-500">Reveal not available</p>
//           <p className="mt-2 text-gray-600">Complete the case first to see the reveal.</p>
//           <Button
//             onClick={() => navigate("/case-assessments")}
//             style={{ backgroundColor: colors.primary }}
//             className="mt-4 rounded-full px-6 [&_span]:!text-black"
//           >
//             Back to Case Assessments
//           </Button>
//         </div>
//       </div>
//     </div>
//   );

//   // Calculate percentage and determine performance
//   const percentage = score !== null ? Math.round((score / maxScore) * 100) : 0;
//   const getPerformanceColor = () => {
//     if (percentage >= 80) return { bg: "#d1fae5", text: "#065f46", border: "#10b981" };
//     if (percentage >= 60) return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" };
//     return { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" };
//   };
//   const performanceColor = getPerformanceColor();

//   const primaryColor = getColorString(colors.primary, "#7c3aed");

//   return (
//     <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
//       {/* Blended background - Covers entire page */}
//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="absolute inset-0"
//           style={{ backgroundColor: colors.background }}
//         />
//         <div
//           className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
//           style={{
//             background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
//           }}
//         />
//         <div
//           className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
//           style={{
//             background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
//           }}
//         />
//         <div
//           className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
//           style={{
//             background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
//           }}
//         />
//       </div>

//       {/* Header and content with z-index to stay above background */}
//       <div className="relative z-10 flex flex-col flex-1">
//         <HeaderLogo />
        
//         <div className="flex w-full justify-center px-4 sm:px-6 lg:px-8 pt-4 flex-1">
//           <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6">
            
//             {/* LEFT SIDE - Main Content */}
//             <div className="lg:w-3/5 flex flex-col gap-6">
              
//               {/* Back Button */}
//               <div className="mb-1">
//                 <Button
//                   variant="neutral-tertiary"
//                   size="small"
//                   icon={<FeatherArrowLeft />}
//                   onClick={() => navigate(-1)}
//                 >
//                   Back
//                 </Button>
//               </div>

//               {/* Main Reveal Card */}
//               <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
//                 <div 
//                   className="px-6 py-4 border-b"
//                   style={{ 
//                     borderColor: colors.primary + "20",
//                     backgroundColor: colors.primary + "05"
//                   }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-2 h-6 rounded-full" style={{ backgroundColor: colors.primary }} />
//                       <h2 className="text-lg font-semibold text-neutral-900">Case Study Reveal</h2>
//                     </div>
//                     <span className="px-3 py-1 rounded-full text-xs font-semibold"
//                       style={{
//                         backgroundColor: colors.primary,
//                         color: "black"
//                       }}
//                     >
//                       Expert Analysis
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Reveal Content */}
//                 <div className="px-6 py-6">
//                   <div className="prose prose-sm max-w-none">
//                     {/* Instructions */}
//                     {reveal.instructions && (
//                       <div className="mb-8">
//                         <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
//                           <span
//                             className="w-10 h-10 flex items-center justify-center rounded-full"
//                             style={{ backgroundColor: colors.primary }}
//                           >
//                             <FeatherInfo className="w-5 h-5 text-black" />
//                           </span>
//                           Assessment Instructions
//                         </h3>
//                         <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
//                           <div className="text-sm text-neutral-700 leading-relaxed">
//                             {reveal.instructions}
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Solution */}
//                     {reveal.solution && (
//                       <div className="mb-8">
//                         <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
//                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
//                           Expert Solution
//                         </h4>
//                         <div className="bg-green-50 rounded-xl p-5 border border-green-200">
//                           <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
//                             {reveal.solution}
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Additional Sections */}
//                     {Object.keys(reveal).map((key) => {
//                       if (key === "instructions" || key === "solution") return null;

//                       const value = reveal[key];
//                       const sectionColors = [
//                         { bg: "bg-amber-50", border: "border-amber-200", icon: "🔍", title: "Detailed Analysis" },
//                         { bg: "bg-cyan-50", border: "border-cyan-200", icon: "📈", title: "Performance Metrics" },
//                       ];
                      
//                       const colorIndex = Object.keys(reveal).indexOf(key) % sectionColors.length;
//                       const colorSet = sectionColors[colorIndex];

//                       return (
//                         <div key={key} className={`${colorSet.bg} ${colorSet.border} rounded-xl p-5 mb-6`}>
//                           <div className="flex items-center gap-3 mb-4">
//                             <div className="text-2xl">{colorSet.icon}</div>
//                             <h5 className="text-base font-semibold text-neutral-900 capitalize">
//                               {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                             </h5>
//                           </div>
                          
//                           <div className="ml-2">
//                             {Array.isArray(value) ? (
//                               <div className="space-y-4">
//                                 {value.map((item: any, idx: number) => (
//                                   <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
//                                     {Object.entries(item).map(([k, v]) => (
//                                       <div key={k} className="mb-2">
//                                         <span className="font-medium text-neutral-700 capitalize">
//                                           {k.replace(/([A-Z])/g, ' $1')}:{" "}
//                                         </span>
//                                         <span className="text-neutral-600">
//                                           {typeof v === 'object' ? JSON.stringify(v) : String(v)}
//                                         </span>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 ))}
//                               </div>
//                             ) : typeof value === "object" && value !== null ? (
//                               <pre className="bg-white p-4 rounded-lg border border-gray-200 text-sm overflow-x-auto">
//                                 {JSON.stringify(value, null, 2)}
//                               </pre>
//                             ) : (
//                               <p className="text-neutral-700 leading-relaxed">{String(value)}</p>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT SIDE - Information Panel */}
//             <div className="lg:w-2/5 flex flex-col gap-6">
              
//               {/* Performance Header */}
//               <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
//                 <div className="flex flex-col items-center text-center gap-4">
//                   <IconWithBackground
//                     style={{ backgroundColor: performanceColor.border, color: "white" }}
//                     className="rounded-2xl"
//                     size="large"
//                     icon={<FeatherAward />}
//                     square={true}
//                   />
                  
//                   <div className="flex flex-col items-center gap-2">
//                     <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
//                       Your Performance
//                     </h1>
//                     <p className="text-sm text-neutral-600 max-w-md">
//                       See how you performed and what you can learn
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Score Display */}
//               <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
//                 <div className="text-center mb-6">
//                   <p className="text-body font-body text-subtext-color">Your Score</p>
//                   <div className="flex items-baseline justify-center gap-2 mt-2">
//                     <span 
//                       className="text-5xl font-heading-1"
//                       style={{ color: performanceColor.border }}
//                     >
//                       {score}
//                     </span>
//                     <span className="text-lg text-subtext-color">/ {maxScore} points</span>
//                   </div>
                  
//                   {/* Score Bar */}
//                   <div className="mt-6">
//                     <div className="w-full bg-neutral-border rounded-full h-2.5">
//                       <div 
//                         className="h-2.5 rounded-full"
//                         style={{ 
//                           width: `${percentage}%`,
//                           backgroundColor: performanceColor.border
//                         }}
//                       />
//                     </div>
//                     <div className="flex justify-between text-xs text-subtext-color mt-1">
//                       <span>0</span>
//                       <span className="font-body-bold">{percentage}%</span>
//                       <span>100</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Performance Message */}
//                 <div className="text-center mt-6 p-4 rounded-xl border" 
//                   style={{ 
//                     backgroundColor: performanceColor.bg,
//                     borderColor: performanceColor.border + "40"
//                   }}
//                 >
//                   <p 
//                     className="text-heading-3 font-heading-3 mb-2"
//                     style={{ color: performanceColor.text }}
//                   >
//                     {percentage >= 80 ? "Excellent! 🎉" :
//                      percentage >= 60 ? "Good Job! 👍" :
//                      "Keep Practicing! 💪"}
//                   </p>
//                   <p className="text-body font-body text-neutral-700">
//                     {percentage >= 80 
//                       ? "You've mastered this case study!" 
//                       : percentage >= 60 
//                       ? "You're on the right track!" 
//                       : "Review the solution to improve!"}
//                   </p>
//                 </div>
//               </div>

//               {/* Key Metrics */}
//               <div className="grid grid-cols-2 gap-4">
//                 <ContextCard
//                   icon={<FeatherClock />}
//                   label="Time Spent"
//                   value="Analysis Ready"
//                   color={colors.primary}
//                   compact
//                 />
//                 <ContextCard
//                   icon={<FeatherTarget />}
//                   label="Accuracy"
//                   value={`${percentage}%`}
//                   color={performanceColor.border}
//                   compact
//                 />
//                 <ContextCard
//                   icon={<FeatherTrendingUp />}
//                   label="Skill Growth"
//                   value="+15%"
//                   color={colors.accent}
//                   compact
//                 />
//                 <ContextCard
//                   icon={<FeatherUser />}
//                   label="Peer Rank"
//                   value="Top 40%"
//                   color={colors.secondary}
//                   compact
//                 />
//               </div>

//               {/* Assessment Details */}
//               <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
//                 <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
//                   <FeatherFileText className="w-4 h-4" />
//                   Next Steps
//                 </h3>
                
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-neutral-600">Review Solution</span>
//                     <span className="text-sm font-medium text-neutral-900">30 minutes</span>
//                   </div>
                  
//                   <div className="h-px bg-neutral-100" />
                  
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-neutral-600">Apply Learnings</span>
//                     <span className="text-sm font-medium text-neutral-900">Practice cases</span>
//                   </div>
                  
//                   <div className="h-px bg-neutral-100" />
                  
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-neutral-600">Next Assessment</span>
//                     <span className="text-sm font-medium text-neutral-900">Available now</span>
//                   </div>
                  
//                   <div className="h-px bg-neutral-100" />
                  
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-neutral-600">Retry Available</span>
//                     <span className="text-sm font-medium text-neutral-900">After 7 days</span>
//                   </div>
//                 </div>
//               </div>

//               {/* CTA Buttons - Sticky */}
//               <div className="sticky top-6 flex flex-col gap-3">
//                 <Button
//                   style={{ backgroundColor: colors.primary }}
//                   className="w-full h-12 rounded-xl hover:opacity-90 text-white font-semibold shadow-lg"
//                   size="large"
//                   icon={<FeatherEye />}
//                   onClick={() => navigate("/case-assessments")}
//                 >
//                   Explore More Cases
//                 </Button>
                
//                 <Button
//                   variant="neutral-secondary"
//                   className="w-full h-12 rounded-xl border border-neutral-border"
//                   size="large"
//                   icon={<FeatherHome />}
//                   onClick={() => navigate("/dashboard")}
//                 >
//                   Back to Dashboard
//                 </Button>
                
//                 <Button
//                   variant="neutral-tertiary"
//                   className="w-full h-12 rounded-xl"
//                   size="large"
//                   icon={<FeatherArrowRight />}
//                   onClick={() => navigate("/assessment")}
//                 >
//                   Take Regular Assessment
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Helper - Compact version */
// function ContextCard({ icon, label, value, color, compact = false }: any) {
//   if (compact) {
//     return (
//       <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-sm transition-shadow">
//         <div className="flex items-center gap-3">
//           <div 
//             className="p-2 rounded-lg"
//             style={{ 
//               backgroundColor: colors.primary,
//               color: "black"
//             }}
//           >
//             {icon}
//           </div>
//           <div className="min-w-0">
//             <p className="text-xs font-medium text-neutral-500 truncate">{label}</p>
//             <p className="text-sm font-semibold text-neutral-900 truncate">{value}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
//       <div className="flex items-start gap-4">
//         <div 
//           className="p-3 rounded-xl flex-shrink-0"
//           style={{ 
//             backgroundColor: color + "10",
//             color: color
//           }}
//         >
//           {icon}
//         </div>
        
//         <div className="flex-1 min-w-0">
//           <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
//           <p className="text-lg font-semibold text-neutral-900">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { Button } from "../ui/components/Button";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import HeaderLogo from "src/ui/components/HeaderLogo";
import {
  FeatherArrowLeft,
  FeatherAlertCircle,
  FeatherAward,
  FeatherTrendingUp,
  FeatherInfo,
  FeatherClock,
  FeatherTarget,
  FeatherUser,
  FeatherEye,
  FeatherHome,
  FeatherFileText,
  FeatherArrowRight,
} from "@subframe/core";
import { colors } from "src/common/Colors";

type Reveal = {
  instructions?: string;
  solution?: string;
  [key: string]: any;
};

// Hide any key that looks like an ID
const isIdKey = (key: string) => key.toLowerCase().includes("id");

export default function CaseAssessmentReveal() {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const [score, setScore] = useState<number | null>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [loading, setLoading] = useState(true);
  const [maxScore, setMaxScore] = useState(100);

  useEffect(() => {
    const fetchReveal = async () => {
      try {
        setLoading(true);
        const res = await API("GET", URL_PATH.getCaseReveal(caseId));
        setScore(res.score);
        setReveal(res.reveal);
        setMaxScore(res.maxScore || 100);
      } catch (err) {
        console.error("Reveal fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReveal();
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading reveal...
      </div>
    );
  }

  if (!reveal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl text-center">
          <FeatherAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="font-semibold text-red-500">Reveal not available</p>
          <Button className="mt-4" onClick={() => navigate("/case-assessments")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  const percentage = score ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
      <div className="relative z-10">
        <HeaderLogo />

        <div className="max-w-[1400px] mx-auto px-4 py-4 flex gap-6">
          {/* LEFT */}
          <div className="w-3/5">
            {/* <Button
              variant="neutral-tertiary"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button> */}

            {/* MAIN CARD */}
            <div className="bg-white rounded-2xl border border-neutral-200 mt-4 overflow-hidden">
              {/* Header */}
              <div
                className="px-6 py-4 border-b"
                style={{
                  backgroundColor: colors.primary + "08",
                  borderColor: colors.primary + "20",
                }}
              >
                <h2 className="text-lg font-semibold">Case Study Reveal</h2>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                {/* Instructions */}
                {reveal.instructions && (
                  <div className="mb-6">
                    <h3 className="flex items-center gap-2 font-semibold mb-2">
                      <FeatherInfo /> Instructions
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      {reveal.instructions}
                    </div>
                  </div>
                )}

                {/* Solution */}
                {reveal.solution && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Expert Solution</h3>
                    <div className="bg-green-50 p-4 rounded-xl whitespace-pre-line">
                      {reveal.solution}
                    </div>
                  </div>
                )}

                {/* Dynamic Sections */}
                {Object.keys(reveal).map((key) => {
                  if (
                    key === "instructions" ||
                    key === "solution" ||
                    isIdKey(key)
                  )
                    return null;

                  const value = reveal[key];

                  return (
                    <div key={key} className="mb-6">
                      <h4 className="font-semibold mb-3 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </h4>

                      {Array.isArray(value) ? (
                        value.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border p-4 rounded-lg mb-3"
                          >
                            {Object.entries(item)
                              .filter(([k]) => !isIdKey(k))
                              .map(([k, v]) => (
                                <div key={k} className="text-sm mb-1">
                                  <span className="font-medium">
                                    {k.replace(/([A-Z])/g, " $1")}:
                                  </span>{" "}
                                  {String(v)}
                                </div>
                              ))}
                          </div>
                        ))
                      ) : typeof value === "object" ? (
                        <pre className="bg-gray-50 p-4 rounded-lg text-sm">
                          {JSON.stringify(
                            Object.fromEntries(
                              Object.entries(value).filter(
                                ([k]) => !isIdKey(k)
                              )
                            ),
                            null,
                            2
                          )}
                        </pre>
                      ) : (
                        <p>{String(value)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-2/5 space-y-6">
            <div className="bg-white rounded-2xl border p-6 text-center">
              {/* <IconWithBackground
                icon={<FeatherAward />}
                size="large"
                square
              /> */}
              <h2 className="mt-3 font-bold text-xl">Your Score</h2>
              <p className="text-5xl font-bold mt-2">{score}</p>
              <p className="text-sm text-gray-500">out of {maxScore}</p>

              <div className="mt-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </div>
                <p className="text-sm mt-1">{percentage}%</p>
              </div>
            </div>

            <Button
              className="w-full h-12"
              icon={<FeatherEye />}
              onClick={() => navigate("/case-assessments")}
            >
              Explore More Cases
            </Button>

            <Button
            style={{backgroundColor: colors.primary, color: colors.accent}}
              variant="neutral-secondary"
              className="w-full h-12"
              icon={<FeatherHome />}
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>

            {/* <Button
              style={{backgroundColor: colors.accent, color: "white"}}
              variant="neutral-tertiary"
              className="w-full h-12 text-white"
              icon={<FeatherArrowRight />}
              onClick={() => navigate("/assessment")}
            >
              Take Regular Assessment
            </Button> */}
            <Button
            style={{ backgroundColor: colors.accent }}
            className="w-full h-12 !text-white"
            icon={<FeatherArrowRight />}
            onClick={() => navigate("/assessment")}
          >
            Take Regular Assessment
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

