"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/components/Button";
import { useNavigate } from "react-router-dom";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import HeaderLogo  from "src/ui/components/HeaderLogo";
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
import { colors } from "src/common/Colors";

function AssessmentIntro3() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [domainName, setDomainName] = useState<string | null>(null);
  const [domainLoading, setDomainLoading] = useState(true);
  const userId = useMemo(() => localStorage.getItem("userId"), []);
  const [domainError, setDomainError] = useState<string | null>(null);

  //============== GET API FOR FETCH THE DOMAIN==========
  useEffect(() => {
    const fetchDomain = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const res = await API(
          "GET",
          URL_PATH.getJobDomain,
          {},
          { "user-id": userId }
        );

        if (!Array.isArray(res) || res.length === 0) {
          throw new Error("No domain selected");
        }

        setDomainName(res[0].name);
        setDomainError(null);
      } catch (err) {
        console.error("Domain fetch failed", err);
        setDomainName(null);
        setDomainError(
          "Unable to load your selected domain. Please try again."
        );
      } finally {
        setDomainLoading(false);
      }
    };

    fetchDomain();
  }, [userId, navigate]);

  //========= POST API FOR TO START THE ASSESSMENT ==============
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
        {},
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
      } else {
        console.error(response?.message || "Failed to start assessment");
      }
    } catch (err: any) {
      console.error(err?.message || "Failed to start assessment");
    } finally {
      setLoading(false);
    }
  };
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
      <HeaderLogo />
      <div className="flex min-h-screen w-full justify-center px-4 sm:px-6 lg:px-8 py-0 sm:py-0">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 sm:gap-8 py-8">
          <Button
            variant="neutral-tertiary"
            size="small"
            icon={<FeatherArrowLeft />}
            onClick={() => navigate(-1)}
          />
          <div className="flex w-full flex-col items-center gap-6 ">
            <IconWithBackground
              style={{backgroundColor: colors.accent, color: colors.white}}
              className="rounded-2xl"
              size="large"
              icon={<FeatherFileText />}
              square={true}
            />
            <div className="flex flex-col items-center gap-3">
              <span className="text-xl sm:text-2xl md:text-[30px] font-heading-1 text-default-font text-center">
                {domainLoading
                  ? "Loading Assessment..."
                  : `${domainName} Skill Assessment`}
              </span>

              <span className="max-w-[90%] sm:max-w-[800px] text-sm font-body text-center">
                This assessment evaluates your readiness for {domainName} roles
                through real-world scenarios. You&#39;ll be tested on three
                aspects —
              </span>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-4 sm:px-6 py-4 sm:py-6 shadow-sm">
              <div className="flex w-full items-center gap-3">
                <IconWithBackground
                  style={{backgroundColor: colors.primary, color: colors.accent}}
                  className="rounded-2xl"
                  variant="brand"
                  size="medium"
                  icon={<FeatherBook />}
                />
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Knowledge
                </span>
              </div>
              <div className="flex w-full flex-col text-xs text-gray-600 items-start gap-2">
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

            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-4 sm:px-6 py-4 sm:py-6 shadow-sm">
              <div className="flex w-full items-center gap-3">
                <IconWithBackground
                  style={{backgroundColor: colors.primary, color: colors.accent}}
                  className="rounded-2xl"
                  variant="brand"
                  size="medium"
                  icon={<FeatherTarget />}
                />
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Decision-Making Skills
                </span>
              </div>
              <div className="flex w-full flex-col text-xs text-gray-600 items-start gap-2">
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

            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 rounded-3xl border border-solid border-neutral-border bg-white px-4 sm:px-6 py-4 sm:py-6 shadow-sm">
              <div className="flex w-full items-center gap-3">
                <IconWithBackground
                  style={{backgroundColor: colors.primary, color: colors.accent}}
                  className="rounded-2xl"
                  variant="brand"
                  size="medium"
                  icon={<FeatherCompass />}
                />
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Attributes
                </span>
              </div>
              <div className="flex w-full flex-col text-xs text-gray-600 items-start gap-2">
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

          <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:gap-8 rounded-3xl border border-solid border-neutral-border bg-white px-8 py-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FeatherClock className="text-body font-body" />
              <span className="text-body-bold font-body-bold text-default-font">
                25 minutes
              </span>
            </div>
            <div className="hidden sm:flex h-8 w-px bg-neutral-border" />
            <div className="flex items-center gap-3">
              <FeatherCheckSquare className="text-body font-body" />
              <span className="text-body-bold font-body-bold text-default-font">
                20 scenario questions
              </span>
            </div>
            <div className="hidden sm:flex h-8 w-px bg-neutral-border" />
            <div className="flex items-center gap-3">
              <FeatherTrendingUp className="text-body font-body" />
              <span className="text-body-bold font-body-bold text-default-font">
                Counts toward your Skill Index
              </span>
            </div>
          </div>
          
          <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8">
            <Button
              disabled={loading}
              style={{ backgroundColor: colors.accent, color: "white" }}
              className="w-full max-w-[260px] h-10 rounded-2xl hover:bg-violet-700 text-white font-semibold disabled:opacity-60 p-4"
              size="large"
              icon={<FeatherZap />}
              onClick={handleBeginAssessment}
            >
              {loading ? "Starting..." : "Begin Skill Index Assessment"}
            </Button>

            <button
              className="text-body font-body text-subtext-color hover:text-gray-700 transition"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default AssessmentIntro3;
