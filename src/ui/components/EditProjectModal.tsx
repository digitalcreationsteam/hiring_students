import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Package,
  User,
  FileText,
  Link as LinkIcon,
  Target,
} from "lucide-react";
import { uniTalentColors } from "src/common/Colors";

interface Project {
  _id?: string;
  projectName: string;
  role: string;
  summary?: string;
  outcome?: string;
  link?: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => Promise<void>;
  saveLoading?: boolean;
}

const EMPTY: Project = {
  projectName: "",
  role: "",
  summary: "",
  outcome: "",
  link: "",
};

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
  saveLoading = false,
}) => {
  const [form, setForm] = useState<Project>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Project, string>>>(
    {},
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(project ? { ...project } : EMPTY);
      setErrors({});
      setSaveError(null);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, project]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Project]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Project, string>> = {};
    if (!form.projectName?.trim())
      newErrors.projectName = "Project name is required";
    if (!form.role?.trim()) newErrors.role = "Your role is required";
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
        err instanceof Error ? err.message : "Failed to save project",
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
            "linear-gradient(160deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)",
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
              <Package size={20} style={{ color: uniTalentColors.primary }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold leading-tight"
                style={{ color: uniTalentColors.text }}
              >
                {project?._id ? "Edit Project" : "Add Project"}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: uniTalentColors.secondary }}
              >
                {project?._id
                  ? "Update your project details"
                  : "Showcase a new project"}
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

          {/* Project Name */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <Package size={14} style={{ color: uniTalentColors.primary }} />
                Project Name{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              placeholder="e.g. E-Commerce Platform, AI Chatbot"
              className={inputClass}
              style={{
                borderColor: errors.projectName
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.projectName && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.projectName}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <User size={14} style={{ color: uniTalentColors.primary }} />
                Your Role{" "}
                <span style={{ color: uniTalentColors.primary }}>*</span>
              </span>
            </label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Lead Developer, UI Designer, Project Manager"
              className={inputClass}
              style={{
                borderColor: errors.role
                  ? "#fca5a5"
                  : `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            {errors.role && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {errors.role}
              </p>
            )}
          </div>

          {/* Project Link */}
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
                Project Link
              </span>
            </label>
            <input
              type="url"
              name="link"
              value={form.link || ""}
              onChange={handleChange}
              placeholder="https://github.com/... or https://yourproject.com"
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
              Optional: GitHub, live demo, or any relevant link
            </p>
          </div>

          {/* Summary */}
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
                Project Summary
              </span>
            </label>
            <textarea
              name="summary"
              value={form.summary || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what this project does, the tech stack used, and your contributions..."
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
              {(form.summary || "").length} characters
            </p>
          </div>

          {/* Outcome */}
          <div>
            <label
              className={labelClass}
              style={{ color: uniTalentColors.text }}
            >
              <span className="flex items-center gap-2">
                <Target size={14} style={{ color: uniTalentColors.primary }} />
                Outcome / Impact
              </span>
            </label>
            <textarea
              name="outcome"
              value={form.outcome || ""}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Reduced load time by 40%, increased user retention by 25%..."
              className={inputClass + " resize-none"}
              style={{
                borderColor: `${uniTalentColors.lightGray}80`,
                color: uniTalentColors.text,
              }}
            />
            <p
              className="text-xs mt-1.5"
              style={{ color: uniTalentColors.secondary }}
            >
              Optional: Highlight measurable results or impact
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
                {project?._id ? "Update Project" : "Add Project"}
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

export default EditProjectModal;
