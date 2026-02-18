// // src/components/Certifications.tsx
// "use client";

// import React, { useRef, useState, useEffect } from "react";
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
//   FeatherFileCheck,
//   FeatherFileText,
//   FeatherPackage,
//   FeatherPlus,
//   FeatherUpload,
//   FeatherX,
//   FeatherCheck,
//   FeatherEdit2,
// } from "@subframe/core";
// import API, { URL_PATH } from "src/common/API";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { colors } from "src/common/Colors";
// import Navbar from "src/ui/components/Navbar";
// import Footer from "../ui/components/Footer";
// // RIGHT
// import { useAppDispatch } from "../store/hooks";
// import { setNavigation } from "src/store/slices/onboardingSlice";
// type CertEntry = {
//   id: string;
//   name: string;
//   issuer: string;
//   issueDate: string; // MM/YYYY
//   credentialLink?: string;
//   file?: File;
// };
// const URL_REGEX = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

// const isValidUrl = (value: string) => {
//   return URL_REGEX.test(value.trim());
// };

// const normalizeSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

// const DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

// const isValidMonthYear = (value: string) => DATE_REGEX.test(value);

// const TEXT_REGEX = /^[A-Za-z][A-Za-z\s.&-]{1,80}$/;

// const isValidText = (value: string) => {
//   return TEXT_REGEX.test(value.trim());
// };

// const isValidPastOrCurrentDate = (value: string) => {
//   if (!value) return true;

//   if (!DATE_REGEX.test(value)) return false;

//   const [mm, yyyy] = value.split("/").map(Number);
//   const inputDate = new Date(yyyy, mm - 1, 1);
//   const now = new Date();
//   const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//   return inputDate <= currentMonth;
// };

// const toTitleCase = (value: string) =>
//   value
//     .toLowerCase()
//     .split(" ")
//     .filter(Boolean)
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(" ");

// const notify = (msg: string) => {
//   toast.error(msg); // replace with toast later
// };

// // -----------------Month And Year Picker----------

// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// type MonthYearPickerProps = {
//   value: string; // "MM/YYYY"
//   onChange: (value: string) => void;
//   disabled?: boolean;
//   minYear?: number;
//   maxYear?: number;
// };

// function MonthYearPicker({
//   value,
//   onChange,
//   disabled = false,
//   minYear = 1950,
//   maxYear = new Date().getFullYear(),
// }: MonthYearPickerProps) {
//   const currentYear = value
//     ? Number(value.split("/")[1])
//     : new Date().getFullYear();

//   const [open, setOpen] = useState(false);
//   const [year, setYear] = useState(currentYear);

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

//   const isFutureMonth = (monthIndex: number) => {
//     const now = new Date();
//     return (
//       year > now.getFullYear() ||
//       (year === now.getFullYear() && monthIndex > now.getMonth())
//     );
//   };

//   return (
//     <div className="relative" ref={ref}>
//       {/* INPUT */}
//       <input
//         readOnly
//         disabled={disabled}
//         value={value || ""}
//         placeholder="MM / YYYY"
//         onClick={() => !disabled && setOpen((o) => !o)}
//         className={`w-full h-10 px-4 rounded-full cursor-pointer border border-neutral-300
//           focus:outline-none text-sm placeholder:text-xs
//           ${disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"}`}
//       />

//       {/* PICKER */}
//       {open && (
//         <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3">
//           {/* HEADER */}
//           <div className="flex items-center justify-between mb-3">
//             <button
//               type="button"
//               disabled={year <= minYear}
//               onClick={() => setYear((y) => y - 1)}
//               className="px-2 text-lg disabled:text-neutral-300"
//             >
//               «
//             </button>

//             <span className="text-sm font-medium">{year}</span>

//             <button
//               type="button"
//               disabled={year >= maxYear}
//               onClick={() => setYear((y) => y + 1)}
//               className="px-2 text-lg disabled:text-neutral-300"
//             >
//               »
//             </button>
//           </div>

//           {/* MONTH GRID */}
//           <div className="grid grid-cols-3 gap-2 text-sm">
//             {MONTHS.map((month, index) => {
//               const disabledMonth = isFutureMonth(index);
//               const formatted = `${String(index + 1).padStart(2, "0")}/${year}`;

