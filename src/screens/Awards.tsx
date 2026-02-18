// // src/components/Awards.tsx - Fixed footer positioning
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Avatar } from "../ui/components/Avatar";
// import { Button } from "../ui/components/Button";
// import HeaderLogo from "../ui/components/HeaderLogo";
// import { IconButton } from "../ui/components/IconButton";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import { TextField } from "../ui/components/TextField";
// import {
//   FeatherArrowLeft,
//   FeatherAward,
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
// import { setNavigation } from "../store/slices/onboardingSlice";

// type AwardEntry = {
//   id: string;
//   name: string;
//   description: string | null;
//   year: string;
//   isDemo?: boolean;
// };

// const toTitleCase = (value: string) =>
//   value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

// const toSentenceCase = (v: string) =>
//   v ? v.charAt(0).toUpperCase() + v.slice(1) : v;

// const normalizeSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

// function EndYearPicker({
//   value,
//   onChange,
//   disabled = false,
//   minYear = 1950,
//   maxYear = new Date().getFullYear(),
// }: {
//   value: string;
//   onChange: (year: string) => void;
//   disabled?: boolean;
//   minYear?: number;
//   maxYear?: number;
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const years = Array.from(
//     { length: maxYear - minYear + 1 },
//     (_, i) => maxYear - i,
//   );

//   return (
//     <div className="relative" ref={ref}>
//       <input
//         readOnly
//         disabled={disabled}
//         value={value}
//         placeholder="End Year"
//         onClick={() => !disabled && setOpen((v) => !v)}
//         className={`w-full h-10 px-4 rounded-full cursor-pointer border border-neutral-300 focus:outline-none ${
//           disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"
//         }`}
//       />

//       {open && (
//         <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3 max-h-60 overflow-auto">
//           <div className="grid grid-cols-4 gap-2 text-sm">
//             {years.map((year) => (
//               <button
//                 key={year}
//                 type="button"
//                 onClick={() => {
//                   onChange(String(year));
//                   setOpen(false);
//                 }}
//                 className="py-2 px-3 rounded-lg transition text-sm sm:text-base"
//                 style={{
//                   backgroundColor:
//                     value === String(year) ? colors.accent : "transparent",
//                   color:
//                     value === String(year)
//                       ? colors.background
//                       : colors.neutral[800],
//                   cursor: "pointer",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (value !== String(year)) {
//                     e.currentTarget.style.backgroundColor = colors.primaryGlow;
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (value !== String(year)) {
//                     e.currentTarget.style.backgroundColor = "transparent";
//                   }
//                 }}
//               >
//                 {year}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function Awards() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const source = location.state?.source;

//   // ✅ STEP 2: Add dispatch
//   const dispatch = useAppDispatch();
//   console.log("AWARDS source:", source);
//   const userId = localStorage.getItem("userId");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const MAX_AWARDS = 5;

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [year, setYear] = useState("");
//   const [startYear, setStartYear] = useState("");
//   const [endYear, setEndYear] = useState("");
//   const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
//   const [selectedAward, setSelectedAward] = useState<any | null>(null);
//   const [deleteAwardId, setDeleteAwardId] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const isEditing = !!editingId;

//   type ExperiencePoints = {
//     demographics?: number;
//     education?: number;
//     workExperience?: number;
//     certifications?: number;
//     awards?: number;
//   };

//   const [experiencePoints, setExperiencePoints] =
//     useState<ExperiencePoints | null>(null);

//   const displayedIndex =
//     (experiencePoints?.demographics ?? 0) +
//     (experiencePoints?.education ?? 0) +
//     (experiencePoints?.workExperience ?? 0) +
//     (experiencePoints?.certifications ?? 0) +
//     (experiencePoints?.awards ?? 0);

//   const fetchAwards = async () => {
//     if (!userId) return;

//     try {
//       const res = await API("GET", URL_PATH.getAwards, undefined, {
//         "user-id": userId,
//       });

//       const apiAwards = Array.isArray(res?.data) ? res.data : [];

//       const mappedAwards: AwardEntry[] = apiAwards.map((a: any) => ({
//         id: a._id,
//         name: a.awardName,
//         description: a.description || null,
//         year: String(a.year),
//         isDemo: false,
//       }));

//       setAwards(mappedAwards);
//     } catch (error) {
//       console.error("Failed to fetch awards", error);
//       setAwards([]);
//     }
//   };

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

//   const [awards, setAwards] = useState<AwardEntry[]>([]);

//   useEffect(() => {
//     if (!userId) return;
//     fetchAwards();
//     fetchExperienceIndex();
//   }, [userId]);

//   const scTextFieldClass =
//     "w-full [&>label]:text-[12px] [&>label]:font-medium [&>p]:text-[11px] [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-9";
//   const scInputClass =
//     "rounded-full h-9 px-3 text-[12px] placeholder:text-[12px] bg-white !border-none focus:ring-0 w-full";

//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setEndYear("");
//     setEditingId(null);
//   };

//   const validateAward = (
//     name: string,
//     endYear: string,
//     description: string,
//   ): string | null => {
//     if (!name.trim()) return "Award name is required";

//     if (!endYear.trim()) return "Year is required";

//     if (!/^\d{4}$/.test(endYear)) return "Year must be a valid 4-digit year";

//     const yearNum = Number(endYear);
//     const currentYear = new Date().getFullYear();

//     if (yearNum < 2000 || yearNum > currentYear)
//       return `Year must be between 2000 and ${currentYear}`;

//     if (description && description.length > 300)
//       return "Description cannot exceed 300 characters";

//     return null;
//   };

//   const handleAddAward = async () => {
//     if (awards.length >= MAX_AWARDS) {
//       toast.error("You can add a maximum of 5 awards only.");
//       return;
//     }
//     if (isSubmitting) return;

//     const error = validateAward(name, endYear, description);
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const yearNum = Number(endYear);

//       const res = await API(
//         "POST",
//         URL_PATH.awards,
//         {
//           awards: [
//             {
//               awardName: toTitleCase(normalizeSpaces(name)),
//               description: description.trim() || null,
//               year: yearNum,
//             },
//           ],
//         },

//         { "user-id": userId },
//       );

//       toast.success("Award added successfully");
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }
//       await fetchAwards();
//       await fetchExperienceIndex();

//       resetForm();
//     } catch (err: any) {
//       if (err?.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else {
//         toast.error("You can add a maximum of 5 awards only.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRemove = async () => {
//     if (!deleteAwardId || isSubmitting) return;

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       await API("POST", `${URL_PATH.deleteAward}/${deleteAwardId}`, undefined, {
//         "user-id": userId,
//       });

//       setAwards((prev) => prev.filter((a) => a.id !== deleteAwardId));

//       if (selectedAward?.id === deleteAwardId) {
//         setSelectedAward(null);
//       }

//       await fetchExperienceIndex();
//       setDeleteAwardId(null);
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to delete award");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const hasRealAward = awards.some((a) => !a.isDemo);
//   const canContinue = hasRealAward;

//   const handleContinue = () => {
//     if (!hasRealAward) {
//       toast.error("Please add at least one award to continue.");
//       return;
//     }

//     if (source === "dashboard") {
//       navigate("/dashboard");
//     } else {
//       navigate("/projects", { state: { source } });
//     }
//   };

//   const fillFormForEdit = (a: AwardEntry) => {
//     setEditingId(a.id);

//     setName(a.name || "");
//     setDescription(a.description || "");
//     setEndYear(a.year || "");

//     setSelectedAward(a);
//   };

//   return (
//     <div className="min-h-screen flex flex-col relative overflow-hidden">
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

//       {/* Header and content with z-index to stay above background */}
//       <div className="relative z-10 flex flex-col flex-1">
//         <Navbar />
//         <ToastContainer position="top-center" autoClose={3000} />

//         <div className="flex-1 flex justify-center px-4 sm:px-6 py-0 sm:py-0">
//           <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center py-8">
//             {/* Left card */}
//             <main className="w-full md:max-w-[448px] flex flex-col gap-6 rounded-[28px] border border-neutral-300 bg-white px-4 sm:px-6 md:px-8 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.06)]">
//               {/* top row - back + progress */}
//               <div className="flex items-center gap-4">
//                 {/* <IconButton
//                   size="small"
//                   icon={<FeatherArrowLeft />}
//                   onClick={async () => {
//                     try {
//                       if (source === "dashboard") {
//                         navigate("/dashboard");
//                         return;
//                       }

//                       const res = await API("POST", "/auth/verify-route", {
//                         route: "/certifications",
//                       });

//                       if (res.allowed) {
//                         navigate("/certifications", { state: { source } });
//                       }
//                     } catch {
//                       // silent fail
//                     }
//                   }}
//                 /> */}

//                 <IconButton
//                   size="small"
//                   icon={<FeatherArrowLeft />}
//                   onClick={() => {
//                     if (source === "dashboard") {
//                       navigate("/dashboard");
//                     } else {
//                       // Go directly to certifications page
//                       navigate("/certifications");
//                     }
//                   }}
//                 />
//                 <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//                   <div className="flex items-center gap-3">
//                     {[...Array(5)].map((_, i) => (
//                       <div
//                         key={`p-${i}`}
//                         style={{ height: 6, backgroundColor: colors.primary }}
//                         className="flex-1 rounded-full"
//                       />
//                     ))}
//                     {[...Array(1)].map((_, i) => (
//                       <div
//                         key={`n-${i}`}
//                         style={{ height: 6 }}
//                         className="flex-1 rounded-full bg-neutral-300"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Header */}
//               <header className=" w-full">
//                 <h2 className="text-[22px] text-neutral-900">
//                   Add awards and extracurriculars
//                 </h2>
//                 <p className="text-xs text-neutral-500">
//                   These help recruiters understand your interests and
//                   achievements
//                 </p>
//               </header>

//               <section className="flex w-full flex-col gap-3">
//                 {awards.map((a) => {
//                   const isSelected = selectedAward?.id === a.id;

//                   return (
//                     <div
//                       key={a.id}
//                       role="button"
//                       tabIndex={0}
//                       onClick={() => setSelectedAward(isSelected ? null : a)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           e.preventDefault();
//                           setSelectedAward(isSelected ? null : a);
//                         }
//                       }}
//                       className="rounded-3xl px-4 py-3 cursor-pointer transition-all duration-200 focus:outline-none"
//                       style={{
//                         backgroundColor: isSelected
//                           ? `${colors.primary}10`
//                           : colors.white,
//                         border: `1px solid ${
//                           isSelected ? colors.primary : colors.neutral[400]
//                         }`,
//                         boxShadow: isSelected
//                           ? `0 4px 14px ${colors.primary}22`
//                           : "0 1px 3px rgba(0,0,0,0.04)",
//                       }}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3 min-w-0">
//                           <Avatar
//                             size="large"
//                             square
//                             className="!rounded-2xl font-semibold"
//                             style={{
//                               backgroundColor: `${colors.primary}22`,
//                               color: colors.primary,
//                             }}
//                           >
//                             {a.name
//                               .split(" ")
//                               .slice(0, 2)
//                               .map((s) => s[0])
//                               .join("")}
//                           </Avatar>

//                           <div className="flex flex-col min-w-0">
//                             <span className="text-sm font-semibold text-neutral-900 truncate">
//                               {a.name}
//                             </span>

//                             {a.description && (
//                               <span className="text-xs text-neutral-500 line-clamp-1">
//                                 {a.description}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="flex flex-col items-end gap-2 shrink-0">
//                           <IconButton
//                             size="small"
//                             icon={<FeatherX />}
//                             aria-label={`Delete award ${a.name}`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setDeleteAwardId(a.id);
//                             }}
//                             className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                           />

//                           <span className="text-xs text-neutral-500">
//                             {a.year}
//                           </span>
//                         </div>
//                       </div>

//                       {isSelected && (
//                         <>
//                           <div className="my-4 border-t border-neutral-200" />

//                           <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//                             <div>
//                               <span className="font-medium">Award name:</span>{" "}
//                               {a.name}
//                             </div>

//                             {a.description && (
//                               <div>
//                                 <span className="font-medium">
//                                   Description:
//                                 </span>{" "}
//                                 {a.description}
//                               </div>
//                             )}

//                             {a.year && (
//                               <div>
//                                 <span className="font-medium">Year:</span>{" "}
//                                 {a.year}
//                               </div>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   );
//                 })}
//               </section>

//               {/* Form */}
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAddAward();
//                 }}
//                 className="flex flex-col gap-4 mt-2"
//               >
//                 <TextField
//                   label={
//                     <span className="text-[12px]">
//                       Award or Activity Name{" "}
//                       <span className="text-red-500">*</span>{" "}
//                     </span>
//                   }
//                   helpText=""
//                   className={scTextFieldClass}
//                 >
//                   <TextField.Input
//                     placeholder="e.g., Hackathon Winner"
//                     value={name}
//                     onChange={(e) => setName(toTitleCase(e.target.value))}
//                     className={scInputClass}
//                   />
//                 </TextField>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-[12px] font-medium">
//                     Year <span className="text-red-500">*</span>
//                   </label>
//                   <EndYearPicker
//                     value={endYear}
//                     onChange={setEndYear}
//                     minYear={Number(startYear) || 1950}
//                     maxYear={new Date().getFullYear()}
//                   />
//                 </div>

//                 <TextField
//                   label={<span className="text-[12px]">Description</span>}
//                   helpText=""
//                   className={scTextFieldClass}
//                 >
//                   <TextField.Input
//                     placeholder="Brief description of the achievement or role"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     onBlur={() => setDescription(toSentenceCase(description))}
//                     className={scInputClass}
//                   />
//                 </TextField>

//                 <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
//                   <Button
//                     type="button"
//                     disabled={isSubmitting}
//                     variant="neutral-secondary"
//                     icon={<FeatherPlus />}
//                     className="w-full rounded-full border border-neutral-300 h-10 px-4 flex items-center gap-2"
//                     onClick={handleAddAward}
//                   >
//                     {isSubmitting
//                       ? isEditing
//                         ? "Updating..."
//                         : "Adding..."
//                       : isEditing
//                         ? "Update award"
//                         : "Add another award"}
//                   </Button>

//                   <div className="flex-1" />

//                   {/* ✅ Cancel edit */}
//                   {isEditing && (
//                     <Button
//                       onClick={resetForm}
//                       type="button"
//                       className="w-full rounded-full h-10 mt-2 sm:mt-0"
//                       variant="brand-tertiary"
//                       style={{ backgroundColor: colors.primaryGlow }}
//                     >
//                       Cancel edit
//                     </Button>
//                   )}
//                 </div>
//               </form>

//               <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//               <footer>
//                 <Button
//                   onClick={handleContinue}
//                   disabled={!canContinue || isSubmitting}
//                   className="w-full h-10 rounded-full text-background transition-all"
//                   style={{
//                     backgroundColor:
//                       !canContinue || isSubmitting
//                         ? `${colors.accent}66`
//                         : colors.accent,
//                     cursor:
//                       !canContinue || isSubmitting ? "not-allowed" : "pointer",
//                     boxShadow:
//                       !canContinue || isSubmitting
//                         ? "none"
//                         : "0 6px 18px rgba(99,52,237,0.18)",
//                   }}
//                 >
//                   {isSubmitting ? "Saving..." : "Continue"}
//                 </Button>
//               </footer>
//             </main>

//             {/* Right panel */}
//             <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
//               <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
//                 <h3 className="text-[22px] text-neutral-900">
//                   Your Experience Index
//                 </h3>

//                 <div className="flex items-center justify-center py-6">
//                   <span
//                     aria-live="polite"
//                     className="font-['Afacad_Flux'] text-[32px] sm:text-[40px] md:text-[48px] font-[500] leading-[56px] text-neutral-300"
//                   >
//                     {displayedIndex ?? 0}
//                   </span>
//                 </div>

//                 <div className="h-px bg-neutral-300" />

//                 <div className="mt-4">
//                   <div className="text-[16px] text-neutral-800 mb-3">
//                     Progress Steps
//                   </div>

//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3 hover:bg-neutral-50"
//                   >
//                     <IconWithBackground
//                       size="small"
//                       icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                       className="!bg-green-100 !rounded-full !p-3"
//                     />
//                     <span className="text-sm text-neutral-700">
//                       Demographics
//                     </span>
//                   </button>

//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                     <IconWithBackground
//                       size="small"
//                       icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                       className="!bg-green-100 !rounded-full !p-3"
//                     />
//                     <span className="text-sm text-neutral-700">Education</span>
//                   </div>

//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                     <IconWithBackground
//                       size="small"
//                       icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                       className="!bg-green-100 !rounded-full !p-3"
//                     />
//                     <span className="text-sm text-neutral-700">Experience</span>
//                   </div>

//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                     <IconWithBackground
//                       size="small"
//                       icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                       className="!bg-green-100 !rounded-full !p-3"
//                     />
//                     <span className="text-sm text-neutral-700">
//                       Certifications
//                     </span>
//                   </div>

//                   <div
//                     style={{ backgroundColor: colors.primary }}
//                     className="flex items-center gap-3 rounded-2xl px-4 py-2 mb-3"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
//                       <IconWithBackground
//                         size="small"
//                         variant="neutral"
//                         className="!bg-white"
//                         icon={<FeatherAward />}
//                       />
//                     </div>
//                     <span
//                       className="text-sm font-medium text-neutral-900"
//                       style={{ color: colors.white }}
//                     >
//                       Awards
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2">
//                     <IconWithBackground
//                       variant="neutral"
//                       size="small"
//                       className="!bg-white !text-neutral-600"
//                       icon={<FeatherPackage />}
//                     />
//                     <span className="text-sm text-neutral-500">Projects</span>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {deleteAwardId && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//               <div
//                 className="w-[360px] rounded-2xl p-6 shadow-xl"
//                 style={{ backgroundColor: colors.white }}
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h3
//                     className="text-lg font-semibold"
//                     style={{ color: colors.accent }}
//                   >
//                     Are you sure?
//                   </h3>

//                   <button
//                     onClick={() => setDeleteAwardId(null)}
//                     className="transition"
//                     style={{ color: colors.neutral[600] }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.color = colors.accent)
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.color = colors.neutral[600])
//                     }
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <p
//                   className="text-sm mb-6"
//                   style={{ color: colors.neutral[600] }}
//                 >
//                   Do you really want to delete this award?
//                 </p>

//                 <div className="flex gap-3">
//                   <Button
//                     variant="brand-tertiary"
//                     className="flex-1 !rounded-3xl"
//                     onClick={() => setDeleteAwardId(null)}
//                     style={{
//                       backgroundColor: colors.primary,
//                       color: colors.white,
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!isSubmitting)
//                         e.currentTarget.style.backgroundColor =
//                           colors.secondary;
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!isSubmitting)
//                         e.currentTarget.style.backgroundColor = colors.primary;
//                     }}
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     className="flex-1 !rounded-3xl transition"
//                     onClick={handleRemove}
//                     disabled={isSubmitting}
//                     style={{
//                       backgroundColor: isSubmitting
//                         ? `${colors.red}55`
//                         : colors.red,
//                       color: colors.white,
//                       cursor: isSubmitting ? "not-allowed" : "pointer",
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!isSubmitting)
//                         e.currentTarget.style.backgroundColor = colors.red;
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!isSubmitting)
//                         e.currentTarget.style.backgroundColor = colors.red;
//                     }}
//                   >
//                     {isSubmitting ? "Deleting..." : "Delete"}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// src/components/Awards.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherAward,
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
  FeatherEdit2,
  FeatherChevronRight,
  FeatherCalendar,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "../common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";
