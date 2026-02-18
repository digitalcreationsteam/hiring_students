// // src/components/Education.tsx
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAppDispatch } from "../store/hooks"; // ✅ ADD THIS
// import { setNavigation } from "../store/slices/onboardingSlice"; // ✅ ADD THIS
// import { Avatar } from "../ui/components/Avatar";
// import { Button } from "../ui/components/Button";
// import HeaderLogo from "../ui/components/HeaderLogo";
// import { IconButton } from "../ui/components/IconButton";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import { Switch } from "../ui/components/Switch";
// import { TextField } from "../ui/components/TextField";
// import {
//   FeatherArrowLeft,
//   FeatherAward,
//   FeatherBriefcase,
//   FeatherFileCheck,
//   FeatherGraduationCap,
//   FeatherPackage,
//   FeatherPlus,
//   FeatherX,
//   FeatherCheck,
//   FeatherEdit2,
// } from "@subframe/core";
// import API, { URL_PATH } from "src/common/API";
// import * as SubframeCore from "@subframe/core";
// import { FeatherChevronDown } from "@subframe/core";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { colors } from "src/common/Colors";
// import Navbar from "src/ui/components/Navbar";
// import Footer from "../ui/components/Footer";

// const DEGREE_OPTIONS = [
//   { label: "Diploma", value: "diploma" },
//   { label: "Bachelor's Degree", value: "bachelor" },
//   { label: "B.Tech", value: "b.tech" },
//   { label: "Master's Degree", value: "master" },
//   { label: "M.Tech", value: "m.tech" },
//   { label: "Doctorate (PhD)", value: "phd" },
//   { label: "Professional Degree", value: "professional_degree" },
//   { label: "Other", value: "other" },
// ] as const;

// type DegreeOption = (typeof DEGREE_OPTIONS)[number];

// type ExperiencePoints = {
//   demographics?: number;
//   education?: number;
// };

// type EducationEntry = {
//   id: string;
//   degree: string;
//   fieldOfStudy: string;
//   schoolName: string;
//   startYear: string;
//   endYear?: string;
//   currentlyStudying: boolean;
//   gpa?: string;
//   cgpa?: string;
// };

// type UniversityEntry = {
//   id: string;
//   name: string;
// };

// function useDebouncedValue<T>(value: T, delay = 250) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const id = window.setTimeout(() => setDebounced(value), delay);
//     return () => window.clearTimeout(id);
//   }, [value, delay]);

//   return debounced;
// }

// const normalize = (v: string) => v.replace(/\s+/g, " ").trim();

// const isValidYear = (value: string) => {
//   if (!/^\d{4}$/.test(value)) return false;
//   const year = Number(value);
//   const currentYear = new Date().getFullYear();
//   return year >= 1950 && year <= currentYear + 1;
// };

// const isEndAfterStart = (start: string, end: string) => {
//   return Number(end) >= Number(start);
// };

// const toTitleCase = (v: string) =>
//   normalize(v)
//     .toLowerCase()
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// // -------------------Year Picker------------------
// function YearPicker({
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
//   const currentYear = new Date().getFullYear();
//   const selectedYear = value ? Number(value) : currentYear;

//   const [open, setOpen] = useState(false);
//   const [decadeStart, setDecadeStart] = useState(
//     Math.floor(selectedYear / 10) * 10,
//   );

//   const ref = useRef<HTMLDivElement>(null);

//   // close on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

//   return (
//     <div className="relative" ref={ref}>
//       {/* INPUT */}
//       <input
//         readOnly
//         disabled={disabled}
//         value={value}
//         placeholder="YYYY"
//         onClick={() => !disabled && setOpen((v) => !v)}
//         className={`w-full h-9 px-3 text-sm rounded-full cursor-pointer border border-neutral-300 focus:outline-none ${
//           disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"
//         }`}
//       />

//       {/* PICKER */}
//       {open && (
//         <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3">
//           {/* HEADER */}
//           <div className="flex items-center justify-between mb-3">
//             <button
//               type="button"
//               onClick={() => setDecadeStart((d) => d - 10)}
//               className="px-2 text-lg"
//             >
//               «
//             </button>

//             <span className="text-sm font-medium">
//               {decadeStart} – {decadeStart + 9}
//             </span>

//             <button
//               type="button"
//               onClick={() => setDecadeStart((d) => d + 10)}
//               className="px-2 text-lg"
//             >
//               »
//             </button>
//           </div>

//           {/* YEARS GRID */}
//           <div className="grid grid-cols-4 gap-2 text-sm">
//             {years.map((year) => {
//               const isDisabled =
//                 year < minYear || year > maxYear || year > currentYear;

//               return (
//                 <button
//                   key={year}
//                   type="button"
//                   disabled={isDisabled}
//                   onClick={() => {
//                     onChange(String(year));
//                     setOpen(false);
//                   }}
//                   className="py-2 px-3 rounded-lg transition text-sm sm:text-base"
//                   style={{
//                     backgroundColor:
//                       value === String(year) ? colors.accent : "transparent",
//                     color:
//                       value === String(year)
//                         ? colors.background
//                         : isDisabled
//                           ? colors.neutral[400]
//                           : colors.neutral[800],
//                     cursor: isDisabled ? "not-allowed" : "pointer",
//                     opacity: isDisabled ? 0.7 : 1,
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isDisabled && value !== String(year)) {
//                       e.currentTarget.style.backgroundColor =
//                         colors.primaryGlow;
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isDisabled && value !== String(year)) {
//                       e.currentTarget.style.backgroundColor = "transparent";
//                     }
//                   }}
//                 >
//                   {year}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // SchoolNameDropdown
// function SchoolNameDropdown({
//   value,
//   onChange,
//   disabled,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   disabled?: boolean;
// }) {
//   const [open, setOpen] = React.useState(false);
//   const [query, setQuery] = React.useState(value || "");
//   const debouncedQuery = useDebouncedValue(query, 250);

//   const [loading, setLoading] = React.useState(false);
//   const [items, setItems] = React.useState<UniversityEntry[]>([]);
//   const [error, setError] = React.useState<string | null>(null);

//   const wrapRef = React.useRef<HTMLDivElement>(null);

//   // ✅ Fetch universities function
//   const OPENALEX_BASE = "https://api.openalex.org";

//   const fetchUniversities = React.useCallback(async (q: string) => {
//     const url =
//       `${OPENALEX_BASE}/institutions` +
//       `?search=${encodeURIComponent(q)}` +
//       `&per-page=25`;

//     const r = await fetch(url);
//     if (!r.ok) throw new Error(`OpenAlex error ${r.status}`);

//     const json = await r.json();

//     // OpenAlex returns { results: [...] }
//     const mapped: UniversityEntry[] = (json?.results ?? [])
//       .map((inst: any) => ({
//         // inst.id looks like "https://openalex.org/I123456789"
//         id: String(inst?.id || ""),
//         name: String(inst?.display_name || ""),
//       }))
//       .filter((x: UniversityEntry) => x.id && x.name);

//     return mapped;
//   }, []);

//   // close on outside click
//   React.useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // keep query in sync if parent changes value
//   React.useEffect(() => {
//     setQuery(value || "");
//   }, [value]);

//   // ✅ fetch results when query changes (with debounce)
//   React.useEffect(() => {
//     if (!open) return;

//     const q = debouncedQuery.trim();
//     if (q.length < 2) {
//       setItems([]);
//       setError(null);
//       return;
//     }

//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await fetchUniversities(q);
//         setItems(data);
//       } catch (e: any) {
//         setItems([]);
//         setError(e?.message || "Could not load universities");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [debouncedQuery, open, fetchUniversities]);

//   return (
//     <div className="relative" ref={wrapRef}>
//       <label className="text-[12px] font-medium text-neutral-900">
//         School Name <span className="text-red-500">*</span>
//       </label>

//       <input
//         disabled={disabled}
//         value={query}
//         placeholder="Search your university (India / US)"
//         onFocus={() => !disabled && setOpen(true)}
//         onClick={() => !disabled && setOpen(true)}
//         onChange={(e) => {
//           const v = e.target.value;
//           setQuery(v);
//           onChange(v); // allow manual typing also
//           if (!open) setOpen(true);
//         }}
//         className={`mt-1 w-full h-10 px-4 rounded-full border border-neutral-300 bg-white text-sm focus:outline-none ${
//           disabled ? "opacity-70 cursor-not-allowed" : ""
//         }`}
//         style={{ color: colors.accent }}
//       />

//       {open && !disabled && (
//         <div className="absolute z-50 mt-2 w-full rounded-2xl border border-neutral-300 bg-white shadow-lg overflow-hidden">
//           <div className="px-3 py-2 text-xs border-b border-neutral-200 flex items-center justify-between">
//             <span style={{ color: colors.neutral[600] }}>
//               {loading ? "Searching..." : "Type 2+ characters to search"}
//             </span>
//             <button
//               type="button"
//               className="text-xs"
//               style={{ color: colors.neutral[600] }}
//               onClick={() => setOpen(false)}
//             >
//               Close
//             </button>
//           </div>

//           <div className="max-h-[240px] overflow-y-auto">
//             {error && (
//               <div
//                 className="px-3 py-2 text-sm"
//                 style={{ color: colors.neutral[600] }}
//               >
//                 {error}
//               </div>
//             )}

//             {!error &&
//               !loading &&
//               items.length === 0 &&
//               debouncedQuery.trim().length >= 2 && (
//                 <div
//                   className="px-3 py-2 text-sm"
//                   style={{ color: colors.neutral[600] }}
//                 >
//                   No matches. You can keep typing to enter custom name.
//                 </div>
//               )}

//             {items.map((u) => (
//               <button
//                 key={u.id}
//                 type="button"
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100"
//                 onClick={() => {
//                   onChange(u.name);
//                   setQuery(u.name);
//                   setOpen(false);
//                 }}
//               >
//                 <span className="truncate" style={{ color: colors.accent }}>
//                   {u.name}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function Education() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const source = location.state?.source;
//   const dispatch = useAppDispatch(); // ✅ ADD THIS LINE // "dashboard" | undefined
//   console.log("EDUCATION source:", source);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const isEditing = !!editingId;

//   const userId = localStorage.getItem("userId");

//   // local form state
//   const [degree, setDegree] = useState<string>("");
//   const [fieldOfStudy, setFieldOfStudy] = useState("");
//   const [schoolName, setSchoolName] = useState("");
//   const [startYear, setStartYear] = useState("");
//   const [endYear, setEndYear] = useState("");
//   const [currentlyStudying, setStudying] = useState(false);
//   const [gradeType, setGradeType] = useState<"gpa" | "cgpa">("gpa"); // Dropdown selection
//   const [gradeValue, setGradeValue] = useState(""); // Single input field

//   const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
//   const [experiencePoints, setExperiencePoints] =
//     useState<ExperiencePoints | null>(null);

//   // stored entries
//   const [educations, setEducations] = useState<EducationEntry[]>([]);
//   const [selectedEducation, setSelectedEducation] =
//     useState<EducationEntry | null>(null);

//   const displayedIndex =
//     (experiencePoints?.demographics ?? 0) + (experiencePoints?.education ?? 0);

//   // Update the validation function
//   const validateEducation = (): string | null => {
//     if (!degree.trim()) return "Degree is required";
//     if (!fieldOfStudy.trim()) return "Field of study is required";
//     if (!schoolName.trim()) return "School name is required";
//     if (!startYear.trim()) return "Start year is required";

//     if (!isValidYear(startYear)) return "Start year must be a valid year";

//     if (!currentlyStudying) {
//       if (!endYear.trim()) return "End year is required";
//       if (!isValidYear(endYear)) return "End year must be a valid year";
//       if (!isEndAfterStart(startYear, endYear))
//         return "End year must be after start year";
//     }

//     // Check if grade value is provided
//     if (!gradeValue.trim() || gradeValue.trim().length === 0) {
//       return `Please enter ${gradeType === "gpa" ? "GPA" : "CGPA"}`;
//     }

//     // Validate based on selected type
//     if (gradeType === "gpa") {
//       if (!/^(4(\.0{1,2})?|[0-3](\.[0-9]{1,2})?)$/.test(gradeValue))
//         return "GPA must be between 0 and 4.0 (e.g., 3.5, 4.0)";
//     } else {
//       if (!/^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/.test(gradeValue))
//         return "CGPA must be between 0 and 10 (e.g., 7.5, 9.2)";
//     }

//     return null;
//   };

//   const resetForm = () => {
//     setDegree("");
//     setFieldOfStudy("");
//     setSchoolName("");
//     setStartYear("");
//     setEndYear("");
//     setStudying(false);
//     setGradeType("gpa");
//     setGradeValue("");
//     setEditingId(null);
//   };

//   const hasEducationOverlap = () => {
//     const newStart = Number(startYear);
//     const newEnd = currentlyStudying
//       ? new Date().getFullYear()
//       : Number(endYear);

//     if (!Number.isFinite(newStart) || !Number.isFinite(newEnd)) return false;

//     return educations.some((ed) => {
//       const oldStart = Number(ed.startYear);
//       const oldEnd = ed.currentlyStudying
//         ? new Date().getFullYear()
//         : Number(ed.endYear);

//       if (!Number.isFinite(oldStart) || !Number.isFinite(oldEnd)) return false;

//       // ✅ strict overlap: allows 2003–2006 and 2006–2008
//       return newStart < oldEnd && newEnd > oldStart;
//     });
//   };

//   const handleAddEducation = async () => {
//     const error = validateEducation();
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     if (hasEducationOverlap()) {
//       toast.error(
//         "Education period overlaps with an existing degree. Degrees must be sequential.",
//       );
//       return;
//     }

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     // ✅ DUPLICATE CHECK (CORRECT PLACE)
//     // ✅ HIERARCHICAL DUPLICATE CHECK (DEGREE → FIELD → SCHOOL)
//     const normalizedNew = {
//       degree: normalize(degree).trim(), // ✅ keep slug
//       fieldOfStudy: normalize(toTitleCase(fieldOfStudy)).trim(),
//       schoolName: normalize(toTitleCase(schoolName)).trim(),
//       startYear,
//     };

//     // 1️⃣ Check if degree already exists
//     const degreeExists = educations.some(
//       (ed) => normalize(ed.degree).trim() === normalizedNew.degree,
//     );
//     if (degreeExists) {
//       toast.error("You have already added this degree.");
//       return;
//     }

//     // 2️⃣ Check if field of study exists under this degree
//     const fieldExists = educations.some(
//       (ed) =>
//         normalize(ed.degree).trim() === normalizedNew.degree &&
//         normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy,
//     );
//     if (fieldExists) {
//       toast.error("This field of study already exists for this degree.");
//       return;
//     }

//     // 3️⃣ Check if school exists under this degree + field
//     const schoolExists = educations.some(
//       (ed) =>
//         normalize(ed.degree).trim() === normalizedNew.degree &&
//         normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy &&
//         normalize(ed.schoolName).trim() === normalizedNew.schoolName,
//     );
//     if (schoolExists) {
//       toast.error(
//         "This school is already added for this degree and field of study.",
//       );
//       return;
//     }

//     const currentYear = new Date().getFullYear();

//     const duration = currentlyStudying
//       ? currentYear - Number(startYear)
//       : Number(endYear) - Number(startYear);

//     // ✅ API payload - include both GPA and CGPA
//     const payload = {
//       educations: [
//         {
//           degree,
//           fieldOfStudy: toTitleCase(fieldOfStudy),
//           schoolName: toTitleCase(schoolName),
//           startYear: Number(startYear),
//           endYear: currentlyStudying ? null : Number(endYear),
//           currentlyStudying,
//           duration,
//           gpa: gradeType === "gpa" ? Number(gradeValue) : null,
//           cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
//           gradeSystem: gradeType, // Send which system was used
//         },
//       ],
//     };

//     try {
//       setIsSubmitting(true);

//       const res = await API("POST", URL_PATH.education, payload, {
//         "user-id": userId,
//       });

//       // ✅ CHECK IF BACKEND RETURNED NAVIGATION
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }

//       toast.success("Education added successfully");

//       const created = res.data[0];

//       setEducations((prev) => [
//         {
//           id: created._id,
//           degree: created.degree,
//           fieldOfStudy: created.fieldOfStudy,
//           schoolName: created.schoolName,
//           startYear: String(created.startYear),
//           endYear: created.currentlyStudying
//             ? undefined
//             : String(created.endYear),
//           currentlyStudying: created.currentlyStudying,
//           gpa: created.gpa ? String(created.gpa) : undefined,
//           cgpa: created.cgpa ? String(created.cgpa) : undefined,
//         },
//         ...prev,
//       ]);

//       await fetchExperienceIndex();
//       resetForm();
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to add education");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- EDIT EDUCATION --------------------
//   const handleUpdateEducation = async () => {
//     const error = validateEducation();
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     if (!editingId || !userId) return;

//     const currentYear = new Date().getFullYear();
//     const duration = currentlyStudying
//       ? currentYear - Number(startYear)
//       : Number(endYear) - Number(startYear);

//     const payload = {
//       degree,
//       fieldOfStudy: toTitleCase(fieldOfStudy),
//       schoolName: toTitleCase(schoolName),
//       startYear: Number(startYear),
//       endYear: currentlyStudying ? null : Number(endYear),
//       currentlyStudying,
//       duration,
//       gpa: gradeType === "gpa" ? Number(gradeValue) : null,
//       cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
//       gradeSystem: gradeType,
//     };

//     try {
//       setIsSubmitting(true);

//       const res = await API(
//         "PUT",
//         `${URL_PATH.education}/${editingId}`,
//         payload,
//         { "user-id": userId },
//       );

//       // ✅ UPDATE REDUX IF NAVIGATION RETURNED
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }

