'use client';

import { useEffect, useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';

const AboutSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="about" className="relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden">
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
        {/* Section Label */}
        <div className="mb-8 sm:mb-12">
          <span 
            style={{ color: uniTalentColors.primary }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-widest"
          >
            About
          </span>
        </div>

        {/* Main Content */}
        <div>
          {/* Heading */}
          <h2 
            style={{ color: uniTalentColors.text }}
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 sm:mb-8 lg:mb-10"
          >
            This isn't another keynote conference.
          </h2>

          {/* Paragraph 1 */}
          <p 
            style={{ color: uniTalentColors.text }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 opacity-85 max-w-4xl"
          >
            You've done everything right. You learned the frameworks. You built projects. You practiced case studies. You know you'd crush this job. But when you hit submit, nothing happens. No response. No rejection. Just silence.
          </p>

          {/* Paragraph 2 */}
          <p 
            style={{ color: uniTalentColors.text }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 opacity-85 max-w-4xl"
          >
            Meanwhile, someone with less experience gets the interview. Why? Because they knew someone. Because their resume had the right keywords. Because the system wasn't built to find talent like you—it was built for the well-connected.
          </p>
          
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

export default AboutSection;