import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API, { URL_PATH } from "../common/API";
import { colors } from "src/common/Colors";


export default function SetNewPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //   /* ================= REDIRECT SAFELY ================= */
  //   useEffect(() => {
  //     if (!email) {
  //       navigate("/forgot-password", { replace: true });
  //     }
  //   }, [email, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Session expired. Please restart password reset.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await API("post", URL_PATH.resetPassword, { email, password });

      toast.success("Password updated successfully");

      setTimeout(() => {
        navigate("/success-password");
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [loading, password, confirmPassword]);


  /* ================= UI ================= */
  return (
    <>
    <ToastContainer position="top-center" autoClose={2000}/>
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
  className="w-full max-w-md rounded-3xl p-6 shadow-[0_6px_20px_rgba(15,15,15,0.06)]"
  style={{
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[200]}`,
  }}
>
        {/* Back */}
       <button
  onClick={() => navigate(-1)}
  className="w-10 h-10 rounded-full flex items-center justify-center mb-6 transition"
  style={{
    backgroundColor: colors.neutral[100],
    color: colors.accent,
  }}
>
  ←
</button>


        <h2 className="text-[24px] mb-2">Set a new password</h2>

        <p className="text-gray-400 mb-6">
          Create a new password. Ensure it differs from previous ones for
          security
        </p>

        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
className="w-full rounded-3xl px-4 h-10 mb-5 outline-none transition"
style={{
  backgroundColor: colors.white,
  border: `1px solid ${colors.neutral[200]}`,
  color: colors.accent,
}}
onFocus={(e) => {
  e.currentTarget.style.border = `1px solid ${colors.primary}`;
  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary}22`;
}}
onBlur={(e) => {
  e.currentTarget.style.border = `1px solid ${colors.neutral[200]}`;
  e.currentTarget.style.boxShadow = "none";
}}
        />

        <label className="block text-sm font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
className="w-full rounded-3xl px-4 h-10 mb-5 outline-none transition"
style={{
  backgroundColor: colors.white,
  border: `1px solid ${colors.neutral[200]}`,
  color: colors.accent,
}}
onFocus={(e) => {
  e.currentTarget.style.border = `1px solid ${colors.primary}`;
  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary}22`;
}}
onBlur={(e) => {
  e.currentTarget.style.border = `1px solid ${colors.neutral[200]}`;
  e.currentTarget.style.boxShadow = "none";
}}
        />

        <button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full h-10 rounded-3xl font-semibold transition"
  style={{
    backgroundColor: loading ? colors.neutral[400] : colors.primary,
    color: colors.white,
    cursor: loading ? "not-allowed" : "pointer",
  }}
>
  {loading ? "Updating..." : "Update Password"}
</button>


      </div>
    </div>
    </>
  );
}