//       toast.success("Education updated");

//       setEducations((prev) =>
//         prev.map((e) => {
//           if (e.id !== editingId) return e;
//           return {
//             ...e,
//             degree: payload.degree,
//             fieldOfStudy: payload.fieldOfStudy,
//             schoolName: payload.schoolName,
//             startYear: String(payload.startYear),
//             endYear: payload.currentlyStudying
//               ? undefined
//               : String(payload.endYear ?? ""),
//             currentlyStudying: payload.currentlyStudying,
//             gpa: payload.gpa != null ? String(payload.gpa) : undefined,
//             cgpa: payload.cgpa != null ? String(payload.cgpa) : undefined,
//           };
//         }),
//       );

//       await fetchExperienceIndex();
//       resetForm();
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to update education");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- DELETE EDUCATION --------------------
//   const handleRemove = async () => {
//     if (!deleteId) return;

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const res = await API(
//         "DELETE",
//         `${URL_PATH.deleteEducation}/${deleteId}`,
//         undefined,
//         { "user-id": userId },
//       );

//       // ✅ UPDATE REDUX IF NAVIGATION RETURNED
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }

//       toast.success("Education deleted successfully");
//       setEducations((prev) => prev.filter((e) => e.id !== deleteId));
//       await fetchExperienceIndex();
//       setDeleteId(null);
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to delete education");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const hasEducation = educations.length > 0;
//   const canContinue = hasEducation;

//   // -------------------- GET EDUCATION --------------------
//   const fetchEducations = React.useCallback(async () => {
//     if (!userId) return;

//     try {
//       const res = await API("GET", URL_PATH.getEducation, undefined, {
//         "user-id": userId,
//       });

//       const apiEducations = res?.data || [];

//       const mappedEducations: EducationEntry[] = apiEducations.map(
//         (e: any) => ({
//           id: e._id,
//           degree: e.degree || "",
//           fieldOfStudy: e.fieldOfStudy || "",
//           schoolName: e.schoolName || "",
//           startYear: String(e.startYear),
//           endYear: e.currentlyStudying ? undefined : String(e.endYear),
//           currentlyStudying: e.currentlyStudying,
//           gpa: e.gpa ? String(e.gpa) : undefined,
//           cgpa: e.cgpa ? String(e.cgpa) : undefined,
//         }),
//       );

//       setEducations(mappedEducations);
//     } catch (error) {
//       console.error("Failed to fetch education", error);
//     }
//   }, [userId]);

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

//   //use Effect
//   useEffect(() => {
//     if (!userId) return;

//     fetchExperienceIndex();
//     fetchEducations();
//   }, [userId, fetchExperienceIndex, fetchEducations]);

//   /* -------------------- BUILD PAYLOAD -------------------- */

//   const handleContinue = () => {
//     if (!educations.length) {
//       toast.error("Please add at least one education to continue.");
//       return;
//     }

//     if (source === "dashboard") {
//       navigate("/dashboard");
//     } else {
//       navigate("/experience", { state: { source } });
//     }
//   };

//   const handleCurrentlyStudyingToggle = (checked: boolean) => {
//     setStudying(checked);

//     if (checked) {
//       setEndYear(""); // 🔥 same as Experience clearing endDate
//     }
//   };

//   // Add this helper function near your other utility functions
//   const getDegreeLabel = (degreeValue: string): string => {
//     const degreeOption = DEGREE_OPTIONS.find(
//       (option) => option.value === degreeValue,
//     );
//     return degreeOption?.label || degreeValue; // fallback to the value if not found
//   };

//   //Edit your profile
//   const fillFormForEdit = (ed: EducationEntry) => {
//     setEditingId(ed.id);

//     setDegree(ed.degree || "");
//     setFieldOfStudy(ed.fieldOfStudy || "");
//     setSchoolName(ed.schoolName || "");
//     setStartYear(ed.startYear || "");
//     setEndYear(ed.currentlyStudying ? "" : ed.endYear || "");
//     setStudying(!!ed.currentlyStudying);

//     if (ed.gpa) {
//       setGradeType("gpa");
//       setGradeValue(String(ed.gpa));
//     } else if (ed.cgpa) {
//       setGradeType("cgpa");
//       setGradeValue(String(ed.cgpa));
//     } else {
//       setGradeType("gpa");
//       setGradeValue("");
//     }

//     setSelectedEducation(ed);
//   };

//   // return (
//   //   <>
//   //     <HeaderLogo />
//   //     <ToastContainer position="top-center" autoClose={3000} />
//   //     <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-0 sm:py-0">
//   //       <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
//   //         {/* Left card */}
//   //         <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6 ...">
//   //           {/* Top: back + progress */}
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
//   //                   const res = await API(
//   //                     "POST",
//   //                     "/auth/verify-route",
//   //                     { route: "/demographics" }, // ⬅️ previous step
//   //                   );

//   //                   if (res.allowed) {
//   //                     navigate("/demographics");
//   //                   }
//   //                   // ❌ if not allowed → do nothing
//   //                 } catch {
//   //                   // fail silently
//   //                 }
//   //               }}
//   //             />

//   //             <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//   //               <div className="flex items-center gap-3">
//   //                 {[...Array(2)].map((_, i) => (
//   //                   <div
//   //                     key={`p-${i}`}
//   //                     style={{ height: 6 }}
//   //                     className="flex-1 rounded-full bg-violet-700"
//   //                   />
//   //                 ))}
//   //                 {[...Array(4)].map((_, i) => (
//   //                   <div
//   //                     key={`n-${i}`}
//   //                     style={{ height: 6 }}
//   //                     className="flex-1 rounded-full bg-neutral-300"
//   //                   />
//   //                 ))}
//   //               </div>
//   //             </div>
//   //           </div>

//   //           {/* Header */}
//   //           <header className="mt-6">
//   //             <h2 className="text-[22px] text-neutral-900">
//   //               Add your education
//   //             </h2>
//   //             <p className="mt-1 text-xs text-neutral-500">
//   //               Your academic background helps shape your Experience Index
//   //             </p>
//   //           </header>

//   //           {/* Selected education preview list */}
//   //           <section className="mt-6 flex w-full flex-col gap-3">
//   //             {educations.map((ed) => {
//   //               const isSelected = selectedEducation?.id === ed.id;

//   //               return (
//   //                 <div
//   //                   key={ed.id}
//   //                   role="button"
//   //                   tabIndex={0}
//   //                   onClick={() => setSelectedEducation(isSelected ? null : ed)}
//   //                   onKeyDown={(e) => {
//   //                     if (e.key === "Enter" || e.key === " ") {
//   //                       e.preventDefault();
//   //                       setSelectedEducation(isSelected ? null : ed);
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
//   //                     {/* Left */}
//   //                     <div className="flex items-center gap-3 min-w-0">
//   //                       <Avatar
//   //                         size="large"
//   //                         square
//   //                         className="!rounded-3xl shadow-sm bg-violet-200 text-violet-700"
//   //                       >
//   //                         {ed.schoolName
//   //                           .split(" ")
//   //                           .slice(0, 2)
//   //                           .map((s) => s[0])
//   //                           .join("")}
//   //                       </Avatar>

//   //                       <div className="flex flex-col min-w-0">
//   //                         <span className="text-sm font-semibold text-neutral-900 truncate">
//   //                           {getDegreeLabel(ed.degree)}{" "}
//   //                         </span>
//   //                         <span className="text-xs text-neutral-500 truncate">
//   //                           {ed.schoolName}
//   //                         </span>
//   //                       </div>
//   //                     </div>

//   //                     {/* Right */}
//   //                     <div className="flex flex-col items-end gap-2 shrink-0">
//   //                       <IconButton
//   //                         size="small"
//   //                         icon={<FeatherX />}
//   //                         aria-label={`Delete education ${ed.degree}`}
//   //                         onClick={(e) => {
//   //                           e.stopPropagation();
//   //                           setDeleteId(ed.id);
//   //                         }}
//   //                         className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//   //                       />

//   //                       <span className="text-xs text-neutral-500">
//   //                         {ed.startYear}
//   //                         {ed.currentlyStudying
//   //                           ? " - Present"
//   //                           : ed.endYear
//   //                             ? ` - ${ed.endYear}`
//   //                             : ""}
//   //                       </span>
//   //                     </div>
//   //                   </div>

//   //                   {/* 🔹 DETAILS (same card, same border) */}
//   //                   {isSelected && (
//   //                     <>
//   //                       <div className="my-4 border-t border-neutral-200" />

//   //                       <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//   //                         <div>
//   //                           <span className="font-medium">Degree:</span>{" "}
//   //                           {getDegreeLabel(ed.degree)}{" "}
//   //                         </div>

//   //                         <div>
//   //                           <span className="font-medium">Field of study:</span>{" "}
//   //                           {ed.fieldOfStudy}
//   //                         </div>

//   //                         <div>
//   //                           <span className="font-medium">Institution:</span>{" "}
//   //                           {ed.schoolName}
//   //                         </div>

//   //                         <div>
//   //                           <span className="font-medium">Duration:</span>{" "}
//   //                           {ed.startYear}
//   //                           {ed.currentlyStudying
//   //                             ? " - Present"
//   //                             : ed.endYear
//   //                               ? ` - ${ed.endYear}`
//   //                               : ""}
//   //                         </div>

//   //                         {ed.gpa && (
//   //                           <div>
//   //                             <span className="font-medium">GPA:</span> {ed.gpa}
//   //                           </div>
//   //                         )}
//   //                       </div>
//   //                     </>
//   //                   )}
//   //                 </div>
//   //               );
//   //             })}
//   //           </section>

//   //           {/* Form */}
//   //           <form
//   //             onSubmit={(e) => {
//   //               e.preventDefault();
//   //               handleAddEducation();
//   //             }}
//   //             className="mt-6 flex flex-col gap-4"
//   //           >
//   //             {/* Degree */}
//   //             <div className="flex flex-col gap-1">
//   //               {/* Degree Dropdown - Fixed */}
//   //               <div className="flex flex-col gap-1">
//   //                 <label className="text-[12px] font-medium text-neutral-900">
//   //                   Degree <span className="text-red-500">*</span>
//   //                 </label>

//   //                 <SubframeCore.DropdownMenu.Root>
//   //                   <SubframeCore.DropdownMenu.Trigger asChild>
//   //                     <div className="flex h-9 items-center justify-between rounded-full border border-neutral-300 bg-white px-3 cursor-pointer hover:bg-neutral-50">
//   //                       <span
//   //                         className={
//   //                           degree
//   //                             ? "text-neutral-900 text-[12px]"
//   //                             : "text-neutral-400 text-[12px]"
//   //                         }
//   //                       >
//   //                         {DEGREE_OPTIONS.find((d) => d.value === degree)
//   //                           ?.label || "Select Degree"}
//   //                       </span>
//   //                       <FeatherChevronDown className="text-neutral-500" />
//   //                     </div>
//   //                   </SubframeCore.DropdownMenu.Trigger>

//   //                   <SubframeCore.DropdownMenu.Portal>
//   //                     <SubframeCore.DropdownMenu.Content
//   //                       className="bg-white rounded-2xl shadow-lg py-1 max-h-[220px] overflow-y-auto border border-neutral-300 min-w-[200px]"
//   //                       sideOffset={4}
//   //                       align="start"
//   //                     >
//   //                       {DEGREE_OPTIONS.map((item) => (
//   //                         <SubframeCore.DropdownMenu.Item
//   //                           key={item.value}
//   //                           className="px-4 py-2 text-sm cursor-pointer hover:bg-neutral-100 outline-none"
//   //                           onSelect={() => setDegree(item.value)}
//   //                         >
//   //                           {item.label}
//   //                         </SubframeCore.DropdownMenu.Item>
//   //                       ))}
//   //                     </SubframeCore.DropdownMenu.Content>
//   //                   </SubframeCore.DropdownMenu.Portal>
//   //                 </SubframeCore.DropdownMenu.Root>
//   //               </div>
//   //             </div>

//   //             {/* Field of Study */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={
//   //                 <span className="text-[12px]">
//   //                   Field of Study <span className="text-red-500">*</span>{" "}
//   //                 </span>
//   //               }
//   //               helpText={
//   //                 <span className="text-[12px]">
//   //                   Your major or concentration{" "}
//   //                 </span>
//   //               }
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
//   //            text-sm placeholder:text-xs placeholder:text-neutral-400"
//   //                 placeholder="e.g., Computer Science, Business Administration"
//   //                 value={fieldOfStudy}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
//   //                   setFieldOfStudy(ev.target.value)
//   //                 }
//   //               />
//   //             </TextField>

//   //             {/* School Name */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={
//   //                 <span className="text-[12px]">
//   //                   School Name <span className="text-red-500">*</span>{" "}
//   //                 </span>
//   //               }
//   //               helpText=""
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
//   //            text-sm placeholder:text-xs placeholder:text-neutral-400"
//   //                 placeholder="Name of institution"
//   //                 value={schoolName}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
//   //                   setSchoolName(ev.target.value)
//   //                 }
//   //               />
//   //             </TextField>

//   //             {/* Years */}
//   //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//   //               {/* Start Year */}
//   //               <div className="flex flex-col gap-1">
//   //                 <label className="text-[12px] font-medium">
//   //                   Start Year <span className="text-red-500">*</span>
//   //                 </label>

//   //                 <YearPicker
//   //                   value={startYear}
//   //                   onChange={setStartYear}
//   //                   minYear={1950}
//   //                   maxYear={new Date().getFullYear()}
//   //                 />
//   //               </div>

//   //               {/* End Year */}
//   //               <div className="flex flex-col gap-1">
//   //                 <label className="text-[12px] font-medium">
//   //                   End Year <span className="text-red-500">*</span>
//   //                 </label>
//   //                 <YearPicker
//   //                   value={endYear}
//   //                   onChange={setEndYear}
//   //                   disabled={currentlyStudying}
//   //                   minYear={Number(startYear) || 1950}
//   //                   maxYear={new Date().getFullYear()}
//   //                 />
//   //               </div>
//   //             </div>

//   //             {/* // --------------------------------------- */}
//   //             <div className="flex items-center gap-3">
//   //               <Switch
//   //                 checked={currentlyStudying}
//   //                 onCheckedChange={handleCurrentlyStudyingToggle}
//   //                 tabIndex={0}
//   //                 role="switch"
//   //                 aria-checked={currentlyStudying}
//   //                 onKeyDown={(e) => {
//   //                   if (e.key === "Enter" || e.key === " ") {
//   //                     e.preventDefault();
//   //                     handleCurrentlyStudyingToggle(!currentlyStudying);
//   //                   }
//   //                 }}
//   //                 className="
//   //   h-5 w-9
//   //   data-[state=checked]:bg-violet-700
//   //   data-[state=unchecked]:bg-neutral-300
//   //   [&>span]:h-4 [&>span]:w-3
//   //   [&>span]:data-[state=checked]:translate-x-2
//   //   [&>span]:data-[state=unchecked]:translate-x-0
//   // "
//   //               />

//   //               <span className="text-sm text-neutral-700">
//   //                 I am currently studying
//   //               </span>
//   //             </div>

//   //             {/* GPA Field - US 4-point scale */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={<span className="text-[12px]">GPA</span>}
//   //               // helpText="Enter GPA on a 4.0 scale"
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0"
//   //                 placeholder="e.g., 3.8 (out of 4)"
//   //                 value={gpa}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
//   //                   const value = ev.target.value.replace(/[^0-9.]/g, "");
//   //                   // Prevent multiple decimal points
//   //                   const decimalCount = (value.match(/\./g) || []).length;
//   //                   if (decimalCount <= 1) {
//   //                     setGpa(value);
//   //                     // Auto-clear CGPA if user starts typing GPA
//   //                     if (value && cgpa) {
//   //                       setCGpa("");
//   //                     }
//   //                   }
//   //                 }}
//   //               />
//   //             </TextField>

