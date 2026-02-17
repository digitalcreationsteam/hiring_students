// src/common/API.js
// ✅ PURE JAVASCRIPT VERSION (No TypeScript)

import axios from "axios";

/* =========================================
   🌐 BASE URL
========================================= */
// export const BASE_URL = "http://localhost:5000/dev-api";
// export const BASE_URL = "http://localhost:5000/api";
export const BASE_URL = "https://unitalent.cloud/api";
// export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = "http://192.168.0.105:5001/api";
// export const BASE_URL = "http://192.168.0.104:5002/api";
// export const BASE_URL = "https://unitalent.cloud/dev-api";


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
  // verifyEmail: '/auth/verify', // This will be used as base, we'll append token
  // resendVerification: '/auth/resend-verification',
  verifyOTP: '/auth/verify-otp',
  resendOTP: '/auth/resend-otp',


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

  getunivercitylist: "/user/universities",

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

  /*----------User MY Profile----------*/
  getUserProfile: `/user/my-profile`,

  /* ---------- SKILL ASSESSMENT ---------- */
  startAssessment: "/user/assessment/start",
  getAttemptQuestions: "/user/assessment/getAttemptQuestions",
  saveAnswer: "/user/assessment/saveAnswer",
  submitAssessment: "/user/assessment/submit",
  reportViolation: "/user/assessment/violation",
  getUserDomainSkils: "/user/getUserDomainSkills",

  createSubscription: "/subscription/create",
  initiateDodoPayment: "/subscription/payments/dodo/initiate",
  checkSubsciptionStatus: "/subscription",
  verifyPayment: "/subscription/verify",
  getSubscriptions: "/subscription",
  getCurrentSubscription: "/subscription/current",
  cancelSubscription: "/subscription",
  getPlans: "/subscription/plans",
  subscriptionStatus: "/subscription/status/",
  checkSubscriptionStatus: (id) => `/subscription/${id}/status`,
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
  // getCurrentQuestion: (attemptId) => `/cases/attempt/${attemptId}/question`,
  getCurrentQuestion: (caseId, number) => `/cases/${caseId}/questions/${number}`,
  // submitAnswer: (attemptId) => `/cases/attempt/${attemptId}/answer`,
  submitAnswer: (caseId, questionId) => `/cases/${caseId}/questions/${questionId}/answer`,
  submitAttempt: (attemptId) => `cases/attempt/${attemptId}/submit`,
  getCaseReveal: (caseId) => `/cases/${caseId}/reveal`,
  getOpening: (caseId) => `/cases/${caseId}/opening`,

  getStudentsBySchool: "/user/students"
};



/* =========================================
   🚀 API WRAPPER FUNCTION
========================================= */
// export default async function API(method, url, data = {}, headers = {}) {
//   try {
//     // Get auth token and userId from localStorage
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");

//     const config = {
//       method: method.toLowerCase(),
//       url,
//       headers: {
//         // Add auth token if exists
//         ...(token && { Authorization: `Bearer ${token}` }),
//         // Add userId if exists
//         ...(userId && { "user-id": userId }),
//         // Merge custom headers
//         ...headers,
//       },
//     };

//     // Handle GET requests
//     if (config.method === "get") {
//       config.params = data;
//     } else {
//       // Handle POST/PUT/PATCH requests
//       config.data = data;

//       // Don't set Content-Type for FormData
//       if (data instanceof FormData) {
//         delete config.headers["Content-Type"];
//       } else {
//         config.headers["Content-Type"] = "application/json";
//       }
//     }

//     // Make request
//     const response = await apiClient(config);

//     // Log in development
//     if (isDev) {
//       console.log(`✅ ${method.toUpperCase()} ${url}`, response.data);
//     }

//     return response.data;
//   } catch (error) {
//     // Log error in development
//     if (isDev) {
//       console.error(`❌ ${method.toUpperCase()} ${url}`, error);
//     }

//     // Handle response errors
//     if (error.response) {
//       const { data, status } = error.response;
//       throw { ...data, status };
//     }
//     // Handle network errors
//     else if (error.request) {
//       throw {
//         success: false,
//         message: "No response from server. Check your connection.",
//       };
//     }
//     // Handle other errors
//     else {
//       throw {
//         success: false,
//         message: error.message || "An unexpected error occurred.",
//       };
//     }
//   }
// }

