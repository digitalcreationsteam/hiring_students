import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "src/common/Colors";

export default function HeaderLogo() {

    const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

    return (
        <div className="flex items-center justify-between p-5 ">
            <img
                src="/hiringLogo.png"
                alt="Logo"
                className="h-8 w-28 object-contain"
            />
            <button onClick={handleLogout} style={{backgroundColor: colors.primary}} className="text-xs font-bold w-24 h-8 text-black bg-[#FFD85F] rounded-full ">LOGOUT</button>
        </div>
    );
}

