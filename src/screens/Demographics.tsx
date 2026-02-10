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
} from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Country, State, City } from "country-state-city";
import { colors } from "src/common/Colors";

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
}

interface StepItem {
  label: string;
  icon: React.ReactNode;
}

export default function Demographics() {
  const navigate = useNavigate();
  const [navReady, setNavReady] = useState(false);

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
     GUARD: Redirect if not on demographics step
  ============================================ */
  // useEffect(() => {
  //   if (currentStep && currentStep !== "demographics") {
  //     console.warn("User tried to access demographics but on", currentStep);
  //     navigate(nextRoute || "/demographics");
  //   }
  // }, [currentStep, nextRoute, navigate]);

  // useEffect(() => {
  //   if (!currentStep) return;
  //   if (currentStep === "demographics") return;
  //   navigate(nextRoute || "/");
  // }, [currentStep, nextRoute, navigate]);

  //   useEffect(() => {
  //   if (!navReady) return;

  //   // allow browser back navigation
  //   if (window.history.state?.idx > 0) return;

  //   if (currentStep === "demographics") return;

  //   navigate(nextRoute || "/");
  // }, [navReady, currentStep, nextRoute, navigate]);

  /* ============================================
     LOCAL STATE
  ============================================ */
  const [phoneVisible, setPhoneVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [experienceIndex, setExperienceIndex] = useState<number | null>(null);
  useEffect(() => {
    const hydrateNavigation = async () => {
      if (currentStep) {
        setNavReady(true);
        return;
      }

      try {
        const res = await API("GET", URL_PATH.getUserStatus);

        if (res?.navigation) {
          dispatch(
            setNavigation({
              nextRoute: res.navigation.nextRoute,
              currentStep: res.navigation.currentStep,
              completedSteps: res.navigation.completedSteps,
              isOnboardingComplete: res.navigation.isOnboardingComplete,
              hasPayment: res.navigation.hasPayment,
            }),
          );
        }
      } catch (e) {
        console.error("Failed to hydrate onboarding", e);
      } finally {
        setNavReady(true);
      }
    };

    hydrateNavigation();
  }, [currentStep, dispatch]);

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

    // ✅ FIX: Check if phoneNumber exists AND is not empty before testing regex
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
    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    const payload = {
      fullName: normalizeText(form.fullName),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber ? form.phoneNumber.trim() : null,
      city: normalizeText(form.city),
      state: normalizeText(form.state),
      country: normalizeText(form.country),
      phoneVisibleToRecruiters: phoneVisible,
    };

    try {
      // ✅ Step 1: Save demographics to backend
      const saveResponse = await API("POST", URL_PATH.demographics, payload);

      if (!saveResponse?.data) {
        setError(saveResponse?.message || "Failed to save demographics");
        setIsSubmitting(false);
        return;
      }

      // ✅ Step 2: Get updated navigation status
      const statusResponse = await API("GET", URL_PATH.getUserStatus);

      if (!statusResponse?.success) {
        setError("Failed to get next step");
        setIsSubmitting(false);
        return;
      }

      // ✅ Step 3: Update Redux with new navigation
      dispatch(
        setNavigation({
          nextRoute: statusResponse.navigation.nextRoute,
          currentStep: statusResponse.navigation.currentStep,
          completedSteps: statusResponse.navigation.completedSteps,
          isOnboardingComplete: statusResponse.navigation.isOnboardingComplete,
          hasPayment: statusResponse.navigation.hasPayment,
        }),
      );
      toast.success("Demographics added successfully");

      setTimeout(() => {
        navigate(statusResponse.navigation.nextRoute);
      }, 3000);

      // ✅ Step 4: Navigate to next step
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const message = apiError?.message || "Failed to submit demographics";

      console.error("❌ Error saving demographics:", err);
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        let demographicsRes = null;

        // ✅ 404 is NORMAL for first-time users
        try {
          demographicsRes = await API("GET", URL_PATH.getDemographics);
        } catch (err: any) {
          if (err?.response?.status !== 404) {
            throw err; // real error
          }
        }

        // Populate form ONLY if data exists
        const data = demographicsRes?.data;

        if (data?.fullName) {
          setForm({
            fullName: data.fullName,
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
          });
          setPhoneVisible(!!data.phoneVisibleToRecruiters);
        }

        // Experience index is safe
        const expRes = await API("GET", URL_PATH.calculateExperienceIndex);
        setExperienceIndex(expRes?.points?.demographics || 0);
      } catch (err) {
        console.error("Demographics load failed:", err);
        setError("Failed to load demographics");
        toast.error("Failed to load demographics");
      } finally {
        setIsLoading(false);
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
      // 👇 THIS IS THE FIX
      setSelectedCity(null);
      setIsManualCity(true);
    }
  }, [selectedCountry, selectedState, form.city]);

  /* ============================================
     RENDER
  ============================================ */
  const fieldClass =
    "w-full [&>label]:text-[8px] [&>label]:font-small [&>div]:rounded-full [&>div]:border [&>div]:border-neutral-300 [&>div]:h-8 focus:border-black";

  const inputClass =
    "w-full h-7 rounded-full px-2 text-[12px] leading-none bg-transparent focus:bg-transparent focus:outline-none focus:ring-0";

  const steps: StepItem[] = [
    { label: "Education", icon: <FeatherGraduationCap key="edu" /> },
    { label: "Experience", icon: <FeatherBriefcase key="exp" /> },
    { label: "Certifications", icon: <FeatherFileCheck key="cert" /> },
    { label: "Awards", icon: <FeatherAward key="award" /> },
    { label: "Projects", icon: <FeatherPackage key="proj" /> },
  ];

  return (
  <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
    {/* Blended background - Covers entire page */}
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: colors.background }}
      />

      <div
        className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
        style={{
          background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
        }}
      />

      <div
        className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
        }}
      />

      <div
        className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
        }}
      />
    </div>

    {/* Header and content with z-index to stay above background */}
    <div className="relative z-10">
      <ToastContainer position="top-center" autoClose={2000} />
      <HeaderLogo />
      <div className="flex justify-center px-4 sm:px-6 py-0 sm:py-0">
        <div className="w-full max-w-[1000px] mx-auto flex flex-col md:flex-row gap-6 md:gap-8 justify-center py-8">
          {/* LEFT CARD */}
          <main className="w-full md:max-w-[480px] bg-white rounded-3xl border border-neutral-300 px-4 sm:px-6 md:px-8 py-6 shadow-[0_10px_30px_rgba(40,0,60,0.06)]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <IconButton
                size="small"
                icon={<FeatherArrowLeft />}
                onClick={() => navigate("/upload-resume")}
              />

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div 
                    className="flex-1 h-[5px] rounded-full" 
                    style={{ backgroundColor: colors.primary }}
                  />
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-[5px] rounded-full bg-neutral-300"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-[22px] text-neutral-900 font-semibold">
                Let's Calculate Your Experience Index
              </h2>
              <p className="text-xs text-neutral-500 mt-2">
                This information helps us create rankings and connect you with
                relevant recruiters
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4 mb-6">
              <TextField label="Name *" className={fieldClass}>
                <TextField.Input
                  value={form.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="John Smith"
                  className={inputClass}
                />
              </TextField>

              <TextField
                label="Email *"
                helpText={
                  <span className="text-xs text-gray-400">
                    Used for account access and recruiter outreach
                  </span>
                }
                className={fieldClass}
              >
                <TextField.Input
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </TextField>

              <TextField
                label="Phone Number"
                helpText={
                  <span className="text-gray-400 text-xs">
                    Optional for recruiter contact
                  </span>
                }
                className={fieldClass}
              >
                <TextField.Input
                  value={form.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                  className={inputClass}
                />
              </TextField>

              <div className="flex items-center gap-3">
                <Switch
                  checked={phoneVisible}
                  onCheckedChange={setPhoneVisible}
                  className="h-5 w-9 data-[state=checked]:bg-violet-700 data-[state=unchecked]:bg-neutral-300"
                  style={{
                    backgroundColor: phoneVisible ? colors.primary : undefined,
                  }}
                />
                <span className="text-sm text-neutral-700">
                  Make phone number visible to recruiters
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField label="Country *" className={fieldClass}>
                  <select
                    className={inputClass}
                    value={selectedCountry?.isoCode || ""}
                    onChange={(e) => {
                      const country = Country.getCountryByCode(e.target.value);
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
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </TextField>

                <TextField label="State *" className={fieldClass}>
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
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </TextField>

                <TextField label="City *" className={fieldClass}>
                  {!isManualCity ? (
                    <select
                      className={inputClass}
                      disabled={!selectedState}
                      value={selectedCity?.name || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Explicit intent → manual entry
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
                      <option value="">Select City</option>

                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}

                      <option value={OTHER_CITY_VALUE}>Other</option>
                    </select>
                  ) : (
                    <TextField.Input
                      value={form.city}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((prev) => ({ ...prev, city: value }));

                        // 👇 Only switch back when user clears text
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
                </TextField>
              </div>
            </div>

            <div className="w-full h-px bg-neutral-200 my-5" />

            {/* Submit Button */}
            <Button
              onClick={handleContinue}
              disabled={isSubmitting || isLoading}
              style={{ 
                backgroundColor: colors.accent,
                color: "white",
              }}
              className={`w-full h-10 rounded-full font-semibold transition ${
                isSubmitting || isLoading
                  ? "cursor-not-allowed opacity-70"
                  : "hover:opacity-90 shadow-lg"
              }`}
            >
              {isLoading
                ? "Loading..."
                : isSubmitting
                  ? "Submitting..."
                  : "Continue"}
            </Button>
          </main>

          {/* RIGHT PANEL */}
          <aside className="w-full md:w-72 shrink-0 mt-6 md:mt-0">
            <div className="md:sticky md:top-6 bg-white rounded-[20px] px-6 py-6 shadow-lg border border-neutral-300">
              <h3 className="text-[20px] font-semibold text-neutral-900">
                Your Experience Index
              </h3>

              <div className="flex items-center justify-center py-8">
                <span className="text-[48px] font-medium text-neutral-300">
                  {experienceIndex ?? 0}
                </span>
              </div>

              <div className="h-px bg-neutral-300 mb-4" />

              <div className="text-[16px] font-semibold text-neutral-800 mb-3">
                Progress Steps
              </div>

              {/* Current Step */}
              <button style={{backgroundColor: colors.primary}} className="w-full flex items-center gap-3 rounded-2xl px-4 py-2 mb-3">
                <IconWithBackground size="small" icon={<FeatherUser />} />
                <span className="text-sm font-medium text-neutral-900">
                  Demographics
                </span>
              </button>

              {/* Other Steps */}
              {steps.map((step) => (
                <div
                  key={step.label}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-300 px-4 py-2 mb-3"
                >
                  <IconWithBackground
                    size="small"
                    variant="neutral"
                    icon={step.icon}
                  />
                  <span className="text-sm text-neutral-500">{step.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
);
}