import { useAppDispatch } from "../store/hooks";
import { setNavigation } from "../store/slices/onboardingSlice";

type AwardEntry = {
  id: string;
  name: string;
  description: string | null;
  year: string;
  isDemo?: boolean;
};

const toTitleCase = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const toSentenceCase = (v: string) =>
  v ? v.charAt(0).toUpperCase() + v.slice(1) : v;

const normalizeSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

// YearPicker Component - Minimalist (matching Certifications)
function YearPicker({
  value,
  onChange,
  disabled = false,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
}: {
  value: string;
  onChange: (year: string) => void;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  );

  return (
    <div className="relative" ref={ref}>
      <input
        readOnly
        disabled={disabled}
        value={value}
        placeholder="YYYY"
        onFocus={() => {
          if (!disabled) {
            setOpen(true);
            setFocused(true);
          }
        }}
        onBlur={() => setFocused(false)}
        className={`w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={{ borderBottomColor: focused ? colors.primary : undefined }}
      />

      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white shadow-lg p-4 max-h-60 overflow-auto">
          <div className="grid grid-cols-4 gap-2">
            {years.map((year) => {
              const isSelected = value === String(year);

              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    onChange(String(year));
                    setOpen(false);
                  }}
                  className="py-2 px-2 text-sm rounded-lg transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary
                      : "transparent",
                    color: isSelected ? "white" : colors.neutral[700],
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor =
                        colors.primaryGlow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Awards() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source;
  const dispatch = useAppDispatch();

  const userId = localStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const MAX_AWARDS = 5;

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [selectedAward, setSelectedAward] = useState<any | null>(null);
  const [deleteAwardId, setDeleteAwardId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = !!editingId;

  type ExperiencePoints = {
    demographics?: number;
    education?: number;
    workExperience?: number;
    certifications?: number;
    awards?: number;
  };

  const [experiencePoints, setExperiencePoints] =
    useState<ExperiencePoints | null>(null);
  const [awards, setAwards] = useState<AwardEntry[]>([]);

  // Minimalist field styles (matching Certifications)
  const fieldClass = "w-full mb-4";
  const inputClass =
    "w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200";
  const labelClass = "text-xs font-medium text-neutral-500 mb-1 block";

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) +
    (experiencePoints?.education ?? 0) +
    (experiencePoints?.workExperience ?? 0) +
    (experiencePoints?.certifications ?? 0) +
    (experiencePoints?.awards ?? 0);

  const fetchAwards = async () => {
    if (!userId) return;

    try {
      const res = await API("GET", URL_PATH.getAwards, undefined, {
        "user-id": userId,
      });

      const apiAwards = Array.isArray(res?.data) ? res.data : [];

      const mappedAwards: AwardEntry[] = apiAwards.map((a: any) => ({
        id: a._id,
        name: a.awardName,
        description: a.description || null,
        year: String(a.year),
        isDemo: false,
      }));

      setAwards(mappedAwards);
    } catch (error) {
      console.error("Failed to fetch awards", error);
      setAwards([]);
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
    if (!userId) return;
    fetchAwards();
    fetchExperienceIndex();
  }, [userId]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setYear("");
    setEditingId(null);
    setFocusedField(null);
  };

  const validateAward = (): string | null => {
    if (!name.trim()) return "Award name is required";
    if (!year.trim()) return "Year is required";
    if (!/^\d{4}$/.test(year)) return "Year must be a valid 4-digit year";

    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();

    if (yearNum < 2000 || yearNum > currentYear)
      return `Year must be between 2000 and ${currentYear}`;

    if (description && description.length > 300)
      return "Description cannot exceed 300 characters";

    return null;
  };

  const handleAddAward = async () => {
    if (awards.length >= MAX_AWARDS) {
      toast.error("You can add a maximum of 5 awards only.");
      return;
    }
    if (isSubmitting) return;

    const error = validateAward();
    if (error) {
      toast.error(error);
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const isDuplicate = awards.some(
      (a) => a.name.toLowerCase() === name.toLowerCase().trim(),
    );

    if (isDuplicate) {
      toast.error("This award already exists.");
      return;
    }

    try {
      setIsSubmitting(true);

      const yearNum = Number(year);

      const res = await API(
        "POST",
        URL_PATH.awards,
        {
          awards: [
            {
              awardName: toTitleCase(normalizeSpaces(name)),
              description: description.trim() || null,
              year: yearNum,
            },
          ],
        },
        { "user-id": userId },
      );

      toast.success("Award added successfully");

      if (res?.navigation) {
        dispatch(setNavigation(res.navigation));
      }

      await fetchAwards();
      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add award");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!deleteAwardId || isSubmitting) return;

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API("POST", `${URL_PATH.deleteAward}/${deleteAwardId}`, undefined, {
        "user-id": userId,
      });

      setAwards((prev) => prev.filter((a) => a.id !== deleteAwardId));

      if (selectedAward?.id === deleteAwardId) {
        setSelectedAward(null);
      }

      await fetchExperienceIndex();
      setDeleteAwardId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete award");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRealAward = awards.some((a) => !a.isDemo);
  const canContinue = hasRealAward;

  const handleContinue = () => {
    console.log("\n========== 🚀 CONTINUE BUTTON CLICKED ==========");
    console.log("hasRealAward:", hasRealAward);
    console.log("source:", source);
    console.log("awards.length:", awards.length);

    if (!hasRealAward) {
      console.log("❌ No real award found, showing error");
      toast.error("Please add at least one award to continue.");
      return;
    }

    if (source === "dashboard") {
      console.log("➡️ Navigating to dashboard (source === 'dashboard')");
      navigate("/dashboard");
    } else {
      console.log("➡️ Navigating to projects page");
      navigate("/projects", { state: { source } });
    }
  };

  const fillFormForEdit = (a: AwardEntry) => {
    setEditingId(a.id);
    setName(a.name || "");
    setDescription(a.description || "");
    setYear(a.year || "");
    setSelectedAward(a);
  };

  const steps = [
    { label: "Demographics", icon: <FeatherCheck />, completed: true },
    { label: "Education", icon: <FeatherCheck />, completed: true },
    { label: "Experience", icon: <FeatherCheck />, completed: true },
    { label: "Certifications", icon: <FeatherCheck />, completed: true },
    { label: "Awards", icon: <FeatherAward />, active: true },
    { label: "Projects", icon: <FeatherPackage /> },
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
                navigate("/certifications");
              }
            }}
            className="text-neutral-600 hover:text-neutral-900"
          />
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1 flex-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: "83.33%", backgroundColor: colors.primary }}
              />
            </div>
            <span className="text-xs text-neutral-500 ml-2">5/6</span>
          </div>
        </div>

        {/* Main content - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-neutral-900 mb-2">
                  Add awards and extracurriculars
                </h1>
                <p className="text-sm text-neutral-500 font-light">
                  These help recruiters understand your interests and
                  achievements
                </p>
              </div>

              {/* Awards List - Minimalist */}
              {awards.length > 0 && (
                <div className="mb-8 space-y-3">
                  {awards.map((a) => {
                    const isSelected = selectedAward?.id === a.id;

                    return (
                      <div
                        key={a.id}
                        onClick={() => setSelectedAward(isSelected ? null : a)}
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
                              {a.name
                                .split(" ")
                                .slice(0, 2)
                                .map((s) => s[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral-900">
                                {a.name}
                              </h3>
                              {a.description && (
                                <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">
                                  {a.description}
                                </p>
                              )}
                              <p className="text-xs text-neutral-400 mt-1">
                                {a.year}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fillFormForEdit(a);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteAwardId(a.id);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddAward();
                }}
                className="space-y-6"
              >
                {/* Award Name */}
                <div className={fieldClass}>
                  <label className={labelClass}>AWARD NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(toTitleCase(e.target.value))}
                    onFocus={() => setFocusedField("name")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="e.g., Hackathon Winner"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "name" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Year */}
                <div className={fieldClass}>
                  <label className={labelClass}>YEAR</label>
                  <YearPicker value={year} onChange={setYear} />
                </div>

                {/* Description */}
                <div className={fieldClass}>
                  <label className={labelClass}>DESCRIPTION</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => setDescription(toSentenceCase(description))}
                    onFocus={() => setFocusedField("description")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="Brief description of the achievement or role"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    style={{
                      borderBottomColor:
                        focusedField === "description"
                          ? colors.primary
                          : undefined,
                    }}
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    {description.length}/300
                  </p>
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
                        ? "Update Award"
                        : "Add Award"}
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
              {awards.length > 0 && (
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
                          index === 4 ? `${colors.primary}08` : "transparent",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            index <= 4 ? colors.primary : colors.neutral[100],
                          color: index <= 4 ? "white" : colors.neutral[400],
                        }}
                      >
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <span
                        className="text-sm flex-1"
                        style={{
                          color:
                            index === 4
                              ? colors.primary
                              : index < 4
                                ? colors.neutral[900]
                                : colors.neutral[500],
                          fontWeight: index === 4 ? 500 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                      {index === 4 && (
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
      {deleteAwardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-[320px] bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Delete Award?
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteAwardId(null)}
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
