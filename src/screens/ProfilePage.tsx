"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

import { colors } from "../common/Colors";
import Navbar from "../ui/components/Navbar";
import Footer from "../ui/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/components/Card";
import { Button } from "../ui/components/Button";
import {
  FeatherFolderOpen,
  FeatherUniversity,
  FeatherTool,
  FeatherBriefcase,
  FeatherAward,
  FeatherPlus,
} from "@subframe/core";

function ProfilePage() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const profileSections = [
    {
      label: "Experience",
      sub: "Highlight your roles, responsibilities, and measurable impact",
      icon: <FeatherBriefcase />,
      path: "/experience",
    },
    {
      label: "Projects",
      sub: "Showcase your impactful projects and product outcomes",
      icon: <FeatherFolderOpen />,
      path: "/projects",
    },
    {
      label: "Education",
      sub: "Update your educational background and achievements",
      icon: <FeatherUniversity />,
      path: "/education",
    },
    {
      label: "Certifications",
      sub: "Add relevant certifications to validate your expertise",
      icon: <FeatherTool />,
      path: "/certifications",
    },
    {
      label: "Awards",
      sub: "Highlight awards, recognitions, or notable activities",
      icon: <FeatherAward />,
      path: "/awards",
    },
    {
      label: "Skills",
      sub: "List your product management and technical skills",
      icon: <FeatherTool />,
      path: "/skills",
    },
  ];

  return (
    <div
      style={{
        background: `linear-gradient(
          to bottom,
          #d9d9d9 0%,
          #cfd3d6 25%,
          #9aa6b2 55%,
          #2E4056 100%
        )`,
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
      className="w-full relative"
    >
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 
            className="text-2xl md:text-4xl font-bold mb-2 md:mb-4"
            style={{ color: colors.accent }}
          >
            Complete Your Profile
          </h1>
          <p className="text-sm md:text-base max-w-2xl mx-auto px-4" style={{ color: colors.accent }}>
            Build a compelling professional story that stands out to recruiters
          </p>
        </div>

        {/* Profile Sections Grid */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {profileSections.map((item, index) => (
              <Card
                key={index}
                style={{ border: `1.5px solid ${colors.primaryGlow}` }}
                className="border bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Icon */}
                    <div
                      className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: colors.secondary,
                        color: colors.white,
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm md:text-base font-medium" style={{ color: colors.accent }}>
                        {item.label}
                      </h3>
                      <p className="mt-1 text-xs leading-4 md:text-sm" style={{ color: colors.secondary }}>
                        {item.sub}
                      </p>
                      
                      {/* Status Badge - Using your colors */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
                        <span className="text-xs" style={{ color: colors.accent }}>
                          Not started
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleNavigate(item.path)}
                    className="mt-4 w-full rounded-xl py-2.5 md:py-3 text-xs md:text-sm font-medium transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.white,
                    }}
                  >
                    + Add {item.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProfilePage;
