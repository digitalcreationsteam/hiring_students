// src/components/Awards.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherAward,
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";

type AwardEntry = {
  id: string;
  name: string;
  description: string | null;
  year: string;
  isDemo?: boolean;
};

const toTitleCase = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const toSentenceCase = (v: string) =>
  v ? v.charAt(0).toUpperCase() + v.slice(1) : v;

const normalizeSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

export default function Awards() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState<any | null>(null);
  const [deleteAwardId, setDeleteAwardId] = useState<string | null>(null);


  type ExperiencePoints = {
    demographics?: number;
    education?: number;
    workExperience?: number;
    certifications?: number;
    awards?: number;
  };

  const [experiencePoints, setExperiencePoints] =
    useState<ExperiencePoints | null>(null);

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) +
    (experiencePoints?.education ?? 0) +
    (experiencePoints?.workExperience ?? 0) +
    (experiencePoints?.certifications ?? 0) +
    (experiencePoints?.awards ?? 0);

  //GET
  const fetchAwards = async () => {
    if (!userId) return;

    try {
      const res = await API("GET", URL_PATH.getAwards, undefined, {
        "user-id": userId,
      });

      const apiAwards = Array.isArray(res?.data) ? res.data : [];

      const mappedAwards: AwardEntry[] = apiAwards.map((a: any) => ({
        id: a._id,
        name: a.awardName,
        description: a.description || null,
        year: String(a.year),
        isDemo: false,
      }));

      setAwards(mappedAwards);
    } catch (error) {
      console.error("Failed to fetch awards", error);
      setAwards([]);
    }
  };

  // -------------------- GET EXPERIENCE INDEX --------------------
  const fetchExperienceIndex = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API(
        "GET",
        URL_PATH.calculateExperienceIndex,
        undefined,
        { "user-id": userId }
      );

      setExperiencePoints(res?.points ?? null);
    } catch {
      setExperiencePoints(null);
    } finally {
      setIsExpIndexLoading(false);
    }
  }, [userId]);

  //USE EFFECT
  const [awards, setAwards] = useState<AwardEntry[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchAwards();
    fetchExperienceIndex();
  }, [userId]);

  // SC2 small textfield classes
  const scTextFieldClass =
    "w-full [&>label]:text-[12px] [&>label]:font-medium [&>p]:text-[11px] [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-9";
  const scInputClass =
    "rounded-full h-9 px-3 text-[12px] placeholder:text-[12px] bg-white !border-none focus:ring-0 w-full";

  const resetForm = () => {
    setName("");
    setDescription("");
    setYear("");
  };

  const handleAddAward = async () => {
    if (isSubmitting) return;

    if (!name.trim() || !year.trim()) {
      alert("Please complete all required fields before adding.");
      return;
    }

    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();

    if (!/^\d{4}$/.test(year)) {
      alert("Year must be a 4-digit number.");
      return;
    }

    if (yearNum < 2000 || yearNum > currentYear) {
      alert(`Year must be between 2000 and ${currentYear}.`);
      return;
    }

    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "POST",
        URL_PATH.awards,
        {
          awards: [
            {
              awardName: toTitleCase(normalizeSpaces(name)),
              description: description.trim() || null,
              year: yearNum,
            },
          ],
        },
      
        { "user-id": userId }
      );

      await fetchAwards();
      await fetchExperienceIndex();

      resetForm();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to add award");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- DELETE AWARD --------------------
