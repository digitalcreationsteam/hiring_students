"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import HeaderLogo from "src/ui/components/HeaderLogo";
import { FeatherArrowLeft, FeatherChevronDown } from "@subframe/core";
import { useNavigate } from "react-router-dom";
import * as SubframeCore from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { useAppDispatch } from "src/store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

interface IllustrationProps {
  className?: string;
}

// SVG Illustration Component
const HeroIllustration: React.FC<IllustrationProps> = ({ className = "" }) => (
  <div className={`w-full h-full ${className}`}>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Outer circles */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke={colors.primary}
        strokeWidth="1"
        strokeDasharray="5 5"
        fill="none"
        opacity="0.3"
      />
      <circle
        cx="200"
        cy="200"
        r="140"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <circle
        cx="200"
        cy="200"
        r="100"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <circle
        cx="200"
        cy="200"
        r="60"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
      />

      {/* Data points - larger and more visible */}
      <circle cx="140" cy="140" r="10" fill={colors.primary} opacity="0.3" />
      <circle cx="280" cy="160" r="14" fill={colors.primary} opacity="0.2" />
      <circle cx="160" cy="300" r="12" fill={colors.primary} opacity="0.3" />
      <circle cx="320" cy="260" r="8" fill={colors.primary} opacity="0.35" />
      <circle cx="100" cy="220" r="9" fill={colors.primary} opacity="0.25" />

      {/* Connection lines - enhanced */}
      <path
        d="M140 140 L200 200 L280 160 L200 200 L160 300 L200 200 L320 260 L200 200 L100 220"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.25"
        strokeDasharray="4 4"
      />

      {/* Central hexagon - larger */}
      <path
        d="M200 120 L280 160 L280 240 L200 280 L120 240 L120 160 L200 120"
        stroke={colors.primary}
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* Inner details */}
      <circle
        cx="200"
        cy="200"
        r="25"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <circle cx="200" cy="200" r="15" fill={colors.primary} opacity="0.15" />

      {/* Additional accent elements */}
      <path
        d="M200 120 L200 280"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.2"
      />
      <path
        d="M120 200 L280 200"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.2"
      />
    </svg>
  </div>
);

const notify = (msg: string) => {
  console.warn(msg);
};

