"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "../ui/components/Badge";
import { Button } from "../ui/components/Button";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { FeatherCheck, FeatherStar } from "@subframe/core";



function Paywall() {
  const navigate = useNavigate();
  const location = useLocation();

 const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(
  () => localStorage.getItem("selectedPlan") as "basic" | "premium" | null
);


useEffect(() => {
  if (location.state?.plan) {
    setSelectedPlan(location.state.plan);
    localStorage.setItem("selectedPlan", location.state.plan);
  }
}, [location.state]);





  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-50 px-4 sm:px-6 md:px-8 py-10">
      <div className="w-full max-w-[760px] flex flex-col items-center gap-8 sm:gap-10">
        {/* ✅ Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-sans text-gray-1000">
            Pick your plan
          </h1>

          <p className="text-sm text-gray-500 max-w-md">
            Choose how you want to use the platform. You can switch later.
          </p>
        </div>

        {/* ✅ Cards Wrapper */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 justify-items-center">
          {/* ✅ BASIC CARD */}
          <div
            onClick={() => {
  setSelectedPlan("basic");
  localStorage.setItem("selectedPlan", "basic");
}}

            className={`cursor-pointer w-full max-w-[380px] rounded-3xl p-6 flex flex-col gap-6 shadow-sm border-2 border-gray-300 transition
    ${
      selectedPlan === "basic"
        ? "border-violet-600 ring-2 ring-violet-200"
        : "border-gray-200"
    }
  `}
          >
            <div>
              <h2 className="text-2xl text-gray-900">Basic Plan</h2>
              <p className="text-sm text-gray-500 mt-1">
                Good for starting out.
              </p>
            </div>

            <p className="text-sm font-medium">You get:</p>

            <div className="flex flex-col gap-3 text-sm text-gray-700">
              {[
                "Access to your ranking table",
                "Skill tests twice a month",
                "Entry to all hackathons",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  {/* ✅ SAME SIZE AS PREMIUM NOW */}
                  <div className="w-5 h-5 shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                    <FeatherCheck className="text-gray-600 w-3 h-3" />
                  </div>

                  <span className="text-sm text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ PREMIUM CARD (HIGHLIGHTED) */}
          <div
            onClick={() => {
  setSelectedPlan("premium");
  localStorage.setItem("selectedPlan", "premium");
}}

            className={`cursor-pointer w-full max-w-[380px] rounded-3xl p-6 flex flex-col gap-6 shadow-md border-2 border-gray-300 transition
    ${
      selectedPlan === "premium"
        ? "border-violet-600 ring-2 ring-violet-300"
        : "border-gray-200"
    }
  `}
          >
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-2xl text-gray-900">Premium Plan</h2>

                <div className="flex items-center gap-1 bg-violet-200 text-violet-600 text-xs font-medium px-3 py-1 rounded-full">
                  <FeatherStar className="w-3 h-3" />
                  <span>Popular</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-1">For steady growth.</p>
            </div>

            <p className="text-sm font-medium">You get:</p>

            <div className="flex flex-col gap-3 text-sm text-gray-700">
              {[
                "All Basic features",
                "Case studies and practice sets",
                "Courses and prep guides",
                "Monthly growth reports",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  {/* ✅ Light violet premium-only icon */}
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
                    <FeatherCheck className="text-violet-600 w-3 h-3" />
                  </div>

                  <span className="text-sm text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ CONTINUE BUTTON */}
        <Button
          disabled={!selectedPlan}
          className={`w-full max-w-[820px] h-10 rounded-full font-semibold bg-gray-600 border transition
    ${
      selectedPlan
        ? "bg-violet-600 hover:bg-violet-700 text-white"
        : "bg-gray-700 text-gray-500 cursor-not-allowed"
    }
  `}
          size="large"
          onClick={() =>
            navigate("/job-domain", {
              state: { plan: selectedPlan },
            })
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default Paywall;
