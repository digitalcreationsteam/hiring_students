"use client";

import React, { useState } from "react";
import { Button } from "../ui/components/Button";
import { useNavigate } from "react-router-dom";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { FeatherArrowLeft } from "@subframe/core";
import { FeatherBook } from "@subframe/core";
import { FeatherCheckSquare } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherCompass } from "@subframe/core";
import { FeatherFileText } from "@subframe/core";
import { FeatherTarget } from "@subframe/core";
import { FeatherTrendingUp } from "@subframe/core";
import { FeatherZap } from "@subframe/core";
import API, { URL_PATH } from "src/common/API";

function AssessmentIntro3() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userId = React.useMemo(() => localStorage.getItem("userId"), []);



  const handleBeginAssessment = async () => {
  if (loading) return;

  if (!userId) {
    console.error("Session expired. Please login again.");
    navigate("/login");
    return;
  }

  setLoading(true);

  try {
    const response = await API(
      "POST",
      URL_PATH.startAssessment,
      {
      },
      { "user-id": userId }
    );

    if (response?.attemptId) {
  navigate("/assessment", {
    state: {
      attemptId: response.attemptId,
      expiresAt: response.expiresAt,
    },
  });
  return;
}
 else {
      console.error(response?.message || "Failed to start assessment");
    }
  } catch (err: any) {
    console.error(err?.message || "Failed to start assessment");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen w-full justify-center bg-neutral-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-8">
        <Button
          variant="neutral-tertiary"
          size="small"
          icon={<FeatherArrowLeft />}
          onClick={() => navigate(-1)}
        />
        <div className="flex w-full flex-col items-center gap-6 ">
          <IconWithBackground
            className="text-violet-700 bg-violet-100 rounded-2xl"
            size="large"
            icon={<FeatherFileText />}
            square={true}
          />
          <div className="flex flex-col items-center gap-3">
            <span className="text-[30px] font-heading-1 text-default-font">
              Product Management Skill Assessment
            </span>
            <span className="max-w-[800px] text-sm font-body text-center">
              This assessment evaluates your readiness for Product Management
              roles through real-world scenarios. You&#39;ll be tested on three
              aspects —
            </span>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-6 py-6 shadow-sm">
            <div className="flex w-full items-center gap-3">
              <IconWithBackground
                className="text-violet-700 bg-violet-100 rounded-2xl"
                variant="brand"
                size="medium"
                icon={<FeatherBook />}
              />
              <span className="text-heading-3 font-heading-3 text-default-font">
                Knowledge
              </span>
            </div>
            <div className="flex w-full flex-col text-xs items-start gap-2">
              <span className="text-body font-body text-subtext-color">
                • Product lifecycle stages and trade-offs
              </span>
              <span className="text-body font-body text-subtext-color">
                • User-centric design and customer discovery
              </span>
              <span className="text-body font-body text-subtext-color">
                • Market sizing, competition, and positioning
              </span>
              <span className="text-body font-body text-subtext-color">
                • Metrics, KPIs, and outcome-based measurement
              </span>
              <span className="text-body font-body text-subtext-color">
                • Agile development and go-to-market fundamentals
              </span>
              <span className="text-body font-body text-subtext-color">
                • Stakeholder dynamics and business fundamentals
              </span>
            </div>
          </div>

          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-6 py-6 shadow-sm">
            <div className="flex w-full items-center gap-3">
              <IconWithBackground
                className="text-violet-700 bg-violet-100 rounded-2xl"
                variant="brand"
                size="medium"
                icon={<FeatherTarget />}
              />
              <span className="text-heading-3 font-heading-3 text-default-font">
                Decision-Making Skills
              </span>
            </div>
            <div className="flex w-full flex-col text-xs items-start gap-2">
              <span className="text-body  font-body text-subtext-color">
                • Breaking down ambiguous problems
              </span>
              <span className="text-body font-body text-subtext-color">
                • Identifying and prioritizing user problems
              </span>
              <span className="text-body font-body text-subtext-color">
                • Making trade-offs between scope, speed, and impact
              </span>
              <span className="text-body font-body text-subtext-color">
                • Defining success metrics and evaluating outcomes
              </span>
              <span className="text-body font-body text-subtext-color">
                • Analyzing qualitative and quantitative inputs
              </span>
              <span className="text-body font-body text-subtext-color">
                • Prioritizing under real-world constraints
              </span>
              <span className="text-body font-body text-subtext-color">
                • Communicating and justifying decisions
              </span>
            </div>
          </div>

          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-6 py-6 shadow-sm">
            <div className="flex w-full items-center gap-3">
              <IconWithBackground
                className="text-violet-700 bg-violet-100 rounded-2xl"
                variant="brand"
                size="medium"
                icon={<FeatherCompass />}
              />
              <span className="text-heading-3 font-heading-3 text-default-font">
                Attributes
              </span>
            </div>
            <div className="flex w-full flex-col text-xs items-start gap-2">
              <span className="text-body font-body text-subtext-color">
                • Structured and first-principles thinking
              </span>
              <span className="text-body font-body text-subtext-color">
                • Customer empathy and ownership
              </span>
              <span className="text-body font-body text-subtext-color">
                • Comfort with ambiguity
              </span>
              <span className="text-body font-body text-subtext-color">
                • Bias toward action and iteration
              </span>
              <span className="text-body font-body text-subtext-color">
                • Strategic judgment over short-term optimization
              </span>
              <span className="text-body font-body text-subtext-color">
                • Balancing data, intuition, and constraints
              </span>
              <span className="text-body font-body text-subtext-color">
                • Decision quality under uncertainty
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-8 rounded-3xl border border-solid border-neutral-border bg-white px-8 py-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FeatherClock className="text-body font-body text-violet-700" />
            <span className="text-body-bold font-body-bold text-default-font">
              25 minutes
            </span>
          </div>
          <div className="flex h-8 w-px flex-none flex-col items-center bg-neutral-border" />
          <div className="flex items-center gap-3">
            <FeatherCheckSquare className="text-body font-body text-violet-700" />
            <span className="text-body-bold font-body-bold text-default-font">
              20 scenario questions
            </span>
          </div>
          <div className="flex h-8 w-px flex-none flex-col items-center bg-neutral-border" />
          <div className="flex items-center gap-3">
            <FeatherTrendingUp className="text-body font-body text-violet-700" />
            <span className="text-body-bold font-body-bold text-default-font">
              Counts toward your Skill Index
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-6 pt-8">
          <Button
            disabled={loading}
            className="w-full max-w-[260px] h-10 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:opacity-60"
            size="large"
            icon={<FeatherZap />}
            onClick={handleBeginAssessment}
          >
            {loading ? "Starting..." : "Begin Skill Index Assessment"}
          </Button>

          <button
            className="text-body font-body text-subtext-color hover:text-gray-700 transition"
            onClick={() => navigate("/dashboard")}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentIntro3;
