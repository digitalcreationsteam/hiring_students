import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";
import { FeatherCheckCircle, FeatherArrowRight } from "@subframe/core";

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

export default function ResetPasswordSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        navigate("/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <BackgroundGlass />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <GlassCard>
            <div className="p-6 sm:p-8 md:p-10">
              {/* Title Section */}
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Success Icon with Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="flex justify-center mb-6"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                      border: `1px solid ${colors.primary}30`,
                    }}
                  >
                    <FeatherCheckCircle
                      style={{
                        color: colors.primary,
                        width: 40,
                        height: 40,
                        justifyContent:"center",
                      }}
                    />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-light tracking-tight mb-3"
                  style={{ color: colors.accent }}
                >
                  Password Changed!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm max-w-md mx-auto"
                  style={{ color: colors.neutral[600] }}
                >
                  Your password has been changed successfully.
                </motion.p>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => navigate("/login", { replace: true })}
                  className="group relative w-full h-12 sm:h-14 rounded-full font-medium text-sm sm:text-base transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
                    }}
                  />

                  <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                    <span>Log In</span>
                    <FeatherArrowRight 
                      style={{
                        width: 18,
                        height: 18,
                        transition: "transform 0.3s ease",
                      }}
                      className="group-hover:translate-x-1"
                    />
                  </div>

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                </button>
              </motion.div>

              {/* Hint text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-6 text-xs"
                style={{ color: colors.neutral[400] }}
              >
                Press Enter to continue
              </motion.p>
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