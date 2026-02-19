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
  FeatherCheckCircle,
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
}

interface StepItem {
  label: string;
  icon: React.ReactNode;
  isCompleted?: boolean;
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
      const saveResponse = await API("POST", URL_PATH.demographics, payload);

      if (!saveResponse?.data) {
        setError(saveResponse?.message || "Failed to save demographics");
        setIsSubmitting(false);
        return;
      }

      const statusResponse = await API("GET", URL_PATH.getUserStatus);

      if (!statusResponse?.success) {
        setError("Failed to get next step");
        setIsSubmitting(false);
        return;
      }

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

        try {
          demographicsRes = await API("GET", URL_PATH.getDemographics);
        } catch (err: any) {
          if (err?.response?.status !== 404) {
            throw err;
          }
        }

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
      setSelectedCity(null);
      setIsManualCity(true);
    }
  }, [selectedCountry, selectedState, form.city]);

  /* ============================================
     RENDER - UPDATED UI DESIGN
  ============================================ */
  const fieldClass = "w-full";
  
  const inputClass = "w-full h-9 rounded-xl px-3 text-sm bg-white/50 border border-gray-200/50 focus:border-gray-400 focus:ring-0 transition-all duration-200 hover:border-gray-300";

  const steps: StepItem[] = [
    { label: "Education", icon: <FeatherGraduationCap />, isCompleted: false },
    { label: "Experience", icon: <FeatherBriefcase />, isCompleted: false },
    { label: "Certifications", icon: <FeatherFileCheck />, isCompleted: false },
    { label: "Awards", icon: <FeatherAward />, isCompleted: false },
    { label: "Projects", icon: <FeatherPackage />, isCompleted: false },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced gradient background with soft blur */}
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

      {/* Main content with glass morphism */}
      <div className="relative z-10">
        <ToastContainer 
          position="top-center" 
          autoClose={2000}
          toastClassName="!bg-white/80 !backdrop-blur-md !text-gray-800 !shadow-lg !border !border-white/20"
        />
        <Navbar />
        
        <div className="flex justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* LEFT CARD - Glass effect */}
            <main className="w-full lg:flex-1 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl px-6 sm:px-8 py-8">
              
              {/* Header with progress */}
              <div className="flex items-center gap-4 mb-8">
                <IconButton
                  size="small"
                  icon={<FeatherArrowLeft className="w-4 h-4" />}
                  onClick={() => navigate("/upload-resume")}
                  className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i === 0 
                            ? "bg-gradient-to-r from-gray-600 to-gray-800" 
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Step 1 of 6</p>
                </div>
              </div>

              {/* Title with refined typography */}
              <div className="mb-8">
                <h2 className="text-2xl text-gray-800 font-light tracking-tight">
                  Let's calculate your 
                  <span className="block font-semibold text-gray-900 mt-1">Experience Index</span>
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  This information helps us create rankings and connect you with relevant recruiters
                </p>
              </div>

              {/* Form with enhanced styling */}
              <div className="space-y-5 mb-8">
                <TextField label="Full name *" className={fieldClass}>
                  <TextField.Input
                    value={form.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="John Smith"
                    className={inputClass}
                  />
                </TextField>

                <TextField
                  label="Email address *"
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
                  label="Phone number"
                  helpText={
                    <span className="text-gray-400 text-xs">
                      Optional for recruiter contact
                    </span>
                  }
                  className={fieldClass}
                >
                  <TextField.Input
                    value={form.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={inputClass}
                  />
                </TextField>

                {/* Switch with refined styling */}
                <div className="flex items-center gap-3 p-3 bg-white/30 rounded-xl backdrop-blur-sm border border-white/20">
                  <Switch
                    checked={phoneVisible}
                    onCheckedChange={setPhoneVisible}
                    className="h-5 w-9 data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-white/50"
                  />
                  <span className="text-sm text-gray-600">
                    Make phone number visible to recruiters
                  </span>
                </div>

                {/* Location fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Country *</label>
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
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">State *</label>
                    <select
                      className={inputClass}
                      disabled={!selectedCountry}
                      value={selectedState?.isoCode || ""}
                      onChange={(e) => {
                        const state = states.find((s) => s.isoCode === e.target.value);
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
                      <option value="">Select state</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">City *</label>
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
                        <option value="">Select city</option>
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
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-6" />

              {/* Submit Button with refined styling */}
              <Button
                onClick={handleContinue}
                disabled={!canContinue || isSubmitting || isLoading}
                className="w-full h-11 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                style={{
                  background: !canContinue || isSubmitting || isLoading
                    ? "linear-gradient(135deg, #e0e0e0, #f0f0f0)"
                    : "linear-gradient(135deg, #2c3e50, #1e2a36)",
                  color: !canContinue || isSubmitting || isLoading
                    ? "#999"
                    : "#ffffff",
                  cursor: !canContinue || isSubmitting || isLoading
                    ? "not-allowed"
                    : "pointer",
                  boxShadow: !canContinue || isSubmitting || isLoading
                    ? "none"
                    : "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)",
                  opacity: !canContinue || isSubmitting || isLoading ? 0.6 : 1,
                }}
              >
                {!canContinue
                  ? "Complete all fields to continue"
                  : isLoading
                  ? "Loading..."
                  : isSubmitting
                  ? "Submitting..."
                  : "Continue →"}
              </Button>
            </main>

            {/* RIGHT PANEL - Enhanced glass effect */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
                
                {/* Experience Index Score */}
                <div className="text-center mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Experience Index
                  </h3>
                  <div className="relative inline-block">
                    <span className="text-6xl font-light text-gray-800">
                      {experienceIndex ?? 0}
                    </span>
                    <div className="absolute -top-1 -right-4 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-4" />

                {/* Progress Steps with refined styling */}
                <h4 className="text-sm font-medium text-gray-600 mb-4">Progress steps</h4>
                
                <div className="space-y-2">
                  {/* Current Step - Demographics */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, rgba(44,62,80,0.1), rgba(30,42,54,0.05))",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/80 shadow-sm">
                      <FeatherUser className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      Demographics
                    </span>
                    <FeatherCheckCircle className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Other Steps */}
                  {steps.map((step, index) => (
                    <div
                      key={step.label}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-200"
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
                        {index + 2}/6
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}