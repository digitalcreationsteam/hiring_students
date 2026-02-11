"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";
import { FeatherLogOut, FeatherSettings, FeatherUser } from "@subframe/core";

export default function HeaderLogo() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-8">

        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src="/hiringLogo2.png"
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Navbar Items */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:text-black transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="hover:text-black transition"
          >
            Jobs
          </button>

          <button
            onClick={() => navigate("/candidates")}
            className="hover:text-black transition"
          >
            Candidates
          </button>

          <button
            onClick={() => navigate("/reports")}
            className="hover:text-black transition"
          >
            Reports
          </button>
        </nav>
      </div>

      {/* RIGHT SECTION - PROFILE */}
      <div className="relative z-50">
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer"
        >
          <Avatar
            image="/profile-photo.jpg"
            square
            size="medium"
          />
        </div>

        {/* {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
            <button
              onClick={() => navigate("/my-profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              My Profile
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </button>
          </div>
        )} */}
        {open && (
  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">

    <button
      onClick={() => navigate("/my-profile")}
      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
    >
      <FeatherUser />
      My Profile
    </button>

    <button
      onClick={() => navigate("/settings")}
      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
    >
      <FeatherSettings />
      Settings
    </button>

    {/* Divider */}
    <div className="border-t my-1"></div>

    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600"
    >
      <FeatherLogOut />
      Logout
    </button>

  </div>
)}


      </div>
    </header>
  );
}
