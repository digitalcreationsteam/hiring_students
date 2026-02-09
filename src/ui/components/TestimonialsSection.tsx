// src/components/TestimonialsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { uniTalentColors } from 'src/common/Colors';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Senior Product Manager at TechCorp',
      quote: 'UniTalent completely changed my job search. After 6 months of rejections, I got 3 interviews in my first week using the platform and landed my dream role at TechCorp.',
      rating: 5,
      initials: 'AC',
      before: '6 months job search',
      after: '3 offers in 2 weeks'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Product Lead at InnovateCo',
      quote: 'The skills-based assessment was a game-changer. Instead of just talking about frameworks, I could show exactly what I could do. Recruiters noticed immediately.',
      rating: 5,
      initials: 'SJ',
      before: '0 interviews in 3 months',
      after: 'Hired in 45 days'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Head of Product at GrowthLabs',
      quote: 'I was stuck in mid-level roles for years. UniTalent\'s transparent ranking showed recruiters I was ready for leadership. Now I lead a team of 15 PMs.',
      rating: 5,
      initials: 'MR',
      before: 'Mid-level for 5 years',
      after: 'Promoted to Head of Product'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      role: 'Product Manager at ProductHub',
      quote: 'Coming from a non-traditional background, my resume was always filtered out. UniTalent gave me a fair shot based on my skills, not my pedigree.',
      rating: 5,
      initials: 'PS',
      before: 'No-name school, 0 referrals',
      after: 'Top 5% ranking on UniTalent'
    },
    {
      id: 5,
      name: 'David Wilson',
      role: 'Director of Product at StartupGrid',
      quote: 'The verified projects feature is brilliant. Instead of writing "led cross-functional teams," I could show the actual product metrics I improved.',
      rating: 5,
      initials: 'DW',
      before: 'Generic resume bullet points',
      after: 'Verified 40% revenue growth'
    },
    {
      id: 6,
      name: 'Emma Thompson',
      role: 'Senior PM at ScaleTech',
      quote: 'After being laid off, I thought my career was over. UniTalent helped me showcase my skills better than any resume ever could. Multiple offers in weeks.',
      rating: 5,
      initials: 'ET',
      before: 'Laid off, no network',
      after: '4 competing offers'
    }
  ];

  const stats = [
    { value: '3.2x', label: 'More interviews than traditional applicants' },
    { value: '94%', label: 'Of users get interviews within 30 days' },
    { value: '85%', label: 'Success rate for landing PM roles' },
    { value: '4.8/5', label: 'Average user rating' }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    if (isMobile) {
      return [testimonials[currentIndex]];
    }
    // For desktop, show current and next two
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div 
        style={{ backgroundColor: uniTalentColors.background }}
        className="absolute inset-0"
      >
        {/* Decorative elements */}
        <div 
          style={{ backgroundColor: uniTalentColors.primary }}
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5 blur-3xl"
        />
        <div 
          style={{ backgroundColor: uniTalentColors.primary }}
          className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-5 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div 
            style={{ 
              backgroundColor: `${uniTalentColors.primary}20`,
              color: uniTalentColors.primary
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <Quote className="w-4 h-4" />
            Real Success Stories
          </div>
          
          <h2 
            style={{ color: uniTalentColors.text }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Don't Just Take Our Word For It
          </h2>
          
          <p 
            style={{ color: uniTalentColors.text }}
            className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto"
          >
            See how Product Managers are breaking through the broken hiring system and landing their dream roles
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              style={{ 
                backgroundColor: uniTalentColors.background,
                borderColor: uniTalentColors.lightGray
              }}
              className="p-6 rounded-xl border text-center hover:border-#FFD85F transition-all duration-300 hover:scale-105"
            >
              <div 
                style={{ color: uniTalentColors.primary }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                {stat.value}
              </div>
              <p style={{ color: uniTalentColors.text }} className="text-sm opacity-80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows - Fixed positioning */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevTestimonial}
              style={{ 
                backgroundColor: uniTalentColors.primary,
                color: uniTalentColors.text
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg flex-shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex-1 mx-4">
              {/* Carousel indicators - only show on mobile */}
              <div className="flex justify-center gap-2 md:hidden">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'scale-125' : ''
                    }`}
                    style={{ 
                      backgroundColor: index === currentIndex 
                        ? uniTalentColors.primary 
                        : uniTalentColors.lightGray
                    }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={nextTestimonial}
              style={{ 
                backgroundColor: uniTalentColors.primary,
                color: uniTalentColors.text
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg flex-shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div 
                key={`${testimonial.id}-${index}`}
                style={{ 
                  backgroundColor: uniTalentColors.background,
                  borderColor: uniTalentColors.lightGray
                }}
                className="group p-6 md:p-8 rounded-2xl border hover:border-#FFD85F hover:shadow-xl transition-all duration-500 relative overflow-hidden h-full"
              >
                {/* Quote Icon */}
                <div 
                  style={{ color: uniTalentColors.primary }}
                  className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                >
                  <Quote className="w-16 h-16" />
                </div>

                {/* Before/After Badge */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <div className="flex-1 text-center sm:text-left">
                    <span 
                      style={{ color: uniTalentColors.text }}
                      className="text-xs opacity-70 mb-1 block"
                    >
                      Before UniTalent
                    </span>
                    <span 
                      style={{ color: uniTalentColors.text }}
                      className="text-sm font-semibold line-through opacity-60"
                    >
                      {testimonial.before}
                    </span>
                  </div>
                  
                  <div className="hidden sm:block">
                    <div 
                      style={{ 
                        backgroundColor: uniTalentColors.primary,
                        color: uniTalentColors.text
                      }}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                    >
                      →
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-right">
                    <span 
                      style={{ color: uniTalentColors.text }}
                      className="text-xs opacity-70 mb-1 block"
                    >
                      After UniTalent
                    </span>
                    <span 
                      style={{ color: uniTalentColors.primary }}
                      className="text-sm font-semibold"
                    >
                      {testimonial.after}
                    </span>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6 justify-center sm:justify-start">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i}
                        style={{ color: uniTalentColors.primary }}
                        className="w-5 h-5 fill-current"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p 
                    style={{ color: uniTalentColors.text }}
                    className="text-lg italic mb-8 leading-relaxed text-center sm:text-left min-h-[120px]"
                  >
                    "{testimonial.quote}"
                  </p>

                  {/* User Info */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t" 
                    style={{ borderColor: uniTalentColors.lightGray }}>
                    {/* Avatar with initials */}
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${uniTalentColors.primary}, ${uniTalentColors.secondary || '#7C3AED'})`
                      }}
                    >
                      {testimonial.initials}
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <h4 
                        style={{ color: uniTalentColors.text }}
                        className="font-bold text-lg"
                      >
                        {testimonial.name}
                      </h4>
                      <p 
                        style={{ color: uniTalentColors.text }}
                        className="opacity-80 text-sm"
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Background Effect */}
                <div 
                  style={{ backgroundColor: uniTalentColors.primary }}
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>

          {/* Desktop indicators */}
          <div className="hidden md:flex justify-center gap-2 mt-8">
            {testimonials.slice(0, 6).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'scale-125' : ''
                }`}
                style={{ 
                  backgroundColor: index === currentIndex 
                    ? uniTalentColors.primary 
                    : uniTalentColors.lightGray
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p 
            style={{ color: uniTalentColors.text }}
            className="text-xl opacity-80 mb-8"
          >
            Ready to write your own success story?
          </p>
          
          <button
            style={{ 
              backgroundColor: uniTalentColors.primary,
              color: uniTalentColors.text
            }}
            className="px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Start Your Success Journey Today
          </button>
          
          <p 
            style={{ color: uniTalentColors.text }}
            className="text-sm opacity-60 mt-6"
          >
            Join 5,000+ Product Managers who've transformed their careers with UniTalent
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;