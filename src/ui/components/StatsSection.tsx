// src/components/StatsSection.tsx
'use client';

import { useState, useEffect } from 'react';

const StatsSection = () => {
  const [recruiters, setRecruiters] = useState(0);
  const [atsFiltered, setAtsFiltered] = useState(0);
  const [referralJobs, setReferralJobs] = useState(0);
  const [interviewRate, setInterviewRate] = useState(0);

  useEffect(() => {
    const animateCount = (setter: (value: number) => void, target: number, duration: number) => {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
      
      return timer;
    };

    const timer1 = animateCount(setRecruiters, 5, 1000);
    const timer2 = animateCount(setAtsFiltered, 80, 1500);
    const timer3 = animateCount(setReferralJobs, 45, 1500);
    const timer4 = animateCount(setInterviewRate, 3.2, 2000);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
      clearInterval(timer4);
    };
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Profile Stats */}
          <div className="space-y-8">
            <div 
              style={{ 
                backgroundColor: '#F8F8F8',
                borderColor: '#D9D9D9'
              }}
              className="rounded-2xl border p-8"
            >
              <div className="flex items-center mb-6">
                <div 
                  style={{ backgroundColor: '#FFD85F' }}
                  className="p-3 rounded-xl"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#060606">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 style={{ color: '#060606' }} className="text-2xl font-bold">Profile Visibility</h3>
                  <p style={{ color: '#060606' }} className="text-lg opacity-80">{recruiters} recruiters viewed your profile this week</p>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div 
                  style={{ 
                    backgroundColor: '#F8F8F8',
                    borderColor: '#D9D9D9'
                  }}
                  className="text-center p-4 rounded-xl border"
                >
                  <div style={{ color: '#060606' }} className="text-3xl font-bold">{atsFiltered}%</div>
                  <div style={{ color: '#060606' }} className="text-sm opacity-80 mt-2">Resumes filtered by ATS</div>
                </div>
                
                <div 
                  style={{ 
                    backgroundColor: '#F8F8F8',
                    borderColor: '#D9D9D9'
                  }}
                  className="text-center p-4 rounded-xl border"
                >
                  <div style={{ color: '#060606' }} className="text-3xl font-bold">{referralJobs}%</div>
                  <div style={{ color: '#060606' }} className="text-sm opacity-80 mt-2">Jobs filled via referrals</div>
                </div>
                
                <div 
                  style={{ 
                    backgroundColor: '#F8F8F8',
                    borderColor: '#D9D9D9'
                  }}
                  className="text-center p-4 rounded-xl border"
                >
                  <div style={{ color: '#060606' }} className="text-3xl font-bold">{interviewRate}x</div>
                  <div style={{ color: '#060606' }} className="text-sm opacity-80 mt-2">Better interview rate</div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                style={{ 
                  backgroundColor: '#FFD85F',
                  color: '#060606'
                }}
                className="flex-1 font-semibold py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-300 border border-transparent hover:border-#D9D9D9"
              >
                Get Ranked Today →
              </button>
              
              <button 
                style={{ 
                  backgroundColor: '#F8F8F8',
                  color: '#060606',
                  borderColor: '#D9D9D9'
                }}
                className="flex-1 font-semibold py-4 px-8 rounded-xl border-2 hover:opacity-80 transition-all duration-300"
              >
                See How It Works
              </button>
            </div>
          </div>
          
          {/* Right Column - Introducing UniTalent */}
          <div>
            <h2 style={{ color: '#060606' }} className="text-3xl md:text-4xl font-bold mb-6">
              Introducing UniTalent: A Talent Ranking &<br />
              <span style={{ color: '#060606' }}>Discovery Platform for Product Managers</span>
            </h2>
            
            <p style={{ color: '#060606' }} className="text-lg opacity-80 mb-8">
              We built UniTalent because we believe hiring should work differently. Not based on who you know or how well you can game an ATS system, but on what you can actually do.
            </p>
            
            <div 
              style={{ 
                backgroundColor: '#F8F8F8',
                borderColor: '#D9D9D9'
              }}
              className="rounded-xl p-6 border"
            >
              <h3 style={{ color: '#060606' }} className="text-xl font-semibold mb-4">How It Works:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div 
                    style={{ backgroundColor: '#FFD85F' }}
                    className="w-2 h-2 rounded-full mr-3"
                  ></div>
                  <span style={{ color: '#060606' }}>Demonstrate skills through real-world assessments</span>
                </li>
                <li className="flex items-center">
                  <div 
                    style={{ backgroundColor: '#FFD85F' }}
                    className="w-2 h-2 rounded-full mr-3"
                  ></div>
                  <span style={{ color: '#060606' }}>Showcase verified projects that prove execution</span>
                </li>
                <li className="flex items-center">
                  <div 
                    style={{ backgroundColor: '#FFD85F' }}
                    className="w-2 h-2 rounded-full mr-3"
                  ></div>
                  <span style={{ color: '#060606' }}>Get ranked transparently against other PMs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;