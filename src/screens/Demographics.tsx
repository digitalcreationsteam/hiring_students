// components/Demographics.tsx
// components/Demographics.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/components/Button";
import HeaderLogo from "../ui/components/HeaderLogo";
import { IconButton } from "../ui/components/IconButton";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { Switch } from "../ui/components/Switch";
import { TextField } from "../ui/components/TextField";
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";
import {
  FeatherArrowLeft,
  FeatherUser,
  FeatherGraduationCap,
  FeatherBriefcase,
  FeatherFileCheck,
  FeatherAward,
  FeatherPackage,
  FeatherChevronRight,
  FeatherMapPin,
  FeatherMail,
  FeatherPhone,
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Country, State, City } from "country-state-city";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

interface DemographicsData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  city: string;
  state: string;
  country: string;
  phoneVisibleToRecruiters?: boolean;
}

interface ApiError {
  message?: string;
  success?: boolean;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

interface StepItem {
  label: string;
  icon: React.ReactNode;
  completed?: boolean;
}

export default function Demographics() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isManualCity, setIsManualCity] = useState<boolean>(false);
  const OTHER_CITY_VALUE = "__OTHER__";

  /* ============================================
     REDUX STATE
  ============================================ */
  const currentStep = useAppSelector(
    (state) => state.onboarding.navigation.currentStep,
  );
  const nextRoute = useAppSelector(
    (state) => state.onboarding.navigation.nextRoute,
  );

  /* ============================================
     LOCAL STATE
  ============================================ */
  const [phoneVisible, setPhoneVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [experienceIndex, setExperienceIndex] = useState<number | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [form, setForm] = useState<DemographicsData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
  });

  /* ============================================
     LOCATION DROPDOWN STATE
  ============================================ */
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  // Static country, state, city list (no API call)
  const countries = Country.getAllCountries();

  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  useEffect(() => {
    if (selectedState && cities.length === 0) {
      setIsManualCity(true);
    }
  }, [selectedState, cities.length]);

  /* ============================================
     VALIDATION HELPERS
  ============================================ */
  const normalizeText = (value: string): string => {
    return value
      .replace(/\s+/g, " ")
      .trimStart()
      .split(" ")
      .map((word: string) =>
        word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "",
      )
      .join(" ");
  };

  const validateForm = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s]{10,15}$/;
    const textRegex = /^[A-Za-z\s.'-]{2,}$/;

    if (!textRegex.test(form.fullName.trim())) {
      return "Please enter a valid full name.";
    }

    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    const phoneValue = form.phoneNumber ? form.phoneNumber.trim() : "";

    if (!phoneValue) {
      return "Please enter your mobile number.";
    }
    if (!phoneRegex.test(phoneValue)) {
      return "Please enter a valid phone number.";
    }

    if (!form.country) {
      return "Please select a country.";
    }

    if (!form.state) {
      return "Please select a state.";
    }

    if (!form.city) {
      return "Please select a city.";
    }

    return null;
  };

  // ✅ Controls when Continue button becomes enabled
  const canContinue =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    (form.phoneNumber?.trim() || "") !== "" &&
    form.country.trim() !== "" &&
    form.state.trim() !== "" &&
    form.city.trim() !== "";

  /* ============================================
     FORM HANDLERS
  ============================================ */
  const handleInputChange = (
    key: keyof DemographicsData,
    value: string,
  ): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinue = async (): Promise<void> => {
    console.log("\n========== 📝 SUBMITTING DEMOGRAPHICS ==========");

    // Validate
    const validationError = validateForm();
    if (validationError) {
      console.log("❌ Validation error:", validationError);
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Get userId from localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    console.log("👤 User ID from localStorage:", userId);
    console.log(
      "🔑 Token from localStorage:",
      token ? `${token.substring(0, 20)}...` : "MISSING",
    );

    if (!userId) {
      console.error("❌ No user ID found");
      toast.error("User session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!token) {
      console.error("❌ No token found");
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const payload = {
      fullName: normalizeText(form.fullName),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber ? form.phoneNumber.trim() : null,
      city: normalizeText(form.city),
      state: normalizeText(form.state),
      country: normalizeText(form.country),
      phoneVisibleToRecruiters: phoneVisible,
    };

    console.log("📦 Payload being sent:", JSON.stringify(payload, null, 2));
    console.log("📡 Sending POST request to:", URL_PATH.demographics);
    console.log("📋 Headers being sent:", {
      "user-id": userId,
      Authorization: `Bearer ${token.substring(0, 20)}...`,
      "Content-Type": "application/json",
    });

    try {
      const saveResponse = await API("POST", URL_PATH.demographics, payload, {
        "user-id": userId,
        Authorization: `Bearer ${token}`,
      });

      console.log("📥 Save response:", saveResponse);

      if (!saveResponse?.success) {
        throw new Error(saveResponse?.message || "Failed to save demographics");
      }

      console.log("✅ Demographics saved successfully");

      if (saveResponse?.navigation) {
        console.log("🧭 Navigation data:", saveResponse.navigation);
        dispatch(setNavigation(saveResponse.navigation));
      }

      toast.success("Demographics saved successfully");

      console.log("➡️ Navigating to education page...");
      setTimeout(() => {
        navigate("/education");
      }, 1500);
    } catch (err: unknown) {
      console.error("❌ Error saving demographics:", err);

      const apiError = err as ApiError;

      if (apiError.response) {
        console.error("📋 Error response status:", apiError.response.status);
        console.error(
          "📋 Error response data:",
          JSON.stringify(apiError.response.data, null, 2),
        );

        // Check for specific error messages
        if (apiError.response.status === 500) {
          console.error("🔍 SERVER ERROR - Check backend logs for:");
          console.error("   - MongoDB connection issues");
          console.error("   - Schema validation errors");
          console.error("   - Missing required fields in database");
          console.error("   - Null value where not allowed");

          // Log the payload again for debugging
          console.error(
            "📦 Payload that caused 500:",
            JSON.stringify(payload, null, 2),
          );

          toast.error("Server error. Our team has been notified.");
        } else if (apiError.response.status === 400) {
          console.error("📋 Validation errors:", apiError.response.data);
          toast.error("Invalid data format. Please check your inputs.");
        } else if (apiError.response.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        } else if (apiError.response.status === 409) {
          toast.error("Demographics already exist. Try updating instead.");
        }
      }

      const message =
        apiError?.message ||
        apiError?.response?.data?.message ||
        "Failed to submit demographics";

      console.log("📋 Error message:", message);
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Demographics submission complete");
    }
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      console.log("\n========== 📊 FETCHING DEMOGRAPHICS DATA ==========");

      const userId = localStorage.getItem("userId");
      console.log("👤 User ID for fetch:", userId);

      try {
        let demographicsRes = null;

        try {
          console.log(
            "📡 Fetching demographics from:",
            URL_PATH.getDemographics,
          );
          demographicsRes = await API(
            "GET",
            URL_PATH.getDemographics,
            undefined,
            {
              "user-id": userId,
            },
          );
          console.log("📥 Demographics response:", demographicsRes);
        } catch (err: any) {
          console.log("⚠️ Demographics fetch error:", err?.response?.status);
          if (err?.response?.status !== 404) {
            throw err;
          }
        }

        const data = demographicsRes?.data;

        if (data?.fullName) {
          console.log("✅ Found existing demographics data:", data);
          setForm({
            fullName: data.fullName,
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
          });
          setPhoneVisible(!!data.phoneVisibleToRecruiters);
        } else {
          console.log("ℹ️ No existing demographics data found");
        }

        console.log("📡 Fetching experience index...");
        const expRes = await API(
          "GET",
          URL_PATH.calculateExperienceIndex,
          undefined,
          {
            "user-id": userId,
          },
        );
        console.log("📥 Experience index response:", expRes);
        setExperienceIndex(expRes?.points?.demographics || 0);
      } catch (err) {
        console.error("❌ Demographics load failed:", err);
        setError("Failed to load demographics");
        toast.error("Failed to load demographics");
      } finally {
        setIsLoading(false);
        console.log("🏁 Demographics fetch complete");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (form.country && !selectedCountry) {
      const country = Country.getAllCountries().find(
        (c) => c.name === form.country,
      );
      setSelectedCountry(country || null);
    }
  }, [form.country]);

  useEffect(() => {
    if (selectedCountry && form.state && !selectedState) {
      const state = State.getStatesOfCountry(selectedCountry.isoCode).find(
        (s) => s.name === form.state,
      );
      setSelectedState(state || null);
    }
  }, [selectedCountry, form.state]);

  useEffect(() => {
    if (!selectedCountry || !selectedState || !form.city) return;

    const city = City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode,
    ).find((c) => c.name === form.city);

    if (city) {
      setSelectedCity(city);
      setIsManualCity(false);
    } else {
      setSelectedCity(null);
      setIsManualCity(true);
    }
  }, [selectedCountry, selectedState, form.city]);

  /* ============================================
     RENDER - MINIMALISTIC DESIGN
  ============================================ */

  // Minimalist field styles
  const fieldClass = "w-full mb-4";
  const inputClass =
    "w-full px-0 py-2 text-sm border-0 border-b border-neutral-200 rounded-none bg-transparent focus:ring-0 focus:border-b-2 focus:outline-none transition-all duration-200";
  const labelClass = "text-xs font-medium text-neutral-500 mb-1 block";

  const steps: StepItem[] = [
    { label: "Demographics", icon: <FeatherUser />, completed: true },
    { label: "Education", icon: <FeatherGraduationCap /> },
    { label: "Experience", icon: <FeatherBriefcase /> },
    { label: "Certifications", icon: <FeatherFileCheck /> },
    { label: "Awards", icon: <FeatherAward /> },
    { label: "Projects", icon: <FeatherPackage /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar />

      {/* Simple header with progress */}
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple header with progress */}
        <div className="flex items-center gap-3 mb-8">
          <IconButton
            size="small"
            icon={<FeatherArrowLeft />}
            onClick={() => navigate("/upload-resume")}
            className="text-neutral-600 hover:text-neutral-900"
          />
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1 flex-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: "16.67%", backgroundColor: colors.primary }}
              />
            </div>
            <span className="text-xs text-neutral-500 ml-2">1/6</span>
          </div>
        </div>

        {/* Main content - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-neutral-900 mb-2">
                  Tell us about yourself
                </h1>
                <p className="text-sm text-neutral-500 font-light">
                  This helps us personalize your experience and connect you with
                  the right opportunities
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Name */}
                <div className={fieldClass}>
                  <label className={labelClass}>FULL NAME</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Smith"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "name" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Email */}
                <div className={fieldClass}>
                  <label className={labelClass}>EMAIL</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "email" ? colors.primary : undefined,
                    }}
                  />
                  <p className="text-xs text-neutral-400 mt-1 font-light">
                    Used for account access and recruiter outreach
                  </p>
                </div>

                {/* Phone */}
                <div className={fieldClass}>
                  <label className={labelClass}>PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="+1 (555) 123-4567"
                    className={inputClass}
                    style={{
                      borderBottomColor:
                        focusedField === "phone" ? colors.primary : undefined,
                    }}
                  />
                </div>

                {/* Phone visibility toggle - minimalist */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-600">
                    Show to recruiters
                  </span>
                  <button
                    onClick={() => setPhoneVisible(!phoneVisible)}
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                    style={{
                      backgroundColor: phoneVisible
                        ? colors.primary
                        : colors.neutral[200],
                    }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        phoneVisible ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Location - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Country */}
                  <div className={fieldClass}>
                    <label className={labelClass}>COUNTRY</label>
                    <select
                      className={inputClass}
                      value={selectedCountry?.isoCode || ""}
                      onChange={(e) => {
                        const country = Country.getCountryByCode(
                          e.target.value,
                        );
                        setSelectedCountry(country);
                        setSelectedState(null);
                        setSelectedCity(null);
                        setForm((prev) => ({
                          ...prev,
                          country: country?.name || "",
                          state: "",
                          city: "",
                        }));
                      }}
                    >
                      <option value="">Select</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className={fieldClass}>
                    <label className={labelClass}>STATE</label>
                    <select
                      className={inputClass}
                      disabled={!selectedCountry}
                      value={selectedState?.isoCode || ""}
                      onChange={(e) => {
                        const state = states.find(
                          (s) => s.isoCode === e.target.value,
                        );
                        setSelectedState(state);
                        setSelectedCity(null);
                        setIsManualCity(false);
                        setForm((prev) => ({
                          ...prev,
                          state: state?.name || "",
                          city: "",
                        }));
                      }}
                    >
                      <option value="">Select</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>CITY</label>
                    {!isManualCity ? (
                      <select
                        className={inputClass}
                        disabled={!selectedState}
                        value={selectedCity?.name || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === OTHER_CITY_VALUE) {
                            setIsManualCity(true);
                            setSelectedCity(null);
                            setForm((prev) => ({ ...prev, city: "" }));
                            return;
                          }
                          const city = cities.find((c) => c.name === value);
                          setSelectedCity(city);
                          setForm((prev) => ({
                            ...prev,
                            city: city?.name || "",
                          }));
                        }}
                      >
                        <option value="">Select</option>
                        {cities.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                        <option value={OTHER_CITY_VALUE}>+ Other</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm((prev) => ({ ...prev, city: value }));
                          if (value.trim() === "") {
                            setIsManualCity(false);
                            setSelectedCity(null);
                          }
                        }}
                        placeholder="Enter your city"
                        className={inputClass}
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* Continue Button - Minimalist */}
                <div className="pt-8">
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue || isSubmitting || isLoading}
                    className="w-full py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        canContinue && !isSubmitting && !isLoading
                          ? colors.primary
                          : colors.neutral[100],
                      color:
                        canContinue && !isSubmitting && !isLoading
                          ? "white"
                          : colors.neutral[400],
                    }}
                  >
                    {isLoading
                      ? "Loading..."
                      : isSubmitting
                        ? "Saving..."
                        : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Progress Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-6">
              {/* Experience Index - Minimal */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-500 mb-3">
                  EXPERIENCE INDEX
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-light text-neutral-900">
                    {experienceIndex ?? 0}
                  </span>
                  <span className="text-xs text-neutral-400">/100</span>
                </div>
              </div>

              <div className="h-px bg-neutral-100 my-4" />

              {/* Steps - Minimal */}
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
                          index === 0 ? `${colors.primary}08` : "transparent",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            index === 0 ? colors.primary : colors.neutral[100],
                          color: index === 0 ? "white" : colors.neutral[400],
                        }}
                      >
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <span
                        className="text-sm flex-1"
                        style={{
                          color:
                            index === 0 ? colors.primary : colors.neutral[500],
                          fontWeight: index === 0 ? 500 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                      {index === 0 && (
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

      <Footer />
    </div>
  );
}
