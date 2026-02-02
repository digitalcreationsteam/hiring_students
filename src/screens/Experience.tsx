// src/components/Experience.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
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
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as SubframeCore from "@subframe/core";
import { FeatherChevronDown } from "@subframe/core";


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
        className={`w-full h-10 px-4 rounded-full border border-neutral-300 cursor-pointer focus:outline-none ${
          disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"
        }`}
      />

      {/* PICKER */}
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setYear((y) => y - 1)}>
              «
            </button>
            <span className="text-sm font-medium">{year}</span>
            <button type="button" onClick={() => setYear((y) => y + 1)}>
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
                  className={`
                    py-2 rounded-lg transition
                    ${
                      value === formatted
                        ? "bg-violet-600 text-white"
                        : "hover:bg-neutral-100"
                    }
                    ${disabledMonth ? "text-neutral-400" : ""}
                  `}
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  // small SC2-style TextField wrapper classes (one-line)
  const scTextFieldClass =
    "w-full [&>label]:text-[12px] [&>label]:font-medium [&>p]:text-[11px] [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-9";

  const scInputClass =
    "rounded-full h-9 px-3 text-[12px] placeholder:text-[12px] bg-white !border-none focus:ring-0";

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

    const inputDate = new Date(yyyy, mm -1); // first day of that month
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

    // const startYearNum = Number(startDate.split("/")[1]);
    // const endYearNum = currentlyWorking
    //   ? new Date().getFullYear()
    //   : Number(endDate.split("/")[1]);

    // const duration = Math.max(0, endYearNum - startYearNum);

    // const payload = {
    //   workExperiences: [
    //     {
    //       jobTitle: toTitleCase(roleTitle.trim()),
    //       companyName: toTitleCase(company.trim()),
    //       startYear: startYearNum,
    //       endYear: currentlyWorking ? null : endYearNum,
    //       currentlyWorking,
    //       duration,
    //       description: description.trim() || "",
    //       typeOfRole: typeOfRole ? toTitleCase(typeOfRole.trim()) : undefined,
    //     },
    //   ],
    // };
    const [startMonthNum, startYearNum] = startDate.split("/").map(Number);

    // const [endMonthNum, endYearNum] = currentlyWorking
    //   ? [new Date().getMonth() + 1, new Date().getFullYear()]
    //   : endDate.split("/").map(Number);
    // const duration = calculateDurationInMonths(
    //   startMonthNum,
    //   startYearNum,
    //   endMonthNum,
    //   endYearNum,
    // );
    // const payload = {
    //   workExperiences: [
    //     {
    //       jobTitle: toTitleCase(roleTitle.trim()),
    //       companyName: toTitleCase(company.trim()),
    //       startYear: startYearNum,
    //       startMonth: startMonthNum,
    //       endYear: currentlyWorking ? null : endYearNum,
    //       endMonth: currentlyWorking ? null : endMonthNum,
    //       currentlyWorking,
    //       duration, // ✅ months only
    //       description: description.trim() || "",
    //       typeOfRole: typeOfRole ? toTitleCase(typeOfRole.trim()) : undefined,
    //     },
    //   ],
    // };
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
  workExperiences: [
    {
      jobTitle: toTitleCase(roleTitle.trim()),
      companyName: toTitleCase(company.trim()),
      startYear: startYearNum,
      startMonth: startMonthNum,

      // ✅ ALWAYS send numbers
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

      const created = res.data[0]; // backend returns array

      // setExperiences((prev) => [
      //   {
      //     id: created._id,
      //     roleTitle: created.jobTitle,
      //     typeOfRole: created.typeOfRole || undefined,
      //     company: created.companyName,
      //     startDate: `01/${created.startYear}`,
      //     endDate: created.currentlyWorking
      //       ? undefined
      //       : `01/${created.endYear}`,
      //     currentlyWorking: created.currentlyWorking,
      //     description: created.description || undefined,
      //   },
      //   ...prev,
      // ]);
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
      toast.error("Please add at least one experience.");
      return;
    }

    navigate("/certifications");
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


  return (
    <>
     <ToastContainer position="top-center" autoClose={3000} />
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-10 sm:py-22">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
        {/* Left card */}
        <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6 ...">
          {/* top row - back + progress */}
          <div className="flex items-center gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />
            <div className="flex-1 w-full max-w-full md:max-w-[420px]">
              <div className="flex items-center gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`p-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-violet-700"
                  />
                ))}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`n-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-neutral-300"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* header */}
          <div className="mt-6">
            <h2 className="text-[22px] text-neutral-900">
              Add your experience
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Internships, roles, and other work count toward your Experience
              Index
            </p>
          </div>

          {/* Selected experience preview list */}
          {/* Selected experience preview list */}
          <section className="mt-6 flex w-full flex-col gap-3">
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
                        square
                        className="!rounded-3xl shadow-sm bg-violet-200 text-violet-700"
                      >
                        {(exp.company || "")
                          .split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")}
                      </Avatar>

                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-neutral-900 truncate">
                          {exp.roleTitle}
                        </span>
                        <span className="text-xs text-neutral-500 truncate">
                          {exp.company}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <IconButton
                        size="small"
                        icon={<FeatherX />}
                        aria-label={`Delete experience ${exp.roleTitle}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(exp.id);
                        }}
                        className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
                      />

                      <span className="text-xs text-neutral-500">
                        {exp.startDate || "—"}
                        {exp.currentlyWorking
                          ? " - Present"
                          : exp.endDate
                            ? ` - ${exp.endDate}`
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
                          <span className="font-medium">Role:</span>{" "}
                          {exp.roleTitle}
                        </div>

                        <div>
                          <span className="font-medium">Type Of Roll:</span>{" "}
                          {exp.typeOfRole}
                        </div>

                        <div>
                          <span className="font-medium">Company:</span>{" "}
                          {exp.company}
                        </div>

                        <div>
                          <span className="font-medium">Duration:</span>{" "}
                          {exp.startDate || "—"}
                          {exp.currentlyWorking
                            ? " - Present"
                            : exp.endDate
                              ? ` - ${exp.endDate}`
                              : ""}
                        </div>

                        {exp.description && (
                          <div>
                            <span className="font-medium">Description:</span>{" "}
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

          {/* form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddExperience();
            }}
            className="mt-6 flex flex-col gap-4"
          >
            <TextField
              className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
              label={
                <span className="text-[12px]">
                  Role Title <span className="text-red-500">*</span>{" "}
                </span>
              }
              helpText=""
            >
              <TextField.Input
                // className="rounded-full h-10 px-4 text-[12px] bg-white !border-none focus:ring-0"
                className="h-20 text-[12px]"
                placeholder="Name of Role"
                value={roleTitle}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  setRoleTitle(ev.target.value)
                }
              />
            </TextField>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-900">
                Type of Role <span className="text-red-500">*</span>
              </label>

              <SubframeCore.DropdownMenu.Root>
                <SubframeCore.DropdownMenu.Trigger asChild>
                  <div className="flex h-9 items-center justify-between rounded-full border border-neutral-300 bg-white px-3 cursor-pointer">
                    <span
                      className={
                        typeOfRole
                          ? "text-neutral-900 text-[12px]"
                          : "text-neutral-400 text-[12px]"
                      }
                    >
                       {typeOfRole ? typeOfRoleLabel : "Select type of role"}
                    </span>
                    <FeatherChevronDown className="text-neutral-500" />
                  </div>
                </SubframeCore.DropdownMenu.Trigger>

                <SubframeCore.DropdownMenu.Portal>
  <SubframeCore.DropdownMenu.Content
    align="start"          
    sideOffset={4}
    className="bg-white rounded-2xl shadow-lg py-1 border border-neutral-300 min-w-[200px]"
  >
    {ROLE_TITLES.map((item) => (
      <SubframeCore.DropdownMenu.Item
        key={item.value}
        onSelect={() => setTypeOfRole(item.value)}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-neutral-100 outline-none"
      >
        {item.label}
      </SubframeCore.DropdownMenu.Item>
    ))}
  </SubframeCore.DropdownMenu.Content>
</SubframeCore.DropdownMenu.Portal>

              </SubframeCore.DropdownMenu.Root>
            </div>

            <TextField
              label={
                <span className="text-[12px]">
                  Company <span className="text-red-500">*</span>
                </span>
              }
              helpText=""
              className={`${scTextFieldClass}`}
            >
              <TextField.Input
                placeholder="Company name"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                }
                onBlur={() => setCompany(toTitleCase(company))}
                className={scInputClass}
              />
            </TextField>

            {/* // date------------------------- */}
            <div className="flex flex-col gap-6 max-w-lg">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startdate"
                    className="text-[12px] font-medium text-neutral-700"
                  >
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <MonthYearPicker value={startDate} onChange={setStartDate} />
                </div>

                <div>
                  <label
                    htmlFor="startdate"
                    className="text-[12px] font-medium text-neutral-700"
                  >
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <MonthYearPicker value={endDate} onChange={setEndDate} disabled={currentlyWorking} />
                </div>
              </div>

              {/* Switch */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={currentlyWorking}
                  onCheckedChange={setCurrentlyWorking}
                  className="
            h-5 w-9
            data-[state=checked]:bg-violet-700
            data-[state=unchecked]:bg-neutral-300
            [&>span]:h-4 [&>span]:w-3
            [&>span]:data-[state=checked]:translate-x-4
            [&>span]:data-[state=unchecked]:translate-x-0
          "
                />
                <span className="text-sm text-neutral-700">
                  I currently work here
                </span>
              </div>
            </div>

            <TextField
              label={<span className="text-[12px]">Description </span>}
              helpText=""
              className={`${scTextFieldClass}`}
            >
              <TextField.Input
                placeholder="Describe your key responsibilities and achievements"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setDescription(e.target.value);
                  }
                }}
                onBlur={() => setDescription(toSentenceCase(description))}
                className={scInputClass}
              />
            </TextField>

            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                disabled={isSubmitting}
                variant="neutral-secondary"
                icon={<FeatherPlus />}
                className="w-full rounded-full h-10 px-4 border-neutral-300"
                onClick={handleAddExperience}
              >
                {isSubmitting ? "Adding..." : "Add another experience"}
              </Button>

              <div className="flex-1" />
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

        {/* Right panel - SC2 style with Experience active */}
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
                className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3"
              >
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Demographics</span>
              </button>

              {/* ✔ Education — Completed */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Education</span>
              </div>

              {/* 🟣 Experience — Active */}
              <div className="flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
                  <IconWithBackground
                    size="small"
                    variant="neutral"
                    className="!bg-white !text-neutral-700"
                    icon={<FeatherBriefcase className="!text-neutral-700" />}
                  />
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  Experience
                </span>
              </div>

              {/* Certifications — Inactive */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  variant="neutral"
                  className="!bg-grey !text-neutral-600"
                  icon={<FeatherFileCheck />}
                />
                <span className="text-sm text-neutral-500">Certifications</span>
              </div>

              {/* Awards — Inactive */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  variant="neutral"
                  className="!bg-grey !text-neutral-600"
                  icon={<FeatherAward />}
                />
                <span className="text-sm text-neutral-500">Awards</span>
              </div>

              {/* Projects — Inactive */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2">
                <IconWithBackground
                  size="small"
                  variant="neutral"
                  className="!bg-grey !text-neutral-600"
                  icon={<FeatherPackage />}
                />
                <span className="text-sm text-neutral-500">Projects</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
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
              Do you really want to delete this experience?
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
  </>
  );
}
