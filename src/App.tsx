// src/App.tsx
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/authUtils";

// ✅ ADD THESE IMPORTS
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  hydrateNavigation,
  selectIsHydrated,
  selectIsLoading,
} from "./store/slices/onboardingSlice";

// ... all your existing imports
import Chat from "./ui/components/chat/Chat";
import LandingPage from "./screens/LandingPage";
import RecruiterChats from "./screens/RecruiterChats";
import SignUp from "./screens/SignUp";
import LogIn from "./screens/Login";
import EmailVerification from "./screens/EmailVerification";
import Paywall from "./screens/Paywall";
import HowItWorks from "./screens/HowItWorks";
import ExperienceIndex from "./screens/ExperienceIndex";
import SkillIndex from "./screens/SkillIndex";
import HireabilityIndex from "./screens/HireabilityIndex";
import UploadResume from "./screens/UploadResume";
import Education from "./screens/Education";
import Experience from "./screens/Experience";
import Certifications from "./screens/Certifications";
import Awards from "./screens/Awards";
import Projects from "./screens/Projects";
import JobDomain from "./screens/JobDomain";
import Skills from "./screens/Skills";
import AssessmentIntro from "./screens/AssesmentIntro";
import AssessmentPage from "./screens/AssesmentPage";
import AssessmentResult from "./screens/AssesmentResult";
import SkillAssessmentCard from "./screens/SkillsAssesment";
import TalentRankingPlatform from "./screens/TalentRankingPlatform";
import Demographics from "./screens/Demographics";
import SkillIndexIntro from "./screens/SkillIndexIntro";
import Dashboard from "./screens/Dashboard";
import LoginSuccess from "./screens/LoginSuccess";
import CompleteProfile from "./screens/CompleteProfile";
import ForgotPassword from "./screens/ForgotPassword";
import ForgotPassword2 from "./screens/ForgotPassword2";
import ForgotPassword3 from "./screens/ForgotPassword3";
import ForgotPassword4 from "./screens/ForgotPassword4";
import EmailVerifiedSuccess from "./screens/EmailVerifiedSuccess";
import ProtectedRoute from "./utils/ProtectedRoute";
import CaseAssessmentsPage from "./screens/CaseAssessments";
import CaseAssessmentOpening from "./screens/CaseAssessmentOpening";
import CaseAssessmentQuestions from "./screens/CaseAssessmentQuestions";
import CaseAssessmentScore from "./screens/CaseAssessmentScore";
import CaseAssessmentRevel from "./screens/CaseAssessmentRevel";
import PaymentProcessing from "./ui/components/PaymentProcessing";
import NotFound from "./screens/NotFound";

import "./App.css";

