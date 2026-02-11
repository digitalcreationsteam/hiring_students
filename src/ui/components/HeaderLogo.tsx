// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import { colors } from "src/common/Colors";

// export default function HeaderLogo() {

//     const navigate = useNavigate();
//     const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//     return (
//         <div className="flex items-center justify-between p-5 ">
//             <img
//                 src="/hiringLogo2.png"
//                 alt="Logo"
//                 className="h-8 w-28 object-contain"
//             />
//             <button onClick={handleLogout} style={{backgroundColor: "#DC2626", color: "white"}} className="text-xs font-bold w-24 h-8 text-black rounded-full ">LOGOUT</button>
//         </div>
//     );
// }


import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function HeaderLogo() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-transparent">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              src="/hiringLogo2.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* Mobile Logout Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={handleLogout}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-black hover:opacity-80"
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={handleLogout}
            className="text-sm/6 font-semibold text-black hover:opacity-80"
          >
            Logout <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
