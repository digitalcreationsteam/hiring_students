"use client";

import React from "react";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { Table } from "../ui/components/Table";
import { FeatherAward } from "@subframe/core";
import { FeatherBookOpen } from "@subframe/core";
import { FeatherBriefcase } from "@subframe/core";
import { FeatherCheckCircle } from "@subframe/core";
import { FeatherCheckSquare } from "@subframe/core";
import { FeatherCode } from "@subframe/core";
import { FeatherCrosshair } from "@subframe/core";
import { FeatherGlobe } from "@subframe/core";
import { FeatherInstagram } from "@subframe/core";
import { FeatherLayers } from "@subframe/core";
import { FeatherLinkedin } from "@subframe/core";
import { FeatherMap } from "@subframe/core";
import { FeatherMapPin } from "@subframe/core";
import { FeatherMedal } from "@subframe/core";
import { FeatherScale } from "@subframe/core";
import { FeatherSliders } from "@subframe/core";
import { FeatherTarget } from "@subframe/core";
import { FeatherTrophy } from "@subframe/core";
import { FeatherTwitter } from "@subframe/core";
import { FeatherUsers } from "@subframe/core";
import { useNavigate } from "react-router-dom";
import { colors } from "src/common/Colors";

function TalentRankingPlatform() {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center overflow-x-hidden relative">
      {/* 🎨 Linear gradient background - fixed behind everything */}
      <div 
        className="pointer-events-none fixed inset-0 -z-10"
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
      />

      {/* Hero Section */}
      <div className="flex w-full flex-col items-center px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative z-10">
        <div className="flex w-full max-w-[768px] flex-col items-start gap-8">
          <div className="flex flex-col items-start gap-6">
            <Badge
              className="text-[14px]"
              variant="neutral"
              style={{
                backgroundColor: colors.neutral?.[100] || "#F3F4F6",
                color: colors.accent,
              }}
            >
              Standardized Talent Infrastructure
            </Badge>

            <span
              className="font-['Inter']
    text-[24px] sm:text-[32px] md:text-[26px] lg:text-[56px]
    font-[600]
    leading-tight sm:leading-[40px] lg:leading-[60px]
    -tracking-[0.04em]"
              style={{ color: colors.accent }}
            >
              Welcome to UniTalent: A New Data-Driven Approach To Early-Career
              Hiring
            </span>

            <div className="flex flex-col items-start gap-6">
              <div
                className="flex items-start gap-4 rounded-3xl px-6 py-5 shadow-lg"
                style={{
                  backgroundColor: `${colors.white}`,
                  border: `1px solid ${colors.primary}60`,
                }}
              >
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-3">
                  <span
                    className="font-['Inter'] text-[16px] font-[600] leading-[24px] -tracking-[0.01em]"
                    style={{ color: colors.accent }}
                  >
                    The Traditional Résumé Paradox
                  </span>

                  <span
                    className="whitespace-pre-wrap font-['Inter'] text-[15px] leading-[20px]"
                    style={{ color: colors.neutral[600] }}
                  >
                    {`High-performing students today often do everything the system asks of them. They maintain strong academic records, participate in competitive programs, build projects, gain practical experience through internships, and prepare rigorously for interviews. Years of consistent effort are invested with the reasonable expectation that this work will translate into opportunity.

In practice, that connection is increasingly weak.

Modern hiring processes frequently (and unfortunately) reward résumé optimisation, keyword alignment, and access to informal networks rather than demonstrated capability. Candidates who are adept at self-presentation or who benefit from the right introductions can advance more quickly, even when their underlying skills are comparable or weaker. As a result, many capable students are not filtered out because they lack ability, but because their effort is difficult to observe or compare at scale.

This is not an isolated issue. Across universities and early-career pipelines, a structural gap has emerged between the work candidates put in and the signals employers are able to rely on. Talent is abundant, but visibility is uneven. Effort is real, but difficult to quantify.

So we built UniTalent to fix this.

Instead of rewarding résumé tricks, we quantify the work you’ve actually done — your projects, your experience, your consistency, your growth. Every hour you’ve invested counts for something measurable. And once quantified, your profile is benchmarked against peers in your university, your city, and nationwide.

Recruiters can immediately identify real talent with data, not guesswork.

No shortcuts.
No keyword-hunting.
No inflated résumés.

Just genuine, deserving, hardworking talent rising to the top — exactly where it should be.`}
                  </span>
                </div>
              </div>
              <span
                className="font-['Inter'] text-[20px] font-[400] leading-[28px] -tracking-[0.01em]"
                style={{ color: colors.neutral[600] }}
              >
                UniTalent introduces a standardized ranking framework, through
                test assesments, designed to address structural inconsistencies
                in résumé-based evaluation. By shifting from narrative
                description to measured indicators of capability, the platform
                provides recruiters with transparent, data-backed methods for
                identifying qualified candidates while improving visibility for
                early-career talent.
              </span>
            </div>
          </div>
          <div
            className="flex h-px w-full flex-none flex-col items-center gap-2"
            style={{ backgroundColor: colors.neutral[200] }}
          />
          <div className="flex flex-col items-start gap-4">
            <span
              className="font-['Inter'] text-[20px] font-[500] leading-[20px] uppercase -tracking-[0.01em]"
              style={{ color: colors.accent }}
            >
              Core Principles
            </span>

            <div className="flex flex-col items-start gap-3">
              <div className="flex items-start gap-3">
                <FeatherCheckSquare style={{ color: colors.accent }} />
                <span
                  className="font-['Inter'] text-[18px] font-[400] leading-[24px] -tracking-[0.01em]"
                  style={{ color: colors.neutral[800] }}
                >
                  Eliminates subjectivity and keyword optimization in candidate
                  screening
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span
                  className="font-['Inter'] text-[18px] font-[400] leading-[24px] -tracking-[0.01em]"
                  style={{ color: colors.neutral[800] }}
                >
                  Provides verifiable, standardized capability metrics
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span
                  className="font-['Inter'] text-[18px] font-[400] leading-[24px] -tracking-[0.01em]"
                  style={{ color: colors.neutral[800] }}
                >
                  Supports signal-driven hiring with reduced ambiguity
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span
                  className="font-['Inter'] text-[18px] font-[400] leading-[24px] -tracking-[0.01em]"
                  style={{ color: colors.neutral[800] }}
                >
                  Enables fair, merit-based candidate discovery at scale
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Keep white background cards on gradient */}
      <div className="flex w-full flex-col items-center px-6 py-24 relative z-10">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
          {/* Heading */}
          <div className="flex flex-col items-start gap-3">
            <span
              className="font-['Georgia'] text-[26px] sm:text-[32px] lg:text-[40px]
  font-[500] leading-tight sm:leading-[40px] lg:leading-[48px]
  tracking-tight"
              style={{ color: colors.accent }}
            >
              How UniTalent Works
            </span>

            <span
              className="font-['Inter'] text-[20px] font-[400] leading-[24px]"
              style={{ color: colors.neutral[600] }}
            >
              A structured system that converts candidate data into clear,
              standardized measures of capability
            </span>
          </div>

          {/* Cards - All white with shadows */}
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div
              className="flex grow flex-col items-start gap-4 rounded-3xl px-6 py-6 shadow-lg"
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-medium"
                style={{
                  backgroundColor: `${colors.primary}34`,
                  color: colors.accent,
                }}
              >
                1
              </div>
              <div className="flex flex-col items-start gap-2">
                <span
                  className="font-['Inter'] text-[22px] font-[600] leading-[22px]"
                  style={{ color: colors.accent }}
                >
                  Profile Creation
                </span>
                <span
                  className="font-['Inter'] text-[16px] leading-[22px]"
                  style={{ color: colors.neutral[600] }}
                >
                  Candidates submit academic background, work experience,
                  certifications, and project involvement through structured
                  data fields.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              className="flex grow flex-col items-start gap-4 rounded-3xl px-6 py-6 shadow-lg"
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-medium"
                style={{
                  backgroundColor: `${colors.primary}34`,
                  color: colors.accent,
                }}
              >
                2
              </div>
              <div className="flex flex-col items-start gap-2">
                <span 
                  className="font-['Inter'] text-[22px] font-[600] leading-[22px]"
                  style={{ color: colors.accent }}
                >
                  Score Generation
                </span>
                <span 
                  className="font-['Inter'] text-[16px] leading-[22px]"
                  style={{ color: colors.neutral[600] }}
                >
                  The system processes inputs to generate your Experience Index.
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              className="flex grow flex-col items-start gap-4 rounded-3xl px-6 py-6 shadow-lg"
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-medium"
                style={{
                  backgroundColor: `${colors.primary}34`,
                  color: colors.accent,
                }}
              >
                3
              </div>
              <div className="flex flex-col items-start gap-2">
                <span 
                  className="font-['Inter'] text-[22px] font-[600] leading-[22px]"
                  style={{ color: colors.accent }}
                >
                  Skill Assessment
                </span>
                <span 
                  className="font-['Inter'] text-[16px] leading-[22px]"
                  style={{ color: colors.neutral[600] }}
                >
                  A role-specific assessment measures current job-ready
                  capability and provides you with the Skill Index.
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div 
              className="flex grow flex-col items-start gap-4 rounded-3xl px-6 py-6 shadow-lg"
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-medium"
                style={{
                  backgroundColor: `${colors.primary}34`,
                  color: colors.accent,
                }}
              >
                4
              </div>
              <div className="flex flex-col items-start gap-2">
                <span 
                  className="font-['Inter'] text-[22px] font-[600] leading-[22px]"
                  style={{ color: colors.accent }}
                >
                  Recruiter Access
                </span>
                <span 
                  className="font-['Inter'] text-[16px] leading-[22px]"
                  style={{ color: colors.neutral[600] }}
                >
                  Your aggregated indexes feed into UniTalent’s ranking system,
                  enabling recruiters to efficiently discover high-performing
                  candidates.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three-Score Architecture Section */}
      <div className="flex w-full flex-col items-center px-4 py-16 sm:px-6 sm:py-24 lg:py-32 relative z-10">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-16">
          <div className="flex flex-col items-start gap-4">
            <span
              className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px] font-[600] leading-tight sm:leading-[40px] lg:leading-[48px] text-center -tracking-[0.04em]"
              style={{ color: colors.accent }}
            >
              The Three-Score Architecture
            </span>

            <span
              className="w-full max-w-[768px] font-['Inter'] text-[19px] font-[400] leading-[24px] -tracking-[0.01em]"
              style={{ color: colors.neutral[600] }}
            >
              UniTalent evaluates candidates using two standardized dimensions —
              a Skill Index (from assessments) and an Experience Index (from
              education, work, projects and awards) — which are combined into a
              single Hireability Index
            </span>
          </div>

          <div className="flex w-full flex-col items-start gap-8">
            {/* Experience Index Card */}
            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex w-16 rounded-xl flex-col items-center pt-2">
                <IconWithBackground
                  className="rounded-2xl text-[28px]"
                  style={{
                    backgroundColor: `${colors.accent}1A`,
                    color: colors.accent,
                  }}
                  size="x-large"
                  icon={<FeatherBriefcase />}
                  square={true}
                />
              </div>

              <div
                className="rounded-3xl shadow-lg px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10"
                style={{
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.neutral[200]}`,
                }}
              >
                {/* ... Experience Index content remains the same ... */}
                <div className="flex flex-col items-start gap-3">
                  <span
                    className="font-['Inter'] text-[30px] font-[600] leading-[36px] -tracking-[0.02em]"
                    style={{ color: colors.accent }}
                  >
                    Experience Index
                  </span>

                  <Badge
                    className="rounded-2xl text-[12px]"
                    style={{
                      backgroundColor: `${colors.accent}1A`,
                      color: colors.accent,
                    }}
                  >
                    Quantifying Your Effort and the Visibility It Deserves
                  </Badge>
                </div>

                <div
                  className="flex h-px w-full"
                  style={{ backgroundColor: colors.neutral[200] }}
                />

                <div className="flex flex-col items-start gap-4">
                  <span
                    className="font-['Inter'] text-[20px] font-[400] leading-[24px] -tracking-[0.01em] whitespace-pre-wrap"
                    style={{ color: colors.neutral[600] }}
                  >
                    {
                      "Remember all those projects you built, the hackathons you joined, the awards you earned — and then had to cram just two lines of them into a “1-page résumé” because that’s what the industry demands?\n\nYeah… we decided that makes zero sense.\n\nOn our platform, every bit of effort counts. Every internship, every certification, every late-night project — even the ones you couldn’t fit on the résumé — finally gets quantified. Because all that hard work should matter."
                    }
                  </span>

                  <div
                    className="flex h-px w-full"
                    style={{ backgroundColor: colors.neutral[200] }}
                  />

                  <div className="flex flex-col items-start gap-3">
                    <span
                      className="font-['Inter'] text-[16px] font-[500] leading-[20px] -tracking-[0.01em]"
                      style={{ color: colors.accent }}
                    >
                      What Gets Measured
                    </span>

                    <div className="flex flex-col items-start gap-3">
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
                        { icon: FeatherTrophy, text: "Awards & competitions" },
                        {
                          icon: FeatherUsers,
                          text: "Leadership & campus involvement",
                        },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-start gap-3">
                          <Icon style={{ color: colors.primary }} />
                          <span
                            className="font-['Inter'] text-[16px] font-[400] leading-[20px] -tracking-[0.01em]"
                            style={{ color: colors.neutral[600] }}
                          >
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="flex h-px w-full"
                  style={{ backgroundColor: colors.neutral[200] }}
                />
              </div>
            </div>

            {/* Skill Index Card */}
            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex w-16 flex-none flex-col items-center pt-2">
                <IconWithBackground
                  className="rounded-2xl text-[28px]"
                  variant="brand"
                  size="x-large"
                  icon={<FeatherCrosshair />}
                  square={true}
                  style={{
                    backgroundColor: `${colors.accent}1A`,
                    color: colors.accent,
                  }}
                />
              </div>

              <div
                className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 shadow-lg"
                style={{
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.neutral[200]}`,
                }}
              >
                {/* ... Skill Index content remains the same ... */}
                <div className="flex flex-col items-start gap-3">
                  <span
                    className="font-['Inter'] text-[30px] font-[600] leading-[36px] -tracking-[0.02em]"
                    style={{ color: colors.accent }}
                  >
                    Skill Index
                  </span>

                  <Badge
                    className="rounded-2xl text-[12px]"
                    variant="brand"
                    style={{
                      backgroundColor: `${colors.accent}1A`,
                      color: colors.accent,
                    }}
                  >
                    Job-Ready Capability Assessment
                  </Badge>
                </div>

                <div
                  className="flex h-px w-full"
                  style={{ backgroundColor: colors.neutral[200] }}
                />

                <div className="flex flex-col items-start gap-4">
                  <span
                    className="whitespace-pre-wrap font-['Inter'] text-[20px] font-[400] leading-[24px] -tracking-[0.01em]"
                    style={{ color: colors.neutral[600] }}
                  >
                    {
                      "Ever seen résumé lines like “spearheaded cross-functional initiatives to drive technical excellence”?\nImpressive wording — but none of it proves you can actually code, design, analyse, or lead. \n\nWe believed there had to be a better way.\nSo we created the Skill Index — a concise, role-specific assessment that reveals how strong you really are at the skill required for your job. No buzzwords. No padding. Just a clean, verifiable measure of actual ability.\n\nSkill first. Storytelling second."
                    }
                  </span>

                  <div
                    className="flex h-px w-full"
                    style={{ backgroundColor: colors.neutral[200] }}
                  />

                  <div className="flex flex-col items-start gap-3">
                    <span
                      className="font-['Inter'] text-[14px] font-[500] leading-[20px] -tracking-[0.01em]"
                      style={{ color: colors.accent }}
                    >
                      How We Measure It
                    </span>

                    <div className="flex flex-col items-start gap-3">
                      <div className="flex items-start gap-3">
                        <FeatherTarget style={{ color: colors.primary }} />
                        <span
                          className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                          style={{ color: colors.neutral[600] }}
                        >
                          A short, targeted assessment built around the core
                          tasks of desired role
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <FeatherCheckCircle style={{ color: colors.primary }} />
                        <span
                          className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                          style={{ color: colors.neutral[600] }}
                        >
                          Evaluation based on correctness, clarity of thinking,
                          and applied skill
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <FeatherScale style={{ color: colors.primary }} />
                        <span
                          className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                          style={{ color: colors.neutral[600] }}
                        >
                          Standardized scoring to ensure fairness across varied
                          educational backgrounds
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex h-px w-full"
                  style={{ backgroundColor: colors.neutral[200] }}
                />
              </div>
            </div>

            {/* Hireability Index Card */}
            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex w-16 flex-none flex-col items-center pt-2">
                <IconWithBackground
                  className="rounded-2xl text-[28px]"
                  variant="brand"
                  size="x-large"
                  icon={<FeatherMedal />}
                  square={true}
                  style={{
                    backgroundColor: `${colors.accent}1A`,
                    color: colors.accent,
                  }}
                />
              </div>

              <div
                className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 shadow-lg"
                style={{
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.neutral[200]}`,
                }}
              >
                {/* ... Hireability Index content remains the same ... */}
                <div className="flex flex-col items-start gap-3">
                  <span
                    className="font-['Inter'] text-[30px] font-[600] leading-[36px] -tracking-[0.02em]"
                    style={{ color: colors.accent }}
                  >
                    Hireability Index
                  </span>

                  <Badge
                    className="rounded-2xl text-[12px]"
                    variant="brand"
                    style={{
                      backgroundColor: `${colors.accent}1A`,
                      color: colors.accent,
                    }}
                  >
                    Unified Talent Benchmark
                  </Badge>
                </div>

                <div
                  className="flex h-px w-full"
                  style={{ backgroundColor: colors.neutral[200] }}
                />

                <div className="flex flex-col items-start gap-4">
                  <span
                    className="font-['Inter'] text-[20px] font-[400] leading-[24px] -tracking-[0.01em]"
                    style={{ color: colors.neutral[600] }}
                  >
                    The Hireability Index is your central score — the number
                    that pulls together your skills and your hard-earned
                    experience to show the world exactly how job-ready you are.
                    It's what determines your rank in your university, city,
                    state, and across the entire country — helping recruiters
                    instantly spot the best talent at the most granular level.
                    No more getting lost in a stack of résumés. Your ability
                    finally has a spotlight — with a score that proves you
                    belong at the top
                  </span>

                  <div
                    className="flex h-px w-full"
                    style={{ backgroundColor: colors.neutral[200] }}
                  />

                  <div className="flex flex-col items-start gap-3">
                    <span
                      className="font-['Inter'] text-[14px] font-[500] leading-[20px] -tracking-[0.01em]"
                      style={{ color: colors.accent }}
                    >
                      How It's Measured
                    </span>

                    <div className="flex flex-col items-start gap-3">
                      <div className="flex items-start gap-3">
                        <FeatherLayers style={{ color: colors.primary }} />
                        <span
                          className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                          style={{ color: colors.neutral[600] }}
                        >
                          A weighted blend of the Skill Index and Experience
                          Index
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <FeatherSliders style={{ color: colors.primary }} />
                        <span
                          className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                          style={{ color: colors.neutral[600] }}
                        >
                          Normalization to remove biases from background,
                          institution
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex h-px w-full"
                  style={{ backgroundColor: colors.neutral[200] }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Benchmarking Layer - Keep cards white */}
      <div className="flex w-full flex-col items-center px-6 py-24 relative z-10">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
          <div className="flex flex-col items-start gap-4">
            <span
              className="font-['Inter'] text-[14px] font-[500] leading-[20px] -tracking-[0.01em] uppercase"
              style={{ color: colors.accent }}
            >
              Global Benchmarking Layer
            </span>

            <span
              className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px] font-[600] leading-tight sm:leading-[40px] lg:leading-[48px] -tracking-[0.04em]"
              style={{ color: colors.accent }}
            >
              Ranking Methodology
            </span>

            <span
              className="w-full max-w-[768px] font-['Inter'] text-[16px] font-[400] leading-[24px] -tracking-[0.01em]"
              style={{ color: colors.neutral[600] }}
            >
              Candidates are ranked across multi-layer cohorts within their
              chosen job role. Rankings update automatically when scores change,
              providing recruiters with granular visibility and supporting
              targeted talent discovery. This structure transitions the score
              framework into actionable hiring outcomes.
            </span>
          </div>

          <div
            className="flex w-full flex-col items-start gap-6 rounded-3xl px-8 py-8 shadow-lg"
            style={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.neutral[200]}`,
            }}
          >
            {/* ... Ranking Structure content remains the same ... */}
            <div className="flex flex-col items-start gap-2">
              <span
                className="font-['Inter'] text-[20px] font-[600] leading-[28px] -tracking-[0.01em]"
                style={{ color: colors.accent }}
              >
                Ranking Structure
              </span>

              <span
                className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                style={{ color: colors.neutral[600] }}
              >
                Candidates are positioned across four hierarchical levels for
                each job role
              </span>
            </div>

            <div className="flex w-full flex-col items-start overflow-x-auto">
              <Table
                header={
                  <Table.HeaderRow>
                    <Table.HeaderCell>Ranking Level</Table.HeaderCell>
                    <Table.HeaderCell>Cohort Scope</Table.HeaderCell>
                    <Table.HeaderCell>Update Frequency</Table.HeaderCell>
                    <Table.HeaderCell>Recruiter Use Case</Table.HeaderCell>
                  </Table.HeaderRow>
                }
              >
                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <FeatherGlobe style={{ color: colors.primary }} />
                      <span
                        className="whitespace-nowrap text-body-bold font-body-bold"
                        style={{ color: colors.accent }}
                      >
                        Global
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      All candidates within job role
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Top-tier talent identification
                    </span>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <FeatherMap style={{ color: colors.primary }} />
                      <span
                        className="whitespace-nowrap text-body-bold font-body-bold"
                        style={{ color: colors.accent }}
                      >
                        State
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Candidates within specific state
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Regional hiring strategies
                    </span>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <FeatherMapPin style={{ color: colors.primary }} />
                      <span
                        className="whitespace-nowrap text-body-bold font-body-bold"
                        style={{ color: colors.accent }}
                      >
                        City
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Candidates within specific city
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Local market recruitment
                    </span>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <FeatherBookOpen style={{ color: colors.primary }} />
                      <span
                        className="whitespace-nowrap text-body-bold font-body-bold"
                        style={{ color: colors.accent }}
                      >
                        University
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Candidates within specific university
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-body font-body"
                      style={{ color: colors.neutral[600] }}
                    >
                      Campus recruitment programs
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table>
            </div>

            <div
              className="flex h-px w-full"
              style={{ backgroundColor: colors.neutral[200] }}
            />

            <div className="flex flex-col items-start gap-3">
              <span
                className="font-['Inter'] text-[14px] font-[500] leading-[20px] -tracking-[0.01em]"
                style={{ color: colors.accent }}
              >
                Key Characteristics
              </span>

              {[
                "Rankings update automatically upon score recalculation",
                "All rankings are role-specific and maintain separate hierarchies per job track",
                "Recruiters can filter and search across all ranking levels simultaneously",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <FeatherCheckSquare style={{ color: colors.primary }} />
                  <span
                    className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                    style={{ color: colors.neutral[600] }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact on Hiring Operations - Keep cards white */}
      <div className="flex w-full flex-col items-center px-6 py-24 relative z-10">
        <div className="flex w-full max-w-[768px] flex-col items-start gap-12">
          <span
            className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px] font-[600] leading-tight sm:leading-[40px] lg:leading-[48px] -tracking-[0.04em]"
            style={{ color: colors.accent }}
          >
            Impact on Hiring Operations
          </span>

          <div
            className="flex w-full flex-col items-start gap-6 rounded-3xl px-8 py-8 shadow-lg"
            style={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.neutral[200]}`,
            }}
          >
            {[
              {
                title: "Increased Transparency",
                desc: "Standardized metrics eliminate ambiguity in candidate evaluation",
              },
              {
                title: "Reduced Signal Noise",
                desc: "Verified capability indicators replace unverifiable résumé claims",
              },
              {
                title: "Accelerated Shortlisting",
                desc: "National rankings enable rapid candidate identification without manual screening",
              },
              {
                title: "Merit-Based Discovery",
                desc: "Capability gains visibility regardless of institutional affiliation",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.primary}1A` }}
                >
                  <FeatherCheckCircle style={{ color: colors.primary }} />
                </div>

                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span
                    className="font-['Inter'] text-[16px] font-[600] leading-[24px] -tracking-[0.01em]"
                    style={{ color: colors.accent }}
                  >
                    {item.title}
                  </span>

                  <span
                    className="font-['Inter'] text-[14px] font-[400] leading-[20px] -tracking-[0.01em]"
                    style={{ color: colors.neutral[600] }}
                  >
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex w-full flex-col items-center px-6 py-24 relative z-10">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <span
              className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px] font-[600] leading-[48px] -tracking-[0.04em]"
              style={{ color: colors.accent }}
            >
              Generate Your Hireability Index
            </span>

            <span
              className="font-['Inter'] text-[16px] font-[400] leading-[24px] -tracking-[0.01em]"
              style={{ color: colors.neutral[600] }}
            >
              Be part of a new, merit-first way of showcasing talent
            </span>
          </div>
          <Button
            size="large"
            onClick={() => navigate("/paywall")}
            className="w-full h-11 sm:h-12 rounded-3xl text-[15px] sm:text-[16px] font-semibold transition active:scale-[0.99] shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span
              className="text-[15px] sm:text-[16px] font-semibold"
              style={{ color: colors.white }}
            >
              Finish Profile Setup
            </span>
          </Button>
        </div>
      </div>

      {/* Footer - Keep white background */}
      <div
        className="w-full px-6 py-12 relative z-10"
        style={{
          borderTop: `1px solid ${colors.neutral[200]}`,
          backgroundColor: colors.white,
        }}
      >
        <div className="mx-auto grid w-full max-w-[1024px] grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* ... Footer content remains exactly the same ... */}
          {/* Brand */}
          <div className="flex w-full flex-col gap-4 items-center sm:items-start">
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-32 object-contain"
                src="/hiringLogo2.png"
                alt="hiringLogo"
              />
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <IconButton
                icon={<FeatherTwitter />}
                style={{ color: colors.neutral[600] }}
                onClick={() =>
                  window.open("https://twitter.com/your_handle", "_blank")
                }
              />
              <IconButton
                icon={<FeatherLinkedin />}
                style={{ color: colors.neutral[600] }}
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/your-company",
                    "_blank",
                  )
                }
              />
              <IconButton
                icon={<FeatherInstagram />}
                style={{ color: colors.neutral[600] }}
                onClick={() =>
                  window.open("https://www.instagram.com/your_handle", "_blank")
                }
              />
            </div>
          </div>

          {/* For Candidates */}
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <span
              className="text-[14px] font-[600]"
              style={{ color: colors.accent }}
            >
              For Candidates
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              How It Works
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Job Tracks
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Rankings
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Resources
            </span>
          </div>

          {/* For Recruiters */}
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <span
              className="text-[14px] font-[600]"
              style={{ color: colors.accent }}
            >
              For Recruiters
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Find Talent
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Post Jobs
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Pricing
            </span>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <span
              className="text-[14px] font-[600]"
              style={{ color: colors.accent }}
            >
              Company
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              About
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Blog
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Contact
            </span>
            <span
              style={{ color: colors.neutral[600] }}
              className="text-[13px]"
            >
              Privacy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TalentRankingPlatform;