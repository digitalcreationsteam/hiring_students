// src/components/CTASection.tsx
'use client';

import { useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';
import { Send, CheckCircle, Users, TrendingUp, Shield } from 'lucide-react';

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentRole: '',
    yearsExperience: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          currentRole: '',
          yearsExperience: ''
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: 'Join 5,000+ PMs',
      description: 'Already transforming their careers'
    },
    {
      icon: TrendingUp,
      title: '3.2x More Interviews',
      description: 'Average increase for our members'
    },
    {
      icon: Shield,
      title: 'No Spam, Ever',
      description: 'We respect your privacy'
    }
  ];

  const experienceOptions = [
    { value: '', label: 'Select experience' },
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5+', label: '5+ years' }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div 
        style={{ backgroundColor: uniTalentColors.background }}
        className="absolute inset-0"
      >
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${uniTalentColors.primary} 1px, transparent 1px),
              linear-gradient(${uniTalentColors.primary} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Decorative elements */}
        <div 
          style={{ backgroundColor: uniTalentColors.primary }}
          className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-5 blur-3xl"
        />
        <div 
          style={{ backgroundColor: uniTalentColors.primary }}
          className="absolute bottom-10 left-10 w-48 h-48 rounded-full opacity-5 blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <div 
                style={{ 
                  backgroundColor: `${uniTalentColors.primary}20`,
                  color: uniTalentColors.primary
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: uniTalentColors.primary }} />
                Limited Time Offer
              </div>
              
              <h2 
                style={{ color: uniTalentColors.text }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              >
                Ready to Break Through the 
                <span 
                  style={{ color: uniTalentColors.primary }}
                  className="block mt-2"
                >
                  Broken Hiring System?
                </span>
              </h2>
              
              <p 
                style={{ color: uniTalentColors.text }}
                className="text-lg opacity-80 mb-8"
              >
                Join thousands of Product Managers who've transformed their job search with UniTalent. 
                Get your free skill assessment and personalized ranking in minutes.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div 
                      style={{ 
                        backgroundColor: uniTalentColors.primary,
                        color: uniTalentColors.text
                      }}
                      className="p-2 rounded-lg"
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 style={{ color: uniTalentColors.text }} className="font-semibold">
                        {benefit.title}
                      </h4>
                      <p style={{ color: uniTalentColors.text }} className="text-sm opacity-70">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Form 
          <div>
            <div 
              style={{ 
                backgroundColor: uniTalentColors.background,
                borderColor: uniTalentColors.lightGray
              }}
              className="rounded-2xl border p-6 md:p-8 shadow-xl"
            >
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                    style={{ 
                      backgroundColor: `${uniTalentColors.primary}20`,
                      color: uniTalentColors.primary
                    }}
                  >
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 
                    style={{ color: uniTalentColors.text }}
                    className="text-2xl font-bold mb-3"
                  >
                    Thank You!
                  </h3>
                  <p style={{ color: uniTalentColors.text }} className="opacity-80 mb-6">
                    We've sent your free assessment link to {formData.email}. 
                    Check your inbox in the next 5 minutes.
                  </p>
                  <div className="text-sm opacity-70">
                    <p>Redirecting you to the assessment page...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h3 
                      style={{ color: uniTalentColors.text }}
                      className="text-2xl font-bold mb-3"
                    >
                      Start Your Free Assessment
                    </h3>
                    <p style={{ color: uniTalentColors.text }} className="opacity-70">
                      No credit card required. Get ranked in 15 minutes.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div 
                        style={{ 
                          backgroundColor: `${uniTalentColors.primary}10`,
                          borderColor: uniTalentColors.primary,
                          color: uniTalentColors.text
                        }}
                        className="p-3 rounded-lg border text-sm"
                      >
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name Field }
                      <div>
                        <label 
                          style={{ color: uniTalentColors.text }}
                          className="block text-sm font-medium mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{ 
                            backgroundColor: uniTalentColors.background,
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text
                          }}
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-#FFD85F transition-all duration-300"
                          placeholder="John Doe"
                        />
                      </div>

                      {/* Email Field }
                      <div>
                        <label 
                          style={{ color: uniTalentColors.text }}
                          className="block text-sm font-medium mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{ 
                            backgroundColor: uniTalentColors.background,
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text
                          }}
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-#FFD85F transition-all duration-300"
                          placeholder="john@example.com"
                        />
                      </div>

                      {/* Current Role }
                      <div>
                        <label 
                          style={{ color: uniTalentColors.text }}
                          className="block text-sm font-medium mb-2"
                        >
                          Current Role
                        </label>
                        <input
                          type="text"
                          name="currentRole"
                          value={formData.currentRole}
                          onChange={handleChange}
                          style={{ 
                            backgroundColor: uniTalentColors.background,
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text
                          }}
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-#FFD85F transition-all duration-300"
                          placeholder="Product Manager, Associate PM, etc."
                        />
                      </div>

                      {/* Years of Experience }
                      <div>
                        <label 
                          style={{ color: uniTalentColors.text }}
                          className="block text-sm font-medium mb-2"
                        >
                          Years of Experience
                        </label>
                        <select
                          name="yearsExperience"
                          value={formData.yearsExperience}
                          onChange={handleChange}
                          style={{ 
                            backgroundColor: uniTalentColors.background,
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text
                          }}
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-#FFD85F transition-all duration-300 appearance-none"
                        >
                          {experienceOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Submit Button }
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{ 
                        backgroundColor: uniTalentColors.primary,
                        color: uniTalentColors.text
                      }}
                      className="w-full py-4 rounded-lg font-bold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Start Free Assessment
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Privacy Notice }
                    <p 
                      style={{ color: uniTalentColors.text }}
                      className="text-xs opacity-60 text-center"
                    >
                      By submitting, you agree to our{' '}
                      <a href="#" className="underline hover:opacity-80">Terms</a> and{' '}
                      <a href="#" className="underline hover:opacity-80">Privacy Policy</a>. 
                      We'll send you assessment details and occasional updates.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Trust Indicators }
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div style={{ color: uniTalentColors.text }} className="text-xl font-bold">100%</div>
                <div style={{ color: uniTalentColors.text }} className="text-xs opacity-70">Free</div>
              </div>
              <div className="text-center">
                <div style={{ color: uniTalentColors.text }} className="text-xl font-bold">15min</div>
                <div style={{ color: uniTalentColors.text }} className="text-xs opacity-70">Assessment</div>
              </div>
              <div className="text-center">
                <div style={{ color: uniTalentColors.text }} className="text-xl font-bold">24h</div>
                <div style={{ color: uniTalentColors.text }} className="text-xs opacity-70">Results</div>
              </div>
            </div>
          </div>
          */}

        </div>
      </div>
    </section>
  );
};

export default CTASection;