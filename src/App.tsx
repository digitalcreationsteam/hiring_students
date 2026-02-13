import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/authUtils";
import Chat from "./ui/components/chat/Chat";
import LandingPage from './screens/LandingPage'
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

import "./App.css";
import NotFound from "./screens/NotFound";

const router = createBrowserRouter([
  {
    index: true,
    element: isAuthenticated()
      ? <Navigate to="/dashboard" replace />
      : <LandingPage />,
  },
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

  // ✅ PAYMENT PROCESSING ROUTE (After Dodo redirect)
  {
    path: "/payment-processing",
    element: (
      <ProtectedRoute>
        <PaymentProcessing />
      </ProtectedRoute>
    ),
  },

  // ✅ PROTECTED ROUTES (Authentication required)
  {
    path: "/recruiter-chats",
    element: (
      <ProtectedRoute>
        <RecruiterChats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:otherUserId",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/complete-profile",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <CompleteProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/paywall",
    element: (
      <ProtectedRoute>
        <Paywall />
      </ProtectedRoute>
    ),
  },
  {
    path: "/talent-ranking",
    element: (
      <ProtectedRoute>
        <TalentRankingPlatform />
      </ProtectedRoute>
    ),
  },
  {
    path: "/experience-index",
    element: (
      <ProtectedRoute>
        <ExperienceIndex />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skill-index",
    element: (
      <ProtectedRoute>
        <SkillIndex />
      </ProtectedRoute>
    ),
  },
  {
    path: "/hireability-index",
    element: (
      <ProtectedRoute>
        <HireabilityIndex />
      </ProtectedRoute>
    ),
  },
  {
    path: "/upload-resume",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <UploadResume />
      </ProtectedRoute>
    ),
  },
  {
    path: "/demographics",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <Demographics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/education",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <Education />
      </ProtectedRoute>
    ),
  },
  {
    path: "/experience",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <Experience />
      </ProtectedRoute>
    ),
  },
  {
    path: "/certifications",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <Certifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/awards",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <Awards />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skill-index-intro",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <SkillIndexIntro />
      </ProtectedRoute>
    ),
  },
  {
    path: "/job-domain",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <JobDomain />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skills",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <Skills />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment-intro",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <AssessmentIntro />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <AssessmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment-results",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <AssessmentResult />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment-results",
    element: (
      <ProtectedRoute>
        <AssessmentResult />
      </ProtectedRoute>
    ),
  },
  {
    path: "/skill-assessment",
    element: (
      <ProtectedRoute>
        <SkillAssessmentCard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessments",
    element: (
      <ProtectedRoute>
        <CaseAssessmentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-opening",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <CaseAssessmentOpening />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-questions",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <CaseAssessmentQuestions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-score",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <CaseAssessmentScore />
      </ProtectedRoute>
    ),
  },
  {
    path: "/case-assessment-revel/:caseId",
    element: (
      <ProtectedRoute requireIncomplete={true}>
        <CaseAssessmentRevel />
      </ProtectedRoute>
    ),
  },

  {
  path: "*",
  element: <NotFound />,
}

]);

export default function App() {
  return <RouterProvider router={router} />;
}