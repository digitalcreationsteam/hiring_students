// src/components/Awards.tsx
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
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "../common/Colors";


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

  // close on outside click
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
      {/* INPUT */}
      <input
        readOnly
        disabled={disabled}
        value={value}
        placeholder="End Year"
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`w-full h-10 px-4 rounded-full cursor-pointer border border-neutral-300 focus:outline-none ${
          disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"
        }`}
      />

      {/* PICKER */}
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3 max-h-60 overflow-auto">
          <div className="grid grid-cols-4 gap-2 text-sm">
            {years.map((year) => (
<button
  key={year}
  type="button"
  onClick={() => {
    onChange(String(year));
    setOpen(false);
  }}
  className="py-2 px-3 rounded-lg transition text-sm sm:text-base"
  style={{
    backgroundColor:
      value === String(year) ? colors.accent : "transparent",
    color:
      value === String(year)
        ? colors.background
        : colors.neutral[800],
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

  console.log("AWARDS source:", source);
  const userId = localStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_AWARDS = 5;

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
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
        { "user-id": userId },
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
    setEndYear("");
  };

  // Helper
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

  // -------------------- DELETE AWARD --------------------
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

  const buildAwardsPayload = (list: AwardEntry[]) => {
    if (!userId) {
      toast.error("Session expired. Please login again.");
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
      toast.error("Please add at least one award to continue.");
      return;
    }

    if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/projects", { state: { source } });
    }
  };

  // return (
  //   <>
  //     <HeaderLogo />
  //     <ToastContainer position="top-center" autoClose={3000} />

  //     <div className="min-h-screen flex justify-center bg-neutral-50 px-4 sm:px-6 py-0 sm:py-0">
  //       <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
  //         {/* Left card */}
  //         <main className="w-full md:max-w-[448px] flex flex-col gap-6 rounded-[28px] border border-neutral-300 bg-white px-4 sm:px-6 md:px-8 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.06)]">
  //           {/* top row - back + progress */}
  //           <div className="flex items-center gap-4">
  //             {/* <IconButton
  //               size="small"
  //               icon={<FeatherArrowLeft />}
  //               onClick={() => navigate(-1)}
  //             /> */}
  //              <IconButton
  //                             size="small"
  //                             icon={<FeatherArrowLeft />}
  //                             onClick={async () => {
  //                               try {
  //                                 // 1️⃣ If came from dashboard → always go back to dashboard
  //                                 if (source === "dashboard") {
  //                                   navigate("/dashboard");
  //                                   return;
  //                                 }

  //                                 // 2️⃣ Otherwise → ask backend if education is allowed
  //                                 const res = await API("POST", "/auth/verify-route", {
  //                                   route: "/certifications",
  //                                 });

  //                                 if (res.allowed) {
  //                                   navigate("/certifications", { state: { source } });
  //                                 }
  //                                 // ❌ else do nothing (education already completed)
  //                               } catch {
  //                                 // silent fail
  //                               }
  //                             }}
  //                           />
  //             <div className="flex-1 w-full max-w-full md:max-w-[420px]">
  //               <div className="flex items-center gap-3">
  //                 {[...Array(5)].map((_, i) => (
  //                   <div
  //                     key={`p-${i}`}
  //                     style={{ height: 6, backgroundColor: colors.primary }}
  //                     className="flex-1 rounded-full"
  //                   />
  //                 ))}
  //                 {[...Array(1)].map((_, i) => (
  //                   <div
  //                     key={`n-${i}`}
  //                     style={{ height: 6 }}
  //                     className="flex-1 rounded-full bg-neutral-300"
  //                   />
  //                 ))}
  //               </div>
  //             </div>
  //           </div>

  //           {/* Header */}
        //     <header className=" w-full">
        //       <h2 className="text-[22px] text-neutral-900">
        //         Add awards and extracurriculars
        //       </h2>
        //       <p className="text-xs text-neutral-500">
        //         These help recruiters understand your interests and achievements
        //       </p>
        //     </header>

        //     <section className="flex w-full flex-col gap-3">
        //       {awards.map((a) => {
        //         const isSelected = selectedAward?.id === a.id;

        //         return (
        //           <div
        //             key={a.id}
        //             role="button"
        //             tabIndex={0}
        //             onClick={() => setSelectedAward(isSelected ? null : a)}
        //             onKeyDown={(e) => {
        //               if (e.key === "Enter" || e.key === " ") {
        //                 e.preventDefault();
        //                 setSelectedAward(isSelected ? null : a);
        //               }
        //             }}
        //             className="
        //   rounded-3xl
        //   border border-neutral-300
        //   bg-white
        //   px-4 py-3
        //   cursor-pointer
        //   transition
        //   hover:bg-neutral-50
        //   focus:outline-none
        //   focus:ring-2
        //   focus:ring-violet-500
        // "
        //           >
  //                   {/* 🔹 TOP ROW */}
  //                   <div className="flex items-center justify-between">
  //                     {/* Left */}
  //                     <div className="flex items-center gap-3 min-w-0">
  //                       <Avatar
  //                         size="large"
  //                         square
  //                         className="!rounded-2xl bg-violet-200 text-violet-700 font-semibold"
  //                       >
  //                         {a.name
  //                           .split(" ")
  //                           .slice(0, 2)
  //                           .map((s) => s[0])
  //                           .join("")}
  //                       </Avatar>

  //                       <div className="flex flex-col min-w-0">
  //                         <span className="text-sm font-semibold text-neutral-900 truncate">
  //                           {a.name}
  //                         </span>

  //                         {a.description && (
  //                           <span className="text-xs text-neutral-500 line-clamp-1">
  //                             {a.description}
  //                           </span>
  //                         )}
  //                       </div>
  //                     </div>

  //                     {/* Right */}
  //                     <div className="flex flex-col items-end gap-2 shrink-0">
  //                       <IconButton
  //                         size="small"
  //                         icon={<FeatherX />}
  //                         aria-label={`Delete award ${a.name}`}
  //                         onClick={(e) => {
  //                           e.stopPropagation();
  //                           setDeleteAwardId(a.id);
  //                         }}
  //                         className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
  //                       />

  //                       <span className="text-xs text-neutral-500">
  //                         {a.year}
  //                       </span>
  //                     </div>
  //                   </div>

  //                   {/* 🔹 DETAILS (inside same card) */}
  //                   {isSelected && (
  //                     <>
  //                       <div className="my-4 border-t border-neutral-200" />

  //                       <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
  //                         <div>
  //                           <span className="font-medium">Award name:</span>{" "}
  //                           {a.name}
  //                         </div>

  //                         {a.description && (
  //                           <div>
  //                             <span className="font-medium">Description:</span>{" "}
  //                             {a.description}
  //                           </div>
  //                         )}

  //                         {a.year && (
  //                           <div>
  //                             <span className="font-medium">Year:</span>{" "}
  //                             {a.year}
  //                           </div>
  //                         )}
  //                       </div>
  //                     </>
  //                   )}
  //                 </div>
  //               );
  //             })}
  //           </section>

  //           {/* Form */}
  //           <form
  //             onSubmit={(e) => {
  //               e.preventDefault();
  //               handleAddAward();
  //             }}
  //             className="flex flex-col gap-4 mt-2"
  //           >
  //             <TextField
  //               label={
  //                 <span className="text-[12px]">
  //                   Award or Activity Name{" "}
  //                   <span className="text-red-500">*</span>{" "}
  //                 </span>
  //               }
  //               helpText=""
  //               className={scTextFieldClass}
  //             >
  //               <TextField.Input
  //                 placeholder="e.g., Hackathon Winner"
  //                 value={name}
  //                 onChange={(e) => setName(toTitleCase(e.target.value))}
  //                 className={scInputClass}
  //               />
  //             </TextField>

  //             {/* End Year */}
  //             <div className="flex flex-col gap-1">
  //               <label className="text-[12px] font-medium">
  //                 Year <span className="text-red-500">*</span>
  //               </label>
  //               <EndYearPicker
  //                 value={endYear}
  //                 onChange={setEndYear}
  //                 minYear={Number(startYear) || 1950}
  //                 maxYear={new Date().getFullYear()}
  //               />
  //             </div>

  //             <TextField
  //               label={<span className="text-[12px]">Description</span>}
  //               helpText=""
  //               className={scTextFieldClass}
  //             >
  //               <TextField.Input
  //                 placeholder="Brief description of the achievement or role"
  //                 value={description}
  //                 onChange={(e) => setDescription(e.target.value)}
  //                 onBlur={() => setDescription(toSentenceCase(description))}
  //                 className={scInputClass}
  //               />
  //             </TextField>

  //             <div className="flex flex-col sm:flex-row gap-3 mt-2">
  //               <Button
  //                 type="button"
  //                 variant="neutral-secondary"
  //                 icon={<FeatherPlus />}
  //                 className="w-full rounded-full border border-neutral-300 h-10 px-4 flex items-center gap-2"
  //                 onClick={handleAddAward}
  //                 disabled={isSubmitting}
  //               >
  //                 {isSubmitting ? "Adding..." : "Add another award"}
  //               </Button>

  //               <div className="flex-1" />
  //             </div>
  //           </form>

  //           <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

  //           <footer>
  //             <Button
  //               onClick={handleContinue}
  //               disabled={!canContinue || isSubmitting}
  //               style={{backgroundColor: colors.primary}}
  //               className={`
  //   w-full h-10 rounded-full transition-all
  //   ${
  //     !canContinue || isSubmitting
  //       ? "bg-violet-300 text-white cursor-not-allowed"
  //       : "bg-violet-700 text-white shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
  //   }
  // `}
  //             >
  //               {isSubmitting ? "Saving..." : "Continue"}
  //             </Button>
  //           </footer>
  //         </main>

  //         {/* Right panel */}
  //         <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
  //           <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
  //             <h3 className="text-[22px] text-neutral-900">
  //               Your Experience Index
  //             </h3>

  //             <div className="flex items-center justify-center py-6">
  //               <span
  //                 aria-live="polite"
  //                 className="font-['Afacad_Flux'] text-[32px] sm:text-[40px] md:text-[48px] font-[500] leading-[56px] text-neutral-300"
  //               >
  //                 {displayedIndex ?? 0}
  //               </span>
  //             </div>

  //             <div className="h-px bg-neutral-300" />

  //             <div className="mt-4">
  //               <div className="text-[16px] text-neutral-800 mb-3">
  //                 Progress Steps
  //               </div>

  //               {/* ⚪ Completed — Demographics */}
  //               <button
  //                 type="button"
  //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3 hover:bg-neutral-50"
  //               >
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">Demographics</span>
  //               </button>

  //               {/* Education — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">Education</span>
  //               </div>

  //               {/* Experience — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">Experience</span>
  //               </div>

  //               {/* Certifications — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">
  //                   Certifications
  //                 </span>
  //               </div>

  //               {/* Awards — active (purple) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3">
  //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
  //                   <IconWithBackground
  //                     size="small"
  //                     variant="neutral"
  //                     className="!bg-white !text-violet-600"
  //                     icon={<FeatherAward className="!text-violet-800" />}
  //                   />
  //                 </div>
  //                 <span className="text-sm font-semibold text-neutral-900">
  //                   Awards
  //                 </span>
  //               </div>

  //               {/* Projects — inactive */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2">
  //                 <IconWithBackground
  //                   variant="neutral"
  //                   size="small"
  //                   className="!bg-white !text-neutral-600"
  //                   icon={<FeatherPackage />}
  //                 />
  //                 <span className="text-sm text-neutral-500">Projects</span>
  //               </div>
  //             </div>
  //           </div>
  //         </aside>
  //       </div>
  //       {deleteAwardId && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  //           <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
  //             <div className="flex justify-between items-center mb-4">
  //               <h3 className="text-lg font-semibold text-neutral-900">
  //                 Are you sure?
  //               </h3>
  //               <button
  //                 onClick={() => setDeleteAwardId(null)}
  //                 className="text-neutral-400 hover:text-neutral-600"
  //               >
  //                 ✕
  //               </button>
  //             </div>

  //             <p className="text-sm text-neutral-600 mb-6">
  //               Do you really want to delete this award?
  //             </p>

  //             <div className="flex gap-3">
  //               <Button
  //                 variant="neutral-secondary"
  //                 className="flex-1"
  //                 onClick={() => setDeleteAwardId(null)}
  //               >
  //                 Cancel
  //               </Button>

  //               <Button
  //                 className="flex-1 rounded-3xl bg-violet-600 text-white hover:bg-violet-700"
  //                 onClick={handleRemove}
  //                 disabled={isSubmitting}
  //               >
  //                 {isSubmitting ? "Deleting..." : "Yes"}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </>
  // );
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
        <ToastContainer position="top-center" autoClose={3000} />

        <div className="flex justify-center px-4 sm:px-6 py-0 sm:py-0">
          <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center py-8">
            {/* Left card */}
            <main className="w-full md:max-w-[448px] flex flex-col gap-6 rounded-[28px] border border-neutral-300 bg-white px-4 sm:px-6 md:px-8 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.06)]">
              {/* top row - back + progress */}
              <div className="flex items-center gap-4">
                <IconButton
                  size="small"
                  icon={<FeatherArrowLeft />}
                  onClick={async () => {
                    try {
                      // 1️⃣ If came from dashboard → always go back to dashboard
                      if (source === "dashboard") {
                        navigate("/dashboard");
                        return;
                      }

                      // 2️⃣ Otherwise → ask backend if education is allowed
                      const res = await API("POST", "/auth/verify-route", {
                        route: "/certifications",
                      });

                      if (res.allowed) {
                        navigate("/certifications", { state: { source } });
                      }
                      // ❌ else do nothing (education already completed)
                    } catch {
                      // silent fail
                    }
                  }}
                />
                <div className="flex-1 w-full max-w-full md:max-w-[420px]">
                  <div className="flex items-center gap-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={`p-${i}`}
                        style={{ height: 6, backgroundColor: colors.primary }}
                        className="flex-1 rounded-full"
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
                          className="rounded-3xl px-4 py-3 cursor-pointer transition-all duration-200 focus:outline-none"
          style={{
            backgroundColor: isSelected ? `${colors.primary}10` : colors.white,
            border: `1px solid ${
              isSelected ? colors.primary : colors.neutral[400]
            }`,
            boxShadow: isSelected
              ? `0 4px 14px ${colors.primary}22`
              : "0 1px 3px rgba(0,0,0,0.04)",
          }}
                  >
                      {/* 🔹 TOP ROW */}
                      <div className="flex items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-3 min-w-0">
                     <Avatar
  size="large"
  square
  className="!rounded-2xl font-semibold"
  style={{
    backgroundColor: `${colors.primary}22`, // soft tinted background
    color: colors.primary,                  // brand text color
  }}
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
                            className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
                          />

                          <span className="text-xs text-neutral-500">
                            {a.year}
                          </span>
                        </div>
                      </div>

                      {/* 🔹 DETAILS (inside same card) */}
                      {isSelected && (
                        <>
                          <div className="my-4 border-t border-neutral-200" />

                          <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
                            <div>
                              <span className="font-medium">Award name:</span>{" "}
                              {a.name}
                            </div>

                            {a.description && (
                              <div>
                                <span className="font-medium">
                                  Description:
                                </span>{" "}
                                {a.description}
                              </div>
                            )}

                            {a.year && (
                              <div>
                                <span className="font-medium">Year:</span>{" "}
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

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddAward();
                }}
                className="flex flex-col gap-4 mt-2"
              >
                <TextField
                  label={
                    <span className="text-[12px]">
                      Award or Activity Name{" "}
                      <span className="text-red-500">*</span>{" "}
                    </span>
                  }
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

                {/* End Year */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <EndYearPicker
                    value={endYear}
                    onChange={setEndYear}
                    minYear={Number(startYear) || 1950}
                    maxYear={new Date().getFullYear()}
                  />
                </div>

                <TextField
                  label={<span className="text-[12px]">Description</span>}
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
                  className="w-full h-10 rounded-full text-background transition-all"
                  style={{
                    backgroundColor:
                      !canContinue || isSubmitting
                        ? `${colors.accent}66` // faded primary when disabled
                        : colors.accent,
                    cursor:
                      !canContinue || isSubmitting ? "not-allowed" : "pointer",
                    boxShadow:
                      !canContinue || isSubmitting
                        ? "none"
                        : "0 6px 18px rgba(99,52,237,0.18)",
                  }}
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
                    <span className="text-sm text-neutral-700">
                      Demographics
                    </span>
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
                    <span className="text-sm text-neutral-700">
                      Certifications
                    </span>
                  </div>

                  {/* Awards — active (purple) */}
                  <div
                    style={{ backgroundColor: colors.primary }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-2 mb-3"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
                      <IconWithBackground
                        size="small"
                        variant="neutral"
                        className="!bg-white"
                        icon={<FeatherAward />}
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
              <div
                className="w-[360px] rounded-2xl p-6 shadow-xl"
                style={{ backgroundColor: colors.background }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.accent }}
                  >
                    Are you sure?
                  </h3>

                  <button
                    onClick={() => setDeleteAwardId(null)}
                    className="transition"
                    style={{ color: colors.neutral[600] }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = colors.accent)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = colors.neutral[600])
                    }
                  >
                    ✕
                  </button>
                </div>

                <p
                  className="text-sm mb-6"
                  style={{ color: colors.neutral[600] }}
                >
                  Do you really want to delete this award?
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="neutral-secondary"
                    className="flex-1 !rounded-3xl" // ✅ force same rounding
                    onClick={() => setDeleteAwardId(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="flex-1 !rounded-3xl transition"
                    onClick={handleRemove}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting
                        ? `${colors.primary}55`
                        : colors.primary,
                      color: colors.white,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting)
                        e.currentTarget.style.backgroundColor =
                          colors.secondary;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting)
                        e.currentTarget.style.backgroundColor = colors.primary;
                    }}
                  >
                    {isSubmitting ? "Deleting..." : "Yes"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
