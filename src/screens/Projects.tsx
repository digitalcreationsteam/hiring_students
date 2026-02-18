// // src/components/Projects.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Button } from "../ui/components/Button";
// import { Avatar } from "../ui/components/Avatar";
// import HeaderLogo from "../ui/components/HeaderLogo";
// import { IconButton } from "../ui/components/IconButton";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import { TextField } from "../ui/components/TextField";
// import {
//   FeatherArrowLeft,
//   FeatherPackage,
//   FeatherPlus,
//   FeatherX,
//   FeatherCheck,
//   FeatherEdit2,
// } from "@subframe/core";
// import API, { URL_PATH } from "src/common/API";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { colors } from "../common/Colors";
// import Navbar from "src/ui/components/Navbar";
// import Footer from "../ui/components/Footer";
// import { useAppDispatch } from "../store/hooks";
// import { setNavigation } from "src/store/slices/onboardingSlice";

// type ProjectEntry = {
//   id: string;
//   name: string;
//   role: string;
//   summary: string;
//   outcome: string;
//   link?: string;
//   isDemo?: boolean;
// };

// const toTitleCase = (value: string) =>
//   value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

// const toSentenceCase = (value: string) => {
//   if (!value) return value;
//   return value.charAt(0).toUpperCase() + value.slice(1);
// };

// const normalizeSpaces = (value: string) => value.replace(/\s+/g, " ").trim();

// const URL_REGEX = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

// const isValidUrl = (value: string) => {
//   return URL_REGEX.test(value.trim());
// };

// export default function Projects() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const source = location.state?.source; // "dashboard" | undefined

//   console.log("PROJECT source:", source);

//   const userId = localStorage.getItem("userId");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const MAX_PROJECTS = 5;
//   const dispatch = useAppDispatch();

//   // form state
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("");
//   const [summary, setSummary] = useState("");
//   const [outcome, setOutcome] = useState("");
//   const [link, setLink] = useState("");
//   const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(
//     null,
//   );
//   const [experienceIndex, setExperienceIndex] = useState<number | null>(null);
//   const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
//   const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const isEditing = !!editingId;

//   type ExperiencePoints = {
//     demographics?: number;
//     education?: number;
//     workExperience?: number;
//     certifications?: number;
//     awards?: number;
//     projects?: number;
//     total?: number;
//   };

//   const [experiencePoints, setExperiencePoints] =
//     useState<ExperiencePoints | null>(null);

//   const displayedIndex = experiencePoints?.total ?? 0;

//   // stored projects (example)
//   const [projects, setProjects] = useState<ProjectEntry[]>([
//     {
//       id: "example-1",
//       name: "Mobile app redesign",
//       role: "Product Manager",
//       summary: "Redesigned onboarding and core flows",
//       outcome: "Increased activation by 18%",
//       link: undefined,
//       isDemo: true,
//     },
//   ]);

//   //GET
//   const fetchProjects = async () => {
//     if (!userId) return;

//     try {
//       const res = await API("GET", URL_PATH.getProjects, undefined, {
//         "user-id": userId,
//       });

//       const apiProjects = res?.data || [];

//       const mappedProjects = apiProjects.map((p: any) => ({
//         id: p._id,
//         name: p.projectName,
//         role: p.role || "",
//         summary: p.summary || "",
//         outcome: p.outcome || "",
//         link: p.link || undefined,
//         isDemo: false,
//       }));

//       setProjects(mappedProjects.length ? mappedProjects : []);
//     } catch (error) {
//       console.error("Failed to fetch projects", error);
//     }
//   };

//   // -------------------- GET EXPERIENCE INDEX --------------------
//   const fetchExperienceIndex = React.useCallback(async () => {
//     if (!userId) return;

//     try {
//       const res = await API(
//         "GET",
//         URL_PATH.calculateExperienceIndex,
//         undefined,
//         { "user-id": userId },
//       );

//       setExperiencePoints(res?.points ?? null);
//     } catch {
//       setExperiencePoints(null);
//     } finally {
//       setIsExpIndexLoading(false);
//     }
//   }, [userId]);

//   //USE EFFECT
//   useEffect(() => {
//     fetchProjects();
//     fetchExperienceIndex();
//   }, []);

//   // SC2 small textfield classes
//   const scTextFieldClass =
//     "w-full [&>label]:text-[12px] [&>label]:font-medium " +
//     "[&>p]:text-[11px] [&>div]:rounded-full [&>div]:border " +
//     "[&>div]:border-neutral-300 [&>div]:h-9";

//   const scInputClass =
//     "rounded-full h-9 px-3 text-[12px] placeholder:text-[12px] " +
//     "bg-white !border-none focus:ring-0 w-full";

//   const resetForm = () => {
//     setName("");
//     setRole("");
//     setSummary("");
//     setOutcome("");
//     setLink("");
//     setEditingId(null);
//   };

//   const handleAddProject = async () => {
//     const realProjectsCount = projects.filter((p) => !p.isDemo).length;
//     if (realProjectsCount >= MAX_PROJECTS) {
//       toast.error("You can add a maximum of 5 projects only.");
//       return;
//     }
//     if (isSubmitting) return;

//     if (!name.trim()) {
//       toast.error("Project name is required.");
//       return false;
//     }

//     if (!role.trim()) {
//       toast.error("Role is required.");
//       return false;
//     }

//     // if (!summary.trim()) {
//     //   toast.error("Project Summary is required.");
//     //   return false;
//     // }

//     if (!link.trim()) {
//       toast.error("Project link is required.");
//       return;
//     }

//     if (!isValidUrl(link)) {
//       toast.error("Project link must be a valid URL (https://...)");
//       return;
//     }

//     const normalizedName = toTitleCase(normalizeSpaces(name));

//     const duplicate = projects.some(
//       (p) => !p.isDemo && p.name === normalizedName,
//     );

