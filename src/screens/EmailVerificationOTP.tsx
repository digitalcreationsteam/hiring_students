// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Button } from "../ui/components/Button";
// import { IconWithBackground } from "../ui/components/IconWithBackground";
// import {
//   FeatherClock,
//   FeatherMailCheck,
//   FeatherAlertCircle,
//   FeatherCheckCircle,
//   FeatherArrowRight,
// } from "@subframe/core";
// import API, { URL_PATH } from "src/common/API";
// import { colors } from "src/common/Colors";
// import Navbar from "src/ui/components/Navbar";
// import Footer from "../ui/components/Footer";

// // ============================================
// // ILLUSTRATION COMPONENT
// // ============================================
// const VerifyIllustration = () => (
//   <motion.div
//     className="w-full h-full flex items-center justify-center"
//     initial={{ opacity: 0, scale: 0.9 }}
//     animate={{ opacity: 1, scale: 1 }}
//     transition={{ duration: 0.8 }}
//   >
//     <motion.svg
//       width="100%"
//       height="100%"
//       viewBox="0 0 300 300"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{ maxWidth: "280px" }}
//       animate={{
//         y: [0, -10, 0],
//       }}
//       transition={{
//         duration: 4,
//         repeat: Infinity,
//         ease: "easeInOut",
//       }}
//     >
//       {/* Background glow */}
//       <circle cx="150" cy="150" r="120" fill={colors.primary} opacity="0.05" />

//       {/* Email icon */}
//       <rect
//         x="90"
//         y="100"
//         width="120"
//         height="80"
//         rx="12"
//         fill="white"
//         stroke={colors.primary}
//         strokeWidth="2"
//         strokeOpacity="0.3"
//       />
//       <path
//         d="M90 110 L150 160 L210 110"
//         stroke={colors.primary}
//         strokeWidth="2"
//         strokeOpacity="0.5"
//         fill="none"
//       />

//       {/* Checkmark that appears */}
//       <motion.circle
//         cx="210"
//         cy="170"
//         r="20"
//         fill={colors.primary}
//         opacity="0.1"
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         transition={{ delay: 0.5, duration: 0.5 }}
//       />
//       <motion.path
//         d="M200 170 L207 177 L220 160"
//         stroke={colors.primary}
//         strokeWidth="3"
//         strokeLinecap="round"
//         initial={{ pathLength: 0 }}
//         animate={{ pathLength: 1 }}
//         transition={{ delay: 0.8, duration: 0.5 }}
//       />
//     </motion.svg>
//   </motion.div>
// );

// // ============================================
// // BACKGROUND GLASS
// // ============================================
// const BackgroundGlass = () => (
//   <div className="fixed inset-0 pointer-events-none">
//     <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
//     <div className="absolute inset-0 bg-white/20 backdrop-blur-[150px]" />
//   </div>
// );

// // ============================================
// // MAIN COMPONENT
// // ============================================
// function EmailVerification() {
//   const navigate = useNavigate();
//   const { token } = useParams();

//   const INITIAL = 30;
//   const timerRef = useRef<number | null>(null);
//   const [countdown, setCountdown] = useState<number>(INITIAL);
//   const [canResend, setCanResend] = useState<boolean>(false);
//   const [isSending, setIsSending] = useState<boolean>(false);
//   const [statusMessage, setStatusMessage] = useState<string>("");
//   const [verificationStatus, setVerificationStatus] = useState<
//     "idle" | "verifying" | "success" | "error"
//   >("idle");

//   const email = localStorage.getItem("signupEmail") || "";

//   // ----------------- Countdown Timer -----------------
//   const startTimer = (startFrom = INITIAL) => {
//     if (timerRef.current !== null) {
//       window.clearInterval(timerRef.current);
//       timerRef.current = null;
//     }

//     setCountdown(startFrom);
//     setCanResend(false);

