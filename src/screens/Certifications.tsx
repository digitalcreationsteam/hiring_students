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
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  toast.error(msg); // replace with toast later
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
        className={`w-full h-10 px-4 rounded-full cursor-pointer border border-neutral-300
          focus:outline-none text-sm placeholder:text-xs
          ${disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"}`}
      />

      {/* PICKER */}
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-neutral-300 bg-white shadow-lg p-3">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              disabled={year <= minYear}
              onClick={() => setYear((y) => y - 1)}
              className="px-2 text-lg disabled:text-neutral-300"
            >
              «
            </button>

            <span className="text-sm font-medium">{year}</span>

            <button
              type="button"
              disabled={year >= maxYear}
              onClick={() => setYear((y) => y + 1)}
              className="px-2 text-lg disabled:text-neutral-300"
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
                  className={`py-2 rounded-lg transition
                    ${
                      value === formatted
                        ? "bg-violet-600 text-white"
                        : "hover:bg-neutral-100"
                    }
                    ${disabledMonth ? "text-neutral-400 cursor-not-allowed" : ""}
                  `}
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

      // console.log("FULL API RESPONSE:", res);

      const apiCerts = Array.isArray(res?.data) ? res.data : [];

      // console.log("CERT ARRAY:", apiCerts);

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

  // SC2-style TextField classes (single-line friendly)
  const scTextFieldClass =
    "w-full [&>label]:text-[12px] [&>label]:font-medium [&>p]:text-[11px] [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-9";
  const scInputClass =
    "rounded-full h-9 px-3 text-[15px] placeholder:text-[15px] bg-white !border-none focus:ring-0 w-full";

  const isAddable = () => {
    const trimmedIssueDate = issueDate?.trim(); // ✅ KEY FIX

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

    // ✅ Date validation (fixed)
    if (!issueDate.trim()) {
      notify("Date is required.");
      return false;
    }

    // if (!isValidPastOrCurrentDate(trimmedIssueDate)) {
    //   notify("Issue date must be in MM/YYYY format and not in the future.");
    //   return false;
    // }

    // if (!isValidPastOrCurrentDate(issueDate)) {
    //   notify("Issue date cannot be in the future.");
    //   return false;
    // }

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

    // if (!credentialLink.trim()) {
    //     notify("Certification Link is required.");
    //     return false;
    //   }

    //   if (!file) {
    //     notify("Please upload the certification PDF.");
    //     return false;
    //   }

    return true;
  };

  const isAddableSilent = () => {
    if (!name.trim()) return false;
    if (!isValidText(name)) return false;
    if (!issuer.trim()) return false;
    if (!isValidText(issuer)) return false;
    if (!isValidMonthYear(issueDate)) return false;
    if (!isValidPastOrCurrentDate(issueDate)) return false;
    if (!credentialLink.trim() && !file) return false;
    if (credentialLink.trim() && !isValidUrl(credentialLink)) return false;
    // if (!file) return false;
    return true;
  };

  const resetForm = () => {
    setName("");
    setIssuer("");
    setIssueDate("");
    setCredentialLink("");
    setFile(null);
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
      // 🔥 MUST be plural to go into req.files[]
      formData.append("certificateFiles", file);
    }

    try {
      await API("POST", URL_PATH.certification, formData, {
        "user-id": userId,
      });

      toast.success("Certification added successfully");

      // safest pattern (same as Experience)
      await fetchCertifications();
      await fetchExperienceIndex();

      resetForm();
    } catch (err: any) {
      notify(err?.response?.data?.message || "Error creating certifications");
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
    if (!canContinue) {
      notify("Please add at least one certification.");
      return;
    }

    navigate("/awards", {
      state: { source },
    });
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

  return (
  <>
        <HeaderLogo />
        <ToastContainer position="top-center" autoClose={3000} />
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-0 sm:py-0">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
        {/* Left card */}
        <main className="w-full md:max-w-[448px] flex flex-col gap-6 rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* top - back + progress */}
          <div className="flex w-full items-center justify-center gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />
            <div className="flex-1 w-full max-w-full md:max-w-[420px]">
              <div className="flex items-center gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`p-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-violet-700"
                  />
                ))}
                {[...Array(2)].map((_, i) => (
                  <div
                    key={`n-${i}`}
                    style={{ height: 6 }}
                    className="flex-1 rounded-full bg-neutral-300"
                  />
                ))}
              </div>
            </div>
          </div>

            {/* Header */}
            <header className="mt-1 w-full">
              <h2 className="text-[22px] text-neutral-900">
                Add your certifications
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Professional certifications help boost your Experience Index
              </p>
            </header>

            {/* selected cert preview list */}

            <section className="flex w-full flex-col gap-3">
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
                      {/* Left */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          size="large"
                          square
                          className="!rounded-3xl bg-violet-200 text-violet-700"
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
                          <span className="text-sm font-semibold text-neutral-900 truncate">
                            {c.name}
                          </span>
                          <span className="text-xs text-neutral-500 truncate">
                            {c.issuer}
                          </span>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <IconButton
                          size="small"
                          icon={<FeatherX />}
                          aria-label={`Delete certificate ${c.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(c.id);
                          }}
                          className="!bg-transparent !text-neutral-500 hover:!text-neutral-700"
                        />

                        <span className="text-xs text-neutral-500">
                          {c.issueDate}
                        </span>
                      </div>
                    </div>

                    {/* 🔹 DETAILS (INSIDE SAME BORDER) */}
                    {isSelected && (
                      <>
                        <div className="my-4 border-t border-neutral-200" />

                        <div className="flex flex-col gap-3 text-sm text-neutral-800 px-1">
                          <div>
                            <span className="font-medium">Name:</span> {c.name}
                          </div>

                          {c.issuer && (
                            <div>
                              <span className="font-medium">Issuer:</span>{" "}
                              {c.issuer}
                            </div>
                          )}

                          {c.issueDate && (
                            <div>
                              <span className="font-medium">Issue date:</span>{" "}
                              {c.issueDate}
                            </div>
                          )}

                          {c.credentialLink && (
                            <div>
                              <span className="font-medium">Credential:</span>{" "}
                              <a
                                href={c.credentialLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-700 underline"
                                onClick={(e) => e.stopPropagation()}
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

            {/* form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd();
              }}
              className="flex w-full flex-col gap-4"
            >
              <TextField
                label={
                  <span className="text-[12px]">
                    Certification Name <span className="text-red-500">*</span>
                  </span>
                }
                helpText=""
                className={scTextFieldClass}
              >
                <TextField.Input
                  placeholder="e.g., Certified Product Manager"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                  }
                  onBlur={() => setName(toTitleCase(name))}
                  className={scInputClass}
                />
              </TextField>

              <TextField
                label={
                  <span className="text-[12px]">
                    Issuer <span className="text-red-500">*</span>{" "}
                  </span>
                }
                className={scTextFieldClass}
              >
                <TextField.Input
                  placeholder="Issuing organization"
                  value={issuer}
                  onChange={(e) =>
                    setIssuer(e.target.value.replace(/[^A-Za-z\s.&-]/g, ""))
                  }
                  onBlur={() => setIssuer(toTitleCase(issuer))}
                  className={scInputClass}
                />
              </TextField>
              {/* ------------Date------------------ */}

              {/* // date------------------------- */}
              <div className="flex flex-col gap-6 max-w-lg">
                {/* Issue Month & Year */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="issueDate"
                    className="text-[12px] font-medium text-neutral-700"
                  >
                    Issue Month & Year <span className="text-red-500">*</span>
                  </label>

                  <MonthYearPicker value={issueDate} onChange={setIssueDate} />
                </div>
              </div>

              {/* ---------------End Date-------------- */}

              <TextField
                label={<span className="text-[12px]">Credential Link </span>}
                helpText=""
                className={scTextFieldClass}
              >
                <TextField.Input
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
                  className={scInputClass}
                />
              </TextField>

              {/* ✅ OR Divider (ADD THIS) */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-neutral-300" />
                <span className="text-[11px] text-neutral-500 font-medium tracking-wide">
                  OR
                </span>
                <div className="flex-1 h-px bg-neutral-300" />
              </div>

              {/* Upload */}
              <div className="w-full">
                <div className="text-[12px] text-neutral-800 mb-2">
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
                  className="w-full rounded-2xl border-2 border-dashed border-neutral-300 bg-gray-50 px-6 py-4 flex flex-col items-center justify-center cursor-pointer"
                >
                  <IconWithBackground
                    size="large"
                    icon={
                      <FeatherUpload className="w-5 h-5 text-neutral-600" />
                    }
                    className="!bg-neutral-200 !rounded-full !p-3 shadow-s"
                  />

                  <div className="mt-3 text-xm text-neutral-600 text-center">
                    Click to select file or drag to upload
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 text-center">
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

                {/* file preview */}
                {file && (
                  <div className="mt-4 rounded-2xl border border-neutral-300 bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
                    <div className="flex items-center gap-3">
                      <IconWithBackground
                        size="medium"
                        icon={
                          <FeatherFileText className="w-4 h-4 text-red-800" />
                        }
                        className="!bg-red-100 !rounded-full !p-3"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-900">
                          {file.name}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                    <IconButton
                      size="small"
                      icon={<FeatherX />}
                      onClick={removeFile}
                      className="!bg-transparent !text-neutral-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
                <Button
                  type="button"
                  variant="neutral-secondary"
                  icon={<FeatherPlus />}
                  className="w-full rounded-full border-neutral-300 h-10 px-4 flex items-center gap-2"
                  onClick={handleAdd}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add another certification"}
                </Button>

                <div className="flex-1" />
              </div>
            </form>

            {/* divider */}
            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

            <footer>
              <Button
                onClick={handleContinue}
                disabled={!canContinue || isSubmitting}
                className={`w-full h-10 rounded-full ${
                  !canContinue || isSubmitting
                    ? "bg-violet-300 cursor-not-allowed"
                    : "bg-violet-700 shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
                }`}
              >
                {isSubmitting ? "Saving..." : "Continue"}
              </Button>
            </footer>
          </main>

          {/* Right panel */}
          <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
            <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
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

                {/* ⚪ Completed — Demographics */}
                <button
                  type="button"
                  className="w-full flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3 hover:bg-neutral-50"
                >
                  <IconWithBackground
                    size="small"
                    icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                    className="!bg-green-100 !rounded-full !p-3"
                  />
                  <span className="text-sm text-neutral-700">Demographics</span>
                </button>

                {/* ⚪ Completed — Education */}
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

                {/* Certifications — active (purple) */}
                <div className="flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-white shadow-sm">
                    <IconWithBackground
                      size="small"
                      variant="neutral"
                      className="!bg-white !text-violet-600"
                      icon={<FeatherFileCheck className="!text-violet-800" />}
                    />
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    Certifications
                  </span>
                </div>

                {/* Awards — Inactive */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2 mb-3">
                  <IconWithBackground
                    size="small"
                    variant="neutral"
                    className="!bg-grey !text-neutral-600"
                    icon={<FeatherAward />}
                  />
                  <span className="text-sm text-neutral-500">Awards</span>
                </div>

                {/* Projects — Inactive */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-2">
                  <IconWithBackground
                    size="small"
                    variant="neutral"
                    className="!bg-grey !text-neutral-600"
                    icon={<FeatherPackage />}
                  />
                  <span className="text-sm text-neutral-500">Projects</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Are you sure?
                </h3>
                <button
                  onClick={() => setDeleteId(null)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-neutral-600 mb-6">
                Do you really want to delete this certification?{" "}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="neutral-secondary"
                  className="flex-1"
                  onClick={() => setDeleteId(null)}
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
