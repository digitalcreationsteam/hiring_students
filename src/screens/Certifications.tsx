// src/components/Certifications.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import HeaderLogo from "../ui/components/HeaderLogo";
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
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

type CertEntry = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string; // MM/YYYY
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

const notify = (msg: string) => {
  toast.error(msg);
};

// -----------------Month And Year Picker----------

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

type MonthYearPickerProps = {
  value: string; // "MM/YYYY"
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

  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
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
      {/* INPUT */}
      <input
        readOnly
        disabled={disabled}
        value={value || ""}
        placeholder="MM / YYYY"
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full h-10 px-4 rounded-xl border ${
          disabled 
            ? "bg-white/30 border-white/20 text-gray-400 cursor-not-allowed" 
            : "bg-white/50 border-gray-200/50 hover:border-gray-300 cursor-pointer"
        } focus:outline-none transition-all duration-200 backdrop-blur-sm text-sm placeholder:text-xs`}
      />

      {/* PICKER */}
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl p-3">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              disabled={year <= minYear}
              onClick={() => setYear((y) => y - 1)}
              className="px-2 text-lg disabled:text-neutral-300 text-gray-600 hover:text-gray-900 transition"
            >
              «
            </button>

            <span className="text-sm font-medium text-gray-700">{year}</span>

            <button
              type="button"
              disabled={year >= maxYear}
              onClick={() => setYear((y) => y + 1)}
              className="px-2 text-lg disabled:text-neutral-300 text-gray-600 hover:text-gray-900 transition"
            >
              »
            </button>
          </div>

          {/* MONTH GRID */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            {MONTHS.map((month, index) => {
              const disabledMonth = isFutureMonth(index);
              const formatted = `${String(index + 1).padStart(2, "0")}/${year}`;

              return (
                <button
                  key={month}
                  type="button"
                  disabled={disabledMonth}
                  onClick={() => {
                    onChange(formatted);
                    setOpen(false);
                  }}
                  className="py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                  style={{
                    backgroundColor:
                      value === formatted ? colors.primary : "transparent",
                    color:
                      value === formatted
                        ? colors.white
                        : disabledMonth
                          ? colors.neutral[400]
                          : colors.neutral[800],
                    cursor: disabledMonth ? "not-allowed" : "pointer",
                    opacity: disabledMonth ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!disabledMonth && value !== formatted) {
                      e.currentTarget.style.backgroundColor = colors.primaryGlow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!disabledMonth && value !== formatted) {
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

  console.log("CERTIFICATIONS source:", source);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");

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

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) +
    (experiencePoints?.education ?? 0) +
    (experiencePoints?.workExperience ?? 0) +
    (experiencePoints?.certifications ?? 0);

  //GET
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

  // stored certs
  const [certs, setCerts] = useState<CertEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAddable = () => {
    const trimmedIssueDate = issueDate?.trim();

    if (!name.trim()) {
      notify("Certification name is required.");
      return false;
    }

    if (!isValidText(name)) {
      notify("Certification name contains invalid characters.");
      return false;
    }

    if (!issuer.trim()) {
      notify("Issuer is required.");
      return false;
    }

    if (!isValidText(issuer)) {
      notify("Issuer name contains invalid characters.");
      return false;
    }

    if (!issueDate.trim()) {
      notify("Date is required.");
      return false;
    }

    if (!isValidPastOrCurrentDate(issueDate.trim())) {
      notify("Issue date must be in MM/YYYY format and not in the future.");
      return false;
    }

    if (credentialLink.trim() && !isValidUrl(credentialLink)) {
      toast.error("Credential link must be a valid URL (https://...)");
      return false;
    }

    if (!credentialLink.trim() && !file) {
      notify(" Provide either a credential link or upload the certificate PDF");
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

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAdd = async () => {
    if (certs.length >= MAX_CERTS) {
      notify("You can add a maximum of 5 certifications only.");
      return;
    }
    if (isSubmitting) return;
    if (!isAddable()) return;

    if (!userId) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    const isDuplicate = certs.some(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase().trim() &&
        c.issuer.toLowerCase() === issuer.toLowerCase().trim(),
    );

    if (isDuplicate) {
      notify("This certification already exists.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("certificationName[0]", toTitleCase(normalizeSpaces(name)));
    formData.append("issuer[0]", toTitleCase(normalizeSpaces(issuer)));

    const [mm, yyyy] = issueDate.split("/");
    formData.append("issueDate[0]", `${yyyy}-${mm}-01`);

    if (credentialLink) {
      formData.append("credentialLink[0]", credentialLink.trim());
    }

    if (file) {
      formData.append("certificateFiles", file);
    }

    try {
      await API("POST", URL_PATH.certification, formData, {
        "user-id": userId,
      });

      toast.success("Certification added successfully");

      await fetchCertifications();
      await fetchExperienceIndex();

      resetForm();
    } catch (err: any) {
      notify(err?.response?.data?.message || "Error creating certifications");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- EDIT CERTIFICATION --------------------
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
      await API(
        "PUT",
        `${URL_PATH.certification}/${editingId}`,
        formData,
        { "user-id": userId },
      );

      toast.success("Certification updated successfully");

      await fetchCertifications();
      await fetchExperienceIndex();
      resetForm();
    } catch (err: any) {
      notify(err?.response?.data?.message || "Failed to update certification");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- DELETE CERTIFICATION --------------------
  const handleRemove = async () => {
    if (!deleteId) return;

    if (!userId) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

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
      notify(err?.response?.data?.message || "Failed to delete certification");
    } finally {
      setIsSubmitting(false);
    }
  };

  // File handling (.pdf only, <= 5MB)
  const handleBrowseFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploaded = e.target.files[0];
    if (uploaded.type !== "application/pdf") {
      notify("Only PDF files are allowed.");
      return;
    }
    if (uploaded.size > 5 * 1024 * 1024) {
      notify("File size must be less than 5MB.");
      return;
    }
    setFile(uploaded);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const uploaded = e.dataTransfer.files[0];
    if (uploaded.type !== "application/pdf") {
      notify("Only PDF files are allowed.");
      return;
    }
    if (uploaded.size > 5 * 1024 * 1024) {
      notify("File size must be less than 5MB.");
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

  const canContinue = certs.length > 0;

  const handleContinue = () => {
    if (!certs.length) {
      toast.error("Please add at least one certification to continue.");
      return;
    }

    if (source === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/awards", { state: { source } });
    }
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

    if (fileInputRef.current) fileInputRef.current.value = "";

    setSelectedCert(c);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🎨 Enhanced gradient background with soft blur - matching education */}
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

      {/* Header and content with z-index to stay above background */}
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
                  onClick={() => {
                    navigate("/experience");
                  }}
                  className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i <= 3 
                            ? "bg-gradient-to-r from-gray-600 to-gray-800" 
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Step 4 of 6</p>
                </div>
              </div>

              {/* Header with refined typography */}
              <header className="mb-8">
                <h2 className="text-2xl text-gray-800 font-light tracking-tight">
                  Add your 
                  <span className="block font-semibold text-gray-900 mt-1">Certifications</span>
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  Professional certifications help boost your Experience Index
                </p>
              </header>

              {/* Certifications List with enhanced styling */}
              <section className="flex w-full flex-col gap-3 mb-8">
                {certs.map((c) => {
                  const isSelected = selectedCert?.id === c.id;

                  return (
                    <div
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCert(isSelected ? null : c)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedCert(isSelected ? null : c);
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
                        {/* Left */}
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
                            {c.issuer
                              ? c.issuer
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((s) => s[0])
                                  .join("")
                              : "C"}
                          </Avatar>

                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-800 truncate">
                              {c.name}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {c.issuer}
                            </span>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-2">
                            {/* ✅ Edit */}
                            <IconButton
                              size="small"
                              icon={<FeatherEdit2 className="w-3 h-3" />}
                              aria-label={`Edit certificate ${c.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                fillFormForEdit(c);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />

                            {/* ✅ Delete */}
                            <IconButton
                              size="small"
                              icon={<FeatherX className="w-3 h-3" />}
                              aria-label={`Delete certificate ${c.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(c.id);
                              }}
                              className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                            />
                          </div>

                          <span className="text-xs text-gray-500">
                            {c.issueDate}
                          </span>
                        </div>
                      </div>

                      {/* 🔹 DETAILS (INSIDE SAME BORDER) */}
                      {isSelected && (
                        <>
                          <div className="my-4 border-t border-white/30" />

                          <div className="flex flex-col gap-2 text-sm text-gray-700 px-1">
                            <div>
                              <span className="font-medium text-gray-600">Name:</span>{" "}
                              {c.name}
                            </div>

                            {c.issuer && (
                              <div>
                                <span className="font-medium text-gray-600">Issuer:</span>{" "}
                                {c.issuer}
                              </div>
                            )}

                            {c.issueDate && (
                              <div>
                                <span className="font-medium text-gray-600">Issue date:</span>{" "}
                                {c.issueDate}
                              </div>
                            )}

                            {c.credentialLink && (
                              <div>
                                <span className="font-medium text-gray-600">Credential:</span>{" "}
                                <a
                                  href={c.credentialLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="underline transition hover:text-gray-900"
                                  style={{ color: colors.accent }}
                                >
                                  View
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
                  handleAdd();
                }}
                className="flex w-full flex-col gap-5"
              >
                {/* Certification Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certification Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="e.g., Certified Product Manager"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                    }
                    onBlur={() => setName(toTitleCase(name))}
                  />
                </div>

                {/* Issuer */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issuer <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="Issuing organization"
                    value={issuer}
                    onChange={(e) =>
                      setIssuer(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                    }
                    onBlur={() => setIssuer(toTitleCase(issuer))}
                  />
                </div>

                {/* Issue Month & Year */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Month & Year <span className="text-red-500">*</span>
                  </label>
                  <MonthYearPicker
                    value={issueDate}
                    onChange={setIssueDate}
                  />
                </div>

                {/* Credential Link */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credential Link
                  </label>
                  <input
                    className="w-full h-10 px-4 rounded-xl border bg-white/50 backdrop-blur-sm text-sm transition-all duration-200 border-white/40 hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                    placeholder="https://"
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
                  />
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  <span className="text-xs text-gray-400 font-medium tracking-wide">OR</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </div>

                {/* Upload Section with enhanced styling */}
                <div className="w-full">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Upload Certificate
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload certificate PDF. Click or press Enter to browse files. Drag and drop is supported. Press Escape to remove the selected file."
                    onClick={handleBrowseFile}
                    onKeyDown={handleUploadKeyDown}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-full rounded-xl border-2 border-dashed border-white/40 bg-white/30 backdrop-blur-sm px-6 py-5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/50 mb-3">
                      <FeatherUpload className="w-5 h-5 text-gray-600" />
                    </div>

                    <div className="text-sm text-gray-600 text-center">
                      Click to select file or drag to upload
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-center">
                      PDF format only, max file size 5MB
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* file preview with enhanced styling */}
                  {file && (
                    <div className="mt-4 rounded-xl border border-white/30 bg-white/30 backdrop-blur-sm px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                          <FeatherFileText className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </div>
                      </div>
                      <IconButton
                        size="small"
                        icon={<FeatherX className="w-3 h-3" />}
                        onClick={removeFile}
                        className="!bg-transparent !text-gray-500 hover:!text-gray-700 transition"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    variant="neutral-secondary"
                    icon={<FeatherPlus className="w-4 h-4" />}
                    className="w-full rounded-xl h-10 px-4 bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                    onClick={() => (isEditing ? handleUpdate() : handleAdd())}
                  >
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update certification"
                        : "Add another certification"}
                  </Button>

                  {/* ✅ Cancel Edit */}
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
                    background: !canContinue || isSubmitting
                      ? "linear-gradient(135deg, #e0e0e0, #f0f0f0)"
                      : "linear-gradient(135deg, #2c3e50, #1e2a36)",
                    color: "#ffffff",
                    cursor: !canContinue || isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: !canContinue || isSubmitting
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
                <h4 className="text-sm font-medium text-gray-600 mb-4">Progress steps</h4>
                
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

                  {/* Active - Certifications */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, rgba(44,62,80,0.1), rgba(30,42,54,0.05))",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/80 shadow-sm">
                      <FeatherFileCheck className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      Certifications
                    </span>
                    <span className="text-xs text-gray-400">4/6</span>
                  </div>

                  {/* Inactive steps */}
                  {[
                    { label: "Awards", icon: <FeatherAward /> },
                    { label: "Projects", icon: <FeatherPackage /> },
                  ].map((step, index) => (
                    <button
                      key={step.label}
                      type="button"
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/60">
                        <div className="text-gray-500">
                          {step.icon}
                        </div>
                      </div>
                      <span className="flex-1 text-sm text-gray-500">
                        {step.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {index + 5}/6
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-[360px] rounded-2xl p-6 shadow-xl bg-white/80 backdrop-blur-xl border border-white/40"
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.accent }}
              >
                Are you sure?
              </h3>

              <button
                onClick={() => setDeleteId(null)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <p className="text-sm mb-6 text-gray-600">
              Do you really want to delete this certification?
            </p>

            <div className="flex gap-3">
              {/* Cancel */}
              <Button
                className="flex-1 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 transition-all duration-200"
                onClick={() => setDeleteId(null)}
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