//               return (
//                 <button
//                   key={month}
//                   type="button"
//                   disabled={disabledMonth}
//                   onClick={() => {
//                     onChange(formatted);
//                     setOpen(false);
//                   }}
//                   className="py-2 px-3 rounded-lg transition text-sm sm:text-base"
//                   style={{
//                     backgroundColor:
//                       value === formatted ? colors.accent : "transparent",
//                     color:
//                       value === formatted
//                         ? colors.background
//                         : disabledMonth
//                           ? colors.neutral[400]
//                           : colors.neutral[800],
//                     cursor: disabledMonth ? "not-allowed" : "pointer",
//                     opacity: disabledMonth ? 0.7 : 1,
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!disabledMonth && value !== formatted) {
//                       e.currentTarget.style.backgroundColor =
//                         colors.primaryGlow;
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!disabledMonth && value !== formatted) {
//                       e.currentTarget.style.backgroundColor = "transparent";
//                     }
//                   }}
//                 >
//                   {month}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function Certifications() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const source = location.state?.source;

//   console.log("CERTIFICATIONS source:", source);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const userId = localStorage.getItem("userId");

//   const MAX_CERTS = 5;

//   // form state
//   const [name, setName] = useState("");
//   const [issuer, setIssuer] = useState("");
//   const [issueDate, setIssueDate] = useState("");
//   const [credentialLink, setCredentialLink] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [experiencePoints, setExperiencePoints] = useState<any>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [selectedCert, setSelectedCert] = useState<CertEntry | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const isEditing = !!editingId;
//   const dispatch = useAppDispatch();

//   const displayedIndex =
//     (experiencePoints?.demographics ?? 0) +
//     (experiencePoints?.education ?? 0) +
//     (experiencePoints?.workExperience ?? 0) +
//     (experiencePoints?.certifications ?? 0);

//   //GET
//   const fetchCertifications = async () => {
//     if (!userId) return;

//     try {
//       const res = await API(
//         "GET",
//         `${URL_PATH.getCertification}?_=${Date.now()}`,
//         undefined,
//         { "user-id": userId },
//       );

//       // console.log("FULL API RESPONSE:", res);

//       const apiCerts = Array.isArray(res?.data) ? res.data : [];

//       // console.log("CERT ARRAY:", apiCerts);

//       setCerts(
//         apiCerts.map((c: any) => {
//           let formattedDate = "";

//           if (c.issueDate) {
//             const d = new Date(c.issueDate);
//             const mm = String(d.getMonth() + 1).padStart(2, "0");
//             const yyyy = d.getFullYear();
//             formattedDate = `${mm}/${yyyy}`;
//           }

//           return {
//             id: c._id,
//             name: c.certificationName,
//             issuer: c.issuer,
//             issueDate: formattedDate,
//             credentialLink: c.credentialLink,
//           };
//         }),
//       );
//     } catch (e) {
//       console.error("FETCH ERROR", e);
//       setCerts([]);
//     }
//   };

//   const fetchExperienceIndex = async () => {
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
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;
//     fetchCertifications();
//     fetchExperienceIndex();
//   }, [userId]);

//   // stored certs
//   const [certs, setCerts] = useState<CertEntry[]>([]);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // SC2-style TextField classes (single-line friendly)
//   const scTextFieldClass =
//     "w-full [&>label]:text-[12px] [&>label]:font-medium [&>p]:text-[11px] [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-9";
//   const scInputClass =
//     "rounded-full h-9 px-3 text-[15px] placeholder:text-[15px] bg-white !border-none focus:ring-0 w-full";

//   const isAddable = () => {
//     const trimmedIssueDate = issueDate?.trim(); // ✅ KEY FIX

//     if (!name.trim()) {
//       notify("Certification name is required.");
//       return false;
//     }

//     // if (!isValidText(name)) {
//     //   notify("Certification name contains invalid characters.");
//     //   return false;
//     // }

//     if (!issuer.trim()) {
//       notify("Issuer is required.");
//       return false;
//     }

//     // if (!isValidText(issuer)) {
//     //   notify("Issuer name contains invalid characters.");
//     //   return false;
//     // }

//     // ✅ Date validation (fixed)
//     if (!issueDate.trim()) {
//       notify("Date is required.");
//       return false;
//     }

//     // if (!isValidPastOrCurrentDate(trimmedIssueDate)) {
//     //   notify("Issue date must be in MM/YYYY format and not in the future.");
//     //   return false;
//     // }

//     // if (!isValidPastOrCurrentDate(issueDate)) {
//     //   notify("Issue date cannot be in the future.");
//     //   return false;
//     // }

//     if (!isValidPastOrCurrentDate(issueDate.trim())) {
//       notify("Issue date must be in MM/YYYY format and not in the future.");
//       return false;
//     }

//     if (credentialLink.trim() && !isValidUrl(credentialLink)) {
//       toast.error("Credential link must be a valid URL (https://...)");
//       return false;
//     }

//     if (!credentialLink.trim() && !file) {
//       notify(" Provide either a credential link or upload the certificate PDF");
//       return false;
//     }

//     // if (!credentialLink.trim()) {
//     //     notify("Certification Link is required.");
//     //     return false;
//     //   }

//     //   if (!file) {
//     //     notify("Please upload the certification PDF.");
//     //     return false;
//     //   }

//     return true;
//   };

//   const isAddableSilent = () => {
//     if (!name.trim()) return false;
//     if (!isValidText(name)) return false;
//     if (!issuer.trim()) return false;
//     if (!isValidText(issuer)) return false;
//     if (!isValidMonthYear(issueDate)) return false;
//     if (!isValidPastOrCurrentDate(issueDate)) return false;
//     if (!credentialLink.trim() && !file) return false;
//     if (credentialLink.trim() && !isValidUrl(credentialLink)) return false;
//     // if (!file) return false;
//     return true;
//   };

//   const resetForm = () => {
//     setName("");
//     setIssuer("");
//     setIssueDate("");
//     setCredentialLink("");
//     setFile(null);
//     setEditingId(null);

//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleAdd = async () => {
//     if (certs.length >= MAX_CERTS) {
//       notify("You can add a maximum of 5 certifications only.");
//       return;
//     }
//     if (isSubmitting) return;
//     if (!isAddable()) return;

//     if (!userId) {
//       notify("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }
//     const isDuplicate = certs.some(
//       (c) =>
//         c.name.toLowerCase() === name.toLowerCase().trim() &&
//         c.issuer.toLowerCase() === issuer.toLowerCase().trim(),
//     );

//     if (isDuplicate) {
//       notify("This certification already exists.");
//       return;
//     }

//     setIsSubmitting(true);

//     const formData = new FormData();

//     formData.append("certificationName[0]", toTitleCase(normalizeSpaces(name)));
//     formData.append("issuer[0]", toTitleCase(normalizeSpaces(issuer)));

//     const [mm, yyyy] = issueDate.split("/");
//     formData.append("issueDate[0]", `${yyyy}-${mm}-01`);

//     if (credentialLink) {
//       formData.append("credentialLink[0]", credentialLink.trim());
//     }

//     if (file) {
//       // 🔥 MUST be plural to go into req.files[]
//       formData.append("certificateFiles", file);
//     }

//     try {
//       const res = await API("POST", URL_PATH.certification, formData, {
//         "user-id": userId,
//       });

//       toast.success("Certification added successfully");
//       // RIGHT
//       if (res?.navigation) {
//         dispatch(setNavigation(res.navigation));
//       }
//       // safest pattern (same as Experience)
//       await fetchCertifications();
//       await fetchExperienceIndex();

//       resetForm();
//     } catch (err: any) {
//       notify(err?.response?.data?.message || "Error creating certifications");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- EDIT CERTIFICATION --------------------
//   const handleUpdate = async () => {
//     if (isSubmitting) return;
//     if (!isAddable()) return;
//     if (!userId || !editingId) return;

//     setIsSubmitting(true);

//     const formData = new FormData();

//     formData.append("certificationName", toTitleCase(normalizeSpaces(name)));
//     formData.append("issuer", toTitleCase(normalizeSpaces(issuer)));

//     const [mm, yyyy] = issueDate.split("/");
//     formData.append("issueDate", `${yyyy}-${mm}-01`);

//     if (credentialLink) {
//       formData.append("credentialLink", credentialLink.trim());
//     }

//     // optional file replace
//     if (file) {
//       formData.append("certificateFiles", file);
//     }

//     try {
//       await API(
//         "PUT",
//         `${URL_PATH.certification}/${editingId}`, // ✅ confirm your backend route
//         formData,
//         { "user-id": userId },
//       );

//       toast.success("Certification updated successfully");

//       await fetchCertifications();
//       await fetchExperienceIndex();
//       resetForm();
//     } catch (err: any) {
//       notify(err?.response?.data?.message || "Failed to update certification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -------------------- DELETE CERTIFICATION --------------------
//   const handleRemove = async () => {
//     if (!deleteId) return;

//     if (!userId) {
//       notify("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       await API(
//         "DELETE",
//         `${URL_PATH.deleteCertification}/${deleteId}`,
//         undefined,
//         { "user-id": userId },
//       );

//       setCerts((prev) => prev.filter((c) => c.id !== deleteId));
//       if (selectedCert?.id === deleteId) {
//         setSelectedCert(null);
//       }

//       await fetchExperienceIndex();

//       setDeleteId(null);
//     } catch (err: any) {
//       notify(err?.response?.data?.message || "Failed to delete certification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // File handling (.pdf only, <= 5MB)
//   const handleBrowseFile = () => fileInputRef.current?.click();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     const uploaded = e.target.files[0];
//     if (uploaded.type !== "application/pdf") {
//       notify("Only PDF files are allowed.");
//       return;
//     }
//     if (uploaded.size > 5 * 1024 * 1024) {
//       notify("File size must be less than 5MB.");
//       return;
//     }
//     setFile(uploaded);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
//     const uploaded = e.dataTransfer.files[0];
//     if (uploaded.type !== "application/pdf") {
//       notify("Only PDF files are allowed.");
//       return;
//     }
//     if (uploaded.size > 5 * 1024 * 1024) {
//       notify("File size must be less than 5MB.");
//       return;
//     }
//     setFile(uploaded);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const removeFile = () => {
//     setFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const canContinue = certs.length > 0;

//   // const handleContinue = () => {
//   //   if (!canContinue) {
//   //     notify("Please add at least one certification.");
//   //     return;
//   //   }

//   //   navigate("/awards", {
//   //     state: { source },
//   //   });
//   // };

//   const handleContinue = () => {
//     if (!certs.length) {
//       toast.error("Please add at least one certification to continue.");
//       return;
//     }

//     if (source === "dashboard") {
//       navigate("/dashboard");
//     } else {
//       navigate("/awards", { state: { source } });
//     }
//   };

//   const handleUploadKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       handleBrowseFile();
//     }

//     if (e.key === "Escape" && file) {
//       e.preventDefault();
//       removeFile();
//     }
//   };

//   const fillFormForEdit = (c: CertEntry) => {
//     setEditingId(c.id);

//     setName(c.name || "");
//     setIssuer(c.issuer || "");
//     setIssueDate(c.issueDate || "");
//     setCredentialLink(c.credentialLink || "");
//     setFile(null);

//     if (fileInputRef.current) fileInputRef.current.value = "";

//     setSelectedCert(c);
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
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
//       <div className="relative z-10">
//         <Navbar />
//         <ToastContainer position="top-center" autoClose={3000} />

//         <div className="flex justify-center sm:px-6 py-0 sm:py-0">
//           <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center py-8">
//             {/* Left card */}
//             <main className="w-full md:max-w-[448px] flex flex-col gap-6 rounded-3xl border border-neutral-300 bg-white px-4 sm:px-6 md:px-8 py-6 sm:py-8">
//               {/* top - back + progress */}
//               <div className="flex w-full items-center justify-center gap-4">
//                 <IconButton
//                   size="small"
//                   icon={<FeatherArrowLeft />}
//                   onClick={() => {
//                     if (source === "dashboard") {
//                       navigate("/dashboard");
//                     } else {
//                       // Navigate directly to experience page
//                       navigate("/experience");
//                     }
//                   }}
//                 />

//                 <div className="flex-1 w-full max-w-full md:max-w-[420px]">
//                   <div className="flex items-center gap-3">
//                     {[...Array(4)].map((_, i) => (
//                       <div
//                         key={`p-${i}`}
//                         style={{ height: 6, backgroundColor: colors.primary }}
//                         className="flex-1 rounded-full"
//                       />
//                     ))}
//                     {[...Array(2)].map((_, i) => (
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
//               <header className="mt-1 w-full">
//                 <h2 className="text-[22px] text-neutral-900">
//                   Add your certifications
//                 </h2>
//                 <p className="mt-1 text-xs text-neutral-500">
//                   Professional certifications help boost your Experience Index
//                 </p>
//               </header>

//               {/* selected cert preview list */}
//               <section className="flex w-full flex-col gap-3">
//                 {certs.map((c) => {
//                   const isSelected = selectedCert?.id === c.id;

//                   return (
//                     <div
//                       key={c.id}
//                       role="button"
//                       tabIndex={0}
//                       onClick={() => setSelectedCert(isSelected ? null : c)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           e.preventDefault();
//                           setSelectedCert(isSelected ? null : c);
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
//                             {c.issuer
//                               ? c.issuer
//                                   .split(" ")
//                                   .slice(0, 2)
//                                   .map((s) => s[0])
//                                   .join("")
//                               : "C"}
//                           </Avatar>

//                           <div className="flex flex-col min-w-0">
//                             <span className="text-sm font-semibold text-neutral-900 truncate">
//                               {c.name}
//                             </span>
//                             <span className="text-xs text-neutral-500 truncate">
//                               {c.issuer}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Right */}
//                         <div className="flex flex-col items-end gap-2 shrink-0">
//                           <div className="flex items-center gap-2">
//                             {/* ✅ Edit */}
//                             <IconButton
//                               size="small"
//                               icon={<FeatherEdit2 />}
//                               aria-label={`Edit certificate ${c.name}`}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 fillFormForEdit(c);
//                               }}
//                               className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                             />

//                             {/* ✅ Delete */}
//                             <IconButton
//                               size="small"
//                               icon={<FeatherX />}
//                               aria-label={`Delete certificate ${c.name}`}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setDeleteId(c.id);
//                               }}
//                               className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
//                             />
//                           </div>

//                           <span className="text-xs text-neutral-500">
//                             {c.issueDate}
//                           </span>
//                         </div>
//                       </div>

//                       {/* 🔹 DETAILS (INSIDE SAME BORDER) */}
//                       {isSelected && (
//                         <>
//                           <div className="my-4 border-t border-neutral-200" />

//                           <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
//                             <div>
//                               <span className="font-medium">Name:</span>{" "}
//                               {c.name}
//                             </div>

//                             {c.issuer && (
//                               <div>
//                                 <span className="font-medium">Issuer:</span>{" "}
//                                 {c.issuer}
//                               </div>
//                             )}

//                             {c.issueDate && (
//                               <div>
//                                 <span className="font-medium">Issue date:</span>{" "}
//                                 {c.issueDate}
//                               </div>
//                             )}

//                             {c.credentialLink && (
//                               <div>
//                                 <span
//                                   style={{ color: colors.neutral[800] }}
//                                   className="font-medium"
//                                 >
//                                   Credential:
//                                 </span>{" "}
//                                 <a
//                                   href={c.credentialLink}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   onClick={(e) => e.stopPropagation()}
//                                   className="underline transition"
//                                   style={{ color: colors.accent }}
//                                   onMouseEnter={(e) =>
//                                     (e.currentTarget.style.color =
//                                       colors.neutral[800])
//                                   }
//                                   onMouseLeave={(e) =>
//                                     (e.currentTarget.style.color =
//                                       colors.accent)
//                                   }
//                                 >
//                                   View
//                                 </a>
//                               </div>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   );
//                 })}
//               </section>

//               {/* form */}
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAdd();
//                 }}
//                 className="flex w-full flex-col gap-4"
//               >
//                 <TextField
//                   label={
//                     <span className="text-[12px]">
//                       Certification Name <span className="text-red-500">*</span>
//                     </span>
//                   }
//                   helpText=""
//                   className={scTextFieldClass}
//                 >
//                   <TextField.Input
//                     placeholder="e.g., Certified Product Manager"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     onBlur={() => setName(toTitleCase(name))}
//                     className={scInputClass}
//                   />
//                 </TextField>

//                 <TextField
//                   label={
//                     <span className="text-[12px]">
//                       Issuer <span className="text-red-500">*</span>{" "}
//                     </span>
//                   }
//                   className={scTextFieldClass}
//                 >
//                   <TextField.Input
//                     placeholder="Issuing organization"
//                     value={issuer}
//                     onChange={(e) => setIssuer(e.target.value)}
//                     onBlur={() => setIssuer(toTitleCase(issuer))}
//                     className={scInputClass}
//                   />
//                 </TextField>
//                 {/* ------------Date------------------ */}

//                 {/* // date------------------------- */}
//                 <div className="flex flex-col gap-6 max-w-lg">
//                   {/* Issue Month & Year */}
//                   <div className="flex flex-col gap-1">
//                     <label
//                       htmlFor="issueDate"
//                       className="text-[12px] font-medium text-neutral-700"
//                     >
//                       Issue Month & Year <span className="text-red-500">*</span>
//                     </label>

//                     <MonthYearPicker
//                       value={issueDate}
//                       onChange={setIssueDate}
//                     />
//                   </div>
//                 </div>

//                 {/* ---------------End Date-------------- */}

//                 <TextField
//                   label={<span className="text-[12px]">Credential Link </span>}
//                   helpText=""
//                   className={scTextFieldClass}
//                 >
//                   <TextField.Input
//                     placeholder="https://"
//                     value={credentialLink}
//                     onChange={(e) =>
//                       setCredentialLink(e.target.value.replace(/\s/g, ""))
//                     }
//                     onBlur={() => {
//                       if (!credentialLink) return;
//                       if (!credentialLink.startsWith("http")) {
//                         setCredentialLink("https://" + credentialLink);
//                       }
//                     }}
//                     className={scInputClass}
//                   />
//                 </TextField>

//                 {/* ✅ OR Divider (ADD THIS) */}
//                 <div className="flex items-center gap-3 my-1">
//                   <div className="flex-1 h-px bg-neutral-300" />
//                   <span className="text-[11px] text-neutral-500 font-medium tracking-wide">
//                     OR
//                   </span>
//                   <div className="flex-1 h-px bg-neutral-300" />
//                 </div>

//                 {/* Upload */}
//                 <div className="w-full">
//                   <div className="text-[12px] text-neutral-800 mb-2">
//                     Upload Certificate
//                   </div>

//                   <div
//                     role="button"
//                     tabIndex={0}
//                     aria-label="Upload certificate PDF. Click or press Enter to browse files. Drag and drop is supported. Press Escape to remove the selected file."
//                     onClick={handleBrowseFile}
//                     onKeyDown={handleUploadKeyDown}
//                     onDrop={handleDrop}
//                     onDragOver={handleDragOver}
//                     className="w-full rounded-2xl border-2 border-dashed border-neutral-300 bg-gray-50 px-6 py-4 flex flex-col items-center justify-center cursor-pointer"
//                   >
//                     <IconWithBackground
//                       size="large"
//                       icon={
//                         <FeatherUpload className="w-5 h-5 text-neutral-600" />
//                       }
//                       className="!bg-neutral-200 !rounded-full !p-3 shadow-s"
//                     />

//                     <div className="mt-3 text-xm text-neutral-600 text-center">
//                       Click to select file or drag to upload
//                     </div>
//                     <div className="text-xs text-neutral-400 mt-1 text-center">
//                       PDF format only, max file size 5MB
//                     </div>
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       className="hidden"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                     />
//                   </div>

//                   {/* file preview */}
//                   {file && (
//                     <div className="mt-4 rounded-2xl border border-neutral-300 bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
//                       <div className="flex items-center gap-3">
//                         <IconWithBackground
//                           size="medium"
//                           icon={
//                             <FeatherFileText className="w-4 h-4 text-red-800" />
//                           }
//                           className="!bg-red-100 !rounded-full !p-3"
//                         />
//                         <div className="flex flex-col">
//                           <span className="text-sm text-neutral-900">
//                             {file.name}
//                           </span>
//                           <span className="text-xs text-neutral-500">
//                             {(file.size / (1024 * 1024)).toFixed(1)} MB
//                           </span>
//                         </div>
//                       </div>
//                       <IconButton
//                         size="small"
//                         icon={<FeatherX />}
//                         onClick={removeFile}
//                         className="!bg-transparent !text-neutral-500"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center">
//                   <Button
//                     type="button"
//                     disabled={isSubmitting}
//                     variant="neutral-secondary"
//                     icon={<FeatherPlus />}
//                     className="w-full rounded-full h-10 px-4 border-neutral-300"
//                     onClick={() => (isEditing ? handleUpdate() : handleAdd())}
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

//               {/* divider */}
//               <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

//               <footer>
//                 <Button
//                   onClick={handleContinue}
//                   disabled={!canContinue || isSubmitting}
//                   className="w-full h-10 rounded-full transition-all duration-200"
//                   style={{
//                     backgroundColor:
//                       !canContinue || isSubmitting
//                         ? `${colors.accent}55` // faded primary when disabled
//                         : colors.accent,
//                     color:
//                       !canContinue || isSubmitting
//                         ? `${colors.background}AA` // soft white text
//                         : colors.background,
//                     boxShadow:
//                       !canContinue || isSubmitting
//                         ? "none"
//                         : "0 6px 18px rgba(99,52,237,0.18)",
//                     cursor:
//                       !canContinue || isSubmitting ? "not-allowed" : "pointer",
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

//                   {/* ⚪ Completed — Education */}
//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                     <IconWithBackground
//                       size="small"
//                       icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                       className="!bg-green-100 !rounded-full !p-3"
//                     />
//                     <span className="text-sm text-neutral-700">Education</span>
//                   </div>

//                   {/* Experience — completed (green) */}
//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                     <IconWithBackground
//                       size="small"
//                       icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
//                       className="!bg-green-100 !rounded-full !p-3"
//                     />
//                     <span className="text-sm text-neutral-700">Experience</span>
//                   </div>

//                   {/* Certifications — active (purple) */}
//                   <div
//                     style={{ backgroundColor: colors.primary }}
//                     className="flex items-center gap-3 rounded-2xl px-4 py-2 mb-3"
//                   >
//                     <div
//                       className="flex items-center justify-center h-8 w-8 rounded-2xl shadow-sm"
//                       style={{ backgroundColor: colors.white }}
//                     >
//                       <IconWithBackground
//                         size="small"
//                         variant="neutral"
//                         className="!bg-transparent"
//                         style={{ color: colors.accent }}
//                         icon={<FeatherFileCheck />}
//                       />
//                     </div>

//                     <span
//                       className="text-sm font-medium"
//                       style={{ color: colors.white }}
//                     >
//                       Certifications
//                     </span>
//                   </div>

//                   {/* Awards — Inactive */}
//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
//                     <IconWithBackground
//                       size="small"
//                       variant="neutral"
//                       className="!bg-grey !text-neutral-600"
//                       icon={<FeatherAward />}
//                     />
//                     <span className="text-sm text-neutral-500">Awards</span>
//                   </div>

//                   {/* Projects — Inactive */}
//                   <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2">
//                     <IconWithBackground
//                       size="small"
//                       variant="neutral"
//                       className="!bg-grey !text-neutral-600"
//                       icon={<FeatherPackage />}
//                     />
//                     <span className="text-sm text-neutral-500">Projects</span>
//                   </div>
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
//                   Do you really want to delete this certification?
//                 </p>

//                 <div className="flex gap-3">
//                   {/* Cancel */}
//                   <Button
//                     className="flex-1 rounded-3xl transition"
//                     onClick={() => setDeleteId(null)}
//                     style={{
//                       backgroundColor: colors.primary,
//                       color: colors.accent,
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.backgroundColor = colors.secondary)
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.backgroundColor = colors.primary)
//                     }
//                   >
//                     Cancel
//                   </Button>

