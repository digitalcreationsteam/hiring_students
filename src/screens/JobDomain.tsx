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

  // // SubDomain
  // const [subDomain, setSubDomain] = useState<{
  //   id: string;
  //   name: string;
  // } | null>(null);
  // const [subDomains, setSubDomains] = useState<{ _id: string; name: string }[]>(
  //   []
  // );

  // -------------------- SAVE DOMAIN + SUBDOMAIN --------------------
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

      // ✅ Step 1: Save domain/subdomain
      const saveResponse = await API(
        "POST",
        URL_PATH.jobDomain,
        {
          userId,
          domainId: domain.id,
          // subDomainId: subDomain.id,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );

      console.log("✅ Domain saved:", saveResponse);

      localStorage.setItem("domainId", domain.id);
      // localStorage.setItem("subDomainId", subDomain.id);
      localStorage.setItem("jobDomain", domain.name);
      // localStorage.setItem("subDomain", subDomain.name);

      // ✅ Step 2: Get updated navigation status
      console.log("🔍 Fetching updated navigation...");

      const statusResponse = await API("GET", URL_PATH.getUserStatus);

      if (!statusResponse?.success) {
        console.error("❌ Failed to get navigation:", statusResponse);
        notify("Failed to get next step");
        setIsSubmitting(false);
        return;
      }

      console.log("📊 Updated navigation:", statusResponse.navigation);

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

      // ✅ Step 4: Navigate to next step
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

        // API returns array
        if (Array.isArray(res) && res.length > 0) {
          const item = res[0];

          if (item.domainId) {
            setDomain({
              id: item.domainId._id,
              name: item.domainId.name,
            });
          }

          // if (item.subDomainId) {
          //   setSubDomain({
          //     id: item.subDomainId._id,
          //     name: item.subDomainId.name,
          //   });
          // }
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

  // // -------------------- FETCH SUBDOMAINS BY DOMAIN --------------------
  // useEffect(() => {
  //   if (!domain) {
  //     setSubDomains([]);
  //     setSubDomain(null);
  //     return;
  //   }

  //   const fetchSubDomains = async () => {
  //     try {
  //       console.log("📋 Fetching subdomains for domain:", domain.id);

  //       const res = await API(
  //         "GET",
  //         `${URL_PATH.getSubDomain}?domainId=${domain.id}`
  //       );

  //       setSubDomains(
  //         res.data.map((item: any) => ({
  //           _id: item._id,
  //           name: item.name,
  //         }))
  //       );
  //     } catch (err) {
  //       console.error("Failed to fetch sub domains", err);
  //       notify("Unable to load sub domains");
  //     }
  //   };

  //   fetchSubDomains();
  // }, [domain]);

  // -------------------- UI --------------------
  return (
    <>
<Navbar />
{/* 🎨 Linear gradient background - fixed behind everything */}
    <div 
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background: `linear-gradient(
          to bottom,
          #d9d9d9 0%,
          #cfd3d6 25%,
          #9aa6b2 55%,
          #2E4056 100%
        )`,
        width: "100%",
      }}
    />
    
    {/* Page */}
    <div className="min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex items-center justify-center">
      <div className="w-full max-w-[660px] mx-auto">
        <div
          className="flex w-full flex-col gap-6 sm:gap-8 rounded-3xl border px-5 sm:px-8 md:px-10 py-7 sm:py-8 shadow-xl backdrop-blur-md"
          style={{
            backgroundColor: `${colors.white}CC`,
            borderColor: colors.neutral[200],
          }}
        >
           
         {/* Header */}
<div className="flex items-center gap-3 sm:gap-4">
  <IconButton
    size="small"
    icon={<FeatherArrowLeft />}
    onClick={() => navigate(-1)}
  />

  <div className="flex flex-1 gap-2">
    {[...Array(2)].map((_, i) => (
      <div
        key={`done-${i}`}
        className="h-1 flex-1 rounded-full"
        style={{ backgroundColor: colors.primary }}
      />
    ))}

    {[...Array(3)].map((_, i) => (
      <div
        key={`todo-${i}`}
        className="h-1 flex-1 rounded-full"
        style={{ backgroundColor: colors.neutral[200] }}
      />
    ))}
  </div>
</div>


           {/* Title */}
<div className="flex flex-col gap-1">
  <h2
    className="text-[20px] sm:text-[22px] md:text-[26px] font-semibold"
    style={{ color: colors.neutral[800] }}
  >
    Choose your job domain
  </h2>

  <p
    className="text-xs sm:text-sm"
    style={{ color: colors.neutral[600] }}
  >
    Your domain and skills will decide your assessment and rankings
  </p>
</div>

{/* Domain Dropdown */}
<div className="flex flex-col gap-2">
  <label
    className="text-sm font-medium"
    style={{ color: colors.neutral[800] }}
  >
    Job Domain <span className="text-red-500">*</span>
  </label>

  <SubframeCore.DropdownMenu.Root
    open={isDomainOpen}
    onOpenChange={setIsDomainOpen}
  >
    <SubframeCore.DropdownMenu.Trigger asChild>
      <div
        className="flex h-10 sm:h-11 items-center justify-between rounded-3xl border px-4 cursor-pointer transition"
        style={{
          backgroundColor: `${colors.white}CC`,
          borderColor: colors.neutral[200],
        }}
      >
        <span
          className="text-sm sm:text-base"
          style={{
            color: domain ? colors.neutral[800] : colors.neutral[400],
          }}
        >
          {domain?.name || "Select your domain"}
        </span>

        <FeatherChevronDown style={{ color: colors.neutral[600] }} />
      </div>
    </SubframeCore.DropdownMenu.Trigger>

    <SubframeCore.DropdownMenu.Content asChild align="start" sideOffset={6}>
      <div
        className="rounded-2xl z-10 shadow-lg py-2 max-h-[260px] overflow-y-auto border backdrop-blur-md"
        style={{
          backgroundColor: `${colors.white}F2`,
          borderColor: colors.neutral[200],
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
              className="px-4 py-2 cursor-pointer text-sm sm:text-base transition"
              style={{
                backgroundColor: selected ? colors.primaryGlow : "transparent",
                color: colors.neutral[800],
                fontWeight: selected ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!selected) e.currentTarget.style.backgroundColor = `${colors.primaryGlow}99`;
              }}
              onMouseLeave={(e) => {
                if (!selected) e.currentTarget.style.backgroundColor = "transparent";
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


            {/* SubDomain Dropdown */}
            {/* <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-900">
              Sub Domain <span className="text-red-500">*</span>
            </label>

            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild>
                <div
                  className={`flex h-10 items-center justify-between rounded-3xl border border-neutral-300 px-4 cursor-pointer ${
                    !domain
                      ? "bg-neutral-100 cursor-not-allowed"
                      : "bg-neutral-50"
                  }`}
                >
                  <span
                    className={
                      subDomain ? "text-neutral-600" : "text-neutral-400"
                    }
                  >
                    {subDomain?.name || "Select sub domain"}
                  </span>
                  <FeatherChevronDown />
                </div>
              </SubframeCore.DropdownMenu.Trigger>

              {domain && (
                <SubframeCore.DropdownMenu.Content
                  asChild
                  align="start"
                  sideOffset={4}
                >
                  <div className="bg-white rounded-2xl shadow-lg py-2 max-h-[260px] overflow-y-auto">
                    {subDomains.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          console.log("🎯 SubDomain selected:", item.name);
                          setSubDomain({ id: item._id, name: item.name });
                        }}
                        className={`px-4 py-2 cursor-pointer text-sm hover:bg-violet-50 ${
                          subDomain?.id === item._id
                            ? "bg-violet-100 font-semibold"
                            : ""
                        }`}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </SubframeCore.DropdownMenu.Content>
              )}
            </SubframeCore.DropdownMenu.Root>
          </div> */}

            {/* Footer */}
            <Button
  onClick={handleContinue}
  disabled={!domain || isSubmitting}
  className="w-full h-10 sm:h-11 rounded-2xl text-sm sm:text-base font-semibold transition active:scale-[0.99]"
  style={{
    backgroundColor:
      !domain || isSubmitting ? colors.neutral[200] : colors.accent,
    color: colors.background,
    cursor: !domain || isSubmitting ? "not-allowed" : "pointer",
    opacity: !domain || isSubmitting ? 0.7 : 1,
  }}
>
  {isSubmitting ? "Saving..." : "Continue"}
</Button>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JobDomain;
