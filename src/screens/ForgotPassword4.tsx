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
  {/* Blended background */}
  <div className="pointer-events-none fixed inset-0 -z-10">
    <div
      className="absolute inset-0"
      style={{ backgroundColor: colors.background }}
    />

    <div
      className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
      style={{
        background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
      }}
    />

    <div
      className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
      }}
    />

    <div
      className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
      }}
    />
  </div>

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
<span style={{ color: colors.accent }}>
  Log In
</span>

        </button>
      </div>
    </div>
  );
}
