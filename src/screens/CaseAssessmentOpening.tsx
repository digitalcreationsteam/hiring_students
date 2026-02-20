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
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";

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

  const { attemptId, attemptNumber, caseId, opening } = state || {};

  console.log(attemptNumber);

// Redirect if required data is missing
useEffect(() => {
  if (!opening || !attemptId || !caseId) {
    navigate("/case-assessments");
  }
}, [opening, attemptId, caseId, navigate]);

  // const { attemptId, opening, attemptNumber, caseId } = state || {};

  // useEffect(() => {
  //   if (!opening || !attemptNumber) {
  //     navigate("/case-assessments");
  //   }
  // }, [opening, attemptNumber, navigate]);

  // if (!opening || !attemptNumber) {
  //   return null;
  // }

  const primaryColor = getColorString(colors.primary, "#7c3aed");
  const secondaryColor = getColorString(colors.secondary, "#4f46e5");
  const accentColor = getColorString(colors.accent, "#ec4899");
  const backgroundColor = getColorString(colors.background, "#f8fafc");

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
      width: "100%",
    }}
    className="min-h-screen relative overflow-hidden flex flex-col">

      <div className="w-full relative" style={{ borderColor: colors.aqua }}>
                <Navbar />
              </div>
      {/* Blended background - Covers entire page */}

      {/* Header and content with z-index to stay above background */}
      <div className="relative z-10 flex flex-col flex-1">
        
        
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
                        color: colors.white
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
    style={{ backgroundColor: colors.primary, color: colors.white }}
  >
    <FeatherBook className="w-5 h-5" />
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
                        {/* <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                          {opening.openingText}
                        </div> */}
                        <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line space-y-4">
  
                        {/* Opening Text */}
                        {opening.openingText && (
                          <div>
                            {opening.openingText}
                          </div>
                        )}

                        {/* Opening Image */}
                        {opening.openingImageUrl && (
                          <div className="mt-4">
                            {/* <img
                              src={opening.openingImageUrl}
                              alt="Case Opening"
                              className="w-full rounded-2xl shadow-md border border-neutral-200 object-contain max-h-[500px]"
                            /> */}
                            <iframe
                              src={opening.openingImageUrl.replace("/view?usp=sharing", "/preview")}
                              width="100%"
                              height="500"
                              allow="autoplay"
                              className="rounded-2xl border border-neutral-200"
                            />
                          </div>
                        )}

                      </div>

                      </div>
                    </div>
                    
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
                    style={{ backgroundColor: primaryColor, color: colors.white }}
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
                  style={{ backgroundColor: colors.primary, color: colors.white}}
                  className="w-full h-12 rounded-xl hover:opacity-90 text-white font-semibold shadow-lg"
                  size="large"
                  icon={<FeatherZap />}
                  onClick={() =>
                    navigate("/case-assessment-questions", {
                      state: { attemptId, attemptNumber, caseId },
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
              color: colors.white
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
      <Footer />
    </div>
  );
}

export default CaseAssessmentOpening;
