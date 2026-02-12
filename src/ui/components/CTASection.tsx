'use client';

import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { uniTalentColors } from 'src/common/Colors';

const CTASection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="contact" className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background */}
      <div 
        style={{ backgroundColor: uniTalentColors.background }}
        className="absolute inset-0"
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
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 sm:mb-8"
          >
            Ready to get your fair shot?
          </h2>

          {/* Subheading */}
          <p 
            style={{ color: uniTalentColors.text }}
            className="text-base sm:text-lg lg:text-xl opacity-80 leading-relaxed max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14"
          >
            Join thousands of Product Managers breaking through the broken hiring system. Start your free assessment today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row gap-4 sm:gap-6 justify-center max-w-2xl mx-auto">
            {/* Sign Up Button */}
            <Link to="/signup" 
              style={{
                background: `linear-gradient(135deg, ${uniTalentColors.primary} 0%, ${uniTalentColors.secondary || '#FFEDB2'} 100%)`,
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            {/* Login Button */}
            <Link to="/login" 
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

          {/* Stats Row - Single Line */}
          <div className="mt-12 sm:mt-16 lg:mt-20 flex justify-center items-center gap-6 sm:gap-8 lg:gap-12 flex-wrap">
            <div className="flex items-center gap-2">
              <span 
                style={{ color: uniTalentColors.primary }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
              >
                5,000+
              </span>
              <span 
                style={{ color: uniTalentColors.text }}
                className="text-xs sm:text-sm opacity-70"
              >
                PMs Transformed
              </span>
            </div>

            <div 
              style={{ backgroundColor: uniTalentColors.primary }}
              className="w-px h-6 opacity-30"
            />

            <div className="flex items-center gap-2">
              <span 
                style={{ color: uniTalentColors.primary }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
              >
                3.2x
              </span>
              <span 
                style={{ color: uniTalentColors.text }}
                className="text-xs sm:text-sm opacity-70"
              >
                More Interviews
              </span>
            </div>

            <div 
              style={{ backgroundColor: uniTalentColors.primary }}
              className="w-px h-6 opacity-30"
            />

            <div className="flex items-center gap-2">
              <span 
                style={{ color: uniTalentColors.primary }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
              >
                85%
              </span>
              <span 
                style={{ color: uniTalentColors.text }}
                className="text-xs sm:text-sm opacity-70"
              >
                Success Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
};

export default CTASection;