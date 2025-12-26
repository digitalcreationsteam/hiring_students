// src/components/Projects.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";

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
  const userId = localStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const [outcome, setOutcome] = useState("");
  const [link, setLink] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(
    null
  );
  const [experienceIndex, setExperienceIndex] = useState<number | null>(null);
  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
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
      const res = await API("GET", URL_PATH.getProjects, undefined, undefined, {
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

  //USE EFFECT
  useEffect(() => {
    fetchProjects();
    fetchExperienceIndex();
  }, []);

  // SC2 small textfield classes
  const scTextFieldClass =
    "w-full [&>label]:text-[12px] [&>label]:font-medium " +
    "[&>p]:text-[11px] [&>div]:rounded-full [&>div]:border " +
    "[&>div]:border-neutral-300 [&>div]:h-9";

  const scInputClass =
    "rounded-full h-9 px-3 text-[12px] placeholder:text-[12px] " +
    "bg-white !border-none focus:ring-0 w-full";

  const resetForm = () => {
    setName("");
    setRole("");
    setSummary("");
    setOutcome("");
    setLink("");
  };

  const handleAddProject = async () => {
    if (isSubmitting) return;

    if (!name.trim() || !summary.trim()) {
      alert("Project name and summary are required.");
      return;
    }
    const normalizedName = toTitleCase(normalizeSpaces(name));

    const duplicate = projects.some(
      (p) => !p.isDemo && p.name === normalizedName
    );

    if (duplicate) {
      alert("This project already exists.");
      return;
    }

    if (link.trim() && !isValidUrl(link)) {
      alert("Project link must be a valid URL (https://...)");
      return;
    }

    if (!userId) {
      alert("Session expired. Please login again.");
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

        summary: toSentenceCase(normalizeSpaces(summary.trim())),
        outcome: outcome
          ? toSentenceCase(normalizeSpaces(outcome.trim()))
          : null,

        link: link ? normalizeSpaces(link) : null,
      },
    ],
  },
  undefined,
  { "user-id": userId }
);

      await fetchProjects();
      await fetchExperienceIndex();
      resetForm();
      setSelectedProject(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to add project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- DELETE PROJECT --------------------
  const handleRemove = async (id: string) => {
    // demo item → local delete only
    if (id === "example-1") {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      setIsSubmitting(true);

      await API(
        "DELETE",
        `${URL_PATH.deleteProject}/${id}`,
        undefined,
        undefined,
        { "user-id": userId }
      );

      // update UI
      setProjects((prev) => prev.filter((p) => p.id !== id));

      // clear selected project if deleted
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }

      // refresh Experience Index
      await fetchExperienceIndex();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRealProject = projects.some((p) => !p.isDemo);
  const canContinue = hasRealProject;

  const handleContinue = () => {
    if (!hasRealProject) {
      alert("Please add at least one project to continue.");
      return;
    }
    navigate("/skill-index-intro");
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-6 py-20">
      <div className="w-full max-w-[800px] flex gap-8">
        {/* Left card */}
        <main className="w-full max-w-[448px] flex flex-col gap-6 rounded-[28px] border border-solid border-neutral-border bg-white px-8 py-8 shadow-[0_10px_30px_rgba(40,0,60,0.06)]">
          {/* top row - back + progress */}
          <div className="flex items-center gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />
            <div className="flex-1 max-w-[420px]">
              <div className="flex items-center gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`p-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-violet-700"
                  />
                ))}
                {[...Array()].map((_, i) => (
                  <div
                    key={`n-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-neutral-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Header */}
          <header className="w-full">
            <h2 className="text-[20px] text-neutral-900">Add your projects</h2>
            <p className="text-xs text-neutral-500">Share your best work</p>
          </header>

          {/* Selected projects preview */}
          <section className="flex flex-col gap-3 w-full">
            {projects.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(p);
                  }
                }}
                className="rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-900 leading-tight">
                    {p.name}
                  </span>
                  <span className="text-xs text-neutral-500">{p.role}</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <IconButton
                    size="small"
                    icon={<FeatherX />}
                    tabIndex={0}
                    aria-label={`Delete project ${p.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(p.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(p.id);
                      }
                    }}
                    className="!bg-transparent !text-neutral-500"
                  />
                </div>
              </div>
            ))}
          </section>

          {selectedProject && (
            <div className="rounded-3xl border border-neutral-300 bg-white px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Project Details
                </h3>

                <IconButton
                  size="small"
                  icon={<FeatherX />}
                  onClick={() => setSelectedProject(null)}
                  className="!bg-transparent !text-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-3 text-sm text-neutral-800">
                <div>
                  <span className="font-medium">Project name:</span>{" "}
                  {selectedProject.name}
                </div>

                <div>
                  <span className="font-medium">Role:</span>{" "}
                  {selectedProject.role}
                </div>

                <div>
                  <span className="font-medium">Summary:</span>{" "}
                  {selectedProject.summary}
                </div>

                <div>
                  <span className="font-medium">Outcome:</span>{" "}
                  {selectedProject.outcome}
                </div>

                {selectedProject.link && (
                  <div>
                    <span className="font-medium">Link:</span>{" "}
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-700 underline"
                    >
                      {selectedProject.link}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddProject();
            }}
            className="flex flex-col gap-4"
          >
            <TextField
              label="Project name *"
              helpText=""
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="e.g., Mobile app redesign"
                value={name}
                onChange={(ev) => setName(toTitleCase(ev.target.value))}
                className={scInputClass}
              />
            </TextField>

            <TextField
              label="Your role *"
              helpText=""
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="e.g., Product Manager"
                value={role}
                onChange={(ev) => setRole(toTitleCase(ev.target.value))}
                className={scInputClass}
              />
            </TextField>

            <TextField
              label="Summary *"
              helpText=""
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="What was the project about?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                onBlur={() => setSummary(toSentenceCase(summary))}
                className={scInputClass}
              />
            </TextField>

            <TextField
              label="Outcome (optional)"
              helpText=""
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="What was the result or impact?"
                value={outcome}
                onChange={(ev) => setOutcome(toSentenceCase(ev.target.value))}
                className={scInputClass}
              />
            </TextField>

            <TextField label="Link" helpText="" className={scTextFieldClass}>
              <TextField.Input
                placeholder="https://"
                value={link}
                onChange={(e) => setLink(e.target.value.replace(/\s/g, ""))}
                onBlur={() => {
                  if (!link) return;
                  if (!link.startsWith("http")) {
                    setLink("https://" + link);
                  }
                }}
                className={scInputClass}
              />
            </TextField>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="neutral-secondary"
                icon={<FeatherPlus />}
                className="w-full rounded-full h-10 px-4 flex items-center gap-2"
                onClick={handleAddProject}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add another project"}
              </Button>

              <div className="flex-1" />
            </div>
          </form>

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

        {/* Right panel */}
        <aside className="w-72 shrink-0">
          <div className="sticky top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-200">
            <h3 className="text-lg text-neutral-900">Your Experience Index</h3>

            <div className="flex items-center justify-center py-6">
              <span className="font-['Afacad_Flux'] text-[48px] font-[500] leading-[56px] text-neutral-300">
                {displayedIndex ?? "0"}
              </span>
            </div>

            {/* Top form horizontal line */}
            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

            <div className="mt-4">
              <div className="text-sm font-semibold text-neutral-800 mb-3">
                Progress Steps
              </div>

              {/* Demographics — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Demographics</span>
              </div>

              {/* Education — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Education</span>
              </div>

              {/* Experience — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Experience</span>
              </div>

              {/* Certifications — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Certifications</span>
              </div>

              {/* Awards — completed (green) */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Awards</span>
              </div>

              {/* Certifications — active (purple) */}
              <div className="flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
                  <IconWithBackground
                    size="small"
                    variant="neutral"
                    className="!bg-white !text-violet-600"
                    icon={<FeatherPackage className="!text-violet-800" />}
                  />
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  Projects
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
