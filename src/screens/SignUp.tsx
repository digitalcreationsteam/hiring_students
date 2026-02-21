"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FeatherBriefcase,
  FeatherCheckCircle,
  FeatherMessageSquare,
  FeatherArrowRight,
} from "@subframe/core";
import { OAuthSocialButton } from "../ui";
import API, { URL_PATH, BASE_URL } from "src/common/API";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// ============================================
// ILLUSTRATION COMPONENTS
// ============================================
const SignUpIllustration = () => (
  <motion.div
    className="w-full h-full flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    style={{
      marginLeft: "-100px",
      paddingLeft: "0px",
      overflow: "visible",
    }}
  >
    <motion.img
      src="/signup-illustration.svg"
      alt="Sign up illustration"
      style={{
        maxWidth: "400px",
        minWidth: "350px",
        width: "100%",
        height: "auto",
      }}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 2, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <defs>
      <style type="text/css">
        {`
            .fil0 {fill:${colors.primary}}
            .fil1 {fill:${colors.accent}}
          `}
      </style>
      {/* Glow filter */}
      <filter id="glow-logo-signup">
        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Background glow circle */}
    <motion.circle
      cx="1351.38"
      cy="1075.72"
      r="900"
      fill={colors.primary}
      opacity="0.08"
      animate={{
        r: [900, 950, 900],
        opacity: [0.08, 0.15, 0.08],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Main logo paths */}
    <motion.g
      id="Layer_1"
      filter="url(#glow-logo-signup)"
      animate={{
        opacity: [0.9, 1, 0.9],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Tower/Structure */}
      <motion.path
        className="fil0"
        d="M1503.38 1106.02l167.67 167.67 0 877.76c-80.54,-84.17 -193.97,-136.59 -319.66,-136.59 -125.69,0 -239.12,52.42 -319.66,136.59l0 -877.76 167.67 -167.67c16.07,10.54 33.3,19.46 51.45,26.52l50.37 87.24 102.17 -0.69 50.38 -87.26c17.48,-6.94 34.09,-15.62 49.62,-25.8zm-154.27 688.26l-91.83 -91.83 -0.62 -5.06c-0.83,-27.22 40.75,-451.48 42.14,-454.25 4.19,-4.5 103.78,-4.31 107.85,-0.17 0.81,1.59 36.95,392.11 39.49,454.29l-97.03 97.03z"
        animate={{
          filter: [
            "drop-shadow(0 0 0px rgba(26, 44, 66, 0))",
            "drop-shadow(0 10px 30px rgba(26, 44, 66, 0.3))",
            "drop-shadow(0 0 0px rgba(26, 44, 66, 0))",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Base shape */}
      <motion.path
        className="fil0"
        d="M-0 1560.43l688.39 0 442.89 -511.4c-32.43,-44.74 -51.56,-99.76 -51.56,-159.24 0,-150.04 121.63,-271.67 271.67,-271.67 150.04,0 271.67,121.63 271.67,271.67 0,59.49 -19.13,114.5 -51.56,159.25l442.89 511.4 688.39 0 -1351.38 -1560.43 -1351.38 1560.43z"
        animate={{
          filter: [
            "drop-shadow(0 0 0px rgba(26, 44, 66, 0))",
            "drop-shadow(0 10px 30px rgba(26, 44, 66, 0.3))",
            "drop-shadow(0 0 0px rgba(26, 44, 66, 0))",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      {/* Center circle - animated to represent new user joining */}
      <motion.path
        className="fil1"
        d="M1351.38 667.45c122.79,0 222.34,99.54 222.34,222.33 0,122.79 -99.55,222.33 -222.34,222.33 -122.78,0 -222.33,-99.54 -222.33,-222.33 0,-122.79 99.55,-222.33 222.33,-222.33z"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "1351.38px 889.78px" }}
      />

      {/* Additional animated elements for signup - representing growth */}
      <motion.circle
        cx="1351.38"
        cy="889.78"
        r="150"
        fill="none"
        stroke={colors.accent}
        strokeWidth="2"
        strokeDasharray="8 8"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformOrigin: "1351.38px 889.78px" }}
      />

      {/* Side accents */}
      <motion.polygon
        className="fil1"
        points="1946.28,1558.95 1713.38,1323.77 1704.55,1553.76"
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.polygon
        className="fil1"
        points="756.5,1558.95 989.39,1323.77 998.22,1553.76"
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
    </motion.g>

    {/* Floating particles - more for signup to show activity */}
    <motion.circle
      cx="500"
      cy="500"
      r="20"
      fill={colors.primary}
      opacity="0.1"
      animate={{
        y: [0, -50, 0],
        x: [0, 30, 0],
        opacity: [0.05, 0.15, 0.05],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.circle
      cx="2200"
      cy="1600"
      r="25"
      fill={colors.accent}
      opacity="0.1"
      animate={{
        y: [0, 50, 0],
        x: [0, -30, 0],
        opacity: [0.05, 0.15, 0.05],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />
    <motion.circle
      cx="1800"
      cy="800"
      r="15"
      fill={colors.primary}
      opacity="0.1"
      animate={{
        y: [0, 40, 0],
        x: [0, -20, 0],
        opacity: [0.05, 0.15, 0.05],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.8,
      }}
    />
  </motion.div>
);

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!firstname.trim()) {
      setError("Please enter your first name.");
      return false;
    }
    if (!lastname.trim()) {
      setError("Please enter your last name.");
      return false;
    }
    if (!password) {
      setError("Please enter a password.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setError("");

    const formData = { email, firstname, lastname, password };

    try {
      const res = await API("POST", URL_PATH.signup, formData);

      if (res?.success) {
        // Store token
        localStorage.setItem("token", res.token);

        // ✅ IMPORTANT: Store userId from response
        // Check different possible paths where userId might be
        const userId =
          res.user?._id || res.user?.id || res.userId || res.data?.user?._id;

        if (userId) {
          localStorage.setItem("userId", userId);
          console.log("✅ UserId stored from signup:", userId);
        } else {
          console.error("❌ No userId in signup response:", res);
          // If userId is missing but we have token, try to extract from token
          try {
            const token = res.token;
            const base64Url = token.split(".")[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const payload = JSON.parse(window.atob(base64));
              const tokenUserId = payload.userId || payload.sub || payload.id;
              if (tokenUserId) {
                localStorage.setItem("userId", tokenUserId);
                console.log("✅ Extracted userId from token:", tokenUserId);
              }
            }
          } catch (e) {
            console.error("❌ Failed to extract userId from token:", e);
          }
        }

        // Store email for verification
        localStorage.setItem("signupEmail", email);

        // Also store user email for later use
        localStorage.setItem("userEmail", email);

        // Store name if available
        if (res.user?.firstname || res.user?.lastname) {
          localStorage.setItem(
            "userName",
            `${res.user?.firstname || firstname} ${res.user?.lastname || lastname}`.trim(),
          );
        }

        console.log("📦 localStorage after signup:", {
          token: !!localStorage.getItem("token"),
          userId: localStorage.getItem("userId"),
          userEmail: localStorage.getItem("userEmail"),
        });

        navigate("/verify-email");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "linkedin") => {
    const baseURL = BASE_URL;
    if (provider === "google") {
      window.location.href = `${baseURL}/auth/google`;
    }
    if (provider === "linkedin") {
      window.location.href = `${baseURL}/auth/linkedin`;
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Minimalistic gradient background */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background: `linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.03) 100%
          )`,
          }}
        />

        {/* Decorative circles */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: colors.primary }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-5"
          style={{ backgroundColor: colors.accent }}
          animate={{ y: [0, 30, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* LEFT - Illustration & Benefits */}
          <motion.div
            className="hidden lg:flex flex-col gap-12"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Illustration */}
            <div className="w-full aspect-square max-w-sm mx-auto">
              <SignUpIllustration />
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              {[
                {
                  icon: FeatherCheckCircle,
                  title: "Verify your skills",
                  desc: "Complete assessments to earn capability scores that employers trust",
                },
                {
                  icon: FeatherBriefcase,
                  title: "Discover matched roles",
                  desc: "Get personalized job recommendations based on your verified abilities",
                },
                {
                  icon: FeatherMessageSquare,
                  title: "Connect with employers",
                  desc: "Receive direct messages from companies looking for your expertise",
                },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill={colors.primary}
                        opacity="0.15"
                      />
                      <path
                        d="M16 10L11 15L8 12"
                        stroke={colors.primary}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="font-medium text-sm"
                      style={{ color: colors.accent }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="text-xs mt-1"
                      style={{ color: colors.neutral[600] }}
                    >
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT - Sign Up Form */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="mb-8">
              <motion.img
                className="h-7 w-32 object-contain mb-6"
                src="/hiringLogo2.png"
                alt="UniTalent logo"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              />
              <div>
                <h1
                  className="text-3xl font-light tracking-tight mb-2"
                  style={{ color: colors.accent }}
                >
                  Create your account
                </h1>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Discover opportunities matched to your verified skills
                </p>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <OAuthSocialButton
                className="w-full h-10 border rounded-lg flex items-center justify-center gap-2 transition hover:opacity-80"
                style={{
                  borderColor: colors.neutral[400],
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417516/shared/z0i3zyjjqkobzuaecgno.svg"
                onClick={() => handleOAuth("google")}
                aria-label="Sign up with Google"
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.neutral[800] }}
                >
                  Google
                </span>
              </OAuthSocialButton>

              <OAuthSocialButton
                className="w-full h-10 border rounded-lg flex items-center justify-center gap-2 transition hover:opacity-80"
                style={{
                  borderColor: colors.neutral[400],
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
                logo="https://res.cloudinary.com/subframe/image/upload/v1763187518/uploads/27890/y6jwljmmuzopthb00ld5.png"
                onClick={() => handleOAuth("linkedin")}
                aria-label="Sign up with LinkedIn"
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.neutral[800] }}
                >
                  LinkedIn
                </span>
              </OAuthSocialButton>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs" style={{ color: colors.neutral[600] }}>
                or continue with email
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="sr-only" htmlFor="signup-email">
                  Email address
                </label>
                <input
                  id="signup-email"
                  inputMode="email"
                  autoComplete="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-11 px-4 rounded-lg border bg-white text-sm outline-none transition"
                  style={{
                    borderColor:
                      focusedField === "email"
                        ? colors.primary
                        : colors.neutral[400],
                    boxShadow:
                      focusedField === "email"
                        ? `0 0 0 3px ${colors.primary}15`
                        : "none",
                  }}
                  aria-required="true"
                  aria-invalid={!!error}
                />
              </motion.div>

              {/* First Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="sr-only" htmlFor="signup-first">
                  First name
                </label>
                <input
                  id="signup-first"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFocusedField("firstname")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-11 px-4 rounded-lg border bg-white text-sm outline-none transition"
                  style={{
                    borderColor:
                      focusedField === "firstname"
                        ? colors.primary
                        : colors.neutral[400],
                    boxShadow:
                      focusedField === "firstname"
                        ? `0 0 0 3px ${colors.primary}15`
                        : "none",
                  }}
                  aria-required="true"
                />
              </motion.div>

              {/* Last Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="sr-only" htmlFor="signup-last">
                  Last name
                </label>
                <input
                  id="signup-last"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setFocusedField("lastname")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-11 px-4 rounded-lg border bg-white text-sm outline-none transition"
                  style={{
                    borderColor:
                      focusedField === "lastname"
                        ? colors.primary
                        : colors.neutral[400],
                    boxShadow:
                      focusedField === "lastname"
                        ? `0 0 0 3px ${colors.primary}15`
                        : "none",
                  }}
                  aria-required="true"
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.45 }}
>
  <label className="sr-only" htmlFor="signup-password">
    Password
  </label>
  <div className="relative">
    <input
      id="signup-password"
      type={showPassword ? "text" : "password"}
      autoComplete="new-password"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onFocus={() => setFocusedField("password")}
      onBlur={() => setFocusedField(null)}
      className="w-full h-11 px-4 pr-12 rounded-lg border bg-white text-sm outline-none transition"
      style={{
        borderColor:
          focusedField === "password"
            ? colors.primary
            : colors.neutral[400],
        boxShadow:
          focusedField === "password"
            ? `0 0 0 3px ${colors.primary}15`
            : "none",
      }}
      aria-required="true"
    />
    
    {/* Eye icon button */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      style={{
        color: focusedField === "password" ? colors.primary : colors.neutral[400],
      }}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        // Eye closed icon (when password is visible)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        // Eye open icon (when password is hidden)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  </div>
  
  {/* Password hint */}
  <p
    className="mt-1 text-xs px-1"
    style={{ color: colors.neutral[600] }}
  >
    Must be at least 8 characters
  </p>
</motion.div>

              {/* Error Message */}
              <motion.div
                className="min-h-5 text-xs rounded-lg p-2"
                style={{
                  color: error ? "#dc2626" : "transparent",
                  backgroundColor: error
                    ? "rgba(220, 38, 38, 0.1)"
                    : "transparent",
                }}
              >
                {error}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-medium rounded-lg text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-70"
                style={{
                  backgroundColor: colors.primary,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <FeatherArrowRight style={{ width: "16", height: "16" }} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <motion.div
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span style={{ color: colors.neutral[600] }}>
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="font-medium transition hover:opacity-80"
                style={{ color: colors.primary }}
              >
                Sign in
              </Link>
            </motion.div>
            {/* Refund Policy Link - Add this new section */}
{/* Policy Links */}
<motion.div
  className="mt-4 text-center text-xs space-x-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.65 }}
>
  <span style={{ color: colors.neutral[400] }}>
    By creating an account, you agree to our{" "}
  </span>
  <Link
    to="/terms-of-service"
    className="font-medium transition hover:opacity-80"
    style={{ color: colors.neutral[500] }}
  >
    Terms of Service
  </Link>
  <span style={{ color: colors.neutral[400] }}>, </span>
  <Link
    to="/privacy-policy"
    className="font-medium transition hover:opacity-80"
    style={{ color: colors.neutral[500] }}
  >
    Privacy Policy
  </Link>
  <span style={{ color: colors.neutral[400] }}>, and </span>
  <Link
    to="/refund-cancellation"
    className="font-medium transition hover:opacity-80"
    style={{ color: colors.neutral[500] }}
  >
    Refund Policy
  </Link>
</motion.div>
          </motion.div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}

export default SignUp;