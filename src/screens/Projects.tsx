// src/components/Projects.tsx
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
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "../common/Colors";

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

  console.log("PROJECT source:", source);

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

    // if (!summary.trim()) {
    //   toast.error("Project Summary is required.");
    //   return false;
    // }

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
    if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/skill-index-intro", { state: { source } });
    }
  };

  // return (
  //   <>
  //     <HeaderLogo />
  //     <ToastContainer position="top-center" autoClose={3000} />

  //     <div className="min-h-screen flex justify-center px-6 py-0">
  //       <div className="w-full max-w-[1100px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
  //         {/* Left card */}
  //         <main
  //           className="
  //   w-full
  //   md:max-w-[480px]
  //   flex flex-col gap-6
  //   rounded-[28px]
  //   border border-neutral-300
  //   bg-white
  //   px-4 sm:px-6 lg:px-8
  //   py-6
  //   shadow-[0_10px_30px_rgba(40,0,60,0.06)]
  // "
  //         >
  //           {/* top row - back + progress */}
  //           <div className="flex items-center gap-4">
  //             {/* <IconButton
  //               size="small"
  //               icon={<FeatherArrowLeft />}
  //               onClick={() => navigate(-1)}
  //             /> */}

  //             <IconButton
  //               size="small"
  //               icon={<FeatherArrowLeft />}
  //               onClick={async () => {
  //                 try {
  //                   // 1️⃣ If came from dashboard → always go back to dashboard
  //                   if (source === "dashboard") {
  //                     navigate("/dashboard");
  //                     return;
  //                   }

  //                   // 2️⃣ Otherwise → ask backend if education is allowed
  //                   const res = await API("POST", "/auth/verify-route", {
  //                     route: "/certifications",
  //                   });

  //                   if (res.allowed) {
  //                     navigate("/certifications", { state: { source } });
  //                   }
  //                   // ❌ else do nothing (education already completed)
  //                 } catch {
  //                   // silent fail
  //                 }
  //               }}
  //             />
  //             <div className="flex-1 w-full max-w-full md:max-w-[420px]">
  //               <div className="flex items-center gap-3">
  //                 {[...Array(6)].map((_, i) => (
  //                   <div
  //                     key={`p-${i}`}
  //                     style={{ height: 6, backgroundColor: colors.primary }}
  //                     className="flex-1 rounded-full"
  //                   />
  //                 ))}
  //                 {[...Array()].map((_, i) => (
  //                   <div
  //                     key={`n-${i}`}
  //                     style={{ height: 6 }}
  //                     className="flex-1 rounded-full bg-neutral-200"
  //                   />
  //                 ))}
  //               </div>
  //             </div>
  //           </div>

  //           {/* Header */}
  //           <header className="w-full">
  //             <h2 className="text-[22px] text-neutral-900">
  //               Add your projects
  //             </h2>
  //             <p className="text-xs text-neutral-500">Share your best work</p>
  //           </header>

  //           {/* Selected projects preview list */}
  //           <section className="flex w-full flex-col gap-3">
  //             {projects.map((p) => {
  //               const isSelected = selectedProject?.id === p.id;

  //               return (
  //                 <div
  //                   key={p.id}
  //                   role="button"
  //                   tabIndex={0}
  //                   onClick={() => setSelectedProject(isSelected ? null : p)}
  //                   onKeyDown={(e) => {
  //                     if (e.key === "Enter" || e.key === " ") {
  //                       e.preventDefault();
  //                       setSelectedProject(isSelected ? null : p);
  //                     }
  //                   }}
  //                   className="
  //         rounded-3xl
  //         border border-neutral-300
  //         bg-white
  //         px-4 py-3
  //         cursor-pointer
  //         transition
  //         hover:bg-neutral-50
  //         focus:outline-none
  //         focus:ring-2
  //         focus:ring-violet-500
  //       "
  //                 >
  //                   {/* 🔹 TOP ROW */}
  //                   <div className="flex items-center justify-between">
  //                     <div className="flex items-center gap-3 min-w-0">
  //                       <Avatar
  //                         size="large"
  //                         square
  //                         className="!rounded-2xl bg-[#D9D9D9] text-BLACK-700 font-semibold"
  //                       >
  //                         {p.name
  //                           .split(" ")
  //                           .slice(0, 2)
  //                           .map((s) => s[0])
  //                           .join("")}
  //                       </Avatar>

  //                       <div className="flex flex-col min-w-0">
  //                         <span className="text-sm font-semibold text-neutral-900 truncate">
  //                           {p.name}
  //                         </span>

  //                         {p.role && (
  //                           <span className="text-xs text-neutral-500 truncate">
  //                             {p.role}
  //                           </span>
  //                         )}
  //                       </div>
  //                     </div>

  //                     <IconButton
  //                       size="small"
  //                       icon={<FeatherX />}
  //                       aria-label={`Delete project ${p.name}`}
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         setDeleteProjectId(p.id);
  //                       }}
  //                       className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
  //                     />
  //                   </div>

  //                   {/* 🔹 EXPANDED DETAILS */}
  //                   {isSelected && (
  //                     <>
  //                       <div className="my-4 border-t border-neutral-200" />

  //                       <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
  //                         <div>
  //                           <span className="font-medium">Project name:</span>{" "}
  //                           {p.name}
  //                         </div>
  //                         <div>
  //                           <span className="font-medium">Your Role:</span>{" "}
  //                           {p.role}
  //                         </div>
  //                         {p.summary && (
  //                           <div>
  //                             <span className="font-medium">Summary:</span>{" "}
  //                             {p.summary}
  //                           </div>
  //                         )}

  //                         {p.outcome && (
  //                           <div>
  //                             <span className="font-medium">Outcome:</span>{" "}
  //                             {p.outcome}
  //                           </div>
  //                         )}

  //                         {p.link && (
  //                           <div>
  //                             <span className="font-medium">Project link:</span>{" "}
  //                             <a
  //                               href={p.link}
  //                               target="_blank"
  //                               rel="noopener noreferrer"
  //                               className="text-violet-700 underline break-all"
  //                               onClick={(e) => e.stopPropagation()} // 🚫 don’t collapse card
  //                             >
  //                               {p.link}
  //                             </a>
  //                           </div>
  //                         )}
  //                       </div>
  //                     </>
  //                   )}
  //                 </div>
  //               );
  //             })}
  //           </section>

  //           {/* 
  //         {selectedProject && (
  //           <div className="rounded-3xl border border-neutral-300 bg-white px-6 py-5">
  //             <div className="flex items-center justify-between mb-4">
  //               <h3 className="text-sm font-semibold text-neutral-900">
  //                 Project Details
  //               </h3>

  //               <IconButton
  //                 size="small"
  //                 icon={<FeatherX />}
  //                 onClick={() => setSelectedProject(null)}
  //                 className="!bg-transparent !text-neutral-500"
  //               />
  //             </div>

  //             <div className="flex flex-col gap-3 text-sm text-neutral-800">
  //               <div>
  //                 <span className="font-medium">Project name:</span>{" "}
  //                 {selectedProject.name}
  //               </div>

  //               <div>
  //                 <span className="font-medium">Role:</span>{" "}
  //                 {selectedProject.role}
  //               </div>

  //               <div>
  //                 <span className="font-medium">Summary:</span>{" "}
  //                 {selectedProject.summary}
  //               </div>

  //               <div>
  //                 <span className="font-medium">Outcome:</span>{" "}
  //                 {selectedProject.outcome}
  //               </div>

  //               {selectedProject.link && (
  //                 <div>
  //                   <span className="font-medium">Link:</span>{" "}
  //                   <a
  //                     href={selectedProject.link}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                     className="text-violet-700 underline"
  //                   >
  //                     {selectedProject.link}
  //                   </a>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         )} */}

  //           {/* Form */}
  //           <form
  //             onSubmit={(e) => {
  //               e.preventDefault();
  //               handleAddProject();
  //             }}
  //             className="flex flex-col gap-4"
  //           >
  //             <TextField
  //               label={
  //                 <span className="text-[12px]">
  //                   Project name <span className="text-red-500">*</span>{" "}
  //                 </span>
  //               }
  //               helpText=""
  //               className={scTextFieldClass}
  //             >
  //               <TextField.Input
  //                 placeholder="e.g., Mobile app redesign"
  //                 value={name}
  //                 onChange={(ev) => setName(toTitleCase(ev.target.value))}
  //                 className={scInputClass}
  //               />
  //             </TextField>

  //             <TextField
  //               label={
  //                 <span className="text-[12px]">
  //                   Your Role <span className="text-red-500">*</span>{" "}
  //                 </span>
  //               }
  //               helpText=""
  //               className={scTextFieldClass}
  //             >
  //               <TextField.Input
  //                 placeholder="e.g., Product Manager"
  //                 value={role}
  //                 onChange={(ev) => setRole(toTitleCase(ev.target.value))}
  //                 className={scInputClass}
  //               />
  //             </TextField>

  //             <TextField
  //               label={
  //                 <span className="text-[12px]">
  //                   Link <span className="text-red-500">*</span>
  //                 </span>
  //               }
  //               helpText=""
  //               className={scTextFieldClass}
  //             >
  //               <TextField.Input
  //                 placeholder="https://"
  //                 value={link}
  //                 onChange={(e) => setLink(e.target.value.replace(/\s/g, ""))}
  //                 onBlur={() => {
  //                   if (!link) return;
  //                   if (!link.startsWith("http")) {
  //                     setLink("https://" + link);
  //                   }
  //                 }}
  //                 className={scInputClass}
  //               />
  //             </TextField>

  //             <TextField
  //               label={<span className="text-[12px]">Summary </span>}
  //               helpText=""
  //               className={scTextFieldClass}
  //             >
  //               <TextField.Input
  //                 placeholder="What was the project about?"
  //                 value={summary}
  //                 onChange={(e) => setSummary(e.target.value)}
  //                 onBlur={() => setSummary(toSentenceCase(summary))}
  //                 className={scInputClass}
  //               />
  //             </TextField>

  //             <TextField
  //               label={<span className="text-[12px]">Outcome </span>}
  //               helpText=""
  //               className={scTextFieldClass}
  //             >
  //               <TextField.Input
  //                 placeholder="What was the result or impact?"
  //                 value={outcome}
  //                 onChange={(ev) => setOutcome(toSentenceCase(ev.target.value))}
  //                 className={scInputClass}
  //               />
  //             </TextField>

  //             <div className="flex gap-3 mt-2">
  //               <Button
  //                 type="button"
  //                 variant="neutral-secondary"
  //                 icon={<FeatherPlus />}
  //                 className="w-full rounded-full border border-neutral-300 h-10 px-4 flex items-center gap-2"
  //                 onClick={handleAddProject}
  //                 disabled={isSubmitting}
  //               >
  //                 {isSubmitting ? "Adding..." : "Add another project"}
  //               </Button>

  //               <div className="flex-1" />
  //             </div>
  //           </form>

  //           <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

  //           <footer>
  //             <Button
  //               onClick={handleContinue}
  //               disabled={!canContinue || isSubmitting}
  //               style={{backgroundColor: colors.primary, color: "black !important"}}
  //               className={`
  //   w-full h-10 rounded-full transition-all
  //   ${
  //     !canContinue || isSubmitting
  //       ? "bg-violet-300 cursor-not-allowed"
  //       : "bg-violet-700 shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
  //   }
  // `}
  //             >
  //               {isSubmitting ? "Saving..." : "Continue"}
  //             </Button>
  //           </footer>
  //         </main>

  //         {/* Right panel */}
  //         <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
  //           <div className="lg:sticky lg:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
  //             <h3 className="text-[22px] text-neutral-900">
  //               Your Experience Index
  //             </h3>

  //             <div className="flex items-center justify-center py-6">
  //               <span
  //                 aria-live="polite"
  //                 className="font-['Afacad_Flux'] text-[32px] sm:text-[40px] md:text-[48px] font-[500] leading-[56px] text-neutral-300"
  //               >
  //                 {displayedIndex ?? 0}
  //               </span>
  //             </div>

  //             {/* Top form horizontal line */}
  //             <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

  //             <div className="mt-4">
  //               <div className="text-[16px] text-neutral-800 mb-3">
  //                 Progress Steps
  //               </div>

  //               {/* Demographics — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">Demographics</span>
  //               </div>

  //               {/* Education — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">Education</span>
  //               </div>

  //               {/* Experience — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">Experience</span>
  //               </div>

  //               {/* Certifications — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">
  //                   Certifications
  //                 </span>
  //               </div>

  //               {/* Awards — completed (green) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
  //                 <IconWithBackground
  //                   size="small"
  //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
  //                   className="!bg-green-100 !rounded-full !p-3"
  //                 />
  //                 <span className="text-sm text-neutral-700">Awards</span>
  //               </div>

  //               {/* Certifications — active (purple) */}
  //               <div className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-2 mb-3" style={{background: colors.white}}>
  //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
  //                   <IconWithBackground
  //                     size="small"
  //                     variant="neutral"
  //                     className="!bg-white !text-violet-600"
  //                     icon={<FeatherPackage />}
  //                   />
  //                 </div>
  //                 <span className="text-sm font-semibold text-neutral-900">
  //                   Projects
  //                 </span>
  //               </div>
  //             </div>
  //           </div>
  //         </aside>
  //       </div>
  //       {deleteProjectId && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  //           <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
  //             <div className="flex justify-between items-center mb-4">
  //               <h3 className="text-lg font-semibold text-neutral-900">
  //                 Are you sure?
  //               </h3>
  //               <button
  //                 onClick={() => setDeleteProjectId(null)}
  //                 className="text-neutral-400 hover:text-neutral-600"
  //               >
  //                 ✕
  //               </button>
  //             </div>

  //             <p className="text-sm text-neutral-600 mb-6">
  //               Do you really want to delete this project?
  //             </p>

  //             <div className="flex gap-3">
  //               <Button
  //                 variant="neutral-secondary"
  //                 className="flex-1"
  //                 onClick={() => setDeleteProjectId(null)}
  //               >
  //                 Cancel
  //               </Button>

  //               <Button
  //                 className="flex-1 rounded-3xl bg-violet-600 text-white hover:bg-violet-700"
  //                 onClick={handleRemove}
  //                 disabled={isSubmitting}
  //               >
  //                 {isSubmitting ? "Deleting..." : "Yes"}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </>
  // );
  return (
    <>
      <HeaderLogo />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Blended background - fixed behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: colors.background }}
        />

        <div
          className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
          style={{
            background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
          }}
        />

        <div
          className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
          }}
        />

        <div
          className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
          }}
        />
      </div>

      <div className="min-h-screen flex justify-center px-6 py-0">
        <div className="w-full max-w-[1100px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
          {/* Left card */}
          <main
            className="
    w-full
    md:max-w-[480px]
    flex flex-col gap-6
    rounded-[28px]
    border border-neutral-300
    bg-white
    px-4 sm:px-6 lg:px-8
    py-6
    shadow-[0_10px_30px_rgba(40,0,60,0.06)]
  "
          >
            {/* top row - back + progress */}
            <div className="flex items-center gap-4">
              <IconButton
                size="small"
                icon={<FeatherArrowLeft />}
                onClick={async () => {
                  try {
                    // 1️⃣ If came from dashboard → always go back to dashboard
                    if (source === "dashboard") {
                      navigate("/dashboard");
                      return;
                    }

                    // 2️⃣ Otherwise → ask backend if education is allowed
                    const res = await API("POST", "/auth/verify-route", {
                      route: "/certifications",
                    });

                    if (res.allowed) {
                      navigate("/certifications", { state: { source } });
                    }
                    // ❌ else do nothing (education already completed)
                  } catch {
                    // silent fail
                  }
                }}
              />
              <div className="flex-1 w-full max-w-full md:max-w-[420px]">
                <div className="flex items-center gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`p-${i}`}
                      style={{ height: 6, backgroundColor: colors.primary }}
                      className="flex-1 rounded-full"
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
              <h2 className="text-[22px] text-neutral-900">
                Add your projects
              </h2>
              <p className="text-xs text-neutral-500">Share your best work</p>
            </header>

            {/* Selected projects preview list */}
            <section className="flex w-full flex-col gap-3">
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
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          size="large"
                          square
                          className="!rounded-2xl bg-[#D9D9D9] text-BLACK-700 font-semibold"
                        >
                          {p.name
                            .split(" ")
                            .slice(0, 2)
                            .map((s) => s[0])
                            .join("")}
                        </Avatar>

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-neutral-900 truncate">
                            {p.name}
                          </span>

                          {p.role && (
                            <span className="text-xs text-neutral-500 truncate">
                              {p.role}
                            </span>
                          )}
                        </div>
                      </div>

                      <IconButton
                        size="small"
                        icon={<FeatherX />}
                        aria-label={`Delete project ${p.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteProjectId(p.id);
                        }}
                        className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
                      />
                    </div>

                    {/* 🔹 EXPANDED DETAILS */}
                    {isSelected && (
                      <>
                        <div className="my-4 border-t border-neutral-200" />

                        <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
                          <div>
                            <span className="font-medium">Project name:</span>{" "}
                            {p.name}
                          </div>
                          <div>
                            <span className="font-medium">Your Role:</span>{" "}
                            {p.role}
                          </div>
                          {p.summary && (
                            <div>
                              <span className="font-medium">Summary:</span>{" "}
                              {p.summary}
                            </div>
                          )}

                          {p.outcome && (
                            <div>
                              <span className="font-medium">Outcome:</span>{" "}
                              {p.outcome}
                            </div>
                          )}

                          {p.link && (
                            <div>
                              <span className="font-medium">Project link:</span>{" "}
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-700 underline break-all"
                                onClick={(e) => e.stopPropagation()} // 🚫 don't collapse card
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

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProject();
              }}
              className="flex flex-col gap-4"
            >
              <TextField
                label={
                  <span className="text-[12px]">
                    Project name <span className="text-red-500">*</span>{" "}
                  </span>
                }
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
                label={
                  <span className="text-[12px]">
                    Your Role <span className="text-red-500">*</span>{" "}
                  </span>
                }
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
                label={
                  <span className="text-[12px]">
                    Link <span className="text-red-500">*</span>
                  </span>
                }
                helpText=""
                className={scTextFieldClass}
              >
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

              <TextField
                label={<span className="text-[12px]">Summary </span>}
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
                label={<span className="text-[12px]">Outcome </span>}
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

              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant="neutral-secondary"
                  icon={<FeatherPlus />}
                  className="w-full rounded-full border border-neutral-300 h-10 px-4 flex items-center gap-2"
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
  style={{backgroundColor: colors.primary}}
  className={`
    w-full h-10 rounded-full transition-all !text-black
    ${
      !canContinue || isSubmitting
        ? "bg-violet-300 cursor-not-allowed"
        : "bg-violet-700 shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
    }
  `}
>
  {isSubmitting ? "Saving..." : "Continue"}
</Button>
            </footer>
          </main>

          {/* Right panel */}
          <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
            <div className="lg:sticky lg:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
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

              {/* Top form horizontal line */}
              <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

              <div className="mt-4">
                <div className="text-[16px] text-neutral-800 mb-3">
                  Progress Steps
                </div>

                {/* Demographics — completed (green) */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                  <IconWithBackground
                    size="small"
                    icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                    className="!bg-green-100 !rounded-full !p-3"
                  />
                  <span className="text-sm text-neutral-700">Demographics</span>
                </div>

                {/* Education — completed (green) */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                  <IconWithBackground
                    size="small"
                    icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                    className="!bg-green-100 !rounded-full !p-3"
                  />
                  <span className="text-sm text-neutral-700">Education</span>
                </div>

                {/* Experience — completed (green) */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                  <IconWithBackground
                    size="small"
                    icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                    className="!bg-green-100 !rounded-full !p-3"
                  />
                  <span className="text-sm text-neutral-700">Experience</span>
                </div>

                {/* Certifications — completed (green) */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                  <IconWithBackground
                    size="small"
                    icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                    className="!bg-green-100 !rounded-full !p-3"
                  />
                  <span className="text-sm text-neutral-700">
                    Certifications
                  </span>
                </div>

                {/* Awards — completed (green) */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                  <IconWithBackground
                    size="small"
                    icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                    className="!bg-green-100 !rounded-full !p-3"
                  />
                  <span className="text-sm text-neutral-700">Awards</span>
                </div>

                {/* Certifications — active (purple) */}
                <div className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-2 mb-3" style={{background: colors.primary}}>
                  <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
                    <IconWithBackground
                      size="small"
                      variant="neutral"
                      className="!bg-white !text-violet-600"
                      icon={<FeatherPackage />}
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
        {deleteProjectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Are you sure?
                </h3>
                <button
                  onClick={() => setDeleteProjectId(null)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-neutral-600 mb-6">
                Do you really want to delete this project?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="neutral-secondary"
                  className="flex-1"
                  onClick={() => setDeleteProjectId(null)}
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

