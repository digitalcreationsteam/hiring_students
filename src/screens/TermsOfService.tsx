"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FeatherArrowLeft,
  FeatherCheckCircle,
  FeatherFileText,
  FeatherClock,
  FeatherShield,
  FeatherUsers,
  FeatherLock,
  FeatherBookOpen,
  FeatherBriefcase,
} from "@subframe/core";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// ============================================
// ILLUSTRATION COMPONENTS
// ============================================
const TermsIllustration = () => (
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
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        maxWidth: "400px",
        minWidth: "350px",
        width: "100%",
        height: "auto",
      }}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Background glow circles */}
      <motion.circle
        cx="250"
        cy="250"
        r="200"
        fill={colors.primary}
        opacity="0.08"
        animate={{
          r: [200, 215, 200],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx="250"
        cy="250"
        r="180"
        fill={colors.accent}
        opacity="0.05"
        animate={{
          r: [180, 190, 180],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Document/Book Icon for Terms */}
      <motion.g
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Book/Contract base */}
        <rect
          x="140"
          y="80"
          width="220"
          height="280"
          rx="12"
          fill="white"
          stroke={colors.primary}
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        
        {/* Book spine effect */}
        <line
          x1="180"
          y1="80"
          x2="180"
          y2="360"
          stroke={colors.accent}
          strokeWidth="2"
          strokeOpacity="0.2"
          strokeDasharray="5 3"
        />
        
        {/* Gavel/Justice symbol */}
        <motion.g
          animate={{
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "300px 200px" }}
        >
          <rect
            x="270"
            y="160"
            width="60"
            height="10"
            rx="5"
            fill={colors.primary}
            opacity="0.2"
          />
          <rect
            x="295"
            y="140"
            width="10"
            height="40"
            rx="5"
            fill={colors.accent}
            opacity="0.3"
          />
          <circle
            cx="300"
            cy="130"
            r="15"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            strokeOpacity="0.3"
            strokeDasharray="4 4"
          />
        </motion.g>

        {/* Handshake symbol - representing agreement */}
        <motion.g
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "190px 300px" }}
        >
          <path
            d="M170 280 L180 270 L190 280 L200 270 L210 280"
            stroke={colors.primary}
            strokeWidth="3"
            strokeOpacity="0.3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M175 290 L185 285 L195 295 L205 285 L215 295"
            stroke={colors.accent}
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="none"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Document lines - representing text */}
        <line
          x1="160"
          y1="130"
          x2="340"
          y2="130"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="160"
          y1="160"
          x2="320"
          y2="160"
          stroke={colors.accent}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="160"
          y1="190"
          x2="340"
          y2="190"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="160"
          y1="220"
          x2="300"
          y2="220"
          stroke={colors.accent}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="160"
          y1="250"
          x2="340"
          y2="250"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="160"
          y1="280"
          x2="320"
          y2="280"
          stroke={colors.accent}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="160"
          y1="310"
          x2="340"
          y2="310"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="160"
          y1="340"
          x2="300"
          y2="340"
          stroke={colors.accent}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Floating legal symbols */}
      <motion.g
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "400px 150px" }}
      >
        <circle
          cx="400"
          cy="150"
          r="20"
          fill="none"
          stroke={colors.accent}
          strokeWidth="2"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
        />
        <path
          d="M400 140 L400 160 M390 150 L410 150"
          stroke={colors.accent}
          strokeWidth="2"
          strokeOpacity="0.3"
        />
      </motion.g>

      <motion.g
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "100px 350px" }}
      >
        <circle
          cx="100"
          cy="350"
          r="25"
          fill="none"
          stroke={colors.primary}
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        <path
          d="M100 335 L100 365 M85 350 L115 350"
          stroke={colors.primary}
          strokeWidth="2"
          strokeOpacity="0.2"
        />
      </motion.g>

      {/* Floating particles */}
      <motion.circle
        cx="450"
        cy="400"
        r="8"
        fill={colors.primary}
        opacity="0.1"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        cx="50"
        cy="100"
        r="12"
        fill={colors.accent}
        opacity="0.1"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </motion.svg>
  </motion.div>
);

