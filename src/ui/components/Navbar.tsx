import React from "react";
import { Link } from "react-router-dom";
import { uniTalentColors } from "src/common/Colors";

const Navbar = () => {
    return (
        <header style={{ 
            backgroundColor: uniTalentColors.background, 
            borderColor: uniTalentColors.lightGray 
        }} className="border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src="/rename.png"
                        alt="Company Logo"
                        className="h-9 w-50 object-contain"
                    />
                </div>

                {/* Menu */}
                <nav className="hidden md:flex items-center gap-12">
                    {["Home", "Features", "Pricing", "Contact"].map((item) => (
                        <Link
                            key={item}
                            to="#"
                            style={{ color: uniTalentColors.text }}
                            className="relative group font-bold transition-all duration-300"
                        >
                            <span className="relative z-10">{item}</span>
                            
                            {/* Hover underline animation */}
                            <span 
                                style={{ backgroundColor: uniTalentColors.primary }}
                                className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                            />
                            
                            {/* Background highlight on hover */}
                            <span 
                                style={{ 
                                    backgroundColor: uniTalentColors.primary,
                                    opacity: 0
                                }}
                                className="absolute inset-0 -z-10 rounded-lg group-hover:opacity-10 transition-opacity duration-300"
                            />
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
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
                            color: uniTalentColors.text
                        }}
                        className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;