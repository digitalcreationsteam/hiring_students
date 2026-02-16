// src/utils/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
  selectIsHydrated,
  selectAllowedRoutes,
  selectHasPayment,
  selectIsComplete,
} from "../store/slices/onboardingSlice";
import { isAuthenticated } from "./authUtils";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requirePayment?: boolean; // For Section 4 routes
  requireComplete?: boolean; // For app routes (dashboard, etc)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePayment = false,
  requireComplete = false,
}) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const isHydrated = useAppSelector(selectIsHydrated);
  const allowedRoutes = useAppSelector(selectAllowedRoutes);
  const hasPayment = useAppSelector(selectHasPayment);
  const isComplete = useAppSelector(selectIsComplete);

  // ============================================
  // 1. CHECK AUTHENTICATION
  // ============================================
  if (!isAuth) {
    console.log("🚫 Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ============================================
  // 2. WAIT FOR HYDRATION
  // ============================================
  // This should rarely show because App.tsx handles hydration
  // But acts as safety net
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // 3. CHECK IF ONBOARDING COMPLETE (For App Routes)
  // ============================================
  if (requireComplete && !isComplete) {
    console.log("🚫 Onboarding not complete, redirecting");
    const correctRoute = allowedRoutes[allowedRoutes.length - 1];
    return <Navigate to={correctRoute || "/upload-resume"} replace />;
  }

  // ============================================
  // 4. CHECK PAYMENT REQUIREMENT (For Section 4)
  // ============================================
  if (requirePayment && !hasPayment) {
    console.log("🚫 Payment required but not paid, redirecting to paywall");
    return <Navigate to="/paywall" replace />;
  }

  // ============================================
  // 5. CHECK IF ROUTE IS ALLOWED
  // ============================================
  const currentPath = location.pathname;

  // Special handling for dynamic routes (e.g., /chat/:userId)
  const isAllowed = allowedRoutes.some((route) => {
    // Exact match
    if (route === currentPath) return true;

    // Prefix match (for dynamic routes)
    if (currentPath.startsWith(route + "/")) return true;

    return false;
  });

  if (!isAllowed) {
    console.log("🚫 Route not allowed:", currentPath);
    console.log("✅ Allowed routes:", allowedRoutes);

    // Redirect to the last allowed route (usually current step)
    const correctRoute = allowedRoutes[allowedRoutes.length - 1];
    return <Navigate to={correctRoute || "/upload-resume"} replace />;
  }

  // ============================================
  // ✅ ALL CHECKS PASSED
  // ============================================
  return children;
};

export default ProtectedRoute;