//   //             {/* CGPA Field - Indian 10-point scale */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={<span className="text-[12px]">CGPA</span>}
//   //               // helpText="Enter CGPA on a 10.0 scale"
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0"
//   //                 placeholder="e.g., 7.8 (out of 10)"
//   //                 value={cgpa}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
//   //                   const value = ev.target.value.replace(/[^0-9.]/g, "");
//   //                   // Prevent multiple decimal points
//   //                   const decimalCount = (value.match(/\./g) || []).length;
//   //                   if (decimalCount <= 1) {
//   //                     setCGpa(value);
//   //                     // Auto-clear GPA if user starts typing CGPA
//   //                     if (value && gpa) {
//   //                       setGpa("");
//   //                     }
//   //                   }
//   //                 }}
//   //               />
//   //             </TextField>
//   //             <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
//   //               <Button
//   //                 type="button"
//   //                 disabled={isSubmitting}
//   //                 variant="neutral-secondary"
//   //                 icon={<FeatherPlus />}
//   //                 className="w-full rounded-full h-10 px-4 border-neutral-300"
//   //                 onClick={handleAddEducation}
//   //               >
//   //                 {isSubmitting ? "Adding..." : "Add another education"}
//   //               </Button>
//   //               <div className="flex-1" /> {/* pushes continue to the right */}
//   //             </div>
//   //           </form>
//   //           {/* Top form horizontal line */}
//   //           <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />
//   //           <footer>
//   //             <Button
//   //               onClick={handleContinue}
//   //               disabled={!canContinue || isSubmitting}
//   //               className={`
//   //   w-full h-10 rounded-full transition-all
//   //   ${
//   //     !canContinue || isSubmitting
//   //       ? "bg-violet-300 text-white cursor-not-allowed"
//   //       : "bg-violet-700 text-white shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
//   //   }
//   // `}
//   //             >
//   //               {isSubmitting ? "Saving..." : "Continue"}
//   //             </Button>
//   //           </footer>
//   //         </main>

//   //         {/* Right panel */}

//   //         <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
//   //           <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
//   //             <h3 className="text-[20px] text-neutral-900">
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

//   //               {/* ⚪ Completed — Demographics */}
//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <IconWithBackground
//   //                   size="small"
//   //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//   //                   className="!bg-green-100 !rounded-full !p-3"
//   //                 />
//   //                 <span className="text-sm text-neutral-700">Demographics</span>
//   //               </button>

//   //               {/* 🟣 Active — Education */}
//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3 hover:shadow-sm"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
//   //                   <IconWithBackground
//   //                     size="small"
//   //                     icon={<FeatherGraduationCap />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm font-semibold text-neutral-900">
//   //                   Education
//   //                 </span>
//   //               </button>

//   //               {/* Inactive steps */}
//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherBriefcase />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">Experience</span>
//   //               </button>

//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherFileCheck />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">
//   //                   Certifications
//   //                 </span>
//   //               </button>

//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherAward />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">Awards</span>
//   //               </button>

//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherPackage />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">Projects</span>
//   //               </button>
//   //             </div>
//   //           </div>
//   //         </aside>
//   //       </div>
//   //       {/* ✅ DELETE CONFIRMATION MODAL — ADD HERE */}
//   //       {deleteId && (
//   //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//   //           <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
//   //             <div className="flex justify-between items-center mb-4">
//   //               <h3 className="text-lg font-semibold text-neutral-900">
//   //                 Are you sure?
//   //               </h3>
//   //               <button
//   //                 onClick={() => setDeleteId(null)}
//   //                 className="text-neutral-400 hover:text-neutral-600"
//   //               >
//   //                 ✕
//   //               </button>
//   //             </div>

//   //             <p className="text-sm text-neutral-600 mb-6">
//   //               Do you really want to delete this education?
//   //             </p>

//   //             <div className="flex gap-3">
//   //               <Button
//   //                 variant="neutral-secondary"
//   //                 className="flex-1"
//   //                 onClick={() => setDeleteId(null)}
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

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* 🎨 Linear gradient background - fixed behind everything */}
//       <div
//         className="pointer-events-none fixed inset-0 -z-10"
//         style={{
//           background: `linear-gradient(
//                     to bottom,
//                     #d9d9d9 0%,
//                     #cfd3d6 25%,
//                     #9aa6b2 55%,
//                     #2E4056 100%
//                 )`,
//           width: "100%",
//         }}
//       />

//       {/* Header and content with z-index to stay above background */}
//       <div className="relative z-10">
//         <Navbar />
//         <ToastContainer position="top-center" autoClose={3000} />
//         <div className="flex justify-center px-4 sm:px-6 py-0 sm:py-0">
//           <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center py-8">
//             {/* Left card */}
//             <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6">
//               {/* Top: back + progress */}
//               <div className="flex items-center gap-4">
//                 <IconButton
//                   size="small"
//                   icon={<FeatherArrowLeft />}
//                   onClick={() => {
//                     if (source === "dashboard") {
//                       navigate("/dashboard");
//                     } else {
//                       // This will go back to the previous page in history
//                       navigate("/demographics");
//                     }
//                   }}
//                 />

//                 <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//                   <div className="flex items-center gap-3">
//                     {[...Array(2)].map((_, i) => (
//                       <div
//                         key={`p-${i}`}
//                         style={{ height: 6, backgroundColor: colors.primary }}
//                         className="flex-1 rounded-full"
//                       />
//                     ))}
//                     {[...Array(4)].map((_, i) => (
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
//               <header className="mt-6">
//                 <h2 className="text-[22px] text-neutral-900">
//                   Add your education
//                 </h2>
//                 <p className="mt-1 text-xs text-neutral-500">
//                   Your academic background helps shape your Experience Index
//                 </p>
//               </header>

//               {/* Education List */}
//               <section className="mt-6 flex w-full flex-col gap-3">
//                 {educations.map((ed) => {
//                   const isSelected = selectedEducation?.id === ed.id;

//                   return (
//                     <div
//                       key={ed.id}
//                       role="button"
//                       tabIndex={0}
//                       onClick={() =>
//                         setSelectedEducation(isSelected ? null : ed)
//                       }
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           e.preventDefault();
//                           setSelectedEducation(isSelected ? null : ed);
//                         }
//                       }}
//                       className="rounded-3xl px-4 py-3 cursor-pointer transition-all duration-200 focus:outline-none"
//                       style={{
//                         backgroundColor: isSelected
//                           ? `${colors.primary}14`
//                           : colors.white,
//                         border: `1px solid ${
//                           isSelected ? colors.primary : colors.neutral[200]
//                         }`,
//                         boxShadow: isSelected
//                           ? `0 0 0 3px ${colors.primary}22`
//                           : "none",
//                       }}
//                     >
//                       {/* 🔹 TOP ROW */}
//                       <div className="flex items-center justify-between">
//                         {/* Left */}
//                         <div className="flex items-center gap-3 min-w-0">
//                           <Avatar
//                             size="large"
//                             square
//                             className="!rounded-3xl shadow-sm"
//                             style={{
//                               backgroundColor: colors.primaryGlow,
//                               color: colors.neutral[800],
//                             }}
//                           >
//                             {ed.schoolName
//                               .split(" ")
//                               .slice(0, 2)
//                               .map((s) => s[0])
//                               .join("")}
//                           </Avatar>

//                           <div className="flex flex-col min-w-0">
//                             <span className="text-sm font-semibold text-neutral-900 truncate">
//                               {getDegreeLabel(ed.degree)}{" "}
//                             </span>
//                             <span className="text-xs text-neutral-500 truncate">
//                               {ed.schoolName}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Right */}
//                         <div className="flex flex-col items-end gap-2 shrink-0">
//                           <div className="flex items-center gap-1">
//                             {/* EDIT */}
//                             <IconButton
//                               size="small"
//                               icon={<FeatherEdit2 />}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 fillFormForEdit(ed);
//                               }}
//                               className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                             />

//                             {/* DELETE */}
//                             <IconButton
//                               size="small"
//                               icon={<FeatherX />}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setDeleteId(ed.id);
//                               }}
//                               className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                             />
//                           </div>

//                           <span className="text-xs text-neutral-500">
//                             {ed.startYear}
//                             {ed.currentlyStudying
//                               ? " - Present"
//                               : ed.endYear
//                                 ? ` - ${ed.endYear}`
//                                 : ""}
//                           </span>
//                         </div>
//                       </div>

//                       {/* 🔹 DETAILS (same card, same border) */}
//                       {isSelected && (
//                         <>
//                           <div className="my-4 border-t border-neutral-200" />

//                           <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//                             <div>
//                               <span className="font-medium">Degree:</span>{" "}
//                               {getDegreeLabel(ed.degree)}{" "}
//                             </div>

//                             <div>
//                               <span className="font-medium">
//                                 Field of study:
//                               </span>{" "}
//                               {ed.fieldOfStudy}
//                             </div>

//                             <div>
//                               <span className="font-medium">Institution:</span>{" "}
//                               {ed.schoolName}
//                             </div>

//                             <div>
//                               <span className="font-medium">Duration:</span>{" "}
//                               {ed.startYear}
//                               {ed.currentlyStudying
//                                 ? " - Present"
//                                 : ed.endYear
//                                   ? ` - ${ed.endYear}`
//                                   : ""}
//                             </div>

//                             {ed.gpa && (
//                               <div>
//                                 <span className="font-medium">GPA:</span>{" "}
//                                 {ed.gpa}
//                               </div>
//                             )}

//                             {ed.cgpa && (
//                               <div>
//                                 <span className="font-medium">CGPA:</span>{" "}
//                                 {ed.cgpa}
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
//                   isEditing ? handleUpdateEducation() : handleAddEducation();
//                 }}
//                 className="mt-6 flex flex-col gap-4"
//               >
//                 {/* Degree */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[12px] font-medium text-neutral-900">
//                     Degree <span className="text-red-500">*</span>
//                   </label>

//                   <SubframeCore.DropdownMenu.Root>
//                     <SubframeCore.DropdownMenu.Trigger asChild>
//                       {/* ✅ Trigger must have EXACTLY ONE child element */}
//                       <div
//                         className="flex h-9 items-center justify-between rounded-full border border-neutral-300 px-3 cursor-pointer hover:bg-neutral-50"
//                         style={{ backgroundColor: colors.white }}
//                       >
//                         <span
//                           className="text-[12px]"
//                           style={{ color: degree ? colors.accent : "#9CA3AF" }}
//                         >
//                           {DEGREE_OPTIONS.find((d) => d.value === degree)
//                             ?.label || "Select Degree"}
//                         </span>

//                         <FeatherChevronDown style={{ color: "#6B7280" }} />
//                       </div>
//                     </SubframeCore.DropdownMenu.Trigger>

//                     <SubframeCore.DropdownMenu.Portal>
//                       <SubframeCore.DropdownMenu.Content
//                         sideOffset={4}
//                         align="start"
//                         className="bg-white text-neutral-900 rounded-2xl shadow-lg py-1 max-h-[220px] overflow-y-auto border border-neutral-300 min-w-[200px]"
//                         style={{ zIndex: 999999 }}
//                       >
//                         {DEGREE_OPTIONS.map((item) => (
//                           <SubframeCore.DropdownMenu.Item
//                             key={item.value}
//                             className="
//           px-4 py-2 text-sm
//           text-neutral-900
//           cursor-pointer
//           hover:bg-neutral-100
//           outline-none
//         "
//                             onSelect={() => setDegree(item.value)}
//                           >
//                             {item.label}
//                           </SubframeCore.DropdownMenu.Item>
//                         ))}
//                       </SubframeCore.DropdownMenu.Content>
//                     </SubframeCore.DropdownMenu.Portal>
//                   </SubframeCore.DropdownMenu.Root>
//                 </div>

//                 {/* Field of Study */}
//                 <TextField
//                   className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//                   label={
//                     <span className="text-[12px]">
//                       Field of Study{" "}
//                       <span className="text-red-500">*</span>{" "}
//                     </span>
//                   }
//                   helpText={
//                     <span className="text-[12px]">
//                       Your major or concentration{" "}
//                     </span>
//                   }
//                 >
//                   <TextField.Input
//                     className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
//              text-sm placeholder:text-xs placeholder:text-neutral-400"
//                     placeholder="e.g., Computer Science, Business Administration"
//                     value={fieldOfStudy}
//                     onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
//                       setFieldOfStudy(ev.target.value)
//                     }
//                   />
//                 </TextField>

//                 {/* School Name */}
//                 <SchoolNameDropdown
//                   value={schoolName}
//                   onChange={setSchoolName}
//                   disabled={isSubmitting}
//                 />

//                 {/* Years */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Start Year */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[12px] font-medium">
//                       Start Year <span className="text-red-500">*</span>
//                     </label>

//                     <YearPicker
//                       value={startYear}
//                       onChange={setStartYear}
//                       minYear={1950}
//                       maxYear={new Date().getFullYear()}
//                     />
//                   </div>

//                   {/* End Year */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[12px] font-medium">
//                       End Year <span className="text-red-500">*</span>
//                     </label>
//                     <YearPicker
//                       value={endYear}
//                       onChange={setEndYear}
//                       disabled={currentlyStudying}
//                       minYear={Number(startYear) || 1950}
//                       maxYear={new Date().getFullYear()}
//                     />
//                   </div>
//                 </div>

//                 {/* Currently Studying Toggle */}
//                 <div className="flex items-center gap-3">
//                   <Switch
//                     checked={currentlyStudying}
//                     onCheckedChange={handleCurrentlyStudyingToggle}
//                     tabIndex={0}
//                     role="switch"
//                     aria-checked={currentlyStudying}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" || e.key === " ") {
//                         e.preventDefault();
//                         handleCurrentlyStudyingToggle(!currentlyStudying);
//                       }
//                     }}
//                     className="h-5 w-9 transition-colors"
//                     style={{
//                       backgroundColor: currentlyStudying
//                         ? colors.primary // ON color
//                         : colors.neutral?.[400] || "#374151", // OFF color fallback
//                     }}
//                   />

//                   <span className="text-sm text-neutral-700">
//                     I am currently studying
//                   </span>
//                 </div>

//                 {/* GPA Field - US 4-point scale */}
//                 {/* Grade Type Selector Dropdown + Input Side by Side */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Grade Type Selector Dropdown */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[12px] font-medium text-neutral-900">
//                       Grade System <span className="text-red-500">*</span>
//                     </label>

//                     <SubframeCore.DropdownMenu.Root>
//                       <SubframeCore.DropdownMenu.Trigger asChild>
//                         <div
//                           className="flex h-10 items-center justify-between rounded-full border border-neutral-300 px-4 cursor-pointer hover:bg-neutral-50 transition"
//                           style={{ backgroundColor: colors.white }}
//                         >
//                           <span
//                             className="text-[12px] font-medium"
//                             style={{ color: colors.accent }}
//                           >
//                             {gradeType === "gpa" ? "GPA" : "CGPA"}
//                           </span>

//                           <FeatherChevronDown style={{ color: "#6B7280" }} />
//                         </div>
//                       </SubframeCore.DropdownMenu.Trigger>

//                       <SubframeCore.DropdownMenu.Portal>
//                         <SubframeCore.DropdownMenu.Content
//                           sideOffset={4}
//                           align="start"
//                           className="bg-white text-neutral-900 rounded-2xl shadow-lg py-1 border border-neutral-300 min-w-[180px]"
//                           style={{ zIndex: 999999 }}
//                         >
//                           <SubframeCore.DropdownMenu.Item
//                             className="px-4 py-2 text-sm text-neutral-900 cursor-pointer hover:bg-neutral-100 outline-none"
//                             onSelect={() => {
//                               setGradeType("gpa");
//                               setGradeValue("");
//                             }}
//                           >
//                             GPA (4.0)
//                           </SubframeCore.DropdownMenu.Item>

//                           <SubframeCore.DropdownMenu.Item
//                             className="px-4 py-2 text-sm text-neutral-900 cursor-pointer hover:bg-neutral-100 outline-none"
//                             onSelect={() => {
//                               setGradeType("cgpa");
//                               setGradeValue("");
//                             }}
//                           >
//                             CGPA (10.0)
//                           </SubframeCore.DropdownMenu.Item>
//                         </SubframeCore.DropdownMenu.Content>
//                       </SubframeCore.DropdownMenu.Portal>
//                     </SubframeCore.DropdownMenu.Root>
//                   </div>

//                   {/* Single Grade Input Field */}
//                   <TextField
//                     className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//                     label={
//                       <span className="text-[12px]">
//                         {gradeType === "gpa" ? "GPA" : "CGPA"}{" "}
//                         <span className="text-red-500">*</span>
//                       </span>
//                     }
//                   >
//                     <TextField.Input
//                       className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0"
//                       placeholder={
//                         gradeType === "gpa" ? "e.g., 3.8" : "e.g., 7.8"
//                       }
//                       value={gradeValue}
//                       onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
//                         const value = ev.target.value.replace(/[^0-9.]/g, "");
//                         const decimalCount = (value.match(/\./g) || []).length;
//                         if (decimalCount <= 1) {
//                           setGradeValue(value);
//                         }
//                       }}
//                     />
//                   </TextField>
//                 </div>

