// src/components/FeaturesSection.tsx - Updated with color variables
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
    <section className="py-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 style={{ color: uniTalentColors.text }} className="text-3xl md:text-4xl font-bold mb-4">
            Here's how it works:
          </h2>
          <p style={{ color: uniTalentColors.text }} className="text-xl opacity-80 max-w-3xl mx-auto">
            Instead of sending another resume into the void, you demonstrate real PM skills through verified assessments.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-0">
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: uniTalentColors.background,
                borderColor: uniTalentColors.lightGray
              }}
              className="group p-8 rounded-2xl border hover:border-#060606 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
            >
              {/* Icon Container with Hover Effect */}
              <div className="mb-6 relative z-10">
                <div 
                  style={{ 
                    backgroundColor: uniTalentColors.primary,
                    borderColor: uniTalentColors.lightGray
                  }}
                  className="inline-flex p-3 rounded-xl border group-hover:scale-110 transition-transform duration-300"
                >
                  <div style={{ color: uniTalentColors.text }}>
                    {feature.icon}
                  </div>
                </div>
              </div>
              
              {/* Feature Content */}
              <div className="relative z-10">
                <h3 style={{ color: uniTalentColors.text }} className="text-xl font-bold mb-4 group-hover:opacity-100 transition-opacity duration-300">
                  {feature.title}
                </h3>
                
                <p style={{ color: uniTalentColors.text }} className="opacity-80 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>
              
              {/* Animated Bottom Border */}
              <div className="relative z-10">
                <div 
                  style={{ borderColor: uniTalentColors.lightGray }}
                  className="mt-6 pt-6 border-t"
                >
                  <div 
                    style={{ backgroundColor: uniTalentColors.primary }}
                    className="h-1 w-0 group-hover:w-full transition-all duration-500 ease-out"
                  ></div>
                </div>
              </div>

              {/* Subtle Background Pattern on Hover */}
              <div 
                style={{ backgroundColor: uniTalentColors.primary }}
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
              ></div>
            </div>
          ))}
        </div>

        {/* Closing Statement 
        <div className="text-center">
          <div 
            style={{ 
              backgroundColor: uniTalentColors.primary,
              borderColor: uniTalentColors.lightGray
            }}
            className="inline-block px-8 py-8 rounded-2xl border max-w-4xl mx-auto relative overflow-hidden"
          >
            {/* Background Pattern }
            <div 
              style={{ backgroundColor: uniTalentColors.text }}
              className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-5"
            ></div>
            <div 
              style={{ backgroundColor: uniTalentColors.text }}
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12 opacity-5"
            ></div>

            <div className="relative z-10">
              <p style={{ color: uniTalentColors.text }} className="text-2xl md:text-3xl font-bold mb-4">
                This is what merit-based hiring looks like.
              </p>
              <p style={{ color: uniTalentColors.text }} className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                And it starts with you taking the first assessment. Join thousands of Product Managers who've found their dream roles through UniTalent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  style={{ 
                    backgroundColor: uniTalentColors.text,
                    color: uniTalentColors.background
                  }}
                  className="font-semibold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start Free Assessment
                </button>
                
                <button 
                  style={{ 
                    backgroundColor: uniTalentColors.background,
                    color: uniTalentColors.text,
                    borderColor: uniTalentColors.text
                  }}
                  className="font-semibold py-3 px-8 rounded-xl border hover:opacity-80 hover:border-#FFD85F hover:shadow-lg transition-all duration-300"
                >
                  View Success Stories →
                </button>
              </div>
            </div>
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default FeaturesSection;