//     timerRef.current = window.setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           if (timerRef.current !== null) {
//             window.clearInterval(timerRef.current);
//             timerRef.current = null;
//           }
//           setCanResend(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   useEffect(() => {
//     setCanResend(countdown <= 0);
//   }, [countdown]);

//   useEffect(() => {
//     startTimer(INITIAL);
//     return () => {
//       if (timerRef.current !== null) {
//         window.clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//     };
//   }, []);

//   // ----------------- Verify via token -----------------
//   useEffect(() => {
//     if (!token) return;

//     const verifyEmail = async () => {
//       setVerificationStatus("verifying");
//       try {
//         const res = await API("GET", `${URL_PATH.verifyEmail}/${token}`);

//         if (res?.success) {
//           setVerificationStatus("success");
//           setStatusMessage("Email verified successfully! Redirecting...");

//           // Clear signup email from localStorage
//           localStorage.removeItem("signupEmail");

//           // Redirect to success page after 2 seconds
//           setTimeout(() => {
//             navigate("/email-verified-success");
//           }, 2000);
//         } else {
//           setVerificationStatus("error");
//           setStatusMessage(
//             res?.message || "Invalid or expired verification link",
//           );
//         }
//       } catch (err: any) {
//         setVerificationStatus("error");
//         setStatusMessage(
//           err?.message || "Verification failed. Please try again.",
//         );
//       }
//     };

//     verifyEmail();
//   }, [token, navigate]);

//   // ----------------- Polling to check verification status -----------------
//   useEffect(() => {
//     // Don't poll if we're already verifying via token or already verified
//     if (token || verificationStatus === "success") return;

//     let intervalId: NodeJS.Timeout;

//     const checkVerification = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const userId = localStorage.getItem("userId");

//         if (!token || !userId) return;

//         const res = await API(
//           "GET",
//           URL_PATH.checkEmailVerification,
//           undefined,
//           {
//             "user-id": userId,
//             Authorization: `Bearer ${token}`,
//           },
//         );

//         if (res?.success && res.isVerified) {
//           clearInterval(intervalId);
//           localStorage.removeItem("signupEmail");
//           navigate("/email-verified-success");
//         }
//       } catch (err) {
//         console.error("Error checking verification:", err);
//       }
//     };

//     intervalId = setInterval(checkVerification, 3000);

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [navigate, token, verificationStatus]);

//   // ----------------- Resend Verification Email -----------------
//   const handleResend = async () => {
//     if (!email) {
//       setStatusMessage("Email not found. Please sign up again.");
//       return;
//     }

//     setIsSending(true);
//     try {
//       const res = await API("POST", URL_PATH.resendVerification, { email });

//       if (res?.success) {
//         setStatusMessage("Verification email sent again! Check your inbox.");
//         startTimer(INITIAL);
//       } else {
//         setStatusMessage(res?.message || "Failed to resend email");
//       }
//     } catch (err: any) {
//       setStatusMessage(err?.message || "Failed to resend email");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   // If verifying via token
//   if (token) {
//     return (
//       <>
//         <Navbar />
//         <BackgroundGlass />
//         <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
//             {verificationStatus === "verifying" && (
//               <>
//                 <div className="flex justify-center mb-6">
//                   <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
//                 </div>
//                 <h2 className="text-2xl font-light mb-2">
//                   Verifying your email...
//                 </h2>
//                 <p className="text-gray-500">
//                   Please wait while we verify your email address.
//                 </p>
//               </>
//             )}

//             {verificationStatus === "success" && (
//               <>
//                 <div className="flex justify-center mb-6">
//                   <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
//                     <FeatherCheckCircle className="w-10 h-10 text-green-500" />
//                   </div>
//                 </div>
//                 <h2 className="text-2xl font-light mb-2">Email Verified!</h2>
//                 <p className="text-gray-500 mb-4">{statusMessage}</p>
//               </>
//             )}