const handleRemove = async () => {
  if (!deleteAwardId || isSubmitting) return;

  if (!userId) {
    alert("Session expired. Please login again.");
    navigate("/login");
    return;
  }

  try {
    setIsSubmitting(true);

    await API(
      "DELETE",
      `${URL_PATH.deleteAward}/${deleteAwardId}`,
      undefined,
      { "user-id": userId }
    );

    setAwards((prev) => prev.filter((a) => a.id !== deleteAwardId));

    if (selectedAward?.id === deleteAwardId) {
      setSelectedAward(null);
    }

    await fetchExperienceIndex();
    setDeleteAwardId(null);
  } catch (err: any) {
    alert(err?.response?.data?.message || "Failed to delete award");
  } finally {
    setIsSubmitting(false);
  }
};

  const buildAwardsPayload = (list: AwardEntry[]) => {
    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return null;
    }

    return {
      awards: list.map((a) => ({
        awardName: a.name.trim(),
        description: a.description?.trim() || null,
        year: Number(a.year),
      })),
    };
  };

  const hasRealAward = awards.some((a) => !a.isDemo);
  const canContinue = hasRealAward;

  const handleContinue = () => {
    if (!hasRealAward) {
      alert("Please add at least one award to continue.");
      return;
    }
    navigate("/projects");
  };

  return (
    <div className="min-h-screen flex justify-center bg-neutral-50 px-4 sm:px-6 py-20 sm:py-32">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
        {/* Left card */}
        <main className="w-full md:max-w-[448px] flex flex-col gap-6 rounded-[28px] border border-neutral-300 bg-white px-4 sm:px-6 md:px-8 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.06)]">
          {/* top row - back + progress */}
          <div className="flex items-center gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />
            <div className="flex-1 w-full max-w-full md:max-w-[420px]">
              <div className="flex items-center gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`p-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-violet-700"
                  />
                ))}
                {[...Array(1)].map((_, i) => (
                  <div
                    key={`n-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-neutral-300"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Header */}
          <header className=" w-full">
            <h2 className="text-[22px] text-neutral-900">
              Add awards and extracurriculars
            </h2>
            <p className="text-xs text-neutral-500">
              These help recruiters understand your interests and achievements
            </p>
          </header>

        <section className="flex w-full flex-col gap-3">
  {awards.map((a) => (
    <div
      key={a.id}
      role="button"
      tabIndex={0}
      onClick={() => setSelectedAward(a)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedAward(a);
        }
      }}
      className="
        rounded-2xl
        border border-neutral-300
        bg-gray-50
        px-4 py-3
        flex items-center justify-between
        cursor-pointer
        hover:bg-neutral-100
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-violet-500
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          size="large"
          square
          className="!rounded-2xl bg-violet-200 text-violet-700 font-semibold"
        >
          {a.name
            .split(" ")
            .slice(0, 2)
            .map((s) => s[0])
            .join("")}
        </Avatar>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-neutral-900 truncate">
            {a.name}
          </span>

          {a.description && (
            <span className="text-xs text-neutral-500 line-clamp-1">
              {a.description}
            </span>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-2 shrink-0">
    <IconButton
  size="small"
  icon={<FeatherX />}
  aria-label={`Delete award ${a.name}`}
  onClick={(e) => {
    e.stopPropagation(); 
    setDeleteAwardId(a.id);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      setDeleteAwardId(a.id);
    }
  }}
  className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
/>

        <span className="text-xs text-neutral-500">{a.year}</span>
      </div>
    </div>
  ))}
</section>

{selectedAward && (
  <div className="rounded-3xl border border-neutral-300 bg-white px-6 py-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-neutral-900">
        Award Details
      </h3>

      <IconButton
        size="small"
        icon={<FeatherX />}
        onClick={() => setSelectedAward(null)}
        className="!bg-transparent !text-neutral-500"
      />
    </div>

    <div className="flex flex-col gap-3 text-sm text-neutral-800">
      <div>
        <span className="font-medium">Award name:</span>{" "}
        {selectedAward.name}
      </div>

      {selectedAward.description && (
        <div>
          <span className="font-medium">Description:</span>{" "}
          {selectedAward.description}
        </div>
      )}

      {selectedAward.year && (
        <div>
          <span className="font-medium">Year:</span>{" "}
          {selectedAward.year}
        </div>
      )}
    </div>
  </div>
)}




          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddAward();
            }}
            className="flex flex-col gap-4 mt-2"
          >
            <TextField
              label={<span className="text-[12px]">Award or Activity Name * </span>}
              helpText=""
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="e.g., Hackathon Winner"
                value={name}
                onChange={(e) => setName(toTitleCase(e.target.value))}
                className={scInputClass}
              />
            </TextField>

            <TextField
              label={<span className="text-[12px]">Description (optional) </span>}
              helpText=""
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="Brief description of the achievement or role"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setDescription(toSentenceCase(description))}
                className={scInputClass}
              />
            </TextField>

            <TextField label={<span className="text-[12px]">Year * </span>}
             helpText="" className={scTextFieldClass}>
              <TextField.Input
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value.replace(/[^\d]/g, ""))}
                maxLength={4}
                className={scInputClass}
              />
            </TextField>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button
                type="button"
                variant="neutral-secondary"
                icon={<FeatherPlus />}
                className="w-full rounded-full border border-neutral-300 h-10 px-4 flex items-center gap-2"
                onClick={handleAddAward}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add another award"}
              </Button>

              <div className="flex-1" />
            </div>
          </form>

          <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

          <footer>
            <Button
              onClick={handleContinue}
              disabled={!canContinue || isSubmitting}
              className={`
    w-full h-10 rounded-full transition-all
    ${
      !canContinue || isSubmitting
        ? "bg-violet-300 text-white cursor-not-allowed"
        : "bg-violet-700 text-white shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
    }
  `}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </footer>
        </main>

        {/* Right panel */}
        <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
          <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
            <h3 className="text-[22px] text-neutral-900">
              Your Experience Index
            </h3>

            <div className="flex items-center justify-center py-6">
              <span
                aria-live="polite"
                className="font-['Afacad_Flux'] text-[32px] sm:text-[40px] md:text-[48px] font-[500] leading-[56px] text-neutral-300"
              >
                {displayedIndex ?? 0}
              </span>
            </div>

            <div className="h-px bg-neutral-300" />

            <div className="mt-4">
              <div className="text-[16px] text-neutral-800 mb-3">
                Progress Steps
              </div>

              {/* ⚪ Completed — Demographics */}
              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3 hover:bg-neutral-50"
              >
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Demographics</span>
              </button>

              {/* Education — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Education</span>
              </div>

              {/* Experience — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Experience</span>
              </div>

              {/* Certifications — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Certifications</span>
              </div>

              {/* Awards — active (purple) */}
              <div className="flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
                  <IconWithBackground
                    size="small"
                    variant="neutral"
                    className="!bg-white !text-violet-600"
                    icon={<FeatherAward className="!text-violet-800" />}
                  />
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  Awards
                </span>
              </div>

              {/* Projects — inactive */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2">
                <IconWithBackground
                  variant="neutral"
                  size="small"
                  className="!bg-white !text-neutral-600"
                  icon={<FeatherPackage />}
                />
                <span className="text-sm text-neutral-500">Projects</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      {deleteAwardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Are you sure?
              </h3>
              <button
                onClick={() => setDeleteAwardId(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-neutral-600 mb-6">
              Do you really want to delete this award? 
            </p>

            <div className="flex gap-3">
              <Button
                variant="neutral-secondary"
                className="flex-1"
                onClick={() => setDeleteAwardId(null)}
              >
                Cancel
              </Button>

              <Button
                className="flex-1 rounded-3xl bg-violet-600 text-white hover:bg-violet-700"
                onClick={handleRemove}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Yes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
