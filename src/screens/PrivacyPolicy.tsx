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
  FeatherGlobe,
  FeatherMail,
  FeatherEye,
} from "@subframe/core";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// ============================================
// ILLUSTRATION COMPONENTS
// ============================================
const PrivacyIllustration = () => (
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

      {/* Privacy Shield Icon */}
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
        {/* Shield base */}
        <path
          d="M250 80 L320 140 L320 240 C320 320 250 380 250 380 C250 380 180 320 180 240 L180 140 L250 80"
          fill="white"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.4"
        />
        
        {/* Shield inner glow */}
        <path
          d="M250 100 L300 150 L300 240 C300 300 250 350 250 350 C250 350 200 300 200 240 L200 150 L250 100"
          fill={colors.primary}
          fillOpacity="0.05"
          stroke="none"
        />

        {/* Lock icon on shield */}
        <motion.g
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <rect
            x="225"
            y="200"
            width="50"
            height="40"
            rx="8"
            fill="white"
            stroke={colors.accent}
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <circle
            cx="250"
            cy="190"
            r="15"
            fill="white"
            stroke={colors.accent}
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <circle
            cx="250"
            cy="220"
            r="5"
            fill={colors.accent}
            opacity="0.3"
          />
          <path
            d="M245 220 L255 220 M250 215 L250 225"
            stroke={colors.accent}
            strokeWidth="2"
            strokeOpacity="0.5"
          />
        </motion.g>

        {/* Eye symbol - representing privacy/visibility */}
        <motion.g
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <circle
            cx="310"
            cy="270"
            r="12"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          <circle
            cx="310"
            cy="270"
            r="4"
            fill={colors.primary}
            opacity="0.2"
          />
        </motion.g>

        {/* Data protection lines */}
        <line
          x1="190"
          y1="280"
          x2="230"
          y2="280"
          stroke={colors.accent}
          strokeWidth="2"
          strokeOpacity="0.2"
          strokeDasharray="4 2"
        />
        <line
          x1="270"
          y1="280"
          x2="310"
          y2="280"
          stroke={colors.accent}
          strokeWidth="2"
          strokeOpacity="0.2"
          strokeDasharray="4 2"
        />
      </motion.g>

      {/* Floating data points */}
      <motion.g
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      >
        <circle
          cx="150"
          cy="150"
          r="6"
          fill={colors.primary}
          opacity="0.15"
        />
        <circle
          cx="140"
          cy="145"
          r="2"
          fill={colors.accent}
          opacity="0.3"
        />
        <circle
          cx="160"
          cy="155"
          r="2"
          fill={colors.accent}
          opacity="0.3"
        />
      </motion.g>

      <motion.g
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <circle
          cx="350"
          cy="350"
          r="8"
          fill={colors.accent}
          opacity="0.15"
        />
        <circle
          cx="340"
          cy="345"
          r="3"
          fill={colors.primary}
          opacity="0.3"
        />
        <circle
          cx="360"
          cy="355"
          r="3"
          fill={colors.primary}
          opacity="0.3"
        />
      </motion.g>

      {/* International representation */}
      <motion.g
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "400px 150px" }}
      >
        <circle
          cx="400"
          cy="150"
          r="25"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1.5"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
        />
        <circle
          cx="400"
          cy="150"
          r="15"
          fill="none"
          stroke={colors.accent}
          strokeWidth="1.5"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
        />
        <path
          d="M400 125 L400 175 M375 150 L425 150"
          stroke={colors.primary}
          strokeWidth="1.5"
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
// PRIVACY SECTION COMPONENT
// ============================================
const PrivacySection = ({
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

function PrivacyPolicy() {
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
          {/* LEFT - Illustration & Key Privacy Points */}
          <motion.div
            className="hidden lg:flex flex-col gap-12 sticky top-20"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Illustration */}
            <div className="w-full aspect-square max-w-sm mx-auto">
              <PrivacyIllustration />
            </div>

            {/* Key Privacy Principles */}
            <div className="space-y-6">
              {[
                {
                  icon: FeatherShield,
                  title: "Data Protection",
                  desc: "Your personal data is protected with industry-standard safeguards",
                },
                {
                  icon: FeatherEye,
                  title: "No Data Selling",
                  desc: "We do not sell your personal data for advertising purposes",
                },
                {
                  icon: FeatherGlobe,
                  title: "India + US Compliance",
                  desc: "We comply with data protection laws in India and the United States",
                },
                {
                  icon: FeatherLock,
                  title: "Your Rights",
                  desc: "Access, correct, or delete your personal data at any time",
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

          {/* RIGHT - Privacy Policy Content */}
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
                  Privacy Policy
                </h1>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  India + US specific · Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Privacy Policy Content with Custom Scrollbar */}
            <div 
              className="space-y-8 max-h-[600px] overflow-y-auto pr-4 pb-8 custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: `${colors.primary}40 ${colors.neutral[100]}`,
              }}
            >
              <PrivacySection title="Who We Are and What This Policy Covers" delay={0.25}>
                <p>
                  UniTalent ("UniTalent", "UT", "we", "us", or "our") values the trust you
                  place in us and is committed to protecting your personal data. This Privacy Policy
                  explains how we collect, use, store, disclose, and protect information that relates to
                  an identifiable individual ("personal data") when you access or use the UniTalent
                  platform. It also explains the rights available to you under applicable data protection
                  and privacy laws in India and the United States.
                </p>
                <p className="mt-2">
                  This Privacy Policy applies to all users of UniTalent's website, applications, and
                  related services (collectively, the "Platform" or "Services"). By accessing or
                  using the Platform, you acknowledge that you have read and understood this
                  Privacy Policy and agree to the processing of your personal data in accordance with
                  its terms.
                </p>
                <p className="mt-2">
                  UniTalent is an online, self-service digital platform designed to enhance individuals'
                  visibility to recruiters and employers. The Platform enables users to demonstrate,
                  benchmark, and validate their job-related and work-specific skills through structured,
                  role-based or skill-specific assessments.
                </p>
                <p className="mt-2">
                  UniTalent does not provide recruitment services, job placement services, hiring
                  recommendations, or any form of employment guarantee. The Platform solely
                  facilitates connections between employers and users and acts as an intermediary
                  technology platform. The Platform does not make hiring decisions or
                  employment-related judgments.
                </p>
                <p className="mt-2">
                  UniTalent is headquartered in India and primarily serves users located in India and
                  the United States. While this Privacy Policy is governed by the laws of India, we
                  respect and comply with non-waivable privacy rights available to users under
                  applicable U.S. state laws and other relevant regulations.
                </p>
              </PrivacySection>

              <PrivacySection title="Personal Data We Collect" delay={0.3}>
                <p>
                  When you use UniTalent, we collect personal data that is necessary to provide and
                  improve our Services. This includes information you choose to provide directly when
                  creating an account, completing your profile, or communicating with us. Such
                  information may include your name, email address, login credentials, educational
                  background, work experience, skill-related information, and any other details you
                  voluntarily share on the Platform.
                </p>
                <p className="mt-2">
                  We also collect information generated through your use of the Platform, including
                  your responses to assessments, the scores derived from those responses, and any
                  rankings or benchmarking results generated based on your performance.
                </p>
                <p className="mt-2">
                  In addition, certain information is collected automatically when you access or use the
                  Platform. This may include your IP address, device and browser information, usage
                  logs, interaction data, and information collected through cookies or similar
                  technologies.
                </p>
                <p className="mt-2">
                  If you choose to purchase paid features or services, payment transactions are
                  handled by third-party payment service providers. UniTalent does not store
                  complete payment card details.
                </p>
              </PrivacySection>

              <PrivacySection title="How and Why We Use Your Personal Data" delay={0.35}>
                <p>
                  We process personal data only for lawful, specific, and legitimate purposes. Your
                  information is used to create and manage your account, provide access to
                  assessments, generate scores and rankings, and deliver benchmarking insights
                  through the Platform.
                </p>
                <p className="mt-2">
                  Personal data may also be processed to maintain the security and integrity of the
                  Platform, detect and prevent fraud or misuse, and comply with applicable legal and
                  regulatory obligations.
                </p>
                <p className="mt-2 font-medium" style={{ color: colors.accent }}>
                  We do not sell personal data, and we do not share personal data for targeted
                  advertising purposes.
                </p>
              </PrivacySection>

              <PrivacySection title="Consent and Legal Basis for Processing" delay={0.4}>
                <p>
                  For users located in India, personal data is processed based on your consent or on
                  other lawful grounds permitted under the Digital Personal Data Protection Act, 2023,
                  such as processing necessary for providing requested services or complying with
                  legal obligations.
                </p>
                <p className="mt-2">
                  For users located in the United States, personal data is processed based on
                  legitimate business purposes, contractual necessity, user expectations, and
                  compliance with applicable laws. We respect state-specific privacy rights where
                  they apply.
                </p>
              </PrivacySection>

              <PrivacySection title="Scores, Rankings, and Platform Logic" delay={0.45}>
                <p>
                  UniTalent's assessments, scoring methods, and ranking logic are continuously
                  reviewed and may be updated or modified to improve accuracy, relevance, and
                  fairness. As a result, user scores and rankings may change over time.
                </p>
                <p className="mt-2">
                  All results are intended to support self-assessment and comparative benchmarking
                  only and should not be relied upon for employment, promotion, or professional
                  decision-making.
                </p>
              </PrivacySection>

              <PrivacySection title="Sharing and Disclosure of Personal Data" delay={0.5}>
                <p>
                  UniTalent shares personal data only when necessary and in limited circumstances.
                  This may include sharing data with trusted service providers who assist with hosting,
                  analytics, customer support, payment processing, or other operational functions.
                </p>
                <p className="mt-2">
                  Personal data may also be disclosed if required by law, regulation, court order, or
                  governmental request, or in connection with a corporate transaction such as a
                  merger, acquisition, or restructuring.
                </p>
              </PrivacySection>

              <PrivacySection title="Data Security" delay={0.55}>
                <p>
                  We implement reasonable technical, administrative, and organizational safeguards
                  designed to protect personal data against unauthorized access, disclosure,
                  alteration, or destruction. While we strive to protect your information, no method of
                  transmission or storage is completely secure.
                </p>
              </PrivacySection>

              <PrivacySection title="International Data Transfers" delay={0.6}>
                <p>
                  In certain circumstances, your personal data may be transferred to, processed, or
                  stored in countries other than the country in which it was originally collected. These
                  countries may have data protection laws that differ from those in your country of
                  residence.
                </p>
                <p className="mt-2">
                  For users in jurisdictions such as the EEA, UK, or Switzerland, we comply with
                  recognized international data transfer frameworks, such as the EU-U.S. Data
                  Privacy Framework ("EU-U.S. DPF"), where applicable.
                </p>
              </PrivacySection>

              <PrivacySection title="Data Retention" delay={0.65}>
                <p>
                  We retain personal data only for as long as it is necessary to provide the Services,
                  fulfill the purposes described in this Privacy Policy, comply with legal obligations,
                  resolve disputes, and enforce our agreements.
                </p>
              </PrivacySection>

              <PrivacySection title="Your Rights Under Applicable Laws" delay={0.7}>
                <p>
                  Depending on your location, you may have the right to access, correct, or delete
                  your personal data, withdraw consent, object to certain processing activities, or
                  request information about how your data is used.
                </p>
                <p className="mt-2">
                  Users in India also have the right to grievance redressal and to nominate another
                  individual to exercise their rights in the event of incapacity. Users in certain U.S.
                  states may have additional rights under applicable state privacy laws.
                </p>
              </PrivacySection>

              <PrivacySection title="Children's Privacy" delay={0.75}>
                <p>
                  UniTalent is not intended for individuals under the age of eighteen. We do not
                  knowingly collect personal data from minors. If we become aware that personal data
                  of a minor has been collected, we will take prompt steps to delete such data.
                </p>
              </PrivacySection>

              <PrivacySection title="Updates to This Privacy Policy" delay={0.8}>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our
                  practices, services, or legal requirements. Updated versions will be posted on the
                  Platform with a revised "Last updated" date.
                </p>
              </PrivacySection>

              <PrivacySection title="Contact and Grievance Redressal" delay={0.85}>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or the
                  processing of your personal data, you may contact us at:
                </p>
                <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}08` }}>
                  <p className="flex items-center gap-2">
                    <FeatherMail className="w-4 h-4" style={{ color: colors.primary }} />
                    <span>Email: <a href="mailto:privacy@unitalent.com" style={{ color: colors.primary }}>privacy@unitalent.com</a></span>
                  </p>
                  <p className="mt-2">Entity: UniTalent</p>
                  <p>Country: India</p>
                </div>
              </PrivacySection>
            </div>

            {/* Acknowledge Button */}
            <motion.div
              className="mt-8 text-center border-t pt-6"
              style={{ borderColor: colors.neutral[200] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm mb-3" style={{ color: colors.neutral[600] }}>
                By continuing to use UniTalent, you acknowledge our Privacy Policy
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: colors.primary,
                  color: "white",
                }}
              >
                I Understand
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

export default PrivacyPolicy;