//                 <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
//                   <Button
//                     type="button"
//                     disabled={isSubmitting}
//                     variant="neutral-secondary"
//                     icon={<FeatherPlus />}
//                     className="w-full rounded-full h-10 px-4 border-neutral-300"
//                     onClick={() =>
//                       isEditing ? handleUpdateEducation() : handleAddEducation()
//                     }
//                   >
//                     {isSubmitting
//                       ? isEditing
//                         ? "Updating..."
//                         : "Adding..."
//                       : isEditing
//                         ? "Update education"
//                         : "Add another education"}
//                   </Button>

//                   <div className="flex-1" />
//                   {/* ✅ Cancle Edit */}
//                   {isEditing && (
//                     <Button
//                       onClick={resetForm}
//                       type="button"
//                       className="w-full rounded-full h-10 mt-2"
//                       variant="brand-tertiary"
//                       style={{ backgroundColor: colors.primaryGlow }}
//                     >
//                       Cancel edit
//                     </Button>
//                   )}
//                 </div>
//               </form>

//               {/* Top form horizontal line */}
//               <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />
//               <footer>
//                 <Button
//                   onClick={handleContinue}
//                   disabled={!canContinue || isSubmitting}
//                   className="w-full h-10 sm:h-11 rounded-full text-sm sm:text-base font-semibold transition-all active:scale-[0.99]"
//                   style={{
//                     backgroundColor:
//                       !canContinue || isSubmitting
//                         ? colors.neutral[200]
//                         : colors.accent,
//                     color: colors.background,
//                     cursor:
//                       !canContinue || isSubmitting ? "not-allowed" : "pointer",
//                     opacity: !canContinue || isSubmitting ? 0.75 : 1,
//                     boxShadow:
//                       !canContinue || isSubmitting
//                         ? "none"
//                         : "0 10px 24px rgba(0,0,0,0.08)",
//                   }}
//                 >
//                   {isSubmitting ? "Saving..." : "Continue"}
//                 </Button>
//               </footer>
//             </main>

//             {/* Right panel */}
//             <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
//               <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
//                 <h3 className="text-[20px] text-neutral-900">
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

//                 {/* Top form horizontal line */}
//                 <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//                 <div className="mt-4">
//                   <div className="text-[16px] text-neutral-800 mb-3">
//                     Progress Steps
//                   </div>

//                   {/* ⚪ Completed — Demographics */}
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

//                   {/* 🟣 Active — Education */}
//                   <button
//                     style={{ backgroundColor: colors.primary }}
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl px-4 py-2 mb-3 hover:shadow-sm"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
//                       <IconWithBackground
//                         size="small"
//                         icon={<FeatherGraduationCap />}
//                       />
//                     </div>

//                     <span
//                       className="text-sm font-medium text-neutral-900"
//                       style={{ color: colors.white }}
//                     >
//                       Education
//                     </span>
//                   </button>

//                   {/* Inactive steps */}
//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherBriefcase />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">Experience</span>
//                   </button>

//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherFileCheck />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">
//                       Certifications
//                     </span>
//                   </button>

//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherAward />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">Awards</span>
//                   </button>

//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherPackage />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">Projects</span>
//                   </button>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {deleteId && (
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
//                     onClick={() => setDeleteId(null)}
//                     className="transition"
//                     style={{ color: colors.neutral[400] }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.color = colors.accent)
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.color = colors.neutral[400])
//                     }
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <p
//                   className="text-sm mb-6"
//                   style={{ color: colors.neutral[600] }}
//                 >
//                   Do you really want to delete this education?
//                 </p>

//                 <div className="flex gap-3">
//                   {/* Cancel */}
//                   <Button
//                     variant="brand-tertiary"
//                     className="flex-1 rounded-3xl"
//                     onClick={() => setDeleteId(null)}
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

//                   {/* Confirm */}
//                   <Button
//                     className="flex-1 rounded-3xl transition"
//                     onClick={handleRemove}
//                     disabled={isSubmitting}
//                     style={{
//                       backgroundColor: isSubmitting
//                         ? `${colors.red}66`
//                         : colors.red,
//                       color: colors.accent,
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

// src/components/Education.tsx
// // src/components/Education.tsx
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAppDispatch } from "../store/hooks"; // ✅ ADD THIS
// import { setNavigation } from "../store/slices/onboardingSlice"; // ✅ ADD THIS
// import { Avatar } from "../ui/components/Avatar";
// import { Button } from "../ui/components/Button";
// import HeaderLogo from "../ui/components/HeaderLogo";
// import { IconButton } from "../ui/components/IconButton";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import { Switch } from "../ui/components/Switch";
// import { TextField } from "../ui/components/TextField";
// import {
//   FeatherArrowLeft,
//   FeatherAward,
//   FeatherBriefcase,
//   FeatherFileCheck,
//   FeatherGraduationCap,
//   FeatherPackage,
//   FeatherPlus,
//   FeatherX,
//   FeatherCheck,
//   FeatherEdit2,
// } from "@subframe/core";
// import API, { URL_PATH } from "src/common/API";
// import * as SubframeCore from "@subframe/core";
// import { FeatherChevronDown } from "@subframe/core";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { colors } from "src/common/Colors";
// import Navbar from "src/ui/components/Navbar";
// import Footer from "../ui/components/Footer";

// const DEGREE_OPTIONS = [
//   { label: "Diploma", value: "diploma" },
//   { label: "Bachelor's Degree", value: "bachelor" },
//   { label: "B.Tech", value: "b.tech" },
//   { label: "Master's Degree", value: "master" },
//   { label: "M.Tech", value: "m.tech" },
//   { label: "Doctorate (PhD)", value: "phd" },
//   { label: "Professional Degree", value: "professional_degree" },
//   { label: "Other", value: "other" },
// ] as const;

// type DegreeOption = (typeof DEGREE_OPTIONS)[number];

// type ExperiencePoints = {
//   demographics?: number;
//   education?: number;
// };

// type EducationEntry = {
//   id: string;
//   degree: string;
//   fieldOfStudy: string;
//   schoolName: string;
//   startYear: string;
//   endYear?: string;
//   currentlyStudying: boolean;
//   gpa?: string;
//   cgpa?: string;
// };

// type UniversityEntry = {
//   id: string;
//   name: string;
// };

// function useDebouncedValue<T>(value: T, delay = 250) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const id = window.setTimeout(() => setDebounced(value), delay);
//     return () => window.clearTimeout(id);
//   }, [value, delay]);

//   return debounced;
// }

// const normalize = (v: string) => v.replace(/\s+/g, " ").trim();

// const isValidYear = (value: string) => {
//   if (!/^\d{4}$/.test(value)) return false;
//   const year = Number(value);
//   const currentYear = new Date().getFullYear();
//   return year >= 1950 && year <= currentYear + 1;
// };

// const isEndAfterStart = (start: string, end: string) => {
//   return Number(end) >= Number(start);
// };

// const toTitleCase = (v: string) =>
//   normalize(v)
//     .toLowerCase()
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// // -------------------Year Picker------------------
// function YearPicker({
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
//   const currentYear = new Date().getFullYear();
//   const selectedYear = value ? Number(value) : currentYear;

//   const [open, setOpen] = useState(false);
//   const [decadeStart, setDecadeStart] = useState(
//     Math.floor(selectedYear / 10) * 10,
//   );

//   const ref = useRef<HTMLDivElement>(null);

//   // close on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

//   return (
//     <div className="relative" ref={ref}>
//       {/* INPUT */}
//       <input
//         readOnly
//         disabled={disabled}
//         value={value}
//         placeholder="YYYY"
//         onClick={() => !disabled && setOpen((v) => !v)}
//         className={`w-full h-9 px-3 text-sm rounded-full cursor-pointer border border-neutral-300 focus:outline-none ${
//           disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"
//         }`}
//       />

//       {/* PICKER */}
//       {open && (
//         <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3">
//           {/* HEADER */}
//           <div className="flex items-center justify-between mb-3">
//             <button
//               type="button"
//               onClick={() => setDecadeStart((d) => d - 10)}
//               className="px-2 text-lg"
//             >
//               «
//             </button>

//             <span className="text-sm font-medium">
//               {decadeStart} – {decadeStart + 9}
//             </span>

//             <button
//               type="button"
//               onClick={() => setDecadeStart((d) => d + 10)}
//               className="px-2 text-lg"
//             >
//               »
//             </button>
//           </div>

//           {/* YEARS GRID */}
//           <div className="grid grid-cols-4 gap-2 text-sm">
//             {years.map((year) => {
//               const isDisabled =
//                 year < minYear || year > maxYear || year > currentYear;

//               return (
//                 <button
//                   key={year}
//                   type="button"
//                   disabled={isDisabled}
//                   onClick={() => {
//                     onChange(String(year));
//                     setOpen(false);
//                   }}
//                   className="py-2 px-3 rounded-lg transition text-sm sm:text-base"
//                   style={{
//                     backgroundColor:
//                       value === String(year) ? colors.accent : "transparent",
//                     color:
//                       value === String(year)
//                         ? colors.background
//                         : isDisabled
//                           ? colors.neutral[400]
//                           : colors.neutral[800],
//                     cursor: isDisabled ? "not-allowed" : "pointer",
//                     opacity: isDisabled ? 0.7 : 1,
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isDisabled && value !== String(year)) {
//                       e.currentTarget.style.backgroundColor =
//                         colors.primaryGlow;
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isDisabled && value !== String(year)) {
//                       e.currentTarget.style.backgroundColor = "transparent";
//                     }
//                   }}
//                 >
//                   {year}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // SchoolNameDropdown
// function SchoolNameDropdown({
//   value,
//   onChange,
//   disabled,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   disabled?: boolean;
// }) {
//   const [open, setOpen] = React.useState(false);
//   const [query, setQuery] = React.useState(value || "");
//   const debouncedQuery = useDebouncedValue(query, 250);

//   const [loading, setLoading] = React.useState(false);
//   const [items, setItems] = React.useState<UniversityEntry[]>([]);
//   const [error, setError] = React.useState<string | null>(null);

//   const wrapRef = React.useRef<HTMLDivElement>(null);

//   // ✅ Fetch universities function
//   const OPENALEX_BASE = "https://api.openalex.org";

//   const fetchUniversities = React.useCallback(async (q: string) => {
//     const url =
//       `${OPENALEX_BASE}/institutions` +
//       `?search=${encodeURIComponent(q)}` +
//       `&per-page=25`;

//     const r = await fetch(url);
//     if (!r.ok) throw new Error(`OpenAlex error ${r.status}`);

//     const json = await r.json();

//     // OpenAlex returns { results: [...] }
//     const mapped: UniversityEntry[] = (json?.results ?? [])
//       .map((inst: any) => ({
//         // inst.id looks like "https://openalex.org/I123456789"
//         id: String(inst?.id || ""),
//         name: String(inst?.display_name || ""),
//       }))
//       .filter((x: UniversityEntry) => x.id && x.name);

//     return mapped;
//   }, []);

//   // close on outside click
//   React.useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // keep query in sync if parent changes value
//   React.useEffect(() => {
//     setQuery(value || "");
//   }, [value]);

//   // ✅ fetch results when query changes (with debounce)
//   React.useEffect(() => {
//     if (!open) return;

//     const q = debouncedQuery.trim();
//     if (q.length < 2) {
//       setItems([]);
//       setError(null);
//       return;
//     }

//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await fetchUniversities(q);
//         setItems(data);
//       } catch (e: any) {
//         setItems([]);
//         setError(e?.message || "Could not load universities");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [debouncedQuery, open, fetchUniversities]);

//   return (
//     <div className="relative" ref={wrapRef}>
//       <label className="text-[12px] font-medium text-neutral-900">
//         School Name <span className="text-red-500">*</span>
//       </label>

//       <input
//         disabled={disabled}
//         value={query}
//         placeholder="Search your university (India / US)"
//         onFocus={() => !disabled && setOpen(true)}
//         onClick={() => !disabled && setOpen(true)}
//         onChange={(e) => {
//           const v = e.target.value;
//           setQuery(v);
//           onChange(v); // allow manual typing also
//           if (!open) setOpen(true);
//         }}
//         className={`mt-1 w-full h-10 px-4 rounded-full border border-neutral-300 bg-white text-sm focus:outline-none ${
//           disabled ? "opacity-70 cursor-not-allowed" : ""
//         }`}
//         style={{ color: colors.accent }}
//       />

//       {open && !disabled && (
//         <div className="absolute z-50 mt-2 w-full rounded-2xl border border-neutral-300 bg-white shadow-lg overflow-hidden">
//           <div className="px-3 py-2 text-xs border-b border-neutral-200 flex items-center justify-between">
//             <span style={{ color: colors.neutral[600] }}>
//               {loading ? "Searching..." : "Type 2+ characters to search"}
//             </span>
//             <button
//               type="button"
//               className="text-xs"
//               style={{ color: colors.neutral[600] }}
//               onClick={() => setOpen(false)}
//             >
//               Close
//             </button>
//           </div>

//           <div className="max-h-[240px] overflow-y-auto">
//             {error && (
//               <div
//                 className="px-3 py-2 text-sm"
//                 style={{ color: colors.neutral[600] }}
//               >
//                 {error}
//               </div>
//             )}

//             {!error &&
//               !loading &&
//               items.length === 0 &&
//               debouncedQuery.trim().length >= 2 && (
//                 <div
//                   className="px-3 py-2 text-sm"
//                   style={{ color: colors.neutral[600] }}
//                 >
//                   No matches. You can keep typing to enter custom name.
//                 </div>
//               )}

//             {items.map((u) => (
//               <button
//                 key={u.id}
//                 type="button"
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100"
//                 onClick={() => {
//                   onChange(u.name);
//                   setQuery(u.name);
//                   setOpen(false);
//                 }}
//               >
//                 <span className="truncate" style={{ color: colors.accent }}>
//                   {u.name}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function Education() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const source = location.state?.source;
//   const dispatch = useAppDispatch(); // ✅ ADD THIS LINE // "dashboard" | undefined
//   console.log("EDUCATION source:", source);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const isEditing = !!editingId;

//   const userId = localStorage.getItem("userId");

//   // local form state
//   const [degree, setDegree] = useState<string>("");
//   const [fieldOfStudy, setFieldOfStudy] = useState("");
//   const [schoolName, setSchoolName] = useState("");
//   const [startYear, setStartYear] = useState("");
//   const [endYear, setEndYear] = useState("");
//   const [currentlyStudying, setStudying] = useState(false);
//   const [gradeType, setGradeType] = useState<"gpa" | "cgpa">("gpa"); // Dropdown selection
//   const [gradeValue, setGradeValue] = useState(""); // Single input field

//   const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
//   const [experiencePoints, setExperiencePoints] =
//     useState<ExperiencePoints | null>(null);

//   // stored entries
//   const [educations, setEducations] = useState<EducationEntry[]>([]);
//   const [selectedEducation, setSelectedEducation] =
//     useState<EducationEntry | null>(null);

//   const displayedIndex =
//     (experiencePoints?.demographics ?? 0) + (experiencePoints?.education ?? 0);

//   // Update the validation function
//   const validateEducation = (): string | null => {
//     if (!degree.trim()) return "Degree is required";
//     if (!fieldOfStudy.trim()) return "Field of study is required";
//     if (!schoolName.trim()) return "School name is required";
//     if (!startYear.trim()) return "Start year is required";

//     if (!isValidYear(startYear)) return "Start year must be a valid year";

//     if (!currentlyStudying) {
//       if (!endYear.trim()) return "End year is required";
//       if (!isValidYear(endYear)) return "End year must be a valid year";
//       if (!isEndAfterStart(startYear, endYear))
//         return "End year must be after start year";
//     }

//     // Check if grade value is provided
//     if (!gradeValue.trim() || gradeValue.trim().length === 0) {
//       return `Please enter ${gradeType === "gpa" ? "GPA" : "CGPA"}`;
//     }

//     // Validate based on selected type
//     if (gradeType === "gpa") {
//       if (!/^(4(\.0{1,2})?|[0-3](\.[0-9]{1,2})?)$/.test(gradeValue))
//         return "GPA must be between 0 and 4.0 (e.g., 3.5, 4.0)";
//     } else {
//       if (!/^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/.test(gradeValue))
//         return "CGPA must be between 0 and 10 (e.g., 7.5, 9.2)";
//     }

//     return null;
//   };

//   const resetForm = () => {
//     setDegree("");
//     setFieldOfStudy("");
//     setSchoolName("");
//     setStartYear("");
//     setEndYear("");
//     setStudying(false);
//     setGradeType("gpa");
//     setGradeValue("");
//     setEditingId(null);
//   };

//   const hasEducationOverlap = () => {
//     const newStart = Number(startYear);
//     const newEnd = currentlyStudying
//       ? new Date().getFullYear()
//       : Number(endYear);

//     if (!Number.isFinite(newStart) || !Number.isFinite(newEnd)) return false;

//     return educations.some((ed) => {
//       const oldStart = Number(ed.startYear);
//       const oldEnd = ed.currentlyStudying
//         ? new Date().getFullYear()
//         : Number(ed.endYear);

//       if (!Number.isFinite(oldStart) || !Number.isFinite(oldEnd)) return false;

//       // ✅ strict overlap: allows 2003–2006 and 2006–2008
//       return newStart < oldEnd && newEnd > oldStart;
//     });
//   };

//   const handleAddEducation = async () => {
//     const error = validateEducation();
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     if (hasEducationOverlap()) {
//       toast.error(
//         "Education period overlaps with an existing degree. Degrees must be sequential.",
//       );
//       return;
//     }

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     // ✅ DUPLICATE CHECK (CORRECT PLACE)
//     // ✅ HIERARCHICAL DUPLICATE CHECK (DEGREE → FIELD → SCHOOL)
//     const normalizedNew = {
//       degree: normalize(degree).trim(), // ✅ keep slug
//       fieldOfStudy: normalize(toTitleCase(fieldOfStudy)).trim(),
//       schoolName: normalize(toTitleCase(schoolName)).trim(),
//       startYear,
//     };

//     // 1️⃣ Check if degree already exists
//     const degreeExists = educations.some(
//       (ed) => normalize(ed.degree).trim() === normalizedNew.degree,
//     );
//     if (degreeExists) {
//       toast.error("You have already added this degree.");
//       return;
//     }

//     // 2️⃣ Check if field of study exists under this degree
//     const fieldExists = educations.some(
//       (ed) =>
//         normalize(ed.degree).trim() === normalizedNew.degree &&
//         normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy,
//     );
//     if (fieldExists) {
//       toast.error("This field of study already exists for this degree.");
//       return;
//     }

//     // 3️⃣ Check if school exists under this degree + field
//     const schoolExists = educations.some(
//       (ed) =>
//         normalize(ed.degree).trim() === normalizedNew.degree &&
//         normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy &&
//         normalize(ed.schoolName).trim() === normalizedNew.schoolName,
//     );
//     if (schoolExists) {
//       toast.error(
//         "This school is already added for this degree and field of study.",
//       );
//       return;
//     }

//     const currentYear = new Date().getFullYear();

//     const duration = currentlyStudying
//       ? currentYear - Number(startYear)
//       : Number(endYear) - Number(startYear);

//     // ✅ API payload - include both GPA and CGPA
//     const payload = {
//       educations: [
//         {
//           degree,
//           fieldOfStudy: toTitleCase(fieldOfStudy),
//           schoolName: toTitleCase(schoolName),
//           startYear: Number(startYear),
//           endYear: currentlyStudying ? null : Number(endYear),
//           currentlyStudying,
//           duration,
//           gpa: gradeType === "gpa" ? Number(gradeValue) : null,
//           cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
//           gradeSystem: gradeType, // Send which system was used
//         },
//       ],
//     };

//     try {
//       setIsSubmitting(true);

//       const res = await API("POST", URL_PATH.education, payload, {
//         "user-id": userId,
//       });

//       // ✅ CHECK IF BACKEND RETURNED NAVIGATION
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }

//       toast.success("Education added successfully");

//       const created = res.data[0];

//       setEducations((prev) => [
//         {
//           id: created._id,
//           degree: created.degree,
//           fieldOfStudy: created.fieldOfStudy,
//           schoolName: created.schoolName,
//           startYear: String(created.startYear),
//           endYear: created.currentlyStudying
//             ? undefined
//             : String(created.endYear),
//           currentlyStudying: created.currentlyStudying,
//           gpa: created.gpa ? String(created.gpa) : undefined,
//           cgpa: created.cgpa ? String(created.cgpa) : undefined,
//         },
//         ...prev,
//       ]);

//       await fetchExperienceIndex();
//       resetForm();
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to add education");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- EDIT EDUCATION --------------------
//   const handleUpdateEducation = async () => {
//     const error = validateEducation();
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     if (!editingId || !userId) return;

//     const currentYear = new Date().getFullYear();
//     const duration = currentlyStudying
//       ? currentYear - Number(startYear)
//       : Number(endYear) - Number(startYear);

//     const payload = {
//       degree,
//       fieldOfStudy: toTitleCase(fieldOfStudy),
//       schoolName: toTitleCase(schoolName),
//       startYear: Number(startYear),
//       endYear: currentlyStudying ? null : Number(endYear),
//       currentlyStudying,
//       duration,
//       gpa: gradeType === "gpa" ? Number(gradeValue) : null,
//       cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
//       gradeSystem: gradeType,
//     };

//     try {
//       setIsSubmitting(true);

//       const res = await API(
//         "PUT",
//         `${URL_PATH.education}/${editingId}`,
//         payload,
//         { "user-id": userId },
//       );

//       // ✅ UPDATE REDUX IF NAVIGATION RETURNED
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }

