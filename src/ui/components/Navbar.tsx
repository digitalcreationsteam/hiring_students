import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { colors, uniTalentColors } from "src/common/Colors";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { BASE_URL } from "src/common/API";
import { clearUserData } from "src/utils/authUtils";
import { motion } from "framer-motion";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

const buildAvatarUrl = (raw: string | undefined): string => {
  if (!raw) return DEFAULT_AVATAR;
  if (/^https?:\/\//.test(raw)) return raw;
  const origin = BASE_URL.replace(/\/api\/?$/, "");
  if (raw.startsWith("/")) return origin + raw;
  return origin + "/" + raw;
};

const getAvatarFromStorage = (): string => {
  try {
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      return buildAvatarUrl(parsed?.profileUrl);
    }
  } catch (e) {
    console.error("Error parsing avatar:", e);
  }
  return DEFAULT_AVATAR;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [avatar, setAvatar] = useState<string>(getAvatarFromStorage);

  useEffect(() => {
    const handleAvatarUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.avatarUrl) {
        setAvatar(customEvent.detail.avatarUrl);
      } else {
        setAvatar(getAvatarFromStorage());
      }
    };

    const handleStorageChange = () => {
      setAvatar(getAvatarFromStorage());
    };

    window.addEventListener("avatar-updated", handleAvatarUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("avatar-updated", handleAvatarUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");
  const isDashboardPage = location.pathname === "/dashboard";
  const isLandingPage = location.pathname === "/";

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setProfileOpen(false);
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    clearUserData();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        showLogoutModal
      ) {
        setShowLogoutModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogoutModal]);

  const handleLogoClick = () => navigate("/dashboard");

  useEffect(() => {
    document.body.style.overflow = showLogoutModal ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showLogoutModal]);

  const menuItems = ["Home", "Features", "Contact"];

  return (
    <header
      className="border-b sticky top-0 z-50"
      style={{ backgroundColor: colors.primary }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src="/UNITALENT.png"
            alt="Company Logo"
            className="h-9 w-40 object-contain"
          />
        </div>

        {/* Landing page nav links */}
        {isLandingPage && (
          <nav className="hidden md:flex items-center gap-12">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => handleScroll(item)}
                style={{ color: uniTalentColors.white }}
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

        {/* Desktop auth section */}
        <div className="hidden md:flex items-center gap-4 relative">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                style={{
                  backgroundColor: uniTalentColors.lightGray,
                  color: uniTalentColors.primary,
                }}
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  backgroundColor: uniTalentColors.lightGray,
                  color: uniTalentColors.primary,
                }}
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <img
                src={avatar}
                alt="Profile"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = DEFAULT_AVATAR)
                }
                className="w-10 h-10 rounded-xl object-cover border cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-52 backdrop-blur-xl bg-white/90 border rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
                  style={{
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100/80 text-sm transition-colors duration-150"
                  >
                    <User size={16} />
                    My Profile
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => { navigate("/chat"); setProfileOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100/80 text-sm transition-colors duration-150"
                  >
                    <MessageCircle size={16} />
                    Messages
                  </motion.button>

                  <div className="border-t border-gray-200/50" />

                  <motion.button
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50/80 text-sm text-red-600 transition-colors duration-150"
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg"
          style={{ color: uniTalentColors.white }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: uniTalentColors.primary }}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Landing page nav links */}
            {isLandingPage &&
              menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleScroll(item)}
                  className="block w-full text-center py-3 font-bold"
                  style={{ color: uniTalentColors.white }}
                >
                  {item}
                </button>
              ))}

            <div className="pt-2 space-y-3">
              {!isLoggedIn ? (
                <div className="flex flex-col items-center gap-3">
                  <Link
                    className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 w-full text-center"
                    style={{ backgroundColor: colors.white, color: colors.primary }}
                    to="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 w-full text-center"
                    style={{ backgroundColor: colors.white, color: colors.primary }}
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                /* Logged-in mobile: Profile, Messages, Logout */
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { navigate("/profile"); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <User size={20} />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => { navigate("/chat"); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <MessageCircle size={20} />
                    <span>Messages</span>
                  </button>

                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.15)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Logout Confirmation Modal ────────────────────────────── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Logout
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You'll need to log in again to
              access your dashboard and messages.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelLogout}
                className="px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-5 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;