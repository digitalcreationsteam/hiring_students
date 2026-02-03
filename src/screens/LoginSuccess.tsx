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
    const userDataBase64 = params.get("user");
    const emailRequired = params.get("email_required");
    const provider = params.get("provider");
    const sub = params.get("sub");

    if (token) {
      localStorage.setItem("token", token);
      
      // Decode and store user data if available
      if (userDataBase64) {
        try {
          const decoded = decodeURIComponent(userDataBase64);
          const userData = JSON.parse(atob(decoded));
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("userId", userData.id);
          localStorage.setItem("userEmail", userData.email);
          localStorage.setItem("userName", `${userData.firstname} ${userData.lastname}`);
        } catch (error) {
          console.error("Failed to decode user data:", error);
        }
      }
      
      navigate("/talent-ranking", { replace: true });
      return;
    }

    // if (emailRequired === "true" && provider === "linkedin" && sub) {
    //   navigate(`/complete-profile?sub=${sub}`, { replace: true });
    //   return;
    // }

    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <h1>Login Successful!</h1>
  );
}
