// src/components/Experience.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  const [, year] = value.split("/").map(Number);
  const currentYear = new Date().getFullYear();

  return year >= 1950 && year <= currentYear + 1;
};

const isEndAfterStart = (start: string, end: string) => {
  const [sm, sy] = start.split("/").map(Number);
  const [em, ey] = end.split("/").map(Number);

  return ey > sy || (ey === sy && em >= sm);
};

export default function Experience() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // form state
  const [roleTitle, setRoleTitle] = useState("");
  const [typeOfRole, setTypeOfRole] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [description, setDescription] = useState("");

  // stored entries
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);

  // small SC2-style TextField wrapper classes (one-line)
  const scTextFieldClass =
    "w-full [&>label]:text-[12px] [&>label]:font-medium [&>p]:text-[11px] [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-9";

  const scInputClass =
    "rounded-full h-9 px-3 text-[12px] placeholder:text-[12px] bg-white !border-none focus:ring-0";

  const isAddable = () => {
    if (!roleTitle.trim()) {
      alert("Role title is required.");
      return false;
    }

    if (!isValidText(roleTitle)) {
      alert("Role title must contain only letters and valid symbols.");
      return false;
    }

    if (typeOfRole.trim() && !isValidText(typeOfRole)) {
      alert("Type of role must contain only letters and valid symbols.");
      return false;
    }

    if (!company.trim()) {
      alert("Company name is required.");
      return false;
    }

    if (!isValidText(company)) {
      alert("Company name must contain only letters and valid symbols.");
      return false;
    }

    // Date validations (already implemented)
    if (!isValidMonthYear(startDate)) {
      alert("Start date must be in MM/YYYY format.");
      return false;
    }

    if (!isValidPastOrCurrentDate(startDate)) {
      alert("Start date cannot be in the future.");
      return false;
    }

    if (!currentlyWorking) {
      if (!isValidMonthYear(endDate)) {
        alert("End date must be in MM/YYYY format.");
        return false;
      }

      if (!isValidPastOrCurrentDate(endDate)) {
        alert("End date cannot be in the future.");
        return false;
      }

      if (!isEndAfterStart(startDate, endDate)) {
        alert("End date must be after start date.");
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
  };

  const handleAddExperience = async () => {
    if (!isAddable()) return;

    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const startYearNum = Number(startDate.split("/")[1]);
    const endYearNum = currentlyWorking
      ? new Date().getFullYear()
      : Number(endDate.split("/")[1]);

    const duration = Math.max(0, endYearNum - startYearNum);

    const payload = {
      workExperiences: [
        {
          jobTitle: toTitleCase(roleTitle.trim()),
          companyName: toTitleCase(company.trim()),
          startYear: startYearNum,
          endYear: currentlyWorking ? null : endYearNum,
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

      const created = res.data[0];

      setExperiences((prev) => [
        {
          id: res.data._id,
          roleTitle: res.data.jobTitle,
          company: res.data.companyName,
          startDate: `01/${res.data.startYear}`,
          endDate: res.data.currentlyWorking
            ? undefined
            : `01/${res.data.endYear}`,
          currentlyWorking: res.data.currentlyWorking,
          description: res.data.description || undefined,
        },
        ...prev,
      ]);

      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      alert(err?.message || "Failed to add experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE EXPERIENCE
  const handleRemove = async () => {
    if (!deleteId) return;

    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "DELETE",
        `${URL_PATH.deleteExperience}/${deleteId}`,
        undefined,
        { "user-id": userId }
      );

      setExperiences((prev) => prev.filter((e) => e.id !== deleteId));
      await fetchExperienceIndex();
      setDeleteId(null);
    } catch (err: any) {
      alert(err?.message || "Failed to delete experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  // GET

  const fetchExperiences = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API(
        "GET",
        URL_PATH.getExperience,
        undefined,
        { "user-id": userId }
      );

      const apiExperiences = res?.data ?? [];

      const mapped: ExperienceEntry[] = apiExperiences.map((e: any) => ({
        id: e._id,
        roleTitle: typeof e.jobTitle === "string" ? e.jobTitle : "",
        company: typeof e.companyName === "string" ? e.companyName : "",
        startDate: e.startYear ? `01/${e.startYear}` : "",
        endDate: e.currentlyWorking
          ? undefined
          : e.endYear
          ? `01/${e.endYear}`
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
        { "user-id": userId }
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
      alert("Please add at least one experience.");
      return;
    }

    navigate("/certifications");
  };

  useEffect(() => {
    if (!userId) return;

    fetchExperiences();
    fetchExperienceIndex();
  }, [userId, fetchExperiences, fetchExperienceIndex]);

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-20 sm:py-32">
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
          <section className="mt-6 flex flex-col gap-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex w-full flex-col items-start gap-3 rounded-3xl border border-neutral-300 bg-neutral-50 px-4 py-4"
              >
                <div className="flex w-full items-center justify-between">
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="large"
                      square
                      image="https://res.cloudinary.com/subframe/image/upload/v1711417525/shared/elkoy8wipvhulayviq7t.png"
                      className="!rounded-2xl shadow-sm"
                    >
                      {(exp.company || "")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </Avatar>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-neutral-900">
                        {exp.roleTitle}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {exp.company}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <IconButton
                      size="small"
                      icon={<FeatherX />}
                      onClick={() => setDeleteId(exp.id)}
                      className="!bg-transparent !text-neutral-500"
                    />

                    <span className="text-xs text-neutral-500">
                      {exp.startDate || "—"}{" "}
                      {exp.currentlyWorking
                        ? " - Present"
                        : exp.endDate
                        ? ` - ${exp.endDate}`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
              label={<span className="text-[12px]">Role Title * </span>}
              helpText=""
              className={`${scTextFieldClass}`}
            >
              <TextField.Input
                placeholder="e.g., Product Manager"
                value={roleTitle}
                onChange={(e) =>
                  setRoleTitle(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                }
                onBlur={() => setRoleTitle(toTitleCase(roleTitle))}
                className={scInputClass}
              />
            </TextField>

            <TextField
              label={<span className="text-[12px]">Type of Role </span>}
              helpText={<span className="text-[12px]">e.g., Internship, Full Time, Contract" </span>}
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="e.g., Internship, Full Time"
                value={typeOfRole}
                onChange={(e) =>
                  setTypeOfRole(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                }
                onBlur={() => setTypeOfRole(toTitleCase(typeOfRole))}
                className={scInputClass}
              />
            </TextField>

            <TextField
              label={<span className="text-[12px]">Company * </span>}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={<span className="text-[12px]">Start Date * </span>}
                helpText=""
                className="[&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 flex-1"
              >
                <TextField.Input
                  placeholder="MM/YYYY"
                  value={startDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d]/g, "");

                    if (value.length >= 2) {
                      const month = value.slice(0, 2);
                      const year = value.slice(2, 6);
                      value = month + (year ? "/" + year : "");
                    }

                    setStartDate(value.slice(0, 7));
                  }}
                  onBlur={() => {
                    if (!startDate) return;

                    if (!isValidMonthYear(startDate)) {
                      alert("Invalid date format. Use MM/YYYY");
                      setStartDate("");
                      return;
                    }

                    if (!isValidPastOrCurrentDate(startDate)) {
                      alert("Start date cannot be in the future.");
                      setStartDate("");
                    }
                  }}
                  className={scInputClass}
                />
              </TextField>

              <TextField
                label={<span className="text-[12px]">End Date </span>}
                helpText=""
                className="[&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 flex-1"
              >
                <TextField.Input
                  placeholder="MM/YYYY"
                  value={endDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d]/g, "");

                    if (value.length >= 2) {
                      const month = value.slice(0, 2);
                      const year = value.slice(2, 6);
                      value = month + (year ? "/" + year : "");
                    }

                    setEndDate(value.slice(0, 7));
                  }}
                  onBlur={() => {
                    if (!endDate || currentlyWorking) return;

                    if (!isValidMonthYear(endDate)) {
                      alert("Invalid date format. Use MM/YYYY");
                      setEndDate("");
                      return;
                    }

                    if (!isValidPastOrCurrentDate(endDate)) {
                      alert("End date cannot be in the future.");
                      setEndDate("");
                      return;
                    }

                    if (!isEndAfterStart(startDate, endDate)) {
                      alert("End date must be after start date.");
                      setEndDate("");
                    }
                  }}
                  disabled={currentlyWorking}
                  className={`${scInputClass} ${
                    currentlyWorking ? "bg-neutral-100/50 !border-none" : ""
                  }`}
                />
              </TextField>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={currentlyWorking}
                onCheckedChange={setCurrentlyWorking}
                tabIndex={0}
                role="switch"
                aria-checked={currentlyWorking}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCurrentlyWorking((prev) => !prev);
                  }
                }}
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

            <TextField
              label={<span className="text-[12px]">Description  </span>}
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
  );
}
