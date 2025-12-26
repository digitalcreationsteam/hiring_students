import axios from "axios";

/* =========================================
   🌐 BASE URL
========================================= */
export const BASE_URL = "http://localhost:5000/api";

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
  logout: "/auth/logout",
  verifyEmail:
    "/auth/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzZhNTY3Y2YxOTlkZWM3NzgxY2E4ZSIsImlhdCI6MTc2NTE4ODk2NywiZXhwIjoxNzY1NzkzNzY3fQ.OkuphrcwOBFyOuAjV3HyNMd-IaeiJa5lR_y7whS3PAc",

  /* ---------- USER ---------- */
  getUser: "/user",
  updateUser: "/user",

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
};

/* =========================================
   🚀 API WRAPPER
========================================= */
export default async function API(
  method,
  url,
  data = {},
  token = null,
  headers = {}
) {
  try {
    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        ...headers,
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
    return response.data;
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
      throw { ...data, status };
    } else if (error.request) {
      throw {
        success: false,
        message: "No response from server.",
      };
    } else {
      throw {
        success: false,
        message: error.message || "Unknown error occurred.",
      };
    }
  }
}
