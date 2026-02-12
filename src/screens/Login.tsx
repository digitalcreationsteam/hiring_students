// components/Login.tsx
// ⭐ REPLACE YOUR ENTIRE LOGIN FILE WITH THIS

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FeatherBriefcase,
  FeatherCheckCircle,
  FeatherMessageSquare,
} from "@subframe/core";
import { OAuthSocialButton } from "../ui";
import API, { URL_PATH, BASE_URL } from "src/common/API";
import { useAppDispatch } from "src/store/hooks";
import { setToken } from "src/store/slices/authSlice";
import { setUserProfile } from "src/store/slices/userSlice";
import { setNavigation } from "src/store/slices/onboardingSlice"; // ✅ NEW
import { colors } from "src/common/Colors";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation
  const validate = () => {
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Please enter your password.");
      return false;
    }
    // if (password.length < 6) {
    //   setError("Password must be at least 6 characters.");
    //   return false;
    // }
    return true;
  };

  // Handle login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const response = await API("POST", URL_PATH.login, {
        email,
        password,
      });

      if (!response?.success) {
      setError("Invalid credentials. Please try again.");
      return;
    }

       // 🔐 ROLE CHECK (CRITICAL)
    if (response.user.role !== "student") {
      setError("You are not authorized as student");
      return;
    }

      if (response?.success) {
        dispatch(setToken(response.token));
        dispatch(setUserProfile(response.user));
        // Backend login now includes navigation object
        if (response.navigation) {
          dispatch(
            setNavigation({
              nextRoute: response.navigation.nextRoute,
              currentStep: response.navigation.currentStep,
              completedSteps: response.navigation.completedSteps,
              isOnboardingComplete: response.navigation.isOnboardingComplete,
              hasPayment: response.navigation.hasPayment,
            }),
          );

          const completedSteps = response.navigation.completedSteps || [];
          const isFirstLogin = completedSteps.length === 0;

          if (isFirstLogin) {
            navigate("/talent-ranking");
          } else {
            navigate(response.navigation.nextRoute);
          }
        } else {
          navigate("/talent-ranking");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "linkedin") => {
    const baseURL =  BASE_URL; //process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    if (provider === "google") {
      window.location.href = `${baseURL}/auth/google`;
    }
    if (provider === "linkedin") {
      window.location.href = `${baseURL}/auth/linkedin`;
    }
  };

  return (
  <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 relative">

    {/* 🌈 Blended background - fixed behind everything */}
    <div className="pointer-events-none fixed inset-0 -z-10">
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
      <div className="w-full max-w-[870px] rounded-none sm:rounded-xl border border-neutral-border bg-white shadow-sm sm:shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full relative">
          {/* LEFT */}
          <div className="w-full lg:w-[64%] bg-neutral-50 px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <img
                className="h-8 w-fit"
                src="/hiringLogo2.png"
                alt="Company logo"
              />
              <h1 className="text-3xl leading-snug inter-font-family">
                Welcome back to your career journey
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-full h-[1px] bg-gray-400 my-4 flex-shrink-0" />
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div style={{backgroundColor: colors.primary, color: colors.white}} className="flex items-center justify-center w-8 h-8 rounded-full">
                    <FeatherCheckCircle className="" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">Access your profile</p>
                    <p className="text-xs text-gray-500">
                      View and update your professional profile, skills, and
                      experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{backgroundColor: colors.primary, color: colors.white}}  className="flex items-center justify-center w-8 h-8 rounded-full">
                    <FeatherBriefcase className="" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">Manage applications</p>
                    <p className="text-xs text-gray-500">
                      Track your job applications and see real-time status
                      updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{backgroundColor: colors.primary, color: colors.white}}  className="flex items-center justify-center w-8 h-8 rounded-full">
                    <FeatherMessageSquare className="" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">Check messages</p>
                    <p className="text-xs text-gray-500">
                      Stay connected with employers and respond to opportunities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERTICAL LINE */}
          <div className="hidden lg:block w-[1px] bg-gray-300" />

          {/* RIGHT */}
          <div className="w-full lg:w-1/2 px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-4 bg-white min-h-0">
            <div>
              <h2 className="text-[22px]">Sign in to your account</h2>
              <p className="text-xs text-subtext-color">
                Welcome back! Sign in to access your job applications and
                profile
              </p>
            </div>

            <div className="w-full h-[1px] bg-gray-400 my-4 flex-shrink-0" />

            <div className="flex flex-col gap-2">
              <OAuthSocialButton
                className="w-full h-10 sm:h-9 border border-gray-400 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417516/shared/z0i3zyjjqkobzuaecgno.svg"
                onClick={() => handleOAuth("google")}
                aria-label="Log in with Google"
              >
                Log in with Google
              </OAuthSocialButton>

              <OAuthSocialButton
                className="w-full h-10 sm:h-9 border border-gray-400 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
                logo="https://res.cloudinary.com/subframe/image/upload/v1763187518/uploads/27890/y6jwljmmuzopthb00ld5.png"
                onClick={() => handleOAuth("linkedin")}
                aria-label="Log in with LinkedIn"
              >
                Log in with LinkedIn
              </OAuthSocialButton>
            </div>

            <div className="flex items-center w-full my-4">
              <div className="flex-1 h-[1px] bg-gray-400" />
              <span className="px-2 text-xs text-gray-500 whitespace-nowrap">
                or continue with email
              </span>
              <div className="flex-1 h-[1px] bg-gray-400" />
            </div>

            {/* FORM */}
            <form
              className="flex flex-col gap-3 text-sm"
              onSubmit={handleSubmit}
              noValidate
            >
              <label className="sr-only" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                inputMode="email"
                autoComplete="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                aria-required="true"
                aria-invalid={!!error}
              />

              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                aria-required="true"
              />

              <div className="flex justify-between items-center">
                <div />
                <Link
                  to="/forgot-password"
                  className="text-xs hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* error message */}
              <div
                aria-live="polite"
                className="min-h-[1.25rem] text-xs text-red-600"
              >
                {error}
              </div>

              {/* <button
                type="submit"
                disabled={loading}
                className={`w-full h-9 text-white font-semibold rounded-full transition ${
                  loading
                    ? "bg-violet-400 cursor-wait"
                    : "bg-violet-600 hover:bg-violet-700"
                }`}
              >
                {loading ? "Signing in..." : "Log in"}
              </button> */}
              <button
  type="submit"
  disabled={loading}
  className={`w-full h-9 font-semibold rounded-full transition ${
    loading ? "cursor-wait opacity-70" : "hover:opacity-90"
  }`}
  style={{
    backgroundColor: colors.primary,
    color: colors.white,
  }}
>
  {loading ? "Signing in..." : "Log in"}
</button>

            </form>

            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

            <div className="flex flex-wrap justify-center gap-1 text-xs text-center">
              <span className="text-subtext-color">Don't have an account?</span>
              <Link
                to="/signup"
                className="font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
