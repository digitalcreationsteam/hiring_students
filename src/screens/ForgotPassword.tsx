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
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
    <div className="absolute inset-0 bg-white/20 backdrop-blur-[150px]" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10" />
  </div>
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
      <Navbar />
      <BackgroundGlass />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <GlassCard>
            <div className="p-6 sm:p-8 md:p-10">
              {/* Header with back button */}
              <div className="flex items-center gap-3 sm:gap-4 mb-8">
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
                <span className="text-xs text-neutral-400">
                  Forgot Password
                </span>
              </div>

              {/* Title Section */}
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                      border: `1px solid ${colors.primary}30`,
                    }}
                  >
                    <FeatherLock
                      style={{
                        color: colors.primary,
                        width: 32,
                        height: 32,
                        justifyContent: "center",
                      }}
                    />
                  </div>
                </div>

                <h1
                  className="text-2xl sm:text-3xl font-light tracking-tight mb-2"
                  style={{ color: colors.accent }}
                >
                  Forgot password
                </h1>

                <p
                  className="text-sm max-w-md mx-auto"
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
                className="space-y-6"
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
                    style={{ color: colors.neutral[500] }}
                  >
                    Back to Login
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </GlassCard>
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
