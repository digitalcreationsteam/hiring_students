"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/components/Button";
import { Avatar } from "../ui/components/Avatar";
import HeaderLogo from "../ui/components/HeaderLogo";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
  FeatherEdit2,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "../common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

type ProjectEntry = {
  id: string;
  name: string;
  role: string;
  summary: string;
  outcome: string;
  link?: string;
  isDemo?: boolean;
};

const toTitleCase = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const toSentenceCase = (value: string) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const normalizeSpaces = (value: string) => value.replace(/\s+/g, " ").trim();

const URL_REGEX = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

const isValidUrl = (value: string) => {
  return URL_REGEX.test(value.trim());
};

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source; // "dashboard" | undefined
  const fromProfile = location.state?.fromProfile; // Check if came from profile

  console.log("PROJECT source:", source, "fromProfile:", fromProfile);

  const userId = localStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_PROJECTS = 5;

  // form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const [outcome, setOutcome] = useState("");
  const [link, setLink] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(
    null,
  );
  const [experienceIndex, setExperienceIndex] = useState<number | null>(null);
  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = !!editingId;

  type ExperiencePoints = {
    demographics?: number;
    education?: number;
    workExperience?: number;
    certifications?: number;
    awards?: number;
    projects?: number;
    total?: number;
  };

  const [experiencePoints, setExperiencePoints] =
    useState<ExperiencePoints | null>(null);

  const displayedIndex = experiencePoints?.total ?? 0;

  // stored projects (example)
  const [projects, setProjects] = useState<ProjectEntry[]>([
    {
      id: "example-1",
      name: "Mobile app redesign",
      role: "Product Manager",
      summary: "Redesigned onboarding and core flows",
      outcome: "Increased activation by 18%",
      link: undefined,
      isDemo: true,
    },
  ]);

  //GET
  const fetchProjects = async () => {
    if (!userId) return;

    try {
      const res = await API("GET", URL_PATH.getProjects, undefined, {
        "user-id": userId,
      });

      const apiProjects = res?.data || [];

      const mappedProjects = apiProjects.map((p: any) => ({
        id: p._id,
        name: p.projectName,
        role: p.role || "",
        summary: p.summary || "",
        outcome: p.outcome || "",
        link: p.link || undefined,
        isDemo: false,
      }));

      setProjects(mappedProjects.length ? mappedProjects : []);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

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

  //USE EFFECT
  useEffect(() => {
    fetchProjects();
    fetchExperienceIndex();
  }, []);

  const resetForm = () => {
    setName("");
    setRole("");
    setSummary("");
    setOutcome("");
    setLink("");
    setEditingId(null);
  };

  const handleAddProject = async () => {
    const realProjectsCount = projects.filter((p) => !p.isDemo).length;
    if (realProjectsCount >= MAX_PROJECTS) {
      toast.error("You can add a maximum of 5 projects only.");
      return;
    }
    if (isSubmitting) return;

    if (!name.trim()) {
      toast.error("Project name is required.");
      return false;
    }

    if (!role.trim()) {
      toast.error("Role is required.");
      return false;
    }

    if (!link.trim()) {
      toast.error("Project link is required.");
      return;
    }

    if (!isValidUrl(link)) {
      toast.error("Project link must be a valid URL (https://...)");
      return;
    }

    const normalizedName = toTitleCase(normalizeSpaces(name));

    const duplicate = projects.some(
      (p) => !p.isDemo && p.name === normalizedName,
    );

    if (duplicate) {
      toast.error("This project already exists.");
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "POST",
        URL_PATH.projects,
        {
          projects: [
            {
              projectName: toTitleCase(normalizeSpaces(name)),
              role: role ? toTitleCase(normalizeSpaces(role)) : null,
              summary: summary
                ? toSentenceCase(normalizeSpaces(summary.trim()))
                : null,
              outcome: outcome
                ? toSentenceCase(normalizeSpaces(outcome.trim()))
                : null,
              link: link ? normalizeSpaces(link) : null,
            },
          ],
        },
        { "user-id": userId },
      );
      toast.success("Project added successfully");

      await fetchProjects();
      await fetchExperienceIndex();
      resetForm();
      setSelectedProject(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- EDIT PROJECT --------------------
  const handleUpdateProject = async () => {
    if (!editingId || isSubmitting) return;

    if (!name.trim()) return toast.error("Project name is required.");
    if (!role.trim()) return toast.error("Role is required.");
    if (!link.trim()) return toast.error("Project link is required.");
    if (!isValidUrl(link))
      return toast.error("Project link must be a valid URL (https://...)");

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "PUT",
        `${URL_PATH.projects}/${editingId}`,
        {
          projectName: toTitleCase(normalizeSpaces(name)),
          role: role ? toTitleCase(normalizeSpaces(role)) : null,
          summary: summary
            ? toSentenceCase(normalizeSpaces(summary.trim()))
            : null,
          outcome: outcome
            ? toSentenceCase(normalizeSpaces(outcome.trim()))
            : null,
          link: link ? normalizeSpaces(link) : null,
        },
        { "user-id": userId },
      );

      toast.success("Project updated successfully");

      await fetchProjects();
      await fetchExperienceIndex();
      resetForm();
      setSelectedProject(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- DELETE PROJECT --------------------
  const handleRemove = async () => {
    if (!deleteProjectId || isSubmitting) return;

    // demo project → local delete
    if (deleteProjectId === "example-1") {
      setProjects((prev) => prev.filter((p) => p.id !== deleteProjectId));
      setDeleteProjectId(null);
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "POST",
        `${URL_PATH.deleteProject}/${deleteProjectId}`,
        undefined,
        { "user-id": userId },
      );

      setProjects((prev) => prev.filter((p) => p.id !== deleteProjectId));

      if (selectedProject?.id === deleteProjectId) {
        setSelectedProject(null);
      }

      await fetchExperienceIndex();
      setDeleteProjectId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRealProject = projects.some((p) => !p.isDemo);
  const canContinue = hasRealProject;

  const handleContinue = () => {
    if (!hasRealProject) {
      toast.error("Please add at least one project to continue.");
      return;
    }

    // If came from profile, go to dashboard, otherwise continue to next section
    if (fromProfile) {
      navigate("/dashboard");
    } else if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/skill-index-intro", { state: { source } });
    }
  };

  const handleBack = () => {
    if (fromProfile) {
      navigate("/profile"); // Go back to profile if came from there
    } else {
      navigate("/awards");
    }
  };

  const fillFormForEdit = (p: ProjectEntry) => {
    setEditingId(p.id);

    setName(p.name || "");
    setRole(p.role || "");
    setSummary(p.summary || "");
    setOutcome(p.outcome || "");
    setLink(p.link || "");

    setSelectedProject(p);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🎨 Enhanced gradient background with soft blur - matching awards */}
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
                  onClick={handleBack}
                  className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i <= 5
                            ? "bg-gradient-to-r from-gray-600 to-gray-800"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Step 6 of 6
                  </p>
                </div>
              </div>

              {/* Header with refined typography */}
              <header className="mb-8">
                <h2 className="text-2xl text-gray-800 font-light tracking-tight">
                  Add your
                  <span className="block font-semibold text-gray-900 mt-1">
                    Projects
                  </span>
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  Share your best work
                </p>
              </header>

              {/* Projects List with enhanced styling */}
              <section className="flex w-full flex-col gap-3 mb-8">
                {projects.map((p) => {
                  const isSelected = selectedProject?.id === p.id;

                  return (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedProject(isSelected ? null : p)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedProject(isSelected ? null : p);
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
                            {p.name
                              .split(" ")
                              .slice(0, 2)
                              .map((s) => s[0])
                              .join("")}
                          </Avatar>

                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-800 truncate">
                              {p.name}
                            </span>

                            {p.role && (
                              <span className="text-xs text-gray-500 truncate">
                                {p.role}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* ✅ Edit */}
                          <IconButton
                            size="small"
                            icon={<FeatherEdit2 className="w-3 h-3" />}
                            aria-label={`Edit project ${p.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (p.isDemo) {
                                toast.error("Demo project cannot be edited.");
                                return;
                              }
                              fillFormForEdit(p);
                            }}
                            className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                          />

                          {/* ✅ Delete */}
                          <IconButton
                            size="small"
                            icon={<FeatherX className="w-3 h-3" />}
                            aria-label={`Delete project ${p.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteProjectId(p.id);
                            }}
                            className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                          />
                        </div>
                      </div>

                      {/* 🔹 EXPANDED DETAILS */}
                      {isSelected && (
                        <>
                          <div className="my-4 border-t border-white/30" />

                          <div className="flex flex-col gap-2 text-sm text-gray-700 px-1">
                            <div>
                              <span className="font-medium text-gray-600">
                                Project name:
                              </span>{" "}
                              {p.name}
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">
                                Your Role:
                              </span>{" "}
                              {p.role}
                            </div>
                            {p.summary && (
                              <div>
                                <span className="font-medium text-gray-600">
                                  Summary:
                                </span>{" "}
                                {p.summary}
                              </div>
                            )}

                            {p.outcome && (
                              <div>
                                <span className="font-medium text-gray-600">
                                  Outcome:
                                </span>{" "}
                                {p.outcome}
                              </div>
                            )}

                            {p.link && (
                              <div>
                                <span className="font-medium text-gray-600">
                                  Project link:
                                </span>{" "}
                                <a
                                  href={p.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline transition hover:text-gray-900 break-all"
                                  style={{ color: colors.accent }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {p.link}
                                </a>
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
                  isEditing ? handleUpdateProject() : handleAddProject();
                }}
                className="flex flex-col gap-5"
              >
                {/* Project Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="e.g., Mobile app redesign"
                    value={name}
                    onChange={(ev) => setName(toTitleCase(ev.target.value))}
                  />
                </div>

                {/* Your Role */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="e.g., Product Manager"
                    value={role}
                    onChange={(ev) => setRole(toTitleCase(ev.target.value))}
                  />
                </div>

                {/* Link */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="https://"
                    value={link}
                    onChange={(e) => setLink(e.target.value.replace(/\s/g, ""))}
                    onBlur={() => {
                      if (!link) return;
                      if (!link.startsWith("http")) {
                        setLink("https://" + link);
                      }
                    }}
                  />
                </div>

                {/* Summary */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </label>
                  <textarea
                    className="w-full h-20 px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none resize-none"
                    placeholder="What was the project about?"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    onBlur={() => setSummary(toSentenceCase(summary))}
                  />
                </div>

                {/* Outcome */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outcome
                  </label>
                  <textarea
                    className="w-full h-20 px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none resize-none"
                    placeholder="What was the result or impact?"
                    value={outcome}
                    onChange={(ev) =>
                      setOutcome(toSentenceCase(ev.target.value))
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    variant="neutral-secondary"
                    icon={<FeatherPlus className="w-4 h-4" />}
                    className="w-full rounded-xl h-10 px-4 bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                    onClick={() =>
                      isEditing ? handleUpdateProject() : handleAddProject()
                    }
                  >
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update project"
                        : "Update and add another project"}
                  </Button>

                  {/* ✅ Cancel edit */}
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
                    background:
                      !canContinue || isSubmitting
                        ? "linear-gradient(135deg, #e0e0e0, #f0f0f0)"
                        : "linear-gradient(135deg, #2c3e50, #1e2a36)",
                    color: "#ffffff",
                    cursor:
                      !canContinue || isSubmitting ? "not-allowed" : "pointer",
                    boxShadow:
                      !canContinue || isSubmitting
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
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Progress steps
                </h4>

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

                  {/* Completed - Experience */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100">
                      <FeatherCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="flex-1 text-sm text-gray-600">
                      Experience
                    </span>
                    <span className="text-xs text-gray-400">3/6</span>
                  </button>

                  {/* Completed - Certifications */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100">
                      <FeatherCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="flex-1 text-sm text-gray-600">
                      Certifications
                    </span>
                    <span className="text-xs text-gray-400">4/6</span>
                  </button>

                  {/* Completed - Awards */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100">
                      <FeatherCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="flex-1 text-sm text-gray-600">Awards</span>
                    <span className="text-xs text-gray-400">5/6</span>
                  </button>

                  {/* Active - Projects */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(44,62,80,0.1), rgba(30,42,54,0.05))",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/80 shadow-sm">
                      <FeatherPackage className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      Projects
                    </span>
                    <span className="text-xs text-gray-400">6/6</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[360px] rounded-2xl p-6 shadow-xl bg-white/80 backdrop-blur-xl border border-white/40">
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.accent }}
              >
                Are you sure?
              </h3>
              <button
                onClick={() => setDeleteProjectId(null)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <p className="text-sm mb-6 text-gray-600">
              Do you really want to delete this project?
            </p>

            <div className="flex gap-3">
              {/* Cancel */}
              <Button
                className="flex-1 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                onClick={() => setDeleteProjectId(null)}
                style={{
                  color: colors.accent,
                }}
              >
                Cancel
              </Button>

              {/* Delete */}
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
