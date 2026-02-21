import React, { useState, useEffect, useRef } from "react";
import {
  Edit2,
  Mail,
  MapPin,
  Briefcase,
  Phone,
  Save,
  Calendar,
  BookOpen,
  User,
  Award,
  Clock,
  ChevronRight,
  Plus,
  X,
  FileCheck,
  Package,
  Link as LinkIcon,
  LogOut,
  Camera,
} from "lucide-react";
import {
  FeatherArrowLeft,
  
} from "@subframe/core";
import { uniTalentColors } from "src/common/Colors";
import { colors } from "src/common/Colors";
import API from "src/common/API";
import { URL_PATH } from "src/common/API";
import Navbar from "src/ui/components/Navbar";
import EditExperience from "src/ui/components/EditExperienceModal";
import EditEducationModal from "src/ui/components/EditEducationModal";
import EditCertificationModal from "src/ui/components/EditCertificationModal";
import EditAwardModal from "src/ui/components/EditAwardModal";
import EditProjectModal from "src/ui/components/EditProjectModal";
import Footer from "../ui/components/Footer";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  headline: string;
  bio: string;
  avatar: string;
  joinDate: string;
  phoneVisibleToRecruiters?: boolean;
}

interface WorkExperience {
  _id?: string;
  jobTitle?: string;
  companyName?: string;
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  currentlyWorking?: boolean;
  description?: string;
  typeOfRole?: string;
  duration?: number;
}

interface Education {
  _id?: string;
  degree?: string;
  fieldOfStudy?: string;
  schoolName?: string;
  startYear?: number;
  endYear?: number;
  currentlyStudying?: boolean;
  gpa?: string;
  cgpa?: string;
  duration?: number;
}

interface Certification {
  _id?: string;
  certificationName: string;
  issuer: string;
  issueDate: string;
  credentialLink?: string;
}

interface Award {
  _id?: string;
  awardName: string;
  description?: string;
  year: number;
}

interface Project {
  _id?: string;
  projectName: string;
  role: string;
  summary?: string;
  outcome?: string;
  link?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: "",
  email: "",
  phoneNumber: "",
  country: "",
  state: "",
  city: "",
  headline: "Professional",
  bio: "",
  avatar: "",
  joinDate: "",
};

