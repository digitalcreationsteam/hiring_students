"use client";

import React from "react";
import { Avatar } from "../ui/components/Avatar";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { Progress } from "../ui/components/Progress";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { FeatherArrowRight } from "@subframe/core";
import { FeatherArrowUp } from "@subframe/core";
import { FeatherAward } from "@subframe/core";
import { FeatherBook } from "@subframe/core";
import { FeatherBookOpen } from "@subframe/core";
import { FeatherBriefcase } from "@subframe/core";
import { FeatherCalendar } from "@subframe/core";
import { FeatherCheckCircle } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherFileText } from "@subframe/core";
import { FeatherFolderOpen } from "@subframe/core";
import { FeatherGift } from "@subframe/core";
import { FeatherGlobe } from "@subframe/core";
import { FeatherLock } from "@subframe/core";
import { FeatherMap } from "@subframe/core";
import { FeatherMapPin } from "@subframe/core";
import { FeatherPlus } from "@subframe/core";
import { FeatherRepeat } from "@subframe/core";
import { FeatherTarget } from "@subframe/core";
import { FeatherTool } from "@subframe/core";
import { FeatherTrophy } from "@subframe/core";
import { FeatherUniversity } from "@subframe/core";
import { FeatherUser2 } from "@subframe/core";
import { FeatherUsers } from "@subframe/core";
import { FeatherZap } from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { useNavigate } from "react-router-dom";

type DashboardResponse = {
  user: {
    name: string;
    role: string;
    location: string;
    avatar: string;
    verified: boolean;
  };
  rank: {
    global: number;
    university: number;
    city: number;
    percentile: string;
  };
  hireability: {
    score: number;
    skillIndex: number;
    experienceIndex: number;
    weeklyChange: number;
  };
  activity: {
    caseStudies: { done: number; total: number };
    hackathons: { done: number; total: number };
    interviewPrep: { done: number; total: number };
  };
};