//       toast.success("Education updated");

//       setEducations((prev) =>
//         prev.map((e) => {
//           if (e.id !== editingId) return e;
//           return {
//             ...e,
//             degree: payload.degree,
//             fieldOfStudy: payload.fieldOfStudy,
//             schoolName: payload.schoolName,
//             startYear: String(payload.startYear),
//             endYear: payload.currentlyStudying
//               ? undefined
//               : String(payload.endYear ?? ""),
//             currentlyStudying: payload.currentlyStudying,
//             gpa: payload.gpa != null ? String(payload.gpa) : undefined,
//             cgpa: payload.cgpa != null ? String(payload.cgpa) : undefined,
//           };
//         }),
//       );

//       await fetchExperienceIndex();
//       resetForm();
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to update education");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- DELETE EDUCATION --------------------
//   const handleRemove = async () => {
//     if (!deleteId) return;

//     if (!userId) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const res = await API(
//         "DELETE",
//         `${URL_PATH.deleteEducation}/${deleteId}`,
//         undefined,
//         { "user-id": userId },
//       );

//       // ✅ UPDATE REDUX IF NAVIGATION RETURNED
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }

//       toast.success("Education deleted successfully");
//       setEducations((prev) => prev.filter((e) => e.id !== deleteId));
//       await fetchExperienceIndex();
//       setDeleteId(null);
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to delete education");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const hasEducation = educations.length > 0;
//   const canContinue = hasEducation;

//   // -------------------- GET EDUCATION --------------------
//   const fetchEducations = React.useCallback(async () => {
//     if (!userId) return;

//     try {
//       const res = await API("GET", URL_PATH.getEducation, undefined, {
//         "user-id": userId,
//       });

//       const apiEducations = res?.data || [];

//       const mappedEducations: EducationEntry[] = apiEducations.map(
//         (e: any) => ({
//           id: e._id,
//           degree: e.degree || "",
//           fieldOfStudy: e.fieldOfStudy || "",
//           schoolName: e.schoolName || "",
//           startYear: String(e.startYear),
//           endYear: e.currentlyStudying ? undefined : String(e.endYear),
//           currentlyStudying: e.currentlyStudying,
//           gpa: e.gpa ? String(e.gpa) : undefined,
//           cgpa: e.cgpa ? String(e.cgpa) : undefined,
//         }),
//       );

//       setEducations(mappedEducations);
//     } catch (error) {
//       console.error("Failed to fetch education", error);
//     }
//   }, [userId]);

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

//   //use Effect
//   useEffect(() => {
//     if (!userId) return;

//     fetchExperienceIndex();
//     fetchEducations();
//   }, [userId, fetchExperienceIndex, fetchEducations]);

//   /* -------------------- BUILD PAYLOAD -------------------- */

//   const handleContinue = () => {
//     if (!educations.length) {
//       toast.error("Please add at least one education to continue.");
//       return;
//     }

//     if (source === "dashboard") {
//       navigate("/dashboard");
//     } else {
//       navigate("/experience", { state: { source } });
//     }
//   };

//   const handleCurrentlyStudyingToggle = (checked: boolean) => {
//     setStudying(checked);

//     if (checked) {
//       setEndYear(""); // 🔥 same as Experience clearing endDate
//     }
//   };

//   // Add this helper function near your other utility functions
//   const getDegreeLabel = (degreeValue: string): string => {
//     const degreeOption = DEGREE_OPTIONS.find(
//       (option) => option.value === degreeValue,
//     );
//     return degreeOption?.label || degreeValue; // fallback to the value if not found
//   };

//   //Edit your profile
//   const fillFormForEdit = (ed: EducationEntry) => {
//     setEditingId(ed.id);

//     setDegree(ed.degree || "");
//     setFieldOfStudy(ed.fieldOfStudy || "");
//     setSchoolName(ed.schoolName || "");
//     setStartYear(ed.startYear || "");
//     setEndYear(ed.currentlyStudying ? "" : ed.endYear || "");
//     setStudying(!!ed.currentlyStudying);

//     if (ed.gpa) {
//       setGradeType("gpa");
//       setGradeValue(String(ed.gpa));
//     } else if (ed.cgpa) {
//       setGradeType("cgpa");
//       setGradeValue(String(ed.cgpa));
//     } else {
//       setGradeType("gpa");
//       setGradeValue("");
//     }

//     setSelectedEducation(ed);
//   };

//   // return (
//   //   <>
//   //     <HeaderLogo />
//   //     <ToastContainer position="top-center" autoClose={3000} />
//   //     <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-0 sm:py-0">
//   //       <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
//   //         {/* Left card */}
//   //         <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6 ...">
//   //           {/* Top: back + progress */}
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
//   //                   const res = await API(
//   //                     "POST",
//   //                     "/auth/verify-route",
//   //                     { route: "/demographics" }, // ⬅️ previous step
//   //                   );

//   //                   if (res.allowed) {
//   //                     navigate("/demographics");
//   //                   }
//   //                   // ❌ if not allowed → do nothing
//   //                 } catch {
//   //                   // fail silently
//   //                 }
//   //               }}
//   //             />

//   //             <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//   //               <div className="flex items-center gap-3">
//   //                 {[...Array(2)].map((_, i) => (
//   //                   <div
//   //                     key={`p-${i}`}
//   //                     style={{ height: 6 }}
//   //                     className="flex-1 rounded-full bg-violet-700"
//   //                   />
//   //                 ))}
//   //                 {[...Array(4)].map((_, i) => (
//   //                   <div
//   //                     key={`n-${i}`}
//   //                     style={{ height: 6 }}
//   //                     className="flex-1 rounded-full bg-neutral-300"
//   //                   />
//   //                 ))}
//   //               </div>
//   //             </div>
//   //           </div>

//   //           {/* Header */}
//   //           <header className="mt-6">
//   //             <h2 className="text-[22px] text-neutral-900">
//   //               Add your education
//   //             </h2>
//   //             <p className="mt-1 text-xs text-neutral-500">
//   //               Your academic background helps shape your Experience Index
//   //             </p>
//   //           </header>

//   //           {/* Selected education preview list */}
//   //           <section className="mt-6 flex w-full flex-col gap-3">
//   //             {educations.map((ed) => {
//   //               const isSelected = selectedEducation?.id === ed.id;

//   //               return (
//   //                 <div
//   //                   key={ed.id}
//   //                   role="button"
//   //                   tabIndex={0}
//   //                   onClick={() => setSelectedEducation(isSelected ? null : ed)}
//   //                   onKeyDown={(e) => {
//   //                     if (e.key === "Enter" || e.key === " ") {
//   //                       e.preventDefault();
//   //                       setSelectedEducation(isSelected ? null : ed);
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
//   //                     {/* Left */}
//   //                     <div className="flex items-center gap-3 min-w-0">
//   //                       <Avatar
//   //                         size="large"
//   //                         square
//   //                         className="!rounded-3xl shadow-sm bg-violet-200 text-violet-700"
//   //                       >
//   //                         {ed.schoolName
//   //                           .split(" ")
//   //                           .slice(0, 2)
//   //                           .map((s) => s[0])
//   //                           .join("")}
//   //                       </Avatar>

//   //                       <div className="flex flex-col min-w-0">
//   //                         <span className="text-sm font-semibold text-neutral-900 truncate">
//   //                           {getDegreeLabel(ed.degree)}{" "}
//   //                         </span>
//   //                         <span className="text-xs text-neutral-500 truncate">
//   //                           {ed.schoolName}
//   //                         </span>
//   //                       </div>
//   //                     </div>

//   //                     {/* Right */}
//   //                     <div className="flex flex-col items-end gap-2 shrink-0">
//   //                       <IconButton
//   //                         size="small"
//   //                         icon={<FeatherX />}
//   //                         aria-label={`Delete education ${ed.degree}`}
//   //                         onClick={(e) => {
//   //                           e.stopPropagation();
//   //                           setDeleteId(ed.id);
//   //                         }}
//   //                         className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//   //                       />

//   //                       <span className="text-xs text-neutral-500">
//   //                         {ed.startYear}
//   //                         {ed.currentlyStudying
//   //                           ? " - Present"
//   //                           : ed.endYear
//   //                             ? ` - ${ed.endYear}`
//   //                             : ""}
//   //                       </span>
//   //                     </div>
//   //                   </div>

//   //                   {/* 🔹 DETAILS (same card, same border) */}
//   //                   {isSelected && (
//   //                     <>
//   //                       <div className="my-4 border-t border-neutral-200" />

//   //                       <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//   //                         <div>
//   //                           <span className="font-medium">Degree:</span>{" "}
//   //                           {getDegreeLabel(ed.degree)}{" "}
//   //                         </div>

//   //                         <div>
//   //                           <span className="font-medium">Field of study:</span>{" "}
//   //                           {ed.fieldOfStudy}
//   //                         </div>

//   //                         <div>
//   //                           <span className="font-medium">Institution:</span>{" "}
//   //                           {ed.schoolName}
//   //                         </div>

//   //                         <div>
//   //                           <span className="font-medium">Duration:</span>{" "}
//   //                           {ed.startYear}
//   //                           {ed.currentlyStudying
//   //                             ? " - Present"
//   //                             : ed.endYear
//   //                               ? ` - ${ed.endYear}`
//   //                               : ""}
//   //                         </div>

//   //                         {ed.gpa && (
//   //                           <div>
//   //                             <span className="font-medium">GPA:</span> {ed.gpa}
//   //                           </div>
//   //                         )}
//   //                       </div>
//   //                     </>
//   //                   )}
//   //                 </div>
//   //               );
//   //             })}
//   //           </section>

//   //           {/* Form */}
//   //           <form
//   //             onSubmit={(e) => {
//   //               e.preventDefault();
//   //               handleAddEducation();
//   //             }}
//   //             className="mt-6 flex flex-col gap-4"
//   //           >
//   //             {/* Degree */}
//   //             <div className="flex flex-col gap-1">
//   //               {/* Degree Dropdown - Fixed */}
//   //               <div className="flex flex-col gap-1">
//   //                 <label className="text-[12px] font-medium text-neutral-900">
//   //                   Degree <span className="text-red-500">*</span>
//   //                 </label>

//   //                 <SubframeCore.DropdownMenu.Root>
//   //                   <SubframeCore.DropdownMenu.Trigger asChild>
//   //                     <div className="flex h-9 items-center justify-between rounded-full border border-neutral-300 bg-white px-3 cursor-pointer hover:bg-neutral-50">
//   //                       <span
//   //                         className={
//   //                           degree
//   //                             ? "text-neutral-900 text-[12px]"
//   //                             : "text-neutral-400 text-[12px]"
//   //                         }
//   //                       >
//   //                         {DEGREE_OPTIONS.find((d) => d.value === degree)
//   //                           ?.label || "Select Degree"}
//   //                       </span>
//   //                       <FeatherChevronDown className="text-neutral-500" />
//   //                     </div>
//   //                   </SubframeCore.DropdownMenu.Trigger>

//   //                   <SubframeCore.DropdownMenu.Portal>
//   //                     <SubframeCore.DropdownMenu.Content
//   //                       className="bg-white rounded-2xl shadow-lg py-1 max-h-[220px] overflow-y-auto border border-neutral-300 min-w-[200px]"
//   //                       sideOffset={4}
//   //                       align="start"
//   //                     >
//   //                       {DEGREE_OPTIONS.map((item) => (
//   //                         <SubframeCore.DropdownMenu.Item
//   //                           key={item.value}
//   //                           className="px-4 py-2 text-sm cursor-pointer hover:bg-neutral-100 outline-none"
//   //                           onSelect={() => setDegree(item.value)}
//   //                         >
//   //                           {item.label}
//   //                         </SubframeCore.DropdownMenu.Item>
//   //                       ))}
//   //                     </SubframeCore.DropdownMenu.Content>
//   //                   </SubframeCore.DropdownMenu.Portal>
//   //                 </SubframeCore.DropdownMenu.Root>
//   //               </div>
//   //             </div>

