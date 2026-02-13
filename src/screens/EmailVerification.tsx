"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Button } from "../ui/components/Button";
import { IconWithBackground } from "../ui/components/IconWithBackground";
import { FeatherClock, FeatherMailCheck } from "@subframe/core";

import API, { URL_PATH } from "src/common/API";
import { colors } from "src/common/Colors";
import Footer from "../ui/components/Footer";



function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  
  const INITIAL = 30;
  const timerRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState<number>(INITIAL);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // ----------------- Countdown Timer -----------------
  const startTimer = (startFrom = INITIAL) => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setCountdown(startFrom);
    setCanResend(false);
    setStatusMessage("");

    timerRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    setCanResend(countdown <= 0);
  }, [countdown]);

  useEffect(() => {
    startTimer(INITIAL);
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------- Verify via token -----------------
  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await API("GET", `${URL_PATH.verifyEmail}/${token}`);
        if (res.success) {
          setStatusMessage("Email verified. Redirecting...");
          setTimeout(() => navigate("/talent-ranking"), 1500);
        } else {
          setStatusMessage("Invalid or expired link.");
        }
      } catch {
        setStatusMessage("Invalid or expired link.");
      }
    };

    verify();
  }, [token, navigate]);

  // ----------------- Resend Verification Email -----------------
  const handleResend = async () => {
    setIsSending(true);
    try {
      await API("POST", URL_PATH.resendVerification, {
        email: localStorage.getItem("signupEmail"),
      });
      setStatusMessage("Verification email sent again");
      startTimer(INITIAL);
    } catch {
      setStatusMessage("Failed to resend email");
    } finally {
      setIsSending(false);
    }
  };

  // ----------------- Polling to auto redirect when verified -----------------
 // ----------------- Polling to auto redirect when verified -----------------
useEffect(() => {
  let intervalId: NodeJS.Timeout;

  const pollVerification = async () => {
    intervalId = setInterval(async () => {
      try {
        const res = await API("GET", URL_PATH.checkEmailVerification);
        // ✅ Use the correct property name
        if (res?.success && res.isVerified) {
          clearInterval(intervalId); // stop polling
          navigate("/talent-ranking"); // redirect
        }
      } catch (err) {
        console.error("Error checking verification:", err);
      }
    }, 2000); // check every 5s
  };

  pollVerification();

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [navigate]);


return (
  <div className="flex min-h-screen w-full items-center justify-center py-12 px-4 relative">

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
    
      <div className="w-full max-w-md flex flex-col items-center gap-4 rounded-3xl border border-neutral-border bg-white px-7 py-12 shadow-[0_6px_20px_rgba(15,15,15,0.05)]">
<IconWithBackground
  size="large"
  icon={<FeatherMailCheck className="w-4 h-4" style={{ color: colors.primary }} />}
  className="!rounded-full !p-2"
  style={{ backgroundColor: `${colors.primary}1A` }} // light tint (10% approx)
 />


        <div className="flex flex-col items-center gap-1 text-center px-2">
          <span className="text-lg font-semibold" style={{ color: colors.accent }}>
  Check your email
</span>

          <span className="text-[14px] text-neutral-500">
            We sent a verification link to your email address. Click the link to
            activate your recruiter account.
          </span>
        </div>

        <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

        <div className="flex w-full flex-col items-center gap-2 text-center px-2">
          <span className="text-[13px] text-neutral-400">
            Didn't receive the email? Check your spam folder or request a new
            link.
          </span>

<Button
  className="h-10 w-full rounded-2xl transition-all duration-150"
  style={{
    backgroundColor: canResend ? `${colors.primary}1A` : `${colors.primary}0D`,
    color: canResend ? colors.accent : `${colors.accent}B3`,
    boxShadow: canResend ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
  }}
  variant="brand-secondary"
  size="small"
  onClick={handleResend}
  disabled={!canResend || isSending}
  aria-disabled={!canResend || isSending}
>
  {isSending ? "Sending..." : "Resend verification link"}
</Button>


          <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
            <FeatherClock className="w-4 h-4" />
            <span>
              You can request a new link in {countdown} second
              {countdown !== 1 ? "s" : ""}
            </span>
          </div>

          {statusMessage && (
            <div
              className="text-xs text-neutral-600 mt-1"
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
