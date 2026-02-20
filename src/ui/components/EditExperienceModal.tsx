import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import API from "src/common/API";
import { URL_PATH } from "src/common/API";
import { uniTalentColors } from "src/common/Colors";

interface WorkExperience {
  _id?: string;
  jobTitle?: string;
  companyName?: string;
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  currentlyWorking?: boolean;
  description?: string;
  typeOfRole?: string;
  duration?: number;
}

interface EditExperienceModalProps {
  isOpen: boolean;
  experience: WorkExperience | null;
  onClose: () => void;
  onSave: (experience: WorkExperience) => Promise<void>;
  saveLoading?: boolean;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const ROLE_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Apprenticeship",
  "Volunteer",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);

const EMPTY_EXPERIENCE: WorkExperience = {
  jobTitle: "",
  companyName: "",
  startMonth: undefined,
  startYear: undefined,
  endMonth: undefined,
  endYear: undefined,
  currentlyWorking: false,
  description: "",
  typeOfRole: "",
};

const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  isOpen,
  experience,
  onClose,
  onSave,
  saveLoading = false,
}) => {
  const [form, setForm] = useState<WorkExperience>(EMPTY_EXPERIENCE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof WorkExperience, string>>
  >({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(experience ? { ...experience } : EMPTY_EXPERIENCE);
      setErrors({});
      setSaveError(null);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, experience]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "currentlyWorking" && checked
        ? { endMonth: undefined, endYear: undefined }
        : {}),
    }));

    if (errors[name as keyof WorkExperience]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof WorkExperience, string>> = {};
    if (!form.jobTitle?.trim()) newErrors.jobTitle = "Job title is required";
    if (!form.companyName?.trim())
      newErrors.companyName = "Company name is required";
    if (!form.startYear) newErrors.startYear = "Start year is required";
    if (!form.currentlyWorking && !form.endYear)
      newErrors.endYear = "End year is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaveError(null);
      await onSave(form);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save experience",
      );
    }
  };

  if (!isOpen) return null;

  const inputClass = `
    w-full px-4 py-3 rounded-xl border-2 bg-white/60 backdrop-blur-sm
    focus:outline-none focus:ring-2 transition-all duration-200 text-sm
  `;

  const labelClass = `block text-sm font-semibold mb-1.5 tracking-wide`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: animateIn ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
          backdropFilter: animateIn ? "blur(4px)" : "blur(0px)",
        }}
        onClick={handleClose}
      />

      {/* Slide-in Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out"
        style={{
          width: "min(560px, 100vw)",
          transform: animateIn ? "translateX(0)" : "translateX(100%)",
          background: `linear-gradient(160deg, #ffffff 0%, #f8f6ff 50%, #eff6ff 100%)`,
          borderLeft: `1px solid ${uniTalentColors.white}`,
        }}
      >
        {/* Decorative top bar */}
        <div
          className="h-1.5 w-full flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, ${uniTalentColors.primary}, ${uniTalentColors.secondary})`,
          }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5 flex-shrink-0 border-b"
          style={{ borderColor: `${uniTalentColors.lightGray}60` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${uniTalentColors.primary}20, ${uniTalentColors.secondary}20)`,
              }}
            >
              <Briefcase size={20} style={{ color: uniTalentColors.primary }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold leading-tight"
                style={{ color: uniTalentColors.text }}
              >
                {experience?._id ? "Edit Experience" : "Add Experience"}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: uniTalentColors.secondary }}
              >
                {experience?._id
                  ? "Update your work history"
                  : "Add a new work entry"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: `${uniTalentColors.lightGray}40`,
              color: uniTalentColors.secondary,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {saveError && (
            <div
              className="p-4 rounded-xl text-sm border"
              style={{
                backgroundColor: "#fef2f2",
                borderColor: "#fecaca",
                color: "#dc2626",
              }}
            >
              {saveError}
            </div>
          )}

          {/* Job Title */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <Briefcase
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Job Title{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle || ""}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              className={inputClass}
              style={{
                borderColor: errors.jobTitle
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
                outline: `1px solid ${uniTalentColors.primary}`,
              }}
            />
            {errors.jobTitle && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.jobTitle}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <Building2
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Company Name{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="companyName"
              value={form.companyName || ""}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft, Startup Inc."
              className={inputClass}
              style={{
                borderColor: errors.companyName
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.companyName && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.companyName}
              </p>
            )}
          </div>

          {/* Type of Role */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <FileText
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Type of Role
              </span>
            </label>
            <div className="relative">
              <select
                name="typeOfRole"
                value={form.typeOfRole || ""}
                onChange={handleChange}
                className={inputClass + " appearance-none pr-10 cursor-pointer"}
                style={{
                  borderColor: `${uniTalentColors.lightGray}80`,
                  color: form.typeOfRole
                    ? uniTalentColors.text
                    : uniTalentColors.secondary,
                }}
              >
                <option value="">Select role type</option>
                {ROLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: uniTalentColors.secondary }}
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <Calendar
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Start Date{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <select
                  name="startMonth"
                  value={form.startMonth || ""}
                  onChange={handleChange}
                  className={
                    inputClass + " appearance-none pr-8 cursor-pointer"
                  }
                  style={{
                    borderColor: `${uniTalentColors.lightGray}80`,
                    color: form.startMonth
                      ? uniTalentColors.text
                      : uniTalentColors.secondary,
                  }}
                >
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: uniTalentColors.secondary }}
                />
              </div>
              <div className="relative">
                <select
                  name="startYear"
                  value={form.startYear || ""}
                  onChange={handleChange}
                  className={
                    inputClass + " appearance-none pr-8 cursor-pointer"
                  }
                  style={{
                    borderColor: errors.startYear
                      ? "#fca5a5"
                      : `${uniTalentColors.lightGray}80`,
                    color: form.startYear
                      ? uniTalentColors.text
                      : uniTalentColors.secondary,
                  }}
                >
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: uniTalentColors.secondary }}
                />
              </div>
            </div>
            {errors.startYear && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.startYear}
              </p>
            )}
          </div>

          {/* Currently Working Toggle */}
          <div
            className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: form.currentlyWorking
                ? `${uniTalentColors.primary}12`
                : `${uniTalentColors.lightGray}30`,
              border: `1.5px solid ${form.currentlyWorking ? uniTalentColors.primary + "40" : "transparent"}`,
            }}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                currentlyWorking: !prev.currentlyWorking,
                ...(!prev.currentlyWorking
                  ? { endMonth: undefined, endYear: undefined }
                  : {}),
              }))
            }
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: uniTalentColors.text }}
              >
                I currently work here
              </p>
            </div>
            <div
              className="w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
              style={{
                backgroundColor: form.currentlyWorking
                  ? uniTalentColors.primary
                  : `${uniTalentColors.primary}80`,
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                style={{
                  left: form.currentlyWorking ? "calc(100% - 20px)" : "4px",
                }}
              />
            </div>
          </div>

          {/* End Date */}
          {!form.currentlyWorking && (
            <div>
              <label
                className={labelClass}
                style={{ color: uniTalentColors.text }}
              >
                <span className="flex items-center gap-2">
                  <Calendar
                    size={14}
                    style={{ color: uniTalentColors.primary }}
                  />
                  End Date{" "}
                  <span style={{ color: uniTalentColors.primary }}>*</span>
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    name="endMonth"
                    value={form.endMonth || ""}
                    onChange={handleChange}
                    className={
                      inputClass + " appearance-none pr-8 cursor-pointer"
                    }
                    style={{
                      borderColor: `${uniTalentColors.lightGray}80`,
                      color: form.endMonth
                        ? uniTalentColors.text
                        : uniTalentColors.secondary,
                    }}
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: uniTalentColors.secondary }}
                  />
                </div>
                <div className="relative">
                  <select
                    name="endYear"
                    value={form.endYear || ""}
                    onChange={handleChange}
                    className={
                      inputClass + " appearance-none pr-8 cursor-pointer"
                    }
                    style={{
                      borderColor: errors.endYear
                        ? "#fca5a5"
                        : `${uniTalentColors.lightGray}80`,
                      color: form.endYear
                        ? uniTalentColors.text
                        : uniTalentColors.secondary,
                    }}
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: uniTalentColors.secondary }}
                  />
                </div>
              </div>
              {errors.endYear && (
                <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                  {errors.endYear}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <FileText
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Description
              </span>
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your responsibilities, achievements, and impact..."
              className={inputClass + " resize-none"}
              style={{
                borderColor: `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            <p
              className="text-xs mt-1 text-right"
              style={{ color: uniTalentColors.secondary }}
            >
              {(form.description || "").length} characters
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-7 py-5 flex-shrink-0 border-t flex gap-3"
          style={{ borderColor: `${uniTalentColors.lightGray}60` }}
        >
          <button
            onClick={handleSubmit}
            disabled={saveLoading}
            className="flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${uniTalentColors.primary}, ${uniTalentColors.secondary})`,
              color: "white",
            }}
          >
            {saveLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {experience?._id ? "Update Experience" : "Add Experience"}
              </>
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={saveLoading}
            className="px-6 h-12 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: `${uniTalentColors.lightGray}40`,
              color: uniTalentColors.secondary,
              border: `1.5px solid ${uniTalentColors.lightGray}60`,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default EditExperienceModal;
