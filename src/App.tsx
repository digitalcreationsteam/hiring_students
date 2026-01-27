import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Chat from "./ui/components/chat/Chat";

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
import "./App.css";
import Dashboard from "./screens/Dashboard";
import LoginSuccess from "./screens/LoginSuccess";
import CompleteProfile from "./screens/CompleteProfile";
import ForgotPassword from "./screens/ForgotPassword";
import ForgotPassword2 from "./screens/ForgotPassword2";
import ForgotPassword3 from "./screens/ForgotPassword3";
import ForgotPassword4 from "./screens/ForgotPassword4";
import EmailVerifiedSuccess from "./screens/EmailVerifiedSuccess";

const router = createBrowserRouter([
  { path: "/", element: <LogIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/login-success", element: <LoginSuccess /> },
  { path: "/complete-profile", element: <CompleteProfile /> },

  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-code", element: <ForgotPassword2 /> },
  { path: "/set-password", element: <ForgotPassword3 /> },
  { path: "/success-password", element: <ForgotPassword4 /> },

  // { path: "/verify-email", element: <EmailVerification /> },
  { path: "/verify-email", element: <EmailVerification /> },
  { path: "/verify-email/:token", element: <EmailVerification /> },
  { path: "/email-verified", element: <EmailVerifiedSuccess /> },


  { path: "/paywall", element: <Paywall /> },
  { path: "/talent-ranking", element: <TalentRankingPlatform /> },
  // { path: "/how-it-works", element: <HowItWorks /> },

  // { path: "/experience-index", element: <ExperienceIndex /> },
  // { path: "/skill-index", element: <SkillIndex /> },
  // { path: "/hireability-index", element: <HireabilityIndex /> },

  { path: "/upload-resume", element: <UploadResume /> },

  { path: "/demographics", element: <Demographics /> },
  { path: "/education", element: <Education /> },
  { path: "/experience", element: <Experience /> },
  { path: "/certifications", element: <Certifications /> },
  { path: "/awards", element: <Awards /> },
  { path: "/projects", element: <Projects /> },

  { path: "/skill-index-intro", element: <SkillIndexIntro /> },
  { path: "/job-domain", element: <JobDomain /> },
  { path: "/skills", element: <Skills /> },
  // { path: "/skills-assessment", element: <SkillAssessmentCard /> },

  { path: "/assessment-intro", element: <AssessmentIntro /> },
  { path: "/assessment", element: <AssessmentPage /> },
  { path: "/assessment-results", element: <AssessmentResult /> },

  { path: "/dashboard", element: <Dashboard /> },
  
    // ✅ CHAT ROUTE (THIS IS WHAT YOU NEEDED)

  // { path: "/chat/:otherUserId", element: <Chat /> }

]);

export default function App() {
  return <RouterProvider router={router} />;
}