//             {verificationStatus === "error" && (
//               <>
//                 <div className="flex justify-center mb-6">
//                   <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
//                     <FeatherAlertCircle className="w-10 h-10 text-red-500" />
//                   </div>
//                 </div>
//                 <h2 className="text-2xl font-light mb-2">
//                   Verification Failed
//                 </h2>
//                 <p className="text-gray-500 mb-4">{statusMessage}</p>
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   Back to Sign Up
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Default verify email page (no token)
//   return (
//     <>
//       <Navbar />
//       <BackgroundGlass />

//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
//         <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left - Illustration */}
//           <motion.div
//             className="hidden lg:flex justify-center"
//             initial={{ opacity: 0, x: -40 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="w-full max-w-md">
//               <VerifyIllustration />
//             </div>
//           </motion.div>

//           {/* Right - Content */}
//           <motion.div
//             className="w-full max-w-md mx-auto"
//             initial={{ opacity: 0, x: 40 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="bg-white rounded-2xl p-8 shadow-xl">
//               <div className="flex justify-center mb-6">
//                 <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
//                   <FeatherMailCheck
//                     className="w-8 h-8"
//                     style={{ color: colors.primary }}
//                   />
//                 </div>
//               </div>

//               <h1
//                 className="text-2xl font-light text-center mb-2"
//                 style={{ color: colors.accent }}
//               >
//                 Check your email
//               </h1>

//               <p className="text-sm text-gray-500 text-center mb-6">
//                 We sent a verification link to{" "}
//                 <strong>{email || "your email"}</strong>. Click the link to
//                 activate your account.
//               </p>

//               <div className="space-y-4">
//                 <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
//                   <p className="font-medium mb-1">
//                     📧 Didn't receive the email?
//                   </p>
//                   <p>
//                     Check your spam folder or click the button below to resend.
//                   </p>
//                 </div>

//                 <button
//                   onClick={handleResend}
//                   disabled={!canResend || isSending}
//                   className="w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40"
//                   style={{
//                     backgroundColor: canResend
//                       ? colors.primary
//                       : colors.neutral[100],
//                     color: canResend ? "white" : colors.neutral[400],
//                   }}
//                 >
//                   {isSending ? "Sending..." : "Resend verification email"}
//                 </button>

//                 <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
//                   <FeatherClock className="w-4 h-4" />
//                   <span>
//                     Resend available in {countdown} second
//                     {countdown !== 1 ? "s" : ""}
//                   </span>
//                 </div>

//                 {statusMessage && (
//                   <div
//                     className="text-sm text-center p-2 rounded-lg"
//                     style={{
//                       backgroundColor: statusMessage.includes("success")
//                         ? colors.primary + "10"
//                         : "#fee2e2",
//                       color: statusMessage.includes("success")
//                         ? colors.primary
//                         : "#dc2626",
//                     }}
//                   >
//                     {statusMessage}
//                   </div>
//                 )}

//                 <div className="pt-4 text-center">
//                   <button
//                     onClick={() => navigate("/signup")}
//                     className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     ← Back to Sign Up
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }

