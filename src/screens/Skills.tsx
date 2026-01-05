// src/components/Skills.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { TextField } from "../ui/components/TextField";
import { Button } from "../ui/components/Button";
import {
  FeatherArrowLeft,
  FeatherAlertTriangle,
  FeatherX,
} from "@subframe/core";
import { useNavigate } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";

export default function Skills() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [skills, setSkills] = useState<string[]>([]);

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

  const inputRef = useRef<HTMLInputElement | null>(null);

  // use these values instead of prior scTextFieldClass / scInputClass
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    }
  };

  const removeSkill = (s: string) => {
    setSkills((prev) => prev.filter((k) => k !== s));
  };

  //========POST SKILLS API ======================
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
      const subDomainId = localStorage.getItem("subDomainId");

      if (!domainId || !subDomainId) {
        alert("Domain selection missing. Please select domain again.");
        navigate("/job-domain");
        return;
      }

      await API(
        "POST",
        URL_PATH.updateUserDomainSkills,
        {
          userId,
          domainId,
          subDomainId,
          skills,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      navigate("/assessment-intro");
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

  // GET SKILLS API------
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await API("GET", URL_PATH.getUserDomainSkils, undefined, {
          Authorization: `Bearer ${token}`,
          "user-id": userId,
        });

        console.log("FULL RESPONSE 👉", res);

        const skillsFromApi = res?.[0]?.skills;

        if (Array.isArray(skillsFromApi)) {
          setSkills(skillsFromApi);
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-neutral-50 px-6 py-10">
      <main className="w-full max-w-[720px] bg-white rounded-3xl shadow-[0_10px_30px_rgba(40,0,60,0.06)] border border-gray-300 px-10 py-8">
        {/* top row - back + progress */}
        <div className="flex items-center gap-4">
          <IconButton
            size="small"
            icon={<FeatherArrowLeft />}
            onClick={() => navigate(-1)}
          />

          <div className="flex-1">
            <div className="flex items-center gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`p-${i}`}
                  style={{ height: 6 }}
                  className="flex-1 rounded-full bg-violet-700"
                />
              ))}
              {[...Array(2)].map((_, i) => (
                <div
                  key={`n-${i}`}
                  style={{ height: 6 }}
                  className="flex-1 rounded-full bg-gray-300"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Header */}
        <h2 className="mt-8 text-[22px]">Add your skills</h2>
        <p className="text-xs text-neutral-500">
          Add your key skills to help recruiters discover your profile and match
          you with relevant opportunities
        </p>

        {/* Your Skills */}
        <div className="mt-8 flex flex-col gap-2">
          <span className="text-[16px]  text-neutral-800">Your Skills *</span>

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

          {/* Added skills */}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {skills.map((s) => (
              <div
                key={s}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3"
              >
                <span className="text-[16px] text-neutral-700">{s}</span>

                <IconButton
                  size="small"
                  icon={<FeatherX />}
                  onClick={() => removeSkill(s)}
                  className="!bg-transparent !text-neutral-500 !w-6 !h-6 [&>svg]:w-3 [&>svg]:h-3"
                  aria-label={`Remove ${s}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Skills */}
        <div className="mt-8">
          <div className="rounded-3xl bg-gray-200  px-4 py-4 flex flex-col gap-3">
            {/* Header INSIDE container */}
            <span className="text-[18px] text-neutral-800 mt-1">
              Suggested Skills for Product Managers
            </span>

            {/* Pills */}
            <div className="flex flex-wrap rounded-3xl gap-3 mt-2">
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
                    className={`px-3 rounded-full text-sm transition-all ${
                      isAdded
                        ? "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-default"
                        : "bg-neutral-150 border-neutral-200 text-neutral-700 hover:bg-white hover:shadow-xl"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-200 my-8" />

        <footer>
          <Button
            className="w-full h-10 rounded-full bg-gradient-to-r from-violet-600 to-violet-600 
    text-white shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
            onClick={handleContinue}
            disabled={skills.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </footer>
      </main>
    </div>
  );
}