function Dashboard() {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  type DemographicsResponse = {
  fullName: string;
  role?: string;
  city?: string;
  state?: string;
  country?: string;
  avatar?: string;
  verified?: boolean;
};

const userId = React.useMemo(() => localStorage.getItem("userId"), []);

const [profile, setProfile] =
  React.useState<DemographicsResponse | null>(null);


  const fetchProfile = React.useCallback(async () => {
  if (!userId) return;

  try {
    const res = await API(
      "GET",
      URL_PATH.getDemographics,
      undefined,
      { "user-id": userId }
    );

    setProfile(res as DemographicsResponse);
  } catch (err) {
    console.warn("Failed to fetch profile", err);
  }
}, [userId]);

React.useEffect(() => {
  fetchProfile();
}, [fetchProfile]);



  type BadgeVariant = "brand" | "neutral" | "warning" | "error" | "success";
  type RankTheme = {
    border: string;
    bg: string;
    iconBg: string;
    iconColor: string;
    valueColor: string;
    badge: BadgeVariant;
  };

  const GLOBAL_THEME: RankTheme = {
    border: "border-violet-200",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    valueColor: "text-violet-600",
    badge: "brand",
  };

  return (
    <DefaultPageLayout>
      <div className="min-h-screen w-full bg-yellow-50 overflow-y-auto px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <div className="flex w-full px-[em] justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col gap-8 py-6 lg:flex-row">
            {/* LEFT */}
         <div className="flex w-full flex-col gap-6 lg:w-[320px] xl:w-[340px] lg:flex-none">
  <div className="flex w-full flex-col items-center gap-3 rounded-3xl bg-white px-6 py-6 border border-neutral-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
    <div className="flex w-full flex-col items-center gap-3">
      <Avatar
        size="x-large"
        image={profile?.avatar}
      >
        {profile?.fullName
          ? profile.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "PP"}
      </Avatar>

      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-heading-2 font-heading-2 text-default-font">
            {profile?.fullName || "Preetam Patil"}
          </span>
          <FeatherCheckCircle className="text-body font-body text-green-600" />
        </div>

        <span className="text-body text-[16px] text-gray-600 text-center">
          {profile?.role || "Senior Product Manager"}
        </span>

        <div className="flex items-center gap-1">
          <FeatherMapPin className="text-caption font-caption text-subtext-color" />
          <span className="text-caption text-[14px] text-gray-600">
            {[profile?.city, profile?.state]
              .filter(Boolean)
              .join(", ") || "San Francisco, CA"}
          </span>
        </div>


                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-gray-300" />
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-3">
                    <Badge
                      className="text-yellow-700 bg-yellow-100 rounded-full text-[12px]"
                      variant="warning"
                      icon={<FeatherTrophy />}
                    >
                      Global Rank #383,635
                    </Badge>
                    <Badge
                      className="text-violet-700 bg-violet-100 rounded-full text-[12px]"
                      variant="brand"
                      icon={<FeatherAward />}
                    >
                      University Top 5%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Activity This Week
                </span>
                <div className="flex w-full flex-col items-start gap-3">
                  <div className="flex w-full items-center gap-3">
                    <span className="w-28 text-[14px] text-gray-600">
                      Case Studies
                    </span>

                    {/* Progress */}
                    <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: "45%" }}
                      />
                    </div>

                    <span className="w-12 text-right text-[14px] font-semibold text-violet-600">
                      3/5
                    </span>
                  </div>
                  <div className="flex w-full items-center gap-3">
                    <span className="w-28 text-[14px] text-gray-600">
                      Hackathons
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: "50%" }}
                      />
                    </div>

                    <span className="w-12 text-right text-[14px] font-semibold text-yellow-600">
                      1/2
                    </span>
                  </div>

                  <div className="flex w-full items-center gap-3">
                    <span className="w-28 text-[14px] text-gray-600">
                      Interview Prep
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: "24%" }}
                      />
                    </div>

                    <span className="w-12 text-right text-[14px] font-semibold text-green-600">
                      1/10
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center justify-center rounded-full bg-green-50 px-4 py-3">
                  <span className="text-[12px] text-green-700 text-center">
                    You&#39;re more active than 78% of peers
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-end gap-2 px-2 py-2">
                <div className="flex w-full flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-white px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-heading-2 font-heading-2 text-default-font">
                      Professional Profile
                    </span>
                  </div>
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                            <FeatherBriefcase className="text-violet-600 text-[14px]" />
                          </div>

                          <span className="text-body-bold font-body-bold text-default-font">
                            Work Experience
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-start gap-2">
                        <div className="flex w-full items-start justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[16px] font-body-bold text-default-font">
                              Senior Product Manager
                            </span>
                            <span className="text-[14px] text-neutral-600">
                              Google · Full-time
                            </span>
                            <span className="text-[14px] text-neutral-400">
                              Jan 2022 - Present · 2 yrs 11 mos
                            </span>
                            <span className="text-[14px] text-neutral-400">
                              San Francisco, CA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                            <FeatherAward className="text-yellow-600 text-[14px]" />
                          </div>

                          <span className="text-body-bold font-body-bold text-default-font">
                            Education
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-start gap-2">
                        <div className="flex w-full items-start justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[14px] text-neutral-800">
                              Stanford University
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Master of Business Administration (MBA)
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              2018 - 2020
                            </span>
                          </div>
                        </div>
                        <div className="flex w-full items-start justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[14px] text-neutral-800">
                              University of California, Berkeley
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Bachelor of Science, Computer Science
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              2014 - 2018
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px w-full bg-neutral-200/60" />

                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                          <FeatherTool className="text-violet-600 text-[14px]" />
                        </div>
                        <span className="text-[16px] font-medium text-gray-700">
                          Skills
                        </span>
                      </div>

                      <div className="flex w-full flex-wrap gap-2">
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          Product Strategy
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          Product Roadmapping
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          Agile Methodologies
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          User Research
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          Data Analysis
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          A/B Testing
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          SQL
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          Figma
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          Jira
                        </Badge>
                        <Badge className="px-2 py-0.5 text-[11px] text-gray-600 bg-gray-100 rounded-full">
                          Stakeholder Management
                        </Badge>
                      </div>
                    </div>

                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <FeatherCheckCircle className="text-green-600 text-[14px]" />
                          </div>

                          <span className="text-body-bold font-body-bold text-default-font">
                            Certifications
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-start gap-2">
                        <div className="flex w-full items-start justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[14px] text-neutral-800">
                              Certified Scrum Product Owner (CSPO)
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Scrum Alliance
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Issued Oct 2021
                            </span>
                          </div>
                        </div>
                        <div className="flex w-full items-start justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[14px] text-neutral-800">
                              Product Management Certificate
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Product School
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Issued Mar 2020
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                            <FeatherFolderOpen className="text-violet-600 text-[14px]" />
                          </div>

                          <span className="text-body-bold font-body-bold text-default-font">
                            Featured Projects
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-start gap-2">
                        <div className="flex w-full items-start justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[14px] text-neutral-800">
                              Search Experience Redesign
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Led product strategy for core search improvements
                              increasing user engagement by 35%
                            </span>
                          </div>
                        </div>
                        <div className="flex w-full items-start justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[14px] text-neutral-800">
                              AI-Powered Recommendations Platform
                            </span>
                            <span className="text-[12px] text-neutral-400">
                              Launched ML-based recommendation system serving
                              10M+ users daily
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER */}
            <div className="flex w-full flex-col items-start gap-6 lg:w-[800px] lg:flex-none">
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[24px] sm:text-[28px] lg:text-[36px] font-semibold leading-tight text-gray-900">
                      Welcome back, Preetam 👋
                    </span>
                  </div>

                  <span className="text-[14px] text-neutral-600">
                    Track progress, discover opportunities, and level up your
                    Hireability score.
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-center justify-between">
                  <span className="text-heading-2 font-heading-2 text-default-font">
                    Your Rankings
                  </span>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Global */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-violet-200 bg-gradient-to-b from-[#F4F2FF] to-white px-6 py-8 shadow-md">
                    <div
                      className={`h-14 w-14 flex items-center justify-center rounded-full ${GLOBAL_THEME.iconBg}`}
                    >
                      <FeatherGlobe className={GLOBAL_THEME.iconColor} />
                    </div>

                    <span className="text-[12px] text-neutral-600">Global</span>
                    <span className={`text-[32px] ${GLOBAL_THEME.valueColor}`}>
                      383,635
                    </span>

                    <Badge
                      className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs font-medium px-3 py-1 rounded-full"
                      variant={GLOBAL_THEME.badge}
                    >
                      Top 15%
                    </Badge>

                    <span className="text-[12px] text-green-500">
                      Better than 1.2M candidates
                    </span>
                  </div>

                  {/* California */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-md">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-neutral-100">
                      <FeatherMap className="text-neutral-500" />
                    </div>

                    <span className="text-[12px] text-neutral-600">
                      California
                    </span>
                    <span className="text-[28px] font-semibold text-gray-900">
                      2,456
                    </span>

                    <Badge
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 border-none py-1 rounded-full"
                      variant="neutral"
                    >
                      Top 12%
                    </Badge>

                    <span className="text-[12px] text-neutral-500 text-center">
                      Better than 18K candidates
                    </span>
                  </div>

                  {/* San Francisco */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-md">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-neutral-100">
                      <FeatherMapPin className="text-neutral-500" />
                    </div>

                    <span className="text-[12px] text-neutral-600">
                      San Francisco
                    </span>
                    <span className="text-[28px] font-semibold text-gray-900">
                      234
                    </span>

                    <Badge
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 border-none py-1 rounded-full"
                      variant="neutral"
                    >
                      Top 8%
                    </Badge>

                    <span className="text-[12px] text-neutral-500 text-center">
                      Better than 2.8K candidates
                    </span>
                  </div>

                  {/* Stanford */}
                  <div className="flex w-full min-h-[280px] flex-col items-center gap-3 rounded-3xl border border-yellow-200 bg-gradient-to-b from-yellow-50 to-white px-6 py-8 shadow-md">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-yellow-100">
                      <FeatherUniversity className="text-yellow-600" />
                    </div>

                    <span className="text-[12px] text-neutral-600">
                      Stanford
                    </span>
                    <span className="text-[28px] font-semibold text-yellow-600">
                      23
                    </span>

                    <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-3 border-none py-1 rounded-full">
                      Top 5%
                    </Badge>

                    <span className="text-[12px] text-green-600 text-center">
                      Better than 450 peers
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full rounded-3xl border border-violet-200 mb-4 mt-4 bg-gradient-to-b from-[#F4F2FF] to-white px-8 py-8 shadow-md">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Hireability Index
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Evidence of job readiness and role-relevant knowledge
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <FeatherArrowUp className="h-4 w-4" />
                    +12 this week
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-center">
                  {/* Circular Score */}
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="
      relative flex h-40 w-40 items-center justify-center rounded-full border-[8px] border-violet-100 bg-white
      shadow-[0_6px_20px_rgba(124,58,237,0.12)]
    "
                    >
                      {/* inner bold ring (SC1 thickness) */}
                      <div className="absolute h-[118px] w-[118px] rounded-full border-[8px] border-violet-500" />

                      {/* value */}
                      <span className="relative z-10 text-[40px] font-semibold leading-none text-violet-600">
                        350
                      </span>
                    </div>

                    <Badge
                      variant="brand"
                      className="flex items-center rounded-full gap-1 bg-violet-100 text-violet-700 text-xs"
                      icon={<FeatherTarget className="h-3 w-3" />}
                    >
                      Just 10 points to next rank
                    </Badge>

                    <button className="text-sm font-medium text-violet-600 hover:underline">
                      Improve now
                    </button>
                  </div>

                  {/* Progress Section */}
                  <div className="flex w-full flex-col gap-6">
                    {/* Skill Index */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <FeatherTarget className="h-4 w-4 text-violet-600" />
                          <span className="font-medium">Skill Index</span>
                        </div>
                        <span className="text-violet-600">240 / 400</span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-neutral-200">
                        <div className="h-2 w-[60%] rounded-full bg-violet-500" />
                      </div>
                    </div>

                    {/* Experience Index */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <FeatherBriefcase className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Experience Index</span>
                        </div>
                        <span className="text-green-600">540 / 5000</span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-neutral-200">
                        <div className="h-2 w-[54%] rounded-full bg-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full flex-col items-start gap-3">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[20px] text-default-font">
                      Improve Your Score
                    </span>
                    <div className="flex items-center gap-2">
                      <FeatherZap className="text-body font-body text-yellow-600" />
                      <span className="text-body font-body text-yellow-600">
                        4 actions available
                      </span>
                    </div>
                  </div>
                  <span className="text-body font-body text-gray-600">
                    Once you&#39;re out of retries, you can still take case
                    studies or participate in hackathons to increase your
                    Hireability Index.
                  </span>
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex w-full items-start gap-3 rounded-2xl border-2 border-solid border-violet-400 px-6 py-5 shadow-md bg-gradient-to-r from-violet-50 to-yellow-50">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-yellow-500">
                        <FeatherTarget className="text-heading-2 font-heading-2 text-white" />
                      </div>
                      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-heading-3 font-heading-3 text-default-font">
                            You&#39;re Almost There, Preetam! 🎯
                          </span>
                          <FeatherZap className="text-body font-body text-yellow-600" />
                        </div>
                        <span className="text-body font-body text-default-font">
                          Just 10 points away from rank 22 at Stanford! Here are
                          the activities we recommend to jump to rank 22 in your
                          university
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border-2 border-solid border-violet-300 bg-white px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      {/* ICON — SC2 EXACT */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                        <FeatherFileText className="h-5 w-5 text-violet-600" />
                      </div>

                      <Badge
                        className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="brand"
                        icon={<FeatherZap />}
                      >
                        +50 Skill
                      </Badge>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Complete Assessment
                      </span>
                      <span className="text-[16px] font-body text-gray-600">
                        Begin Skill Index Assessment and boost your credibility
                        with role specific evaluation.
                      </span>
                    </div>

                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center gap-2">
                        <div className="flex items-center gap-1">
                          <FeatherRepeat className="text-caption font-caption text-violet-600" />
                          <span className="text-caption-bold font-caption-bold text-violet-600">
                            Paid retakes: 1
                          </span>
                        </div>
                        <div className="flex h-1 w-1 rounded-full bg-neutral-300" />
                        <div className="flex items-center gap-1">
                          <FeatherGift className="text-caption font-caption text-green-600" />
                          <span className="text-caption-bold font-caption-bold text-green-600">
                            Free retakes: 1
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherClock className="text-caption font-caption text-subtext-color" />
                        <span className="text-caption font-caption text-gray-600">
                          45 min
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-violet-700 hover:bg-violet-800"
                        variant="brand-primary"
                        icon={<FeatherArrowRight />}
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {}}
                      >
                        Start Now
                      </Button>
                    </div>
                  </div>

                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border border-solid border-neutral-200 bg-neutral-50 px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-neutral-200">
                        <FeatherUsers className="text-heading-3 font-heading-3 text-neutral-500" />
                      </div>
                      <Badge
                        className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="neutral"
                        icon={<FeatherLock />}
                      >
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Participate in Hackathons
                      </span>
                      <span className="text-[16px] font-body text-gray-500">
                        Collaborate and build visibility with other product
                        managers in upcoming events.
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherCalendar className="text-caption font-caption text-neutral-400" />
                        <span className="text-caption font-caption text-neutral-400">
                          Starts in 5 days
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        disabled={true}
                        variant="neutral-tertiary"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {}}
                      >
                        Notify Me
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border-2 border-solid border-green-300 bg-white px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-green-100">
                        <FeatherBookOpen className="text-heading-3 font-heading-3 text-green-600" />
                      </div>
                      <Badge
                        className="flex items-center gap-1 bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="success"
                        icon={<FeatherZap />}
                      >
                        +40 Experience
                      </Badge>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Solve Case Studies
                      </span>
                      <span className="text-[16px] font-body text-gray-600">
                        Solving case studies adds to your experience score,
                        showing the recruiter you effort to increase your
                        knowledge base
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherClock className="text-caption font-caption text-subtext-color" />
                        <span className="text-caption font-caption text-gray-600">
                          15-20 min
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-violet-700 hover:bg-violet-800"
                        variant="brand-primary"
                        icon={<FeatherArrowRight />}
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {}}
                      >
                        Start Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-2xl border border-solid border-neutral-200 bg-neutral-50 px-6 py-6 shadow-lg">
                    <div className="flex w-full items-start justify-between">
                      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-neutral-200">
                        <FeatherBook className="text-heading-3 font-heading-3 text-neutral-500" />
                      </div>
                      <Badge
                        className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                        variant="neutral"
                        icon={<FeatherLock />}
                      >
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[20px] font-heading-3 text-default-font">
                        Courses
                      </span>
                      <span className="text-[16px] font-body text-gray-500">
                        {
                          "Complete structured learning path to earn verified PM certification badge."
                        }
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FeatherClock className="text-caption font-caption text-neutral-400" />
                        <span className="text-caption font-caption text-neutral-400">
                          8 weeks
                        </span>
                      </div>
                      <Button
                        className="h-10 w-full sm:w-auto flex-none rounded-3xl bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        disabled={true}
                        variant="neutral-tertiary"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {}}
                      >
                        Notify Me
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
                <div className="flex w-full flex-col items-start gap-2 px-2 py-2" />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex w-full flex-col gap-6 lg:w-[320px] xl:w-[360px] lg:flex-none">
              {/* Top Product Managers */}
              <div className="w-full rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Top Product Managers at Your University
                </span>

                <div className="mt-4 flex flex-col gap-3">
                  {/* Rank 1 */}
                  <div className="flex items-center gap-3 rounded-3xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                    <Badge
                      className="rounded-full bg-yellow-200 icon-yellow-300"
                      variant="warning"
                      icon={<FeatherTrophy />}
                    >
                      #1
                    </Badge>
                    <Avatar
                      size="small"
                      image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
                    >
                      AS
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-body-bold text-default-font">
                        Anjali Sharma
                      </span>
                      <span className="text-caption text-subtext-color">
                        Hireability: 425
                      </span>
                    </div>
                  </div>

                  {/* Rank 2 */}
                  <div className="flex items-center gap-3 rounded-3xl border bg-white px-4 py-3">
                    <Badge variant="neutral">#2</Badge>
                    <Avatar
                      size="small"
                      image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64"
                    >
                      RK
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-body-bold text-default-font">
                        Rahul Kumar
                      </span>
                      <span className="text-caption text-subtext-color">
                        Hireability: 398
                      </span>
                    </div>
                  </div>

                  {/* You */}
                  <div className="flex items-center gap-3 rounded-3xl border border-brand-200 bg-violet-50 px-4 py-3">
                    <Badge className="rounded-full bg-violet-200 icon-violet-300">
                      #23
                    </Badge>
                    <Avatar
                      size="small"
                      image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64"
                    >
                      PP
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-body-bold text-violet-700">
                        You
                      </span>
                      <span className="text-caption text-violet-600">
                        Hireability: 350
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-4 h-8 text-[14px] rounded-full w-full"
                  variant="neutral-secondary"
                  size="small"
                >
                  View Full Leaderboard
                </Button>
              </div>

              {/* Recruiter Visibility */}
              <div className="w-full rounded-3xl border border-white bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <span className="text-body-bold text-default-font text-center block">
                  Recruiter Visibility Probability
                </span>

                <div className="mt-2 text-center">
                  <span className="text-[28px] text-yellow-600">60%</span>
                </div>

                <div className="mt-3 rounded-3xl border border-yellow-200 bg-yellow-50 px-4 py-2">
                  <span className="text-[12px]  text-yellow-700">
                    This probability is calculated from your rankings, effort
                    (case studies, hackathons, etc) and activity that recruiters
                    see, coupled with past data
                  </span>
                </div>
              </div>

              {/* Profile Views */}
              <div className="w-full rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-heading-3 font-heading-3 text-default-font">
                    Profile Views
                  </span>

                  <Badge
                    variant="brand"
                    icon={<FeatherUser2 />}
                    className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    15
                  </Badge>
                </div>

                {/* List */}
                <div className="mt-4 flex flex-col gap-3">
                  {[
                    {
                      name: "Sarah Kim",
                      role: "Senior Recruiter at Google",
                      time: "2h ago",
                      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=64",
                      initials: "SK",
                    },
                    {
                      name: "Michael Johnson",
                      role: "Hiring Manager at Meta",
                      time: "5h ago",
                      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64",
                      initials: "MJ",
                    },
                    {
                      name: "Emily Patel",
                      role: "Product Lead at Amazon",
                      time: "1d ago",
                      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64",
                      initials: "EP",
                    },
                    {
                      name: "David Lee",
                      role: "VP of Product at Stripe",
                      time: "2d ago",
                      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64",
                      initials: "DL",
                    },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-3xl bg-neutral-100 px-4 py-3"
                    >
                      <Avatar size="small" image={p.img}>
                        {p.initials}
                      </Avatar>

                      <div className="flex flex-col flex-1">
                        <span className="text-body-bold font-body-bold text-default-font">
                          {p.name}
                        </span>
                        <span className="text-[14px] font-caption text-gray-600">
                          {p.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-neutral-400">
                        <FeatherClock className="h-3.5 w-3.5" />
                        <span className="text-caption font-caption">
                          {p.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-center gap-2 px-2 py-2">
                <div className="flex w-full flex-col items-start gap-6 rounded-3xl border border-solid border-neutral-100 bg-white px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[20px] font-heading-2 text-default-font">
                      Update Your Profile
                    </span>
                  </div>
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full flex-col items-start gap-3">
                      <span className="text-caption font-caption text-gray-600">
                        Got new updates? Add them over here!
                      </span>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-violet-100">
                            <FeatherFolderOpen className="text-caption font-caption text-violet-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Experience
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Showcase your impactful projects and product outcomes
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/experience")}
                      >
                        Add Experience
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-violet-100">
                            <FeatherFolderOpen className="text-caption font-caption text-violet-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Projects
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Showcase your impactful projects and product outcomes
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/projects")}
                      >
                        Add Project
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-yellow-100">
                            <FeatherAward className="text-caption font-caption text-yellow-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Education
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Update your educational background and achievements
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/education")}
                      >
                        Add Education
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-green-100">
                            <FeatherCheckCircle className="text-caption font-caption text-green-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Certifications
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        Add relevant certifications to validate your expertise
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/certifications")}
                      >
                        Add Certification
                      </Button>
                    </div>
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-100" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-violet-100">
                            <FeatherTool className="text-caption font-caption text-violet-600" />
                          </div>
                          <span className="text-body-bold font-body-bold text-gray-900">
                            Skills
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-caption text-gray-600">
                        List your product management and technical skills
                      </span>
                      <Button
                        className="h-10 w-full rounded-3xl bg-violet-600"
                        variant="brand-primary"
                        icon={<FeatherPlus />}
                        onClick={() => handleNavigate("/skills")}
                      >
                        Add Skills
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Dashboard;
