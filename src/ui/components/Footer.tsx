// src/components/Footer.tsx - Updated to use uniTalentColors with navigation
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';
import { colors, uniTalentColors } from 'src/common/Colors';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social media links (update with actual URLs)
  const socialLinks = {
    Twitter: "https://twitter.com/unitalent",
    Linkedin: "https://linkedin.com/company/unitalent",
    Instagram: "https://instagram.com/unitalent",
    Github: "https://github.com/unitalent"
  };

  return (
    <footer className="relative">
      <div
        style={{ backgroundColor: uniTalentColors.primary, color: uniTalentColors.text }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            {/* Brand */}
            <div className="text-center md:text-left">
              <Link to="/">
                <div className="flex items-center gap-3">
                  <img
                    src="/UNITALENT.png"
                    alt="Company Logo"
                    className="h-9 w-40 object-contain"
                  />
                </div>
              </Link>
              <p
                style={{ color: uniTalentColors.text }}
                className="opacity-70 text-xs"
              >
                Talent Ranking & Discovery Platform
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-2">
              <a
                href={socialLinks.Twitter}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: uniTalentColors.background,
                  borderColor: uniTalentColors.lightGray
                }}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-[#FFD85F] transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter
                  style={{ color: uniTalentColors.text }}
                  className="w-4 h-4 hover:scale-110 transition-transform duration-300"
                />
              </a>
              <a
                href={socialLinks.Linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: uniTalentColors.background,
                  borderColor: uniTalentColors.lightGray
                }}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-[#FFD85F] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin
                  style={{ color: uniTalentColors.text }}
                  className="w-4 h-4 hover:scale-110 transition-transform duration-300"
                />
              </a>
              <a
                href={socialLinks.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: uniTalentColors.background,
                  borderColor: uniTalentColors.lightGray
                }}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-[#FFD85F] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram
                  style={{ color: uniTalentColors.text }}
                  className="w-4 h-4 hover:scale-110 transition-transform duration-300"
                />
              </a>
              <a
                href={socialLinks.Github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: uniTalentColors.background,
                  borderColor: uniTalentColors.lightGray
                }}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-[#FFD85F] transition-all duration-300"
                aria-label="GitHub"
              >
                <Github
                  style={{ color: uniTalentColors.text }}
                  className="w-4 h-4 hover:scale-110 transition-transform duration-300"
                />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{ backgroundColor: uniTalentColors.lightGray }}
            className="h-px my-4"
          />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">

            <p
              style={{ color: uniTalentColors.text }}
              className="text-xs opacity-70"
            >
              © {currentYear} UniTalent Corporation Pvt Ltd. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/privacy-policy"
                style={{ color: "white" }}
                className="text-xs opacity-70 hover:opacity-100 hover:text-[#FFD85F] transition-all duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                style={{ color: "white" }}
                className="text-xs opacity-70 hover:opacity-100 hover:text-[#FFD85F] transition-all duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookie-policy"
                style={{ color: "white" }}
                className="text-xs opacity-70 hover:opacity-100 hover:text-[#FFD85F] transition-all duration-300"
              >
                Cookie Policy
              </Link>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;