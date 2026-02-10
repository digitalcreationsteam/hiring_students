// "use client";

// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/components/Button";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import { useNavigate, useLocation } from "react-router-dom";
// import HeaderLogo from "src/ui/components/HeaderLogo";
// import { FeatherArrowLeft, FeatherClock, FeatherCompass, FeatherFileText, FeatherUser } from "@subframe/core";

// function CaseAssessmentOpening() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const { opening, attemptId } = state || {};

//   useEffect(() => {
//     if (!opening || !attemptId) {
//       navigate("/case-assessments");
//     }
//   }, [opening, attemptId, navigate]);

//   if (!opening || !attemptId) {
//     return null;
//   }

//   return (
//     <>
//       <HeaderLogo />

//       <div className="flex min-h-screen justify-center bg-neutral-50 px-4 py-6">
//         <div className="w-full max-w-[1100px] flex flex-col gap-8">
//           {/* Back */}
//           <Button
//             variant="neutral-tertiary"
//             size="small"
//             icon={<FeatherArrowLeft />}
//             onClick={() => navigate(-1)}
//           />

//           {/* Hero */}
//           <div className="flex flex-col items-center gap-4 text-center">
//             <IconWithBackground
//               className="bg-violet-200 text-violet-700 rounded-2xl"
//               size="large"
//               icon={<FeatherFileText />}
//               square
//             />

//             <h1 className="text-[28px] font-heading-1">
//               Product Management Case Study
//             </h1>

//             <p className="max-w-[750px] text-sm text-gray-600">
//               You are stepping into a real-world product leadership scenario.
//               Read carefully — your decisions will be evaluated.
//             </p>
//           </div>

//           {/* Context Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//             <ContextCard
//               icon={<FeatherClock />}
//               label="Timeline"
//               value={opening.year}
//             />
//             <ContextCard
//               icon={<FeatherCompass />}
//               label="Market"
//               value={opening.marketContext}
//             />
//             <ContextCard
//               icon={<FeatherUser />}
//               label="Your Role"
//               value="Lead Product Manager"
//             />
//           </div>

//           {/* Opening Text */}
//           <div className="rounded-3xl border bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold mb-4">Case Brief</h2>
//             <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-[380px] overflow-y-auto">
//               {opening.openingText}
//             </div>
//           </div>

//           {/* CTA */}
//           <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
//             <Button
//               className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl px-6"
//               size="large"
//               onClick={() =>
//                 navigate("/case-assessment-questions", {
//                   state: { attemptId, caseId: opening.caseId },
//                 })
//               }
//             >
//               Begin Case Assessment
//             </Button>

//             <button
//               className="text-sm text-gray-500 hover:text-gray-700"
//               onClick={() => navigate("/dashboard")}
//             >
//               Exit case
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// export default CaseAssessmentOpening;

// /* Helper */
// function ContextCard({ icon, label, value }: any) {
//   return (
//     <div className="flex items-center gap-4 rounded-3xl border bg-white px-6 py-5 shadow-sm">
//       <IconWithBackground
//         className="bg-violet-200 text-violet-700 rounded-xl"
//         icon={icon}
//         size="medium"
//       />
//       <div>
//         <div className="text-xs text-gray-500">{label}</div>
//         <div className="text-sm font-semibold">{value}</div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useEffect } from "react";
// import { Button } from "../ui/components/Button";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import { useNavigate, useLocation } from "react-router-dom";
// import HeaderLogo from "src/ui/components/HeaderLogo";
// import { 
//   FeatherArrowLeft, 
//   FeatherClock, 
//   FeatherCompass, 
//   FeatherFileText, 
//   FeatherUser,
//   FeatherTarget,
//   FeatherTrendingUp,
//   FeatherZap
// } from "@subframe/core";
// import { colors } from "src/common/Colors";

// // Helper function to safely get color value
// const getColorString = (color: any, fallback = "#000000"): string => {
//   if (typeof color === "string") return color;
//   if (color && typeof color === "object") {
//     return color[600] || color[800] || color[400] || color[200] || color[100] || color[50] || fallback;
//   }
//   return fallback;
// };

// function CaseAssessmentOpening() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const { opening, attemptId } = state || {};

//   useEffect(() => {
//     if (!opening || !attemptId) {
//       navigate("/case-assessments");
//     }
//   }, [opening, attemptId, navigate]);

//   if (!opening || !attemptId) {
//     return null;
//   }

