"use client";

import React from "react";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { FeatherArrowLeft } from "@subframe/core";
import { FeatherInfo } from "@subframe/core";
import { useNavigate } from "react-router-dom";
import { colors } from "src/common/Colors";

function SkillIndexIntro() {
  const navigate = useNavigate();
  return (
    <>
      <HeaderLogo />
      {/* 🌈 Blended background - fixed behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-10">
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
      
 <div className="w-full max-w-[660px] mx-auto relative">
  <div
    className="flex w-full flex-col items-start gap-9 rounded-3xl px-5 sm:px-8 md:px-10 py-8 sm:py-12 md:py-14 shadow-lg"
    style={{
      backgroundColor: colors.white,
      border: `1px solid ${colors.neutral[200]}`,
    }}
  >
         <div className="flex w-full items-center gap-3">
  <IconButton
    size="small"
    icon={<FeatherArrowLeft />}
    onClick={() => navigate(-1)}
  />

  <div className="flex flex-1 items-center gap-2">
    <div
      className="h-1 flex-1 rounded-full"
      style={{ backgroundColor: colors.primary }}
    />
    {[1, 2, 3, 4].map((step) => (
      <div
        key={step}
        className="h-1 flex-1 rounded-full"
        style={{ backgroundColor: colors.neutral[200] }}
      />
    ))}
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
  <span
    className="text-heading-3 font-semibold"
    style={{ color: colors.neutral[800] }}
  >
    What happens next
  </span>

  {/* Step 1 */}
  <div className="flex items-start gap-4">
    <div
      className="mt-1 h-6 w-6 rounded-full shrink-0"
      style={{ backgroundColor: colors.primaryGlow }}
    />
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium" style={{ color: colors.neutral[800] }}>
        Choose your job domain
      </p>
      <p className="text-xs" style={{ color: colors.neutral[600] }}>
        You will be asked to select your primary job domain — the role
        you want to be evaluated for.
      </p>
    </div>
  </div>

  {/* Step 2 */}
  <div className="flex items-start gap-4">
    <div
      className="mt-1 h-6 w-6 rounded-full shrink-0"
      style={{ backgroundColor: colors.primaryGlow }}
    />
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium" style={{ color: colors.neutral[800] }}>
        Take the Skill Index Assessment
      </p>
      <p className="text-xs" style={{ color: colors.neutral[600] }}>
        You will complete a focused, role-specific assessment designed
        to objectively evaluate your readiness for this role.
      </p>
    </div>
  </div>

  {/* Step 3 */}
  <div className="flex items-start gap-4">
    <div
      className="mt-1 h-6 w-6 rounded-full shrink-0"
      style={{ backgroundColor: colors.primaryGlow }}
    />
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium" style={{ color: colors.neutral[800] }}>
        Get your Hireability Score
      </p>
      <p className="text-xs" style={{ color: colors.neutral[600] }}>
        Your performance here directly impacts how recruiters
        discover, evaluate, and rank your profile on UniTalent.
      </p>
    </div>
  </div>

  {/* Note Box */}
  <div
    className="w-full rounded-2xl border px-4 sm:px-6 py-4 sm:py-5 backdrop-blur-sm"
    style={{
      backgroundColor: `${colors.primaryGlow}CC`,
      borderColor: colors.primary,
    }}
  >
    <div className="flex items-start gap-4">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <FeatherInfo className="h-4 w-4" style={{ color: colors.accent }} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium" style={{ color: colors.neutral[800] }}>
          Note :
        </p>
        <p
          className="text-xs leading-relaxed max-w-[560px]"
          style={{ color: colors.neutral[600] }}
        >
          This is the most critical part of the process.
          <br /> Recruiters rely on the Skill Index to make decisions.
          <br /> Your performance here determines how you stand among
          others competing for the same roles.
        </p>
      </div>
    </div>
  </div>
</div>


<div
  className="flex w-full flex-col items-stretch gap-3 sm:gap-4 border-t pt-5 sm:pt-6"
  style={{ borderColor: colors.neutral[200] }}
>
  <Button
    size="large"
    onClick={() => navigate("/job-domain")}
    className="
      w-full
      h-10 sm:h-11
      rounded-2xl
      text-sm sm:text-base
      font-semibold
      transition
      active:scale-[0.99]
    "
    style={{
      backgroundColor: colors.accent,
      color: colors.background,
    }}
  >
    Proceed to Skill Index Assessment
  </Button>

  <button
    onClick={() => navigate("/dashboard")}
    className="w-full text-center text-xs sm:text-sm font-medium transition"
    style={{ color: colors.neutral[600] }}
  >
    Skip for now
  </button>
</div>


        </div>
      </div>
    </>
  );
}

export default SkillIndexIntro;
