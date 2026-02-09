import React from "react";

const Navbar = () => {
    return (
        <header className="bg-[#F8F8F8] border-b border-[#D9D9D9]">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src="/rename.png"  // 🔴 replace with your logo path
                        alt="Company Logo"
                        className="h-9 w-50 object-contain"
                    />
                </div>

                {/* Menu */}
                <nav className="hidden md:flex items-center gap-12 text-[#060606] font-bold">
                    {["Home", "Features", "Pricing", "Contact"].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="relative transition hover:text-[#FFD85F]"
                        >
                            {item}

                            {/* Hover underline */}
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#FFD85F] transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-5">
                    <button className="text-[#060606] font-bold transition hover:opacity-70">
                        Login
                    </button>

                    <button className="bg-[#FFD85F] text-[#060606] px-6 py-2 rounded-lg font-semibold transition hover:scale-[1.03]">
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
