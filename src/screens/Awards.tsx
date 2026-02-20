// src/components/Awards.tsx - Fixed footer positioning
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import HeaderLogo from "../ui/components/HeaderLogo";
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
  FeatherEdit2,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "../common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

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

function EndYearPicker({
  value,
  onChange,
  disabled = false,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
}: {
  value: string;
  onChange: (year: string) => void;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  );

  return (
    <div className="relative" ref={ref}>
      <input
        readOnly
        disabled={disabled}
        value={value}
        placeholder="Year"
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`w-full h-10 px-4 rounded-xl border ${
          disabled
            ? "bg-white/30 border-white/20 text-gray-400 cursor-not-allowed"
            : "bg-white/50 border-gray-200/50 hover:border-gray-300 cursor-pointer"
        } focus:outline-none transition-all duration-200 backdrop-blur-sm`}
      />

      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl p-3 max-h-60 overflow-auto">
          <div className="grid grid-cols-4 gap-2 text-sm">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onChange(String(year));
                  setOpen(false);
                }}
                className="py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                style={{
                  backgroundColor:
                    value === String(year) ? colors.primary : "transparent",
                  color:
                    value === String(year) ? colors.white : colors.neutral[800],
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (value !== String(year)) {
                    e.currentTarget.style.backgroundColor = colors.primaryGlow;
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== String(year)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Awards() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source;
  const fromProfile = location.state?.fromProfile; // Check if came from profile
  console.log("AWARDS source:", source, "fromProfile:", fromProfile);
  console.log("AWARDS source:", source);
  const userId = localStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_AWARDS = 5;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState<any | null>(null);
  const [deleteAwardId, setDeleteAwardId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = !!editingId;

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

  const fetchExperienceIndex = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API(
        "GET",
        URL_PATH.calculateExperienceIndex,
        undefined,
        { "user-id": userId },
      );

      setExperiencePoints(res?.points ?? null);
    } catch {
      setExperiencePoints(null);
    } finally {
      setIsExpIndexLoading(false);
    }
  }, [userId]);

  const [awards, setAwards] = useState<AwardEntry[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchAwards();
    fetchExperienceIndex();
  }, [userId]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEndYear("");
    setEditingId(null);
  };

  const validateAward = (
    name: string,
    endYear: string,
    description: string,
  ): string | null => {
    if (!name.trim()) return "Award name is required";

    if (!endYear.trim()) return "Year is required";

    if (!/^\d{4}$/.test(endYear)) return "Year must be a valid 4-digit year";

    const yearNum = Number(endYear);
    const currentYear = new Date().getFullYear();

    if (yearNum < 2000 || yearNum > currentYear)
      return `Year must be between 2000 and ${currentYear}`;

    if (description && description.length > 300)
      return "Description cannot exceed 300 characters";

    return null;
  };

  const handleAddAward = async () => {
    if (awards.length >= MAX_AWARDS) {
      toast.error("You can add a maximum of 5 awards only.");
      return;
    }
    if (isSubmitting) return;

    const error = validateAward(name, endYear, description);
    if (error) {
      toast.error(error);
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      const yearNum = Number(endYear);

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

        { "user-id": userId },
      );

      toast.success("Award added successfully");

      await fetchAwards();
      await fetchExperienceIndex();

      resetForm();
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("You can add a maximum of 5 awards only.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!deleteAwardId || isSubmitting) return;

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API("POST", `${URL_PATH.deleteAward}/${deleteAwardId}`, undefined, {
        "user-id": userId,
      });

      setAwards((prev) => prev.filter((a) => a.id !== deleteAwardId));

      if (selectedAward?.id === deleteAwardId) {
        setSelectedAward(null);
      }

      await fetchExperienceIndex();
      setDeleteAwardId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete award");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRealAward = awards.some((a) => !a.isDemo);
  const canContinue = hasRealAward;

  const handleContinue = () => {
    if (!hasRealAward) {
      toast.error("Please add at least one award to continue.");
      return;
    }

    // If came from profile, go to dashboard, otherwise continue to next section
    if (fromProfile) {
      navigate("/dashboard");
    } else if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/projects", { state: { source } });
    }
  };

  const handleBack = () => {
    if (fromProfile) {
      navigate("/profile"); // Go back to profile if came from there
    } else {
      navigate("/certifications");
    }
  };

  const fillFormForEdit = (a: AwardEntry) => {
    setEditingId(a.id);

    setName(a.name || "");
    setDescription(a.description || "");
    setEndYear(a.year || "");

    setSelectedAward(a);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🎨 Enhanced gradient background with soft blur - matching education */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 20% 20%, rgba(210, 215, 220, 0.4) 0%, rgba(150, 165, 180, 0.3) 50%, rgba(40, 64, 86, 0.4) 100%)`,
        }}
      >
        {/* Animated blur elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header and content with z-index to stay above background */}
      <div className="relative z-10">
        <Navbar />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          toastClassName="!bg-white/80 !backdrop-blur-md !text-gray-800 !shadow-lg !border !border-white/20"
        />

        <div className="flex justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left card - Glass effect */}
            <main className="w-full lg:flex-1 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl px-6 sm:px-8 py-8">
              {/* Top: back + progress */}
              <div className="flex items-center gap-4 mb-8">
                <IconButton
                  size="small"
                  icon={<FeatherArrowLeft className="w-4 h-4" />}
                  onClick={handleBack}
                  className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i <= 4
                            ? "bg-gradient-to-r from-gray-600 to-gray-800"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Step 5 of 6
                  </p>
                </div>
              </div>

              {/* Header with refined typography */}
              <header className="mb-8">
                <h2 className="text-2xl text-gray-800 font-light tracking-tight">
                  Add awards and
                  <span className="block font-semibold text-gray-900 mt-1">
                    Extracurriculars
                  </span>
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  These help recruiters understand your interests and
                  achievements
                </p>
              </header>

              {/* Awards List with enhanced styling */}
              <section className="flex w-full flex-col gap-3 mb-8">
                {awards.map((a) => {
                  const isSelected = selectedAward?.id === a.id;

                  return (
                    <div
                      key={a.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedAward(isSelected ? null : a)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedAward(isSelected ? null : a);
                        }
                      }}
                      className="rounded-2xl px-4 py-3 cursor-pointer transition-all duration-200 backdrop-blur-sm focus:outline-none"
                      style={{
                        backgroundColor: isSelected
                          ? `${colors.primary}14`
                          : "rgba(255,255,255,0.3)",
                        border: `1px solid ${
                          isSelected ? colors.primary : "rgba(255,255,255,0.4)"
                        }`,
                        boxShadow: isSelected
                          ? `0 0 0 3px ${colors.primary}22`
                          : "0 4px 6px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar
                            size="large"
                            square
                            className="!rounded-xl shadow-sm"
                            style={{
                              backgroundColor: colors.primaryGlow,
                              color: colors.neutral[800],
                            }}
                          >
                            {a.name
                              .split(" ")
                              .slice(0, 2)
                              .map((s) => s[0])
                              .join("")}
                          </Avatar>

                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-800 truncate">
                              {a.name}
                            </span>

                            {a.description && (
                              <span className="text-xs text-gray-500 line-clamp-1">
                                {a.description}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-1">
                            {/* ✅ Edit */}
                            <IconButton
                              size="small"
                              icon={<FeatherEdit2 className="w-3 h-3" />}
                              aria-label={`Edit award ${a.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                fillFormForEdit(a);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />

                            {/* ✅ Delete */}
                            <IconButton
                              size="small"
                              icon={<FeatherX className="w-3 h-3" />}
                              aria-label={`Delete award ${a.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteAwardId(a.id);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />
                          </div>

                          <span className="text-xs text-gray-500">
                            {a.year}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <>
                          <div className="my-4 border-t border-white/30" />

                          <div className="flex flex-col gap-2 text-sm text-gray-700 px-1">
                            <div>
                              <span className="font-medium text-gray-600">
                                Award name:
                              </span>{" "}
                              {a.name}
                            </div>

                            {a.description && (
                              <div>
                                <span className="font-medium text-gray-600">
                                  Description:
                                </span>{" "}
                                {a.description}
                              </div>
                            )}

                            {a.year && (
                              <div>
                                <span className="font-medium text-gray-600">
                                  Year:
                                </span>{" "}
                                {a.year}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </section>

              {/* Form with enhanced styling */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddAward();
                }}
                className="flex flex-col gap-5"
              >
                {/* Award Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Award or Activity Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="e.g., Hackathon Winner"
                    value={name}
                    onChange={(e) => setName(toTitleCase(e.target.value))}
                  />
                </div>

                {/* Year */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <EndYearPicker
                    value={endYear}
                    onChange={setEndYear}
                    minYear={Number(startYear) || 1950}
                    maxYear={new Date().getFullYear()}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    className="w-full h-24 px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none resize-none"
                    placeholder="Brief description of the achievement or role"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => setDescription(toSentenceCase(description))}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    variant="neutral-secondary"
                    icon={<FeatherPlus className="w-4 h-4" />}
                    className="w-full rounded-xl h-10 px-4 bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                    onClick={handleAddAward}
                  >
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update award"
                        : "Update and add another award"}
                  </Button>

                  {/* ✅ Cancel edit */}
                  {isEditing && (
                    <Button
                      onClick={resetForm}
                      type="button"
                      className="w-full rounded-xl h-10 bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/50 transition-all duration-200"
                      variant="brand-tertiary"
                    >
                      Cancel edit
                    </Button>
                  )}
                </div>
              </form>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-6" />

              {/* Footer with Continue button */}
              <footer>
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue || isSubmitting}
                  className="w-full h-11 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                  style={{
                    background:
                      !canContinue || isSubmitting
                        ? "linear-gradient(135deg, #e0e0e0, #f0f0f0)"
                        : "linear-gradient(135deg, #2c3e50, #1e2a36)",
                    color: "#ffffff",
                    cursor:
                      !canContinue || isSubmitting ? "not-allowed" : "pointer",
                    boxShadow:
                      !canContinue || isSubmitting
                        ? "none"
                        : "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)",
                    opacity: !canContinue || isSubmitting ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? "Saving..." : "Continue →"}
                </Button>
              </footer>
            </main>

            {/* Right panel - Enhanced glass effect */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
                {/* Experience Index Score */}
                <div className="text-center mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Experience Index
                  </h3>
                  <div className="relative inline-block">
                    <span className="text-6xl font-light text-gray-800">
                      {displayedIndex ?? 0}
                    </span>
                    <div className="absolute -top-1 -right-4 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-4" />

                {/* Progress Steps with refined styling */}
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Progress steps
                </h4>

                <div className="space-y-2">
                  {/* Completed - Demographics */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100">
                      <FeatherCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="flex-1 text-sm text-gray-600">
                      Demographics
                    </span>
                    <span className="text-xs text-gray-400">1/6</span>
                  </button>

                  {/* Completed - Education */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100">
                      <FeatherCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="flex-1 text-sm text-gray-600">
                      Education
                    </span>
                    <span className="text-xs text-gray-400">2/6</span>
                  </button>

                  {/* Completed - Experience */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100">
                      <FeatherCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="flex-1 text-sm text-gray-600">
                      Experience
                    </span>
                    <span className="text-xs text-gray-400">3/6</span>
                  </button>

                  {/* Completed - Certifications */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100">
                      <FeatherCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="flex-1 text-sm text-gray-600">
                      Certifications
                    </span>
                    <span className="text-xs text-gray-400">4/6</span>
                  </button>

                  {/* Active - Awards */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(44,62,80,0.1), rgba(30,42,54,0.05))",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/80 shadow-sm">
                      <FeatherAward className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      Awards
                    </span>
                    <span className="text-xs text-gray-400">5/6</span>
                  </div>

                  {/* Inactive - Projects */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/60">
                      <FeatherPackage className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="flex-1 text-sm text-gray-500">
                      Projects
                    </span>
                    <span className="text-xs text-gray-400">6/6</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteAwardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[360px] rounded-2xl p-6 shadow-xl bg-white/80 backdrop-blur-xl border border-white/40">
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.accent }}
              >
                Are you sure?
              </h3>

              <button
                onClick={() => setDeleteAwardId(null)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <p className="text-sm mb-6 text-gray-600">
              Do you really want to delete this award?
            </p>

            <div className="flex gap-3">
              {/* Cancel */}
              <Button
                className="flex-1 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                onClick={() => setDeleteAwardId(null)}
                style={{
                  color: colors.accent,
                }}
              >
                Cancel
              </Button>

              {/* Delete */}
              <Button
                className="flex-1 rounded-xl transition-all duration-200"
                onClick={handleRemove}
                disabled={isSubmitting}
                style={{
                  background: isSubmitting
                    ? "linear-gradient(135deg, #ef444466, #dc262666)"
                    : "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#ffffff",
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