//                   {/* Yes */}
//                   <Button
//                     className="flex-1 rounded-3xl transition"
//                     onClick={handleRemove}
//                     disabled={isSubmitting}
//                     style={{
//                       backgroundColor: isSubmitting
//                         ? `${colors.red}55`
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

// src/components/Certifications.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherAward,
  FeatherFileCheck,
  FeatherFileText,
  FeatherPackage,
  FeatherPlus,
  FeatherUpload,
  FeatherX,
  FeatherCheck,
  FeatherEdit2,
  FeatherChevronRight,
  FeatherCalendar,
  FeatherLink,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";
import { useAppDispatch } from "../store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";

type CertEntry = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialLink?: string;
  file?: File;
};

const URL_REGEX = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

const isValidUrl = (value: string) => {
  return URL_REGEX.test(value.trim());
};

const normalizeSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

const DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

const isValidMonthYear = (value: string) => DATE_REGEX.test(value);

const TEXT_REGEX = /^[A-Za-z][A-Za-z\s.&-]{1,80}$/;

const isValidText = (value: string) => {
  return TEXT_REGEX.test(value.trim());
};

const isValidPastOrCurrentDate = (value: string) => {
  if (!value) return true;
  if (!DATE_REGEX.test(value)) return false;

  const [mm, yyyy] = value.split("/").map(Number);
  const inputDate = new Date(yyyy, mm - 1, 1);
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return inputDate <= currentMonth;
};

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// MonthYearPicker Component - Minimalist (matching Experience)
type MonthYearPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
};

