// src/components/Certifications.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";

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
  if (!DATE_REGEX.test(value)) return false;

  const [mm, yyyy] = value.split("/").map(Number);
  const inputDate = new Date(yyyy, mm - 1);
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth());

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
  alert(msg); // replace with toast later
};

export default function Certifications() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");

  // form state
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialLink, setCredentialLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [experiencePoints, setExperiencePoints] = useState<any>(null);

  const displayedIndex =
    (experiencePoints?.demographics ?? 0) +
    (experiencePoints?.education ?? 0) +
    (experiencePoints?.workExperience ?? 0) +
    (experiencePoints?.certifications ?? 0);

  //GET
  const fetchCertifications = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await API(
        "GET",
        URL_PATH.getCertification,
        undefined,
        undefined,
        { "user-id": userId }
      );

      const apiCerts = res?.data || [];

      setCerts(
        apiCerts.map((c: any) => ({
          id: c._id,
          name: c.certificationName,
          issuer: c.issuer,
          issueDate: c.issueDate,
          credentialLink: c.credentialLink,
          file: undefined, // files not reloaded
        }))
      );
    } catch {
      console.error("Failed to fetch certifications");
    }
  };

  const fetchExperienceIndex = async () => {
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
    }
  };

  useEffect(() => {
    fetchCertifications();
    fetchExperienceIndex();
  }, []);

  // stored certs
  const [certs, setCerts] = useState<CertEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // SC2-style TextField classes (single-line friendly)
  const scTextFieldClass =
    "w-full [&>label]:text-[12px] [&>label]:font-medium [&>p]:text-[11px] [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-9";
  const scInputClass =
    "rounded-full h-9 px-3 text-[15px] placeholder:text-[15px] bg-white !border-none focus:ring-0 w-full";

  const isAddable = () => {
    if (!name.trim()) {
      alert("Certification name is required.");
      return false;
    }

    if (!isValidText(name)) {
      alert("Certification name contains invalid characters.");
      return false;
    }

    if (!issuer.trim()) {
      alert("Issuer is required.");
      return false;
    }

    if (!isValidText(issuer)) {
      alert("Issuer name contains invalid characters.");
      return false;
    }

    if (!isValidMonthYear(issueDate)) {
      alert("Issue date must be in MM/YYYY format.");
      return false;
    }

    if (!isValidPastOrCurrentDate(issueDate)) {
      alert("Issue date cannot be in the future.");
      return false;
    }

    if (credentialLink.trim() && !isValidUrl(credentialLink)) {
      alert("Credential link must be a valid URL (https://...)");
      return false;
    }

    if (!file) {
      alert("Please upload the certification PDF.");
      return false;
    }

    return true;
  };

  const isAddableSilent = () => {
    if (!name.trim()) return false;
    if (!isValidText(name)) return false;
    if (!issuer.trim()) return false;
    if (!isValidText(issuer)) return false;
    if (!isValidMonthYear(issueDate)) return false;
    if (!isValidPastOrCurrentDate(issueDate)) return false;
    if (credentialLink.trim() && !isValidUrl(credentialLink)) return false;
    if (!file) return false;
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
    if (isSubmitting) return;
    if (!isAddable()) return;

    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
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
      await API("POST", URL_PATH.certification, formData, undefined, {
        "user-id": userId,
      });

      // safest pattern (same as Experience)
      await fetchCertifications();
      await fetchExperienceIndex();

      resetForm();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error creating certifications");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- DELETE CERTIFICATION --------------------
  const handleRemove = async (id: string) => {
    if (!userId) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    // demo item → local delete only
    if (id === "example-1") {
      setCerts((prev) => prev.filter((c) => c.id !== id));
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this certification?"
    );
    if (!confirmDelete) return;

    try {
      setIsSubmitting(true);

      await API(
        "DELETE",
        `${URL_PATH.deleteCertification}/${id}`,
        undefined,
        undefined,
        { "user-id": userId }
      );

      setCerts((prev) => prev.filter((c) => c.id !== id));

      await fetchExperienceIndex();
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
      alert("Only PDF files are allowed.");
      return;
    }
    if (uploaded.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }
    setFile(uploaded);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const uploaded = e.dataTransfer.files[0];
    if (uploaded.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    if (uploaded.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
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
      alert("Please add at least one certification.");
      return;
    }

    navigate("/awards");
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
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-20 sm:py-32">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Left card */}
        <main className="w-full md:max-w-[448px] flex flex-col gap-6 rounded-3xl border px-4 sm:px-6 md:px-8 py-6 sm:py-8">
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
                    className="flex-1 rounded-full bg-neutral-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Header */}
          <header className="mt-1 w-full">
            <h2 className="text-[20px] font-semibold text-neutral-900">
              Add your certifications
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Professional certifications help boost your Experience Index
            </p>
          </header>

          {/* selected cert preview list */}
          <section className="flex w-full flex-col gap-3">
            {certs.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-neutral-300 bg-gray-50 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    size="large"
                    image="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop"
                    square
                  >
                    {c.issuer
                      ? c.issuer
                          .split(" ")
                          .slice(0, 2)
                          .map((s) => s[0])
                          .join("")
                      : "C"}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-900 leading-tight">
                      {c.name}
                    </span>
                    <span className="text-xs text-neutral-500">{c.issuer}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <IconButton
                    size="small"
                    icon={<FeatherX />}
                    onClick={() => handleRemove(c.id)}
                    className="!bg-transparent !text-neutral-500"
                  />
                  <span className="text-xs text-neutral-500">
                    {c.issueDate}
                  </span>
                </div>
              </div>
            ))}
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
              label="Certification Name *"
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

            <TextField label="Issuer *" className={scTextFieldClass}>
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

            <TextField
              label="Issue Date *"
              helpText=""
              className={scTextFieldClass}
            >
              <TextField.Input
                placeholder="MM/YYYY"
                value={issueDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^\d]/g, "");

                  if (value.length >= 2) {
                    const month = value.slice(0, 2);
                    const year = value.slice(2, 6);
                    value = month + (year ? "/" + year : "");
                  }

                  setIssueDate(value.slice(0, 7));
                }}
                onBlur={() => {
                  if (!issueDate) return;

                  if (!isValidMonthYear(issueDate)) {
                    alert("Invalid date format. Use MM/YYYY");
                    setIssueDate("");
                    return;
                  }

                  if (!isValidPastOrCurrentDate(issueDate)) {
                    alert("Issue date cannot be in the future.");
                    setIssueDate("");
                  }
                }}
                className={scInputClass}
              />
            </TextField>

            <TextField
              label="Credential Link"
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

            {/* Upload */}
            <div className="w-full">
              <div className="text-sm font-medium text-neutral-800 mb-2">
                Upload Certificate (PDF)
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
                  icon={<FeatherUpload className="w-5 h-5 text-neutral-600" />}
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
                <div className="mt-4 rounded-2xl border border-neutral-200 bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
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
                className="w-full rounded-full h-10 px-4 flex items-center gap-2"
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
          <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-200">
            <h3 className="text-xl font-semibold text-neutral-900">
              Your Experience Index
            </h3>

            <div className="flex items-center justify-center py-6">
              <span
                aria-live="polite"
                className="font-['Afacad_Flux'] text-[32px] sm:text-[40px] md:text-[48px] ..."
              >
                {displayedIndex ?? 0}
              </span>
            </div>

            {/* Top form horizontal line */}
            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

            <div className="mt-4">
              <div className="text-sm font-semibold text-neutral-800 mb-3">
                Progress Steps
              </div>

              {/* ⚪ Completed — Demographics */}
              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2 mb-3 hover:bg-neutral-50"
              >
                <IconWithBackground
                  size="small"
                  icon={<FeatherCheck className="w-4 h-4 text-green-900" />}
                  className="!bg-green-100 !rounded-full !p-3"
                />
                <span className="text-sm text-neutral-700">Demographics</span>
              </button>

              {/* ⚪ Completed — Education */}
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
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2 mb-3">
                <IconWithBackground
                  size="small"
                  variant="neutral"
                  className="!bg-grey !text-neutral-600"
                  icon={<FeatherAward />}
                />
                <span className="text-sm text-neutral-500">Awards</span>
              </div>

              {/* Projects — Inactive */}
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2">
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
    </div>
  );
}
