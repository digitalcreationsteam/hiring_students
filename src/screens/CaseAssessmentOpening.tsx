"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/components/Button";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { FeatherArrowLeft, FeatherClock, FeatherCompass, FeatherFileText, FeatherUser } from "@subframe/core";

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

  return (
    <>
      <HeaderLogo />

      <div className="flex min-h-screen justify-center bg-neutral-50 px-4 py-6">
        <div className="w-full max-w-[1100px] flex flex-col gap-8">
          {/* Back */}
          <Button
            variant="neutral-tertiary"
            size="small"
            icon={<FeatherArrowLeft />}
            onClick={() => navigate(-1)}
          />

          {/* Hero */}
          <div className="flex flex-col items-center gap-4 text-center">
            <IconWithBackground
              className="bg-violet-200 text-violet-700 rounded-2xl"
              size="large"
              icon={<FeatherFileText />}
              square
            />

            <h1 className="text-[28px] font-heading-1">
              Product Management Case Study
            </h1>

            <p className="max-w-[750px] text-sm text-gray-600">
              You are stepping into a real-world product leadership scenario.
              Read carefully — your decisions will be evaluated.
            </p>
          </div>

          {/* Context Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ContextCard
              icon={<FeatherClock />}
              label="Timeline"
              value={opening.year}
            />
            <ContextCard
              icon={<FeatherCompass />}
              label="Market"
              value={opening.marketContext}
            />
            <ContextCard
              icon={<FeatherUser />}
              label="Your Role"
              value="Lead Product Manager"
            />
          </div>

          {/* Opening Text */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Case Brief</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-[380px] overflow-y-auto">
              {opening.openingText}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl px-6"
              size="large"
              onClick={() =>
                navigate("/case-assessment-questions", {
                  state: { attemptId, caseId: opening.caseId },
                })
              }
            >
              Begin Case Assessment
            </Button>

            <button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => navigate("/dashboard")}
            >
              Exit case
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


export default CaseAssessmentOpening;

/* Helper */
function ContextCard({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border bg-white px-6 py-5 shadow-sm">
      <IconWithBackground
        className="bg-violet-200 text-violet-700 rounded-xl"
        icon={icon}
        size="medium"
      />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
