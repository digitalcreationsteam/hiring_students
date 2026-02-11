'use client';

import { useEffect, useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';

const SolutionSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Talent Ranking",
      description: "Based on what you can actually do, not who you know."
    },
    {
      title: "Discovery Platform",
      description: "Recruiters find you based on merit and real work."
    },
    {
      title: "Merit-Based",
      description: "Skills matter. Keywords and schools don't."
    }
  ];

  return (
    <section id="solution" className="relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden">
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
            Solution
          </span>
        </div>

        {/* Main Heading */}
        <h2 
          style={{ color: uniTalentColors.text }}
          className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-8 sm:mb-12 lg:mb-16"
        >
          Introducing UniTalent.
        </h2>

        {/* Main Description */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <p 
            style={{ color: uniTalentColors.text }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed opacity-85 max-w-4xl mb-6 sm:mb-8"
          >
            A Talent Ranking & Discovery Platform for Product Managers.
          </p>

          <p 
            style={{ color: uniTalentColors.text }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed opacity-85 max-w-4xl"
          >
            We built UniTalent because we believe hiring should work differently. Not based on who you know or how well you can game an ATS system, but on <span style={{ color: uniTalentColors.primary }} className="font-bold">what you can actually do.</span>
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group"
            >
              {/* Feature Number */}
              <span 
                style={{ color: uniTalentColors.primary }}
                className="text-xs sm:text-sm font-bold opacity-40 mb-3 block"
              >
                0{index + 1}
              </span>

              {/* Feature Title */}
              <h3 
                style={{ color: uniTalentColors.text }}
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 leading-tight"
              >
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p 
                style={{ color: uniTalentColors.text }}
                className="text-sm sm:text-base opacity-70 leading-relaxed"
              >
                {feature.description}
              </p>

              {/* Animated underline */}
              <div 
                className="mt-4 h-0.5 w-12 rounded-full transition-all duration-500 group-hover:w-8"
                style={{ backgroundColor: uniTalentColors.primary }}
              />
            </div>
          ))}
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

export default SolutionSection;