//     if (duplicate) {
//       toast.error("This project already exists.");
//       return;
//     }

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const res = await API(
//         "POST",
//         URL_PATH.projects,
//         {
//           projects: [
//             {
//               projectName: toTitleCase(normalizeSpaces(name)),
//               role: role ? toTitleCase(normalizeSpaces(role)) : null,

//               summary: summary
//                 ? toSentenceCase(normalizeSpaces(summary.trim()))
//                 : null,

//               outcome: outcome
//                 ? toSentenceCase(normalizeSpaces(outcome.trim()))
//                 : null,

//               link: link ? normalizeSpaces(link) : null,
//             },
//           ],
//         },
//         { "user-id": userId },
//       );
//       toast.success("Project added successfully");
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }
//       await fetchProjects();
//       await fetchExperienceIndex();
//       resetForm();
//       setSelectedProject(null);
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to add project");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- EDIT PROJECT --------------------
//   const handleUpdateProject = async () => {
//     if (!editingId || isSubmitting) return;

//     if (!name.trim()) return toast.error("Project name is required.");
//     if (!role.trim()) return toast.error("Role is required.");
//     if (!link.trim()) return toast.error("Project link is required.");
//     if (!isValidUrl(link))
//       return toast.error("Project link must be a valid URL (https://...)");

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       await API(
//         "PUT",
//         `${URL_PATH.projects}/${editingId}`, // ✅ update endpoint (change if your backend route differs)
//         {
//           projectName: toTitleCase(normalizeSpaces(name)),
//           role: role ? toTitleCase(normalizeSpaces(role)) : null,
//           summary: summary
//             ? toSentenceCase(normalizeSpaces(summary.trim()))
//             : null,
//           outcome: outcome
//             ? toSentenceCase(normalizeSpaces(outcome.trim()))
//             : null,
//           link: link ? normalizeSpaces(link) : null,
//         },
//         { "user-id": userId },
//       );

//       toast.success("Project updated successfully");

//       await fetchProjects();
//       await fetchExperienceIndex();
//       resetForm();
//       setSelectedProject(null);
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to update project");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- DELETE PROJECT --------------------
//   const handleRemove = async () => {
//     if (!deleteProjectId || isSubmitting) return;

//     // demo project → local delete
//     if (deleteProjectId === "example-1") {
//       setProjects((prev) => prev.filter((p) => p.id !== deleteProjectId));
//       setDeleteProjectId(null);
//       return;
//     }

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       await API(
//         "POST",
//         `${URL_PATH.deleteProject}/${deleteProjectId}`,
//         undefined,
//         { "user-id": userId },
//       );

//       setProjects((prev) => prev.filter((p) => p.id !== deleteProjectId));

//       if (selectedProject?.id === deleteProjectId) {
//         setSelectedProject(null);
//       }

//       await fetchExperienceIndex();
//       setDeleteProjectId(null);
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to delete project");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const hasRealProject = projects.some((p) => !p.isDemo);
//   const canContinue = hasRealProject;

//   const handleContinue = () => {
//     if (!hasRealProject) {
//       toast.error("Please add at least one project to continue.");
//       return;
//     }
//     if (source === "dashboard") {
//       navigate("/dashboard");
//     } else {
//       navigate("/skill-index-intro", { state: { source } });
//     }
//   };

//   // return (
//   //   <>
//   //     <HeaderLogo />
//   //     <ToastContainer position="top-center" autoClose={3000} />

//   //     <div className="min-h-screen flex justify-center px-6 py-0">
//   //       <div className="w-full max-w-[1100px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
//   //         {/* Left card */}
//   //         <main
//   //           className="
//   //   w-full
//   //   md:max-w-[480px]
//   //   flex flex-col gap-6
//   //   rounded-[28px]
//   //   border border-neutral-300
//   //   bg-white
//   //   px-4 sm:px-6 lg:px-8
//   //   py-6
//   //   shadow-[0_10px_30px_rgba(40,0,60,0.06)]
//   // "
//   //         >
//   //           {/* top row - back + progress */}
//   //           <div className="flex items-center gap-4">
//   //             {/* <IconButton
//   //               size="small"
//   //               icon={<FeatherArrowLeft />}
//   //               onClick={() => navigate(-1)}
//   //             /> */}

//   //             <IconButton
//   //               size="small"
//   //               icon={<FeatherArrowLeft />}
//   //               onClick={async () => {
//   //                 try {
//   //                   // 1️⃣ If came from dashboard → always go back to dashboard
//   //                   if (source === "dashboard") {
//   //                     navigate("/dashboard");
//   //                     return;
//   //                   }

//   //                   // 2️⃣ Otherwise → ask backend if education is allowed
//   //                   const res = await API("POST", "/auth/verify-route", {
//   //                     route: "/certifications",
//   //                   });

//   //                   if (res.allowed) {
//   //                     navigate("/certifications", { state: { source } });
//   //                   }
//   //                   // ❌ else do nothing (education already completed)
//   //                 } catch {
//   //                   // silent fail
//   //                 }
//   //               }}
//   //             />
//   //             <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//   //               <div className="flex items-center gap-3">
//   //                 {[...Array(6)].map((_, i) => (
//   //                   <div
//   //                     key={`p-${i}`}
//   //                     style={{ height: 6, backgroundColor: colors.primary }}
//   //                     className="flex-1 rounded-full"
//   //                   />
//   //                 ))}
//   //                 {[...Array()].map((_, i) => (
//   //                   <div
//   //                     key={`n-${i}`}
//   //                     style={{ height: 6 }}
//   //                     className="flex-1 rounded-full bg-neutral-200"
//   //                   />
//   //                 ))}
//   //               </div>
//   //             </div>
//   //           </div>

//   //           {/* Header */}
//   //           <header className="w-full">
//   //             <h2 className="text-[22px] text-neutral-900">
//   //               Add your projects
//   //             </h2>
//   //             <p className="text-xs text-neutral-500">Share your best work</p>
//   //           </header>

//   //           {/* Selected projects preview list */}
//   //           <section className="flex w-full flex-col gap-3">
//   //             {projects.map((p) => {
//   //               const isSelected = selectedProject?.id === p.id;

//   //               return (
//   //                 <div
//   //                   key={p.id}
//   //                   role="button"
//   //                   tabIndex={0}
//   //                   onClick={() => setSelectedProject(isSelected ? null : p)}
//   //                   onKeyDown={(e) => {
//   //                     if (e.key === "Enter" || e.key === " ") {
//   //                       e.preventDefault();
//   //                       setSelectedProject(isSelected ? null : p);
//   //                     }
//   //                   }}
//   //                   className="
//   //         rounded-3xl
//   //         border border-neutral-300
//   //         bg-white
//   //         px-4 py-3
//   //         cursor-pointer
//   //         transition
//   //         hover:bg-neutral-50
//   //         focus:outline-none
//   //         focus:ring-2
//   //         focus:ring-violet-500
//   //       "
//   //                 >
//   //                   {/* 🔹 TOP ROW */}
//   //                   <div className="flex items-center justify-between">
//   //                     <div className="flex items-center gap-3 min-w-0">
//   //                       <Avatar
//   //                         size="large"
//   //                         square
//   //                         className="!rounded-2xl bg-[#D9D9D9] text-BLACK-700 font-semibold"
//   //                       >
//   //                         {p.name
//   //                           .split(" ")
//   //                           .slice(0, 2)
//   //                           .map((s) => s[0])
//   //                           .join("")}
//   //                       </Avatar>

//   //                       <div className="flex flex-col min-w-0">
//   //                         <span className="text-sm font-semibold text-neutral-900 truncate">
//   //                           {p.name}
//   //                         </span>

//   //                         {p.role && (
//   //                           <span className="text-xs text-neutral-500 truncate">
//   //                             {p.role}
//   //                           </span>
//   //                         )}
//   //                       </div>
//   //                     </div>

//   //                     <IconButton
//   //                       size="small"
//   //                       icon={<FeatherX />}
//   //                       aria-label={`Delete project ${p.name}`}
//   //                       onClick={(e) => {
//   //                         e.stopPropagation();
//   //                         setDeleteProjectId(p.id);
//   //                       }}
//   //                       className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//   //                     />
//   //                   </div>

//   //                   {/* 🔹 EXPANDED DETAILS */}
//   //                   {isSelected && (
//   //                     <>
//   //                       <div className="my-4 border-t border-neutral-200" />

//   //                       <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//   //                         <div>
//   //                           <span className="font-medium">Project name:</span>{" "}
//   //                           {p.name}
//   //                         </div>
//   //                         <div>
//   //                           <span className="font-medium">Your Role:</span>{" "}
//   //                           {p.role}
//   //                         </div>
//   //                         {p.summary && (
//   //                           <div>
//   //                             <span className="font-medium">Summary:</span>{" "}
//   //                             {p.summary}
//   //                           </div>
//   //                         )}

//   //                         {p.outcome && (
//   //                           <div>
//   //                             <span className="font-medium">Outcome:</span>{" "}
//   //                             {p.outcome}
//   //                           </div>
//   //                         )}

//   //                         {p.link && (
//   //                           <div>
//   //                             <span className="font-medium">Project link:</span>{" "}
//   //                             <a
//   //                               href={p.link}
//   //                               target="_blank"
//   //                               rel="noopener noreferrer"
//   //                               className="text-violet-700 underline break-all"
//   //                               onClick={(e) => e.stopPropagation()} // 🚫 don’t collapse card
//   //                             >
//   //                               {p.link}
//   //                             </a>
//   //                           </div>
//   //                         )}
//   //                       </div>
//   //                     </>
//   //                   )}
//   //                 </div>
//   //               );
//   //             })}
//   //           </section>

//   //           {/*
//   //         {selectedProject && (
//   //           <div className="rounded-3xl border border-neutral-300 bg-white px-6 py-5">
//   //             <div className="flex items-center justify-between mb-4">
//   //               <h3 className="text-sm font-semibold text-neutral-900">
//   //                 Project Details
//   //               </h3>

//   //               <IconButton
//   //                 size="small"
//   //                 icon={<FeatherX />}
//   //                 onClick={() => setSelectedProject(null)}
//   //                 className="!bg-transparent !text-neutral-500"
//   //               />
//   //             </div>

//   //             <div className="flex flex-col gap-3 text-sm text-neutral-800">
//   //               <div>
//   //                 <span className="font-medium">Project name:</span>{" "}
//   //                 {selectedProject.name}
//   //               </div>

//   //               <div>
//   //                 <span className="font-medium">Role:</span>{" "}
//   //                 {selectedProject.role}
//   //               </div>

//   //               <div>
//   //                 <span className="font-medium">Summary:</span>{" "}
//   //                 {selectedProject.summary}
//   //               </div>

//   //               <div>
//   //                 <span className="font-medium">Outcome:</span>{" "}
//   //                 {selectedProject.outcome}
//   //               </div>

//   //               {selectedProject.link && (
//   //                 <div>
//   //                   <span className="font-medium">Link:</span>{" "}
//   //                   <a
//   //                     href={selectedProject.link}
//   //                     target="_blank"
//   //                     rel="noopener noreferrer"
//   //                     className="text-violet-700 underline"
//   //                   >
//   //                     {selectedProject.link}
//   //                   </a>
//   //                 </div>
//   //               )}
//   //             </div>
//   //           </div>
//   //         )} */}

//   //           {/* Form */}
//   //           <form
//   //             onSubmit={(e) => {
//   //               e.preventDefault();
//   //               handleAddProject();
//   //             }}
//   //             className="flex flex-col gap-4"
//   //           >
//   //             <TextField
//   //               label={
//   //                 <span className="text-[12px]">
//   //                   Project name <span className="text-red-500">*</span>{" "}
//   //                 </span>
//   //               }
//   //               helpText=""
//   //               className={scTextFieldClass}
//   //             >
//   //               <TextField.Input
//   //                 placeholder="e.g., Mobile app redesign"
//   //                 value={name}
//   //                 onChange={(ev) => setName(toTitleCase(ev.target.value))}
//   //                 className={scInputClass}
//   //               />
//   //             </TextField>

//   //             <TextField
//   //               label={
//   //                 <span className="text-[12px]">
//   //                   Your Role <span className="text-red-500">*</span>{" "}
//   //                 </span>
//   //               }
//   //               helpText=""
//   //               className={scTextFieldClass}
//   //             >
//   //               <TextField.Input
//   //                 placeholder="e.g., Product Manager"
//   //                 value={role}
//   //                 onChange={(ev) => setRole(toTitleCase(ev.target.value))}
//   //                 className={scInputClass}
//   //               />
//   //             </TextField>

//   //             <TextField
//   //               label={
//   //                 <span className="text-[12px]">
//   //                   Link <span className="text-red-500">*</span>
//   //                 </span>
//   //               }
//   //               helpText=""
//   //               className={scTextFieldClass}
//   //             >
//   //               <TextField.Input
//   //                 placeholder="https://"
//   //                 value={link}
//   //                 onChange={(e) => setLink(e.target.value.replace(/\s/g, ""))}
//   //                 onBlur={() => {
//   //                   if (!link) return;
//   //                   if (!link.startsWith("http")) {
//   //                     setLink("https://" + link);
//   //                   }
//   //                 }}
//   //                 className={scInputClass}
//   //               />
//   //             </TextField>

//   //             <TextField
//   //               label={<span className="text-[12px]">Summary </span>}
//   //               helpText=""
//   //               className={scTextFieldClass}
//   //             >
//   //               <TextField.Input
//   //                 placeholder="What was the project about?"
//   //                 value={summary}
//   //                 onChange={(e) => setSummary(e.target.value)}
//   //                 onBlur={() => setSummary(toSentenceCase(summary))}
//   //                 className={scInputClass}
//   //               />
//   //             </TextField>

//   //             <TextField
//   //               label={<span className="text-[12px]">Outcome </span>}
//   //               helpText=""
//   //               className={scTextFieldClass}
//   //             >
//   //               <TextField.Input
//   //                 placeholder="What was the result or impact?"
//   //                 value={outcome}
//   //                 onChange={(ev) => setOutcome(toSentenceCase(ev.target.value))}
//   //                 className={scInputClass}
//   //               />
//   //             </TextField>

//   //             <div className="flex gap-3 mt-2">
//   //               <Button
//   //                 type="button"
//   //                 variant="neutral-secondary"
//   //                 icon={<FeatherPlus />}
//   //                 className="w-full rounded-full border border-neutral-300 h-10 px-4 flex items-center gap-2"
//   //                 onClick={handleAddProject}
//   //                 disabled={isSubmitting}
//   //               >
//   //                 {isSubmitting ? "Adding..." : "Add another project"}
//   //               </Button>

//   //               <div className="flex-1" />
//   //             </div>
//   //           </form>

//   //           <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//   //           <footer>
//   //             <Button
//   //               onClick={handleContinue}
//   //               disabled={!canContinue || isSubmitting}
//   //               style={{backgroundColor: colors.primary, color: "black !important"}}
//   //               className={`
//   //   w-full h-10 rounded-full transition-all
//   //   ${
//   //     !canContinue || isSubmitting
//   //       ? "bg-violet-300 cursor-not-allowed"
//   //       : "bg-violet-700 shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
//   //   }
//   // `}
//   //             >
//   //               {isSubmitting ? "Saving..." : "Continue"}
//   //             </Button>
//   //           </footer>
//   //         </main>

//   //         {/* Right panel */}
//   //         <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
//   //           <div className="lg:sticky lg:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
//   //             <h3 className="text-[22px] text-neutral-900">
//   //               Your Experience Index
//   //             </h3>

//   //             <div className="flex items-center justify-center py-6">
//   //               <span
//   //                 aria-live="polite"
//   //                 className="font-['Afacad_Flux'] text-[32px] sm:text-[40px] md:text-[48px] font-[500] leading-[56px] text-neutral-300"
//   //               >
//   //                 {displayedIndex ?? 0}
//   //               </span>
//   //             </div>

//   //             {/* Top form horizontal line */}
//   //             <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//   //             <div className="mt-4">
//   //               <div className="text-[16px] text-neutral-800 mb-3">
//   //                 Progress Steps
//   //               </div>

//   //               {/* Demographics — completed (green) */}
//   //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//   //                 <IconWithBackground
//   //                   size="small"
//   //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//   //                   className="!bg-green-100 !rounded-full !p-3"
//   //                 />
//   //                 <span className="text-sm text-neutral-700">Demographics</span>
//   //               </div>

//   //               {/* Education — completed (green) */}
//   //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//   //                 <IconWithBackground
//   //                   size="small"
//   //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//   //                   className="!bg-green-100 !rounded-full !p-3"
//   //                 />
//   //                 <span className="text-sm text-neutral-700">Education</span>
//   //               </div>

//   //               {/* Experience — completed (green) */}
//   //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//   //                 <IconWithBackground
//   //                   size="small"
//   //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//   //                   className="!bg-green-100 !rounded-full !p-3"
//   //                 />
//   //                 <span className="text-sm text-neutral-700">Experience</span>
//   //               </div>

//   //               {/* Certifications — completed (green) */}
//   //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//   //                 <IconWithBackground
//   //                   size="small"
//   //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//   //                   className="!bg-green-100 !rounded-full !p-3"
//   //                 />
//   //                 <span className="text-sm text-neutral-700">
//   //                   Certifications
//   //                 </span>
//   //               </div>

//   //               {/* Awards — completed (green) */}
//   //               <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//   //                 <IconWithBackground
//   //                   size="small"
//   //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//   //                   className="!bg-green-100 !rounded-full !p-3"
//   //                 />
//   //                 <span className="text-sm text-neutral-700">Awards</span>
//   //               </div>

//   //               {/* Certifications — active (purple) */}
//   //               <div className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-2 mb-3" style={{background: colors.white}}>
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
//   //                   <IconWithBackground
//   //                     size="small"
//   //                     variant="neutral"
//   //                     className="!bg-white !text-violet-600"
//   //                     icon={<FeatherPackage />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm font-semibold text-neutral-900">
//   //                   Projects
//   //                 </span>
//   //               </div>
//   //             </div>
//   //           </div>
//   //         </aside>
//   //       </div>
//   //       {deleteProjectId && (
//   //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//   //           <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
//   //             <div className="flex justify-between items-center mb-4">
//   //               <h3 className="text-lg font-semibold text-neutral-900">
//   //                 Are you sure?
//   //               </h3>
//   //               <button
//   //                 onClick={() => setDeleteProjectId(null)}
//   //                 className="text-neutral-400 hover:text-neutral-600"
//   //               >
//   //                 ✕
//   //               </button>
//   //             </div>

//   //             <p className="text-sm text-neutral-600 mb-6">
//   //               Do you really want to delete this project?
//   //             </p>

//   //             <div className="flex gap-3">
//   //               <Button
//   //                 variant="neutral-secondary"
//   //                 className="flex-1"
//   //                 onClick={() => setDeleteProjectId(null)}
//   //               >
//   //                 Cancel
//   //               </Button>

//   //               <Button
//   //                 className="flex-1 rounded-3xl bg-violet-600 text-white hover:bg-violet-700"
//   //                 onClick={handleRemove}
//   //                 disabled={isSubmitting}
//   //               >
//   //                 {isSubmitting ? "Deleting..." : "Yes"}
//   //               </Button>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       )}
//   //     </div>
//   //   </>
//   // );

//   const fillFormForEdit = (p: ProjectEntry) => {
//     setEditingId(p.id);

//     setName(p.name || "");
//     setRole(p.role || "");
//     setSummary(p.summary || "");
//     setOutcome(p.outcome || "");
//     setLink(p.link || "");

//     setSelectedProject(p);
//   };

//   return (
//     <>
//       <Navbar />
//       <ToastContainer position="top-center" autoClose={3000} />

//       {/* 🎨 Linear gradient background - fixed behind everything */}
//       <div
//         className="pointer-events-none fixed inset-0 -z-10"
//         style={{
//           background: `linear-gradient(
//           to bottom,
//           #d9d9d9 0%,
//           #cfd3d6 25%,
//           #9aa6b2 55%,
//           #2E4056 100%
//         )`,
//           width: "100%",
//         }}
//       />
//       <div className="min-h-screen flex justify-center px-6 py-0">
//         <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center py-8">
//           {/* Left card */}
//           <main
//             className="
//     w-full
//     md:max-w-[480px]
//     flex flex-col gap-6
//     rounded-[28px]
//     border border-neutral-300
//     bg-white
//     px-4 sm:px-6 lg:px-8
//     py-6
//     shadow-[0_10px_30px_rgba(40,0,60,0.06)]
//   "
//           >
//             {/* top row - back + progress */}
//             <div className="flex items-center gap-4">
//               <IconButton
//                 size="small"
//                 icon={<FeatherArrowLeft />}
//                 onClick={() => {
//                   if (source === "dashboard") {
//                     navigate("/dashboard");
//                   } else {
//                     // Navigate directly to awards page
//                     navigate("/awards");
//                   }
//                 }}
//               />

//               <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//                 <div className="flex items-center gap-3">
//                   {[...Array(6)].map((_, i) => (
//                     <div
//                       key={`p-${i}`}
//                       style={{ height: 6, backgroundColor: colors.primary }}
//                       className="flex-1 rounded-full"
//                     />
//                   ))}
//                   {[...Array()].map((_, i) => (
//                     <div
//                       key={`n-${i}`}
//                       style={{ height: 6 }}
//                       className="flex-1 rounded-full bg-neutral-200"
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Header */}
//             <header className="w-full">
//               <h2 className="text-[22px] text-neutral-900">
//                 Add your projects
//               </h2>
//               <p className="text-xs text-neutral-500">Share your best work</p>
//             </header>

//             {/* Selected projects preview list */}
//             <section className="flex w-full flex-col gap-3">
//               {projects.map((p) => {
//                 const isSelected = selectedProject?.id === p.id;

//                 return (
//                   <div
//                     key={p.id}
//                     role="button"
//                     tabIndex={0}
//                     onClick={() => setSelectedProject(isSelected ? null : p)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" || e.key === " ") {
//                         e.preventDefault();
//                         setSelectedProject(isSelected ? null : p);
//                       }
//                     }}
//                     className="rounded-3xl px-4 py-3 cursor-pointer transition-all duration-200 focus:outline-none"
//                     style={{
//                       backgroundColor: isSelected
//                         ? `${colors.primary}10`
//                         : colors.white,
//                       border: `1px solid ${
//                         isSelected ? colors.primary : colors.neutral[400]
//                       }`,
//                       boxShadow: isSelected
//                         ? `0 4px 14px ${colors.primary}22`
//                         : "0 1px 3px rgba(0,0,0,0.04)",
//                     }}
//                   >
//                     {/* 🔹 TOP ROW */}
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3 min-w-0">
//                         <Avatar
//                           size="large"
//                           square
//                           className="!rounded-2xl bg-[#D9D9D9] text-BLACK-700 font-semibold"
//                         >
//                           {p.name
//                             .split(" ")
//                             .slice(0, 2)
//                             .map((s) => s[0])
//                             .join("")}
//                         </Avatar>

//                         <div className="flex flex-col min-w-0">
//                           <span className="text-sm font-semibold text-neutral-900 truncate">
//                             {p.name}
//                           </span>

//                           {p.role && (
//                             <span className="text-xs text-neutral-500 truncate">
//                               {p.role}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         {/* ✅ Edit */}
//                         <IconButton
//                           size="small"
//                           icon={<FeatherEdit2 />}
//                           aria-label={`Edit project ${p.name}`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (p.isDemo) {
//                               toast.error("Demo project cannot be edited.");
//                               return;
//                             }
//                             fillFormForEdit(p);
//                           }}
//                           className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                         />

//                         {/* ✅ Delete */}
//                         <IconButton
//                           size="small"
//                           icon={<FeatherX />}
//                           aria-label={`Delete project ${p.name}`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setDeleteProjectId(p.id);
//                           }}
//                           className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                         />
//                       </div>
//                     </div>

//                     {/* 🔹 EXPANDED DETAILS */}
//                     {isSelected && (
//                       <>
//                         <div className="my-4 border-t border-neutral-200" />

//                         <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//                           <div>
//                             <span className="font-medium">Project name:</span>{" "}
//                             {p.name}
//                           </div>
//                           <div>
//                             <span className="font-medium">Your Role:</span>{" "}
//                             {p.role}
//                           </div>
//                           {p.summary && (
//                             <div>
//                               <span className="font-medium">Summary:</span>{" "}
//                               {p.summary}
//                             </div>
//                           )}

//                           {p.outcome && (
//                             <div>
//                               <span className="font-medium">Outcome:</span>{" "}
//                               {p.outcome}
//                             </div>
//                           )}

//                           {p.link && (
//                             <div>
//                               <span className="font-medium">Project link:</span>{" "}
//                               <a
//                                 href={p.link}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-violet-700 underline break-all"
//                                 onClick={(e) => e.stopPropagation()} // 🚫 don't collapse card
//                               >
//                                 {p.link}
//                               </a>
//                             </div>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 );
//               })}
//             </section>

//             {/* Form */}
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 isEditing ? handleUpdateProject() : handleAddProject();
//               }}
//               className="flex flex-col gap-4"
//             >
//               <TextField
//                 label={
//                   <span className="text-[12px]">
//                     Project name <span className="text-red-500">*</span>{" "}
//                   </span>
//                 }
//                 helpText=""
//                 className={scTextFieldClass}
//               >
//                 <TextField.Input
//                   placeholder="e.g., Mobile app redesign"
//                   value={name}
//                   onChange={(ev) => setName(toTitleCase(ev.target.value))}
//                   className={scInputClass}
//                 />
//               </TextField>

//               <TextField
//                 label={
//                   <span className="text-[12px]">
//                     Your Role <span className="text-red-500">*</span>{" "}
//                   </span>
//                 }
//                 helpText=""
//                 className={scTextFieldClass}
//               >
//                 <TextField.Input
//                   placeholder="e.g., Product Manager"
//                   value={role}
//                   onChange={(ev) => setRole(toTitleCase(ev.target.value))}
//                   className={scInputClass}
//                 />
//               </TextField>

//               <TextField
//                 label={
//                   <span className="text-[12px]">
//                     Link <span className="text-red-500">*</span>
//                   </span>
//                 }
//                 helpText=""
//                 className={scTextFieldClass}
//               >
//                 <TextField.Input
//                   placeholder="https://"
//                   value={link}
//                   onChange={(e) => setLink(e.target.value.replace(/\s/g, ""))}
//                   onBlur={() => {
//                     if (!link) return;
//                     if (!link.startsWith("http")) {
//                       setLink("https://" + link);
//                     }
//                   }}
//                   className={scInputClass}
//                 />
//               </TextField>

//               <TextField
//                 label={<span className="text-[12px]">Summary </span>}
//                 helpText=""
//                 className={scTextFieldClass}
//               >
//                 <TextField.Input
//                   placeholder="What was the project about?"
//                   value={summary}
//                   onChange={(e) => setSummary(e.target.value)}
//                   onBlur={() => setSummary(toSentenceCase(summary))}
//                   className={scInputClass}
//                 />
//               </TextField>

//               <TextField
//                 label={<span className="text-[12px]">Outcome </span>}
//                 helpText=""
//                 className={scTextFieldClass}
//               >
//                 <TextField.Input
//                   placeholder="What was the result or impact?"
//                   value={outcome}
//                   onChange={(ev) => setOutcome(toSentenceCase(ev.target.value))}
//                   className={scInputClass}
//                 />
//               </TextField>

//               <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
//                 <Button
//                   type="button"
//                   disabled={isSubmitting}
//                   variant="neutral-secondary"
//                   icon={<FeatherPlus />}
//                   className="w-full rounded-full border border-neutral-300 h-10 px-4 flex items-center gap-2"
//                   onClick={() =>
//                     isEditing ? handleUpdateProject() : handleAddProject()
//                   }
//                 >
//                   {isSubmitting
//                     ? isEditing
//                       ? "Updating..."
//                       : "Adding..."
//                     : isEditing
//                       ? "Update project"
//                       : "Add another project"}
//                 </Button>

//                 <div className="flex-1" />

//                 {/* ✅ Cancel edit */}
//                 {isEditing && (
//                   <Button
//                     onClick={resetForm}
//                     type="button"
//                     className="w-full rounded-full h-10 mt-2 sm:mt-0"
//                     variant="brand-tertiary"
//                     style={{ backgroundColor: colors.primaryGlow }}
//                   >
//                     Cancel edit
//                   </Button>
//                 )}
//               </div>
//             </form>

//             <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//             <footer>
//               <Button
//                 onClick={handleContinue}
//                 disabled={!canContinue || isSubmitting}
//                 className="w-full h-10 rounded-full transition-all font-semibold"
//                 style={{
//                   backgroundColor:
//                     !canContinue || isSubmitting
//                       ? `${colors.accent}66` // faded when disabled
//                       : colors.accent,
//                   color: colors.accent, // black text
//                   cursor:
//                     !canContinue || isSubmitting ? "not-allowed" : "pointer",
//                   boxShadow:
//                     !canContinue || isSubmitting
//                       ? "none"
//                       : "0 6px 18px rgba(99,52,237,0.18)",
//                 }}
//               >
//                 {isSubmitting ? "Saving..." : "Continue"}
//               </Button>
//             </footer>
//           </main>

//           {/* Right panel */}
//           <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
//             <div className="lg:sticky lg:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
//               <h3 className="text-[22px] text-neutral-900">
//                 Your Experience Index
//               </h3>

//               <div className="flex items-center justify-center py-6">
//                 <span
//                   aria-live="polite"
//                   className="font-['Afacad_Flux'] text-[32px] sm:text-[40px] md:text-[48px] font-[500] leading-[56px] text-neutral-300"
//                 >
//                   {displayedIndex ?? 0}
//                 </span>
//               </div>

//               {/* Top form horizontal line */}
//               <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//               <div className="mt-4">
//                 <div className="text-[16px] text-neutral-800 mb-3">
//                   Progress Steps
//                 </div>

//                 {/* Demographics — completed (green) */}
//                 <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                   <IconWithBackground
//                     size="small"
//                     icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                     className="!bg-green-100 !rounded-full !p-3"
//                   />
//                   <span className="text-sm text-neutral-700">Demographics</span>
//                 </div>

//                 {/* Education — completed (green) */}
//                 <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                   <IconWithBackground
//                     size="small"
//                     icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                     className="!bg-green-100 !rounded-full !p-3"
//                   />
//                   <span className="text-sm text-neutral-700">Education</span>
//                 </div>

//                 {/* Experience — completed (green) */}
//                 <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                   <IconWithBackground
//                     size="small"
//                     icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                     className="!bg-green-100 !rounded-full !p-3"
//                   />
//                   <span className="text-sm text-neutral-700">Experience</span>
//                 </div>

//                 {/* Certifications — completed (green) */}
//                 <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                   <IconWithBackground
//                     size="small"
//                     icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                     className="!bg-green-100 !rounded-full !p-3"
//                   />
//                   <span className="text-sm text-neutral-700">
//                     Certifications
//                   </span>
//                 </div>

//                 {/* Awards — completed (green) */}
//                 <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                   <IconWithBackground
//                     size="small"
//                     icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                     className="!bg-green-100 !rounded-full !p-3"
//                   />
//                   <span className="text-sm text-neutral-700">Awards</span>
//                 </div>

//                 {/* Certifications — active (purple) */}
//                 <div
//                   className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-2 mb-3"
//                   style={{ background: colors.primary }}
//                 >
//                   <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
//                     <IconWithBackground
//                       size="small"
//                       variant="neutral"
//                       className="!bg-white !text-violet-600"
//                       icon={<FeatherPackage />}
//                     />
//                   </div>
//                   <span
//                     className="text-sm font-medium text-neutral-900"
//                     style={{ color: colors.white }}
//                   >
//                     Projects
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//         {deleteProjectId && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//             <div
//               className="w-[360px] rounded-2xl p-6 shadow-xl"
//               style={{ backgroundColor: colors.white }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3
//                   className="text-lg font-semibold"
//                   style={{ color: colors.accent }}
//                 >
//                   Are you sure?
//                 </h3>
//                 <button
//                   onClick={() => setDeleteProjectId(null)}
//                   className="transition"
//                   style={{ color: colors.neutral[600] }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.color = colors.accent)
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.color = colors.neutral[600])
//                   }
//                 >
//                   ✕
//                 </button>
//               </div>

