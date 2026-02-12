import React, { useState } from "react";
import { Link } from "react-router-dom";
import { uniTalentColors } from "src/common/Colors";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = ["Home", "Features", "Contact"];

    // Simple scroll function
    const handleScroll = (sectionId: string) => {
        const element = document.getElementById(sectionId.toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false);
    };

    return (
        <header className="border-b sticky top-0 z-50" style={{ backgroundColor: uniTalentColors.background }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src="/BlackHiringLogo.png"
                        alt="Company Logo"
                        className="h-9 w-40 object-contain"
                    />
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-12">
                    {menuItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleScroll(item)}
                            style={{ color: uniTalentColors.text }}
                            className="relative group font-bold transition-all duration-300 cursor-pointer bg-none border-none"
                        >
                            <span className="relative z-10">{item}</span>
                            
                            {/* Hover underline animation */}
                            <span 
                                style={{ backgroundColor: uniTalentColors.primary }}
                                className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                            />
                        </button>
                    ))}
                </nav>

                {/* Auth Buttons - Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <Link 
                        to="/login" 
                        style={{ color: uniTalentColors.text }}
                        className="font-bold hover:opacity-80 transition-all duration-300 hover:scale-105"
                    >
                        Login
                    </Link>

                    <Link 
                        to="/signup" 
                        style={{ 
                            backgroundColor: uniTalentColors.primary,
                            color: uniTalentColors.lightGray
                        }}
                        className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Hamburger Menu Button - Mobile */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 rounded-lg transition-all duration-300"
                    style={{ color: uniTalentColors.text }}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div 
                    className="md:hidden border-t transition-all duration-300"
                    style={{ backgroundColor: uniTalentColors.background }}
                >
                    <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4">
                        {/* Mobile Menu Items */}
                        {menuItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => handleScroll(item)}
                                style={{ color: uniTalentColors.text }}
                                className="block w-full text-left py-3 px-4 rounded-lg font-bold transition-all duration-300 hover:opacity-80 bg-none border-none"
                            >
                                {item}
                            </button>
                        ))}

                        {/* Mobile Auth Buttons */}
                        <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: uniTalentColors.lightGray }}>
                            <Link 
                                to="/login" 
                                style={{ color: uniTalentColors.text }}
                                className="block text-center py-3 px-4 rounded-lg font-bold transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>

                            <Link 
                                to="/signup" 
                                style={{ 
                                    backgroundColor: uniTalentColors.primary,
                                    color: uniTalentColors.text
                                }}
                                className="block text-center py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;