//   //             {/* Field of Study */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={
//   //                 <span className="text-[12px]">
//   //                   Field of Study <span className="text-red-500">*</span>{" "}
//   //                 </span>
//   //               }
//   //               helpText={
//   //                 <span className="text-[12px]">
//   //                   Your major or concentration{" "}
//   //                 </span>
//   //               }
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
//   //            text-sm placeholder:text-xs placeholder:text-neutral-400"
//   //                 placeholder="e.g., Computer Science, Business Administration"
//   //                 value={fieldOfStudy}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
//   //                   setFieldOfStudy(ev.target.value)
//   //                 }
//   //               />
//   //             </TextField>

//   //             {/* School Name */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={
//   //                 <span className="text-[12px]">
//   //                   School Name <span className="text-red-500">*</span>{" "}
//   //                 </span>
//   //               }
//   //               helpText=""
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
//   //            text-sm placeholder:text-xs placeholder:text-neutral-400"
//   //                 placeholder="Name of institution"
//   //                 value={schoolName}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
//   //                   setSchoolName(ev.target.value)
//   //                 }
//   //               />
//   //             </TextField>

//   //             {/* Years */}
//   //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//   //               {/* Start Year */}
//   //               <div className="flex flex-col gap-1">
//   //                 <label className="text-[12px] font-medium">
//   //                   Start Year <span className="text-red-500">*</span>
//   //                 </label>

//   //                 <YearPicker
//   //                   value={startYear}
//   //                   onChange={setStartYear}
//   //                   minYear={1950}
//   //                   maxYear={new Date().getFullYear()}
//   //                 />
//   //               </div>

//   //               {/* End Year */}
//   //               <div className="flex flex-col gap-1">
//   //                 <label className="text-[12px] font-medium">
//   //                   End Year <span className="text-red-500">*</span>
//   //                 </label>
//   //                 <YearPicker
//   //                   value={endYear}
//   //                   onChange={setEndYear}
//   //                   disabled={currentlyStudying}
//   //                   minYear={Number(startYear) || 1950}
//   //                   maxYear={new Date().getFullYear()}
//   //                 />
//   //               </div>
//   //             </div>

//   //             {/* // --------------------------------------- */}
//   //             <div className="flex items-center gap-3">
//   //               <Switch
//   //                 checked={currentlyStudying}
//   //                 onCheckedChange={handleCurrentlyStudyingToggle}
//   //                 tabIndex={0}
//   //                 role="switch"
//   //                 aria-checked={currentlyStudying}
//   //                 onKeyDown={(e) => {
//   //                   if (e.key === "Enter" || e.key === " ") {
//   //                     e.preventDefault();
//   //                     handleCurrentlyStudyingToggle(!currentlyStudying);
//   //                   }
//   //                 }}
//   //                 className="
//   //   h-5 w-9
//   //   data-[state=checked]:bg-violet-700
//   //   data-[state=unchecked]:bg-neutral-300
//   //   [&>span]:h-4 [&>span]:w-3
//   //   [&>span]:data-[state=checked]:translate-x-2
//   //   [&>span]:data-[state=unchecked]:translate-x-0
//   // "
//   //               />

//   //               <span className="text-sm text-neutral-700">
//   //                 I am currently studying
//   //               </span>
//   //             </div>

//   //             {/* GPA Field - US 4-point scale */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={<span className="text-[12px]">GPA</span>}
//   //               // helpText="Enter GPA on a 4.0 scale"
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0"
//   //                 placeholder="e.g., 3.8 (out of 4)"
//   //                 value={gpa}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
//   //                   const value = ev.target.value.replace(/[^0-9.]/g, "");
//   //                   // Prevent multiple decimal points
//   //                   const decimalCount = (value.match(/\./g) || []).length;
//   //                   if (decimalCount <= 1) {
//   //                     setGpa(value);
//   //                     // Auto-clear CGPA if user starts typing GPA
//   //                     if (value && cgpa) {
//   //                       setCGpa("");
//   //                     }
//   //                   }
//   //                 }}
//   //               />
//   //             </TextField>

//   //             {/* CGPA Field - Indian 10-point scale */}
//   //             <TextField
//   //               className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//   //               label={<span className="text-[12px]">CGPA</span>}
//   //               // helpText="Enter CGPA on a 10.0 scale"
//   //             >
//   //               <TextField.Input
//   //                 className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0"
//   //                 placeholder="e.g., 7.8 (out of 10)"
//   //                 value={cgpa}
//   //                 onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
//   //                   const value = ev.target.value.replace(/[^0-9.]/g, "");
//   //                   // Prevent multiple decimal points
//   //                   const decimalCount = (value.match(/\./g) || []).length;
//   //                   if (decimalCount <= 1) {
//   //                     setCGpa(value);
//   //                     // Auto-clear GPA if user starts typing CGPA
//   //                     if (value && gpa) {
//   //                       setGpa("");
//   //                     }
//   //                   }
//   //                 }}
//   //               />
//   //             </TextField>
//   //             <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
//   //               <Button
//   //                 type="button"
//   //                 disabled={isSubmitting}
//   //                 variant="neutral-secondary"
//   //                 icon={<FeatherPlus />}
//   //                 className="w-full rounded-full h-10 px-4 border-neutral-300"
//   //                 onClick={handleAddEducation}
//   //               >
//   //                 {isSubmitting ? "Adding..." : "Add another education"}
//   //               </Button>
//   //               <div className="flex-1" /> {/* pushes continue to the right */}
//   //             </div>
//   //           </form>
//   //           {/* Top form horizontal line */}
//   //           <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />
//   //           <footer>
//   //             <Button
//   //               onClick={handleContinue}
//   //               disabled={!canContinue || isSubmitting}
//   //               className={`
//   //   w-full h-10 rounded-full transition-all
//   //   ${
//   //     !canContinue || isSubmitting
//   //       ? "bg-violet-300 text-white cursor-not-allowed"
//   //       : "bg-violet-700 text-white shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
//   //   }
//   // `}
//   //             >
//   //               {isSubmitting ? "Saving..." : "Continue"}
//   //             </Button>
//   //           </footer>
//   //         </main>

//   //         {/* Right panel */}

//   //         <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
//   //           <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
//   //             <h3 className="text-[20px] text-neutral-900">
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

//   //               {/* ⚪ Completed — Demographics */}
//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <IconWithBackground
//   //                   size="small"
//   //                   icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//   //                   className="!bg-green-100 !rounded-full !p-3"
//   //                 />
//   //                 <span className="text-sm text-neutral-700">Demographics</span>
//   //               </button>

//   //               {/* 🟣 Active — Education */}
//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3 hover:shadow-sm"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
//   //                   <IconWithBackground
//   //                     size="small"
//   //                     icon={<FeatherGraduationCap />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm font-semibold text-neutral-900">
//   //                   Education
//   //                 </span>
//   //               </button>

//   //               {/* Inactive steps */}
//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherBriefcase />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">Experience</span>
//   //               </button>

//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherFileCheck />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">
//   //                   Certifications
//   //                 </span>
//   //               </button>

//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherAward />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">Awards</span>
//   //               </button>

//   //               <button
//   //                 type="button"
//   //                 className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 hover:bg-neutral-50"
//   //               >
//   //                 <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//   //                   <IconWithBackground
//   //                     variant="neutral"
//   //                     size="small"
//   //                     icon={<FeatherPackage />}
//   //                   />
//   //                 </div>
//   //                 <span className="text-sm text-neutral-500">Projects</span>
//   //               </button>
//   //             </div>
//   //           </div>
//   //         </aside>
//   //       </div>
//   //       {/* ✅ DELETE CONFIRMATION MODAL — ADD HERE */}
//   //       {deleteId && (
//   //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//   //           <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
//   //             <div className="flex justify-between items-center mb-4">
//   //               <h3 className="text-lg font-semibold text-neutral-900">
//   //                 Are you sure?
//   //               </h3>
//   //               <button
//   //                 onClick={() => setDeleteId(null)}
//   //                 className="text-neutral-400 hover:text-neutral-600"
//   //               >
//   //                 ✕
//   //               </button>
//   //             </div>

//   //             <p className="text-sm text-neutral-600 mb-6">
//   //               Do you really want to delete this education?
//   //             </p>

//   //             <div className="flex gap-3">
//   //               <Button
//   //                 variant="neutral-secondary"
//   //                 className="flex-1"
//   //                 onClick={() => setDeleteId(null)}
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

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* 🎨 Linear gradient background - fixed behind everything */}
//       <div
//         className="pointer-events-none fixed inset-0 -z-10"
//         style={{
//           background: `linear-gradient(
//                     to bottom,
//                     #d9d9d9 0%,
//                     #cfd3d6 25%,
//                     #9aa6b2 55%,
//                     #2E4056 100%
//                 )`,
//           width: "100%",
//         }}
//       />

//       {/* Header and content with z-index to stay above background */}
//       <div className="relative z-10">
//         <Navbar />
//         <ToastContainer position="top-center" autoClose={3000} />
//         <div className="flex justify-center px-4 sm:px-6 py-0 sm:py-0">
//           <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center py-8">
//             {/* Left card */}
//             <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6">
//               {/* Top: back + progress */}
//               <div className="flex items-center gap-4">
//                 <IconButton
//                   size="small"
//                   icon={<FeatherArrowLeft />}
//                   onClick={() => {
//                     if (source === "dashboard") {
//                       navigate("/dashboard");
//                     } else {
//                       // This will go back to the previous page in history
//                       navigate("/demographics");
//                     }
//                   }}
//                 />

//                 <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//                   <div className="flex items-center gap-3">
//                     {[...Array(2)].map((_, i) => (
//                       <div
//                         key={`p-${i}`}
//                         style={{ height: 6, backgroundColor: colors.primary }}
//                         className="flex-1 rounded-full"
//                       />
//                     ))}
//                     {[...Array(4)].map((_, i) => (
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
//               <header className="mt-6">
//                 <h2 className="text-[22px] text-neutral-900">
//                   Add your education
//                 </h2>
//                 <p className="mt-1 text-xs text-neutral-500">
//                   Your academic background helps shape your Experience Index
//                 </p>
//               </header>

//               {/* Education List */}
//               <section className="mt-6 flex w-full flex-col gap-3">
//                 {educations.map((ed) => {
//                   const isSelected = selectedEducation?.id === ed.id;

//                   return (
//                     <div
//                       key={ed.id}
//                       role="button"
//                       tabIndex={0}
//                       onClick={() =>
//                         setSelectedEducation(isSelected ? null : ed)
//                       }
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           e.preventDefault();
//                           setSelectedEducation(isSelected ? null : ed);
//                         }
//                       }}
//                       className="rounded-3xl px-4 py-3 cursor-pointer transition-all duration-200 focus:outline-none"
//                       style={{
//                         backgroundColor: isSelected
//                           ? `${colors.primary}14`
//                           : colors.white,
//                         border: `1px solid ${
//                           isSelected ? colors.primary : colors.neutral[200]
//                         }`,
//                         boxShadow: isSelected
//                           ? `0 0 0 3px ${colors.primary}22`
//                           : "none",
//                       }}
//                     >
//                       {/* 🔹 TOP ROW */}
//                       <div className="flex items-center justify-between">
//                         {/* Left */}
//                         <div className="flex items-center gap-3 min-w-0">
//                           <Avatar
//                             size="large"
//                             square
//                             className="!rounded-3xl shadow-sm"
//                             style={{
//                               backgroundColor: colors.primaryGlow,
//                               color: colors.neutral[800],
//                             }}
//                           >
//                             {ed.schoolName
//                               .split(" ")
//                               .slice(0, 2)
//                               .map((s) => s[0])
//                               .join("")}
//                           </Avatar>

//                           <div className="flex flex-col min-w-0">
//                             <span className="text-sm font-semibold text-neutral-900 truncate">
//                               {getDegreeLabel(ed.degree)}{" "}
//                             </span>
//                             <span className="text-xs text-neutral-500 truncate">
//                               {ed.schoolName}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Right */}
//                         <div className="flex flex-col items-end gap-2 shrink-0">
//                           <div className="flex items-center gap-1">
//                             {/* EDIT */}
//                             <IconButton
//                               size="small"
//                               icon={<FeatherEdit2 />}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 fillFormForEdit(ed);
//                               }}
//                               className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                             />

//                             {/* DELETE */}
//                             <IconButton
//                               size="small"
//                               icon={<FeatherX />}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setDeleteId(ed.id);
//                               }}
//                               className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                             />
//                           </div>

//                           <span className="text-xs text-neutral-500">
//                             {ed.startYear}
//                             {ed.currentlyStudying
//                               ? " - Present"
//                               : ed.endYear
//                                 ? ` - ${ed.endYear}`
//                                 : ""}
//                           </span>
//                         </div>
//                       </div>

//                       {/* 🔹 DETAILS (same card, same border) */}
//                       {isSelected && (
//                         <>
//                           <div className="my-4 border-t border-neutral-200" />

//                           <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//                             <div>
//                               <span className="font-medium">Degree:</span>{" "}
//                               {getDegreeLabel(ed.degree)}{" "}
//                             </div>

//                             <div>
//                               <span className="font-medium">
//                                 Field of study:
//                               </span>{" "}
//                               {ed.fieldOfStudy}
//                             </div>

//                             <div>
//                               <span className="font-medium">Institution:</span>{" "}
//                               {ed.schoolName}
//                             </div>

//                             <div>
//                               <span className="font-medium">Duration:</span>{" "}
//                               {ed.startYear}
//                               {ed.currentlyStudying
//                                 ? " - Present"
//                                 : ed.endYear
//                                   ? ` - ${ed.endYear}`
//                                   : ""}
//                             </div>

//                             {ed.gpa && (
//                               <div>
//                                 <span className="font-medium">GPA:</span>{" "}
//                                 {ed.gpa}
//                               </div>
//                             )}

//                             {ed.cgpa && (
//                               <div>
//                                 <span className="font-medium">CGPA:</span>{" "}
//                                 {ed.cgpa}
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
//                   isEditing ? handleUpdateEducation() : handleAddEducation();
//                 }}
//                 className="mt-6 flex flex-col gap-4"
//               >
//                 {/* Degree */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[12px] font-medium text-neutral-900">
//                     Degree <span className="text-red-500">*</span>
//                   </label>

//                   <SubframeCore.DropdownMenu.Root>
//                     <SubframeCore.DropdownMenu.Trigger asChild>
//                       {/* ✅ Trigger must have EXACTLY ONE child element */}
//                       <div
//                         className="flex h-9 items-center justify-between rounded-full border border-neutral-300 px-3 cursor-pointer hover:bg-neutral-50"
//                         style={{ backgroundColor: colors.white }}
//                       >
//                         <span
//                           className="text-[12px]"
//                           style={{ color: degree ? colors.accent : "#9CA3AF" }}
//                         >
//                           {DEGREE_OPTIONS.find((d) => d.value === degree)
//                             ?.label || "Select Degree"}
//                         </span>

//                         <FeatherChevronDown style={{ color: "#6B7280" }} />
//                       </div>
//                     </SubframeCore.DropdownMenu.Trigger>

//                     <SubframeCore.DropdownMenu.Portal>
//                       <SubframeCore.DropdownMenu.Content
//                         sideOffset={4}
//                         align="start"
//                         className="bg-white text-neutral-900 rounded-2xl shadow-lg py-1 max-h-[220px] overflow-y-auto border border-neutral-300 min-w-[200px]"
//                         style={{ zIndex: 999999 }}
//                       >
//                         {DEGREE_OPTIONS.map((item) => (
//                           <SubframeCore.DropdownMenu.Item
//                             key={item.value}
//                             className="
//           px-4 py-2 text-sm
//           text-neutral-900
//           cursor-pointer
//           hover:bg-neutral-100
//           outline-none
//         "
//                             onSelect={() => setDegree(item.value)}
//                           >
//                             {item.label}
//                           </SubframeCore.DropdownMenu.Item>
//                         ))}
//                       </SubframeCore.DropdownMenu.Content>
//                     </SubframeCore.DropdownMenu.Portal>
//                   </SubframeCore.DropdownMenu.Root>
//                 </div>

