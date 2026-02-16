import React, { useState, useEffect } from 'react';
import { Edit2, Mail, MapPin, Briefcase, Phone, Save, Calendar, BookOpen } from 'lucide-react';
import { uniTalentColors } from 'src/common/Colors';
import API from 'src/common/API';
import { URL_PATH } from 'src/common/API';

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
  duration?: number;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  phoneNumber: '',
  country: '',
  state: '',
  city: '',
  headline: 'Professional',
  bio: '',
  avatar: '',
  joinDate: '',
};

const MyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [imageFailed, setImageFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const extractProfileData = (responseData: any): UserProfile => {
    console.log('=== EXTRACTING PROFILE ===');
    console.log('Response Data:', responseData);

    // The API structure is:
    // { userId, data: { demographics, education, workExperience, ... }, documents, ... }
    // response?.data gives us: { demographics, education, workExperience, ... }
    
    const demographicsArray = responseData?.demographics || [];
    console.log('Demographics Array:', demographicsArray);
    
    const demographics = demographicsArray[0] || {};
    console.log('First Demographics:', demographics);

    const documents = responseData?.documents || {};
    console.log('Documents:', documents);

    const profileData = {
      fullName: demographics?.fullName || '',
      email: demographics?.email || '',
      phoneNumber: demographics?.phoneNumber || '',
      country: demographics?.country || '',
      state: demographics?.state || '',
      city: demographics?.city || '',
      headline: demographics?.headline || 'Professional',
      bio: demographics?.bio || '',
      avatar: documents?.profileUrl || '',
      joinDate: demographics?.createdAt ? new Date(demographics.createdAt).toLocaleDateString() : '',
    };

    console.log('Final Profile:', profileData);
    return profileData;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API('GET', URL_PATH.getUserProfile, {});
      console.log('=== API RESPONSE ===');
      console.log('Full response:', response);

      // The API returns: { userId, data: {...}, documents: {...}, ... }
      // response.data contains: { demographics, education, workExperience, ... }
      const dashboardData = response?.data || response;
      
      console.log('Dashboard Data (to extract from):', dashboardData);

      // Extract profile - dashboardData has demographics array directly
      const profileData = extractProfileData(dashboardData);
      setProfile(profileData);
      
      // Extract work experiences - dashboardData.workExperience is the array
      const experiences = dashboardData?.workExperience || [];
      console.log('Work Experiences:', experiences);
      setWorkExperiences(experiences);
      
      // Extract educations - dashboardData.education is the array
      const edus = dashboardData?.education || [];
      console.log('Educations:', edus);
      setEducations(edus);
      
      setImageFailed(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
      setProfile(DEFAULT_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
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
      };

      await API('POST', URL_PATH.demographics, dataToUpdate);

      setProfile(editedProfile);
      setIsEditing(false);
      setSaveSuccess(true);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setSaveError(errorMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(null);
    setSaveError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedProfile) {
      setEditedProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [name]: value,
        } as UserProfile;
      });
    }
  };

  const handleImageError = () => {
    setImageFailed(true);
  };

  const getFullAddress = () => {
    const parts = [profile.city, profile.state, profile.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Address not set';
  };

  const getInitials = () => {
    const names = profile.fullName.split(' ');
    return names.map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatWorkDate = (month?: number, year?: number) => {
    if (!year) return '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = month ? monthNames[month - 1] : '';
    return month ? `${monthName} ${year}` : `${year}`;
  };

  const formatEducationDate = (year?: number) => {
    return year ? year.toString() : '';
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    const years = Math.floor(duration / 12);
    const months = duration % 12;
    
    if (years > 0 && months > 0) {
      return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} yr${years > 1 ? 's' : ''}`;
    } else {
      return `${months} mo${months > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: uniTalentColors.background }}
      >
        <div className="text-center">
          <div className="mb-6 inline-block">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin"
              style={{
                borderColor: uniTalentColors.lightGray,
                borderTopColor: uniTalentColors.primary,
              }}
            ></div>
          </div>
          <p className="text-lg font-medium" style={{ color: uniTalentColors.text }}>
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile.fullName) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: uniTalentColors.background }}
      >
        <div 
          className="rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
          style={{ backgroundColor: uniTalentColors.white }}
        >
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: uniTalentColors.primary }}>Error</h2>
          <p className="mb-6" style={{ color: uniTalentColors.secondary }}>
            {error}
          </p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: uniTalentColors.primary }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: uniTalentColors.background }}>
      {/* Success Toast */}
      {saveSuccess && (
        <div 
          className="fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse z-50 text-white font-medium"
          style={{ backgroundColor: uniTalentColors.primary }}
        >
          ✓ Profile updated successfully!
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header Card */}
        <div className="relative mb-12">
          <div 
            className="rounded-3xl shadow-lg overflow-hidden border-2"
            style={{ 
              backgroundColor: uniTalentColors.white,
              borderColor: uniTalentColors.lightGray,
            }}
          >
            {/* Header Background */}
            <div 
              className="h-40"
              style={{ backgroundColor: uniTalentColors.white }}
            ></div>

            {/* Profile Content */}
            <div className="px-8 sm:px-10 pb-10">
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end -mt-20 relative z-10">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {profile.avatar && !imageFailed ? (
                    <div className="relative group">
                      <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="w-40 h-40 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300"></div>
                    </div>
                  ) : (
                    <div
                      className="w-40 h-40 rounded-2xl ring-4 ring-white flex items-center justify-center text-5xl font-bold text-white shadow-xl"
                      style={{ backgroundColor: uniTalentColors.primary }}
                    >
                      {profile.fullName ? getInitials() : 'U'}
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 pt-4">
                  <h1 className="text-4xl font-bold mb-1" style={{ color: uniTalentColors.primary }}>
                    {profile.fullName || 'Your Name'}
                  </h1>
                  <p className="text-xl font-semibold mb-4" style={{ color: uniTalentColors.secondary }}>
                    {profile.headline}
                  </p>
                  <div className="space-y-2" style={{ color: uniTalentColors.secondary }}>
                    <div className="flex items-center gap-3">
                      <Mail size={18} style={{ color: uniTalentColors.primary }} />
                      <span className="font-medium">{profile.email || 'email@example.com'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={18} style={{ color: uniTalentColors.primary }} />
                      <span className="font-medium">{getFullAddress()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} style={{ color: uniTalentColors.primary }} />
                      <span className="font-medium">{profile.phoneNumber || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: uniTalentColors.primary }}
                  >
                    <Edit2 size={20} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Bio Section */}
              {!isEditing && (
                <div className="mt-8 pt-8" style={{ borderTopColor: uniTalentColors.lightGray, borderTopWidth: '2px' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                    About
                  </h3>
                  <p className="leading-relaxed text-base" style={{ color: uniTalentColors.secondary }}>
                    {profile.bio || 'No bio added yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && editedProfile && (
          <div 
            className="rounded-3xl shadow-lg p-10 border-2 mb-12"
            style={{ 
              backgroundColor: uniTalentColors.white,
              borderColor: uniTalentColors.lightGray,
            }}
          >
            <h2 className="text-3xl font-bold mb-8" style={{ color: uniTalentColors.text }}>
              Edit Profile
            </h2>

            {saveError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {saveError}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editedProfile.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
                    style={{ borderColor: uniTalentColors.lightGray }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
                    style={{ borderColor: uniTalentColors.lightGray }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedProfile.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
                    style={{ borderColor: uniTalentColors.lightGray }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                    Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={editedProfile.headline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
                    style={{ borderColor: uniTalentColors.lightGray }}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
              </div>

              <div className="pt-6" style={{ borderTopColor: uniTalentColors.lightGray, borderTopWidth: '2px' }}>
                <h3 className="text-lg font-semibold mb-6" style={{ color: uniTalentColors.text }}>
                  Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={editedProfile.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
                      style={{ borderColor: uniTalentColors.lightGray }}
                      placeholder="India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={editedProfile.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
                      style={{ borderColor: uniTalentColors.lightGray }}
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={editedProfile.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
                      style={{ borderColor: uniTalentColors.lightGray }}
                      placeholder="Nashik"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: uniTalentColors.text }}>
                  About
                </label>
                <textarea
                  name="bio"
                  value={editedProfile.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all resize-none"
                  style={{ borderColor: uniTalentColors.lightGray }}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: uniTalentColors.primary }}
                >
                  <Save size={20} />
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saveLoading}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                  style={{
                    backgroundColor: uniTalentColors.background,
                    color: uniTalentColors.text,
                    border: `2px solid ${uniTalentColors.lightGray}`,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {!isEditing && workExperiences && workExperiences.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={28} style={{ color: uniTalentColors.primary }} />
              <h2 className="text-3xl font-bold" style={{ color: uniTalentColors.text }}>
                Experience
              </h2>
            </div>

            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div 
                  key={exp._id || index}
                  className="rounded-2xl shadow-lg p-8 border-2"
                  style={{
                    backgroundColor: uniTalentColors.white,
                    borderColor: uniTalentColors.lightGray,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: uniTalentColors.text }}>
                        {exp.jobTitle}
                      </h3>
                      <p className="text-lg font-semibold" style={{ color: uniTalentColors.primary }}>
                        {exp.companyName}
                      </p>
                      {exp.typeOfRole && (
                        <p className="text-sm" style={{ color: uniTalentColors.secondary }}>
                          {exp.typeOfRole}
                        </p>
                      )}
                    </div>
                    {exp.currentlyWorking && (
                      <span 
                        className="px-4 py-2 rounded-lg font-semibold text-white text-sm whitespace-nowrap"
                        style={{ backgroundColor: uniTalentColors.primary }}
                      >
                        Currently Working
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4" style={{ color: uniTalentColors.secondary }}>
                    <Calendar size={16} />
                    <span>
                      {formatWorkDate(exp.startMonth, exp.startYear)} - {exp.currentlyWorking ? 'Present' : formatWorkDate(exp.endMonth, exp.endYear)}
                    </span>
                    {exp.duration && (
                      <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold" 
                        style={{ backgroundColor: `${uniTalentColors.primary}20`, color: uniTalentColors.primary }}>
                        {formatDuration(exp.duration)}
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="leading-relaxed" style={{ color: uniTalentColors.secondary }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {!isEditing && educations && educations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={28} style={{ color: uniTalentColors.primary }} />
              <h2 className="text-3xl font-bold" style={{ color: uniTalentColors.text }}>
                Education
              </h2>
            </div>

            <div className="space-y-6">
              {educations.map((edu, index) => (
                <div 
                  key={edu._id || index}
                  className="rounded-2xl shadow-lg p-8 border-2"
                  style={{
                    backgroundColor: uniTalentColors.white,
                    borderColor: uniTalentColors.lightGray,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: uniTalentColors.text }}>
                        {edu.degree}
                      </h3>
                      <p className="text-lg font-semibold" style={{ color: uniTalentColors.primary }}>
                        {edu.schoolName}
                      </p>
                      {edu.fieldOfStudy && (
                        <p className="text-base font-medium" style={{ color: uniTalentColors.secondary }}>
                          {edu.fieldOfStudy}
                        </p>
                      )}
                    </div>
                    {edu.gpa && (
                      <span 
                        className="px-4 py-2 rounded-lg font-semibold text-white whitespace-nowrap"
                        style={{ backgroundColor: uniTalentColors.primary }}
                      >
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4" style={{ color: uniTalentColors.secondary }}>
                    <Calendar size={16} />
                    <span>
                      {formatEducationDate(edu.startYear)} - {edu.currentlyStudying ? 'Present' : formatEducationDate(edu.endYear)}
                    </span>
                    {edu.duration && (
                      <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold" 
                        style={{ backgroundColor: `${uniTalentColors.primary}20`, color: uniTalentColors.primary }}>
                        {formatDuration(edu.duration)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty States */}
        {!isEditing && (!workExperiences || workExperiences.length === 0) && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={28} style={{ color: uniTalentColors.primary }} />
              <h2 className="text-3xl font-bold" style={{ color: uniTalentColors.text }}>
                Experience
              </h2>
            </div>
            <div 
              className="rounded-2xl shadow-lg p-12 border-2 text-center"
              style={{
                backgroundColor: uniTalentColors.white,
                borderColor: uniTalentColors.lightGray,
              }}
            >
              <p className="text-lg" style={{ color: uniTalentColors.secondary }}>
                No work experience added yet
              </p>
            </div>
          </div>
        )}

        {!isEditing && (!educations || educations.length === 0) && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={28} style={{ color: uniTalentColors.primary }} />
              <h2 className="text-3xl font-bold" style={{ color: uniTalentColors.text }}>
                Education
              </h2>
            </div>
            <div 
              className="rounded-2xl shadow-lg p-12 border-2 text-center"
              style={{
                backgroundColor: uniTalentColors.white,
                borderColor: uniTalentColors.lightGray,
              }}
            >
              <p className="text-lg" style={{ color: uniTalentColors.secondary }}>
                No education added yet
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;