"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FeatherArrowLeft,
  FeatherCheckCircle,
  FeatherFileText,
  FeatherClock,
  FeatherShield,
} from "@subframe/core";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// ============================================
// ILLUSTRATION COMPONENTS
// ============================================
const RefundIllustration = () => (
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

      {/* Document/Policy Icon */}
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
        {/* Document base */}
        <rect
          x="150"
          y="80"
          width="200"
          height="280"
          rx="16"
          fill="white"
          stroke={colors.primary}
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Document lines - representing text */}
        <line
          x1="180"
          y1="130"
          x2="320"
          y2="130"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="180"
          y1="160"
          x2="300"
          y2="160"
          stroke={colors.accent}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="180"
          y1="190"
          x2="320"
          y2="190"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="180"
          y1="220"
          x2="280"
          y2="220"
          stroke={colors.accent}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="180"
          y1="250"
          x2="320"
          y2="250"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="180"
          y1="280"
          x2="300"
          y2="280"
          stroke={colors.accent}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="180"
          y1="310"
          x2="320"
          y2="310"
          stroke={colors.primary}
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />

        {/* Shield/Protection icon on document */}
        <motion.circle
          cx="250"
          cy="190"
          r="30"
          fill={colors.primary}
          opacity="0.1"
          animate={{
            r: [30, 33, 30],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <path
          d="M250 170 L260 185 L250 200 L240 185 Z"
          fill={colors.primary}
          opacity="0.3"
        />

        {/* Refund symbol - arrow returning */}
        <motion.g
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "250px 310px" }}
        >
          <circle
            cx="250"
            cy="310"
            r="20"
            fill="none"
            stroke={colors.accent}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M240 300 L250 290 L260 300"
            stroke={colors.accent}
            strokeWidth="2"
            fill="none"
          />
        </motion.g>
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

function RefundCancellation() {
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
              <RefundIllustration />
            </div>

            {/* Key Points */}
            <div className="space-y-6">
              {[
                {
                  icon: FeatherShield,
                  title: "Secure Payments",
                  desc: "Processed securely through Dodo Payments, our Merchant of Record",
                },
                {
                  icon: FeatherClock,
                  title: "7-Day Refund Window",
                  desc: "Refund requests must be submitted within 7 days of charge",
                },
                {
                  icon: FeatherFileText,
                  title: "Clear Cancellation",
                  desc: "Cancel anytime - you keep access until the end of your billing period",
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
                  Refund & Cancellation Policy
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
              <PolicySection title="1. Merchant of Record & Payments" delay={0.25}>
                <p>
                  All payments for subscriptions and services on this website are processed securely
                  through our Merchant of Record, Dodo Payments. Dodo Payments acts as the
                  authorized reseller of our services and will appear as the seller on your billing
                  statement. They are responsible for payment processing, tax calculation, and
                  regulatory compliance.
                </p>
                <p className="mt-2">
                  For any billing inquiries, please contact us at{" "}
                  <a
                    href="mailto:support@unitalent.com"
                    className="hover:underline"
                    style={{ color: colors.primary }}
                  >
                    support@unitalent.com
                  </a>.
                </p>
              </PolicySection>

              <PolicySection title="2. Subscription Model" delay={0.3}>
                <p>
                  Our services are offered on a recurring subscription basis (monthly or annual, as
                  selected at checkout). By purchasing a subscription, you authorize recurring charges
                  until you cancel.
                </p>
                <p className="mt-2">
                  Subscriptions automatically renew at the end of each billing cycle unless canceled
                  before the renewal date.
                </p>
              </PolicySection>

              <PolicySection title="3. Cancellation Policy" delay={0.35}>
                <p>You may cancel your subscription at any time by:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Logging into your account and using the cancellation feature, or</li>
                  <li>
                    Contacting our support team at{" "}
                    <a
                      href="mailto:support@unitalent.com"
                      className="hover:underline"
                      style={{ color: colors.primary }}
                    >
                      support@unitalent.com
                    </a>
                  </li>
                </ul>
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}08` }}>
                  <p className="font-medium" style={{ color: colors.accent }}>Important:</p>
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    <li>Cancellation stops future renewals</li>
                    <li>You will retain access to the service until the end of your current paid billing period</li>
                    <li>Cancellation does not retroactively refund previous payments unless explicitly stated below</li>
                    <li>It is your responsibility to cancel before your renewal date</li>
                  </ul>
                </div>
              </PolicySection>

              <PolicySection title="4. Refund Policy" delay={0.4}>
                <p className="font-medium">4.1 General Policy</p>
                <p>
                  Due to the nature of SaaS and immediate access to digital services, we generally do
                  not offer refunds for subscription payments, except in the following circumstances:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Duplicate charges</li>
                  <li>Billing errors</li>
                  <li>
                    Technical failure preventing access to core functionality that we are unable to
                    resolve within a reasonable timeframe
                  </li>
                </ul>
                <p className="mt-2">
                  Where required by applicable law, refund requests must be submitted within 7 days
                  of the charge date.
                </p>

                <p className="font-medium mt-4">4.2 Non-Refundable Situations</p>
                <p>We do not provide refunds for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Partial subscription periods</li>
                  <li>Unused time after cancellation</li>
                  <li>Failure to cancel before renewal</li>
                  <li>Change of mind</li>
                  <li>Lack of usage</li>
                </ul>
              </PolicySection>

              <PolicySection title="5. Refund Processing" delay={0.45}>
                <p>If a refund is approved:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>It will be processed through Dodo Payments</li>
                  <li>The refund will be issued to the original payment method</li>
                  <li>
                    Processing times typically range from 5–10 business days, depending on
                    your bank or payment provider
                  </li>
                  <li>
                    Transaction processing fees may be non-refundable where permitted by law
                  </li>
                </ul>
              </PolicySection>

              <PolicySection title="6. Chargebacks & Payment Disputes" delay={0.5}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Because payments are processed by Dodo Payments as Merchant of Record,
                    any chargebacks will be handled through their formal dispute process
                  </li>
                  <li>
                    If you initiate a chargeback without contacting us first, we reserve the right to:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Suspend or terminate your account</li>
                      <li>Restrict future access to our services</li>
                      <li>Submit usage and transaction records to assist in dispute resolution</li>
                    </ul>
                  </li>
                </ul>
                <p className="mt-2">
                  We strongly encourage contacting us first to resolve any billing issues.
                </p>
              </PolicySection>

              <PolicySection title="7. Statutory Rights" delay={0.55}>
                <p>
                  Nothing in this policy limits any mandatory consumer protection rights that may
                  apply in your jurisdiction. Where local law requires refund rights (including certain
                  cooling-off periods), those rights will apply.
                </p>
              </PolicySection>
            </div>

            {/* Contact Support Button */}
            <motion.div
              className="mt-8 text-center border-t pt-6"
              style={{ borderColor: colors.neutral[200] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm mb-3" style={{ color: colors.neutral[600] }}>
                Have questions about our policy?
              </p>
              <a
                href="mailto:support@unitalent.com"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.primary,
                  color: "white",
                }}
              >
                Contact Support
              </a>
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

export default RefundCancellation;