export default async function API(method, url, data = {}, headers = {}) {
  // Log the request details at the start
  console.log(`\n========== 🌐 API REQUEST ==========`);
  console.log(`📌 Method: ${method.toUpperCase()}`);
  console.log(`📌 URL: ${url}`);

  const fullUrl = `${BASE_URL}${url}`;
  console.log(`📌 Full endpoint: ${fullUrl}`);
  console.log(`📌 Environment: ${isDev ? 'Development' : 'Production'}`);

  try {
    // Get auth token and userId from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log(`🔑 Auth Check:`);
    console.log(`   - Token present: ${!!token}`);
    if (token) console.log(`   - Token preview: ${token.substring(0, 20)}...`);
    console.log(`   - User ID present: ${!!userId}`);
    console.log(`   - User ID value: ${userId || 'MISSING'}`);

    // Build headers
    const requestHeaders = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(userId && { "user-id": userId }),
      ...headers,
    };

    // Log headers being sent (hide full token for security)
    console.log(`📨 Request Headers being sent:`);
    const safeHeaders = { ...requestHeaders };
    if (safeHeaders.Authorization) {
      safeHeaders.Authorization = `Bearer ${token ? token.substring(0, 15) + '...' : 'none'}`;
    }
    console.log(safeHeaders);

    // Handle FormData
    if (data instanceof FormData) {
      console.log(`📎 FormData detected:`);
      for (let pair of data.entries()) {
        if (pair[0] === 'resume' && pair[1] instanceof File) {
          console.log(`   - ${pair[0]}: File: ${pair[1].name}, Size: ${(pair[1].size / 1024).toFixed(2)}KB, Type: ${pair[1].type}`);
        } else {
          console.log(`   - ${pair[0]}:`, pair[1]);
        }
      }
      // Let browser set Content-Type for FormData
      delete requestHeaders["Content-Type"];
    } else {
      console.log(`📦 Data:`, data);
      requestHeaders["Content-Type"] = "application/json";
    }

    // Make request and measure time
    console.log(`🚀 Sending request to ${method.toUpperCase()} ${url}...`);
    const startTime = Date.now();

    const fetchOptions = {
      method: method.toUpperCase(),
      headers: requestHeaders,
    };

    // Add body for non-GET requests
    if (method.toUpperCase() !== 'GET') {
      if (data instanceof FormData) {
        fetchOptions.body = data;
      } else {
        fetchOptions.body = JSON.stringify(data);
      }
    }

    const response = await fetch(fullUrl, fetchOptions);

    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Response time: ${responseTime}ms`);
    console.log(`📥 Response status: ${response.status} ${response.statusText}`);

    // Parse response
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log(`📦 Response data:`, responseData);

    if (!response.ok) {
      // Create a consistent error object
      const error = new Error(
        responseData?.message ||
        responseData?.error ||
        `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = responseData;
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      };
      throw error;
    }

    console.log(`✅ ${method.toUpperCase()} ${url} - Success!`);
    console.log(`========== ✅ API REQUEST COMPLETE ==========\n`);

    return responseData;

  } catch (error) {
    console.log(`\n========== ❌ API ERROR ==========`);
    console.log(`❌ Error in ${method.toUpperCase()} ${url}`);

    // Log error details
    console.error(`❌ Error name:`, error.name || 'Unknown');
    console.error(`❌ Error message:`, error.message || 'Unknown error');

    if (error.status) {
      console.error(`❌ Error status:`, error.status);
    }

    if (error.data) {
      console.error(`❌ Error data:`, error.data);
    }

    if (error.response) {
      console.error(`❌ Error response:`, error.response);
    }

    // Log stack trace in development
    if (isDev && error.stack) {
      console.error(`❌ Stack trace:`, error.stack);
    }

    console.log(`========== ❌ API ERROR END ==========\n`);

    // Re-throw the error so the component can handle it
    throw error;
  }
}

// Helper function to test API connection
export const testAPIConnection = async () => {
  console.log(`\n========== 🔌 TESTING API CONNECTION ==========`);

  console.log(`📡 Base URL: ${BASE_URL}`);

  // Check localStorage
  console.log(`📦 localStorage contents:`);
  console.log(`   - Token: ${!!localStorage.getItem("token")}`);
  console.log(`   - UserId: ${localStorage.getItem("userId")}`);
  console.log(`   - UserEmail: ${localStorage.getItem("userEmail")}`);

  try {
    // Try a simple health check endpoint
    const testUrl = `${BASE_URL}/health`;
    console.log(`🏥 Testing health endpoint: ${testUrl}`);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(`📥 Health check response status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Server is healthy:`, data);
    } else {
      const data = await response.text();
      console.log(`⚠️ Server returned non-200 status:`, data);
    }

  } catch (error) {
    console.error(`❌ Cannot connect to server:`, error.message);
    console.log(`💡 Make sure your backend server is running at: ${BASE_URL}`);
    console.log(`💡 If your backend is on a different port, update REACT_APP_API_URL in .env file`);
  }

  console.log(`========== 🏁 TEST COMPLETE ==========\n`);
};
