// src/screens/CookiePolicy.tsx
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
  FeatherCookie,
  FeatherSettings,
  FeatherInfo,
} from "@subframe/core";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// ============================================
// ILLUSTRATION COMPONENTS
// ============================================
const CookieIllustration = () => (
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

      {/* Cookie Icon */}
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
        {/* Main Cookie */}
        <circle
          cx="250"
          cy="200"
          r="80"
          fill="#F4E3C1"
          stroke={colors.primary}
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        
        {/* Chocolate Chips */}
        <circle cx="220" cy="180" r="8" fill="#8B4513" opacity="0.8" />
        <circle cx="280" cy="170" r="10" fill="#8B4513" opacity="0.8" />
        <circle cx="230" cy="230" r="7" fill="#8B4513" opacity="0.8" />
        <circle cx="270" cy="220" r="9" fill="#8B4513" opacity="0.8" />
        <circle cx="200" cy="210" r="6" fill="#8B4513" opacity="0.8" />
        
        {/* Bite mark */}
        <path
          d="M300 180 Q 320 170 330 190 Q 340 210 320 200"
          fill="#FFF0D0"
          stroke={colors.primary}
          strokeOpacity="0.2"
        />

        {/* Cookie Crumbs */}
        <motion.circle
          cx="350"
          cy="150"
          r="4"
          fill="#F4E3C1"
          animate={{
            y: [0, 5, 0],
            x: [0, 2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="370"
          cy="180"
          r="3"
          fill="#F4E3C1"
          animate={{
            y: [0, 3, 0],
            x: [0, -2, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />

        {/* Shield overlay for protection */}
        <motion.path
          d="M250 260 L280 240 L280 280 L250 300 L220 280 L220 240 Z"
          fill={colors.primary}
          opacity="0.1"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.g>

      {/* Floating particles */}
      <motion.circle
        cx="400"
        cy="150"
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
        cx="100"
        cy="350"
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
// POLICY SECTION COMPONENT
// ============================================
const PolicySection = ({
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

function CookiePolicy() {
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
          {/* LEFT - Illustration & Benefits */}
          <motion.div
            className="hidden lg:flex flex-col gap-12 sticky top-20"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Illustration */}
            <div className="w-full aspect-square max-w-sm mx-auto">
              <CookieIllustration />
            </div>

            {/* Key Points */}
            <div className="space-y-6">
              {[
                {
                  icon: FeatherCookie,
                  title: "Essential Cookies",
                  desc: "Required for basic site functionality and security",
                },
                {
                  icon: FeatherSettings,
                  title: "Preference Cookies",
                  desc: "Remember your settings and personalize your experience",
                },
                {
                  icon: FeatherInfo,
                  title: "Analytics Cookies",
                  desc: "Help us understand how visitors interact with our site",
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

          {/* RIGHT - Policy Content */}
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
                  Cookie Policy
                </h1>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Last Updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Policy Content with Custom Scrollbar */}
            <div 
              className="space-y-8 max-h-[600px] overflow-y-auto pr-4 pb-8 custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: `${colors.primary}40 ${colors.neutral[100]}`,
              }}
            >
              <PolicySection title="1. What Are Cookies" delay={0.25}>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners.
                </p>
                <p className="mt-2">
                  Cookies help us enhance your browsing experience by remembering your preferences, understanding how you use our site, and personalizing content to better serve you.
                </p>
              </PolicySection>

              <PolicySection title="2. How We Use Cookies" delay={0.3}>
                <p>UniTalent uses cookies for the following purposes:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Authentication and security - to keep your account secure</li>
                  <li>Preferences - to remember your settings and choices</li>
                  <li>Analytics - to understand how visitors use our platform</li>
                  <li>Performance - to improve site speed and functionality</li>
                  <li>Personalization - to tailor content to your interests</li>
                </ul>
              </PolicySection>

              <PolicySection title="3. Types of Cookies We Use" delay={0.35}>
                <p className="font-medium">3.1 Essential Cookies</p>
                <p>
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.
                </p>
                
                <p className="font-medium mt-3">3.2 Functional Cookies</p>
                <p>
                  These cookies allow the website to remember choices you make and provide enhanced, more personal features. They may be set by us or third-party providers.
                </p>
                
                <p className="font-medium mt-3">3.3 Analytics Cookies</p>
                <p>
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve our services.
                </p>
                
                <p className="font-medium mt-3">3.4 Marketing Cookies</p>
                <p>
                  These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                </p>
              </PolicySection>

              <PolicySection title="4. Third-Party Cookies" delay={0.4}>
                <p>
                  We use services from trusted third parties that may set cookies on our site, including:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Google Analytics - for website usage analysis</li>
                  <li>Intercom - for customer support and communication</li>
                  <li>Stripe/Dodo Payments - for payment processing</li>
                  <li>LinkedIn, Twitter - for social media integration</li>
                </ul>
                <p className="mt-2">
                  These third parties have their own privacy and cookie policies. We recommend reviewing them for complete information.
                </p>
              </PolicySection>

              <PolicySection title="5. Cookie Duration" delay={0.45}>
                <p>Cookies can be categorized by how long they remain on your device:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    <span className="font-medium">Session Cookies:</span> These are temporary cookies that expire when you close your browser.
                  </li>
                  <li>
                    <span className="font-medium">Persistent Cookies:</span> These remain on your device for a set period or until you delete them.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection title="6. Managing Cookies" delay={0.5}>
                <p>
                  You have the right to control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and functionality.
                </p>
                <p className="mt-2 font-medium">Browser Controls:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Most browsers allow you to view, delete, or block cookies</li>
                  <li>You can set preferences for specific websites</li>
                  <li>You can enable private browsing modes</li>
                </ul>
                <p className="mt-2">
                  For instructions, visit your browser's help pages:
                  <br />• <a href="#" className="hover:underline" style={{ color: colors.primary }}>Chrome</a>
                  <br />• <a href="#" className="hover:underline" style={{ color: colors.primary }}>Firefox</a>
                  <br />• <a href="#" className="hover:underline" style={{ color: colors.primary }}>Safari</a>
                  <br />• <a href="#" className="hover:underline" style={{ color: colors.primary }}>Edge</a>
                </p>
              </PolicySection>

              <PolicySection title="7. Do Not Track Signals" delay={0.55}>
                <p>
                  Some browsers have "Do Not Track" (DNT) features that send a signal to websites requesting that your browsing not be tracked. Our website does not currently respond to DNT signals.
                </p>
              </PolicySection>

              <PolicySection title="8. Updates to This Policy" delay={0.6}>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. Any updates will be posted on this page with an updated revision date.
                </p>
              </PolicySection>

              <PolicySection title="9. Contact Us" delay={0.65}>
                <p>
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:privacy@unitalent.com"
                    className="hover:underline"
                    style={{ color: colors.primary }}
                  >
                    privacy@unitalent.com
                  </a>
                  <br />
                  Address: UniTalent Corporation Pvt Ltd.
                </p>
              </PolicySection>
            </div>

            {/* Cookie Preferences Button */}
            <motion.div
              className="mt-8 text-center border-t pt-6"
              style={{ borderColor: colors.neutral[200] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm mb-3" style={{ color: colors.neutral[600] }}>
                Manage your cookie preferences
              </p>
              {/* <button
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.primary,
                  color: "white",
                }}
                onClick={() => {
                  // You can implement a cookie preference modal here
                  alert("Cookie preference center coming soon!");
                }}
              >
                <FeatherSettings className="w-4 h-4" />
                Cookie Settings
              </button> */}
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

export default CookiePolicy;