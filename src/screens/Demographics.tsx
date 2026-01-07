"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { Switch } from "../ui/components/Switch";
import { TextField } from "../ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherUser,
  FeatherGraduationCap,
  FeatherBriefcase,
  FeatherFileCheck,
  FeatherAward,
  FeatherPackage,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";

type DemographicsResponse = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  city: string;
  state: string;
  country: string;
  phoneVisibleToRecruiters?: boolean;
};

const notify = (msg: string) => {
  console.warn(msg);
};

export default function Demographics() {
  const navigate = useNavigate();

  const userId = React.useMemo(() => localStorage.getItem("userId"), []);

  const scTextFieldClass =
  "w-full [&>label]:text-[8px] [&>label]:font-small [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-8 focus:border-black";

const scInputClass =
  "w-full h-7 rounded-full px-2 text-[12px] leading-none bg-transparent focus:bg-transparent focus:outline-none focus:ring-0";


  /* -------------------- VALIDATION RULES -------------------- */
const normalizeText = (value: string): string => {
  return value
    .replace(/\s+/g, " ")        // remove extra spaces
    .trimStart()                 // avoid cursor jump at start
    .split(" ")
    .map((word) =>
      word
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : ""
    )
    .join(" ");
};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^[+]?[\d\s]{10,15}$/;
  const textRegex = /^[A-Za-z\s.'-]{2,}$/;

  /* Form Validation */
  const isFormValid = (): string | null => {
    if (!textRegex.test(form.fullName.trim())) {
      return "Please enter a valid full name.";
    }

    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (
      form.phoneNumber.trim() &&
      !phoneNumberRegex.test(form.phoneNumber.replace(/\s/g, ""))
    ) {
      return "Please enter a valid phone number (10–15 digits).";
    }

    if (!textRegex.test(form.city.trim())) {
      return "Please enter a valid city Name.";
    }

    if (!textRegex.test(form.state.trim())) {
      return "Please enter a valid state Name.";
    }

    if (!textRegex.test(form.country.trim())) {
      return "Please enter a valid country Name.";
    }

    return null;
  };

  /* -------------------- STATE -------------------- */
  const [phoneVisibleToRecruiters, setShowPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isExpIndexLoading, setIsExpIndexLoading] = useState(true);
  const [experiencePoints, setExperiencePoints] = useState<any>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
  });

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* -------------------- EXPERIENCE INDEX -------------------- */

  const displayedIndex = experiencePoints?.demographics ?? 0;

  // -------------------- GET EXPERIENCE INDEX --------------------
  const fetchExperienceIndex = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API(
        "GET",
        URL_PATH.calculateExperienceIndex,
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

  // -------------------- GET DEMOGRAPHICS --------------------
  const fetchDemographics = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API(
        "GET",
        URL_PATH.getDemographics,
        undefined,
        { "user-id": userId }
      );

      const data = res as DemographicsResponse;

      if (!data || !data.fullName) {
        console.warn("No demographics data found", res);
        return;
      }

      setForm({
        fullName: data.fullName ?? "",
        email: data.email ?? "",
        phoneNumber: data.phoneNumber ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        country: data.country ?? "",
      });

      setShowPhone(!!data.phoneVisibleToRecruiters);
    } catch {
      notify("Failed to fetch demographics");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  //USE EFFECT
  useEffect(() => {
    fetchDemographics();
    fetchExperienceIndex();
  }, [fetchDemographics, fetchExperienceIndex]);

  /* -------------------- CONTINUE -------------------- */

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    const error = isFormValid();
    if (error) {
      alert(error);
      return;
    }

    if (!userId) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const payload = {
      fullName: normalizeText(form.fullName),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim() || null,
      city: normalizeText(form.city),
      state: normalizeText(form.state),
      country: normalizeText(form.country),
      phoneVisibleToRecruiters,
    };

    try {
      setIsSubmitting(true);

      await API("POST", URL_PATH.demographics, payload, {
        "user-id": userId,
      });

      navigate("/education");
    } catch (err: any) {
      notify(err?.message || "Failed to submit demographics");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE API :
  const handleDeleteDemographics = async () => {
    if (!userId) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your demographics data?"
    );

    if (!confirmDelete) return;

    try {
      setIsSubmitting(true);

      await API("DELETE", URL_PATH.deleteDemographics, undefined, {
        "user-id": userId,
      });

      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        city: "",
        state: "",
        country: "",
      });

      setShowPhone(false);

      notify("Demographics deleted successfully.");
    } catch (err: any) {
      notify(err?.message || "Failed to delete demographics");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-white to-neutral-50 px-4 sm:px-6 py-10 sm:py-22">
<div className="w-full max-w-[1000px] mx-auto flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
        {/* LEFT CARD */}
        <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.06)]">
          <div className="flex items-center gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />

            <div className="flex-1 w-full max-w-full md:max-w-[420px]">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[5px] rounded-full bg-violet-700" />
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-[5px] rounded-full bg-neutral-300"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-[22px] text-neutral-900">
              Let's Calculate Your Experience Index
            </h2>
            <p className="text-xs text-neutral-500">
              This information helps us create rankings and connect you with
              relevant recruiters
            </p>
          </div>

          {/* FORM */}
          <div className="mt-6 flex flex-col gap-4">
            <TextField label={<span className="text-[12px]">Name * </span>} 
            className={scTextFieldClass}>
              <TextField.Input
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="John Smith"
                className={scInputClass}
              />
            </TextField>

            <TextField
              label={<span className="text-[12px]">Email * </span>}
              helpText={<span className="text-[12px]">Used for account access and recruiter outreach </span>}
              className={scTextFieldClass}
            >
              <TextField.Input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                className={scInputClass}
              />
            </TextField>

            <TextField
              label={<span className="text-[12px]">Phone Number </span>}
              helpText={<span className="text-[12px]">Optional for recruiter contact </span>}
              className={scTextFieldClass}
            >
              <TextField.Input
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={scInputClass}
              />
            </TextField>

            <div className="flex items-center gap-3">
              <Switch
                checked={phoneVisibleToRecruiters}
                onCheckedChange={(c) => setShowPhone(c)}
                tabIndex={0}
                role="switch"
                aria-checked={phoneVisibleToRecruiters}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowPhone((prev) => !prev);
                  }
                }}
                className="
    h-5 w-9
    data-[state=checked]:bg-violet-700
    data-[state=unchecked]:bg-neutral-300
    [&>span]:h-4 [&>span]:w-3
    [&>span]:data-[state=checked]:translate-x-2
    [&>span]:data-[state=unchecked]:translate-x-0
  "
              />

              <span className="text-sm text-neutral-700">
                Make phone number visible to recruiters
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={<span className="text-[12px]">City * </span>}
                className="flex-1 [&>div]:h-8 [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:focus-within:border-black-900"
              >
                <TextField.Input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="San Francisco"
                  className={scInputClass}
                />
              </TextField>

              <TextField
                label={<span className="text-[12px]">State * </span>}
                className="flex-1 [&>div]:h-8 [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:focus-within:border-black-900"
              >
                <TextField.Input
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="California"
                  className={scInputClass}
                />
              </TextField>
            </div>

            <TextField
              label={<span className="text-[12px]">Country * </span>}
              className="w-full [&>div]:h-8 [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:focus-within:border-black-900"
            >
              <TextField.Input
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="United States"
                className={scInputClass}
              />
            </TextField>
          </div>

          <div className="w-full h-px bg-neutral-200 my-5" />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleContinue}
              disabled={isSubmitting || isLoading}
              className={`
    w-full h-10 rounded-full transition-all
    ${
      isSubmitting || isLoading
        ? "bg-violet-300 text-white cursor-not-allowed"
        : "bg-violet-700 text-white shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
    }
  `}
            >
              {isLoading
                ? "Loading..."
                : isSubmitting
                ? "Submitting..."
                : "Continue"}
            </Button>

            {/* <Button
              onClick={handleDeleteDemographics}
              disabled={isSubmitting}
              className="h-9 rounded-full bg-gray-300 text-white hover:bg-gray-600 "
            >
              Delete
            </Button> */}
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.04)] border border-neutral-300">
            <h3 className="text-[20px] text-neutral-900">
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

            <div className="h-px bg-neutral-300" />

            <div className="mt-4">
              <div className="text-[16px] text-neutral-800 mb-3">
                Progress Steps
              </div>

              <button
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-100 px-4 py-2 mb-3 hover:shadow-sm"
              >
                <div className="flex items-center justify-center h-6 w-6 rounded-2xl bg-violet-200 shadow-sm">
                  <IconWithBackground size="small" icon={<FeatherUser />} />
                </div>
                <span className="text-sm text-neutral-900">Demographics</span>
              </button>

              {[
                ["Education", <FeatherGraduationCap />],
                ["Experience", <FeatherBriefcase />],
                ["Certifications", <FeatherFileCheck />],
                ["Awards", <FeatherAward />],
                ["Projects", <FeatherPackage />],
              ].map(([label, icon], i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-300 px-4 py-2 mb-3"
                >
                  <IconWithBackground
                    size="small"
                    variant="neutral"
                    icon={icon as any}
                  />
                  <span className="text-sm text-neutral-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