const MyProfile: React.FC = () => {
  const navigate = useNavigate();

  // ── Avatar upload refs & state ──────────────────────────────
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  // Section data
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Edit states for each section
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null,
  );
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Modal visibility
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchWorkExperiences(),
      fetchEducations(),
      fetchCertifications(),
      fetchAwards(),
      fetchProjects(),
    ]);
  };

  const fetchWorkExperiences = async () => {
    try {
      const res = await API("GET", URL_PATH.getExperience);
      setWorkExperiences(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    }
  };

  const fetchEducations = async () => {
    try {
      const res = await API("GET", URL_PATH.getEducation);
      setEducations(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch educations:", err);
    }
  };

  const fetchCertifications = async () => {
    try {
      const res = await API("GET", URL_PATH.getCertification);
      setCertifications(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch certifications:", err);
    }
  };

  const fetchAwards = async () => {
    try {
      const res = await API("GET", URL_PATH.getAwards);
      setAwards(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch awards:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API("GET", URL_PATH.getProjects);
      setProjects(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const extractProfileData = (responseData: any): UserProfile => {
    console.log("📊 extractProfileData - Full response:", responseData);

    const data = responseData?.data || {};
    const demographics = data?.demographics || {};
    const documents = responseData?.documents || {};

    console.log("📊 demographics:", demographics);
    console.log("📊 documents:", documents);

    return {
      fullName: demographics?.fullName || "",
      email: demographics?.email || "",
      phoneNumber: demographics?.phoneNumber || "",
      country: demographics?.country || "",
      state: demographics?.state || "",
      city: demographics?.city || "",
      headline: demographics?.headline || "Professional",
      bio: demographics?.bio || "",
      avatar: documents?.profileUrl || "",
      joinDate: demographics?.createdAt
        ? new Date(demographics.createdAt).toLocaleDateString()
        : "",
      phoneVisibleToRecruiters: demographics?.phoneVisibleToRecruiters || false,
    };
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API("GET", URL_PATH.getUserProfile);
      console.log("📊 API Response:", response);

      const profileData = extractProfileData(response);
      setProfile(profileData);
      if (profileData.avatar) {
  try {
    const u = localStorage.getItem("user");
    const parsed = u ? JSON.parse(u) : {};
    parsed.profileUrl = profileData.avatar;
    localStorage.setItem("user", JSON.stringify(parsed));
  } catch (e) {
    console.error("Error saving avatar to localStorage:", e);
  }
}

      if (response?.data) {
        setEducations(response.data.education || []);
        setWorkExperiences(response.data.workExperience || []);
        setCertifications(response.data.certifications || []);
        setAwards(response.data.awards || []);
        setProjects(response.data.projects || []);
      }

      setImageFailed(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      console.error("Error fetching profile:", err);
      setProfile(DEFAULT_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  // ── Avatar upload handler (same as Dashboard) ───────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Instant preview
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, avatar: previewUrl }));
    setImageFailed(false);

    try {
      setIsUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", file);

      await API("POST", URL_PATH.uploadProfile, formData);

      // Refresh to get real server URL
      await fetchProfile();

      // Notify Navbar / other listeners
      window.dispatchEvent(new Event("avatar-updated"));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Failed to upload profile picture. Please try again.");
      await fetchProfile();
    } finally {
      setIsUploadingAvatar(false);
      setTimeout(() => URL.revokeObjectURL(previewUrl), 1000);
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // Profile edit handlers
  const handleEditClick = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(null);
    setSaveError(null);
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    try {
      setSaveLoading(true);
      setSaveError(null);

      const dataToUpdate = {
        fullName: editedProfile.fullName,
        email: editedProfile.email,
        phoneNumber: editedProfile.phoneNumber,
        country: editedProfile.country,
        state: editedProfile.state,
        city: editedProfile.city,
        headline: editedProfile.headline,
        bio: editedProfile.bio,
        phoneVisibleToRecruiters: editedProfile.phoneVisibleToRecruiters,
      };

      await API("POST", URL_PATH.demographics, dataToUpdate);

      setProfile(editedProfile);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save profile";
      setSaveError(errorMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Experience CRUD
  const handleSaveExperience = async (experience: WorkExperience) => {
    try {
      setSaveLoading(true);
      if (experience._id) {
        await API(
          "PUT",
          `${URL_PATH.updateExperience}/${experience._id}`,
          experience,
        );
      } else {
        await API("POST", URL_PATH.experience, {
          workExperiences: [experience],
        });
      }
      await fetchWorkExperiences();
      setShowExperienceModal(false);
      setEditingExperience(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save experience:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await API("DELETE", `${URL_PATH.deleteExperience}/${id}`);
        await fetchWorkExperiences();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to delete experience:", err);
      }
    }
  };

  // Education CRUD
  const handleSaveEducation = async (education: Education) => {
    try {
      setSaveLoading(true);
      if (education._id) {
        await API("PUT", `${URL_PATH.education}/${education._id}`, education);
      } else {
        await API("POST", URL_PATH.education, { educations: [education] });
      }
      await fetchEducations();
      setShowEducationModal(false);
      setEditingEducation(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save education:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      try {
        await API("DELETE", `${URL_PATH.deleteEducation}/${id}`);
        await fetchEducations();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to delete education:", err);
      }
    }
  };

  // Certification CRUD
  const handleSaveCertification = async (certification: Certification) => {
    try {
      setSaveLoading(true);
      if (certification._id) {
        await API(
          "PUT",
          `${URL_PATH.certification}/${certification._id}`,
          certification,
        );
      } else {
        await API("POST", URL_PATH.certification, {
          certifications: [certification],
        });
      }
      await fetchCertifications();
      setShowCertificationModal(false);
      setEditingCertification(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save certification:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await API("DELETE", `${URL_PATH.deleteCertification}/${id}`);
        await fetchCertifications();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to delete certification:", err);
      }
    }
  };

  // Award CRUD
  const handleSaveAward = async (award: Award) => {
    try {
      setSaveLoading(true);
      if (award._id) {
        await API("PUT", `${URL_PATH.awards}/${award._id}`, award);
      } else {
        await API("POST", URL_PATH.awards, { awards: [award] });
      }
      await fetchAwards();
      setShowAwardModal(false);
      setEditingAward(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save award:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteAward = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this award?")) {
      try {
        await API("POST", `${URL_PATH.deleteAward}/${id}`);
        await fetchAwards();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to delete award:", err);
      }
    }
  };

  // Project CRUD
  const handleSaveProject = async (project: Project) => {
    try {
      setSaveLoading(true);
      if (project._id) {
        await API("PUT", `${URL_PATH.projects}/${project._id}`, project);
      } else {
        await API("POST", URL_PATH.projects, { projects: [project] });
      }
      await fetchProjects();
      setShowProjectModal(false);
      setEditingProject(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await API("POST", `${URL_PATH.deleteProject}/${id}`);
        await fetchProjects();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (editedProfile) {
      setEditedProfile((prev) => {
        if (!prev) return null;
        return { ...prev, [name]: value } as UserProfile;
      });
    }
  };

  const handleImageError = () => {
    setImageFailed(true);
  };

  const getFullAddress = () => {
    const parts = [profile.city, profile.state, profile.country].filter(
      Boolean,
    );
    return parts.length > 0 ? parts.join(", ") : "Address not set";
  };

  const getInitials = () => {
    if (!profile.fullName) return "U";
    const names = profile.fullName.split(" ");
    return names
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatWorkDate = (month?: number, year?: number) => {
    if (!year) return "";
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthName = month ? monthNames[month - 1] : "";
    return month ? `${monthName} ${year}` : `${year}`;
  };

  const formatEducationDate = (year?: number) => {
    return year ? year.toString() : "";
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "";
    const years = Math.floor(duration / 12);
    const months = duration % 12;
    if (years > 0 && months > 0) {
      return `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`;
    } else if (years > 0) {
      return `${years} yr${years > 1 ? "s" : ""}`;
    } else {
      return `${months} mo${months > 1 ? "s" : ""}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: uniTalentColors.primary }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: uniTalentColors.secondary }}
          />
        </div>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: uniTalentColors.primary }}
            ></div>
            <p
              className="mt-4 text-sm"
              style={{ color: uniTalentColors.secondary }}
            >
              Loading your profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: uniTalentColors.primary }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: uniTalentColors.secondary }}
        />
      </div>

      <Navbar />

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-24 right-6 z-50 animate-slide-down">
          <div
            className="backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-2"
            style={{
              backgroundColor: `${uniTalentColors.white}CC`,
              border: `1px solid ${uniTalentColors.white}`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: uniTalentColors.primary }}
            >
              <span className="text-white text-sm">✓</span>
            </div>
            <span style={{ color: uniTalentColors.text }}>
              Changes saved successfully!
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
        <div className="flex justify-center">
          <div className="w-full max-w-[1000px]">
            <button
                onClick={() => navigate("/dashboard")}
                className="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
                style={{ color: colors.neutral[600] }}
              >
                <FeatherArrowLeft style={{ width: 20, height: 20 }} />
              </button>

            {/* ── Profile Header ─────────────────────────────────── */}
           <div
  className="backdrop-blur-xl rounded-3xl shadow-2xl relative overflow-hidden mb-8 w-full"
  style={{
    backgroundColor: `${uniTalentColors.white}CC`,
    border: `1px solid ${uniTalentColors.white}`,
  }}
>
  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

  <div className="relative z-10 p-4 sm:p-6 md:p-8">
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
      {/* ── Avatar with pencil/camera upload ── */}
      <div className="flex-shrink-0">
        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleAvatarChange}
          className="hidden"
        />

        <div
          className="relative group cursor-pointer"
          onClick={() => fileRef.current?.click()}
          title="Change profile photo"
        >
          {/* Avatar image or initials fallback */}
          {profile.avatar && !imageFailed ? (
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-2xl object-cover shadow-xl"
              style={{
                boxShadow: `0 0 0 4px ${uniTalentColors.white}`,
              }}
              onError={handleImageError}
            />
          ) : (
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-white shadow-xl"
              style={{
                backgroundColor: uniTalentColors.primary,
                boxShadow: `0 0 0 4px ${uniTalentColors.white}`,
              }}
            >
              {profile.fullName ? getInitials() : "U"}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-200">
            {isUploadingAvatar ? (
              <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white mb-1" />
                <span className="text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
                  Change
                </span>
              </>
            )}
          </div>

          {/* Always-visible pencil badge (bottom-right corner) */}
          {!isUploadingAvatar && (
            <div
              className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              style={{ backgroundColor: uniTalentColors.primary }}
            >
              <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-white" />
            </div>
          )}

          {/* Uploading spinner badge */}
          {isUploadingAvatar && (
            <div
              className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              style={{ backgroundColor: uniTalentColors.primary }}
            >
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="text-center sm:text-left">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-light mb-1 break-words"
              style={{ color: uniTalentColors.text }}
            >
              {profile.fullName || "Your Name"}
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl font-light"
              style={{ color: uniTalentColors.secondary }}
            >
              {profile.headline}
            </p>
          </div>

          <div className="flex justify-center sm:justify-end">
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="group relative h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium overflow-hidden whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
              >
                <div
                  className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${uniTalentColors.primary}, ${uniTalentColors.secondary})`,
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                  <span className="hidden xs:inline">Edit Profile</span>
                  <span className="xs:hidden">Edit</span>
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl"
            style={{
              backgroundColor: `${uniTalentColors.primary}08`,
            }}
          >
            <Mail
              size={16}
              className="sm:w-[18px] sm:h-[18px] flex-shrink-0"
              style={{ color: uniTalentColors.primary }}
            />
            <span
              className="text-xs sm:text-sm truncate"
              style={{ color: uniTalentColors.secondary }}
            >
              {profile.email || "email@example.com"}
            </span>
          </div>
          
          <div
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl"
            style={{
              backgroundColor: `${uniTalentColors.primary}08`,
            }}
          >
            <MapPin
              size={16}
              className="sm:w-[18px] sm:h-[18px] flex-shrink-0"
              style={{ color: uniTalentColors.primary }}
            />
            <span
              className="text-xs sm:text-sm truncate"
              style={{ color: uniTalentColors.secondary }}
            >
              {getFullAddress()}
            </span>
          </div>
          
          <div
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl"
            style={{
              backgroundColor: `${uniTalentColors.primary}08`,
            }}
          >
            <Phone
              size={16}
              className="sm:w-[18px] sm:h-[18px] flex-shrink-0"
              style={{ color: uniTalentColors.primary }}
            />
            <span
              className="text-xs sm:text-sm truncate"
              style={{ color: uniTalentColors.secondary }}
            >
              {profile.phoneNumber || "Not provided"}
            </span>
          </div>
          
          <div
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl"
            style={{
              backgroundColor: `${uniTalentColors.primary}08`,
            }}
          >
            <Calendar
              size={16}
              className="sm:w-[18px] sm:h-[18px] flex-shrink-0"
              style={{ color: uniTalentColors.primary }}
            />
            <span
              className="text-xs sm:text-sm truncate"
              style={{ color: uniTalentColors.secondary }}
            >
              Joined {profile.joinDate || "Recently"}
            </span>
          </div>
        </div>

        {!isEditing && profile.bio && (
          <div
            className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl"
            style={{
              backgroundColor: `${uniTalentColors.primary}08`,
            }}
          >
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: uniTalentColors.secondary }}
            >
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

            {/* ── Edit Profile Form ───────────────────────────────── */}
            {isEditing && editedProfile && (
              <div
                className="backdrop-blur-xl rounded-3xl shadow-2xl relative overflow-hidden mb-8"
                style={{
                  backgroundColor: `${uniTalentColors.white}CC`,
                  border: `1px solid ${uniTalentColors.white}`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                <div className="relative z-10 p-6 md:p-8">
                  <h2
                    className="text-2xl font-light mb-6"
                    style={{ color: uniTalentColors.text }}
                  >
                    Edit Profile
                  </h2>

                  {saveError && (
                    <div
                      className="mb-6 p-4 rounded-xl"
                      style={{
                        backgroundColor: `${uniTalentColors.primary}15`,
                      }}
                    >
                      <p style={{ color: uniTalentColors.primary }}>
                        {saveError}
                      </p>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: uniTalentColors.text }}
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={editedProfile.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none"
                          style={{
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text,
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: uniTalentColors.text }}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editedProfile.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none"
                          style={{
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text,
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: uniTalentColors.text }}
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editedProfile.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none"
                          style={{
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text,
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: uniTalentColors.text }}
                        >
                          Headline
                        </label>
                        <input
                          type="text"
                          name="headline"
                          value={editedProfile.headline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none"
                          style={{
                            borderColor: uniTalentColors.lightGray,
                            color: uniTalentColors.text,
                          }}
                          placeholder="e.g., Full Stack Developer"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3
                        className="text-lg font-light mb-4"
                        style={{ color: uniTalentColors.text }}
                      >
                        Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: uniTalentColors.text }}
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={editedProfile.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none"
                            style={{
                              borderColor: uniTalentColors.lightGray,
                              color: uniTalentColors.text,
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: uniTalentColors.text }}
                          >
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={editedProfile.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none"
                            style={{
                              borderColor: uniTalentColors.lightGray,
                              color: uniTalentColors.text,
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: uniTalentColors.text }}
                          >
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={editedProfile.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none"
                            style={{
                              borderColor: uniTalentColors.lightGray,
                              color: uniTalentColors.text,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: uniTalentColors.text }}
                      >
                        About
                      </label>
                      <textarea
                        name="bio"
                        value={editedProfile.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none resize-none"
                        style={{
                          borderColor: uniTalentColors.lightGray,
                          color: uniTalentColors.text,
                        }}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                        className="group relative flex-1 h-12 rounded-2xl font-medium overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${uniTalentColors.primary}, ${uniTalentColors.secondary})`,
                          }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                          <Save size={18} />{" "}
                          {saveLoading ? "Saving..." : "Save Changes"}
                        </span>
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saveLoading}
                        className="flex-1 px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                        style={{
                          backgroundColor: "transparent",
                          color: uniTalentColors.text,
                          border: `2px solid ${uniTalentColors.lightGray}`,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Sections ────────────────────────────────────────── */}
            <Section
              title="Experience"
              icon={Briefcase}
              items={workExperiences}
              onAdd={() => {
                setEditingExperience(null);
                setShowExperienceModal(true);
              }}
              onEdit={(item: WorkExperience) => {
                setEditingExperience(item);
                setShowExperienceModal(true);
              }}
              onDelete={(id: string) => handleDeleteExperience(id)}
              renderItem={(exp: WorkExperience) => (
                <>
                  <h3
                    className="text-xl font-medium"
                    style={{ color: uniTalentColors.text }}
                  >
                    {exp.jobTitle}
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: uniTalentColors.primary }}
                  >
                    {exp.companyName}
                  </p>
                  <div
                    className="flex items-center gap-4 mt-2 text-sm"
                    style={{ color: uniTalentColors.secondary }}
                  >
                    <span>
                      {formatWorkDate(exp.startMonth, exp.startYear)} -{" "}
                      {exp.currentlyWorking
                        ? "Present"
                        : formatWorkDate(exp.endMonth, exp.endYear)}
                    </span>
                    {exp.duration && exp.duration > 0 && (
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: `${uniTalentColors.primary}15`,
                          color: uniTalentColors.primary,
                        }}
                      >
                        {formatDuration(exp.duration)}
                      </span>
                    )}
                  </div>
                </>
              )}
            />

            <Section
              title="Education"
              icon={BookOpen}
              items={educations}
              onAdd={() => {
                setEditingEducation(null);
                setShowEducationModal(true);
              }}
              onEdit={(item: Education) => {
                setEditingEducation(item);
                setShowEducationModal(true);
              }}
              onDelete={(id: string) => handleDeleteEducation(id)}
              renderItem={(edu: Education) => (
                <>
                  <h3
                    className="text-xl font-medium"
                    style={{ color: uniTalentColors.text }}
                  >
                    {edu.degree}
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: uniTalentColors.primary }}
                  >
                    {edu.schoolName}
                  </p>
                  <div
                    className="flex items-center gap-4 mt-2 text-sm"
                    style={{ color: uniTalentColors.secondary }}
                  >
                    <span>
                      {edu.startYear} -{" "}
                      {edu.currentlyStudying ? "Present" : edu.endYear}
                    </span>
                    {edu.gpa && (
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: `${uniTalentColors.primary}15`,
                          color: uniTalentColors.primary,
                        }}
                      >
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                </>
              )}
            />

            <Section
              title="Certifications"
              icon={FileCheck}
              items={certifications}
              onAdd={() => {
                setEditingCertification(null);
                setShowCertificationModal(true);
              }}
              onEdit={(item: Certification) => {
                setEditingCertification(item);
                setShowCertificationModal(true);
              }}
              onDelete={(id: string) => handleDeleteCertification(id)}
              renderItem={(cert: Certification) => (
                <>
                  <h3
                    className="text-xl font-medium"
                    style={{ color: uniTalentColors.text }}
                  >
                    {cert.certificationName}
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: uniTalentColors.primary }}
                  >
                    {cert.issuer}
                  </p>
                  <p
                    className="text-sm mt-2"
                    style={{ color: uniTalentColors.secondary }}
                  >
                    Issued: {cert.issueDate}
                  </p>
                </>
              )}
            />

            <Section
              title="Awards"
              icon={Award}
              items={awards}
              onAdd={() => {
                setEditingAward(null);
                setShowAwardModal(true);
              }}
              onEdit={(item: Award) => {
                setEditingAward(item);
                setShowAwardModal(true);
              }}
              onDelete={(id: string) => handleDeleteAward(id)}
              renderItem={(award: Award) => (
                <>
                  <h3
                    className="text-xl font-medium"
                    style={{ color: uniTalentColors.text }}
                  >
                    {award.awardName}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: uniTalentColors.secondary }}
                  >
                    Year: {award.year}
                  </p>
                  {award.description && (
                    <p
                      className="text-sm mt-2"
                      style={{ color: uniTalentColors.secondary }}
                    >
                      {award.description}
                    </p>
                  )}
                </>
              )}
            />

            <Section
              title="Projects"
              icon={Package}
              items={projects}
              onAdd={() => {
                setEditingProject(null);
                setShowProjectModal(true);
              }}
              onEdit={(item: Project) => {
                setEditingProject(item);
                setShowProjectModal(true);
              }}
              onDelete={(id: string) => handleDeleteProject(id)}
              renderItem={(project: Project) => (
                <>
                  <h3
                    className="text-xl font-medium"
                    style={{ color: uniTalentColors.text }}
                  >
                    {project.projectName}
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: uniTalentColors.primary }}
                  >
                    {project.role}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm mt-2"
                      style={{ color: uniTalentColors.primary }}
                    >
                      <LinkIcon size={14} /> View Project
                    </a>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      <EditExperience
        isOpen={showExperienceModal}
        experience={editingExperience}
        onClose={() => {
          setShowExperienceModal(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        saveLoading={saveLoading}
      />

      <EditEducationModal
        isOpen={showEducationModal}
        education={editingEducation}
        onClose={() => {
          setShowEducationModal(false);
          setEditingEducation(null);
        }}
        onSave={handleSaveEducation}
        saveLoading={saveLoading}
      />

      <EditCertificationModal
        isOpen={showCertificationModal}
        certification={editingCertification}
        onClose={() => {
          setShowCertificationModal(false);
          setEditingCertification(null);
        }}
        onSave={handleSaveCertification}
        saveLoading={saveLoading}
      />

      <EditAwardModal
        isOpen={showAwardModal}
        award={editingAward}
        onClose={() => {
          setShowAwardModal(false);
          setEditingAward(null);
        }}
        onSave={handleSaveAward}
        saveLoading={saveLoading}
      />

      <EditProjectModal
        isOpen={showProjectModal}
        project={editingProject}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        saveLoading={saveLoading}
      />

      <Footer />
    </div>
  );
};

// ── Reusable Section Component ───────────────────────────────
interface SectionProps<T> {
  title: string;
  icon: React.ElementType;
  items: T[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
}

function Section<T extends { _id?: string }>({
  title,
  icon: Icon,
  items,
  onAdd,
  onEdit,
  onDelete,
  renderItem,
}: SectionProps<T>) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon size={28} style={{ color: uniTalentColors.primary }} />
          <h2
            className="text-2xl font-light"
            style={{ color: uniTalentColors.text }}
          >
            {title}
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="p-2 rounded-xl hover:bg-white/20 transition-all"
          style={{ color: uniTalentColors.primary }}
        >
          <Plus size={20} />
        </button>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              style={{
                backgroundColor: `${uniTalentColors.white}CC`,
                border: `1px solid ${uniTalentColors.white}`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between">
                  <div className="flex-1">{renderItem(item)}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-xl hover:bg-white/20 transition-all"
                      style={{ color: uniTalentColors.primary }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => item._id && onDelete(item._id)}
                      className="p-2 rounded-xl hover:bg-white/20 transition-all"
                      style={{ color: uniTalentColors.primary }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl relative overflow-hidden"
          style={{
            backgroundColor: `${uniTalentColors.white}CC`,
            border: `1px solid ${uniTalentColors.white}`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${uniTalentColors.primary}15` }}
            >
              <Icon size={40} style={{ color: uniTalentColors.primary }} />
            </div>
            <p
              className="text-lg font-light mb-2"
              style={{ color: uniTalentColors.text }}
            >
              No {title.toLowerCase()} added yet
            </p>
            <p className="text-sm" style={{ color: uniTalentColors.secondary }}>
              Your {title.toLowerCase()} will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;