// ============================================
// TERMS SECTION COMPONENT
// ============================================
const TermsSection = ({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <h2
      className="text-lg font-medium mb-3"
      style={{ color: colors.accent }}
    >
      {title}
    </h2>
    <div className="space-y-2 text-sm" style={{ color: colors.neutral[600] }}>
      {children}
    </div>
  </motion.div>
);

function TermsOfService() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
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

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LEFT - Illustration & Key Terms */}
          <motion.div
            className="hidden lg:flex flex-col gap-12 sticky top-20"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Illustration */}
            <div className="w-full aspect-square max-w-sm mx-auto">
              <TermsIllustration />
            </div>

            {/* Key Points */}
            <div className="space-y-6">
              {[
                {
                  icon: FeatherUsers,
                  title: "Eligibility",
                  desc: "You must be at least 18 years old to use UniTalent",
                },
                {
                  icon: FeatherLock,
                  title: "Your Content",
                  desc: "You retain ownership of your profile information and assessment data",
                },
                {
                  icon: FeatherBookOpen,
                  title: "Intellectual Property",
                  desc: "Platform content, assessments, and rankings are owned by UniTalent",
                },
                {
                  icon: FeatherBriefcase,
                  title: "No Employment Guarantee",
                  desc: "Scores and rankings are for informational purposes only",
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

          {/* RIGHT - Terms Content */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
                style={{ color: colors.neutral[600] }}
              >
                <FeatherArrowLeft style={{ width: 20, height: 20 }} />
              </button>
            </motion.div>

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
                  Terms of Service
                </h1>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Welcome to UniTalent (“UniTalent”, “UT”, “we”, “us”, or “our”)
                </p>
              </div>
            </div>

            {/* Terms Content with Custom Scrollbar */}
            <div 
              className="space-y-8 max-h-[600px] overflow-y-auto pr-4 pb-8 custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: `${colors.primary}40 ${colors.neutral[100]}`,
              }}
            >
              <TermsSection title="1. Who Can Use UniTalent" delay={0.25}>
                <p>
                  The Platform is intended for individuals who are at least eighteen years old. By using UniTalent,
                  you represent and warrant that you are at least eighteen years old, have the legal capacity to
                  enter into binding agreements, and are using the Platform for lawful purposes. UniTalent does
                  not knowingly permit individuals under eighteen to use the Platform, and any data collected from
                  minors will be deleted promptly.
                </p>
              </TermsSection>

              <TermsSection title="2. Using the Platform" delay={0.3}>
                <p>
                  UniTalent is an online, self-service platform that allows users to take assessments, receive
                  scores, and view rankings relative to other participants. The Platform provides information and
                  comparative insights only and does not provide recruitment, job placement, hiring
                  recommendations, or employment guarantees. Any scores, rankings, or insights are dynamic
                  and may change over time. Users are responsible for maintaining the confidentiality of their
                  account credentials and are solely responsible for all activity under their account. You agree not
                  to use the Platform for any unlawful purpose or in a manner that violates these Terms or any
                  applicable laws.
                </p>
              </TermsSection>

              <TermsSection title="3. User Content and Conduct" delay={0.35}>
                <p>
                  You may provide information about yourself in your profile and during assessments. By
                  submitting any content, you grant UniTalent a non-exclusive, worldwide, royalty-free license to
                  use, store, and display this content for purposes of operating the Platform and providing the
                  Services. You agree not to post content that is unlawful, fraudulent, infringing, offensive, or
                  otherwise objectionable. UniTalent reserves the right to remove or disable access to any content
                  that violates these Terms or is otherwise harmful to the Platform or its users.
                </p>
              </TermsSection>

              <TermsSection title="4. Intellectual Property" delay={0.4}>
                <p>
                  All content, software, assessments, scoring methodologies, rankings, graphics, logos, and other
                  materials provided on the Platform are owned by UniTalent or its licensors and are protected by
                  intellectual property laws. You may not copy, reproduce, distribute, modify, create derivative
                  works, publicly display, or otherwise exploit any part of the Platform or its content without
                  UniTalent's prior written consent. Users retain ownership of the content they provide in their
                  profiles, but grant UniTalent the rights necessary to operate the Platform as described above.
                </p>
              </TermsSection>

              <TermsSection title="5. Disclaimers and Limitation of Liability" delay={0.45}>
                <p>
                  The Platform is provided "as is" and "as available." UniTalent does not guarantee the
                  accuracy, completeness, or reliability of any scores, rankings, or assessments. The Platform is
                  intended solely for informational and benchmarking purposes. UniTalent is not responsible for
                  any decisions or actions you take based on Platform content, including employment, hiring, or
                  career choices.
                </p>
                <p className="mt-2">
                  To the maximum extent permitted by applicable law, UniTalent, its officers, employees, affiliates,
                  and licensors are not liable for any direct, indirect, incidental, consequential, special, or punitive
                  damages arising out of your use or inability to use the Platform, even if advised of the possibility
                  of such damages.
                </p>
              </TermsSection>

              <TermsSection title="6. Payments and Subscriptions" delay={0.5}>
                <p>
                  Certain features of the Platform may be offered on a paid or subscription basis. All payments are
                  processed through third-party payment providers/merchant of record, and you agree to pay all
                  applicable fees and taxes. UniTalent does not store your full payment card information, any
                  information regarding the same can be looked upon under the third party's terms of service
                  and privacy policy. Fees are non-refundable except as required by applicable law or explicitly
                  stated. UniTalent reserves the right to change pricing or payment terms upon reasonable notice.
                </p>
              </TermsSection>

              <TermsSection title="7. Termination" delay={0.55}>
                <p>
                  UniTalent may suspend or terminate your account at any time for violation of these Terms,
                  unlawful activity, or misuse of the Platform. Upon termination, your access to the Platform and
                  your content may be restricted or removed. Users may also request account deletion in
                  accordance with applicable law.
                </p>
              </TermsSection>

              <TermsSection title="8. Governing Law and Jurisdiction" delay={0.6}>
                <p>
                  These Terms are governed by the laws of India, without regard to its conflict of law principles,
                  except where local non-waivable rights apply. Users in the United States are subject to
                  applicable state laws in addition to Indian law. Any disputes arising from these Terms or your use
                  of the Platform shall be resolved in the courts or through alternative dispute resolution
                  mechanisms located in India, unless otherwise required by local law.
                </p>
              </TermsSection>

              <TermsSection title="9. Modifications to Terms" delay={0.65}>
                <p>
                  UniTalent reserves the right to update or modify these Terms at any time. Material changes will
                  be communicated through the Platform or other appropriate means. Continued use of the
                  Platform after updates constitutes acceptance of the revised Terms.
                </p>
              </TermsSection>
            </div>

            {/* Acceptance Button */}
            <motion.div
              className="mt-8 text-center border-t pt-6"
              style={{ borderColor: colors.neutral[200] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm mb-3" style={{ color: colors.neutral[600] }}>
                By continuing to use UniTalent, you agree to these Terms of Service
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: colors.primary,
                  color: "white",
                }}
              >
                Accept and Continue
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.neutral[100]};
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.primary}40;
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.primary}60;
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${colors.primary}40 ${colors.neutral[100]};
        }
      `}</style>
    </>
  );
}

export default TermsOfService;