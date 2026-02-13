import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { colors } from "src/common/Colors";


export default function ResetPasswordSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        navigate("/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);


  // AUTO RE-DIRECT to LOGIN PAGE ========

//   useEffect(() => {
//   const timer = setTimeout(() => {
//     navigate("/login", { replace: true });
//   }, 5000);

//   return () => clearTimeout(timer);
// }, [navigate]);


  return (
<div className="min-h-screen flex items-center justify-center px-4 relative">
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

<div
  className="w-full max-w-md rounded-3xl p-8 text-center shadow-[0_6px_20px_rgba(15,15,15,0.06)]"
  style={{
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[200]}`,
  }}
>
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div
  className="w-20 h-20 rounded-full flex items-center justify-center"
  style={{
    border: `4px solid ${colors.primary}`,
    backgroundColor: `${colors.primary}15`,
  }}
>
  <span style={{ color: colors.primary }} className="text-4xl">✓</span>
</div>

        </div>

        {/* Text */}
        <h2 className="text-[24px] mb-2 font-semibold"
        style={{ color: colors.accent }}
        >Password Changed!</h2>

<p className="mb-8" style={{ color: colors.neutral[600] }}>
          Your password has been changed successfully.
        </p>

        {/* Button (simple, consistent with your preference) */}
        <button
  onClick={() => navigate("/login", { replace: true })}
  className="w-full h-10 rounded-3xl font-semibold transition"
  style={{
    backgroundColor: colors.primary,
    color: colors.accent,
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.backgroundColor = colors.secondary)
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.backgroundColor = colors.primary)
  }
>
<span style={{ color: colors.white }}>
  Log In
</span>

        </button>
      </div>
    </div>
  );
}