function JobDomain() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isDomainOpen, setIsDomainOpen] = useState(false);

  const userId = React.useMemo(() => localStorage.getItem("userId"), []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Domain
  const [domain, setDomain] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [domains, setDomains] = useState<{ _id: string; name: string }[]>([]);

  // -------------------- SAVE DOMAIN --------------------
  const handleContinue = async () => {
    if (!domain) {
      notify("Please select domain.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      console.log("💾 Saving domain...");

      const saveResponse = await API(
        "POST",
        URL_PATH.jobDomain,
        {
          userId,
          domainId: domain.id,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );

      console.log("✅ Domain saved:", saveResponse);

      localStorage.setItem("domainId", domain.id);
      localStorage.setItem("jobDomain", domain.name);

      console.log("🔍 Fetching updated navigation...");

      const statusResponse = await API("GET", URL_PATH.getUserStatus);

      if (!statusResponse?.success) {
        console.error("❌ Failed to get navigation:", statusResponse);
        notify("Failed to get next step");
        setIsSubmitting(false);
        return;
      }

      console.log("📊 Updated navigation:", statusResponse.navigation);

      dispatch(
        setNavigation({
          nextRoute: statusResponse.navigation.nextRoute,
          currentStep: statusResponse.navigation.currentStep,
          completedSteps: statusResponse.navigation.completedSteps,
          isOnboardingComplete: statusResponse.navigation.isOnboardingComplete,
          hasPayment: statusResponse.navigation.hasPayment,
        }),
      );

      console.log("🚀 Navigating to:", statusResponse.navigation.nextRoute);
      navigate(statusResponse.navigation.nextRoute);
    } catch (err: any) {
      console.error("❌ Error:", err);
      notify(err?.response?.data?.message || "Failed to save job domain");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- FETCH USER SELECTED DOMAIN --------------------
  useEffect(() => {
    const fetchUserSelectedDomain = async () => {
      if (!userId) return;

      try {
        console.log("📋 Fetching user selected domain...");

        const res = await API("GET", URL_PATH.getUserDomainSkils, undefined, {
          "user-id": userId,
        });

        if (Array.isArray(res) && res.length > 0) {
          const item = res[0];

          if (item.domainId) {
            setDomain({
              id: item.domainId._id,
              name: item.domainId.name,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch job domain", err);
      }
    };

    fetchUserSelectedDomain();
  }, [userId]);

  // -------------------- FETCH ALL DOMAINS --------------------
  useEffect(() => {
    const fetchAvailableDomains = async () => {
      try {
        console.log("📋 Fetching available domains...");

        const res = await API("GET", URL_PATH.getJobDomain);

        const activeDomains = res.map((d: any) => ({
          _id: d._id,
          name: d.name,
        }));

        setDomains(activeDomains);
      } catch (err) {
        console.error("Failed to load domains", err);
        notify("Unable to load job domains");
      }
    };

    fetchAvailableDomains();
  }, []);

  // -------------------- UI --------------------
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

      <div className="relative z-10">
        <Navbar />

        <div className="min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex items-center justify-center">
          <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left side - SVG Illustration Component */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] lg:max-w-[500px]">
                {/* Decorative blur elements behind illustration */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
                
                {/* SVG Illustration Component */}
                <div className="relative z-10 drop-shadow-2xl">
                  <HeroIllustration />
                </div>
              </div>
            </div>

            {/* Right side - Glass card */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
              <div className="w-full max-w-[500px]">
                <div
                  className="flex w-full flex-col gap-6 sm:gap-8 rounded-3xl border px-6 sm:px-8 md:px-10 py-7 sm:py-8 shadow-2xl backdrop-blur-xl bg-white/70"
                  style={{
                    borderColor: "rgba(255,255,255,0.4)",
                  }}
                >
                  {/* Header with progress */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <IconButton
                      size="small"
                      icon={<FeatherArrowLeft className="w-4 h-4" />}
                      onClick={() => navigate("/skill-index-intro")}
                      className="bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/30"
                    />

                    <div className="flex flex-1 gap-2">
                      <div className="flex items-center gap-2 w-full">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                              i <= 1 
                                ? "bg-gradient-to-r from-gray-600 to-gray-800" 
                                : "bg-white/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title with refined typography */}
                  <div className="flex flex-col gap-2">
                    <h2
                      className="text-2xl sm:text-2xl md:text-3xl font-light tracking-tight text-gray-800"
                    >
                      Choose your 
                      <span className="block font-semibold text-gray-900 mt-1">Job Domain</span>
                    </h2>

                    <p
                      className="text-sm text-gray-500 leading-relaxed mt-2"
                    >
                      Your domain and skills will decide your assessment and rankings
                    </p>
                  </div>

                  {/* Domain Dropdown with enhanced styling */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Job Domain <span className="text-red-500">*</span>
                    </label>

                    <SubframeCore.DropdownMenu.Root
                      open={isDomainOpen}
                      onOpenChange={setIsDomainOpen}
                    >
                      <SubframeCore.DropdownMenu.Trigger asChild>
                        <div
                          className="flex h-11 sm:h-12 items-center justify-between rounded-xl border px-4 cursor-pointer transition-all duration-200 hover:bg-white/50"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.5)",
                            borderColor: "rgba(255,255,255,0.4)",
                          }}
                        >
                          <span
                            className="text-sm sm:text-base"
                            style={{
                              color: domain
                                ? colors.neutral[800]
                                : colors.neutral[400],
                            }}
                          >
                            {domain?.name || "Select your domain"}
                          </span>

                          <FeatherChevronDown
                            className="w-4 h-4"
                            style={{ color: colors.neutral[600] }}
                          />
                        </div>
                      </SubframeCore.DropdownMenu.Trigger>

                      <SubframeCore.DropdownMenu.Content
                        asChild
                        align="start"
                        sideOffset={6}
                      >
                        <div
                          className="rounded-xl z-10 shadow-xl py-2 max-h-[260px] overflow-y-auto border backdrop-blur-xl bg-white/80"
                          style={{
                            borderColor: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {domains.map((item) => {
                            const selected = domain?.id === item._id;

                            return (
                              <div
                                key={item._id}
                                onClick={() => {
                                  console.log("🎯 Domain selected:", item.name);
                                  setDomain({ id: item._id, name: item.name });
                                  setIsDomainOpen(false);
                                }}
                                className="px-4 py-2.5 cursor-pointer text-sm sm:text-base transition-all duration-200"
                                style={{
                                  backgroundColor: selected
                                    ? colors.primaryGlow
                                    : "transparent",
                                  color: colors.neutral[800],
                                  fontWeight: selected ? 600 : 400,
                                }}
                                onMouseEnter={(e) => {
                                  if (!selected)
                                    e.currentTarget.style.backgroundColor = `${colors.primaryGlow}99`;
                                }}
                                onMouseLeave={(e) => {
                                  if (!selected)
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                }}
                              >
                                {item.name}
                              </div>
                            );
                          })}
                        </div>
                      </SubframeCore.DropdownMenu.Content>
                    </SubframeCore.DropdownMenu.Root>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-2" />

                  {/* Footer Button */}
                  <Button
                    onClick={handleContinue}
                    disabled={!domain || isSubmitting}
                    className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                    style={{
                      background: !domain || isSubmitting
                        ? "linear-gradient(135deg, #e0e0e0, #f0f0f0)"
                        : "linear-gradient(135deg, #2c3e50, #1e2a36)",
                      color: "#ffffff",
                      cursor: !domain || isSubmitting ? "not-allowed" : "pointer",
                      boxShadow: !domain || isSubmitting
                        ? "none"
                        : "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)",
                      opacity: !domain || isSubmitting ? 0.6 : 1,
                    }}
                  >
                    {isSubmitting ? "Saving..." : "Continue →"}
                  </Button>

                  {/* Step indicator */}
                  <p className="text-xs text-center text-gray-400 mt-2">
                    Step 2 of 5 • Job Domain Selection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default JobDomain;