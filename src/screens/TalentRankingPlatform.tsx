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

function TalentRankingPlatform() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-neutral-50 overflow-x-hidden">
      <div className="flex w-full flex-col items-center px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="flex w-full max-w-[768px] flex-col items-start gap-8">
          <div className="flex flex-col items-start gap-6">
            <Badge className="text-[14px]" variant="neutral">
              Standardized Talent Infrastructure
            </Badge>
            <span
              className="font-['Inter']
  text-[24px] sm:text-[32px] md:text-[26px] sm:text-[32px] lg:text-[40px]
 lg:text-[56px]
  font-[600]
  leading-tight sm:leading-[40px] lg:leading-[60px]
  text-default-font -tracking-[0.04em]"
            >
              Welcome to UniTalent: A New Data-Driven Approach To Early-Career
              Hiring
            </span>

            <div className="flex flex-col items-start gap-6">
              <div className="flex items-start gap-4 rounded-3xl border border-solid border-yellow-400 bg-violet-200 px-6 py-5 shadow-lg">
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-3">
                  <span className="font-['Inter'] text-[16px] font-[600] leading-[24px] text-default-font -tracking-[0.01em]">
                    The Traditional Résumé Paradox
                  </span>
                  <span className="whitespace-pre-wrap font-['Inter'] text-[15px] leading-[20px] text-neutral-800">
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
              <span className="font-['Inter'] text-[20px] font-[400] leading-[28px] text-gray-600 -tracking-[0.01em]">
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
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-gray-200" />
          <div className="flex flex-col items-start gap-4">
            <span className="font-['Inter'] text-[20px] font-[500] leading-[20px] text-default-font -tracking-[0.01em] uppercase">
              Core Principles
            </span>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span className="font-['Inter'] text-[18px] font-[400] leading-[24px] text-default-font -tracking-[0.01em]">
                  Eliminates subjectivity and keyword optimization in candidate
                  screening
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span className="font-['Inter'] text-[18px] font-[400] leading-[24px] text-default-font -tracking-[0.01em]">
                  Provides verifiable, standardized capability metrics
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span className="font-['Inter'] text-[18px] font-[400] leading-[24px] text-default-font -tracking-[0.01em]">
                  Supports signal-driven hiring with reduced ambiguity
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span className="font-['Inter'] text-[18px] font-[400] leading-[24px] text-default-font -tracking-[0.01em]">
                  Enables fair, merit-based candidate discovery at scale
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center bg-neutral-50 px-6 py-24">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
          {/* Heading */}
          <div className="flex flex-col items-start gap-3">
            <span
              className="font-['Georgia'] text-[26px] sm:text-[32px] lg:text-[40px]
 font-[500] leading-tight sm:leading-[40px] lg:leading-[48px]
 tracking-tight text-default-font"
            >
              How UniTalent Works
            </span>
            <span className="font-['Inter'] text-[20px] font-[400] leading-[24px] text-neutral-600">
              A structured system that converts candidate data into clear,
              standardized measures of capability
            </span>
          </div>

          {/* Cards */}
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="flex grow flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-800 font-medium">
                1
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="font-['Inter'] text-[22px] font-[600] leading-[22px] text-default-font">
                  Profile Creation
                </span>
                <span className="font-['Inter'] text-[16px] leading-[22px] text-neutral-600">
                  Candidates submit academic background, work experience,
                  certifications, and project involvement through structured
                  data fields.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex grow flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-800 font-medium">
                2
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="font-['Inter'] text-[22px] font-[600] leading-[22px] text-default-font">
                  Score Generation
                </span>
                <span className="font-['Inter'] text-[16px] leading-[22px] text-neutral-600">
                  The system processes inputs to generate your Experience Index.
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex grow flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-800 font-medium">
                3
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="font-['Inter'] text-[22px] font-[600] leading-[22px] text-default-font">
                  Skill Assessment
                </span>
                <span className="font-['Inter'] text-[16px] leading-[22px] text-neutral-600">
                  A role-specific assessment measures current job-ready
                  capability and provides you with the Skill Index.
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex grow flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-800 font-medium">
                4
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="font-['Inter'] text-[22px] font-[600] leading-[22px] text-default-font">
                  Recruiter Access
                </span>
                <span className="font-['Inter'] text-[16px] leading-[22px] text-neutral-600">
                  Your aggregated indexes feed into UniTalent’s ranking system,
                  enabling recruiters to efficiently discover high-performing
                  candidates.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-16">
          <div className="flex flex-col items-start gap-4">
            <span
              className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px] font-[600] leading-tight sm:leading-[40px] lg:leading-[48px]
 text-default-font text-center -tracking-[0.04em]"
            >
              The Three-Score Architecture
            </span>
            <span className="w-full max-w-[768px] font-['Inter'] text-[19px] font-[400] leading-[24px] text-gray-600 -tracking-[0.01em]">
              UniTalent evaluates candidates using two standardized dimensions —
              a Skill Index (from assessments) and an Experience Index (from
              education, work, projects and awards) — which are combined into a
              single Hireability Index
            </span>
          </div>
          <div className="flex w-full flex-col items-start gap-8">
            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex w-16 rounded-xl flex-col items-center pt-2">
                <IconWithBackground
                  className="text-violet-700 bg-violet-100 rounded-2xl text-[28px]"
                  size="x-large"
                  icon={<FeatherBriefcase />}
                  square={true}
                />
              </div>
              <div
                className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-3xl border border-solid border-neutral-border bg-white
  px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 shadow-lg"
              >
                <div className="flex flex-col items-start gap-3">
                  <span className="font-['Inter'] text-[30px] font-[600] leading-[36px] text-default-font -tracking-[0.02em]">
                    Experience Index
                  </span>
                  <Badge className="text-violet-700 bg-violet-100 rounded-2xl text-[12px]">
                    Quantifying Your Effort and the Visibility It Deserves
                  </Badge>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-gray-200" />
                <div className="flex flex-col items-start gap-4">
                  <span className="whitespace-pre-wrap font-['Inter'] text-[20px] font-[400] leading-[24px] text-gray-600 -tracking-[0.01em]">
                    {
                      "Remember all those projects you built, the hackathons you joined, the awards you earned — and then had to cram just two lines of them into a “1-page résumé” because that’s what the industry demands?\n\nYeah… we decided that makes zero sense.\n\nOn our platform, every bit of effort counts. Every internship, every certification, every late-night project — even the ones you couldn’t fit on the résumé — finally gets quantified. Because all that hard work should matter."
                    }
                  </span>
                  <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
                  <div className="flex flex-col items-start gap-3">
                    <span className="font-['Inter'] text-[16px] font-[500] leading-[20px] text-default-font -tracking-[0.01em]">
                      What Gets Measured
                    </span>
                    <div className="flex flex-col items-start gap-3">
                      <div className="flex items-start gap-3">
                        <FeatherBookOpen className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[16px] font-[400] leading-[20px] text-gray-600 -tracking-[0.01em]">
                          Education &amp; coursework
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherBriefcase className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[16px] font-[400] leading-[20px] text-gray-600 -tracking-[0.01em]">
                          Internships &amp; work experience
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherCode className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[16px] font-[400] leading-[20px] text-gray-600 -tracking-[0.01em]">
                          Projects &amp; technical builds
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherAward className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[16px] font-[400] leading-[20px] text-gray-600 -tracking-[0.01em]">
                          Certifications &amp; training
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherTrophy className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[16px] font-[400] leading-[20px] text-gray-600 -tracking-[0.01em]">
                          Awards &amp; competitions
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherUsers className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[16px] font-[400] leading-[20px] text-gray-600 -tracking-[0.01em]">
                          Leadership &amp; campus involvement
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex w-16 flex-none flex-col items-center pt-2">
                <IconWithBackground
                  className="text-violet-700 bg-violet-100 rounded-2xl text-[28px]"
                  variant="brand"
                  size="x-large"
                  icon={<FeatherCrosshair />}
                  square={true}
                />
              </div>
              <div
                className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-3xl border border-solid border-neutral-border bg-white
  px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 shadow-lg"
              >
                <div className="flex flex-col items-start gap-3">
                  <span className="font-['Inter'] text-[30px] font-[600] leading-[36px] text-default-font -tracking-[0.02em]">
                    Skill Index
                  </span>
                  <Badge
                    className="text-violet-700 bg-violet-100 rounded-2xl text-[12px]"
                    variant="brand"
                  >
                    Job-Ready Capability Assessment
                  </Badge>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
                <div className="flex flex-col items-start gap-4">
                  <span className="whitespace-pre-wrap font-['Inter'] text-[20px] font-[400] leading-[24px] text-gray-600 -tracking-[0.01em]">
                    {
                      "Ever seen résumé lines like “spearheaded cross-functional initiatives to drive technical excellence”?\nImpressive wording — but none of it proves you can actually code, design, analyse, or lead. \n\nWe believed there had to be a better way.\nSo we created the Skill Index — a concise, role-specific assessment that reveals how strong you really are at the skill required for your job. No buzzwords. No padding. Just a clean, verifiable measure of actual ability.\n\nSkill first. Storytelling second."
                    }
                  </span>
                  <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
                  <div className="flex flex-col items-start gap-3">
                    <span className="font-['Inter'] text-[14px] font-[500] leading-[20px] text-default-font -tracking-[0.01em]">
                      How We Measure It
                    </span>
                    <div className="flex flex-col items-start gap-3">
                      <div className="flex items-start gap-3">
                        <FeatherTarget className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                          A short, targeted assessment built around the core
                          tasks of desired role
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherCheckCircle className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                          Evaluation based on correctness, clarity of thinking,
                          and applied skill
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherScale className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                          Standardized scoring to ensure fairness across varied
                          educational backgrounds
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex w-16 flex-none flex-col items-center pt-2">
                <IconWithBackground
                  className="text-violet-700 bg-violet-100 rounded-2xl text-[28px]"
                  variant="brand"
                  size="x-large"
                  icon={<FeatherMedal />}
                  square={true}
                />
              </div>
              <div
                className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-3xl border border-solid border-neutral-border bg-white
  px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 shadow-lg"
              >
                <div className="flex flex-col items-start gap-3">
                  <span className="font-['Inter'] text-[30px] font-[600] leading-[36px] text-default-font -tracking-[0.02em]">
                    Hireability Index
                  </span>
                  <Badge
                    className="text-violet-700 bg-violet-100 rounded-2xl text-[12px]"
                    variant="brand"
                  >
                    Unified Talent Benchmark
                  </Badge>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
                <div className="flex flex-col items-start gap-4">
                  <span className="font-['Inter'] text-[20px] font-[400] leading-[24px] text-gray-600 -tracking-[0.01em]">
                    The Hireability Index is your central score — the number
                    that pulls together your skills and your hard-earned
                    experience to show the world exactly how job-ready you are.
                    It’s what determines your rank in your university, city,
                    state, and across the entire country — helping recruiters
                    instantly spot the best talent at the most granular level.
                    No more getting lost in a stack of résumés. Your ability
                    finally has a spotlight — with a score that proves you
                    belong at the top
                  </span>
                  <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
                  <div className="flex flex-col items-start gap-3">
                    <span className="font-['Inter'] text-[14px] font-[500] leading-[20px] text-default-font -tracking-[0.01em]">
                      How It’s Measured
                    </span>
                    <div className="flex flex-col items-start gap-3">
                      <div className="flex items-start gap-3">
                        <FeatherLayers className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                          A weighted blend of the Skill Index and Experience
                          Index
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FeatherSliders className="text-body font-body text-neutral-700" />
                        <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                          Normalization to remove biases from background,
                          institution
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2  bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center bg-neutral-50 px-6 py-24 shadow-lg">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
          <div className="flex flex-col items-start gap-4">
            <span className="font-['Inter'] text-[14px] font-[500] leading-[20px] text-violet-700 -tracking-[0.01em] uppercase">
              Global Benchmarking Layer
            </span>
            <span
              className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px]
 font-[600] leading-tight sm:leading-[40px] lg:leading-[48px]
 text-default-font -tracking-[0.04em]"
            >
              Ranking Methodology
            </span>
            <span className="w-full max-w-[768px] font-['Inter'] text-[16px] font-[400] leading-[24px] text-subtext-color -tracking-[0.01em]">
              Candidates are ranked across multi-layer cohorts within their
              chosen job role. Rankings update automatically when scores change,
              providing recruiters with granular visibility and supporting
              targeted talent discovery. This structure transitions the score
              framework into actionable hiring outcomes.
            </span>
          </div>
          <div className="flex w-full flex-col items-start gap-6 rounded-3xl border border-solid border-neutral-border bg-white px-8 py-8">
            <div className="flex flex-col items-start gap-2">
              <span className="font-['Inter'] text-[20px] font-[600] leading-[28px] text-default-font -tracking-[0.01em]">
                Ranking Structure
              </span>
              <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-subtext-color -tracking-[0.01em]">
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
                      <FeatherGlobe className="text-body font-body text-violet-600" />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        Global
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      All candidates within job role
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Top-tier talent identification
                    </span>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <FeatherMap className="text-body font-body text-violet-600" />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        State
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Candidates within specific state
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Regional hiring strategies
                    </span>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <FeatherMapPin className="text-body font-body text-violet-600" />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        City
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Candidates within specific city
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Local market recruitment
                    </span>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <FeatherBookOpen className="text-body font-body text-violet-600" />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        University
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Candidates within specific university
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Real-time
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-700">
                      Campus recruitment programs
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table>
            </div>
            <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-gray-200" />
            <div className="flex flex-col items-start gap-3">
              <span className="font-['Inter'] text-[14px] font-[500] leading-[20px] text-default-font -tracking-[0.01em]">
                Key Characteristics
              </span>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                  Rankings update automatically upon score recalculation
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                  All rankings are role-specific and maintain separate
                  hierarchies per job track
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FeatherCheckSquare className="text-body font-body text-neutral-700" />
                <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-default-font -tracking-[0.01em]">
                  Recruiters can filter and search across all ranking levels
                  simultaneously
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center px-6 py-24">
        <div className="flex w-full max-w-[768px] flex-col items-start gap-12">
          <span
            className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px]
 font-[600] leading-tight sm:leading-[40px] lg:leading-[48px]
 text-default-font -tracking-[0.04em]"
          >
            Impact on Hiring Operations
          </span>
          <div className="flex w-full flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-8 py-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-100">
                <FeatherCheckCircle className="text-heading-3 font-heading-3 text-neutral-700" />
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                <span className="font-['Inter'] text-[16px] font-[600] leading-[24px] text-default-font -tracking-[0.01em]">
                  Increased Transparency
                </span>
                <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-subtext-color -tracking-[0.01em]">
                  Standardized metrics eliminate ambiguity in candidate
                  evaluation
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-100">
                <FeatherCheckCircle className="text-heading-3 font-heading-3 text-neutral-700" />
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                <span className="font-['Inter'] text-[16px] font-[600] leading-[24px] text-default-font -tracking-[0.01em]">
                  Reduced Signal Noise
                </span>
                <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-subtext-color -tracking-[0.01em]">
                  Verified capability indicators replace unverifiable résumé
                  claims
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-100">
                <FeatherCheckCircle className="text-heading-3 font-heading-3 text-neutral-700" />
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                <span className="font-['Inter'] text-[16px] font-[600] leading-[24px] text-default-font -tracking-[0.01em]">
                  Accelerated Shortlisting
                </span>
                <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-subtext-color -tracking-[0.01em]">
                  National rankings enable rapid candidate identification
                  without manual screening
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-100">
                <FeatherCheckCircle className="text-heading-3 font-heading-3 text-neutral-700" />
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                <span className="font-['Inter'] text-[16px] font-[600] leading-[24px] text-default-font -tracking-[0.01em]">
                  Merit-Based Discovery
                </span>
                <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-subtext-color -tracking-[0.01em]">
                  Capability gains visibility regardless of institutional
                  affiliation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-neutral-50 px-6 py-24">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <span
              className="font-['Inter'] text-[26px] sm:text-[32px] lg:text-[40px]
 font-[600] leading-[48px] text-default-font text-center -tracking-[0.04em]"
            >
              Generate Your Hireability Index
            </span>
            <span className="w-full font-['Inter'] text-[16px] font-[400] leading-[24px] text-subtext-color text-center -tracking-[0.01em]">
              Be part of a new, merit-first way of showcasing talent
            </span>
          </div>
          <Button
            className="w-full max-w-full h-10 rounded-3xl text-[16px] bg-violet-600 hover:bg-violet-700 text-white font-semibold"
            size="large"
            onClick={() => navigate("/paywall")}
          >
            Finish Profile Setup
          </Button>
        </div>
      </div>

      <div className="w-full border-t border-neutral-100 px-6 py-12">
        <div className="mx-auto grid w-full max-w-[1024px] grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex w-full flex-col gap-4 items-center sm:items-start">
            <div className="flex items-center gap-3">
              <img
                className="h-8 w-24 object-cover"
                src="/hiringLogo.png"
                alt="hiringLogo"
              />
              {/* <span className="text-[14px] font-[500] text-default-font">
                UniTalent
              </span>*/}
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <IconButton
                icon={<FeatherTwitter />}
                onClick={() =>
                  window.open("https://twitter.com/your_handle", "_blank")
                } // add twitter account link
              />
              <IconButton
                icon={<FeatherLinkedin />}
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/your-company",
                    "_blank"
                  )
                } // add linkedin account link
              />
              <IconButton
                icon={<FeatherInstagram />}
                onClick={() =>
                  window.open("https://www.instagram.com/your_handle", "_blank")
                } // add instagram account link
              />
            </div>
          </div>

          {/* For Candidates */}
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <span className="text-[14px] font-[600] text-default-font">
              For Candidates
            </span>
            <span className="text-[13px] text-gray-500">How It Works</span>
            <span className="text-[13px] text-gray-500">Job Tracks</span>
            <span className="text-[13px] text-gray-500">Rankings</span>
            <span className="text-[13px] text-gray-500">Resources</span>
          </div>

          {/* For Recruiters */}
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <span className="text-[14px] font-[600] text-default-font">
              For Recruiters
            </span>
            <span className="text-[13px] text-gray-500">Find Talent</span>
            <span className="text-[13px] text-gray-500">Post Jobs</span>
            <span className="text-[13px] text-gray-500">Pricing</span>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <span className="text-[14px] font-[600] text-default-font">
              Company
            </span>
            <span className="text-[13px] text-gray-500">About</span>
            <span className="text-[13px] text-gray-500">Blog</span>
            <span className="text-[13px] text-gray-500">Contact</span>
            <span className="text-[13px] text-gray-500">Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TalentRankingPlatform;