//                 {/* Field of Study */}
//                 <TextField
//                   className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//                   label={
//                     <span className="text-[12px]">
//                       Field of Study{" "}
//                       <span className="text-red-500">*</span>{" "}
//                     </span>
//                   }
//                   helpText={
//                     <span className="text-[12px]">
//                       Your major or concentration{" "}
//                     </span>
//                   }
//                 >
//                   <TextField.Input
//                     className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0
//              text-sm placeholder:text-xs placeholder:text-neutral-400"
//                     placeholder="e.g., Computer Science, Business Administration"
//                     value={fieldOfStudy}
//                     onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
//                       setFieldOfStudy(ev.target.value)
//                     }
//                   />
//                 </TextField>

//                 {/* School Name */}
//                 <SchoolNameDropdown
//                   value={schoolName}
//                   onChange={setSchoolName}
//                   disabled={isSubmitting}
//                 />

//                 {/* Years */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Start Year */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[12px] font-medium">
//                       Start Year <span className="text-red-500">*</span>
//                     </label>

//                     <YearPicker
//                       value={startYear}
//                       onChange={setStartYear}
//                       minYear={1950}
//                       maxYear={new Date().getFullYear()}
//                     />
//                   </div>

//                   {/* End Year */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[12px] font-medium">
//                       End Year <span className="text-red-500">*</span>
//                     </label>
//                     <YearPicker
//                       value={endYear}
//                       onChange={setEndYear}
//                       disabled={currentlyStudying}
//                       minYear={Number(startYear) || 1950}
//                       maxYear={new Date().getFullYear()}
//                     />
//                   </div>
//                 </div>

//                 {/* Currently Studying Toggle */}
//                 <div className="flex items-center gap-3">
//                   <Switch
//                     checked={currentlyStudying}
//                     onCheckedChange={handleCurrentlyStudyingToggle}
//                     tabIndex={0}
//                     role="switch"
//                     aria-checked={currentlyStudying}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" || e.key === " ") {
//                         e.preventDefault();
//                         handleCurrentlyStudyingToggle(!currentlyStudying);
//                       }
//                     }}
//                     className="h-5 w-9 transition-colors"
//                     style={{
//                       backgroundColor: currentlyStudying
//                         ? colors.primary // ON color
//                         : colors.neutral?.[400] || "#374151", // OFF color fallback
//                     }}
//                   />

//                   <span className="text-sm text-neutral-700">
//                     I am currently studying
//                   </span>
//                 </div>

//                 {/* GPA Field - US 4-point scale */}
//                 {/* Grade Type Selector Dropdown + Input Side by Side */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Grade Type Selector Dropdown */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[12px] font-medium text-neutral-900">
//                       Grade System <span className="text-red-500">*</span>
//                     </label>

//                     <SubframeCore.DropdownMenu.Root>
//                       <SubframeCore.DropdownMenu.Trigger asChild>
//                         <div
//                           className="flex h-10 items-center justify-between rounded-full border border-neutral-300 px-4 cursor-pointer hover:bg-neutral-50 transition"
//                           style={{ backgroundColor: colors.white }}
//                         >
//                           <span
//                             className="text-[12px] font-medium"
//                             style={{ color: colors.accent }}
//                           >
//                             {gradeType === "gpa" ? "GPA" : "CGPA"}
//                           </span>

//                           <FeatherChevronDown style={{ color: "#6B7280" }} />
//                         </div>
//                       </SubframeCore.DropdownMenu.Trigger>

//                       <SubframeCore.DropdownMenu.Portal>
//                         <SubframeCore.DropdownMenu.Content
//                           sideOffset={4}
//                           align="start"
//                           className="bg-white text-neutral-900 rounded-2xl shadow-lg py-1 border border-neutral-300 min-w-[180px]"
//                           style={{ zIndex: 999999 }}
//                         >
//                           <SubframeCore.DropdownMenu.Item
//                             className="px-4 py-2 text-sm text-neutral-900 cursor-pointer hover:bg-neutral-100 outline-none"
//                             onSelect={() => {
//                               setGradeType("gpa");
//                               setGradeValue("");
//                             }}
//                           >
//                             GPA (4.0)
//                           </SubframeCore.DropdownMenu.Item>

//                           <SubframeCore.DropdownMenu.Item
//                             className="px-4 py-2 text-sm text-neutral-900 cursor-pointer hover:bg-neutral-100 outline-none"
//                             onSelect={() => {
//                               setGradeType("cgpa");
//                               setGradeValue("");
//                             }}
//                           >
//                             CGPA (10.0)
//                           </SubframeCore.DropdownMenu.Item>
//                         </SubframeCore.DropdownMenu.Content>
//                       </SubframeCore.DropdownMenu.Portal>
//                     </SubframeCore.DropdownMenu.Root>
//                   </div>

//                   {/* Single Grade Input Field */}
//                   <TextField
//                     className="h-auto w-full [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300"
//                     label={
//                       <span className="text-[12px]">
//                         {gradeType === "gpa" ? "GPA" : "CGPA"}{" "}
//                         <span className="text-red-500">*</span>
//                       </span>
//                     }
//                   >
//                     <TextField.Input
//                       className="rounded-full h-10 px-4 bg-white !border-none focus:ring-0"
//                       placeholder={
//                         gradeType === "gpa" ? "e.g., 3.8" : "e.g., 7.8"
//                       }
//                       value={gradeValue}
//                       onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
//                         const value = ev.target.value.replace(/[^0-9.]/g, "");
//                         const decimalCount = (value.match(/\./g) || []).length;
//                         if (decimalCount <= 1) {
//                           setGradeValue(value);
//                         }
//                       }}
//                     />
//                   </TextField>
//                 </div>

//                 <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
//                   <Button
//                     type="button"
//                     disabled={isSubmitting}
//                     variant="neutral-secondary"
//                     icon={<FeatherPlus />}
//                     className="w-full rounded-full h-10 px-4 border-neutral-300"
//                     onClick={() =>
//                       isEditing ? handleUpdateEducation() : handleAddEducation()
//                     }
//                   >
//                     {isSubmitting
//                       ? isEditing
//                         ? "Updating..."
//                         : "Adding..."
//                       : isEditing
//                         ? "Update education"
//                         : "Add another education"}
//                   </Button>

//                   <div className="flex-1" />
//                   {/* ✅ Cancle Edit */}
//                   {isEditing && (
//                     <Button
//                       onClick={resetForm}
//                       type="button"
//                       className="w-full rounded-full h-10 mt-2"
//                       variant="brand-tertiary"
//                       style={{ backgroundColor: colors.primaryGlow }}
//                     >
//                       Cancel edit
//                     </Button>
//                   )}
//                 </div>
//               </form>

//               {/* Top form horizontal line */}
//               <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />
//               <footer>
//                 <Button
//                   onClick={handleContinue}
//                   disabled={!canContinue || isSubmitting}
//                   className="w-full h-10 sm:h-11 rounded-full text-sm sm:text-base font-semibold transition-all active:scale-[0.99]"
//                   style={{
//                     backgroundColor:
//                       !canContinue || isSubmitting
//                         ? colors.neutral[200]
//                         : colors.accent,
//                     color: colors.background,
//                     cursor:
//                       !canContinue || isSubmitting ? "not-allowed" : "pointer",
//                     opacity: !canContinue || isSubmitting ? 0.75 : 1,
//                     boxShadow:
//                       !canContinue || isSubmitting
//                         ? "none"
//                         : "0 10px 24px rgba(0,0,0,0.08)",
//                   }}
//                 >
//                   {isSubmitting ? "Saving..." : "Continue"}
//                 </Button>
//               </footer>
//             </main>

//             {/* Right panel */}
//             <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
//               <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
//                 <h3 className="text-[20px] text-neutral-900">
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

//                 {/* Top form horizontal line */}
//                 <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//                 <div className="mt-4">
//                   <div className="text-[16px] text-neutral-800 mb-3">
//                     Progress Steps
//                   </div>

//                   {/* ⚪ Completed — Demographics */}
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

//                   {/* 🟣 Active — Education */}
//                   <button
//                     style={{ backgroundColor: colors.primary }}
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl px-4 py-2 mb-3 hover:shadow-sm"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
//                       <IconWithBackground
//                         size="small"
//                         icon={<FeatherGraduationCap />}
//                       />
//                     </div>

//                     <span
//                       className="text-sm font-medium text-neutral-900"
//                       style={{ color: colors.white }}
//                     >
//                       Education
//                     </span>
//                   </button>

//                   {/* Inactive steps */}
//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherBriefcase />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">Experience</span>
//                   </button>

//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherFileCheck />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">
//                       Certifications
//                     </span>
//                   </button>

//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 mb-3 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherAward />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">Awards</span>
//                   </button>

//                   <button
//                     type="button"
//                     className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-default-background px-4 py-2 hover:bg-neutral-50"
//                   >
//                     <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white">
//                       <IconWithBackground
//                         variant="neutral"
//                         size="small"
//                         icon={<FeatherPackage />}
//                       />
//                     </div>
//                     <span className="text-sm text-neutral-500">Projects</span>
//                   </button>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {deleteId && (
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
//                     onClick={() => setDeleteId(null)}
//                     className="transition"
//                     style={{ color: colors.neutral[400] }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.color = colors.accent)
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.color = colors.neutral[400])
//                     }
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <p
//                   className="text-sm mb-6"
//                   style={{ color: colors.neutral[600] }}
//                 >
//                   Do you really want to delete this education?
//                 </p>

//                 <div className="flex gap-3">
//                   {/* Cancel */}
//                   <Button
//                     variant="brand-tertiary"
//                     className="flex-1 rounded-3xl"
//                     onClick={() => setDeleteId(null)}
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

//                   {/* Confirm */}
//                   <Button
//                     className="flex-1 rounded-3xl transition"
//                     onClick={handleRemove}
//                     disabled={isSubmitting}
//                     style={{
//                       backgroundColor: isSubmitting
//                         ? `${colors.red}66`
//                         : colors.red,
//                       color: colors.accent,
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

// src/components/Education.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setNavigation } from "../store/slices/onboardingSlice";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { Switch } from "../ui/components/Switch";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherAward,
  FeatherBriefcase,
  FeatherFileCheck,
  FeatherGraduationCap,
  FeatherPackage,
  FeatherPlus,
  FeatherX,
  FeatherCheck,
  FeatherEdit2,
  FeatherChevronRight,
  FeatherCalendar,
  FeatherBookOpen,
  FeatherMapPin,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import * as SubframeCore from "@subframe/core";
import { FeatherChevronDown } from "@subframe/core";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

const DEGREE_OPTIONS = [
  { label: "Diploma", value: "diploma" },
  { label: "Bachelor's Degree", value: "bachelor" },
  { label: "B.Tech", value: "b.tech" },
  { label: "Master's Degree", value: "master" },
  { label: "M.Tech", value: "m.tech" },
  { label: "Doctorate (PhD)", value: "phd" },
  { label: "Professional Degree", value: "professional_degree" },
  { label: "Other", value: "other" },
] as const;

type DegreeOption = (typeof DEGREE_OPTIONS)[number];

type ExperiencePoints = {
  demographics?: number;
  education?: number;
};

type EducationEntry = {
  id: string;
  degree: string;
  fieldOfStudy: string;
  schoolName: string;
  startYear: string;
  endYear?: string;
  currentlyStudying: boolean;
  gpa?: string;
  cgpa?: string;
};

type UniversityEntry = {
  id: string;
  name: string;
};

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const normalize = (v: string) => v.replace(/\s+/g, " ").trim();

const isValidYear = (value: string) => {
  if (!/^\d{4}$/.test(value)) return false;
  const year = Number(value);
  const currentYear = new Date().getFullYear();
  return year >= 1950 && year <= currentYear + 1;
};

const isEndAfterStart = (start: string, end: string) => {
  return Number(end) >= Number(start);
};