//   const primaryColor = getColorString(colors.primary, "#7c3aed");
//   const secondaryColor = getColorString(colors.secondary, "#4f46e5");
//   const accentColor = getColorString(colors.accent, "#ec4899");
//   const backgroundColor = getColorString(colors.background, "#f8fafc");

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Blended background - Covers entire page */}
//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="absolute inset-0"
//           style={{ backgroundColor }}
//         />

//         <div
//           className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
//           style={{
//             background: `radial-gradient(circle at 60% 60%, ${primaryColor}AA, transparent 52%)`,
//           }}
//         />

//         <div
//           className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
//           style={{
//             background: `radial-gradient(circle at 50% 30%, ${secondaryColor}99, transparent 62%)`,
//           }}
//         />

//         <div
//           className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
//           style={{
//             background: `radial-gradient(circle at 50% 50%, ${accentColor}44, transparent 62%)`,
//           }}
//         />
//       </div>

//       {/* Header and content with z-index to stay above background */}
//       <div className="relative z-10">
//         <HeaderLogo />
        
//         <div className="flex min-h-screen w-full justify-center px-4 sm:px-6 lg:px-8 py-0 sm:py-0">
//           <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 sm:gap-8 py-8">
//             <Button
//               variant="neutral-tertiary"
//               size="small"
//               icon={<FeatherArrowLeft />}
//               onClick={() => navigate(-1)}
//             />

//             {/* Hero Section */}
//             <div className="flex w-full flex-col items-center gap-6">
//               <IconWithBackground
//                 style={{ backgroundColor: primaryColor, color: "white" }}
//                 className="rounded-2xl"
//                 size="large"
//                 icon={<FeatherFileText />}
//                 square={true}
//               />
              
//               <div className="flex flex-col items-center gap-3">
//                 <span className="text-xl sm:text-2xl md:text-[30px] font-heading-1 text-default-font text-center">
//                   Product Management Case Study
//                 </span>

//                 <span className="max-w-[90%] sm:max-w-[800px] text-sm font-body text-center text-subtext-color">
//                   You are stepping into a real-world product leadership scenario.
//                   Read carefully — your decisions will be evaluated.
//                 </span>
//               </div>
//             </div>

//             {/* Context Cards */}
//             <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-6">
//               <ContextCard
//                 icon={<FeatherClock />}
//                 label="Timeline"
//                 value={opening.year}
//                 color={primaryColor}
//               />
//               <ContextCard
//                 icon={<FeatherTarget />}
//                 label="Market Context"
//                 value={opening.marketContext}
//                 color={secondaryColor}
//               />
//               <ContextCard
//                 icon={<FeatherUser />}
//                 label="Your Role"
//                 value="Lead Product Manager"
//                 color={accentColor}
//               />
//             </div>

//             {/* Stats Bar */}
//             <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:gap-8 rounded-3xl border border-solid border-neutral-border bg-white px-8 py-6 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <FeatherClock className="text-body font-body" style={{ color: primaryColor }} />
//                 <span className="text-body-bold font-body-bold text-default-font">
//                   60-90 minutes
//                 </span>
//               </div>
//               <div className="hidden sm:flex h-8 w-px bg-neutral-border" />
//               <div className="flex items-center gap-3">
//                 <FeatherTrendingUp className="text-body font-body" style={{ color: primaryColor }} />
//                 <span className="text-body-bold font-body-bold text-default-font">
//                   Contributes to Hireability Index
//                 </span>
//               </div>
//               <div className="hidden sm:flex h-8 w-px bg-neutral-border" />
//               <div className="flex items-center gap-3">
//                 <FeatherZap className="text-body font-body" style={{ color: primaryColor }} />
//                 <span className="text-body-bold font-body-bold text-default-font">
//                   Real-world scenario based
//                 </span>
//               </div>
//             </div>

//             {/* Opening Text */}
//             <div className="flex w-full flex-col items-start gap-5 rounded-2xl border bg-white shadow-sm px-6 py-6 sm:px-8 sm:py-8">
//               <div className="flex w-full items-center justify-between">
//                 <h2 className="text-lg sm:text-xl font-semibold text-default-font">
//                   Case Brief
//                 </h2>
//                 <span className="px-3 py-1 rounded-full text-xs font-bold border"
//                   style={{
//                     backgroundColor: primaryColor + "20",
//                     color: primaryColor,
//                     borderColor: primaryColor + "40"
//                   }}
//                 >
//                   Read Carefully
//                 </span>
//               </div>

//               <div className="w-full h-px bg-neutral-200" />

//               <div className="text-sm text-subtext-color leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto px-1">
//                 {opening.openingText}
//               </div>
//             </div>

