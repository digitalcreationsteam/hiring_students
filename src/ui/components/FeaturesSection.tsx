// src/components/FeaturesSection.tsx - Enhanced and optimized
'use client';

import { uniTalentColors } from 'src/common/Colors';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Skills-Based Assessments',
      description: 'Demonstrate your PM skills through assessments calibrated to real work scenarios, not resume keywords.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Verified Projects',
      description: 'Showcase actual projects that prove you can execute, not just theorize about product management.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Transparent Ranking',
      description: 'Get ranked fairly against other PMs so recruiters can see exactly where you stand.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      title: 'Visible to Recruiters',
      description: 'When recruiters search for Product Managers, they see ranked lists with proven capabilities.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: 'Smart Filtering',
      description: 'Recruiters filter by location, university, skill level—not just who you know.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      )
    },
    {
      title: 'Direct Access',
      description: 'No more resumes disappearing into ATS black holes. Just your skills and a fair shot.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div 
        style={{ backgroundColor: uniTalentColors.background }}
        className="absolute inset-0"
      >
        {/* Subtle Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${uniTalentColors.primary} 1px, transparent 1px),
              linear-gradient(${uniTalentColors.primary} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <span 
            style={{ color: uniTalentColors.primary }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-widest block mb-4"
          >
            How It Works
          </span>
          <h2 
            style={{ color: uniTalentColors.text }}
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-4xl"
          >
            Here's the difference.
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-20 lg:mb-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: uniTalentColors.background,
                borderColor: uniTalentColors.primary,
              }}
              className="group p-6 sm:p-7 lg:p-8 rounded-xl sm:rounded-2xl border-2 border-opacity-30 hover:border-opacity-100 transition-all duration-500 hover:shadow-lg relative overflow-hidden h-full flex flex-col"
            >
              {/* Icon Container with Hover Effect */}
              <div className="mb-5 sm:mb-6 relative z-10">
                <div 
                  style={{ 
                    backgroundColor: `${uniTalentColors.primary}20`,
                    borderColor: uniTalentColors.primary,
                  }}
                  className="inline-flex p-3 sm:p-3.5 rounded-lg sm:rounded-xl border border-opacity-50 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                >
                  <div style={{ color: uniTalentColors.primary }}>
                    {feature.icon}
                  </div>
                </div>
              </div>
              
              {/* Feature Content */}
              <div className="relative z-10 flex-1">
                <h3 
                  style={{ color: uniTalentColors.text }} 
                  className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 leading-tight"
                >
                  {feature.title}
                </h3>
                
                <p 
                  style={{ color: uniTalentColors.text }} 
                  className="text-sm sm:text-base opacity-75 leading-relaxed"
                >
                  {feature.description}
                </p>
              </div>
              
              {/* Animated Bottom Border */}
              <div className="relative z-10 mt-6 sm:mt-7 lg:mt-8">
                <div 
                  style={{ borderColor: `${uniTalentColors.primary}40` }}
                  className="pt-6 border-t"
                >
                  <div 
                    style={{ backgroundColor: uniTalentColors.primary }}
                    className="h-1 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full"
                  />
                </div>
              </div>

              {/* Subtle Background Pattern on Hover */}
              <div 
                style={{ backgroundColor: uniTalentColors.primary }}
                className="absolute inset-0 opacity-0 group-hover:opacity-3 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-16 sm:mb-20 lg:mb-24 items-center">
          {/* Left Side - The Problem */}
          <div>
            <h3 
              style={{ color: uniTalentColors.text }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8"
            >
              The Old Way
            </h3>
            
            <ul className="space-y-4 sm:space-y-5">
              {[
                'Resumes disappear into ATS black holes',
                'Identical-looking applications',
                'Filtered by keywords, not skills',
                'Referrals matter more than talent',
                'No idea where you stand'
              ].map((item, idx) => (
                <li 
                  key={idx}
                  style={{ color: uniTalentColors.text }}
                  className="flex items-start text-sm sm:text-base opacity-75"
                >
                  <svg 
                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 opacity-40" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - UniTalent */}
          <div>
            <h3 
              style={{ color: uniTalentColors.text }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8"
            >
              <span style={{ color: uniTalentColors.primary }}>UniTalent</span> Way
            </h3>
            
            <ul className="space-y-4 sm:space-y-5">
              {[
                'Your profile is immediately visible',
                'Ranked based on proven skills',
                'Filtered by actual capabilities',
                'Merit matters—not connections',
                'Clear visibility into your ranking'
              ].map((item, idx) => (
                <li 
                  key={idx}
                  style={{ color: uniTalentColors.text }}
                  className="flex items-start text-sm sm:text-base opacity-85"
                >
                  <svg 
                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                    style={{ color: uniTalentColors.primary }}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
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

export default FeaturesSection;