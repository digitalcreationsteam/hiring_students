import React, { useState, useEffect } from "react";
import { X, Save, Award, FileText, Calendar, ChevronDown } from "lucide-react";
import { uniTalentColors } from "src/common/Colors";

interface AwardType {
  _id?: string;
  awardName: string;
  description?: string;
  year: number;
}

interface EditAwardModalProps {
  isOpen: boolean;
  award: AwardType | null;
  onClose: () => void;
  onSave: (award: AwardType) => Promise<void>;
  saveLoading?: boolean;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);

const EMPTY: AwardType = {
  awardName: "",
  description: "",
  year: currentYear,
};

const EditAwardModal: React.FC<EditAwardModalProps> = ({
  isOpen,
  award,
  onClose,
  onSave,
  saveLoading = false,
}) => {
  const [form, setForm] = useState<AwardType>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AwardType, string>>
  >({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(award ? { ...award } : EMPTY);
      setErrors({});
      setSaveError(null);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, award]);

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
    setForm((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }));
    if (errors[name as keyof AwardType]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AwardType, string>> = {};
    if (!form.awardName?.trim()) newErrors.awardName = "Award name is required";
    if (!form.year) newErrors.year = "Year is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaveError(null);
      await onSave(form);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save award");
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
            "linear-gradient(160deg, #ffffff 0%, #fff7ed 50%, #ffedd5 100%)",
          borderLeft: `1px solid ${uniTalentColors.white}`,
        }}
      >
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
              <Award size={20} style={{ color: uniTalentColors.primary }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold leading-tight"
                style={{ color: uniTalentColors.text }}
              >
                {award?._id ? "Edit Award" : "Add Award"}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: uniTalentColors.secondary }}
              >
                {award?._id
                  ? "Update your award details"
                  : "Add a new award or achievement"}
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

          {/* Award Name */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <Award size={14} style={{ color: uniTalentColors.primary }} />
                Award Name{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="awardName"
              value={form.awardName}
              onChange={handleChange}
              placeholder="e.g. Employee of the Year, Best Innovation Award"
              className={inputClass}
              style={{
                borderColor: errors.awardName
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.awardName && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.awardName}
              </p>
            )}
          </div>

          {/* Year */}
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
                Year <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <div className="relative">
              <select
                name="year"
                value={form.year || ""}
                onChange={handleChange}
                className={inputClass + " appearance-none pr-10 cursor-pointer"}
                style={{
                  borderColor: errors.year
                    ? "#fca5a5"
                    : `${uniTalentColors.lightGray}80`,
                  color: form.year
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
            {errors.year && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.year}
              </p>
            )}
          </div>

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
              placeholder="Describe what this award is for, who gave it, and why it matters..."
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
                {award?._id ? "Update Award" : "Add Award"}
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

export default EditAwardModal;