//             {/* CTA */}
//             <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8">
//               <Button
//                 disabled={false}
//                 style={{ backgroundColor: primaryColor, color: "white" }}
//                 className="w-full max-w-[280px] h-10 rounded-2xl hover:opacity-90 text-white font-semibold"
//                 size="large"
//                 icon={<FeatherZap />}
//                 onClick={() =>
//                   navigate("/case-assessment-questions", {
//                     state: { attemptId, caseId: opening.caseId },
//                   })
//                 }
//               >
//                 Begin Case Assessment
//               </Button>

//               <button
//                 className="text-body font-body text-subtext-color hover:text-gray-700 transition"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 Exit case
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Helper */
// function ContextCard({ icon, label, value, color }: any) {
//   return (
//     <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-4 sm:px-6 py-4 sm:py-6 shadow-sm">
//       <div className="flex w-full items-center gap-3">
//         <IconWithBackground
//           style={{ backgroundColor: color + "20", color: color }}
//           className="rounded-2xl"
//           size="medium"
//           icon={icon}
//         />
//         <span className="text-heading-3 font-heading-3 text-default-font">
//           {label}
//         </span>
//       </div>
//       <span className="text-sm text-subtext-color">
//         {value}
//       </span>
//     </div>
//   );
// }

// export default CaseAssessmentOpening;

"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/components/Button";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { 
  FeatherArrowLeft, 
  FeatherClock, 
  FeatherTarget,
  FeatherUser,
  FeatherTrendingUp,
  FeatherZap,
  FeatherCheckCircle,
  FeatherAlertCircle,
  FeatherInfo,
  FeatherBook
} from "@subframe/core";
import { colors } from "src/common/Colors";

// Helper function to safely get color value
const getColorString = (color: any, fallback = "#000000"): string => {
  if (typeof color === "string") return color;
  if (color && typeof color === "object") {
    return color[600] || color[800] || color[400] || color[200] || color[100] || color[50] || fallback;
  }
  return fallback;
};

function CaseAssessmentOpening() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { opening, attemptId } = state || {};

  useEffect(() => {
    if (!opening || !attemptId) {
      navigate("/case-assessments");
    }
  }, [opening, attemptId, navigate]);

  if (!opening || !attemptId) {
    return null;
  }

  const primaryColor = getColorString(colors.primary, "#7c3aed");
  const secondaryColor = getColorString(colors.secondary, "#4f46e5");
  const accentColor = getColorString(colors.accent, "#ec4899");
  const backgroundColor = getColorString(colors.background, "#f8fafc");

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Blended background - Covers entire page */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ backgroundColor }}
        />

        <div
          className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
          style={{
            background: `radial-gradient(circle at 60% 60%, ${primaryColor}AA, transparent 52%)`,
          }}
        />

        <div
          className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${secondaryColor}99, transparent 62%)`,
          }}
        />

        <div
          className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}44, transparent 62%)`,
          }}
        />
      </div>

      {/* Header and content with z-index to stay above background */}
      <div className="relative z-10 flex flex-col flex-1">
        <HeaderLogo />
        
        {/* Reduced top margin */}
        <div className="flex w-full justify-center px-4 sm:px-6 lg:px-8 pt-4 flex-1">
          <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6">
            
            {/* LEFT SIDE - Case Brief */}
            <div className="lg:w-3/5 flex flex-col gap-6">
              
              {/* Back Button */}
              {/* <div className="mb-1 mr-20">
                <Button
                  variant="neutral-tertiary"
                  size="small"
                  icon={<FeatherArrowLeft />}
                  onClick={() => navigate(-1)}
                />
              </div> */}

              {/* Case Brief Header */}
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                <div 
                  className="px-6 py-4 border-b"
                  style={{ 
                    borderColor: primaryColor + "20",
                    backgroundColor: primaryColor + "05"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-6 rounded-full" style={{ backgroundColor: colors.primary }} />
                      <h2 className="text-lg font-semibold text-neutral-900">Case Study Brief</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: colors.primary,
                        color: "black"
                      }}
                    >
                      Read Carefully
                    </span>
                  </div>
                </div>
                
                {/* Case Content */}
                <div className="px-6 py-6">
                  <div className="prose prose-sm max-w-none">
                    {/* Introduction */}
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
  <span
    className="w-10 h-10 flex items-center justify-center rounded-full"
    style={{ backgroundColor: colors.primary }}
  >
    <FeatherBook className="w-5 h-5 text-black" />
  </span>

  Scenario Overview
