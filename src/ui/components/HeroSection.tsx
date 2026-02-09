// src/components/HeroSection.tsx - Updated Grid Section Only
'use client';

import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [gradientPos, setGradientPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Animate gradient position
    const gradientInterval = setInterval(() => {
      setGradientPos((prev) => (prev + 1) % 100);
    }, 50);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(gradientInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Light Background with VERY VISIBLE Grid */}
      <div 
        style={{ backgroundColor: '#F8F8F8' }}
        className="absolute inset-0"
      >
        {/* PRIMARY VISIBLE GRID - Much Darker and Clearer */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #FFD85F 1px, transparent 1px),
              linear-gradient(#FFD85F 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `
              translateX(${scrollY * 0.05}px)
              translateY(${scrollY * 0.1}px)
            `,
          }}
        />
        
        {/* Secondary Moving Grid Pattern - More Visible */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 29px,
                #060606 29px,
                #060606 30px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 29px,
                #060606 29px,
                #060606 30px
              )
            `,
            backgroundSize: '60px 60px',
            transform: `
              translateX(${-gradientPos * 0.3}px)
              translateY(${-gradientPos * 0.2}px)
            `,
          }}
        />
        
        {/* Animated Grid Lines - Very Visible */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 216, 95, 0.2) 50%, 
                transparent 100%)
            `,
            backgroundSize: '300px 100%',
            animation: 'gridShine 6s linear infinite',
          }}
        />
      </div>

      {/* Grid Intersection Points - Very Visible */}
      <div className="absolute inset-0">
        {/* Create grid intersection dots */}
        {[...Array(100)].map((_, i) => {
          const x = (i * 10) % 100;
          const y = Math.floor(i / 10) * 10;
          return (
            <div
              key={i}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${1 + Math.sin(scrollY * 0.01 + i) * 0.3})`,
              }}
              className="absolute w-1.5 h-1.5 rounded-full transition-all duration-300"
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{ 
                  backgroundColor: '#FFD85F',
                  boxShadow: '0 0 10px #FFD85F',
                  opacity: 0.8,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Your existing content continues below exactly as it was... */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Rest of your content remains exactly the same */}
        <div className="text-center">

          {/* Animated Logo/Brand 
          <div className="mb-12">
            <h1 
              style={{ 
                color: '#060606',
              }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4"
            >
              UniTalent
            </h1>
            <div className="h-1 w-32 mx-auto overflow-hidden">
              <div 
                style={{ backgroundColor: '#FFD85F' }}
                className="h-full w-full animate-slide-right"
              />
            </div>
          </div>
          /*}

          {/* Main Heading with Animated Gradient */}
          <div className="mb-16">
            <div className="relative inline-block">
              <h2 
                style={{ color: '#060606' }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              >
                You've Done Everything Right.
              </h2>
              
              {/* Animated Gradient Text */}
              <div className="relative">
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 leading-tight"
                  style={{
                    background: `linear-gradient(90deg, 
                      #FFD85F 0%, 
                      #b6b1a1 25%, 
                      #FFD85F 50%, 
                      #8f8d85 75%, 
                      #FFD85F 100%)`,
                    backgroundSize: '200% auto',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    animation: 'textShimmer 5s infinite linear',
                  }}
                >
                  So Why Aren't You Getting Interviews?
                </h2>
                
                {/* Glow Effect - Subtle */}
                <div 
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 216, 95, 0.2) 0%, transparent 70%)',
                    filter: 'blur(15px)',
                  }}
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-6 opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Problem Points - Light Theme Design */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
              {/* Point 1 */}
              <div className="relative group">
                <div 
                  style={{ 
                    backgroundColor: '#F8F8F8',
                    borderColor: '#FFD85F'
                  }}
                  className="p-8 rounded-2xl border-2 border-opacity-30 group-hover:border-opacity-100 transition-all duration-500 group-hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300"
                      style={{ 
                        backgroundColor: '#FFD85F',
                        boxShadow: '0 4px 15px rgba(255, 216, 95, 0.3)'
                      }}
                    >
                      <svg className="w-7 h-7" style={{ color: '#060606' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 style={{ color: '#060606' }} className="text-2xl font-bold mb-3">
                      The Silence
                    </h3>
                  </div>
                  <p style={{ color: '#060606' }} className="text-lg opacity-80 leading-relaxed">
                    You polish your resume, customize cover letters, submit applications... and hear nothing back.
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="relative group">
                <div 
                  style={{ 
                    backgroundColor: '#F8F8F8',
                    borderColor: '#FFD85F'
                  }}
                  className="p-8 rounded-2xl border-2 border-opacity-30 group-hover:border-opacity-100 transition-all duration-500 group-hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300"
                      style={{ 
                        backgroundColor: '#FFD85F',
                        boxShadow: '0 4px 15px rgba(255, 216, 95, 0.3)'
                      }}
                    >
                      <svg className="w-7 h-7" style={{ color: '#060606' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 style={{ color: '#060606' }} className="text-2xl font-bold mb-3">
                      The Unfair Advantage
                    </h3>
                  </div>
                  <p style={{ color: '#060606' }} className="text-lg opacity-80 leading-relaxed">
                    Others with less experience get interviews through connections, keywords, or school names.
                  </p>
                </div>
              </div>
            </div>

            {/* Truth Statement - Light Theme */}
            <div className="relative">
              <div 
                style={{ 
                  background: 'linear-gradient(90deg, transparent, rgba(255, 216, 95, 0.15), transparent)',
                  transform: `translateX(${gradientPos * 2 - 100}%)`,
                }}
                className="absolute inset-0 rounded-2xl"
              />
              <div 
                style={{ 
                  backgroundColor: '#F8F8F8',
                  borderColor: '#FFD85F'
                }}
                className="relative py-8 px-8 rounded-2xl border-2 shadow-lg"
              >
                <p 
                  style={{ color: '#060606' }}
                  className="text-2xl md:text-3xl font-bold mb-4"
                >
                  <span style={{ color: '#FFD85F' }} className="font-extrabold">The truth:</span> It's not your skills. The hiring system is broken—designed to filter out talent like yours.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto">
            <p 
              style={{ color: '#060606' }}
              className="text-xl opacity-90 mb-8 animate-fade-in-up"
            >
              Ready to break through the broken system?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                style={{ 
                  background: 'linear-gradient(135deg, #FFD85F 0%, #FFEDB2 100%)',
                  color: '#060606',
                  boxShadow: '0 10px 30px rgba(255, 216, 95, 0.4)',
                }}
                className="px-8 py-4 font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <span className="flex items-center justify-center">
                  Get Your Fair Shot
                  <svg 
                    className="w-5 h-5 ml-2 transform group-hover:translateX-2 transition-transform duration-300"
                    style={{ color: '#060606' }}
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
                  backgroundColor: 'transparent',
                  color: '#060606',
                  borderColor: '#D9D9D9',
                }}
                className="px-8 py-4 font-bold rounded-xl border-2 hover:border-#FFD85F hover:shadow-lg transition-all duration-300 group"
              >
                <span className="flex items-center justify-center">
                  See How It Works
                  <svg 
                    className="w-5 h-5 ml-2 transform group-hover:rotate-180 transition-transform duration-300"
                    style={{ color: '#060606' }}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Stats - Light Theme */}
            <div 
              style={{ 
                backgroundColor: '#F8F8F8',
                borderColor: '#FFD85F',
                boxShadow: '0 8px 25px rgba(255, 216, 95, 0.15)',
              }}
              className="inline-flex items-center gap-8 px-8 py-6 rounded-2xl border-2"
            >
              <div className="text-center">
                <div style={{ color: '#060606' }} className="text-3xl font-bold">5,000+</div>
                <div style={{ color: '#060606' }} className="text-sm opacity-80">PMs Transformed</div>
              </div>
              <div 
                style={{ backgroundColor: '#FFD85F' }}
                className="h-10 w-px"
              ></div>
              <div className="text-center">
                <div style={{ color: '#060606' }} className="text-3xl font-bold">3.2x</div>
                <div style={{ color: '#060606' }} className="text-sm opacity-80">More Interviews</div>
              </div>
              <div 
                style={{ backgroundColor: '#FFD85F' }}
                className="h-10 w-px"
              ></div>
              <div className="text-center">
                <div style={{ color: '#060606' }} className="text-3xl font-bold">85%</div>
                <div style={{ color: '#060606' }} className="text-sm opacity-80">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        style={{ color: '#FFD85F' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;