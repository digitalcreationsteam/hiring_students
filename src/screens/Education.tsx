// src/components/Education.tsx
"use client";

import React, { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { Switch } from "../ui/components/Switch";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherAward,
  FeatherBriefcase,
  FeatherFileCheck,
  FeatherGraduationCap,
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import * as SubframeCore from "@subframe/core";
import { FeatherChevronDown } from "@subframe/core";

const DEGREE_OPTIONS = [
  "High School Diploma",
  "Diploma",
  "Associate's Degree",
  "Bachelor's Degree",
  "B.Tech",
  "BSC",
  "Master's Degree",
  "M.Tech",
  "Doctorate (PhD)",
  "Professional Degree",
  "Other",
];

type ExperiencePoints = {
  demographics?: number;
  education?: number;
};

type EducationEntry = {
  id: string;
  degree: string;
  fieldOfStudy: string;
  schoolName: string;
  startYear: string;
  endYear?: string;
  currentlyStudying: boolean;
  gpa?: string;
};

const normalize = (v: string) => v.replace(/\s+/g, " ").trim();

const isValidYear = (value: string) => {
  if (!/^\d{4}$/.test(value)) return false;
  const year = Number(value);
  const currentYear = new Date().getFullYear();
  return year >= 1950 && year <= currentYear + 1;
};

const isEndAfterStart = (start: string, end: string) => {
  return Number(end) >= Number(start);
};

const toTitleCase = (v: string) =>
  normalize(v)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const notify = (msg: string) => {
  alert(msg);
};
 

// -------------------Year Picker------------------
function YearPicker({
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
  const currentYear = new Date().getFullYear();
  const selectedYear = value ? Number(value) : currentYear;

  const [open, setOpen] = useState(false);
  const [decadeStart, setDecadeStart] = useState(
    Math.floor(selectedYear / 10) * 10
  );

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

  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return (
    <div className="relative" ref={ref}>
      {/* INPUT */}
      <input
        readOnly
        disabled={disabled}
        value={value}
        placeholder="YYYY"
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`w-full h-10 px-4 rounded-full cursor-pointer border border-neutral-300 focus:outline-none ${
          disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"
        }`}
      />

      {/* PICKER */}
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setDecadeStart((d) => d - 10)}
              className="px-2 text-lg"
            >
              «
            </button>

            <span className="text-sm font-medium">
              {decadeStart} – {decadeStart + 9}
            </span>

            <button
              type="button"
              onClick={() => setDecadeStart((d) => d + 10)}
              className="px-2 text-lg"
            >
              »
            </button>
          </div>

          {/* YEARS GRID */}
          <div className="grid grid-cols-4 gap-2 text-sm">
            {years.map((year) => {
              const isDisabled =
                year < minYear ||
                year > maxYear ||
                year > currentYear;

              return (
                <button
                  key={year}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(String(year));
                    setOpen(false);
                  }}
                  className={`
                    py-2 rounded-lg transition
                    ${
                      value === String(year)
                        ? "bg-violet-600 text-white"
                        : "hover:bg-neutral-100"
                    }
                    ${isDisabled ? "text-neutral-400" : ""}
                  `}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Education() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  // local form state
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyStudying, setStudying] = useState(false);
  const [gpa, setGpa] = useState("");
  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [experiencePoints, setExperiencePoints] =
    useState<ExperiencePoints | null>(null);

  // stored entries
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [selectedEducation, setSelectedEducation] =
    useState<EducationEntry | null>(null);

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) + (experiencePoints?.education ?? 0);

  // helpers
  const validateEducation = (): string | null => {
    if (!degree.trim()) return "Degree is required";
    if (!fieldOfStudy.trim()) return "Field of study is required";
    if (!schoolName.trim()) return "School name is required";
    if (!startYear.trim()) return "Start year is required";

    if (!isValidYear(startYear)) return "Start year must be a valid year";

    if (!currentlyStudying) {
      if (!endYear.trim()) return "End year is required";
      if (!isValidYear(endYear)) return "End year must be a valid year";
      if (!isEndAfterStart(startYear, endYear))
        return "End year must be after start year";
    }
      if (!gpa.trim()) return "GPA is required";


    if (gpa && !/^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/.test(gpa))
      return "GPA must be between 0 and 10";

    return null;
  };

  const resetForm = () => {
    setDegree("");
    setFieldOfStudy("");
    setSchoolName("");
    setStartYear("");
    setEndYear("");
    setStudying(false);
    setGpa("");
  };

  const handleAddEducation = async () => {
    const error = validateEducation();
    if (error) {
      notify(error);
      return;
    }

    if (!userId) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    // ✅ DUPLICATE CHECK (CORRECT PLACE)
   // ✅ HIERARCHICAL DUPLICATE CHECK (DEGREE → FIELD → SCHOOL)
const normalizedNew = {
  degree: normalize(toTitleCase(degree)).trim(),
  fieldOfStudy: normalize(toTitleCase(fieldOfStudy)).trim(),
  schoolName: normalize(toTitleCase(schoolName)).trim(),
  startYear,
};

// 1️⃣ Check if degree already exists
const degreeExists = educations.some(
  (ed) => normalize(ed.degree).trim() === normalizedNew.degree
);
if (degreeExists) {
  notify("You have already added this degree.");
  return;
}

// 2️⃣ Check if field of study exists under this degree
const fieldExists = educations.some(
  (ed) =>
    normalize(ed.degree).trim() === normalizedNew.degree &&
    normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy
);
if (fieldExists) {
  notify("This field of study already exists for this degree.");
  return;
}

// 3️⃣ Check if school exists under this degree + field
const schoolExists = educations.some(
  (ed) =>
    normalize(ed.degree).trim() === normalizedNew.degree &&
    normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy &&
    normalize(ed.schoolName).trim() === normalizedNew.schoolName
);
if (schoolExists) {
  notify(
    "This school is already added for this degree and field of study."
  );
  return;
}


    const currentYear = new Date().getFullYear();

    const duration = currentlyStudying
      ? currentYear - Number(startYear)
      : Number(endYear) - Number(startYear);

    // ✅ API payload
    const payload = {
      educations: [
        {
          degree: toTitleCase(degree),
          fieldOfStudy: toTitleCase(fieldOfStudy),
          schoolName: toTitleCase(schoolName),
          startYear: Number(startYear),
          endYear: currentlyStudying ? null : Number(endYear),
          currentlyStudying,
          duration,
          gpa: gpa ? Number(gpa) : null,
        },
      ],
    };

    try {
      setIsSubmitting(true);

      const res = await API("POST", URL_PATH.education, payload, {
        "user-id": userId,
      });

      const created = res.data[0];

      setEducations((prev) => [
        {
          id: created._id,
          degree: created.degree,
          fieldOfStudy: created.fieldOfStudy,
          schoolName: created.schoolName,
          startYear: String(created.startYear),
          endYear: created.currentlyStudying
            ? undefined
            : String(created.endYear),
          currentlyStudying: created.currentlyStudying,
          gpa: created.gpa ? String(created.gpa) : undefined,
        },
        ...prev,
      ]);

      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      notify(err?.message || "Failed to add education");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- DELETE EDUCATION --------------------
  const handleRemove = async () => {
    if (!deleteId) return;

    if (!userId) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "DELETE",
        `${URL_PATH.deleteEducation}/${deleteId}`,
        undefined,
        { "user-id": userId }
      );

      setEducations((prev) => prev.filter((e) => e.id !== deleteId));
      await fetchExperienceIndex();
      setDeleteId(null);
    } catch (err: any) {
      notify(err?.message || "Failed to delete education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasEducation = educations.length > 0;
  const canContinue = hasEducation;

  // -------------------- GET EDUCATION --------------------
  const fetchEducations = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API("GET", URL_PATH.getEducation, undefined, {
        "user-id": userId,
      });

      const apiEducations = res?.data || [];

      const mappedEducations: EducationEntry[] = apiEducations.map(
        (e: any) => ({
          id: e._id,
          degree: e.degree || "",
          fieldOfStudy: e.fieldOfStudy || "",
          schoolName: e.schoolName || "",
          startYear: String(e.startYear),
          endYear: e.currentlyStudying ? undefined : String(e.endYear),
          currentlyStudying: e.currentlyStudying,
          gpa: e.gpa ? String(e.gpa) : undefined,
        })
      );

      setEducations(mappedEducations);
    } catch (error) {
      console.error("Failed to fetch education", error);
    }
  }, [userId]);

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

  //use Effect
  useEffect(() => {
    if (!userId) return;

    fetchExperienceIndex();
    fetchEducations();
  }, [userId, fetchExperienceIndex, fetchEducations]);

  /* -------------------- BUILD PAYLOAD -------------------- */

  const handleContinue = () => {
    if (!educations.length) {
      notify("Please add at least one education to continue.");
      return;
    }

    navigate("/experience");
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-10 sm:py-22">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
        {/* Left card */}
        <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6 ...">
          {/* Top: back + progress */}
          <div className="flex items-center gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />

            <div className="flex-1 w-full max-w-full md:max-w-[420px]">
              <div className="flex items-center gap-3">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={`p-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-violet-700"
                  />
                ))}
                {[...Array(4)].map((_, i) => (
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
          <header className="mt-6">
            <h2 className="text-[22px] text-neutral-900">Add your education</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Your academic background helps shape your Experience Index
            </p>
          </header>

          {/* Selected education preview list */}
       <section className="mt-6 flex w-full flex-col gap-3">
  {educations.map((ed) => {
    const isSelected = selectedEducation?.id === ed.id;

    return (
      <div
        key={ed.id}
        role="button"
        tabIndex={0}
        onClick={() =>
          setSelectedEducation(isSelected ? null : ed)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedEducation(isSelected ? null : ed);
          }
        }}
        className="
          rounded-3xl
          border border-neutral-300
          bg-white
          px-4 py-3
          cursor-pointer
          transition
          hover:bg-neutral-50
          focus:outline-none
          focus:ring-2
          focus:ring-violet-500
        "
      >
        {/* 🔹 TOP ROW */}
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              size="large"
              image="https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=400&fit=crop"
              square
              className="!rounded-2xl shadow-sm"
            >
              {ed.schoolName
                .split(" ")
                .slice(0, 2)
                .map((s) => s[0])
                .join("")}
            </Avatar>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-neutral-900 truncate">
                {ed.degree}
              </span>
              <span className="text-xs text-neutral-500 truncate">
                {ed.schoolName}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <IconButton
              size="small"
              icon={<FeatherX />}
              aria-label={`Delete education ${ed.degree}`}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(ed.id);
              }}
              className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
            />

            <span className="text-xs text-neutral-500">
              {ed.startYear}
              {ed.currentlyStudying
                ? " - Present"
                : ed.endYear
                ? ` - ${ed.endYear}`
                : ""}
            </span>
          </div>
        </div>

        {/* 🔹 DETAILS (same card, same border) */}
        {isSelected && (
          <>
            <div className="my-4 border-t border-neutral-200" />

            <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
              <div>
                <span className="font-medium">Degree:</span>{" "}
                {ed.degree}
              </div>

              <div>
                <span className="font-medium">Field of study:</span>{" "}
                {ed.fieldOfStudy}
              </div>

              <div>
                <span className="font-medium">Institution:</span>{" "}
                {ed.schoolName}
              </div>

              <div>
                <span className="font-medium">Duration:</span>{" "}
                {ed.startYear}
                {ed.currentlyStudying
                  ? " - Present"
                  : ed.endYear
                  ? ` - ${ed.endYear}`
                  : ""}
              </div>

              {ed.gpa && (
                <div>
                  <span className="font-medium">GPA:</span>{" "}
                  {ed.gpa}
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
              handleAddEducation();
            }}
            className="mt-6 flex flex-col gap-4"
          >
            {/* Degree */}
            <div className="flex flex-col gap-1">
              {/* Degree Dropdown - Fixed */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-neutral-900">
                  Degree <span className="text-red-500">*</span>
                </label>

                <SubframeCore.DropdownMenu.Root>
                  <SubframeCore.DropdownMenu.Trigger asChild>
                    <div className="flex h-9 items-center justify-between rounded-full border border-neutral-300 bg-white px-3 cursor-pointer hover:bg-neutral-50">
                      <span
                        className={
                          degree
                            ? "text-neutral-900 text-[12px]"
                            : "text-neutral-400 text-[12px]"
                        }
                      >
                        {degree || "Select Degree"}
                      </span>
                      <FeatherChevronDown className="text-neutral-500" />
                    </div>
                  </SubframeCore.DropdownMenu.Trigger>

                  <SubframeCore.DropdownMenu.Portal>
                    <SubframeCore.DropdownMenu.Content
                      className="bg-white rounded-2xl shadow-lg py-1 max-h-[220px] overflow-y-auto border border-neutral-300 min-w-[200px]"
                      sideOffset={4}
                    >
                      {DEGREE_OPTIONS.map((item) => (
                        <SubframeCore.DropdownMenu.Item
                          key={item}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-neutral-100 outline-none"
                          onSelect={() => setDegree(item)}
                        >
                          {item}
                        </SubframeCore.DropdownMenu.Item>
                      ))}
                    </SubframeCore.DropdownMenu.Content>
                  </SubframeCore.DropdownMenu.Portal>
                </SubframeCore.DropdownMenu.Root>
              </div>
            </div>

            {/* Field of Study */}
            <TextField
              className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
              label={<span className="text-[12px]">Field of Study <span className="text-red-500">*</span> </span>}
              helpText={
                <span className="text-[12px]">
                  Your major or concentration{" "}
                </span>
              }
            >
              <TextField.Input
                className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
             text-sm placeholder:text-xs placeholder:text-neutral-400"
                placeholder="e.g., Computer Science, Business Administration"
                value={fieldOfStudy}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldOfStudy(ev.target.value)
                }
              />
            </TextField>

            {/* School Name */}
            <TextField
              className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
              label={<span className="text-[12px]">School Name  <span className="text-red-500">*</span> </span>}
              helpText=""
            >
              <TextField.Input
                className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
             text-sm placeholder:text-xs placeholder:text-neutral-400"
                placeholder="Name of institution"
                value={schoolName}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  setSchoolName(ev.target.value)
                }
              />
            </TextField>

      {/* Years */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Year */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-medium">
            Start Year <span className="text-red-500">*</span>
          </label>
          
          <YearPicker 
            value={startYear}
            onChange={setStartYear}
            minYear={1950}
            maxYear={new Date().getFullYear()}
          />
        </div>

        {/* End Year */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-medium">
            End Year <span className="text-red-500">*</span>
          </label>
          <YearPicker
            value={endYear}
            onChange={setEndYear}
            disabled={currentlyStudying}
            minYear={Number(startYear) || 1950}
            maxYear={new Date().getFullYear()}
          />
        </div>
      </div>

{/* // --------------------------------------- */}
            <div className="flex items-center gap-3">
              <Switch
                checked={currentlyStudying}
                onCheckedChange={setStudying}
                tabIndex={0}
                role="switch"
                aria-checked={currentlyStudying}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setStudying((prev) => !prev);
                  }
                }}
                className="
    h-5 w-9
    data-[state=checked]:bg-violet-700
    data-[state=unchecked]:bg-neutral-300
    [&>span]:h-4 [&>span]:w-3
    [&>span]:data-[state=checked]:translate-x-2
    [&>span]:data-[state=unchecked]:translate-x-0
  "
              />

              <span className="text-sm text-neutral-700">
                I am currently studying
              </span>
            </div>

            {/* GPA */}
            <TextField
              className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
              label={<span className="text-[12px]">GPA </span>}
              helpText=""
            >
              <TextField.Input
                className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0"
                placeholder="e.g., 7.8 (out of 10)"
                value={gpa}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  setGpa(ev.target.value.replace(/[^0-9.]/g, ""))
                }
              />
            </TextField>

            <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
              <Button
                type="button"
                disabled={isSubmitting}
                variant="neutral-secondary"
                icon={<FeatherPlus />}
                className="w-full rounded-full h-10 px-4 border-neutral-300"
                onClick={handleAddEducation}
              >
                {isSubmitting ? "Adding..." : "Add another education"}
              </Button>
              <div className="flex-1" /> {/* pushes continue to the right */}
            </div>
          </form>
          {/* Top form horizontal line */}
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
            <h3 className="text-[20px] text-neutral-900">
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

            {/* Top form horizontal line */}
            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

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

              {/* 🟣 Active — Education */}
              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3 hover:shadow-sm"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
                  <IconWithBackground
                    size="small"
                    icon={<FeatherGraduationCap />}
                  />
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  Education
                </span>
              </button>

              {/* Inactive steps */}
              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
                  <IconWithBackground
                    variant="neutral"
                    size="small"
                    icon={<FeatherBriefcase />}
                  />
                </div>
                <span className="text-sm text-neutral-500">Experience</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
                  <IconWithBackground
                    variant="neutral"
                    size="small"
                    icon={<FeatherFileCheck />}
                  />
                </div>
                <span className="text-sm text-neutral-500">Certifications</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
                  <IconWithBackground
                    variant="neutral"
                    size="small"
                    icon={<FeatherAward />}
                  />
                </div>
                <span className="text-sm text-neutral-500">Awards</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 hover:bg-neutral-50"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
                  <IconWithBackground
                    variant="neutral"
                    size="small"
                    icon={<FeatherPackage />}
                  />
                </div>
                <span className="text-sm text-neutral-500">Projects</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
      {/* ✅ DELETE CONFIRMATION MODAL — ADD HERE */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Are you sure?
              </h3>
              <button
                onClick={() => setDeleteId(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-neutral-600 mb-6">
              Do you really want to delete this education?
            </p>

            <div className="flex gap-3">
              <Button
                variant="neutral-secondary"
                className="flex-1"
                onClick={() => setDeleteId(null)}
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