</h3>

                      <p className="text-neutral-700 leading-relaxed mb-4">
                        You are stepping into the role of Lead Product Manager at a growing tech company facing critical market challenges. Your decisions will directly impact the company's trajectory and market position.
                      </p>
                    </div>
                    
                    {/* Main Case Text */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                        The Challenge
                      </h4>
                      <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                        <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                          {opening.openingText}
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Considerations */}
                    {/* <div className="mb-6">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3">Key Considerations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-blue-800 mb-2">✅ Expected Approach</h5>
                          <ul className="text-xs text-blue-700 space-y-1.5">
                            <li className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                              Show strategic thinking process
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                              Consider multiple stakeholders
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                              Balance short vs long-term goals
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-emerald-800 mb-2">📈 Evaluation Focus</h5>
                          <ul className="text-xs text-emerald-700 space-y-1.5">
                            <li className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5" />
                              Decision quality & rationale
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5" />
                              Problem-solving methodology
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5" />
                              Communication clarity
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div> */}
                    
                    {/* Success Metrics */}
                    {/* <div className="pt-4 border-t border-neutral-200">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3">Success Metrics</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Strategic Alignment",
                          "Business Impact",
                          "Feasibility",
                          "Innovation",
                          "Execution Plan"
                        ].map((metric, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 rounded-full text-xs font-medium border"
                            style={{
                              backgroundColor: primaryColor + "08",
                              color: primaryColor,
                              borderColor: primaryColor + "20"
                            }}
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Information Panel */}
            <div className="lg:w-2/5 flex flex-col gap-6">
              
              {/* Assessment Header */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <div className="flex flex-col items-center text-center gap-4">
                  <IconWithBackground
                    style={{ backgroundColor: primaryColor, color: "black" }}
                    className="rounded-2xl"
                    size="large"
                    icon={<FeatherCheckCircle />}
                    square={true}
                  />
                  
                  <div className="flex flex-col items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                      Case Assessment
                    </h1>
                    <p className="text-sm text-neutral-600 max-w-md">
                      Your strategic decisions will be evaluated by industry experts
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Information Cards */}
              <div className="grid grid-cols-2 gap-4">
                <ContextCard
                  icon={<FeatherClock />}
                  label="Timeline"
                  value={opening.year}
                  color={primaryColor}
                  compact
                />
                <ContextCard
                  icon={<FeatherTarget />}
                  label="Market"
                  value={opening.marketContext}
                  color={secondaryColor}
                  compact
                />
                <ContextCard
                  icon={<FeatherUser />}
                  label="Your Role"
                  value="Lead PM"
                  color={accentColor}
                  compact
                />
                <ContextCard
                  icon={<FeatherTrendingUp />}
                  label="Impact"
                  value="High"
                  color={primaryColor}
                  compact
                />
              </div>

              {/* Assessment Details */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <FeatherInfo className="w-4 h-4" />
                  Assessment Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Duration</span>
                    <span className="text-sm font-medium text-neutral-900">60-90 minutes</span>
                  </div>
                  
                  <div className="h-px bg-neutral-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Questions</span>
                    <span className="text-sm font-medium text-neutral-900">Multiple sections</span>
                  </div>
                  
                  <div className="h-px bg-neutral-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Scoring</span>
                    <span className="text-sm font-medium text-neutral-900">Points based evaluation</span>
                  </div>
                  
                  <div className="h-px bg-neutral-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Attempts</span>
                    <span className="text-sm font-medium text-neutral-900">One per case</span>
                  </div>
                </div>
              </div>

              {/* CTA Button - Sticky */}
              <div className="sticky top-6">
                <Button
                  style={{ backgroundColor: colors.accent, color: "black" }}
                  className="w-full h-12 rounded-xl hover:opacity-90 text-white font-semibold shadow-lg"
                  size="large"
                  icon={<FeatherZap />}
                  onClick={() =>
                    navigate("/case-assessment-questions", {
                      state: { attemptId, caseId: opening.caseId },
                    })
                  }
                >
                  Begin Assessment
                </Button>
                
                <button
                  className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700 mt-3"
                  onClick={() => navigate("/dashboard")}
                >
                  Exit to dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper - Compact version */
function ContextCard({ icon, label, value, color, compact = false }: any) {
  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: colors.primary,
              color: "black"
            }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-neutral-500 truncate">{label}</p>
            <p className="text-sm font-semibold text-neutral-900 truncate">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div 
          className="p-3 rounded-xl flex-shrink-0"
          style={{ 
            backgroundColor: color + "10",
            color: color
          }}
        >
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-lg font-semibold text-neutral-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default CaseAssessmentOpening;
