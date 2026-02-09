// src/components/TrustSection.tsx - Updated with color variables
import { uniTalentColors } from 'src/common/Colors';

const TrustSection = () => {
  const companies = ['TechCorp', 'InnovateCo', 'GrowthLabs', 'ProductHub', 'StartupGrid'];
  
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p 
          style={{ color: uniTalentColors.text }}
          className="text-center opacity-60 text-sm uppercase tracking-wider font-medium mb-6"
        >
          Trusted by Product Leaders From
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {companies.map((company) => (
            <div 
              key={company}
              className="group relative"
            >
              <div 
                style={{ color: uniTalentColors.text }}
                className="text-2xl font-bold opacity-40 group-hover:opacity-60 transition-opacity duration-300 group-hover:scale-105"
              >
                {company}
              </div>
              <div 
                style={{ borderColor: uniTalentColors.primary }}
                className="absolute inset-0 border-2 border-transparent group-hover:border rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;