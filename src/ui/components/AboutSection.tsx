'use client';

import { useEffect, useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';
import { useInView } from 'src/hooks/useInView';

const AboutSection = () => {
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
      id="about"
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
        {/* Main Content */}
        <div>
          {/* Heading */}
          <h2
            style={{ color: uniTalentColors.text }}
            className="stagger-item text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 sm:mb-8 lg:mb-10"
          >
            The Hiring System is Broken
          </h2>

          {/* Paragraph 1 */}
          <p
            style={{ color: uniTalentColors.text }}
            className="stagger-item text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 opacity-85 max-w-4xl"
          >
            You've done everything right. You learned the frameworks. You built projects. You practiced case studies. You know you'd crush this job. But when you hit submit, nothing happens. No response. No rejection. Just silence.
          </p>

          {/* Paragraph 2 */}
          <p
            style={{ color: uniTalentColors.text }}
            className="stagger-item text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 opacity-85 max-w-4xl"
          >
            Meanwhile, someone with less experience gets the interview. Why? Because they knew someone. Because their resume had the right keywords. Because the system wasn't built to find talent like you—it was built for the well-connected.
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

        /* Stagger delays – each child gets a progressively longer delay */
        section.is-visible .stagger-item:nth-child(1) { transition-delay: 0.1s; }
        section.is-visible .stagger-item:nth-child(2) { transition-delay: 0.3s; }
        section.is-visible .stagger-item:nth-child(3) { transition-delay: 0.5s; }
        section.is-visible .stagger-item:nth-child(4) { transition-delay: 0.7s; }
        section.is-visible .stagger-item:nth-child(5) { transition-delay: 0.9s; }

        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;