function MonthYearPicker({
  value,
  onChange,
  disabled = false,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
}: MonthYearPickerProps) {
  const currentYear = value
    ? Number(value.split("/")[1])
    : new Date().getFullYear();

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(currentYear);
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

  const isFutureMonth = (monthIndex: number) => {
    const now = new Date();
    return (
      year > now.getFullYear() ||
      (year === now.getFullYear() && monthIndex > now.getMonth())
    );
  };

  return (
    <div className="relative" ref={ref}>
      <input
        readOnly
        disabled={disabled}
        value={value || ""}
        placeholder="MM/YYYY"
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
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              disabled={year <= minYear}
              onClick={() => setYear((y) => y - 1)}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 disabled:text-neutral-300"
            >
              «
            </button>
            <span className="text-sm font-medium text-neutral-700">{year}</span>
            <button
              type="button"
              disabled={year >= maxYear}
              onClick={() => setYear((y) => y + 1)}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 disabled:text-neutral-300"
            >
              »
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const disabledMonth = isFutureMonth(index);
              const formatted = `${String(index + 1).padStart(2, "0")}/${year}`;
              const isSelected = value === formatted;

              return (
                <button
                  key={month}
                  type="button"
                  disabled={disabledMonth}
                  onClick={() => {
                    onChange(formatted);
                    setOpen(false);
                  }}
                  className="py-2 px-2 text-sm rounded-lg transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary
                      : "transparent",
                    color: isSelected
                      ? "white"
                      : disabledMonth
                        ? colors.neutral[300]
                        : colors.neutral[700],
                    cursor: disabledMonth ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!disabledMonth && !isSelected) {
                      e.currentTarget.style.backgroundColor =
                        colors.primaryGlow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!disabledMonth && !isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Certifications() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source;
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const MAX_CERTS = 5;

  // form state
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialLink, setCredentialLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [experiencePoints, setExperiencePoints] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertEntry | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = !!editingId;

  // stored certs
  const [certs, setCerts] = useState<CertEntry[]>([]);

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) +
    (experiencePoints?.education ?? 0) +
    (experiencePoints?.workExperience ?? 0) +
    (experiencePoints?.certifications ?? 0);

  // Minimalist field styles (matching Experience)
  const fieldClass = "w-full mb-4";
  const inputClass =
    "w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200";
  const labelClass = "text-xs font-medium text-neutral-500 mb-1 block";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // GET certifications
  const fetchCertifications = async () => {
    if (!userId) return;

    try {
      const res = await API(
        "GET",
        `${URL_PATH.getCertification}?_=${Date.now()}`,
        undefined,
        { "user-id": userId },
      );

      const apiCerts = Array.isArray(res?.data) ? res.data : [];

      setCerts(
        apiCerts.map((c: any) => {
          let formattedDate = "";

          if (c.issueDate) {
            const d = new Date(c.issueDate);
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            formattedDate = `${mm}/${yyyy}`;
          }

          return {
            id: c._id,
            name: c.certificationName,
            issuer: c.issuer,
            issueDate: formattedDate,
            credentialLink: c.credentialLink,
          };
        }),
      );
    } catch (e) {
      console.error("FETCH ERROR", e);
      setCerts([]);
    }
  };

  const fetchExperienceIndex = async () => {
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
  };

  useEffect(() => {
    if (!userId) return;
    fetchCertifications();
    fetchExperienceIndex();
  }, [userId]);

  const isAddable = () => {
    if (!name.trim()) {
      toast.error("Certification name is required.");
      return false;
    }

    if (!issuer.trim()) {
      toast.error("Issuer is required.");
      return false;
    }

    if (!issueDate.trim()) {
      toast.error("Issue date is required.");
      return false;
    }

    if (!isValidPastOrCurrentDate(issueDate.trim())) {
      toast.error(
        "Issue date must be in MM/YYYY format and not in the future.",
      );
      return false;
    }

    if (credentialLink.trim() && !isValidUrl(credentialLink)) {
      toast.error("Credential link must be a valid URL (https://...)");
      return false;
    }

    if (!credentialLink.trim() && !file) {
      toast.error(
        "Provide either a credential link or upload the certificate PDF",
      );
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setName("");
    setIssuer("");
    setIssueDate("");
    setCredentialLink("");
    setFile(null);
    setEditingId(null);
    setFocusedField(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAdd = async () => {
    if (certs.length >= MAX_CERTS) {
      toast.error("You can add a maximum of 5 certifications only.");
      return;
    }
    if (isSubmitting) return;
    if (!isAddable()) return;

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const isDuplicate = certs.some(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase().trim() &&
        c.issuer.toLowerCase() === issuer.toLowerCase().trim(),
    );

    if (isDuplicate) {
      toast.error("This certification already exists.");
      return;
    }

    setIsSubmitting(true);

    const [mm, yyyy] = issueDate.split("/");
    const formattedDate = `${yyyy}-${mm}-01`;

    // Create the payload matching backend expectations
    const payload = {
      certifications: [
        {
          certificationName: toTitleCase(normalizeSpaces(name)),
          issuer: toTitleCase(normalizeSpaces(issuer)),
          issueDate: formattedDate,
          credentialLink: credentialLink ? credentialLink.trim() : undefined,
        },
      ],
    };

    console.log("📦 Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const res = await API("POST", URL_PATH.certification, payload, {
        "user-id": userId,
        "Content-Type": "application/json",
      });

      console.log("✅ Response:", res);
      toast.success("Certification added successfully");

      if (res?.navigation) {
        dispatch(setNavigation(res.navigation));
      }

      await fetchCertifications();
      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      console.error("❌ Error:", err);
      console.error("❌ Error response:", err.response?.data);
      toast.error(
        err?.response?.data?.message || "Error creating certifications",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    if (!isAddable()) return;
    if (!userId || !editingId) return;

    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("certificationName", toTitleCase(normalizeSpaces(name)));
    formData.append("issuer", toTitleCase(normalizeSpaces(issuer)));

    const [mm, yyyy] = issueDate.split("/");
    formData.append("issueDate", `${yyyy}-${mm}-01`);

    if (credentialLink) {
      formData.append("credentialLink", credentialLink.trim());
    }

    if (file) {
      formData.append("certificateFiles", file);
    }

    try {
      await API("PUT", `${URL_PATH.certification}/${editingId}`, formData, {
        "user-id": userId,
      });

      toast.success("Certification updated successfully");

      await fetchCertifications();
      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update certification",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!deleteId || !userId) return;

    try {
      setIsSubmitting(true);

      await API(
        "DELETE",
        `${URL_PATH.deleteCertification}/${deleteId}`,
        undefined,
        { "user-id": userId },
      );

      setCerts((prev) => prev.filter((c) => c.id !== deleteId));
      if (selectedCert?.id === deleteId) {
        setSelectedCert(null);
      }

      await fetchExperienceIndex();
      setDeleteId(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete certification",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrowseFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploaded = e.target.files[0];
    if (uploaded.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (uploaded.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }
    setFile(uploaded);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const uploaded = e.dataTransfer.files[0];
    if (uploaded.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (uploaded.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }
    setFile(uploaded);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBrowseFile();
    }
    if (e.key === "Escape" && file) {
      e.preventDefault();
      removeFile();
    }
  };

  const fillFormForEdit = (c: CertEntry) => {
    setEditingId(c.id);
    setName(c.name || "");
    setIssuer(c.issuer || "");
    setIssueDate(c.issueDate || "");
    setCredentialLink(c.credentialLink || "");
    setFile(null);
    setSelectedCert(c);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canContinue = certs.length > 0;

  const handleContinue = () => {
    if (!certs.length) {
      toast.error("Please add at least one certification to continue.");
      return;
    }

    console.log("Source value:", source); // Add this to debug

    if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/awards", { state: { source } });
    }
  };

  const steps = [
    { label: "Demographics", icon: <FeatherCheck />, completed: true },
    { label: "Education", icon: <FeatherCheck />, completed: true },
    { label: "Experience", icon: <FeatherCheck />, completed: true },
    { label: "Certifications", icon: <FeatherFileCheck />, active: true },
    { label: "Awards", icon: <FeatherAward /> },
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
                navigate("/experience");
              }
            }}
            className="text-neutral-600 hover:text-neutral-900"
          />
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1 flex-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: "66.67%", backgroundColor: colors.primary }}
              />
            </div>
            <span className="text-xs text-neutral-500 ml-2">4/6</span>
          </div>
        </div>

        {/* Main content - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-neutral-900 mb-2">
                  Add your certifications
                </h1>
                <p className="text-sm text-neutral-500 font-light">
                  Professional certifications help boost your Experience Index
                </p>
              </div>

              {/* Certifications List - Minimalist */}
              {certs.length > 0 && (
                <div className="mb-8 space-y-3">
                  {certs.map((c) => {
                    const isSelected = selectedCert?.id === c.id;

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCert(isSelected ? null : c)}
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
                              {c.issuer
                                .split(" ")
                                .slice(0, 2)
                                .map((s) => s[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral-900">
                                {c.name}
                              </h3>
                              <p className="text-sm text-neutral-500 mt-0.5">
                                {c.issuer}
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                {c.issueDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fillFormForEdit(c);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(c.id);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <FeatherX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {isSelected && c.credentialLink && (
                          <div className="mt-3 pt-3 border-t border-neutral-100">
                            <a
                              href={c.credentialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm flex items-center gap-1"
                              style={{ color: colors.primary }}
                            >
                              <FeatherLink className="w-3 h-3" />
                              View Credential
                            </a>
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
                  isEditing ? handleUpdate() : handleAdd();
                }}
                className="space-y-6"
              >
                {/* Certification Name */}
                <div className={fieldClass}>
                  <label className={labelClass}>CERTIFICATION NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setName(toTitleCase(name))}
                    onFocus={() => setFocusedField("name")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="e.g., Certified Product Manager"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "name" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Issuer */}
                <div className={fieldClass}>
                  <label className={labelClass}>ISSUER</label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    onBlur={() => setIssuer(toTitleCase(issuer))}
                    onFocus={() => setFocusedField("issuer")}
                    onBlurCapture={() => setFocusedField(null)}
                    placeholder="Issuing organization"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "issuer" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Issue Date */}
                <div className={fieldClass}>
                  <label className={labelClass}>ISSUE DATE</label>
                  <MonthYearPicker value={issueDate} onChange={setIssueDate} />
                </div>

                {/* Credential Link */}
                <div className={fieldClass}>
                  <label className={labelClass}>CREDENTIAL LINK</label>
                  <input
                    type="url"
                    value={credentialLink}
                    onChange={(e) =>
                      setCredentialLink(e.target.value.replace(/\s/g, ""))
                    }
                    onBlur={() => {
                      if (!credentialLink) return;
                      if (!credentialLink.startsWith("http")) {
                        setCredentialLink("https://" + credentialLink);
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

                {/* OR Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-xs text-neutral-400 font-light">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>

                {/* Upload Area */}
                <div className={fieldClass}>
                  <label className={labelClass}>UPLOAD CERTIFICATE</label>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleBrowseFile}
                    onKeyDown={handleUploadKeyDown}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="mt-2 p-6 rounded-xl border-2 border-dashed border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primaryGlow }}
                    >
                      <FeatherUpload
                        className="w-5 h-5"
                        style={{ color: colors.neutral[600] }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-neutral-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        PDF only, max 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* File Preview */}
                  {file && (
                    <div className="mt-3 p-3 rounded-lg border border-neutral-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: colors.primaryGlow }}
                        >
                          <FeatherFileText
                            className="w-4 h-4"
                            style={{ color: colors.neutral[600] }}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
                      >
                        <FeatherX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
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
                        ? "Update Certification"
                        : "Add Certification"}
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
              {certs.length > 0 && (
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
                          index === 3 ? `${colors.primary}08` : "transparent",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            index <= 3 ? colors.primary : colors.neutral[100],
                          color: index <= 3 ? "white" : colors.neutral[400],
                        }}
                      >
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <span
                        className="text-sm flex-1"
                        style={{
                          color:
                            index === 3
                              ? colors.primary
                              : index < 3
                                ? colors.neutral[900]
                                : colors.neutral[500],
                          fontWeight: index === 3 ? 500 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                      {index === 3 && (
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
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-[320px] bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Delete Certification?
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