const toTitleCase = (v: string) =>
  normalize(v)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// YearPicker Component - Minimalist
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
  const currentYear = new Date().getFullYear();
  const selectedYear = value ? Number(value) : currentYear;

  const [open, setOpen] = useState(false);
  const [decadeStart, setDecadeStart] = useState(
    Math.floor(selectedYear / 10) * 10,
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return (
    <div className="relative" ref={ref}>
      <input
        readOnly
        disabled={disabled}
        value={value}
        placeholder="YYYY"
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={{ borderBottomColor: open ? colors.primary : undefined }}
      />

      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setDecadeStart((d) => d - 10)}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
            >
              «
            </button>

            <span className="text-sm font-medium text-neutral-700">
              {decadeStart} – {decadeStart + 9}
            </span>

            <button
              type="button"
              onClick={() => setDecadeStart((d) => d + 10)}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
            >
              »
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {years.map((year) => {
              const isDisabled = year < minYear || year > maxYear;
              const isSelected = value === String(year);

              return (
                <button
                  key={year}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(String(year));
                    setOpen(false);
                  }}
                  className="py-2 text-sm rounded-lg transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary
                      : "transparent",
                    color: isSelected
                      ? "white"
                      : isDisabled
                        ? colors.neutral[300]
                        : colors.neutral[600],
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.backgroundColor =
                        colors.primaryGlow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled && !isSelected) {
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

// SchoolNameDropdown - Minimalist
function SchoolNameDropdown({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(value || "");
  const debouncedQuery = useDebouncedValue(query, 250);

  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<UniversityEntry[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const wrapRef = React.useRef<HTMLDivElement>(null);

  const OPENALEX_BASE = "https://api.openalex.org";

  const fetchUniversities = React.useCallback(async (q: string) => {
    const url = `${OPENALEX_BASE}/institutions?search=${encodeURIComponent(q)}&per-page=25`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`OpenAlex error ${r.status}`);
    const json = await r.json();
    const mapped: UniversityEntry[] = (json?.results ?? [])
      .map((inst: any) => ({
        id: String(inst?.id || ""),
        name: String(inst?.display_name || ""),
      }))
      .filter((x: UniversityEntry) => x.id && x.name);
    return mapped;
  }, []);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    setQuery(value || "");
  }, [value]);

  React.useEffect(() => {
    if (!open) return;

    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setItems([]);
      setError(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUniversities(q);
        setItems(data);
      } catch (e: any) {
        setItems([]);
        setError(e?.message || "Could not load universities");
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQuery, open, fetchUniversities]);

  return (
    <div className="relative" ref={wrapRef}>
      <label className="text-xs font-medium text-neutral-500 mb-1 block">
        SCHOOL NAME
      </label>

      <input
        disabled={disabled}
        value={query}
        placeholder="Search your university"
        onFocus={() => !disabled && setOpen(true)}
        onClick={() => !disabled && setOpen(true)}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onChange(v);
          if (!open) setOpen(true);
        }}
        className="w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200"
        style={{ borderBottomColor: open ? colors.primary : undefined }}
      />

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
          <div className="px-4 py-2 text-xs border-b border-neutral-100 flex items-center justify-between">
            <span className="text-neutral-500">
              {loading ? "Searching..." : "Type 2+ characters to search"}
            </span>
            <button
              type="button"
              className="text-neutral-400 hover:text-neutral-600"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="max-h-[240px] overflow-y-auto">
            {error && (
              <div className="px-4 py-3 text-sm text-neutral-500">{error}</div>
            )}

            {!error &&
              !loading &&
              items.length === 0 &&
              debouncedQuery.trim().length >= 2 && (
                <div className="px-4 py-3 text-sm text-neutral-500">
                  No matches. You can keep typing to enter custom name.
                </div>
              )}

            {items.map((u) => (
              <button
                key={u.id}
                type="button"
                className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 transition-colors"
                onClick={() => {
                  onChange(u.name);
                  setQuery(u.name);
                  setOpen(false);
                }}
              >
                <span className="text-neutral-700">{u.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Education() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source;
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = !!editingId;
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");

  // local form state
  const [degree, setDegree] = useState<string>("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyStudying, setStudying] = useState(false);
  const [gradeType, setGradeType] = useState<"gpa" | "cgpa">("gpa");
  const [gradeValue, setGradeValue] = useState("");

  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [experiencePoints, setExperiencePoints] =
    useState<ExperiencePoints | null>(null);

  // stored entries
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [selectedEducation, setSelectedEducation] =
    useState<EducationEntry | null>(null);

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) + (experiencePoints?.education ?? 0);

  const validateEducation = (): string | null => {
    if (!degree.trim()) return "Degree is required";
    if (!fieldOfStudy.trim()) return "Field of study is required";
    if (!schoolName.trim()) return "School name is required";
    if (!startYear.trim()) return "Start year is required";
    if (!isValidYear(startYear)) return "Start year must be a valid year";
    if (!currentlyStudying) {
      if (!endYear.trim()) return "End year is required";
      if (!isValidYear(endYear)) return "End year must be a valid year";
      if (!isEndAfterStart(startYear, endYear))
        return "End year must be after start year";
    }
    if (!gradeValue.trim()) {
      return `Please enter ${gradeType === "gpa" ? "GPA" : "CGPA"}`;
    }
    if (gradeType === "gpa") {
      if (!/^(4(\.0{1,2})?|[0-3](\.[0-9]{1,2})?)$/.test(gradeValue))
        return "GPA must be between 0 and 4.0";
    } else {
      if (!/^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/.test(gradeValue))
        return "CGPA must be between 0 and 10";
    }
    return null;
  };

  const resetForm = () => {
    setDegree("");
    setFieldOfStudy("");
    setSchoolName("");
    setStartYear("");
    setEndYear("");
    setStudying(false);
    setGradeType("gpa");
    setGradeValue("");
    setEditingId(null);
  };

  const hasEducationOverlap = () => {
    const newStart = Number(startYear);
    const newEnd = currentlyStudying
      ? new Date().getFullYear()
      : Number(endYear);
    if (!Number.isFinite(newStart) || !Number.isFinite(newEnd)) return false;
    return educations.some((ed) => {
      const oldStart = Number(ed.startYear);
      const oldEnd = ed.currentlyStudying
        ? new Date().getFullYear()
        : Number(ed.endYear);
      if (!Number.isFinite(oldStart) || !Number.isFinite(oldEnd)) return false;
      return newStart < oldEnd && newEnd > oldStart;
    });
  };

  const handleAddEducation = async () => {
    const error = validateEducation();
    if (error) {
      toast.error(error);
      return;
    }

    if (hasEducationOverlap()) {
      toast.error("Education period overlaps with an existing degree.");
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const normalizedNew = {
      degree: normalize(degree).trim(),
      fieldOfStudy: normalize(toTitleCase(fieldOfStudy)).trim(),
      schoolName: normalize(toTitleCase(schoolName)).trim(),
      startYear,
    };

    const degreeExists = educations.some(
      (ed) => normalize(ed.degree).trim() === normalizedNew.degree,
    );
    if (degreeExists) {
      toast.error("You have already added this degree.");
      return;
    }

    const fieldExists = educations.some(
      (ed) =>
        normalize(ed.degree).trim() === normalizedNew.degree &&
        normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy,
    );
    if (fieldExists) {
      toast.error("This field of study already exists for this degree.");
      return;
    }

    const schoolExists = educations.some(
      (ed) =>
        normalize(ed.degree).trim() === normalizedNew.degree &&
        normalize(ed.fieldOfStudy).trim() === normalizedNew.fieldOfStudy &&
        normalize(ed.schoolName).trim() === normalizedNew.schoolName,
    );
    if (schoolExists) {
      toast.error("This school is already added for this degree and field.");
      return;
    }

    const currentYear = new Date().getFullYear();
    const duration = currentlyStudying
      ? currentYear - Number(startYear)
      : Number(endYear) - Number(startYear);

    const payload = {
      educations: [
        {
          degree,
          fieldOfStudy: toTitleCase(fieldOfStudy),
          schoolName: toTitleCase(schoolName),
          startYear: Number(startYear),
          endYear: currentlyStudying ? null : Number(endYear),
          currentlyStudying,
          duration,
          gpa: gradeType === "gpa" ? Number(gradeValue) : null,
          cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
          gradeSystem: gradeType,
        },
      ],
    };

    try {
      setIsSubmitting(true);
      const res = await API("POST", URL_PATH.education, payload, {
        "user-id": userId,
      });

      if (res?.navigation) {
        dispatch(setNavigation(res.navigation));
      }

      toast.success("Education added successfully");
      const created = res.data[0];

      setEducations((prev) => [
        {
          id: created._id,
          degree: created.degree,
          fieldOfStudy: created.fieldOfStudy,
          schoolName: created.schoolName,
          startYear: String(created.startYear),
          endYear: created.currentlyStudying
            ? undefined
            : String(created.endYear),
          currentlyStudying: created.currentlyStudying,
          gpa: created.gpa ? String(created.gpa) : undefined,
          cgpa: created.cgpa ? String(created.cgpa) : undefined,
        },
        ...prev,
      ]);

      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEducation = async () => {
    const error = validateEducation();
    if (error) {
      toast.error(error);
      return;
    }

    if (!editingId || !userId) return;

    const currentYear = new Date().getFullYear();
    const duration = currentlyStudying
      ? currentYear - Number(startYear)
      : Number(endYear) - Number(startYear);

    const payload = {
      degree,
      fieldOfStudy: toTitleCase(fieldOfStudy),
      schoolName: toTitleCase(schoolName),
      startYear: Number(startYear),
      endYear: currentlyStudying ? null : Number(endYear),
      currentlyStudying,
      duration,
      gpa: gradeType === "gpa" ? Number(gradeValue) : null,
      cgpa: gradeType === "cgpa" ? Number(gradeValue) : null,
      gradeSystem: gradeType,
    };

    try {
      setIsSubmitting(true);
      const res = await API(
        "PUT",
        `${URL_PATH.education}/${editingId}`,
        payload,
        { "user-id": userId },
      );

      if (res?.navigation) {
        dispatch(setNavigation(res.navigation));
      }

      toast.success("Education updated");

      setEducations((prev) =>
        prev.map((e) => {
          if (e.id !== editingId) return e;
          return {
            ...e,
            degree: payload.degree,
            fieldOfStudy: payload.fieldOfStudy,
            schoolName: payload.schoolName,
            startYear: String(payload.startYear),
            endYear: payload.currentlyStudying
              ? undefined
              : String(payload.endYear ?? ""),
            currentlyStudying: payload.currentlyStudying,
            gpa: payload.gpa != null ? String(payload.gpa) : undefined,
            cgpa: payload.cgpa != null ? String(payload.cgpa) : undefined,
          };
        }),
      );

      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!deleteId || !userId) return;

    try {
      setIsSubmitting(true);
      const res = await API(
        "DELETE",
        `${URL_PATH.deleteEducation}/${deleteId}`,
        undefined,
        { "user-id": userId },
      );

      if (res?.navigation) {
        dispatch(setNavigation(res.navigation));
      }

      toast.success("Education deleted successfully");
      setEducations((prev) => prev.filter((e) => e.id !== deleteId));
      await fetchExperienceIndex();
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasEducation = educations.length > 0;
  const canContinue = hasEducation;

  const fetchEducations = React.useCallback(async () => {
    if (!userId) return;
    try {
      const res = await API("GET", URL_PATH.getEducation, undefined, {
        "user-id": userId,
      });
      const apiEducations = res?.data || [];
      const mappedEducations: EducationEntry[] = apiEducations.map(
        (e: any) => ({
          id: e._id,
          degree: e.degree || "",
          fieldOfStudy: e.fieldOfStudy || "",
          schoolName: e.schoolName || "",
          startYear: String(e.startYear),
          endYear: e.currentlyStudying ? undefined : String(e.endYear),
          currentlyStudying: e.currentlyStudying,
          gpa: e.gpa ? String(e.gpa) : undefined,
          cgpa: e.cgpa ? String(e.cgpa) : undefined,
        }),
      );
      setEducations(mappedEducations);
    } catch (error) {
      console.error("Failed to fetch education", error);
    }
  }, [userId]);

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

  useEffect(() => {
    if (!userId) return;
    fetchExperienceIndex();
    fetchEducations();
  }, [userId, fetchExperienceIndex, fetchEducations]);
  const handleContinue = () => {
    if (!educations.length) {
      toast.error("Please add at least one education to continue.");
      return;
    }

    console.log("Source value:", source); // Check what source is
    console.log(
      "Navigating to:",
      source === "dashboard" ? "/dashboard" : "/experience",
    );

    if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/experience", { state: { source } });
    }
  };

  const handleCurrentlyStudyingToggle = (checked: boolean) => {
    setStudying(checked);
    if (checked) setEndYear("");
  };

  const getDegreeLabel = (degreeValue: string): string => {
    const degreeOption = DEGREE_OPTIONS.find(
      (option) => option.value === degreeValue,
    );
    return degreeOption?.label || degreeValue;
  };

  const fillFormForEdit = (ed: EducationEntry) => {
    setEditingId(ed.id);
    setDegree(ed.degree || "");
    setFieldOfStudy(ed.fieldOfStudy || "");
    setSchoolName(ed.schoolName || "");
    setStartYear(ed.startYear || "");
    setEndYear(ed.currentlyStudying ? "" : ed.endYear || "");
    setStudying(!!ed.currentlyStudying);
    if (ed.gpa) {
      setGradeType("gpa");
      setGradeValue(String(ed.gpa));
    } else if (ed.cgpa) {
      setGradeType("cgpa");
      setGradeValue(String(ed.cgpa));
    } else {
      setGradeType("gpa");
      setGradeValue("");
    }
    setSelectedEducation(ed);
  };

  // Minimalist field styles (matching Demographics)
  const fieldClass = "w-full mb-4";
  const inputClass =
    "w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200";
  const labelClass = "text-xs font-medium text-neutral-500 mb-1 block";

  const steps = [
    { label: "Demographics", icon: <FeatherCheck />, completed: true },
    { label: "Education", icon: <FeatherGraduationCap />, active: true },
    { label: "Experience", icon: <FeatherBriefcase /> },
    { label: "Certifications", icon: <FeatherFileCheck /> },
    { label: "Awards", icon: <FeatherAward /> },
    { label: "Projects", icon: <FeatherPackage /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar />

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple header with progress */}
        <div className="flex items-center gap-3 mb-8">
          <IconButton
            size="small"
            icon={<FeatherArrowLeft />}
            onClick={() => {
              if (source === "dashboard") {
                navigate("/dashboard");
              } else {
                navigate("/experience"); // This is correct - goes BACK to demographics
              }
            }}
            className="text-neutral-600 hover:text-neutral-900"
          />
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1 flex-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: "33.33%", backgroundColor: colors.primary }}
              />
            </div>
            <span className="text-xs text-neutral-500 ml-2">2/6</span>
          </div>
        </div>

        {/* Main content - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-neutral-900 mb-2">
                  Add your education
                </h1>
                <p className="text-sm text-neutral-500 font-light">
                  Your academic background helps shape your Experience Index
                </p>
              </div>

              {/* Education List - Minimalist */}
              {educations.length > 0 && (
                <div className="mb-8 space-y-3">
                  {educations.map((ed) => {
                    const isSelected = selectedEducation?.id === ed.id;

                    return (
                      <div
                        key={ed.id}
                        onClick={() =>
                          setSelectedEducation(isSelected ? null : ed)
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
                                color: colors.neutral[600],
                              }}
                            >
                              {ed.schoolName
                                .split(" ")
                                .slice(0, 2)
                                .map((s) => s[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral-900">
                                {getDegreeLabel(ed.degree)} in {ed.fieldOfStudy}
                              </h3>
                              <p className="text-sm text-neutral-500 mt-0.5">
                                {ed.schoolName}
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                {ed.startYear} -{" "}
                                {ed.currentlyStudying ? "Present" : ed.endYear}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fillFormForEdit(ed);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(ed.id);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {isSelected && (ed.gpa || ed.cgpa) && (
                          <div className="mt-3 pt-3 border-t border-neutral-100">
                            <p className="text-sm text-neutral-600">
                              <span className="text-neutral-400">Grade: </span>
                              {ed.gpa
                                ? `${ed.gpa} GPA`
                                : ed.cgpa
                                  ? `${ed.cgpa} CGPA`
                                  : ""}
                            </p>
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
                  isEditing ? handleUpdateEducation() : handleAddEducation();
                }}
                className="space-y-6"
              >
                {/* Degree */}
                <div className={fieldClass}>
                  <label className={labelClass}>DEGREE</label>
                  <SubframeCore.DropdownMenu.Root>
                    <SubframeCore.DropdownMenu.Trigger asChild>
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onFocus={() => setFocusedField("degree")}
                        onBlur={() => setFocusedField(null)}
                      >
                        <span
                          className={`text-sm ${!degree ? "text-neutral-400" : "text-neutral-900"}`}
                        >
                          {DEGREE_OPTIONS.find((d) => d.value === degree)
                            ?.label || "Select Degree"}
                        </span>
                        <FeatherChevronDown className="w-4 h-4 text-neutral-400" />
                      </div>
                    </SubframeCore.DropdownMenu.Trigger>
                    <SubframeCore.DropdownMenu.Portal>
                      <SubframeCore.DropdownMenu.Content
                        sideOffset={4}
                        align="start"
                        className="bg-white rounded-xl shadow-lg py-1 border border-neutral-200 min-w-[200px] z-50"
                      >
                        {DEGREE_OPTIONS.map((item) => (
                          <SubframeCore.DropdownMenu.Item
                            key={item.value}
                            className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer outline-none"
                            onSelect={() => setDegree(item.value)}
                          >
                            {item.label}
                          </SubframeCore.DropdownMenu.Item>
                        ))}
                      </SubframeCore.DropdownMenu.Content>
                    </SubframeCore.DropdownMenu.Portal>
                  </SubframeCore.DropdownMenu.Root>
                  <div className="h-px bg-neutral-200 mt-1" />
                </div>

                {/* Field of Study */}
                <div className={fieldClass}>
                  <label className={labelClass}>FIELD OF STUDY</label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    onFocus={() => setFocusedField("field")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g., Computer Science"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "field" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* School Name */}
                <SchoolNameDropdown
                  value={schoolName}
                  onChange={setSchoolName}
                />

                {/* Years */}
                <div className="grid grid-cols-2 gap-6">
                  <div className={fieldClass}>
                    <label className={labelClass}>START YEAR</label>
                    <YearPicker value={startYear} onChange={setStartYear} />
                  </div>
                  <div className={fieldClass}>
                    <label className={labelClass}>END YEAR</label>
                    <YearPicker
                      value={endYear}
                      onChange={setEndYear}
                      disabled={currentlyStudying}
                    />
                  </div>
                </div>

                {/* Currently Studying Toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-600">
                    Currently studying
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCurrentlyStudyingToggle(!currentlyStudying)
                    }
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                    style={{
                      backgroundColor: currentlyStudying
                        ? colors.primary
                        : colors.neutral[200],
                    }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentlyStudying ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Grade System and Value */}
                <div className="grid grid-cols-2 gap-6">
                  <div className={fieldClass}>
                    <label className={labelClass}>GRADE SYSTEM</label>
                    <SubframeCore.DropdownMenu.Root>
                      <SubframeCore.DropdownMenu.Trigger asChild>
                        <div className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-neutral-900">
                            {gradeType === "gpa" ? "GPA (4.0)" : "CGPA (10.0)"}
                          </span>
                          <FeatherChevronDown className="w-4 h-4 text-neutral-400" />
                        </div>
                      </SubframeCore.DropdownMenu.Trigger>
                      <SubframeCore.DropdownMenu.Portal>
                        <SubframeCore.DropdownMenu.Content
                          sideOffset={4}
                          align="start"
                          className="bg-white rounded-xl shadow-lg py-1 border border-neutral-200 min-w-[180px] z-50"
                        >
                          <SubframeCore.DropdownMenu.Item
                            className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer outline-none"
                            onSelect={() => {
                              setGradeType("gpa");
                              setGradeValue("");
                            }}
                          >
                            GPA (4.0)
                          </SubframeCore.DropdownMenu.Item>
                          <SubframeCore.DropdownMenu.Item
                            className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer outline-none"
                            onSelect={() => {
                              setGradeType("cgpa");
                              setGradeValue("");
                            }}
                          >
                            CGPA (10.0)
                          </SubframeCore.DropdownMenu.Item>
                        </SubframeCore.DropdownMenu.Content>
                      </SubframeCore.DropdownMenu.Portal>
                    </SubframeCore.DropdownMenu.Root>
                    <div className="h-px bg-neutral-200 mt-1" />
                  </div>

                  <div className={fieldClass}>
                    <label className={labelClass}>
                      {gradeType === "gpa" ? "GPA" : "CGPA"}
                    </label>
                    <input
                      type="text"
                      value={gradeValue}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        if ((value.match(/\./g) || []).length <= 1) {
                          setGradeValue(value);
                        }
                      }}
                      onFocus={() => setFocusedField("grade")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={
                        gradeType === "gpa" ? "0.0 - 4.0" : "0.0 - 10.0"
                      }
                      className={inputClass}
                      style={{
                        borderBottomColor:
                          focusedField === "grade" ? colors.primary : undefined,
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: colors.primaryGlow,
                      color: colors.neutral[600],
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                  >
                    <FeatherPlus className="w-4 h-4" />
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update Education"
                        : "Add Education"}
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
              {educations.length > 0 && (
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-6">
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
                          index === 1 ? `${colors.primary}08` : "transparent",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            index <= 1 ? colors.primary : colors.neutral[100],
                          color: index <= 1 ? "white" : colors.neutral[400],
                        }}
                      >
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <span
                        className="text-sm flex-1"
                        style={{
                          color:
                            index === 1
                              ? colors.primary
                              : index < 1
                                ? colors.neutral[800]
                                : colors.neutral[500],
                          fontWeight: index === 1 ? 500 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                      {index === 1 && (
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
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-[320px] bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Delete Education?
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
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
