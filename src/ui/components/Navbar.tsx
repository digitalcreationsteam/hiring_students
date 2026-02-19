import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { colors, uniTalentColors } from "src/common/Colors";
import { Menu, X, User, Settings, LogOut, MessageCircle, AlertTriangle } from "lucide-react";
import { BASE_URL } from "src/common/API";
import { clearUserData } from "src/utils/authUtils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logoutModalRef = useRef<HTMLDivElement>(null);

  /* -------------------- Avatar Logic -------------------- */

  // Function to get avatar from localStorage
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

  // Initialize avatar state
  const [avatar, setAvatar] = useState<string>(getAvatarFromStorage());

  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      // If the event contains the new avatar URL, use it directly
      if (event.detail?.avatarUrl) {
        setAvatar(event.detail.avatarUrl);
      } else {
        // Otherwise, fetch from localStorage
        setAvatar(getAvatarFromStorage());
      }
    };

    // Listen for storage events (cross-tab)
    const handleStorageChange = () => {
      setAvatar(getAvatarFromStorage());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "avatar-updated",
      handleAvatarUpdate as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "avatar-updated",
        handleAvatarUpdate as EventListener,
      );
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
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  // Show logout confirmation
  const handleLogoutClick = () => {
    setProfileOpen(false);
    setShowLogoutConfirm(true);
  };

  // Confirm logout
  const confirmLogout = () => {
    clearUserData();
    setShowLogoutConfirm(false);
    toast.success("Logged out successfully", {
      position: "top-center",
      autoClose: 2000,
    });
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
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
      
      // Close logout modal if clicked outside
      if (
        logoutModalRef.current &&
        !logoutModalRef.current.contains(event.target as Node)
      ) {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close logout modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowLogoutConfirm(false);
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const menuItems = ["Home", "Features", "Contact"];

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <header
        className="border-b sticky top-0 z-50"
        style={{ backgroundColor: colors.primary }}
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

          {/* Landing Page Menu */}
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
                    style={{ backgroundColor: uniTalentColors.white }}
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
                  style={{
                    backgroundColor: uniTalentColors.lightGray,
                    color: uniTalentColors.primary,
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-white`}
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
            ) : isDashboardPage ? (
              /* Avatar only on dashboard */
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
                        navigate("/chat");
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      <MessageCircle size={16} />
                      Messages
                    </button>

                    <div className="border-t"></div>

                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-sm text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Other pages → only Logout */
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-300 bg-red-50 text-red-600"
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
            style={{ color: uniTalentColors.white }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden border-t"
            style={{ backgroundColor: uniTalentColors.primary }}
          >
            <div className="px-4 py-4 space-y-4">
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

              <div className="pt-4 border-t space-y-3">
                {!isLoggedIn ? (
                  <div className="flex flex-col items-center gap-3">
                    <Link
                      className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: colors.white,
                        color: colors.primary,
                      }}
                      to="/login"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      className="px-6 py-2 m-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: colors.white,
                        color: colors.primary,
                      }}
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogoutClick}
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div
            ref={logoutModalRef}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all animate-fadeIn"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: colors.accent }}>
                  Confirm Logout
                </h3>
                <p className="text-sm" style={{ color: colors.neutral[500] }}>
                  Are you sure you want to log out?
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mb-6 p-3 bg-amber-50 rounded-lg">
              <p className="text-xs" style={{ color: colors.neutral[600] }}>
                You will be redirected to the login page and will need to sign in again to access your account.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all hover:bg-gray-100"
                style={{
                  backgroundColor: colors.neutral[100],
                  color: colors.neutral[700],
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-all hover:scale-105"
                style={{ backgroundColor: colors.primary }}
              >
                Logout
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={cancelLogout}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;