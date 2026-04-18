import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Calendar,
  Briefcase,
  Link,
  Github,
  Linkedin,
} from "lucide-react";

import "./EditProfile.css";
import UserNavBar from "../UserNavBar/UserNavBar";
import axios from "../../../api/axios";
import toast from "react-hot-toast";
import DangerZone from "./DangerZone";

const ProfileOverview = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    username: "",
    bio: "",
    github: "",
    linkedin: "",
    extraLinks: [],
    createdAt: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        if (res.data?.user) {
          setProfileData({
            id: res.data.user.id || "",
            fullName: res.data.user.fullName || "",
            email: res.data.user.email || "",
            phone: res.data.user.phone || "",
            location: res.data.user.location || "",
            username: res.data.user.username || "",
            bio: res.data.user.bio || "",
            github: res.data.user.github || "",
            linkedin: res.data.user.linkedin || "",
            extraLinks: res.data.user.extraLinks || [],
            createdAt: res.data.user.createdAt || ""
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/user/edit-profile");
  };

  const memberSince = profileData.createdAt
    ? new Date(profileData.createdAt).getFullYear()
    : "";

  if (loading) {
    return (
      <div className="edit-profile-page">
        <UserNavBar />
        <div className="profile-page-content">
          <div className="profile-card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <UserNavBar />

      <div className="profile-page-content">
        <div className="profile-card">
          {/* LEFT CARD - Profile Info */}
          <div className="profile-sidebar-card">
            <div className="profile-header-section">
              <div className="avatar-frame">
                {profileData.username?.trim()
                  ? profileData.username.trim().charAt(0).toUpperCase()
                  : profileData.fullName?.trim()
                    ? profileData.fullName
                      .trim()
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n.charAt(0).toUpperCase())
                      .join("")
                    : "?"}
              </div>
            </div>

            <h2 className="profile-name">
              {profileData.username?.trim()
                ? profileData.username.trim().split(" ")[0]
                : profileData.fullName?.trim()
                ? profileData.fullName.trim().split(" ")[0]
                : "User"}
            </h2>

            <p className="profile-bio">{profileData.bio || "No bio added"}</p>

            <div className="member-info">
              <User size={14} />
              <span>Member since {memberSince}</span>
            </div>

            <div className="profile-divider" />

            {/* SOCIAL LINKS */}
            <div className="form-section">
              <h3>Social Links</h3>
              <div className="profile-socials">
                {profileData.github && (
                  <a 
                    href={profileData.github.startsWith('http') ? profileData.github : `https://github.com/${profileData.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <Github size={16} />
                    {profileData.github}
                  </a>
                )}
                {profileData.linkedin && (
                  <a 
                    href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://linkedin.com/in/${profileData.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <Linkedin size={16} />
                    {profileData.linkedin}
                  </a>
                )}
                {profileData.extraLinks?.map((link, index) => (
                  link.url && (
                    <a 
                      key={index}
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <Link size={16} />
                      {link.label ? link.label : link.url}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Profile Details */}
          <div className="profile-form">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2>Profile Overview</h2>
                  <p>Your personal information and account details</p>
                </div>
                <button
                  className="btn-save"
                  onClick={handleEditProfile}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="card-content">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="field-row">
                  <div className="field-group">
                    <label>
                      <User size={16}/> Username
                    </label>
                    <div className="profile-field-value">
                      {profileData.username || "Not set"}
                    </div>
                  </div>

                  <div className="field-group">
                    <label>
                      <User size={16}/> Full Name
                    </label>
                    <div className="profile-field-value">
                      {profileData.fullName || "Not set"}
                    </div>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label>
                      <Mail size={16}/> Email
                    </label>
                    <div className="profile-field-value">
                      {profileData.email || "Not set"}
                    </div>
                  </div>

                  <div className="field-group">
                    <label>
                      <Phone size={16}/> Phone
                    </label>
                    <div className="profile-field-value">
                      {profileData.phone || "Not set"}
                    </div>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group full-width">
                    <label>
                      <MapPin size={16}/> Location
                    </label>
                    <div className="profile-field-value">
                      {profileData.location || "Not set"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Bio</h3>
                <div className="field-row">
                  <div className="field-group full-width">
                    <div className="profile-field-value bio-value">
                      {profileData.bio || "No bio added"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DangerZone userId={profileData.id} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
