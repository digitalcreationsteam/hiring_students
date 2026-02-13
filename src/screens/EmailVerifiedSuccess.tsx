import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { colors } from "src/common/Colors";
import Footer from "../ui/components/Footer";


export default function EmailVerifiedSuccess() {
  const navigate = useNavigate();

  // ENTER KEY → LOGIN
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        navigate("/talent-ranking", { replace: true });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // AUTO REDIRECT (OPTIONAL – ENABLE IF YOU WANT)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate("/login", { replace: true });
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative">
      
      {/* 🎨 Linear gradient background - fixed behind everything */}
      <div 
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(
            to bottom,
            #d9d9d9 0%,
            #cfd3d6 25%,
            #9aa6b2 55%,
            #2E4056 100%
          )`,
          width: "100%",
        }}
      />
      
      {/* Content Card */}
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-lg">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center">
            <span className="text-green-500 text-4xl">✓</span>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-[24px] mb-2">Email Verified!</h2>

        <p className="text-gray-500 mb-8">
          Your email address has been verified successfully.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/talent-ranking", { replace: true })}
          className="w-full h-10 text-white rounded-3xl font-semibold  transition"
          style={{ backgroundColor: colors.primary,  color: colors.white,}}
        >
          Welcome To UniTalent
        </button>
      </div>
    </div>
  );
}