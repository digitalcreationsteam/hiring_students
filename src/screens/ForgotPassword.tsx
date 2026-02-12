import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API, { URL_PATH } from "../common/API";
import { colors } from "src/common/Colors";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // RESET PASSWORD API=========
  const handleSubmit = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      await API("POST", URL_PATH.forgotPassword, { email });
      toast.success("Verification code sent to your email");

      setTimeout(() => {
        navigate("/verify-code", { state: { email } });
      }, 3000); // 3 sec is perfect for UX
    } catch (err: any) {
      toast.error(err?.message || "Unable to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

<div className="min-h-screen flex items-center justify-center px-4 relative">
  {/* Blended background - fixed behind everything */}
  <div className="pointer-events-none fixed inset-0 -z-10">
    <div className="absolute inset-0" style={{ backgroundColor: colors.background }} />

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
  className="w-full max-w-md rounded-3xl p-6 shadow-[0_6px_20px_rgba(15,15,15,0.06)]"
  style={{
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[200]}`,
  }}
>
          <button onClick={() => navigate(-1)} className="mb-6">
            ←
          </button>

          <h2 className="text-[24px] mb-2">Forgot password</h2>
          <p className="text-gray-400 mb-6">
            Please enter your email to reset the password
          </p>

          <label className="block  mb-2">Your Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-10 border rounded-3xl border border-gray-300 px-4 py-3 mb-10 border-focus-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full h-10 sm:h-11 rounded-3xl text-sm sm:text-base font-semibold transition active:scale-[0.99]"
  style={{
    backgroundColor: loading ? colors.neutral[200] : colors.primary,
    color: colors.white,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.75 : 1,
    boxShadow: loading ? "none" : "0 10px 24px rgba(0,0,0,0.08)",
  }}
>
  {loading ? "Sending..." : "Reset Password"}
</button>


        </div>
      </div>
    </>
  );
}
