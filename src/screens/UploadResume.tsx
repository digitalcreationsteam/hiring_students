// src/components/UploadResume.tsx
"use client";

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";

import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import {
  FeatherArrowLeft,
  FeatherFileText,
  FeatherUpload,
  FeatherX,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fetchStatusWithRetry = async (
  token: string,
  retries = 5,
  delay = 150
) => {
  for (let i = 0; i < retries; i++) {
    const res = await API("GET", URL_PATH.getUserStatus, undefined, {
      Authorization: `Bearer ${token}`,
    });

    const navigation = res?.navigation || res?.data?.navigation;

    // ✅ wait until resume is reflected in DB
    if (navigation?.completedSteps?.includes("resume")) {
      return navigation;
    }

    // ⏳ wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("User status not updated yet");
};


function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  // Trigger hidden file input
  const handleBrowseFile = () => fileInputRef.current?.click();

  //Back
  const navigate = useNavigate();

  // On file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploaded = e.target.files[0];

    // Validate file type
    if (
      uploaded.type !== "application/pdf" &&
      !uploaded.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF file is allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file size (5MB)
    if (uploaded.size > MAX_FILE_SIZE) {
      toast.error("File size must be 5MB or less.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(uploaded);
    // clear the input value so selecting the same file again will trigger onChange
    if (e.currentTarget) e.currentTarget.value = "";
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const uploaded = e.dataTransfer.files[0];

    
    if (
      uploaded.type !== "application/pdf" &&
      !uploaded.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF file is allowed.");
      return;
    }

    if (uploaded.size > MAX_FILE_SIZE) {
      toast.error("File size must be 5MB or less.");
      return;
    }

    setFile(uploaded);
    // also clear hidden input so future selection of same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    // clear the hidden input so user can reselect the same file
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Keyboard handler for drop zone:
  // Enter / Space -> open file picker
  // Escape -> remove file (if any)
  const handleDropZoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBrowseFile();
    } else if (e.key === "Escape") {
      if (file) {
        e.preventDefault();
        removeFile();
      }
    }
  };

  

 
  const dispatch = useAppDispatch();

  // const uploadResume = async () => {
  //   if (!file || uploading) return;

  //   try {
  //     setUploading(true);

  //     const userId = localStorage.getItem("userId");
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Session expired. Please login again.");
  //       setUploading(false);
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("resume", file);

  //     // 1️⃣ Upload resume
  //     await API("POST", URL_PATH.uploadResume, formData, {
  //       "user-id": userId,
  //       Authorization: `Bearer ${token}`,
  //     });
  //     toast.success("Resume uploaded successfully");


  //     // 2️⃣ Ask backend where to go next
  //     const statusRes = await API("GET", URL_PATH.getUserStatus, undefined, {
  //       Authorization: `Bearer ${token}`,
  //     });

  //     const navigation = statusRes?.navigation || statusRes?.data?.navigation;

  //     if (navigation?.nextRoute) {
  //        setTimeout(() => {
  //   dispatch(setNavigation(navigation));
  //   navigate(navigation.nextRoute);
  // }, 2000);
  //     } else {
  //       console.error("Navigation missing", statusRes);
  //     }
  //   } catch (error: any) {
  //     console.error("UPLOAD ERROR:", error);
  //     toast.error(error?.response?.data?.message || "Resume upload failed");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
const uploadResume = async () => {
  if (!file || uploading) return;

  try {
    setUploading(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    // 1️⃣ upload resume
    await API("POST", URL_PATH.uploadResume, formData, {
      "user-id": userId,
      Authorization: `Bearer ${token}`,
    });

    toast.success("Resume uploaded successfully");

    // 2️⃣ WAIT until Mongo shows resume=true
    const navigation = await fetchStatusWithRetry(token);

    setTimeout(() => {
      dispatch(setNavigation(navigation));
      navigate(navigation.nextRoute);
    }, 2000);
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setUploading(false);
  }
};

  return (
    <>
    <ToastContainer position="top-center" autoClose={2000} />

    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-50 px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-[576px] flex flex-col items-start gap-6 rounded-3xl border border-gray-400 bg-white px-4 sm:px-6 md:px-8 py-6 sm:py-8 shadow-[0_12px_30px_rgba(15,15,15,0.06)]">
        {/* Back + Progress Bar */}
        <div className="flex w-full items-center gap-3 sm:gap-4">
          <IconButton
            size="small"
            icon={<FeatherArrowLeft />}
            onClick={() =>
              window.history.length > 1 ? navigate(-1) : navigate("/")
            }
            className="!bg-transparent !text-neutral-600"
            aria-label="Back"
          />
        </div>

        {/* Title */}
        <div className="flex w-full flex-col items-start gap-2">
          <span className="text-base sm:text-lg font-medium text-neutral-900">
            Upload your Resume
          </span>
          <span className="text-xs sm:text-sm text-neutral-500">
            Upload your most recent resume (PDF only)
          </span>
        </div>

        {/* Resume Upload Section */}
        <div className="flex w-full flex-col items-start gap-4">
          <span className="text-sm font-semibold text-neutral-900">
            Resume / CV
          </span>

          {/* Upload Drop Zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload resume. Click or press Enter to browse files. Or drag and drop a file here. Press Escape to remove the selected file."
            className="w-full flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 sm:px-6 py-4 sm:py-6 cursor-pointer"
            onClick={handleBrowseFile}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onKeyDown={handleDropZoneKeyDown}
          >
            <IconWithBackground
              variant="neutral"
              size="large"
              icon={<FeatherUpload className="w-5 h-5" />}
              className="!p-3 !bg-neutral-100"
            />

            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-sm text-neutral-1000 text-center">
                Click to select file or drag to upload
              </span>
              <span className="text-xs text-neutral-500 text-center">
                PDF (max 5MB)
              </span>
            </div>

            {/* hidden input */}
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Uploaded File Preview */}
          {file && (
            <div className="w-full flex items-center gap-3 sm:gap-4 rounded-2xl border border-neutral-border bg-neutral-50 px-3 sm:px-4 py-3">
              <IconWithBackground
                variant="neutral"
                size="medium"
                icon={<FeatherFileText className="w-4 h-4 text-neutral-700" />}
                className="!p-2 !bg-neutral-100"
              />

              <div className="flex grow flex-col">
                <span className="text-sm text-neutral-900 truncate">
                  {file.name}
                </span>

                <span className="text-xs text-neutral-500">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
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

        {/* Continue Button */}
        <div className="flex w-full justify-center sm:justify-end border-t border-neutral-border pt-4">
          <Button
            className={`h-10 w-full sm:max-w-[520px] rounded-full bg-violet-600 font-semibold shadow-md ${
              uploading ? "pointer-events-none opacity-70" : ""
            }`}
            onClick={uploadResume}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  </>
  );
}

export default UploadResume;
