import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import API, { URL_PATH } from "../common/API";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";
import { FeatherArrowLeft, FeatherLock, FeatherEye, FeatherEyeOff, FeatherCheckCircle } from "@subframe/core";

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
const SetPasswordIllustration: React.FC = () => (
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
        
        {/* Main Lock icon with pulse animation */}
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
            <FeatherLock
              style={{
                color: colors.primary,
                width: 40,
                height: 40,
              }}
            />
          </div>
        </motion.div>

        {/* Floating password strength indicators */}
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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}30, ${colors.secondary}10)`,
              border: `1px solid ${colors.secondary}40`,
              backdropFilter: "blur(10px)",
              color: colors.secondary,
            }}
          >
            <FeatherCheckCircle className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Floating checkmark for password match */}
        <motion.div
          className="absolute -bottom-4 -left-4"
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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.accent}10)`,
              border: `1px solid ${colors.accent}40`,
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="text-lg font-bold" style={{ color: colors.accent }}>✓</span>
          </div>
        </motion.div>

        {/* Strength dots */}
        <motion.div
          className="absolute top-1/2 -right-8 flex flex-col gap-1"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i === 1 ? colors.primary : i === 2 ? colors.secondary : colors.accent }}
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
        </motion.div>

        {/* Floating dots */}
        <motion.div
          className="absolute bottom-1/2 -left-8 w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.primary }}
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

export default function SetNewPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Session expired. Please restart password reset.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await API("post", URL_PATH.resetPassword, { email, password });

      toast.success("Password updated successfully");

      setTimeout(() => {
        navigate("/success-password");
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading && password && confirmPassword) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, password, confirmPassword]);

  /* ================= UI ================= */
  return (
    <>
      {/* <Navbar /> */}
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
              <SetPasswordIllustration />
              
              {/* Additional floating elements for visual interest */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm" style={{ color: colors.neutral[500] }}>
                  Create a strong, secure password
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
                    <SetPasswordIllustration />
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
                      Set a new password
                    </h1>

                    <p
                      className="text-sm"
                      style={{ color: colors.neutral[600] }}
                    >
                      Create a new password. Ensure it differs from previous ones for security
                    </p>
                  </motion.div>

                  {/* Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Password Input */}
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium block"
                        style={{ color: colors.accent }}
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <FeatherLock
                            style={{
                              color: colors.neutral[400],
                              width: 18,
                              height: 18,
                            }}
                          />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-12 pl-11 pr-11 rounded-full text-sm transition-all duration-200"
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
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <FeatherEyeOff
                              style={{
                                color: colors.neutral[400],
                                width: 18,
                                height: 18,
                              }}
                            />
                          ) : (
                            <FeatherEye
                              style={{
                                color: colors.neutral[400],
                                width: 18,
                                height: 18,
                              }}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium block"
                        style={{ color: colors.accent }}
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <FeatherLock
                            style={{
                              color: colors.neutral[400],
                              width: 18,
                              height: 18,
                            }}
                          />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-12 pl-11 pr-11 rounded-full text-sm transition-all duration-200"
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
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <FeatherEyeOff
                              style={{
                                color: colors.neutral[400],
                                width: 18,
                                height: 18,
                              }}
                            />
                          ) : (
                            <FeatherEye
                              style={{
                                color: colors.neutral[400],
                                width: 18,
                                height: 18,
                              }}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password strength indicator */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-1"
                      >
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className="flex-1 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: password.length >= 8 
                                  ? level === 1 
                                    ? colors.primary 
                                    : password.length >= 10
                                    ? level === 2
                                      ? colors.primary
                                      : password.length >= 12
                                      ? colors.primary
                                      : colors.neutral[200]
                                    : colors.neutral[200]
                                  : colors.neutral[200],
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: colors.neutral[400] }}>
                          {password.length < 8 
                            ? `${8 - password.length} more characters needed` 
                            : password.length < 10
                            ? "Good password"
                            : password.length < 12
                            ? "Strong password"
                            : "Very strong password"}
                        </p>
                      </motion.div>
                    )}

                    {/* Update Password Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={handleSubmit}
                        disabled={loading || !password || !confirmPassword}
                        className="group relative w-full h-12 sm:h-14 rounded-full font-medium text-sm sm:text-base transition-all duration-300 overflow-hidden"
                        style={{
                          cursor: loading || !password || !confirmPassword ? "not-allowed" : "pointer",
                          opacity: loading || !password || !confirmPassword ? 0.75 : 1,
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
                              Updating...
                            </>
                          ) : (
                            "Update Password"
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
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

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