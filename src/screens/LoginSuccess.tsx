import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // ❌ If backend did NOT send token
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // ✅ Save JWT
    localStorage.setItem("token", token);

    // ✅ Redirect user after login
    navigate("/demographics", { replace: true });
  }, [navigate]);

  return (
    <p className="mt-20 text-center text-sm text-gray-600">
      Logging you in…
    </p>
  );
}
