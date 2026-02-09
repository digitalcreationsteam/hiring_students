// src/components/Footer.tsx
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative">
      {/* Background */}
      <div 
        style={{ backgroundColor: '#F8F8F8' }}
        className="relative overflow-hidden"
      >
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="mb-6">
                <h2 
                  style={{ color: '#060606' }}
                  className="text-2xl font-bold mb-2"
                >
                  UniTalent
                </h2>
                <p 
                  style={{ color: '#060606' }}
                  className="opacity-70 text-sm"
                >
                  A Talent Ranking & Discovery Platform for Product Managers
                </p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex space-x-3 mb-6">
                {[
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: '#' },
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Youtube, label: 'YouTube', href: '#' },
                  { icon: Github, label: 'GitHub', href: '#' }
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="group"
                    >
                      <div 
                        style={{ 
                          backgroundColor: '#F8F8F8',
                          borderColor: '#D9D9D9'
                        }}
                        className="w-10 h-10 rounded-full border flex items-center justify-center group-hover:border-#FFD85F transition-all duration-300"
                      >
                        <Icon 
                          style={{ color: '#060606' }}
                          className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 
                style={{ color: '#060606' }}
                className="text-lg font-semibold mb-4"
              >
                Quick Links
              </h3>
              <ul className="space-y-2">
                {['Home', 'Features', 'How It Works', 'Pricing', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{ color: '#060606' }}
                      className="opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 
                style={{ color: '#060606' }}
                className="text-lg font-semibold mb-4"
              >
                Resources
              </h3>
              <ul className="space-y-2">
                {['Blog', 'Documentation', 'Help Center', 'Community', 'Events'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{ color: '#060606' }}
                      className="opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 
                style={{ color: '#060606' }}
                className="text-lg font-semibold mb-4"
              >
                Company
              </h3>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Press', 'Partners', 'Legal'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{ color: '#060606' }}
                      className="opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div 
            style={{ backgroundColor: '#D9D9D9' }}
            className="h-px my-8 md:my-12"
          ></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div>
              <p 
                style={{ color: '#060606' }}
                className="text-sm opacity-70"
              >
                © {currentYear} UniTalent. All rights reserved.
              </p>
            </div>

            {/* Policy Links */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ color: '#060606' }}
                  className="text-sm opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="w-full md:w-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{ 
                    backgroundColor: '#F8F8F8',
                    borderColor: '#D9D9D9',
                    color: '#060606'
                  }}
                  className="px-4 py-2 rounded-lg border focus:outline-none focus:border-#FFD85F flex-grow md:w-48"
                />
                <button
                  style={{ 
                    backgroundColor: '#FFD85F',
                    color: '#060606'
                  }}
                  className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
                >
                  Subscribe
                </button>
              </div>
              <p 
                style={{ color: '#060606' }}
                className="text-xs opacity-60 mt-2"
              >
                Stay updated with our latest news
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar 
      <div 
        style={{ backgroundColor: '#060606' }}
        className="py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p 
              style={{ color: '#F8F8F8' }}
              className="text-sm opacity-70"
            >
              Designed with ❤️ for Product Managers worldwide
            </p>
            <div className="flex items-center gap-2">
              <span 
                style={{ color: '#F8F8F8' }}
                className="text-sm opacity-70"
              >
                Made in
              </span>
              <div 
                style={{ 
                  backgroundColor: '#FFD85F',
                  color: '#060606'
                }}
                className="px-2 py-1 rounded text-xs font-bold"
              >
                INDIA
              </div>
            </div>
          </div>
        </div>
      </div>
      */}
    </footer>
  );
};

export default Footer;