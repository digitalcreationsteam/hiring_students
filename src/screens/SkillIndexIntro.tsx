"use client";

import React from "react";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { FeatherArrowLeft } from "@subframe/core";
import { FeatherInfo } from "@subframe/core";
import { useNavigate } from "react-router-dom";

function SkillIndexIntro() {
  const navigate = useNavigate();
  return (
    <>
      <HeaderLogo />
    <div className="min-h-screen bg-neutral-50 px-4 sm:px-6 md:px-8 py-0 sm:py-0 md:py-0 flex items-center justify-center ">
      <div className="w-full max-w-[660px] mx-auto relative">
        <div className="flex w-full flex-col items-start gap-9 rounded-3xl border border-solid border-neutral-border bg-white px-5 sm:px-8 md:px-10 py-8 sm:py-12 md:py-14 shadow-lg">
          <div className="flex w-full items-center gap-3">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />
            <div className="flex flex-1 items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-violet-700" />
              <div className="h-1 flex-1 rounded-full bg-gray-300" />
              <div className="h-1 flex-1 rounded-full bg-gray-300" />
              <div className="h-1 flex-1 rounded-full bg-gray-300" />
              <div className="h-1 flex-1 rounded-full bg-gray-300" />
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-3">
            <h2 className="text-xl sm:text-2xl md:text-[30px] text-neutral-900">
              Now let's calculate your Skill Index
            </h2>

            <p className="text-xs sm:text-sm text-neutral-500">
              The Skill Index is the foundation of UniTalent’s hiring system and
              the most important step in your evaluation. It provides evidence
              of job readiness and role-relevant knowledge, enabling
              transparent, skill-first hiring
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-6">
            <span className="text-heading-3 text-semibold font-heading-3 text-default-font">
              What happens next
            </span>
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-violet-200 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-neutral-900">
                  Choose your job domain
                </p>
                <p className="text-xs text-neutral-500">
                  You will be asked to select your primary job domain — the role
                  you want to be evaluated for.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-violet-200 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-neutral-900">
                  Take the Skill Index Assessment
                </p>
                <p className="text-xs text-neutral-500">
                  You will complete a focused, role-specific assessment designed
                  to objectively evaluate your readiness for this role.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-violet-200 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-neutral-900">
                  Get your Hireability Score
                </p>
                <p className="text-xs text-neutral-500">
                  Your performance here directly impacts how recruiters
                  discover, evaluate, and rank your profile on UniTalent.
                </p>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-violet-300 bg-violet-50 px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                  <FeatherInfo className="h-4 w-4 text-violet-600" />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-neutral-900">Note :</p>
                  <p className="text-xs leading-relaxed text-neutral-600 max-w-[560px]">
                    This is the most critical part of the process.
                    <br /> Recruiters rely on the Skill Index to make decisions.
                    <br /> Your performance here determines how you stand among
                    others competing for the same roles.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-3 border-t border-neutral-200 pt-6">
            <Button
              className="h-9 w-full rounded-2xl bg-violet-600 text-sm font-medium text-white hover:bg-violet-700 transition"
              size="large"
              onClick={() => navigate("/job-domain")}
            >
              Proceed to Skill Index Assessment
            </Button>

            {/* Skip button */}
            <button
  onClick={() => navigate("/dashboard")}
  className="text-xs font-medium text-neutral-500 hover:text-neutral-700 transition"
>
  Skip for now
</button>

          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default SkillIndexIntro;
