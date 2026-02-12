// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { uniTalentColors } from "src/common/Colors";
// import { Menu, X, User, Settings, LogOut, MessageCircle } from "lucide-react";
// import API, { URL_PATH, BASE_URL } from "src/common/API";

// const DEFAULT_AVATAR =
//   "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation(); // <-- get current path
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const [avatar, setAvatar] = useState<string>(() => {
//     try {
//       const u = localStorage.getItem("user");
//       if (u) {
//         const parsed = JSON.parse(u);
//         const raw = parsed?.profileUrl;
//         if (raw) {
//           try {
//             const origin = BASE_URL.replace(/\/api\/?$/, "");
//             if (/^https?:\/\//.test(raw)) return raw;
//             if (raw.startsWith("/")) return origin + raw;
//             return origin + "/" + raw;
//           } catch (e) {
//             return raw || DEFAULT_AVATAR;
//           }
//         }
//         return DEFAULT_AVATAR;
//       }
//     } catch (e) {}
//     return DEFAULT_AVATAR;
//   });

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const u = localStorage.getItem("user");
//       if (u) {
//         const parsed = JSON.parse(u);
//         setAvatar(parsed?.profileUrl || DEFAULT_AVATAR);
//       } else {
//         setAvatar(DEFAULT_AVATAR);
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const isLoggedIn = !!localStorage.getItem("token");
//   const toggleMenu = () => setIsOpen(!isOpen);

//   const menuItems = ["Home", "Features", "Contact"];

//   const handleScroll = (sectionId: string) => {
//     const element = document.getElementById(sectionId.toLowerCase());
//     if (element) element.scrollIntoView({ behavior: "smooth" });
//     setIsOpen(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setProfileOpen(false);
//     navigate("/login");
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Show menu only on landing page ("/")
//   const showLandingMenu = location.pathname === "/";

//   return (
//     <header
//       className="border-b sticky top-0 z-50"
//       style={{ backgroundColor: uniTalentColors.background }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-3">
//           <img
//             src="/BlackhiringLogo.png"
//             alt="Company Logo"
//             className="h-9 w-40 object-contain"
//           />
//         </div>

//         {/* Desktop Menu */}
//         {showLandingMenu && (
//           <nav className="hidden md:flex items-center gap-12">
//             {menuItems.map((item) => (
//               <button
//                 key={item}
//                 onClick={() => handleScroll(item)}
//                 style={{ color: uniTalentColors.text }}
//                 className="relative group font-bold transition-all duration-300 cursor-pointer bg-none border-none"
//               >
//                 <span className="relative z-10">{item}</span>
//                 <span
//                   style={{ backgroundColor: uniTalentColors.primary }}
//                   className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
//                 />
//               </button>
//             ))}
//           </nav>
//         )}

//         {/* Desktop Auth / Avatar */}
//         <div className="hidden md:flex items-center gap-4 relative">
//           {!isLoggedIn ? (
//             <>
//               <Link
//                 to="/login"
//                 style={{ color: uniTalentColors.text }}
//                 className="font-bold hover:opacity-80 transition-all duration-300 hover:scale-105"
//               >
//                 Login
//               </Link>

//               <Link
//                 to="/signup"
//                 style={{
//                   backgroundColor: uniTalentColors.primary,
//                   color: uniTalentColors.lightGray,
//                 }}
//                 className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <div className="relative" ref={dropdownRef}>
//               <img
//                 src={avatar}
//                 alt="Profile"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
//                 }}
//                 className="w-10 h-10 rounded-full object-cover border cursor-pointer"
//                 onClick={() => setProfileOpen(!profileOpen)}
//               />

//               {profileOpen && (
//                 <div className="absolute right-0 mt-3 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
//                   <button
//                     onClick={() => {
//                       navigate("/my-profile");
//                       setProfileOpen(false);
//                     }}
//                     className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
//                   >
//                     <User size={16} />
//                     My Profile
//                   </button>

//                   <button
//                     onClick={() => {
//                       navigate("/settings");
//                       setProfileOpen(false);
//                     }}
//                     className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
//                   >
//                     <Settings size={16} />
//                     Settings
//                   </button>

//                   <button
//                     onClick={() => {
//                       navigate("/messages");
//                       setProfileOpen(false);
//                     }}
//                     className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
//                   >
//                     <MessageCircle size={16} />
//                     Messages
//                   </button>

//                   <div className="border-t"></div>

//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600"
//                   >
//                     <LogOut size={16} />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Hamburger Menu */}
//         <button
//           onClick={toggleMenu}
//           className="md:hidden p-2 rounded-lg transition-all duration-300"
//           style={{ color: uniTalentColors.text }}
//           aria-label="Toggle menu"
//         >
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div
//           className="md:hidden border-t"
//           style={{ backgroundColor: uniTalentColors.background }}
//         >
//           <div className="px-4 py-4 space-y-4">
//             {showLandingMenu &&
//               menuItems.map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => handleScroll(item)}
//                   style={{ color: uniTalentColors.text }}
//                   className="block w-full text-left py-3 px-4 rounded-lg font-bold hover:opacity-80"
//                 >
//                   {item}
//                 </button>
//               ))}

//             <div
//               className="flex flex-col gap-3 pt-4 border-t"
//               style={{ borderColor: uniTalentColors.lightGray }}
//             >
//               {!isLoggedIn ? (
//                 <>
//                   <Link
//                     to="/login"
//                     onClick={() => setIsOpen(false)}
//                     className="text-center py-3 font-bold"
//                   >
//                     Login
//                   </Link>

//                   <Link
//                     to="/signup"
//                     onClick={() => setIsOpen(false)}
//                     className="text-center py-3 rounded-lg font-semibold"
//                     style={{
//                       backgroundColor: uniTalentColors.primary,
//                       color: uniTalentColors.lightGray,
//                     }}
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <button onClick={() => navigate("/my-profile")}>
//                     My Profile
//                   </button>
//                   <button onClick={() => navigate("/settings")}>
//                     Settings
//                   </button>
//                   <button onClick={() => navigate("/messages")}>
//                     Messages
//                   </button>
//                   <button onClick={handleLogout} className="text-red-600">
//                     Logout
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { colors, uniTalentColors } from "src/common/Colors";
import { Menu, X, User, Settings, LogOut, MessageCircle } from "lucide-react";
import { BASE_URL } from "src/common/API";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* -------------------- Avatar Logic -------------------- */
  const [avatar, setAvatar] = useState<string>(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        const raw = parsed?.profileUrl;

        if (raw) {
          const origin = BASE_URL.replace(/\/api\/?$/, "");

          if (/^https?:\/\//.test(raw)) return raw;
          if (raw.startsWith("/")) return origin + raw;
          return origin + "/" + raw;
        }
      }
    } catch (e) {}
    return DEFAULT_AVATAR;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const u = localStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        setAvatar(parsed?.profileUrl || DEFAULT_AVATAR);
      } else {
        setAvatar(DEFAULT_AVATAR);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* -------------------- Page Checks -------------------- */

  const isLoggedIn = !!localStorage.getItem("token");
  const isDashboardPage = location.pathname === "/dashboard";
  const isLandingPage = location.pathname === "/";

  /* -------------------- Handlers -------------------- */

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login");
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = ["Home", "Features", "Contact"];

  return (
    <header
      className="border-b sticky top-0 z-50"
      style={{ backgroundColor: colors.primary }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/UNITALENT.png"
            alt="Company Logo"
            className="h-9 w-40 object-contain"
          />
        </div>

        {/* Landing Page Menu */}
        {isLandingPage && (
          <nav className="hidden md:flex items-center gap-12">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => handleScroll(item)}
                style={{ color: uniTalentColors.text }}
                className="relative group font-bold transition-all duration-300 bg-none border-none"
              >
                <span className="relative z-10">{item}</span>
                <span
                  style={{ backgroundColor: uniTalentColors.primary }}
                  className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                />
              </button>
            ))}
          </nav>
        )}

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4 relative">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                style={{ color: uniTalentColors.text }}
                className="font-bold hover:opacity-80 transition-all duration-300"
              >
                Login
              </Link>

              <Link
                to="/signup"
                style={{
                  backgroundColor: uniTalentColors.primary,
                  color: uniTalentColors.lightGray,
                }}
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          ) : isDashboardPage ? (
            /* Avatar only on dashboard */
            <div className="relative" ref={dropdownRef}>
              <img
                src={avatar}
                alt="Profile"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = DEFAULT_AVATAR)
                }
                className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate("/my-profile");
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    <User size={16} />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      navigate("/messages");
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    <MessageCircle size={16} />
                    Messages
                  </button>

                  <div className="border-t"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-sm text-red-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Other pages → only Logout */
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-red-50 text-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg"
          style={{ color: uniTalentColors.text }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: uniTalentColors.background }}
        >
          <div className="px-4 py-4 space-y-4">
            {isLandingPage &&
              menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleScroll(item)}
                  className="block w-full text-left py-3 font-bold"
                  style={{ color: uniTalentColors.text }}
                >
                  {item}
                </button>
              ))}

            <div className="pt-4 border-t space-y-3">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
