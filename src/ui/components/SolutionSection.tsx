'use client';

import { useEffect, useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';
import { useInView } from 'src/hooks/useInView';

const SolutionSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
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
      description: "Based on your experience, education, awards, extracurriculars."
    },
    {
      title: "Discovery Platform",
      description: "Recruiters find you based on merit and real work, not on your connection in the company"
    },
    {
      title: "Merit-Based",
      description: "Skills matter. Keywords and schools don't."
    }
  ];

  return (
    <section
      id="solution"
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isInView ? 'is-visible' : ''
      }`}
    >
      {/* Background with subtle grid */}
      <div
        style={{ backgroundColor: uniTalentColors.background }}
        className={`absolute inset-0 transition-opacity duration-700 ${
          isInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
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
  
        {/* Main Heading */}
        <h2
          style={{ color: uniTalentColors.text }}
          className="stagger-item text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-8 sm:mb-12 lg:mb-16"
        >
          Introducing UniTalent.
        </h2>

        {/* Main Description */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <p
            style={{ color: uniTalentColors.text }}
            className="stagger-item text-base sm:text-lg lg:text-xl leading-relaxed opacity-85 max-w-4xl mb-6 sm:mb-8"
          >
            A Talent Ranking & Discovery Platform for Product Managers.
          </p>

          <p
            style={{ color: uniTalentColors.text }}
            className="stagger-item text-base sm:text-lg lg:text-xl leading-relaxed opacity-85 max-w-4xl"
          >
            We built UniTalent because we believe hiring should work differently. Not based on who you know or how well you can game an ATS system, but on{' '}
            <span style={{ color: uniTalentColors.primary }} className="font-bold">
              what you can actually do.
            </span>
          </p>
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
        section.is-visible .stagger-item:nth-child(1) { transition-delay: 0.1s; } /* label */
        section.is-visible .stagger-item:nth-child(2) { transition-delay: 0.3s; } /* heading */
        section.is-visible .stagger-item:nth-child(3) { transition-delay: 0.5s; } /* first description */
        section.is-visible .stagger-item:nth-child(4) { transition-delay: 0.7s; } /* second description */
        section.is-visible .stagger-item:nth-child(5) { transition-delay: 0.9s; } /* first feature card */
        section.is-visible .stagger-item:nth-child(6) { transition-delay: 1.1s; } /* second feature card */
        section.is-visible .stagger-item:nth-child(7) { transition-delay: 1.3s; } /* third feature card */

        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
};

export default SolutionSection;