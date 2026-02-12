'use client';

import { useEffect, useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        {/* Video Element */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isVideoLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          {/* Replace with your video path */}
          <source src="/Live_Video_HomePage.mp4" type="video/mp4" />
        </video>

        {/* Fallback Gradient Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(30, 30, 30, 0.7) 100%)`,
            opacity: isVideoLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
          }}
        />

        {/* Dark Overlay for Content Readability */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(0, 0, 0, 0.3) 0%, 
              rgba(0, 0, 0, 0.5) 50%, 
              rgba(0, 0, 0, 0.4) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Animated Grid Overlay (Optional) */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${uniTalentColors.primary} 1px, transparent 1px),
              linear-gradient(${uniTalentColors.primary} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.1}px)`,
            pointerEvents: 'none',
          }}
        />

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: uniTalentColors.primary,
                animation: `float-particle ${Math.random() * 10 + 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Status Badge *
          <div className="mb-8 sm:mb-10 lg:mb-12 animate-fade-in-down">
            <div 
              className="inline-block px-4 sm:px-5 py-2 rounded-full border border-opacity-50 backdrop-blur-sm"
              style={{
                borderColor: uniTalentColors.primary,
                backgroundColor: `${uniTalentColors.primary}15`,
              }}
            >
              <span 
                style={{ color: uniTalentColors.primary }}
                className="text-xs sm:text-sm font-semibold uppercase tracking-widest"
              >
                ✨ New Approach
              </span>
            </div>
          </div>/}

          {/* Main Tagline - Large and Bold */}
          <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-in-up">
            <h1 
              style={{ color: '#FFFFFF' }}
              className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 lg:mb-8"
            >
              Reimagining Talent Discovery
            </h1>
            
            {/* Gradient Text 
            <h2 
              className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              style={{
                background: `linear-gradient(90deg, 
                  ${uniTalentColors.primary} 0%, 
                  ${uniTalentColors.primaryLight || '#FFEDB2'} 50%, 
                  ${uniTalentColors.primary} 100%)`,
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                animation: 'textShimmer 8s infinite linear',
              }}
            >
              So Why Aren't You Getting Interviews?
            </h2>
            */}    

          </div>

          {/* Subtitle */}
          <p 
            style={{ color: 'rgba(255, 255, 255, 0.85)', animationDelay: '0.2s',  }}
            className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed animate-fade-in-up"
          >
            The hiring system is broken. We help you break through it.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' } as React.CSSProperties}>
            <button 
              style={{ 
                background: `linear-gradient(135deg, ${uniTalentColors.primary} 0%, ${uniTalentColors.primaryLight || '#FFEDB2'} 100%)`,
                color: uniTalentColors.lightGray,
                boxShadow: `0 8px 30px ${uniTalentColors.primary}66`,
              }}
              className="w-full sm:flex-1 py-3 sm:py-4 px-6 sm:px-8 font-bold rounded-lg sm:rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group text-sm sm:text-base"
            >
              <span className="flex items-center justify-center">
                Get Your Fair Shot
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            
            <button 
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                backdropFilter: 'blur(10px)',
              }}
              className="w-full sm:flex-1 py-3 sm:py-4 px-6 sm:px-8 font-bold rounded-lg sm:rounded-xl border-2 hover:bg-white hover:bg-opacity-20 hover:shadow-lg active:scale-95 transition-all duration-300 group text-sm sm:text-base"
            >
              <span className="flex items-center justify-center">
                See How It Works
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:rotate-180 transition-transform duration-300"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        style={{ color: uniTalentColors.primary }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.1;
          }
          50% {
            transform: translate(var(--tx, 20px), var(--ty, -30px));
            opacity: 0.3;
          }
        }

        @keyframes textShimmer {
          0% {
            backgroundPosition: 200% auto;
          }
          100% {
            backgroundPosition: -200% auto;
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        /* Responsive text sizing */
        @media (max-width: 640px) {
          h1 {
            line-height: 1.1;
          }
          h2 {
            line-height: 1.2;
          }
        }

        /* Video performance optimization */
        video {
          -webkit-user-select: none;
          user-select: none;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;