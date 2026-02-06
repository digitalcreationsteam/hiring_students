import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/components/Button";

export default function CaseAssessmentScore() {
  const { state } = useLocation();
const { attemptId, caseId, score, retryAvailable } = state || {};
  const navigate = useNavigate();

   useEffect(() => {
    console.log("Full state from navigation:", state);
    console.log("attemptId:", attemptId);
    console.log("caseId:", caseId);
  }, [state, attemptId, caseId]);

//   React.useEffect(() => {
//   if (score === undefined) {

//     navigate("/case-assessments");
//   }
// }, [score, navigate]);


if (score === undefined) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md text-center">

        <h1 className="text-2xl font-bold mb-4">Case Assessment Completed 🎉</h1>

        <p className="text-lg mb-6">
          Your Score: <strong>{score}</strong>
        </p>

        <div className="flex flex-col gap-3">
          <Button
            className="bg-violet-600 text-white rounded-xl"
            // onClick={() => navigate("/case-assessment-revel")}
            onClick={() => {
               console.log("Navigating to reveal page with caseId:", caseId);
                navigate(`/case-assessment-revel/${caseId}`)
            }}
          >
            Reveal
          </Button>

          {retryAvailable && (
            <Button
              variant="neutral-secondary"
              onClick={() => navigate("/case-assessments")}
            >
              Retry Case Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
