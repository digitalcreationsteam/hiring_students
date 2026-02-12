"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FeatherArrowLeft, FeatherX } from "@subframe/core";

import HeaderLogo from "src/ui/components/HeaderLogo";
import { IconButton } from "../ui/components/IconButton";
import { TextField } from "../ui/components/TextField";
import { Button } from "../ui/components/Button";

import API, { URL_PATH } from "src/common/API";
import { colors } from "../common/Colors";
import Navbar from "src/ui/components/Navbar";

export default function Skills() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source; // "dashboard" | undefined

  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const suggested = [
    "Data Analysis",
    "A/B Testing",
    "Stakeholder Management",
    "Feature Prioritization",
    "Agile Methodology",
    "Product Analytics",
    "Customer Development",
    "Wireframing",
    "SQL",
    "Go-to-Market Strategy",
    "API Integration",
    "Metrics & KPIs",
  ];

  const scTextFieldClass =
    "w-full [&>label]:text-[12px] [&>label]:font-medium [&>div]:h-8 [&>div]:rounded-full [&>div]:bg-neutral-100 [&>div]:!border-none";

  const scInputClass =
    "rounded-full h-7 px-3 text-[16px] placeholder:text-[16px] bg-neutral-100 !border-none focus:ring-0 focus:outline-none w-full";

  const addSkill = (raw: string) => {
    const s = raw.trim();
    if (!s) return;

    const exists = skills.some((k) => k.toLowerCase() === s.toLowerCase());
    if (!exists) setSkills((prev) => [...prev, s]);
  };

  const removeSkill = (s: string) => {
    setSkills((prev) => prev.filter((k) => k !== s));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    }
  };

  const handleContinue = async () => {
    if (skills.length === 0) {
      alert("Add at least one skill to continue.");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const domainId = localStorage.getItem("domainId");

      if (!domainId) {
        alert("Domain selection missing. Please select domain again.");
        navigate("/job-domain");
        return;
      }

      await API(
        "POST",
        URL_PATH.updateUserDomainSkills,
        { userId, domainId, skills },
        { Authorization: `Bearer ${token}` }
      );

      navigate(source === "dashboard" ? "/dashboard" : "/assessment-intro");
    } catch (error: any) {
      console.error("Skill save failed:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to save skills. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await API("GET", URL_PATH.getUserDomainSkils, undefined, {
          Authorization: `Bearer ${token}`,
          "user-id": userId,
        });

        const skillsFromApi = res?.[0]?.skills;
        if (Array.isArray(skillsFromApi)) setSkills(skillsFromApi);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  const isDisabled = skills.length === 0 || isSubmitting;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Blended background */}
      <div className="pointer-events-none absolute inset-0">
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

      <div className="relative z-10">
        <Navbar />
      </div>

      <div className="relative z-10 flex justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <main
          className="w-full max-w-[720px] rounded-3xl shadow-xl border px-6 sm:px-8 md:px-10 py-6 sm:py-8 backdrop-blur-md"
          style={{
            backgroundColor: `${colors.white}CC`,
            borderColor: colors.neutral[200],
          }}
        >
          {/* Top row */}
          <div className="flex items-center gap-3 sm:gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => {
                if (source === "dashboard") navigate("/dashboard");
                else navigate(-1);
              }}
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`p-${i}`}
                    className="flex-1 rounded-full h-1.5 sm:h-2"
                    style={{ backgroundColor: colors.primary }}
                  />
                ))}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={`n-${i}`}
                    className="flex-1 rounded-full h-1.5 sm:h-2"
                    style={{ backgroundColor: colors.neutral[200] }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-1">
            <h2
              className="text-[20px] sm:text-[22px] md:text-[26px] font-semibold"
              style={{ color: colors.neutral[800] }}
            >
              Add your skills
            </h2>

            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: colors.neutral[600] }}
            >
              Add your key skills to help recruiters discover your profile and
              match you with relevant opportunities
            </p>
          </div>

          {/* Your Skills */}
          <div className="mt-8 flex flex-col gap-2">
            <span className="text-[16px]" style={{ color: colors.neutral[800] }}>
              Your Skills *
            </span>

            <TextField className={scTextFieldClass} label="">
              <TextField.Input
                placeholder="Type a skill and press Enter"
                value={input}
                ref={inputRef}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={scInputClass}
              />
            </TextField>

            <div className="flex flex-wrap items-center gap-3 mt-1">
              {skills.map((s) => (
                <div
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1"
                  style={{ backgroundColor: colors.neutral[100] }}
                >
                  <span className="text-[16px]" style={{ color: colors.neutral[600] }}>
                    {s}
                  </span>

                  <IconButton
                    size="small"
                    icon={<FeatherX />}
                    onClick={() => removeSkill(s)}
                    className="!bg-transparent !w-6 !h-6 [&>svg]:w-3 [&>svg]:h-3"
                    style={{ color: colors.neutral[600] }}
                    aria-label={`Remove ${s}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Skills */}
          <div className="mt-8">
            <div
              className="rounded-3xl px-4 py-4 flex flex-col gap-3"
              style={{ backgroundColor: colors.neutral[200] }}
            >
              <span className="text-[18px]" style={{ color: colors.neutral[800] }}>
                Suggested Skills for Product Managers
              </span>

              <div className="flex flex-wrap gap-3 mt-2">
                {suggested.map((s) => {
                  const isAdded = skills.some(
                    (k) => k.toLowerCase() === s.toLowerCase()
                  );

                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isAdded}
                      onClick={() => addSkill(s)}
                      className="px-3 py-1 rounded-full text-sm transition-all border"
                      style={{
                        backgroundColor: isAdded ? colors.neutral[100] : colors.neutral[200],
                        borderColor: colors.neutral[200],
                        color: isAdded ? colors.neutral[400] : colors.neutral[600],
                        cursor: isAdded ? "default" : "pointer",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px my-8"
            style={{ backgroundColor: colors.secondary }}
          />

          <footer>
            <Button
              onClick={handleContinue}
              disabled={isDisabled}
              className="w-full h-10 sm:h-11 rounded-full text-sm sm:text-base font-semibold transition active:scale-[0.99]"
              style={{
                backgroundColor: isDisabled ? colors.neutral[200] : colors.accent,
                color: colors.background,
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.75 : 1,
                boxShadow: isDisabled
                  ? "none"
                  : "0 10px 24px rgba(0,0,0,0.08)",
              }}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </footer>
        </main>
      </div>
    </div>
  );
}
