// src/components/Education.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import HeaderLogo from "../ui/components/HeaderLogo";
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
  FeatherEdit2,
  FeatherChevronDown,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import * as SubframeCore from "@subframe/core";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

const DEGREE_OPTIONS = [
  { label: "Diploma", value: "diploma" },
  { label: "Bachelor's Degree", value: "bachelor" },
  { label: "B.Tech", value: "b.tech" },
  { label: "Master's Degree", value: "master" },
  { label: "M.Tech", value: "m.tech" },
  { label: "Doctorate (PhD)", value: "phd" },
  { label: "Professional Degree", value: "professional_degree" },
  { label: "Other", value: "other" },
] as const;

type DegreeOption = (typeof DEGREE_OPTIONS)[number];

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
  cgpa?: string;
};

type UniversityEntry = {
  id: string;
  name: string;
};

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

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
    Math.floor(selectedYear / 10) * 10,
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
        className={`w-full h-9 px-3 text-sm rounded-xl border ${
          disabled 
            ? "bg-white/30 border-white/20 text-gray-400 cursor-not-allowed" 
            : "bg-white/50 border-gray-200/50 hover:border-gray-300 cursor-pointer"
        } focus:outline-none transition-all duration-200 backdrop-blur-sm`}
      />

      {/* PICKER */}
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl p-3">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setDecadeStart((d) => d - 10)}
              className="px-2 text-lg text-gray-600 hover:text-gray-900 transition"
            >
              «
            </button>

            <span className="text-sm font-medium text-gray-700">
              {decadeStart} – {decadeStart + 9}
            </span>

            <button
              type="button"
              onClick={() => setDecadeStart((d) => d + 10)}
              className="px-2 text-lg text-gray-600 hover:text-gray-900 transition"
            >
              »
            </button>
          </div>

          {/* YEARS GRID */}
          <div className="grid grid-cols-4 gap-2 text-sm">
            {years.map((year) => {
              const isDisabled =
                year < minYear || year > maxYear || year > currentYear;

              return (
                <button
                  key={year}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(String(year));
                    setOpen(false);
                  }}
                  className="py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                  style={{
                    backgroundColor: value === String(year) ? colors.primary : "transparent",
                    color: value === String(year)
                      ? colors.white
                      : isDisabled
                        ? colors.neutral[400]
                        : colors.neutral[800],
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && value !== String(year)) {
                      e.currentTarget.style.backgroundColor = colors.primaryGlow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled && value !== String(year)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
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

// SchoolNameDropdown
function SchoolNameDropdown({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(value || "");
  const debouncedQuery = useDebouncedValue(query, 250);

  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<UniversityEntry[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const wrapRef = React.useRef<HTMLDivElement>(null);

  // ✅ Fetch universities function
  const OPENALEX_BASE = "https://api.openalex.org";

  const fetchUniversities = React.useCallback(async (q: string) => {
    const url =
      `${OPENALEX_BASE}/institutions` +
      `?search=${encodeURIComponent(q)}` +
      `&per-page=25`;

    const r = await fetch(url);
    if (!r.ok) throw new Error(`OpenAlex error ${r.status}`);

    const json = await r.json();

    // OpenAlex returns { results: [...] }
    const mapped: UniversityEntry[] = (json?.results ?? [])
      .map((inst: any) => ({
        // inst.id looks like "https://openalex.org/I123456789"
        id: String(inst?.id || ""),
        name: String(inst?.display_name || ""),
      }))
      .filter((x: UniversityEntry) => x.id && x.name);

    return mapped;
  }, []);

  // close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // keep query in sync if parent changes value
  React.useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // ✅ fetch results when query changes (with debounce)
  React.useEffect(() => {
    if (!open) return;

    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setItems([]);
      setError(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUniversities(q);
        setItems(data);
      } catch (e: any) {
        setItems([]);
        setError(e?.message || "Could not load universities");
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQuery, open, fetchUniversities]);

  return (
    <div className="relative" ref={wrapRef}>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
        School Name <span className="text-red-500">*</span>
      </label>

      <input
        disabled={disabled}
        value={query}
        placeholder="Search your university (India / US)"
        onFocus={() => !disabled && setOpen(true)}
        onClick={() => !disabled && setOpen(true)}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onChange(v);
          if (!open) setOpen(true);
        }}
        className={`w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 ${
          disabled 
            ? "border-white/20 text-gray-400 cursor-not-allowed" 
            : "border-gray-200/50 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
        }`}
        style={{ color: colors.accent }}
      />

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden">
          <div className="px-4 py-2 text-xs border-b border-white/30 flex items-center justify-between">
            <span className="text-gray-500">
              {loading ? "Searching..." : "Type 2+ characters to search"}
            </span>
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="max-h-[240px] overflow-y-auto">
            {error && (
              <div className="px-4 py-2 text-sm text-gray-500">
                {error}
              </div>
            )}

            {!error && !loading && items.length === 0 && debouncedQuery.trim().length >= 2 && (
              <div className="px-4 py-2 text-sm text-gray-500">
                No matches. You can keep typing to enter custom name.
              </div>
            )}

            {items.map((u) => (
              <button
                key={u.id}
                type="button"
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/50 transition"
                style={{ color: colors.accent }}
                onClick={() => {
                  onChange(u.name);
                  setQuery(u.name);
                  setOpen(false);
                }}
              >
                <span className="truncate">{u.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Education() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source; // "dashboard" | undefined
  console.log("EDUCATION source:", source);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = !!editingId;

  const userId = localStorage.getItem("userId");

  // local form state
  const [degree, setDegree] = useState<string>("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyStudying, setStudying] = useState(false);
  const [gradeType, setGradeType] = useState<"gpa" | "cgpa">("gpa");
  const [gradeValue, setGradeValue] = useState("");

  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [experiencePoints, setExperiencePoints] =
    useState<ExperiencePoints | null>(null);

  // stored entries
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [selectedEducation, setSelectedEducation] =
    useState<EducationEntry | null>(null);

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) + (experiencePoints?.education ?? 0);

  // Update the validation function
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

    // Check if grade value is provided
    if (!gradeValue.trim() || gradeValue.trim().length === 0) {
      return `Please enter ${gradeType === "gpa" ? "GPA" : "CGPA"}`;
    }

    // Validate based on selected type
    if (gradeType === "gpa") {
      if (!/^(4(\.0{1,2})?|[0-3](\.[0-9]{1,2})?)$/.test(gradeValue))
        return "GPA must be between 0 and 4.0 (e.g., 3.5, 4.0)";
    } else {
      if (!/^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/.test(gradeValue))
        return "CGPA must be between 0 and 10 (e.g., 7.5, 9.2)";
    }

    return null;
  };

  const resetForm = () => {
    setDegree("");
    setFieldOfStudy("");
    setSchoolName("");
    setStartYear("");
    setEndYear("");
    setStudying(false);
    setGradeType("gpa");
    setGradeValue("");
    setEditingId(null);
  };

  const hasEducationOverlap = () => {
    const newStart = Number(startYear);
    const newEnd = currentlyStudying
      ? new Date().getFullYear()
      : Number(endYear);

    if (!Number.isFinite(newStart) || !Number.isFinite(newEnd)) return false;

    return educations.some((ed) => {
      const oldStart = Number(ed.startYear);
      const oldEnd = ed.currentlyStudying
        ? new Date().getFullYear()
        : Number(ed.endYear);

      if (!Number.isFinite(oldStart) || !Number.isFinite(oldEnd)) return false;

      // ✅ strict overlap: allows 2003–2006 and 2006–2008
      return newStart < oldEnd && newEnd > oldStart;
    });
  };

  const handleAddEducation = async () => {
    const error = validateEducation();
    if (error) {
      toast.error(error);
      return;
    }

    if (hasEducationOverlap()) {
      toast.error(
        "Education period overlaps with an existing degree. Degrees must be sequential.",
      );
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    // ✅ DUPLICATE CHECK (CORRECT PLACE)
    // ✅ HIERARCHICAL DUPLICATE CHECK (DEGREE → FIELD → SCHOOL)
    const normalizedNew = {
      degree: normalize(degree).trim(),
      fieldOfStudy: normalize(toTitleCase(fieldOfStudy)).trim(),
      schoolName: normalize(toTitleCase(schoolName)).trim(),
      startYear,
    };

    // 1️⃣ Check if degree already exists
    const degreeExists = educations.some(
      (ed) => normalize(ed.degree).trim() === normalizedNew.degree,
    );
    if (degreeExists) {
      toast.error("You have already added this degree.");
      return;
    }

    // 2️⃣ Check if field of study exists under this degree
    const fieldExists = educations.some(
      (ed) =>
        normalize(ed.degree).trim() === normalizedNew.degree &&
        normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy,
    );
    if (fieldExists) {
      toast.error("This field of study already exists for this degree.");
      return;
    }

    // 3️⃣ Check if school exists under this degree + field
    const schoolExists = educations.some(
      (ed) =>
        normalize(ed.degree).trim() === normalizedNew.degree &&
        normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy &&
        normalize(ed.schoolName).trim() === normalizedNew.schoolName,
    );
    if (schoolExists) {
      toast.error(
        "This school is already added for this degree and field of study.",
      );
      return;
    }

    const currentYear = new Date().getFullYear();

    const duration = currentlyStudying
      ? currentYear - Number(startYear)
      : Number(endYear) - Number(startYear);

    // ✅ API payload - include both GPA and CGPA
    const payload = {
      educations: [
        {
          degree,
          fieldOfStudy: toTitleCase(fieldOfStudy),
          schoolName: toTitleCase(schoolName),
          startYear: Number(startYear),
          endYear: currentlyStudying ? null : Number(endYear),
          currentlyStudying,
          duration,
          gpa: gradeType === "gpa" ? Number(gradeValue) : null,
          cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
          gradeSystem: gradeType,
        },
      ],
    };

    try {
      setIsSubmitting(true);

      const res = await API("POST", URL_PATH.education, payload, {
        "user-id": userId,
      });
      toast.success("Education added successfully");

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
          cgpa: created.cgpa ? String(created.cgpa) : undefined,
        },
        ...prev,
      ]);

      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add education");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- EDIT EDUCATION --------------------
  const handleUpdateEducation = async () => {
    const error = validateEducation();
    if (error) {
      toast.error(error);
      return;
    }

    if (!editingId || !userId) return;

    const currentYear = new Date().getFullYear();
    const duration = currentlyStudying
      ? currentYear - Number(startYear)
      : Number(endYear) - Number(startYear);

    const payload = {
      degree,
      fieldOfStudy: toTitleCase(fieldOfStudy),
      schoolName: toTitleCase(schoolName),
      startYear: Number(startYear),
      endYear: currentlyStudying ? null : Number(endYear),
      currentlyStudying,
      duration,
      gpa: gradeType === "gpa" ? Number(gradeValue) : null,
      cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
      gradeSystem: gradeType,
    };

    try {
      setIsSubmitting(true);

      await API(
        "PUT",
        `${URL_PATH.education}/${editingId}`,
        payload,
        { "user-id": userId },
      );

      toast.success("Education updated");

      setEducations((prev) =>
        prev.map((e) => {
          if (e.id !== editingId) return e;

          return {
            ...e,
            degree: payload.degree,
            fieldOfStudy: payload.fieldOfStudy,
            schoolName: payload.schoolName,
            startYear: String(payload.startYear),
            endYear: payload.currentlyStudying
              ? undefined
              : String(payload.endYear ?? ""),
            currentlyStudying: payload.currentlyStudying,
            gpa: payload.gpa != null ? String(payload.gpa) : undefined,
            cgpa: payload.cgpa != null ? String(payload.cgpa) : undefined,
          };
        }),
      );

      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update education");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- DELETE EDUCATION --------------------
  const handleRemove = async () => {
    if (!deleteId) return;

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "DELETE",
        `${URL_PATH.deleteEducation}/${deleteId}`,
        undefined,
        { "user-id": userId },
      );

      setEducations((prev) => prev.filter((e) => e.id !== deleteId));
      await fetchExperienceIndex();
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete education");
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
          cgpa: e.cgpa ? String(e.cgpa) : undefined,
        }),
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
        { "user-id": userId },
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
      toast.error("Please add at least one education to continue.");
      return;
    }

    if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/experience", { state: { source } });
    }
  };

  const handleCurrentlyStudyingToggle = (checked: boolean) => {
    setStudying(checked);

    if (checked) {
      setEndYear("");
    }
  };

  // Add this helper function near your other utility functions
  const getDegreeLabel = (degreeValue: string): string => {
    const degreeOption = DEGREE_OPTIONS.find(
      (option) => option.value === degreeValue,
    );
    return degreeOption?.label || degreeValue;
  };

  //Edit your profile
  const fillFormForEdit = (ed: EducationEntry) => {
    setEditingId(ed.id);

    setDegree(ed.degree || "");
    setFieldOfStudy(ed.fieldOfStudy || "");
    setSchoolName(ed.schoolName || "");
    setStartYear(ed.startYear || "");
    setEndYear(ed.currentlyStudying ? "" : ed.endYear || "");
    setStudying(!!ed.currentlyStudying);

    if (ed.gpa) {
      setGradeType("gpa");
      setGradeValue(String(ed.gpa));
    } else if (ed.cgpa) {
      setGradeType("cgpa");
      setGradeValue(String(ed.cgpa));
    } else {
      setGradeType("gpa");
      setGradeValue("");
    }

    setSelectedEducation(ed);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🎨 Enhanced gradient background with soft blur - matching demographics */}
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
                  onClick={() => {
                   navigate("/demographics");
                  }}
                  className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i <= 1 
                            ? "bg-gradient-to-r from-gray-600 to-gray-800" 
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Step 2 of 6</p>
                </div>
              </div>

              {/* Header with refined typography */}
              <header className="mb-8">
                <h2 className="text-2xl text-gray-800 font-light tracking-tight">
                  Add your 
                  <span className="block font-semibold text-gray-900 mt-1">Education</span>
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  Your academic background helps shape your Experience Index
                </p>
              </header>

              {/* Education List with enhanced styling */}
              <section className="flex w-full flex-col gap-3 mb-8">
                {educations.map((ed) => {
                  const isSelected = selectedEducation?.id === ed.id;

                  return (
                    <div
                      key={ed.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedEducation(isSelected ? null : ed)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedEducation(isSelected ? null : ed);
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
                      {/* 🔹 TOP ROW */}
                      <div className="flex items-center justify-between">
                        {/* Left */}
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
                            {ed.schoolName
                              .split(" ")
                              .slice(0, 2)
                              .map((s) => s[0])
                              .join("")}
                          </Avatar>

                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-800 truncate">
                              {getDegreeLabel(ed.degree)}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {ed.schoolName}
                            </span>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-1">
                            {/* EDIT */}
                            <IconButton
                              size="small"
                              icon={<FeatherEdit2 className="w-3 h-3" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                fillFormForEdit(ed);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />

                            {/* DELETE */}
                            <IconButton
                              size="small"
                              icon={<FeatherX className="w-3 h-3" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(ed.id);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />
                          </div>

                          <span className="text-xs text-gray-500">
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
                          <div className="my-4 border-t border-white/30" />

                          <div className="flex flex-col gap-2 text-sm text-gray-700 px-1">
                            <div>
                              <span className="font-medium text-gray-600">Degree:</span>{" "}
                              {getDegreeLabel(ed.degree)}
                            </div>

                            <div>
                              <span className="font-medium text-gray-600">Field of study:</span>{" "}
                              {ed.fieldOfStudy}
                            </div>

                            <div>
                              <span className="font-medium text-gray-600">Institution:</span>{" "}
                              {ed.schoolName}
                            </div>

                            <div>
                              <span className="font-medium text-gray-600">Duration:</span>{" "}
                              {ed.startYear}
                              {ed.currentlyStudying
                                ? " - Present"
                                : ed.endYear
                                  ? ` - ${ed.endYear}`
                                  : ""}
                            </div>

                            {ed.gpa && (
                              <div>
                                <span className="font-medium text-gray-600">GPA:</span>{" "}
                                {ed.gpa}
                              </div>
                            )}

                            {ed.cgpa && (
                              <div>
                                <span className="font-medium text-gray-600">CGPA:</span>{" "}
                                {ed.cgpa}
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
                  isEditing ? handleUpdateEducation() : handleAddEducation();
                }}
                className="flex flex-col gap-5"
              >
                {/* Degree */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Degree <span className="text-red-500">*</span>
                  </label>

                  <SubframeCore.DropdownMenu.Root>
                    <SubframeCore.DropdownMenu.Trigger asChild>
                      <div
                        className="flex h-10 items-center justify-between rounded-xl border bg-white/50 backdrop-blur-sm px-4 cursor-pointer hover:bg-white/70 transition-all duration-200"
                        style={{
                          borderColor: "rgba(255,255,255,0.4)",
                        }}
                      >
                        <span
                          className="text-sm"
                          style={{ color: degree ? colors.accent : "#9CA3AF" }}
                        >
                          {DEGREE_OPTIONS.find((d) => d.value === degree)
                            ?.label || "Select Degree"}
                        </span>

                        <FeatherChevronDown className="w-4 h-4 text-gray-500" />
                      </div>
                    </SubframeCore.DropdownMenu.Trigger>

                    <SubframeCore.DropdownMenu.Portal>
                      <SubframeCore.DropdownMenu.Content
                        sideOffset={4}
                        align="start"
                        className="bg-white/80 backdrop-blur-xl text-gray-900 rounded-2xl shadow-xl py-1 max-h-[220px] overflow-y-auto border border-white/40 min-w-[200px]"
                        style={{ zIndex: 999999 }}
                      >
                        {DEGREE_OPTIONS.map((item) => (
                          <SubframeCore.DropdownMenu.Item
                            key={item.value}
                            className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-white/50 outline-none transition"
                            onSelect={() => setDegree(item.value)}
                          >
                            {item.label}
                          </SubframeCore.DropdownMenu.Item>
                        ))}
                      </SubframeCore.DropdownMenu.Content>
                    </SubframeCore.DropdownMenu.Portal>
                  </SubframeCore.DropdownMenu.Root>
                </div>

                {/* Field of Study */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field of Study <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="e.g., Computer Science, Business Administration"
                    value={fieldOfStudy}
                    onChange={(ev) => setFieldOfStudy(ev.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Your major or concentration</p>
                </div>

                {/* School Name */}
                <SchoolNameDropdown
                  value={schoolName}
                  onChange={setSchoolName}
                  disabled={isSubmitting}
                />

                {/* Years */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Year */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
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

                {/* Currently Studying Toggle */}
                <div className="flex items-center gap-3 p-3 bg-white/30 rounded-xl backdrop-blur-sm border border-white/20">
                  <Switch
                    checked={currentlyStudying}
                    onCheckedChange={handleCurrentlyStudyingToggle}
                    tabIndex={0}
                    role="switch"
                    aria-checked={currentlyStudying}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCurrentlyStudyingToggle(!currentlyStudying);
                      }
                    }}
                    className="h-5 w-9 transition-colors"
                    style={{
                      backgroundColor: currentlyStudying
                        ? colors.primary
                        : colors.neutral?.[400] || "#9CA3AF",
                    }}
                  />

                  <span className="text-sm text-gray-600">
                    I am currently studying
                  </span>
                </div>

                {/* Grade Type Selector Dropdown + Input Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Grade Type Selector Dropdown */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade System <span className="text-red-500">*</span>
                    </label>

                    <SubframeCore.DropdownMenu.Root>
                      <SubframeCore.DropdownMenu.Trigger asChild>
                        <div
                          className="flex h-10 items-center justify-between rounded-xl border bg-white/50 backdrop-blur-sm px-4 cursor-pointer hover:bg-white/70 transition-all duration-200"
                          style={{
                            borderColor: "rgba(255,255,255,0.4)",
                          }}
                        >
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.accent }}
                          >
                            {gradeType === "gpa" ? "GPA (4.0)" : "CGPA (10.0)"}
                          </span>

                          <FeatherChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                      </SubframeCore.DropdownMenu.Trigger>

                      <SubframeCore.DropdownMenu.Portal>
                        <SubframeCore.DropdownMenu.Content
                          sideOffset={4}
                          align="start"
                          className="bg-white/80 backdrop-blur-xl text-gray-900 rounded-2xl shadow-xl py-1 border border-white/40 min-w-[180px]"
                          style={{ zIndex: 999999 }}
                        >
                          <SubframeCore.DropdownMenu.Item
                            className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-white/50 outline-none transition"
                            onSelect={() => {
                              setGradeType("gpa");
                              setGradeValue("");
                            }}
                          >
                            GPA (4.0)
                          </SubframeCore.DropdownMenu.Item>

                          <SubframeCore.DropdownMenu.Item
                            className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-white/50 outline-none transition"
                            onSelect={() => {
                              setGradeType("cgpa");
                              setGradeValue("");
                            }}
                          >
                            CGPA (10.0)
                          </SubframeCore.DropdownMenu.Item>
                        </SubframeCore.DropdownMenu.Content>
                      </SubframeCore.DropdownMenu.Portal>
                    </SubframeCore.DropdownMenu.Root>
                  </div>

                  {/* Single Grade Input Field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {gradeType === "gpa" ? "GPA" : "CGPA"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                      placeholder={gradeType === "gpa" ? "e.g., 3.8" : "e.g., 7.8"}
                      value={gradeValue}
                      onChange={(ev) => {
                        const value = ev.target.value.replace(/[^0-9.]/g, "");
                        const decimalCount = (value.match(/\./g) || []).length;
                        if (decimalCount <= 1) {
                          setGradeValue(value);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    variant="neutral-secondary"
                    icon={<FeatherPlus className="w-4 h-4" />}
                    className="w-full rounded-xl h-10 px-4 bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                    onClick={() =>
                      isEditing ? handleUpdateEducation() : handleAddEducation()
                    }
                  >
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update education"
                        : "Add another education"}
                  </Button>

                  {/* ✅ Cancel Edit */}
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
                    background: !canContinue || isSubmitting
                      ? "linear-gradient(135deg, #e0e0e0, #f0f0f0)"
                      : "linear-gradient(135deg, #2c3e50, #1e2a36)",
                    color: "#ffffff",
                    cursor: !canContinue || isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: !canContinue || isSubmitting
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
                <h4 className="text-sm font-medium text-gray-600 mb-4">Progress steps</h4>
                
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

                  {/* Active - Education */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, rgba(44,62,80,0.1), rgba(30,42,54,0.05))",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/80 shadow-sm">
                      <FeatherGraduationCap className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      Education
                    </span>
                    <span className="text-xs text-gray-400">2/6</span>
                  </div>

                  {/* Inactive steps */}
                  {[
                    { label: "Experience", icon: <FeatherBriefcase /> },
                    { label: "Certifications", icon: <FeatherFileCheck /> },
                    { label: "Awards", icon: <FeatherAward /> },
                    { label: "Projects", icon: <FeatherPackage /> },
                  ].map((step, index) => (
                    <button
                      key={step.label}
                      type="button"
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/60">
                        <div className="text-gray-500">
                          {step.icon}
                        </div>
                      </div>
                      <span className="flex-1 text-sm text-gray-500">
                        {step.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {index + 3}/6
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-[360px] rounded-2xl p-6 shadow-xl bg-white/80 backdrop-blur-xl border border-white/40"
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.accent }}
              >
                Are you sure?
              </h3>

              <button
                onClick={() => setDeleteId(null)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <p
              className="text-sm mb-6 text-gray-600"
            >
              Do you really want to delete this education?
            </p>

            <div className="flex gap-3">
              {/* Cancel */}
              <Button
                variant="brand-tertiary"
                className="flex-1 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </Button>

              {/* Confirm */}
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