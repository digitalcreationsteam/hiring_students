// src/common/API.js
// ✅ PURE JAVASCRIPT VERSION (No TypeScript)

import axios from "axios";

/* =========================================
   🌐 BASE URL
========================================= */
export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = "http://localhost:5001/api";
//export const BASE_URL = "https://unitalent.cloud/api";


const isDev = process.env.NODE_ENV === "development";

/* =========================================
   🔥 AXIOS INSTANCE
========================================= */
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

/* =========================================
   🔗 ALL API PATHS
========================================= */
export const URL_PATH = {
  /* ---------- AUTH ---------- */
  signup: "/auth/signup",
  checkEmailVerification: "/auth/verification-status",
  login: "/auth/login",
  logout: "/auth/logout",
  loginGoogle: "/auth/google",
  loginLinkedin: "/auth/linkedin",

  /* ✅ Navigation endpoints */
  getUserStatus: "/auth/user-status",
  verifyRoute: "/auth/verify-route",

  /* ---------- EMAIL VERIFICATION ---------- */
  verifyEmail: "/auth/verify",
  resendVerification: "/auth/resend-verification",

  /* ---------- PASSWORD RESET ---------- */
  forgotPassword: "/auth/forgot-password",
  verifyResetCode: "/auth/verify-reset-code",
  resetPassword: "/auth/reset-password",

  /* ---------- USER PROFILE ---------- */
  getUser: "/user",
  updateUser: "/user",
  uploadResume: "/user/resume",
  getResume: "/user/resume",
  uploadProfile: "/user/profile",

  /* ---------- EXPERIENCE INDEX ---------- */
  calculateExperienceIndex: "/user/experience_index",

  /* ---------- DEMOGRAPHICS ---------- */
  demographics: "/user/demographics",
  getDemographics: "/user/demographics",
  deleteDemographics: "/user/demographics",

  /* ---------- EDUCATION ---------- */
  education: "/user/education",
  getEducation: "/user/education",
  deleteEducation: "/user/education",

  /* ---------- WORK EXPERIENCE ---------- */
  experience: "/user/work",
  getExperience: "/user/work",
  deleteExperience: "/user/work",

  /* ---------- CERTIFICATIONS ---------- */
  certification: "/user/certification",
  getCertification: "/user/certification",
  deleteCertification: "/user/certification",

  /* ---------- AWARDS ---------- */
  awards: "/user/awards",
  getAwards: "/user/awards",
  deleteAward: "/user/awards",

  /* ---------- PROJECTS ---------- */
  projects: "/user/projects",
  getProjects: "/user/projects",
  deleteProject: "/user/projects",

  /* ---------- JOB DOMAIN & SKILLS ---------- */
  jobDomain: "/user/addUserDomainSubDomain",
  updateUserDomainSkills: "/user/updateUserDomainSkills",
  getJobDomain: "/user/domain",
  getSubDomain: "/user/by-domain/694e588f2af883559ebe9540",
  getUserDomainSkills: "/user/getUserDomainSkills",

  /* ---------- SKILL ASSESSMENT ---------- */
  startAssessment: "/user/assessment/start",
  getAttemptQuestions: "/user/assessment/getAttemptQuestions",
  saveAnswer: "/user/assessment/saveAnswer",
  submitAssessment: "/user/assessment/submit",
  reportViolation: "/user/assessment/violation",
  getUserDomainSkils: "/user/getUserDomainSkills",

  createSubscription: "/subscription/create",
  initiateDodoPayment: "/subscription/payments/dodo/initiate",
  checkSubsciptionStatus:"/subscription",
  verifyPayment: "/subscription/verify",
  getSubscriptions: "/subscription",
  getCurrentSubscription: "/subscription/current",
  cancelSubscription: "/subscription",
  getPlans: "/subscription/plans",
  subscriptionStatus: "/subscription/status/",
  subscriptionMarkPaid: "/subscription/mark-paid",

  /* ---------- RESULTS ---------- */
  result: "/user/experience_index",

  /* ---------- CHAT ---------- */
  getChatHistory: (otherUserId) => `/chat/${otherUserId}`,
  getChatParticipants: "/chat/participants", // Get all people you've chatted with
  markMessagesRead: "/chat/mark-read",
  getUnreadCount: "/chat/unread-count",

  // Case Study
  getAllCases: "/cases/",
  startCase: (caseId) => `/cases/${caseId}/start`,
  getCurrentQuestion: (attemptId) => `/cases/attempt/${attemptId}/question`,
  submitAnswer: (attemptId) => `/cases/attempt/${attemptId}/answer`,
  submitAttempt: (attemptId) => `cases/attempt/${attemptId}/submit`,
  getCaseReveal: (caseId) => `/cases/${caseId}/reveal`
};



/* =========================================
   🚀 API WRAPPER FUNCTION
========================================= */
export default async function API(method, url, data = {}, headers = {}) {
  try {
    // Get auth token and userId from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        // Add auth token if exists
        ...(token && { Authorization: `Bearer ${token}` }),
        // Add userId if exists
        ...(userId && { "user-id": userId }),
        // Merge custom headers
        ...headers,
      },
    };

    // Handle GET requests
    if (config.method === "get") {
      config.params = data;
    } else {
      // Handle POST/PUT/PATCH requests
      config.data = data;

      // Don't set Content-Type for FormData
      if (data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    // Make request
    const response = await apiClient(config);

    // Log in development
    if (isDev) {
      console.log(`✅ ${method.toUpperCase()} ${url}`, response.data);
    }

    return response.data;
  } catch (error) {
    // Log error in development
    if (isDev) {
      console.error(`❌ ${method.toUpperCase()} ${url}`, error);
    }

    // Handle response errors
    if (error.response) {
      const { data, status } = error.response;
      throw { ...data, status };
    }
    // Handle network errors
    else if (error.request) {
      throw {
        success: false,
        message: "No response from server. Check your connection.",
      };
    }
    // Handle other errors
    else {
      throw {
        success: false,
        message: error.message || "An unexpected error occurred.",
      };
    }
  }
}