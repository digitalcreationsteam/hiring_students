// src/components/Footer.tsx - Updated to use uniTalentColors
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';
import { colors, uniTalentColors } from 'src/common/Colors';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // <footer className="relative">
    //   {/* Background */}
    //   <div 
    //     style={{ backgroundColor: uniTalentColors.background }}
    //     className="relative overflow-hidden"
    //   >
    //     {/* Top Section */}
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    //       <div className="grid md:grid-cols-4 gap-8 md:gap-12">
    //         {/* Brand Column */}
    //         <div className="md:col-span-1">
    //           <div className="mb-6">
    //             <h2 
    //               style={{ color: uniTalentColors.text }}
    //               className="text-2xl font-bold mb-2"
    //             >
    //               UniTalent
    //             </h2>
    //             <p 
    //               style={{ color: uniTalentColors.text }}
    //               className="opacity-70 text-sm"
    //             >
    //               A Talent Ranking & Discovery Platform for Product Managers
    //             </p>
    //           </div>
              
    //           {/* Social Media Icons */}
    //           <div className="flex space-x-3 mb-6">
    //             {[
    //               { icon: Twitter, label: 'Twitter', href: '#' },
    //               { icon: Linkedin, label: 'LinkedIn', href: '#' },
    //               { icon: Instagram, label: 'Instagram', href: '#' },
    //               { icon: Github, label: 'GitHub', href: '#' }
    //             ].map((social) => {
    //               const Icon = social.icon;
    //               return (
    //                 <a
    //                   key={social.label}
    //                   href={social.href}
    //                   aria-label={social.label}
    //                   className="group"
    //                 >
    //                   <div 
    //                     style={{ 
    //                       backgroundColor: uniTalentColors.background,
    //                       borderColor: uniTalentColors.lightGray
    //                     }}
    //                     className="w-10 h-10 rounded-full border flex items-center justify-center group-hover:border-#FFD85F transition-all duration-300"
    //                   >
    //                     <Icon 
    //                       style={{ color: uniTalentColors.text }}
    //                       className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
    //                     />
    //                   </div>
    //                 </a>
    //               );
    //             })}
    //           </div>
    //         </div>

    //         {/* Quick Links */}
    //         <div>
    //           <h3 
    //             style={{ color: uniTalentColors.text }}
    //             className="text-lg font-semibold mb-4"
    //           >
    //             Quick Links
    //           </h3>
    //           <ul className="space-y-2">
    //             {['Home', 'Features', 'How It Works', 'Pricing', 'Contact'].map((item) => (
    //               <li key={item}>
    //                 <a
    //                   href="#"
    //                   style={{ color: uniTalentColors.text }}
    //                   className="opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
    //                 >
    //                   {item}
    //                 </a>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>

    //         {/* Resources */}
    //         <div>
    //           <h3 
    //             style={{ color: uniTalentColors.text }}
    //             className="text-lg font-semibold mb-4"
    //           >
    //             Resources
    //           </h3>
    //           <ul className="space-y-2">
    //             {['Blog', 'Documentation', 'Help Center', 'Community', 'Events'].map((item) => (
    //               <li key={item}>
    //                 <a
    //                   href="#"
    //                   style={{ color: uniTalentColors.text }}
    //                   className="opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
    //                 >
    //                   {item}
    //                 </a>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>

    //         {/* Company */}
    //         <div>
    //           <h3 
    //             style={{ color: uniTalentColors.text }}
    //             className="text-lg font-semibold mb-4"
    //           >
    //             Company
    //           </h3>
    //           <ul className="space-y-2">
    //             {['About Us', 'Careers', 'Press', 'Partners', 'Legal'].map((item) => (
    //               <li key={item}>
    //                 <a
    //                   href="#"
    //                   style={{ color: uniTalentColors.text }}
    //                   className="opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
    //                 >
    //                   {item}
    //                 </a>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       </div>

    //       {/* Divider */}
    //       <div 
    //         style={{ backgroundColor: uniTalentColors.lightGray }}
    //         className="h-px my-8 md:my-12"
    //       ></div>

    //       {/* Bottom Section */}
    //       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    //         {/* Copyright */}
    //         <div>
    //           <p 
    //             style={{ color: uniTalentColors.text }}
    //             className="text-sm opacity-70"
    //           >
    //             © {currentYear} UniTalent. All rights reserved.
    //           </p>
    //         </div>

    //         {/* Policy Links */}
    //         <div className="flex flex-wrap gap-4 md:gap-6">
    //           {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
    //             <a
    //               key={item}
    //               href="#"
    //               style={{ color: uniTalentColors.text }}
    //               className="text-sm opacity-70 hover:opacity-100 hover:text-#FFD85F transition-all duration-300"
    //             >
    //               {item}
    //             </a>
    //           ))}
    //         </div>

    //         {/* Newsletter Signup 
    //         <div className="w-full md:w-auto">
    //           <div className="flex gap-2">
    //             <input
    //               type="email"
    //               placeholder="Enter your email"
    //               style={{ 
    //                 backgroundColor: uniTalentColors.background,
    //                 borderColor: uniTalentColors.lightGray,
    //                 color: uniTalentColors.text
    //               }}
    //               className="px-4 py-2 rounded-lg border focus:outline-none focus:border-#FFD85F flex-grow md:w-48"
    //             />
    //             <button
    //               style={{ 
    //                 backgroundColor: uniTalentColors.primary,
    //                 color: uniTalentColors.text
    //               }}
    //               className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
    //             >
    //               Subscribe
    //             </button>
    //           </div>
    //           <p 
    //             style={{ color: uniTalentColors.text }}
    //             className="text-xs opacity-60 mt-2"
    //           >
    //             Stay updated with our latest news
    //           </p>
    //         </div>
    //         */}
    //       </div>
    //     </div>
    //   </div>


    // </footer>
    <footer className="relative">
      <div
        style={{ backgroundColor: colors.primary, color: colors.white }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            {/* Brand */}
            <div className="text-center md:text-left">
              <h2
                // style={{ color: uniTalentColors.text }}
                className="text-lg font-semibold"
              >
                UniTalent
              </h2>
              <p
                // style={{ color: uniTalentColors.text }}
                className="opacity-70 text-xs"
              >
                Talent Ranking & Discovery Platform
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-2">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: uniTalentColors.background,
                    borderColor: uniTalentColors.lightGray
                  }}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-[#FFD85F] transition-all duration-300"
                >
                  <Icon
                    style={{ color: uniTalentColors.text }}
                    className="w-4 h-4"
                  />
                </div>
              ))}
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
              // style={{ color: uniTalentColors.text }}
              className="text-xs opacity-70"
            >
              © {currentYear} UniTalent. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  // style={{ color: uniTalentColors.text }}
                  className="text-xs opacity-70 hover:opacity-100 hover:text-[#FFD85F] transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>

          </div>

        </div>
      </div>
    </footer>

  );
};

export default Footer;