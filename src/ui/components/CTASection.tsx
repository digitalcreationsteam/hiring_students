'use client';

import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { uniTalentColors } from 'src/common/Colors';
import { useInView } from 'src/hooks/useInView';

const CTASection = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isInView ? 'is-visible' : ''
      }`}
    >
      {/* Background with opacity transition */}
      <div
        style={{ backgroundColor: uniTalentColors.background }}
        className={`absolute inset-0 transition-opacity duration-700 ${
          isInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${uniTalentColors.primary} 1px, transparent 1px),
              linear-gradient(${uniTalentColors.primary} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.05}px)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center">
          {/* Heading */}
          <h2
            style={{ color: uniTalentColors.text }}
            className="stagger-item text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 sm:mb-8"
          >
            Ready to get your fair shot?
          </h2>

          {/* Subheading */}
          <p
            style={{ color: uniTalentColors.text }}
            className="stagger-item text-base sm:text-lg lg:text-xl opacity-80 leading-relaxed max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14"
          >
            Join thousands of Product Managers breaking through the broken hiring system. Start your free assessment today.
          </p>

          {/* CTA Buttons (as a block) */}
          <div className="stagger-item flex flex-col xs:flex-row gap-4 sm:gap-6 justify-center max-w-2xl mx-auto">
            {/* Sign Up Button */}
            <Link
              to="/signup"
              style={{
                background: `linear-gradient(135deg, ${uniTalentColors.primary} 0%, ${
                  uniTalentColors.secondary || '#FFEDB2'
                } 100%)`,
                color: uniTalentColors.lightGray,
                boxShadow: `0 8px 20px ${uniTalentColors.primary}66`,
              }}
              className="w-full xs:flex-1 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group text-sm sm:text-base"
            >
              <span className="flex items-center justify-center">
                Sign Up Free
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>

            {/* Login Button */}
            <Link
              to="/login"
              style={{
                backgroundColor: 'transparent',
                color: uniTalentColors.text,
                borderColor: uniTalentColors.primary,
              }}
              className="w-full xs:flex-1 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl border-2 border-opacity-50 hover:border-opacity-100 hover:shadow-lg active:scale-95 transition-all duration-300 text-sm sm:text-base"
            >
              Log In
            </Link>
          </div>

        </div>
      </div>

      {/* Stagger animation styles */}
      <style>{`
        .stagger-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        section.is-visible .stagger-item {
          opacity: 1;
          transform: translateY(0);
        }

        /* Stagger delays – adjust timing as desired */
        section.is-visible .stagger-item:nth-child(1) { transition-delay: 0.1s; } /* heading */
        section.is-visible .stagger-item:nth-child(2) { transition-delay: 0.3s; } /* subheading */
        section.is-visible .stagger-item:nth-child(3) { transition-delay: 0.5s; } /* buttons */
        section.is-visible .stagger-item:nth-child(4) { transition-delay: 0.7s; } /* stats row */

        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
};

export default CTASection;