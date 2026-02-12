// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Button } from "../ui/components/Button";

// export default function CaseAssessmentScore() {
//   const { state } = useLocation();
// const { attemptId, caseId, score, retryAvailable } = state || {};
//   const navigate = useNavigate();

//    useEffect(() => {
//     console.log("Full state from navigation:", state);
//     console.log("attemptId:", attemptId);
//     console.log("caseId:", caseId);
//   }, [state, attemptId, caseId]);

// //   React.useEffect(() => {
// //   if (score === undefined) {

// //     navigate("/case-assessments");
// //   }
// // }, [score, navigate]);


// if (score === undefined) return null;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
//       <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md text-center">

//         <h1 className="text-2xl font-bold mb-4">Case Assessment Completed 🎉</h1>

//         <p className="text-lg mb-6">
//           Your Score: <strong>{score}</strong>
//         </p>

//         <div className="flex flex-col gap-3">
//           <Button
//             className="bg-violet-600 text-white rounded-xl"
//             // onClick={() => navigate("/case-assessment-revel")}
//             onClick={() => {
//                console.log("Navigating to reveal page with caseId:", caseId);
//                 navigate(`/case-assessment-revel/${caseId}`)
//             }}
//           >
//             Reveal
//           </Button>

//           {retryAvailable && (
//             <Button
//               variant="neutral-secondary"
//               onClick={() => navigate("/case-assessments")}
//             >
//               Retry Case Assessment
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/components/Button";
import { FeatherCheckCircle, FeatherEye, FeatherRefreshCw, FeatherHome, FeatherArrowLeft } from "@subframe/core";
import { colors } from "src/common/Colors";

export default function CaseAssessmentScore() {
  const { state } = useLocation();
  const { attemptId, caseId, score, retryAvailable } = state || {};
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Full state from navigation:", state);
    console.log("attemptId:", attemptId);
    console.log("caseId:", caseId);
    console.log("Score:", score);
  }, [state, attemptId, caseId, score]);

  if (score === undefined) {
    return (
      <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
        {/* Blended background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: colors.secondary }}
          />

          <div
            className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
            style={{
              background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
            }}
          />

          <div
            className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
            }}
          />

          <div
            className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-lg text-gray-700 mb-4">Loading score...</div>
            <Button
              onClick={() => navigate("/case-assessments")}
              className="bg-indigo-600 text-white rounded-full px-6"
            >
              Back to Cases
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Determine score category
  const getScoreCategory = (scoreValue: number) => {
    if (scoreValue >= 80) return { 
      message: "Excellent! 🎉", 
      color: colors.accent, 
      bgColor: "#d1fae5",
      textColor: "#065f46"
    };
    if (scoreValue >= 60) return { 
      message: "Good Job! 👍", 
      color: "#f59e0b", 
      bgColor: "#fef3c7",
      textColor: "#92400e"
    };
    return { 
      message: "Keep Practicing!", 
      color: "#ef4444", 
      bgColor: "#fee2e2",
      textColor: "black"
    };
  };

  const scoreCategory = getScoreCategory(score);

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
      {/* Blended background - Covers entire page */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: colors.background }}
        />

        <div
          className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
          style={{
            background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
          }}
        />

        <div
          className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
          }}
        />

        <div
          className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
          }}
        />
      </div>

      {/* Header and content with z-index to stay above background */}
      <div className="relative z-10">
        <div className="min-h-screen w-full flex justify-center px-4 py-4 sm:py-6 lg:py-12">
          <div className="flex w-full max-w-[900px] flex-col items-center justify-center">
            {/* Back Button */}
            <div className="self-start mb-6">
              <Button
                variant="neutral-tertiary"
                size="small"
                icon={<FeatherArrowLeft />}
                onClick={() => navigate("/case-assessments")}
                className="mb-4"
              >
                Back to Cases
              </Button>
            </div>

            {/* Main Content Card */}
            <div
              className="
                flex w-full max-w-lg flex-col items-center gap-8
                rounded-3xl border border-solid border-neutral-border bg-white shadow-lg
                px-6 py-8
                sm:px-10 sm:py-12
              "
            >
              {/* Success Icon */}
              {/* <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary, color: "black" }}
              >
                <FeatherCheckCircle className="w-6 h-6" />
              </div> */}

              <div
              className="w-10 h-10 rounded-full relative"
              style={{ backgroundColor: colors.primary }}
            >
              <FeatherCheckCircle
                className="w-6 h-6 text-black absolute inset-0 m-2.5 text-white"
              />
            </div>
              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-heading-1 text-default-font">
                  Case Assessment Completed!
                </h1>
                <p className="text-body font-body text-subtext-color mt-2 max-w-md">
                  You've successfully completed the case study assessment
                </p>
              </div>

              {/* Score Display */}
              <div className="w-full">
                <div 
                  className="rounded-3xl border border-solid px-6 py-8 shadow-sm"
                  style={{ 
                    backgroundColor: "white",
                    borderColor: colors.accent,
                  }}
                >
                  <div className="text-center mb-4">
                    <p className="text-body font-body text-subtext-color">Your Score</p>
                    <div className="flex items-baseline justify-center gap-2 mt-2">
                      <span 
                        className="text-5xl font-heading-1"
                        style={{ color: "black" }}
                      >
                        {score}
                      </span>
                      <span className="text-lg text-subtext-color">/ 20</span>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="mt-6">
                      <div className="w-full bg-neutral-border rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full"
                          style={{ 
                            width: `${score}%`,
                            backgroundColor: colors.primary
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-subtext-color mt-1">
                        <span>0</span>
                        <span className="font-body-bold">{score}%</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Message */}
                  <div className="text-center mt-6">
                    <p 
                      className="text-heading-3 font-heading-3"
                      style={{ color: scoreCategory.textColor }}
                    >
                      {scoreCategory.message}
                    </p>
                    <p className="text-body font-body text-subtext-color mt-2">
                      {score >= 80 
                        ? "You've mastered this case study!" 
                        : score >= 60 
                        ? "You're on the right track!" 
                        : "Review the reveal to improve!"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-4">
                {/* Reveal Button */}
                <Button
                  onClick={() => {
                    console.log("Navigating to reveal page with caseId:", caseId);
                    navigate(`/case-assessment-revel/${caseId}`, { state: { score, caseId } });
                  }}
                  style={{ backgroundColor: colors.primary , color: colors.white}}
                  className="
                    w-full rounded-2xl py-4
                    hover:opacity-90 transition-opacity
                    [&_span]:!text-white
                    shadow-sm
                  "
                  size="large"
                  // iconLeft={<FeatherEye className="text-white" />}
                >
                  View Case Reveal
                </Button>

                {/* Retry Button */}
                {retryAvailable && (
                  <Button
                    onClick={() => navigate("/case-assessments")}
                    variant="neutral-secondary"
                    className="w-full rounded-2xl py-4 border border-solid border-neutral-border"
                    size="large"
                    // iconLeft={<FeatherRefreshCw />}
                  >
                    Retry Another Case
                  </Button>
                )}

                {/* Home Button */}
                <Button
                  onClick={() => navigate("/case-assessments")}
                  variant="neutral-tertiary"
                  className="w-full rounded-2xl py-4"
                  size="large"
                  // iconLeft={<FeatherHome />}
                >
                  Back to All Cases
                </Button>
              </div>

              {/* Debug Info (only in development) */}
              
            </div>

            {/* Footer Note */}
          </div>
        </div>
      </div>
    </div>
  );
}