// export default EmailVerification;
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FeatherMail,
  FeatherCheckCircle,
  FeatherAlertCircle,
  FeatherClock,
  FeatherArrowRight,
  FeatherRefreshCw,
} from "@subframe/core";
import API, { URL_PATH } from "../common/API";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// ============================================
// OTP INPUT COMPONENT
// ============================================
const OTPInput = ({
  value,
  onChange,
  onComplete,
}: {
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete: (otp: string) => void;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) return; // Only allow single digit

    const newOtp = [...value];
    newOtp[index] = digit;
    onChange(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every((d) => d !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("");
    const newOtp = [...value];

    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    onChange(newOtp);

    if (digits.length === 6) {
      onComplete(digits.join(""));
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            borderColor: digit ? colors.primary : colors.neutral[400],
            boxShadow: digit ? `0 0 0 2px ${colors.primary}20` : "none",
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// ILLUSTRATION COMPONENT
// ============================================
const OTPIllustration = () => (
  <motion.div
    className="w-full h-full flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
  >
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "280px" }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Background glow */}
      <circle cx="150" cy="150" r="120" fill={colors.primary} opacity="0.05" />

      {/* Phone/Screen */}
      <rect
        x="90"
        y="80"
        width="120"
        height="140"
        rx="16"
        fill="white"
        stroke={colors.primary}
        strokeWidth="2"
        strokeOpacity="0.3"
      />

      {/* Screen content - OTP dots */}
      <circle cx="120" cy="130" r="8" fill={colors.primary} opacity="0.3" />
      <circle cx="150" cy="130" r="8" fill={colors.primary} opacity="0.5" />
      <circle cx="180" cy="130" r="8" fill={colors.primary} opacity="0.7" />
      <circle cx="120" cy="160" r="8" fill={colors.primary} opacity="0.7" />
      <circle cx="150" cy="160" r="8" fill={colors.primary} opacity="0.5" />
      <circle cx="180" cy="160" r="8" fill={colors.primary} opacity="0.3" />

      {/* Envelope/Message icon */}
      <path
        d="M120 190 L150 210 L180 190"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        strokeOpacity="0.5"
      />
    </motion.svg>
  </motion.div>
);

// ============================================
// BACKGROUND GLASS
// ============================================
const BackgroundGlass = () => (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
    <div className="absolute inset-0 bg-white/20 backdrop-blur-[150px]" />
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
function EmailVerificationOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = localStorage.getItem("signupEmail") || "";

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Handle OTP verification
  const handleVerifyOTP = async (otpString: string) => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await API("POST", URL_PATH.verifyOTP, {
        email,
        otp: otpString,
      });

      if (response?.success) {
        setSuccess("Email verified successfully!");

        // Clear signup email from localStorage
        localStorage.removeItem("signupEmail");

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate("/email-verified-success");
        }, 2000);
      } else {
        setError(response?.message || "Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please try again.");
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      const response = await API("POST", URL_PATH.resendOTP, { email });

      if (response?.success) {
        setSuccess("New OTP sent to your email!");
        setCanResend(false);
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(response?.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <BackgroundGlass />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Illustration */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full max-w-md">
              <OTPIllustration />
            </div>
          </motion.div>

          {/* Right - OTP Form */}
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <FeatherMail
                      className="w-8 h-8"
                      style={{ color: colors.primary }}
                    />
                  </div>
                </div>

                <h1
                  className="text-2xl font-light mb-2"
                  style={{ color: colors.accent }}
                >
                  Verify Your Email
                </h1>

                <p className="text-sm text-gray-500">
                  We've sent a 6-digit OTP to <strong>{email}</strong>
                </p>
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2"
                >
                  <FeatherAlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center gap-2"
                >
                  <FeatherCheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}

              {/* Verify Button */}
              <button
                onClick={() => {
                  const otpString = otp.join("");
                  if (otpString.length === 6) {
                    handleVerifyOTP(otpString);
                  } else {
                    setError("Please enter complete 6-digit OTP");
                  }
                }}
                disabled={loading || otp.some((d) => d === "")}
                className="w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40 mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <FeatherArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Didn't receive the OTP?
                </p>

                <button
                  onClick={handleResendOTP}
                  disabled={!canResend || resendLoading}
                  className="text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-40"
                  style={{
                    color: canResend ? colors.primary : colors.neutral[400],
                  }}
                >
                  <FeatherRefreshCw
                    className={`w-4 h-4 ${resendLoading ? "animate-spin" : ""}`}
                  />
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>

                {!canResend && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
                    <FeatherClock className="w-3 h-3" />
                    <span>Resend available in {countdown}s</span>
                  </div>
                )}
              </div>

              {/* Back to Sign Up */}
              <div className="mt-6 pt-4 text-center border-t border-gray-100">
                <button
                  onClick={() => navigate("/signup")}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ← Use different email
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EmailVerificationOTP;
