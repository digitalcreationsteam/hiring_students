import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

import API, { URL_PATH } from "../common/API";
import { colors } from "src/common/Colors";
import Footer from "../ui/components/Footer";
import Navbar from "src/ui/components/Navbar";
import { FeatherArrowLeft, FeatherMail, FeatherLock } from "@subframe/core";

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
const ForgotPasswordIllustration: React.FC = () => (
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
        
        {/* Lock icon with pulse animation */}
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

        {/* Floating arrow/return icon */}
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
            <FeatherArrowLeft
              style={{
                color: colors.accent,
                width: 20,
                height: 20,
              }}
            />
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // RESET PASSWORD API=========
  const handleSubmit = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      await API("POST", URL_PATH.forgotPassword, { email });
      toast.success("Verification code sent to your email");

      setTimeout(() => {
        navigate("/verify-code", { state: { email } });
      }, 3000);
    } catch (err: any) {
      toast.error(err?.message || "Unable to send reset code");
    } finally {
      setLoading(false);
    }
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
              <ForgotPasswordIllustration />
              
              {/* Additional floating elements for visual interest */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm" style={{ color: colors.neutral[500] }}>
                  Secure password reset process
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
                    <ForgotPasswordIllustration />
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
                      Forgot password
                    </h1>

                    <p
                      className="text-sm"
                      style={{ color: colors.neutral[600] }}
                    >
                      Please enter your email to reset the password
                    </p>
                  </motion.div>

                  {/* Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Email Input */}
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium block"
                        style={{ color: colors.accent }}
                      >
                        Your Email
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <FeatherMail
                            style={{
                              color: colors.neutral[400],
                              width: 18,
                              height: 18,
                            }}
                          />
                        </div>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full h-12 pl-11 pr-4 rounded-full text-sm transition-all duration-200"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            border: `1px solid ${colors.neutral[200]}`,
                            color: colors.accent,
                            outline: "none",
                          }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={(e) => {
                            e.target.style.borderColor = colors.primary;
                            e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = colors.neutral[200];
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    {/* Reset Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group relative w-full h-12 sm:h-14 rounded-full font-medium text-sm sm:text-base transition-all duration-300 overflow-hidden"
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.75 : 1,
                        }}
                      >
                        {/* Button Background with Glass Effect */}
                        <div
                          className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
                            opacity: loading ? 0.5 : 1,
                          }}
                        />

                        {/* Button Content */}
                        <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                              Sending...
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </div>

                        {/* Simple Hover Effect */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                          }}
                        />
                      </button>
                    </motion.div>

                    {/* Back to Login Link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center"
                    >
                      <button
                        onClick={() => navigate("/login")}
                        className="text-sm transition-opacity hover:opacity-70"
                        style={{ color: colors.neutral[400] }}
                      >
                        Back to Login
                      </button>
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