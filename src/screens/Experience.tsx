// src/components/Experience.tsx
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
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
  FeatherEdit2,
  FeatherChevronDown,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as SubframeCore from "@subframe/core";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

const ROLE_TITLES = [
  { label: "Internship", value: "internship" },
  { label: "Full Time", value: "full_time" },
  { label: "Part Time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Freelance", value: "freelance" },
  { label: "Entrepreneurship", value: "entrepreneurship" },
] as const;
type RoleValue = (typeof ROLE_TITLES)[number]["value"];
type ExperiencePoints = {
  demographics?: number;
  education?: number;
  workExperience?: number;
};

type ExperienceEntry = {
  id: string;
  roleTitle: string;
  typeOfRole?: string;
  company: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
};

const DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

const isValidMonthYear = (value: string) => {
  if (!DATE_REGEX.test(value)) return false;
  const [Month, year] = value.split("/").map(Number);
  const currentYear = new Date().getFullYear();

  return year >= 1950 && year <= currentYear + 1;
};

const isEndAfterStart = (start: string, end: string) => {
  const [sm, sy] = start.split("/").map(Number);
  const [em, ey] = end.split("/").map(Number);

  return ey > sy || (ey === sy && em >= sm);
};

// -----------------Month And Year Picker----------

function MonthYearPicker({
  value,
  onChange,
  disabled = false,
  maxDate = new Date(),
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  maxDate?: Date;
}) {
  const today = new Date();
  const initialYear = value ? Number(value.split("/")[1]) : today.getFullYear();

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(initialYear);

  const ref = useRef<HTMLDivElement>(null);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isFutureMonth = (monthIndex: number) => {
    return (
      year > maxDate.getFullYear() ||
      (year === maxDate.getFullYear() && monthIndex > maxDate.getMonth())
    );
  };

  return (
    <div className="relative" ref={ref}>
      {/* INPUT */}
      <input
        readOnly
        disabled={disabled}
        value={value}
        placeholder="MM/YYYY"
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full h-10 px-4 rounded-xl border ${
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
              onClick={() => setYear((y) => y - 1)}
              className="px-2 text-lg text-gray-600 hover:text-gray-900 transition"
            >
              «
            </button>
            <span className="text-sm font-medium text-gray-700">{year}</span>
            <button 
              type="button" 
              onClick={() => setYear((y) => y + 1)}
              className="px-2 text-lg text-gray-600 hover:text-gray-900 transition"
            >
              »
            </button>
          </div>

          {/* MONTH GRID */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            {months.map((m, idx) => {
              const disabledMonth = isFutureMonth(idx);
              const formatted = `${String(idx + 1).padStart(2, "0")}/${year}`;

              return (
                <button
                  key={m}
                  type="button"
                  disabled={disabledMonth}
                  onClick={() => {
                    onChange(formatted);
                    setOpen(false);
                  }}
                  className="py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                  style={{
                    backgroundColor:
                      value === formatted ? colors.primary : "transparent",
                    color:
                      value === formatted
                        ? colors.white
                        : disabledMonth
                          ? colors.neutral[400]
                          : colors.neutral[800],
                    cursor: disabledMonth ? "not-allowed" : "pointer",
                    opacity: disabledMonth ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!disabledMonth && value !== formatted) {
                      e.currentTarget.style.backgroundColor = colors.primaryGlow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!disabledMonth && value !== formatted) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Experience() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const source = location.state?.source; // "dashboard" | undefined
  console.log("EXPERIENCE source:", source);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
const [editingId, setEditingId] = useState<string | null>(null);
const isEditing = !!editingId;

  // form state
  const [roleTitle, setRoleTitle] = useState("");

  const [typeOfRole, setTypeOfRole] = useState<RoleValue | "">("");
  const typeOfRoleLabel =
    ROLE_TITLES.find((r) => r.value === typeOfRole)?.label || "";

  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [description, setDescription] = useState("");

  // stored entries
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceEntry | null>(null);

  const isAddable = () => {
    if (!roleTitle.trim()) {
      toast.error("Role title is required.");
      return false;
    }

    if (!isValidText(roleTitle)) {
      toast.error("Role title must contain only letters and valid symbols.");
      return false;
    }

    // ✅ typeOfRole is a dropdown enum, so just validate it exists in ROLE_TITLES
    if (!typeOfRole) {
      toast.error("Type of role is required.");
      return false;
    }

    const isValidRole = ROLE_TITLES.some((r) => r.value === typeOfRole);
    if (!isValidRole) {
      toast.error("Please select a valid type of role.");
      return false;
    }

    if (!company.trim()) {
      toast.error("Company name is required.");
      return false;
    }

    if (!isValidText(company)) {
      toast.error("Company name must contain only letters and valid symbols.");
      return false;
    }

    // Date validations (already implemented)
    if (!isValidMonthYear(startDate)) {
      toast.error("Start date must be in MM/YYYY format.");
      return false;
    }

    if (!isValidPastOrCurrentDate(startDate)) {
      toast.error("Start date cannot be in the future.");
      return false;
    }

    if (!currentlyWorking) {
      if (!isValidMonthYear(endDate)) {
        toast.error("End date must be in MM/YYYY format.");
        return false;
      }

      if (!isValidPastOrCurrentDate(endDate)) {
        toast.error("End date cannot be in the future.");
        return false;
      }

      if (!isEndAfterStart(startDate, endDate)) {
        toast.error("End date must be after start date.");
        return false;
      }
    }

    return true;
  };

  const toTitleCase = (value: string) => {
    return value
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toSentenceCase = (v: string) =>
    v ? v.charAt(0).toUpperCase() + v.slice(1) : v;

  const TEXT_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s.&()+/-]{1,80}$/;

  const isValidText = (value: string) => {
    return TEXT_REGEX.test(value.trim());
  };

  const isValidPastOrCurrentDate = (value: string) => {
    // format check MM/YYYY
    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(value)) return false;

    const [mm, yyyy] = value.split("/").map(Number);

    const inputDate = new Date(yyyy, mm - 1); // first day of that month
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth());

    return inputDate <= currentMonth;
  };

  const resetForm = () => {
    setRoleTitle("");
    setTypeOfRole("");
    setCompany("");
    setStartDate("");
    setEndDate("");
    setCurrentlyWorking(false);
    setDescription("");
     setEditingId(null);
  };

  const calculateDurationInMonths = (
    startMonth: number, // 1–12
    startYear: number,
    endMonth: number, // 1–12
    endYear: number,
  ): number => {
    const months = (endYear - startYear) * 12 + (endMonth - startMonth);

    return Math.max(0, months);
  };

  const handleAddExperience = async () => {
    if (!isAddable()) return;

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const isDuplicate = experiences.some(
      (e) =>
        e.roleTitle.toLowerCase() === roleTitle.toLowerCase().trim() &&
        e.company.toLowerCase() === company.toLowerCase().trim(),
    );

    if (isDuplicate) {
      toast.error("This experience already exists.");
      return;
    }

    const [startMonthNum, startYearNum] = startDate.split("/").map(Number);
    const now = new Date();

    const [endMonthNum, endYearNum] = currentlyWorking
      ? [now.getMonth() + 1, now.getFullYear()]
      : endDate.split("/").map(Number);

    const duration = calculateDurationInMonths(
      startMonthNum,
      startYearNum,
      endMonthNum,
      endYearNum,
    );

    const payload = {
      workExperiences: [
        {
          jobTitle: toTitleCase(roleTitle.trim()),
          companyName: toTitleCase(company.trim()),
          startYear: startYearNum,
          startMonth: startMonthNum,
          endYear: endYearNum,
          endMonth: endMonthNum,
          currentlyWorking,
          duration,
          description: description.trim() || "",
          typeOfRole: typeOfRole ? toTitleCase(typeOfRole.trim()) : undefined,
        },
      ],
    };

    try {
      setIsSubmitting(true);

      const res = await API("POST", URL_PATH.experience, payload, {
        "user-id": userId,
      });

      toast.success("Experience added successfully");

      const created = res.data[0];

      setExperiences((prev) => [
        {
          id: created._id,
          roleTitle: created.jobTitle,
          typeOfRole: created.typeOfRole || undefined,
          company: created.companyName,
          startDate: `${String(created.startMonth).padStart(2, "0")}/${created.startYear}`,
          endDate: created.currentlyWorking
            ? undefined
            : `${String(created.endMonth).padStart(2, "0")}/${created.endYear}`,
          currentlyWorking: created.currentlyWorking,
          description: created.description || undefined,
        },
        ...prev,
      ]);
      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- EDIT EXPERIENCE --------------------
const handleUpdateExperience = async () => {
  if (!isAddable()) return;
  if (!editingId || !userId) return;

  const [startMonthNum, startYearNum] = startDate.split("/").map(Number);
  const now = new Date();

  const [endMonthNum, endYearNum] = currentlyWorking
    ? [now.getMonth() + 1, now.getFullYear()]
    : endDate.split("/").map(Number);

  const duration = calculateDurationInMonths(
    startMonthNum,
    startYearNum,
    endMonthNum,
    endYearNum
  );

  const payload = {
    jobTitle: toTitleCase(roleTitle.trim()),
    companyName: toTitleCase(company.trim()),
    startYear: startYearNum,
    startMonth: startMonthNum,
    endYear: endYearNum,
    endMonth: endMonthNum,
    currentlyWorking,
    duration,
    description: description.trim() || "",
    typeOfRole: typeOfRole ? toTitleCase(typeOfRole.trim()) : undefined,
  };

  try {
    setIsSubmitting(true);

    await API(
      "PUT",
      `${URL_PATH.experience}/${editingId}`,
      payload,
      { "user-id": userId }
    );

    toast.success("Experience updated");

    setExperiences((prev) =>
      prev.map((e) =>
        e.id !== editingId
          ? e
          : {
              ...e,
              roleTitle: payload.jobTitle,
              company: payload.companyName,
              typeOfRole: payload.typeOfRole,
              startDate: `${String(payload.startMonth).padStart(2, "0")}/${payload.startYear}`,
              endDate: currentlyWorking
                ? undefined
                : `${String(payload.endMonth).padStart(2, "0")}/${payload.endYear}`,
              currentlyWorking: payload.currentlyWorking,
              description: payload.description || undefined,
            }
      )
    );

    await fetchExperienceIndex();
    resetForm();
  } catch (err: any) {
    toast.error(err?.message || "Failed to update experience");
  } finally {
    setIsSubmitting(false);
  }
};

  // DELETE EXPERIENCE
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
        `${URL_PATH.deleteExperience}/${deleteId}`,
        undefined,
        { "user-id": userId },
      );

      setExperiences((prev) => prev.filter((e) => e.id !== deleteId));

      if (selectedExperience?.id === deleteId) {
        setSelectedExperience(null);
      }

      await fetchExperienceIndex();
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  // GET

  const fetchExperiences = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API("GET", URL_PATH.getExperience, undefined, {
        "user-id": userId,
      });

      const apiExperiences = res?.data ?? [];

      const mapped: ExperienceEntry[] = apiExperiences.map((e: any) => ({
        id: e._id,
        roleTitle: typeof e.jobTitle === "string" ? e.jobTitle : "",
        typeOfRole: typeof e.typeOfRole === "string" ? e.typeOfRole : undefined,
        company: typeof e.companyName === "string" ? e.companyName : "",
        startDate:
          e.startYear && e.startMonth
            ? `${String(e.startMonth).padStart(2, "0")}/${e.startYear}`
            : "",
        endDate: e.currentlyWorking
          ? undefined
          : e.endYear && e.endMonth
            ? `${String(e.endMonth).padStart(2, "0")}/${e.endYear}`
            : undefined,
        currentlyWorking: Boolean(e.currentlyWorking),
        description:
          typeof e.description === "string" ? e.description : undefined,
      }));

      setExperiences(mapped);
    } catch (err) {
      console.error("Failed to fetch experience", err);
    }
  }, [userId]);

  // GET EXPERIENCE INDEX
  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [experiencePoints, setExperiencePoints] =
    useState<ExperiencePoints | null>(null);

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) +
    (experiencePoints?.education ?? 0) +
    (experiencePoints?.workExperience ?? 0);

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

  const canContinue = experiences.length > 0;

  const handleContinue = () => {
    if (!experiences.length) {
      toast.error("Please add at least one experience to continue.");
      return;
    }
    if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/certifications", { state: { source } });
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchExperiences();
    fetchExperienceIndex();
  }, [userId, fetchExperiences, fetchExperienceIndex]);

  useEffect(() => {
    if (currentlyWorking) {
      setEndDate("");
    }
  }, [currentlyWorking]);

// edit your profile 
const fillFormForEdit = (exp: ExperienceEntry) => {
  setEditingId(exp.id);

  setRoleTitle(exp.roleTitle || "");

  const found =
    ROLE_TITLES.find((r) => r.value === exp.typeOfRole) ||
    ROLE_TITLES.find(
      (r) => r.label.toLowerCase() === String(exp.typeOfRole || "").toLowerCase()
    );

  setTypeOfRole((found?.value as any) || "");

  setCompany(exp.company || "");
  setStartDate(exp.startDate || "");
  setEndDate(exp.currentlyWorking ? "" : exp.endDate || "");
  setCurrentlyWorking(!!exp.currentlyWorking);
  setDescription(exp.description || "");

  setSelectedExperience(exp);
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
                  onClick={() => {
                    navigate("/education");
                  }}
                  className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i <= 2 
                            ? "bg-gradient-to-r from-gray-600 to-gray-800" 
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Step 3 of 6</p>
                </div>
              </div>

              {/* Header with refined typography */}
              <header className="mb-8">
                <h2 className="text-2xl text-gray-800 font-light tracking-tight">
                  Add your 
                  <span className="block font-semibold text-gray-900 mt-1">Experience</span>
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  Internships, roles, and other work count toward your Experience Index
                </p>
              </header>

              {/* Experience List with enhanced styling */}
              <section className="flex w-full flex-col gap-3 mb-8">
                {experiences.map((exp) => {
                  const isSelected = selectedExperience?.id === exp.id;

                  return (
                    <div
                      key={exp.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedExperience(isSelected ? null : exp)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedExperience(isSelected ? null : exp);
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
                            {(exp.company || "")
                              .split(" ")
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join("")}
                          </Avatar>

                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-800 truncate">
                              {exp.roleTitle}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {exp.company}
                            </span>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-1">
                            {/* ✅ EDIT */}
                            <IconButton
                              size="small"
                              icon={<FeatherEdit2 className="w-3 h-3" />}
                              aria-label={`Edit experience ${exp.roleTitle}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                fillFormForEdit(exp);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />

                            {/* ✅ DELETE */}
                            <IconButton
                              size="small"
                              icon={<FeatherX className="w-3 h-3" />}
                              aria-label={`Delete experience ${exp.roleTitle}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(exp.id);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />
                          </div>

                          <span className="text-xs text-gray-500">
                            {exp.startDate || "—"}
                            {exp.currentlyWorking ? " - Present" : exp.endDate ? ` - ${exp.endDate}` : ""}
                          </span>
                        </div>
                      </div>

                      {/* 🔹 DETAILS (same card, same border) */}
                      {isSelected && (
                        <>
                          <div className="my-4 border-t border-white/30" />

                          <div className="flex flex-col gap-2 text-sm text-gray-700 px-1">
                            <div>
                              <span className="font-medium text-gray-600">Role:</span>{" "}
                              {exp.roleTitle}
                            </div>

                            <div>
                              <span className="font-medium text-gray-600">Type of Role:</span>{" "}
                              {exp.typeOfRole}
                            </div>

                            <div>
                              <span className="font-medium text-gray-600">Company:</span>{" "}
                              {exp.company}
                            </div>

                            <div>
                              <span className="font-medium text-gray-600">Duration:</span>{" "}
                              {exp.startDate || "—"}
                              {exp.currentlyWorking
                                ? " - Present"
                                : exp.endDate
                                  ? ` - ${exp.endDate}`
                                  : ""}
                            </div>

                            {exp.description && (
                              <div>
                                <span className="font-medium text-gray-600">Description:</span>{" "}
                                {exp.description}
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
                  isEditing ? handleUpdateExperience() : handleAddExperience();
                }}
                className="flex flex-col gap-5"
              >
                {/* Role Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="e.g., Software Engineer, Marketing Intern"
                    value={roleTitle}
                    onChange={(ev) => setRoleTitle(ev.target.value)}
                  />
                </div>

                {/* Type of Role Dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type of Role <span className="text-red-500">*</span>
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
                          style={{ color: typeOfRole ? colors.accent : "#9CA3AF" }}
                        >
                          {typeOfRole ? typeOfRoleLabel : "Select type of role"}
                        </span>
                        <FeatherChevronDown className="w-4 h-4 text-gray-500" />
                      </div>
                    </SubframeCore.DropdownMenu.Trigger>

                    <SubframeCore.DropdownMenu.Portal>
                      <SubframeCore.DropdownMenu.Content
                        align="start"
                        sideOffset={6}
                        className="z-[9999] bg-white/80 backdrop-blur-xl text-gray-900 rounded-2xl shadow-xl py-1 border border-white/40 min-w-[220px]"
                      >
                        {ROLE_TITLES.map((item) => (
                          <SubframeCore.DropdownMenu.Item
                            key={item.value}
                            onSelect={() => setTypeOfRole(item.value)}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-white/50 outline-none transition"
                          >
                            {item.label}
                          </SubframeCore.DropdownMenu.Item>
                        ))}
                      </SubframeCore.DropdownMenu.Content>
                    </SubframeCore.DropdownMenu.Portal>
                  </SubframeCore.DropdownMenu.Root>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="Company name"
                    value={company}
                    onChange={(e) =>
                      setCompany(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                    }
                    onBlur={() => setCompany(toTitleCase(company))}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <MonthYearPicker
                      value={startDate}
                      onChange={setStartDate}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <MonthYearPicker
                      value={endDate}
                      onChange={setEndDate}
                      disabled={currentlyWorking}
                    />
                  </div>
                </div>

                {/* Currently Working Toggle */}
                <div className="flex items-center gap-3 p-3 bg-white/30 rounded-xl backdrop-blur-sm border border-white/20">
                  <Switch
                    checked={currentlyWorking}
                    onCheckedChange={setCurrentlyWorking}
                    className="h-5 w-9 transition-colors"
                    style={{
                      backgroundColor: currentlyWorking
                        ? colors.primary
                        : colors.neutral[400],
                    }}
                  />
                  <span className="text-sm text-gray-600">
                    I currently work here
                  </span>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    className="w-full h-24 px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none resize-none"
                    placeholder="Describe your key responsibilities and achievements"
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDescription(e.target.value);
                      }
                    }}
                    onBlur={() => setDescription(toSentenceCase(description))}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {description.length}/500
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    variant="neutral-secondary"
                    icon={<FeatherPlus className="w-4 h-4" />}
                    className="w-full rounded-xl h-10 px-4 bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                    onClick={() =>
                      isEditing ? handleUpdateExperience() : handleAddExperience()
                    }
                  >
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update experience"
                        : "Add another experience"}
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

                  {/* Active - Experience */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, rgba(44,62,80,0.1), rgba(30,42,54,0.05))",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/80 shadow-sm">
                      <FeatherBriefcase className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      Experience
                    </span>
                    <span className="text-xs text-gray-400">3/6</span>
                  </div>

                  {/* Inactive steps */}
                  {[
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
                        {index + 4}/6
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
              Do you really want to delete this experience?
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