//               <p
//                 className="text-sm mb-6"
//                 style={{ color: colors.neutral[600] }}
//               >
//                 Do you really want to delete this project?
//               </p>

//               <div className="flex gap-3">
//                 {/* Cancel */}
//                 <Button
//                   className="flex-1 rounded-3xl transition"
//                   onClick={() => setDeleteProjectId(null)}
//                   style={{
//                     backgroundColor: colors.primary,
//                     color: colors.accent,
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.backgroundColor = colors.secondary)
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.backgroundColor = colors.primary)
//                   }
//                 >
//                   Cancel
//                 </Button>

//                 {/* Yes */}
//                 <Button
//                   className="flex-1 rounded-3xl transition"
//                   onClick={handleRemove}
//                   disabled={isSubmitting}
//                   style={{
//                     backgroundColor: isSubmitting
//                       ? `${colors.red}66`
//                       : colors.red,
//                     color: colors.accent,
//                     cursor: isSubmitting ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isSubmitting)
//                       e.currentTarget.style.backgroundColor = colors.red;
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isSubmitting)
//                       e.currentTarget.style.backgroundColor = colors.red;
//                   }}
//                 >
//                   {isSubmitting ? "Deleting..." : "Delete"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }

// src/components/Projects.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/components/Button";
import { Avatar } from "../ui/components/Avatar";
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
  FeatherChevronRight,
  FeatherLink,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "../common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";
