import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { colors, uniTalentColors } from "src/common/Colors";
import { Menu, X, User, LogOut, MessageCircle } from "lucide-react";
import { BASE_URL } from "src/common/API";
import { clearUserData } from "src/utils/authUtils";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* -------------------- Scroll Detection -------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* -------------------- Avatar Logic -------------------- */
  const getAvatarFromStorage = () => {
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
    } catch (e) {
      console.error("Error parsing avatar:", e);
    }
    return DEFAULT_AVATAR;
  };

  const [avatar, setAvatar] = useState<string>(getAvatarFromStorage());

  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      if (event.detail?.avatarUrl) setAvatar(event.detail.avatarUrl);
      else setAvatar(getAvatarFromStorage());
    };
    const handleStorageChange = () => setAvatar(getAvatarFromStorage());
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("avatar-updated", handleAvatarUpdate as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("avatar-updated", handleAvatarUpdate as EventListener);
    };
  }, []);

  /* -------------------- Page Checks -------------------- */
  const isLoggedIn = !!localStorage.getItem("token");
  const isDashboardPage = location.pathname === "/dashboard";
  const isLandingPage = location.pathname === "/";

  /* -------------------- Handlers -------------------- */
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  // Open logout confirmation modal
  const handleLogoutClick = () => {
    setProfileOpen(false);
    setShowLogoutModal(true);
  };

  // Confirm logout
  const handleConfirmLogout = () => {
    clearUserData();
    setShowLogoutModal(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogoutModal]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLogoutModal]);

  const menuItems = ["Home", "Features", "Contact"];

  /*
   * On landing page → transparent at top, solid white after scrolling
   * On other pages  → always solid white
   */
  const isTransparent = isLandingPage && !scrolled;
  const textColor = isTransparent ? "#FFFFFF" : uniTalentColors.primary;

  return (
    <>
      {/*
        FIXED: floats over the page, no space consumed.
        Non-landing pages should add `pt-[72px]` to their top-level wrapper
        so content isn't hidden behind the navbar.
      */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isTransparent ? "transparent" : uniTalentColors.primary,
          borderBottom: isTransparent
            ? "1px solid rgba(255,255,255,0.1)"
            : `1px solid ${uniTalentColors.gray}60`,
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <img
                src="/UNITALENT.png"
                alt="Company Logo"
                className="h-9 w-40 object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* Landing Page Nav Links */}
          {isLandingPage && (
            <nav className="hidden md:flex items-center gap-12">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleScroll(item)}
                  style={{ color: "white" }}
                  className="relative group font-bold transition-all duration-300 bg-transparent border-none"
                >
                  <span className="relative z-10">{item}</span>
                  <span
                    style={{ backgroundColor: textColor }}
                    className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                  />
                </button>
              ))}
            </nav>
          )}

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4 relative">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  style={{
                    backgroundColor: uniTalentColors.primary,
                    color: uniTalentColors.white,
                  }}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:opacity-90"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  style={{
                    backgroundColor: "transparent",
                    color: isTransparent ? uniTalentColors.white : uniTalentColors.white,
                    border: `2px solid ${isTransparent ? "rgba(255,255,255,0.8)" : uniTalentColors.primary}`,
                  }}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:opacity-80"
                >
                  Sign Up
                </Link>
              </>
            ) : isDashboardPage ? (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={avatar}
                  alt="Profile"
                  onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_AVATAR)}
                  className="w-10 h-10 rounded-xl object-cover cursor-pointer hover:scale-105 transition-all duration-300"
                  style={{ border: `2px solid ${uniTalentColors.primary}` }}
                  onClick={() => setProfileOpen(!profileOpen)}
                />
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-3 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-50"
                    style={{ borderColor: uniTalentColors.gray }}
                  >
                    <button
                      onClick={() => { navigate("/my-profile"); setProfileOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                      style={{ color: uniTalentColors.text }}
                    >
                      <User size={16} /> My Profile
                    </button>
                    <button
                      onClick={() => { navigate("/chat"); setProfileOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                      style={{ color: uniTalentColors.text }}
                    >
                      <MessageCircle size={16} /> Messages
                    </button>
                    <div className="border-t" style={{ borderColor: uniTalentColors.gray }} />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-sm text-red-600"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-300 bg-red-50 text-red-600"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg transition-colors duration-300"
            style={{ color: textColor }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden border-t"
            style={{
              backgroundColor: uniTalentColors.white,
              borderTopColor: `${uniTalentColors.gray}60`,
            }}
          >
            <div className="px-4 py-4 space-y-4">
              {isLandingPage &&
                menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleScroll(item)}
                    className="block w-full text-center py-3 font-bold"
                    style={{ color: uniTalentColors.primary }}
                  >
                    {item}
                  </button>
                ))}
              <div className="pt-4 border-t space-y-3" style={{ borderTopColor: uniTalentColors.gray }}>
                {!isLoggedIn ? (
                  <div className="flex flex-col items-center gap-3">
                    <Link
                      className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: uniTalentColors.primary, color: uniTalentColors.white }}
                      to="/login"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: "transparent",
                        color: uniTalentColors.primary,
                        border: `2px solid ${uniTalentColors.primary}`,
                      }}
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <LogOut size={18} /> Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/*
        Spacer: only on NON-landing pages so content isn't hidden under the fixed navbar.
        On the landing page, HeroSection fills the full viewport from top:0.
      */}
      {!isLandingPage && <div className="h-[73px]" />}
    </>
  );
};

export default Navbar;