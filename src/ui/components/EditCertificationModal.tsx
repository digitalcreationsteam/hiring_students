import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  FileCheck,
  Building2,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import { uniTalentColors } from "src/common/Colors";

interface Certification {
  _id?: string;
  certificationName: string;
  issuer: string;
  issueDate: string;
  credentialLink?: string;
}

interface EditCertificationModalProps {
  isOpen: boolean;
  certification: Certification | null;
  onClose: () => void;
  onSave: (certification: Certification) => Promise<void>;
  saveLoading?: boolean;
}

const EMPTY: Certification = {
  certificationName: "",
  issuer: "",
  issueDate: "",
  credentialLink: "",
};

const EditCertificationModal: React.FC<EditCertificationModalProps> = ({
  isOpen,
  certification,
  onClose,
  onSave,
  saveLoading = false,
}) => {
  const [form, setForm] = useState<Certification>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Certification, string>>
  >({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(certification ? { ...certification } : EMPTY);
      setErrors({});
      setSaveError(null);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, certification]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Certification]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Certification, string>> = {};
    if (!form.certificationName?.trim())
      newErrors.certificationName = "Certification name is required";
    if (!form.issuer?.trim()) newErrors.issuer = "Issuer is required";
    if (!form.issueDate?.trim()) newErrors.issueDate = "Issue date is required";
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
        err instanceof Error ? err.message : "Failed to save certification",
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
            "linear-gradient(160deg, #ffffff 0%, #fefce8 50%, #fef9c3 100%)",
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
              <FileCheck size={20} style={{ color: uniTalentColors.primary }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold leading-tight"
                style={{ color: uniTalentColors.text }}
              >
                {certification?._id
                  ? "Edit Certification"
                  : "Add Certification"}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: uniTalentColors.secondary }}
              >
                {certification?._id
                  ? "Update your certification details"
                  : "Add a new certification"}
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

          {/* Certification Name */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <FileCheck
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Certification Name{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="certificationName"
              value={form.certificationName}
              onChange={handleChange}
              placeholder="e.g. AWS Certified Solutions Architect"
              className={inputClass}
              style={{
                borderColor: errors.certificationName
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.certificationName && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.certificationName}
              </p>
            )}
          </div>

          {/* Issuer */}
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
                Issuing Organization{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="issuer"
              value={form.issuer}
              onChange={handleChange}
              placeholder="e.g. Amazon Web Services, Google, Coursera"
              className={inputClass}
              style={{
                borderColor: errors.issuer
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.issuer && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.issuer}
              </p>
            )}
          </div>

          {/* Issue Date */}
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
                Issue Date{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              className={inputClass}
              style={{
                borderColor: errors.issueDate
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.issueDate && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.issueDate}
              </p>
            )}
          </div>

          {/* Credential Link */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <LinkIcon
                  size={14}
                  style={{ color: uniTalentColors.primary }}
                />
                Credential Link
              </span>
            </label>
            <input
              type="url"
              name="credentialLink"
              value={form.credentialLink || ""}
              onChange={handleChange}
              placeholder="https://www.credential.net/..."
              className={inputClass}
              style={{
                borderColor: `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            <p
              className="text-xs mt-1.5"
              style={{ color: uniTalentColors.secondary }}
            >
              Optional: Add a link to verify your credential
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
                {certification?._id
                  ? "Update Certification"
                  : "Add Certification"}
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

export default EditCertificationModal;
