import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import API, { URL_PATH } from "../common/API";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";
import { FeatherArrowLeft, FeatherMail, FeatherLock, FeatherCheckCircle} from "@subframe/core";

// ============================================
// ENHANCED BACKGROUND GLASS LAYER
// ============================================
const BackgroundGlass: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
    <div className="absolute inset-0 bg-white/20 backdrop-blur-[150px]" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10" />
  </div>
);

// ============================================
// ANIMATED ILLUSTRATION COMPONENT
// ============================================
const VerifyCodeIllustration: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="w-full flex justify-center mb-8"
  >
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative"
    >
      {/* Main illustration container */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
        {/* Background glow circles */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Check Circle icon with pulse animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}30, ${colors.primary}10)`,
              border: `2px solid ${colors.primary}40`,
              backdropFilter: "blur(10px)",
            }}
          >
            <FeatherCheckCircle
              style={{
                color: colors.primary,
                width: 40,
                height: 40,
              }}
            />
          </div>
        </motion.div>

        {/* Floating email icons */}
        <motion.div
          className="absolute -top-4 -right-4"
          animate={{
            y: [0, -8, 0],
            x: [0, 5, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}30, ${colors.secondary}10)`,
              border: `1px solid ${colors.secondary}40`,
              backdropFilter: "blur(10px)",
            }}
          >
            <FeatherMail
              style={{
                color: colors.secondary,
                width: 20,
                height: 20,
              }}
            />
          </div>
        </motion.div>

        {/* Floating OTP digits */}
        <motion.div
          className="absolute -bottom-4 -left-4 flex gap-1"
          animate={{
            y: [0, 8, 0],
            x: [0, -5, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.accent}10)`,
              border: `1px solid ${colors.accent}40`,
              backdropFilter: "blur(10px)",
              color: colors.accent,
            }}
          >
            1
          </div>
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.accent}10)`,
              border: `1px solid ${colors.accent}40`,
              backdropFilter: "blur(10px)",
              color: colors.accent,
            }}
          >
            2
          </div>
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.accent}10)`,
              border: `1px solid ${colors.accent}40`,
              backdropFilter: "blur(10px)",
              color: colors.accent,
            }}
          >
            3
          </div>
        </motion.div>

        {/* Floating dots */}
        <motion.div
          className="absolute top-1/2 -right-8 w-2 h-2 rounded-full"
          style={{ backgroundColor: colors.primary }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/2 -left-8 w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.secondary }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />
      </div>
    </motion.div>
  </motion.div>
);

// ============================================
// GLASS CARD COMPONENT
// ============================================
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`relative group ${className}`}
  >
    {/* Main glass layer */}
    <div
      className="absolute inset-0 rounded-3xl transition-all duration-500"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(255, 255, 255, 0.3) inset",
      }}
    />

    {/* Content */}
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export default function VerifyResetCode() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const isOtpComplete = otp.every((digit) => digit !== "");

  /* ================= OTP HANDLERS ================= */

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!email) {
      toast.error("Session expired. Please try again.");
      navigate("/forgot-password", { replace: true });
      return;
    }
    
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter 6 digit code");
      return;
    }

    try {
      setLoading(true);
      await API("post", URL_PATH.verifyResetCode, { email, otp: code });

      toast.success("Code verified successfully");

      setTimeout(() => {
        navigate("/set-password", { state: { email } });
      }, 2000);
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendLoading || cooldown > 0) return;

    try {
      setResendLoading(true);

      await API("post", URL_PATH.forgotPassword, { email });

      toast.success("Verification code sent");

      setCooldown(30);
    } catch {
      toast.error("Unable to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Enter Key to Verify OTP
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isOtpComplete && !loading) {
        handleVerify();
      }

      if (e.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOtpComplete, loading, navigate]);

  // Paste Full OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text").trim();

    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);

    digits.forEach((_, idx) => {
      inputsRef.current[idx]?.focus();
    });
  };

  return (
    <>
     
      <BackgroundGlass />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Main Content - Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* LEFT - Illustration (Hidden on mobile, shown on lg screens) */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VerifyCodeIllustration />
              
              {/* Additional floating elements for visual interest */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm" style={{ color: colors.neutral[500] }}>
                  Enter the 6-digit code sent to your email
                </p>
                <div className="flex justify-center gap-2 mt-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT - Form */}
            <motion.div
              className="w-full max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard>
                <div className="p-6 sm:p-8 md:p-10">
                  {/* Mobile Illustration (shown only on mobile) */}
                  <div className="lg:hidden mb-6">
                    <VerifyCodeIllustration />
                  </div>

                  {/* Header with back button */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-6">
                    <motion.button
                      onClick={() => navigate(-1)}
                      className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FeatherArrowLeft
                        style={{
                          color: colors.neutral[600],
                          justifyContent: "center",
                        }}
                      />
                    </motion.button>
                    <div className="flex-1" />
                  </div>

                  {/* Title Section */}
                  <motion.div
                    className="mb-6 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h1
                      className="text-2xl sm:text-3xl font-light tracking-tight mb-2"
                      style={{ color: colors.accent }}
                    >
                      Check your email
                    </h1>

                    {email && (
                      <p
                        className="text-sm"
                        style={{ color: colors.neutral[600] }}
                      >
                        We sent a code to{" "}
                        <span className="font-medium" style={{ color: colors.primary }}>
                          {email.replace(/(.{3}).+(@.+)/, "$1***$2")}
                        </span>
                      </p>
                    )}
                  </motion.div>

                  {/* Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-5"
                  >
                    {/* OTP Input Boxes */}
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium block text-center"
                        style={{ color: colors.accent }}
                      >
                        Verification Code
                      </label>
                      <div className="flex justify-center gap-2 sm:gap-3">
                        {otp.map((digit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <input
                              ref={(el) => {
                                inputsRef.current[index] = el;
                              }}
                              value={digit}
                              maxLength={1}
                              onPaste={handlePaste}
                              onChange={(e) => handleChange(e.target.value, index)}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace" && !otp[index] && index > 0) {
                                  inputsRef.current[index - 1]?.focus();
                                }
                                if (e.key === "ArrowLeft" && index > 0) {
                                  inputsRef.current[index - 1]?.focus();
                                }
                                if (e.key === "ArrowRight" && index < 5) {
                                  inputsRef.current[index + 1]?.focus();
                                }
                              }}
                              className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl text-center text-lg sm:text-xl font-semibold transition-all duration-200"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: `1px solid ${colors.neutral[200]}`,
                                color: colors.accent,
                                outline: "none",
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = colors.primary;
                                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = colors.neutral[200];
                                e.target.style.boxShadow = "none";
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Verify Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={handleVerify}
                        disabled={loading || !isOtpComplete}
                        className="group relative w-full h-12 sm:h-14 rounded-full font-medium text-sm sm:text-base transition-all duration-300 overflow-hidden"
                        style={{
                          cursor: loading || !isOtpComplete ? "not-allowed" : "pointer",
                          opacity: loading || !isOtpComplete ? 0.75 : 1,
                        }}
                      >
                        <div
                          className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
                            opacity: loading ? 0.5 : 1,
                          }}
                        />

                        <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                              Verifying...
                            </>
                          ) : (
                            "Verify Code"
                          )}
                        </div>

                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                          }}
                        />
                      </button>
                    </motion.div>

                    {/* Resend Link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center"
                    >
                      <p className="text-sm" style={{ color: colors.neutral[400] }}>
                        Haven't got the code?{" "}
                        <button
                          onClick={handleResend}
                          disabled={resendLoading || cooldown > 0}
                          className="font-medium transition-opacity hover:opacity-70"
                          style={{
                            color: resendLoading || cooldown > 0 ? colors.neutral[400] : colors.primary,
                            cursor: resendLoading || cooldown > 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          {resendLoading
                            ? "Sending..."
                            : cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : "Resend email"}
                        </button>
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          overflow-x: hidden;
          width: 100%;
        }

        body {
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        #root {
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: ${colors.primary}4D;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.primary}80;
        }
      `}</style>
    </>
  );
}