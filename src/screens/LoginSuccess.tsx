import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const emailRequired = params.get("email_required");
    const provider = params.get("provider");
    const sub = params.get("sub");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/demographics", { replace: true });
      return;
    }

    // if (emailRequired === "true" && provider === "linkedin" && sub) {
    //   navigate(`/complete-profile?sub=${sub}`, { replace: true });
    //   return;
    // }

    navigate("/login", { replace: true });
  }, [navigate]);

  return <p className="text-center mt-10">Completing login…</p>;
}