// ============================================
// ROUTER DEFINITION
// ============================================
const router = createBrowserRouter([
  {
    index: true,
    element: isAuthenticated() ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <LandingPage />
    ),
  },

  // ============================================
  // PUBLIC ROUTES
  // ============================================
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/login-success", element: <LoginSuccess /> },
  { path: "/how-it-works", element: <HowItWorks /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-code", element: <ForgotPassword2 /> },
  { path: "/set-password", element: <ForgotPassword3 /> },
  { path: "/success-password", element: <ForgotPassword4 /> },
  { path: "/verify-email", element: <EmailVerification /> },
  { path: "/verify-email/:token", element: <EmailVerification /> },
  { path: "/email-verified", element: <EmailVerifiedSuccess /> },

  // ============================================
  // SECTION 1: RESUME UPLOAD
  // ============================================
  {
    path: "/upload-resume",
    element: (
      <ProtectedRoute>
        <UploadResume />
      </ProtectedRoute>
    ),
  },

  // ============================================
  // SECTION 2: EXPERIENCE INDEX (Free Navigation)
  // ============================================
  {
    path: "/complete-profile",
    element: (
      <ProtectedRoute>
        <CompleteProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/demographics",
    element: (
      <ProtectedRoute>
        <Demographics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/education",
    element: (
      <ProtectedRoute>
        <Education />
      </ProtectedRoute>
    ),
  },
  {
    path: "/experience",
    element: (
      <ProtectedRoute>
        <Experience />
      </ProtectedRoute>
    ),
  },
  {
    path: "/certifications",
    element: (
      <ProtectedRoute>
        <Certifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/awards",
    element: (
      <ProtectedRoute>
        <Awards />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skill-index-intro",
    element: (
      <ProtectedRoute>
        <SkillIndexIntro />
      </ProtectedRoute>
    ),
  },

  // ============================================
  // SECTION 3: PAYWALL (Hard Gate)
  // ============================================
  {
    path: "/paywall",
    element: (
      <ProtectedRoute>
        <Paywall />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-processing",
    element: (
      <ProtectedRoute>
        <PaymentProcessing />
      </ProtectedRoute>
    ),
  },

  // ============================================
  // SECTION 4: SKILL ASSESSMENT (Requires Payment)
  // ============================================
  {
    path: "/job-domain",
    element: (
      <ProtectedRoute requirePayment>
        <JobDomain />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skills",
    element: (
      <ProtectedRoute requirePayment>
        <Skills />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment-intro",
    element: (
      <ProtectedRoute requirePayment>
        <AssessmentIntro />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment",
    element: (
      <ProtectedRoute requirePayment>
        <AssessmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment-results",
    element: (
      <ProtectedRoute requirePayment>
        <AssessmentResult />
      </ProtectedRoute>
    ),
  },

  // ============================================
  // APP ROUTES (Requires Onboarding Complete)
  // ============================================
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireComplete>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-chats",
    element: (
      <ProtectedRoute requireComplete>
        <RecruiterChats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute requireComplete>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:otherUserId",
    element: (
      <ProtectedRoute requireComplete>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/talent-ranking",
    element: (
      <ProtectedRoute requireComplete>
        <TalentRankingPlatform />
      </ProtectedRoute>
    ),
  },
  {
    path: "/experience-index",
    element: (
      <ProtectedRoute requireComplete>
        <ExperienceIndex />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skill-index",
    element: (
      <ProtectedRoute requireComplete>
        <SkillIndex />
      </ProtectedRoute>
    ),
  },
  {
    path: "/hireability-index",
    element: (
      <ProtectedRoute requireComplete>
        <HireabilityIndex />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skill-assessment",
    element: (
      <ProtectedRoute requireComplete>
        <SkillAssessmentCard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessments",
    element: (
      <ProtectedRoute requireComplete>
        <CaseAssessmentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-opening",
    element: (
      <ProtectedRoute requireComplete>
        <CaseAssessmentOpening />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-questions",
    element: (
      <ProtectedRoute requireComplete>
        <CaseAssessmentQuestions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-score",
    element: (
      <ProtectedRoute requireComplete>
        <CaseAssessmentScore />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-revel/:caseId",
    element: (
      <ProtectedRoute requireComplete>
        <CaseAssessmentRevel />
      </ProtectedRoute>
    ),
  },

  // ============================================
  // 404
  // ============================================
  {
    path: "*",
    element: <NotFound />,
  },
]);

// ============================================
// APP COMPONENT WITH HYDRATION
// ============================================
export default function App() {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector(selectIsHydrated);
  const isLoading = useAppSelector(selectIsLoading);
  const isAuth = isAuthenticated();

  // ✅ HYDRATE NAVIGATION ON MOUNT
  useEffect(() => {
    if (isAuth && !isHydrated) {
      console.log("🔄 Hydrating navigation from API...");
      dispatch(hydrateNavigation());
    }
  }, [isAuth, isHydrated, dispatch]);

  // ✅ SHOW LOADING SCREEN WHILE HYDRATING
  if (isAuth && !isHydrated && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">
            Loading your profile...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}