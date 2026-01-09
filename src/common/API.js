import axios from "axios";

/* =========================================
   🌐 BASE URL
========================================= */
export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = "http://localhost:5001/api";

const isDev = process.env.NODE_ENV === "development";


/* =========================================
   🧪 LOGGER
========================================= */
export const log = (str) => {
  if (!isDev) return;
  console.log("====================================");
  console.log(str);
  console.log("====================================");
};

/* =========================================
   🔥 AXIOS INSTANCE (CORS + SESSION SAFE)
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
  login: "/auth/login",
  loginGoogle:"/auth/google",

  logout: "/auth/logout",
  verifyEmail: "/auth/verify",          
  resendVerification: "/auth/resend-verification",
  /* ---------- USER ---------- */
  getUser: "/user",
  updateUser: "/user",


  /*-----------UPLOAD RESUME-----------*/
  uploadResume:"/user/resume",
  uploadProfile:"/user/profile",


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




  /*========Skill Indes==========*/
  jobDomain:"/user/addUserDomainSubDomain",
  updateUserDomainSkills:"/user/updateUserDomainSkills",
  getJobDomain:"/user/domain",
  getSubDomain:"/user/by-domain/694e588f2af883559ebe9540",
  getUserDomainSkils:"/user/getUserDomainSkills",


  /*=======Skill Assesment=========*/
  startAssessment:"/user/assessment/start",
  getAttemptQuestions:"/user/assessment/getAttemptQuestions",
  saveAnswer:"/user/assessment/saveAnswer",
  submitAssessment:"/user/assessment/submit",

  /*========= Result ================*/
  result: "/user/experience_index",



  /* ---------- FORGOT PASSWORD ---------- */
  forgotPassword: "/auth/forgot-password",
  verifyResetCode: "/auth/verify-reset-code",
  resetPassword: "/auth/reset-password",

};

/* =========================================
   🚀 API WRAPPER
========================================= */
export default async function API(method, url, data = {}, headers = {}) {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(userId && { "user-id": userId }), 
        ...headers,
      },
    };

    if (config.method === "get") {
      config.params = data;
    } else {
      config.data = data;
      if (data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    const response = await apiClient(config);

    console.log("responseresponse:::::::",response)
    return response.data;
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
      throw { ...data, status };
    } else if (error.request) {
      throw { success: false, message: "No response from server." };
    } else {
      throw { success: false, message: error.message || "Unknown error occurred." };
    }
  }
}