import { useAppDispatch } from "../store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";

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
  const source = location.state?.source;
  const dispatch = useAppDispatch();

  const userId = localStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  // Minimalist field styles (matching Awards)
  const fieldClass = "w-full mb-4";
  const inputClass =
    "w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200";
  const labelClass = "text-xs font-medium text-neutral-500 mb-1 block";

  const displayedIndex = experiencePoints?.total ?? 0;

  // GET projects
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
    }
  }, [userId]);

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
    setFocusedField(null);
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
      return;
    }

    if (!role.trim()) {
      toast.error("Role is required.");
      return;
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

      const res = await API(
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

      if (res?.navigation) {
        dispatch(setNavigation(res.navigation));
      }

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
    console.log("\n========== 🚀 PROJECTS CONTINUE CLICKED ==========");
    console.log("projects.length:", projects.length);
    console.log("hasRealProject:", hasRealProject);
    console.log("source:", source);

    if (!hasRealProject) {
      console.log("❌ No real project found, showing error");
      toast.error("Please add at least one project to continue.");
      return;
    }

    // Always go to skill-index-intro page
    console.log("➡️ Navigating to skill-index-intro page");
    navigate("/skill-index-intro", { state: { source } });
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

  const steps = [
    { label: "Demographics", icon: <FeatherCheck />, completed: true },
    { label: "Education", icon: <FeatherCheck />, completed: true },
    { label: "Experience", icon: <FeatherCheck />, completed: true },
    { label: "Certifications", icon: <FeatherCheck />, completed: true },
    { label: "Awards", icon: <FeatherCheck />, completed: true },
    { label: "Projects", icon: <FeatherPackage />, active: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <ToastContainer position="top-center" autoClose={2000} />

      <Navbar />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple header with progress */}
        <div className="flex items-center gap-3 mb-8">
          <IconButton
            size="small"
            icon={<FeatherArrowLeft />}
            onClick={() => {
              if (source === "dashboard") {
                navigate("/dashboard");
              } else {
                navigate("/awards");
              }
            }}
            className="text-neutral-600 hover:text-neutral-900"
          />
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1 flex-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: "100%", backgroundColor: colors.primary }}
              />
            </div>
            <span className="text-xs text-neutral-500 ml-2">6/6</span>
          </div>
        </div>

        {/* Main content - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-neutral-900 mb-2">
                  Add your projects
                </h1>
                <p className="text-sm text-neutral-500 font-light">
                  Share your best work to showcase your skills
                </p>
              </div>

              {/* Projects List - Minimalist */}
              {projects.length > 0 && (
                <div className="mb-8 space-y-3">
                  {projects.map((p) => {
                    const isSelected = selectedProject?.id === p.id;

                    return (
                      <div
                        key={p.id}
                        onClick={() =>
                          setSelectedProject(isSelected ? null : p)
                        }
                        className="p-4 rounded-xl border transition-all duration-200 cursor-pointer"
                        style={{
                          borderColor: isSelected
                            ? colors.primary
                            : colors.neutral[200],
                          backgroundColor: isSelected
                            ? `${colors.primary}04`
                            : "white",
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium"
                              style={{
                                backgroundColor: colors.primaryGlow,
                                color: colors.neutral[700],
                              }}
                            >
                              {p.name
                                .split(" ")
                                .slice(0, 2)
                                .map((s) => s[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral-900">
                                {p.name}
                              </h3>
                              <p className="text-sm text-neutral-500 mt-0.5">
                                {p.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (p.isDemo) {
                                  toast.error("Demo project cannot be edited.");
                                  return;
                                }
                                fillFormForEdit(p);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteProjectId(p.id);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                            {p.summary && (
                              <p className="text-sm text-neutral-600">
                                <span className="text-neutral-400">
                                  Summary:
                                </span>{" "}
                                {p.summary}
                              </p>
                            )}
                            {p.outcome && (
                              <p className="text-sm text-neutral-600">
                                <span className="text-neutral-400">
                                  Outcome:
                                </span>{" "}
                                {p.outcome}
                              </p>
                            )}
                            {p.link && (
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm flex items-center gap-1"
                                style={{ color: colors.primary }}
                              >
                                <FeatherLink className="w-3 h-3" />
                                View Project
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  isEditing ? handleUpdateProject() : handleAddProject();
                }}
                className="space-y-6"
              >
                {/* Project Name */}
                <div className={fieldClass}>
                  <label className={labelClass}>PROJECT NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(toTitleCase(e.target.value))}
                    onFocus={() => setFocusedField("name")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="e.g., Mobile app redesign"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "name" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Role */}
                <div className={fieldClass}>
                  <label className={labelClass}>YOUR ROLE</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(toTitleCase(e.target.value))}
                    onFocus={() => setFocusedField("role")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="e.g., Product Manager"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "role" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Link */}
                <div className={fieldClass}>
                  <label className={labelClass}>PROJECT LINK</label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value.replace(/\s/g, ""))}
                    onBlur={() => {
                      if (!link) return;
                      if (!link.startsWith("http")) {
                        setLink("https://" + link);
                      }
                    }}
                    onFocus={() => setFocusedField("link")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="https://"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "link" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Summary */}
                <div className={fieldClass}>
                  <label className={labelClass}>SUMMARY</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    onBlur={() => setSummary(toSentenceCase(summary))}
                    onFocus={() => setFocusedField("summary")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="What was the project about?"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    style={{
                      borderBottomColor:
                        focusedField === "summary" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Outcome */}
                <div className={fieldClass}>
                  <label className={labelClass}>OUTCOME</label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(toSentenceCase(e.target.value))}
                    onFocus={() => setFocusedField("outcome")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="What was the result or impact?"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    style={{
                      borderBottomColor:
                        focusedField === "outcome" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: colors.primaryGlow,
                      color: colors.neutral[700],
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                  >
                    <FeatherPlus className="w-4 h-4" />
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update Project"
                        : "Add Project"}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full py-3 px-4 rounded-full text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: colors.neutral[100],
                        color: colors.neutral[600],
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Continue Button */}
              {projects.length > 0 && (
                <div className="mt-8">
                  <button
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-40"
                    style={{
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Progress Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-24">
              {/* Experience Index */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-500 mb-3">
                  EXPERIENCE INDEX
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-light text-neutral-900">
                    {displayedIndex ?? 0}
                  </span>
                  <span className="text-xs text-neutral-400">/100</span>
                </div>
              </div>

              <div className="h-px bg-neutral-100 my-4" />

              {/* Steps */}
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-4">
                  PROGRESS
                </h3>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.label}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl transition-colors"
                      style={{
                        backgroundColor:
                          index === 5 ? `${colors.primary}08` : "transparent",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            index <= 5 ? colors.primary : colors.neutral[100],
                          color: index <= 5 ? "white" : colors.neutral[400],
                        }}
                      >
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <span
                        className="text-sm flex-1"
                        style={{
                          color:
                            index === 5
                              ? colors.primary
                              : index < 5
                                ? colors.neutral[900]
                                : colors.neutral[500],
                          fontWeight: index === 5 ? 500 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                      {index === 5 && (
                        <FeatherChevronRight
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-[320px] bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Delete Project?
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteProjectId(null)}
                className="flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: colors.neutral[100],
                  color: colors.neutral[600],
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 rounded-full text-sm font-medium text-white transition-colors"
                style={{
                  backgroundColor: colors.red,
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
