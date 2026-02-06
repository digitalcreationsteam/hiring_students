"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FeatherBriefcase,
  FeatherCheckCircle,
  FeatherMessageSquare,
} from "@subframe/core";
import { IconWithBackground, OAuthSocialButton, TextField } from "../ui";
import API, { URL_PATH } from "src/common/API";

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");

const checkEmailVerification = async () => {
  try {
    const res = await API("GET", "/auth/verification-status");
    return res?.isVerified;
  } catch {
    return false;
  }
};


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    setError("");

    if (!email.trim()) return setError("Please enter your email.");
    if (!emailRegex.test(email)) return setError("Please enter a valid email.");
    if (!firstname.trim()) return setError("Please enter your first name.");
    if (!lastname.trim()) return setError("Please enter your last name.");
    if (!password) return setError("Please enter a password.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");

    return true;
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();
  if (loading) return;
  if (!validate()) return;

  setLoading(true);
  setError("");

  const formData = { email, firstname, lastname, password,  role  };

  try {
    const res = await API("POST", URL_PATH.signup, formData);

    if (res?.success) {
      // ✅ store token
      localStorage.setItem("token", res.token);
      localStorage.setItem("signupEmail", email);

      // Redirect immediately to verify-email page
     if (res?.success) {
  localStorage.setItem("token", res.token);
  localStorage.setItem("signupEmail", email);

  // ✅ store role too (optional but useful)
  localStorage.setItem("role", role);

  // ✅ redirect based on role
  if (role === "admin") return navigate("/admin/dashboard");
  if (role === "recruiter") return navigate("/recruiter/dashboard");

  // student default flow
  return navigate("/verify-email");
}

    }
  } catch (err: any) {
    setError(err?.message || "Unable to create account. Please try again.");
  } finally {
    setLoading(false);
  }
};


// // ✅ Polling helper function
// const pollEmailVerification = async (interval: number, timeout: number) => {
//   const start = Date.now();

//   return new Promise<boolean>(async (resolve) => {
//     const check = async () => {
//       try {
//         const verified = await checkEmailVerification();
//         if (verified) return resolve(true);
//         if (Date.now() - start > timeout) return resolve(false); // stop after timeout
//         setTimeout(check, interval); // try again after interval
//       } catch {
//         if (Date.now() - start > timeout) return resolve(false);
//         setTimeout(check, interval);
//       }
//     };
//     check();
//   });
// };


  const handleOAuth = (provider: any) => {
    const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    if (provider === "google") {
      window.location.href = `${baseURL}/auth/google`;
    }
    if (provider === "linkedin") {
      window.location.href = `${baseURL}/auth/linkedin`;
    }
  };



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-[870px] rounded-xl border border-neutral-border bg-white shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full relative">
          {/* LEFT */}
          <div className="lg:w-[64%] bg-neutral-50 px-6 py-8 flex flex-col justify-between hidden lg:flex">
            <div className="flex flex-col gap-4">
              <img
                className="h-8 w-fit"
                src="/hiringLogo.png"
                alt="logo"
              />
              <h1 className="text-3xl leading-snug inter-font-family">
                Everything you need to find your next role
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-full h-[1px] bg-gray-400 my-4 flex-shrink-0" />

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100">
                    <FeatherCheckCircle className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">Verify your skills</p>
                    <p className="text-xs text-gray-500">
                      Complete assessments to earn capability scores that
                      employers trust
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100">
                    <FeatherBriefcase className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">
                      Discover matched roles
                    </p>
                    <p className="text-xs text-gray-500">
                      Get personalized job recommendations based on your
                      verified abilities
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100">
                    <FeatherMessageSquare className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">
                      Connect with employers
                    </p>
                    <p className="text-xs text-gray-500">
                      Receive direct messages from companies looking for your
                      expertise
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERTICAL LINE */}
          <div className="hidden lg:block w-[1px] bg-gray-300" />

          {/* RIGHT */}
          <div className="w-full lg:w-1/2 px-6 py-8 flex flex-col gap-4 bg-white min-h-[620px] overflow-y-auto">
            <div>
              <h2 className="text-[22px]">Create your account</h2>
              <p className="text-xs text-subtext-color">
                Discover opportunities matched to your verified skills
              </p>
            </div>

            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

            <div className="flex flex-col gap-2">
              <OAuthSocialButton
                className="w-full h-9 border border-gray-400 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417516/shared/z0i3zyjjqkobzuaecgno.svg"
                onClick={() => handleOAuth("google")}
                aria-label="Sign up with Google"
              >
                Sign up with Google
              </OAuthSocialButton>

              <OAuthSocialButton
                className="w-full h-9 mt-2 border border-gray-400 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
                logo="https://res.cloudinary.com/subframe/image/upload/v1763187518/uploads/27890/y6jwljmmuzopthb00ld5.png"
                onClick={() => handleOAuth("linkedin")}
                aria-label="Sign up with LinkedIn"
              >
                Sign up with LinkedIn
              </OAuthSocialButton>
            </div>

            <div className="flex items-center w-full my-4">
              <div className="flex-1 h-[1px] bg-gray-300" />
              <span className="px-2 text-xs text-gray-500 whitespace-nowrap">
                or continue with email
              </span>
              <div className="flex-1 h-[1px] bg-gray-300" />
            </div>

            <form
              className="flex flex-col gap-3 text-sm"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1 block text-xs text-neutral-700"
                >
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                  aria-required="true"
                />
              </div>

              {/* First + Last name */}
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label
                    htmlFor="signup-first"
                    className="mb-1 block text-xs text-neutral-700"
                  >
                    First name
                  </label>
                  <input
                    id="signup-first"
                    placeholder="Alex"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-8 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                    aria-required="true"
                  />
                </div>

                <div className="w-1/2">
                  <label
                    htmlFor="signup-last"
                    className="mb-1 block text-xs text-neutral-700"
                  >
                    Last name
                  </label>
                  <input
                    id="signup-last"
                    placeholder="Rivera"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-8 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-1 block text-xs  text-neutral-700"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                  aria-required="true"
                />
                {/* Supportive text (SC1 style) */}
                <p className="ml-3 mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>



              {/* Error */}
              <div
                aria-live="polite"
                className="min-h-[1.25rem] text-xs text-red-600"
              >
                {error}
              </div>

              


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-9 text-white font-semibold rounded-full transition ${
                  loading
                    ? "bg-violet-900 cursor-wait"
                    : "bg-violet-700 hover:bg-violet-800"
                }`}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

            <div className="flex justify-center gap-1 text-xs">
              <span className="text-subtext-color">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="text-violet-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
