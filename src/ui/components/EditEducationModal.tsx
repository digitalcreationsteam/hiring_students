import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  BookOpen,
  GraduationCap,
  Calendar,
  Hash,
  ChevronDown,
} from "lucide-react";
import { uniTalentColors } from "src/common/Colors";

interface Education {
  _id?: string;
  degree?: string;
  fieldOfStudy?: string;
  schoolName?: string;
  startYear?: number;
  endYear?: number;
  currentlyStudying?: boolean;
  gpa?: string;
  cgpa?: string;
}

interface EditEducationModalProps {
  isOpen: boolean;
  education: Education | null;
  onClose: () => void;
  onSave: (education: Education) => Promise<void>;
  saveLoading?: boolean;
}

const DEGREES = [
  "High School Diploma",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "Ph.D.",
  "M.D.",
  "J.D.",
  "B.Tech",
  "M.Tech",
  "Diploma",
  "Certificate",
  "Other",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => currentYear + 6 - i);

const EMPTY: Education = {
  degree: "",
  fieldOfStudy: "",
  schoolName: "",
  startYear: undefined,
  endYear: undefined,
  currentlyStudying: false,
  gpa: "",
  cgpa: "",
};

const EditEducationModal: React.FC<EditEducationModalProps> = ({
  isOpen,
  education,
  onClose,
  onSave,
  saveLoading = false,
}) => {
  const [form, setForm] = useState<Education>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Education, string>>
  >({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(education ? { ...education } : EMPTY);
      setErrors({});
      setSaveError(null);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, education]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Education]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Education, string>> = {};
    if (!form.degree?.trim()) newErrors.degree = "Degree is required";
    if (!form.schoolName?.trim())
      newErrors.schoolName = "School name is required";
    if (!form.startYear) newErrors.startYear = "Start year is required";
    if (!form.currentlyStudying && !form.endYear)
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
        err instanceof Error ? err.message : "Failed to save education",
      );
    }
  };

  if (!isOpen) return null;

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 bg-white/60 backdrop-blur-sm focus:outline-none transition-all duration-200 text-sm`;
  const labelClass = `block text-sm font-semibold mb-1.5 tracking-wide`;

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: animateIn ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
          backdropFilter: animateIn ? "blur(4px)" : "blur(0px)",
        }}
        onClick={handleClose}
      />

      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out"
        style={{
          width: "min(560px, 100vw)",
          transform: animateIn ? "translateX(0)" : "translateX(100%)",
          background:
            "linear-gradient(160deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)",
          borderLeft: `1px solid ${uniTalentColors.white}`,
        }}
      >
        {/* Top accent bar */}
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
              <BookOpen size={20} style={{ color: uniTalentColors.primary }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold leading-tight"
                style={{ color: uniTalentColors.text }}
              >
                {education?._id ? "Edit Education" : "Add Education"}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: uniTalentColors.secondary }}
              >
                {education?._id
                  ? "Update your academic background"
                  : "Add a new education entry"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
            style={{
              backgroundColor: `${uniTalentColors.lightGray}40`,
              color: uniTalentColors.secondary,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
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

          {/* Degree */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <GraduationCap
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Degree <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <div className="relative">
              <select
                name="degree"
                value={form.degree || ""}
                onChange={handleChange}
                className={inputClass + " appearance-none pr-10 cursor-pointer"}
                style={{
                  borderColor: errors.degree
                    ? "#fca5a5"
                    : `${uniTalentColors.lightGray}80`,
                  color: form.degree
                    ? uniTalentColors.text
                    : uniTalentColors.secondary,
                }}
              >
                <option value="">Select degree</option>
                {DEGREES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: uniTalentColors.secondary }}
              />
            </div>
            {errors.degree && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.degree}
              </p>
            )}
          </div>

          {/* Field of Study */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <BookOpen
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Field of Study
              </span>
            </label>
            <input
              type="text"
              name="fieldOfStudy"
              value={form.fieldOfStudy || ""}
              onChange={handleChange}
              placeholder="e.g. Computer Science, Business Administration"
              className={inputClass}
              style={{
                borderColor: `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
          </div>

          {/* School Name */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <GraduationCap
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                School / University{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="schoolName"
              value={form.schoolName || ""}
              onChange={handleChange}
              placeholder="e.g. MIT, Harvard University"
              className={inputClass}
              style={{
                borderColor: errors.schoolName
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.schoolName && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.schoolName}
              </p>
            )}
          </div>

          {/* Start Year */}
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
                Start Year{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <div className="relative">
              <select
                name="startYear"
                value={form.startYear || ""}
                onChange={handleChange}
                className={inputClass + " appearance-none pr-10 cursor-pointer"}
                style={{
                  borderColor: errors.startYear
                    ? "#fca5a5"
                    : `${uniTalentColors.lightGray}80`,
                  color: form.startYear
                    ? uniTalentColors.text
                    : uniTalentColors.secondary,
                }}
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: uniTalentColors.secondary }}
              />
            </div>
            {errors.startYear && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.startYear}
              </p>
            )}
          </div>

          {/* Currently Studying Toggle */}
          <div
            className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: form.currentlyStudying
                ? `${uniTalentColors.primary}12`
                : `${uniTalentColors.lightGray}30`,
              border: `1.5px solid ${form.currentlyStudying ? uniTalentColors.primary + "40" : "transparent"}`,
            }}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                currentlyStudying: !prev.currentlyStudying,
                ...(!prev.currentlyStudying ? { endYear: undefined } : {}),
              }))
            }
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: uniTalentColors.text }}
              >
                I currently study here
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: uniTalentColors.secondary }}
              >
                Toggle if this is your current institution
              </p>
            </div>
            <div
              className="w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
              style={{
                backgroundColor: form.currentlyStudying
                  ? uniTalentColors.primary
                  : `${uniTalentColors.lightGray}80`,
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                style={{
                  left: form.currentlyStudying ? "calc(100% - 20px)" : "4px",
                }}
              />
            </div>
          </div>

          {/* End Year */}
          {!form.currentlyStudying && (
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
                  End Year{" "}
                  <span style={{ color: uniTalentColors.primary }}>*</span>
                </span>
              </label>
              <div className="relative">
                <select
                  name="endYear"
                  value={form.endYear || ""}
                  onChange={handleChange}
                  className={
                    inputClass + " appearance-none pr-10 cursor-pointer"
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
                  <option value="">Select year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: uniTalentColors.secondary }}
                />
              </div>
              {errors.endYear && (
                <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                  {errors.endYear}
                </p>
              )}
            </div>
          )}

          {/* GPA / CGPA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={labelClass}
                style={{ color: uniTalentColors.text }}
              >
                <span className="flex items-center gap-2">
                  <Hash size={14} style={{ color: uniTalentColors.primary }} />
                  GPA
                </span>
              </label>
              <input
                type="text"
                name="gpa"
                value={form.gpa || ""}
                onChange={handleChange}
                placeholder="e.g. 3.8 / 4.0"
                className={inputClass}
                style={{
                  borderColor: `${uniTalentColors.lightGray}80`,
                  color: uniTalentColors.text,
                }}
              />
            </div>
            <div>
              <label
                className={labelClass}
                style={{ color: uniTalentColors.text }}
              >
                <span className="flex items-center gap-2">
                  <Hash size={14} style={{ color: uniTalentColors.primary }} />
                  CGPA
                </span>
              </label>
              <input
                type="text"
                name="cgpa"
                value={form.cgpa || ""}
                onChange={handleChange}
                placeholder="e.g. 8.5 / 10"
                className={inputClass}
                style={{
                  borderColor: `${uniTalentColors.lightGray}80`,
                  color: uniTalentColors.text,
                }}
              />
            </div>
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
            className="flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${uniTalentColors.primary}, ${uniTalentColors.secondary})`,
              color: "white",
            }}
          >
            {saveLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {education?._id ? "Update Education" : "Add Education"}
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

export default EditEducationModal;
