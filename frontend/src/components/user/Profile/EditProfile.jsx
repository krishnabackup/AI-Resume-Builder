import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Link as LinkIcon,
  Lock,
} from "lucide-react";
import "./EditProfile.css";
import UserNavBar from "../UserNavBar/UserNavBar";
import axios from "../../../api/axios";
import toast from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    username: "",
    bio: "",
    github: "",
    linkedin: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRequestStatus, setAdminRequestStatus] = useState("none");
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        if (res.data?.user) {
          setFormData({
            fullName: res.data.user.fullName || "",
            email: res.data.user.email || "",
            phone: res.data.user.phone || "",
            location: res.data.user.location || "",
            username: res.data.user.username || "",
            bio: res.data.user.bio || "",
            github: res.data.user.github || "",
            linkedin: res.data.user.linkedin || "",
          });
          setIsAdmin(res.data.user.isAdmin || false);
          setAdminRequestStatus(res.data.user.adminRequestStatus || "none");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setFetchingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put("/api/user/profile", formData);
      toast.success(res.data?.message || "Profile updated");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">

      <UserNavBar />

      {/* 🔷 PAGE CONTENT */}
      <div className="profile-page-content">
        <div className="profile-container">

          {/* LEFT CARD */}
          <div className="profile-sidebar-card">
            <div className="profile-header-section">
              <div className="avatar-frame">
                {formData.fullName?.trim()
                  ? formData.fullName
                    .trim()
                    .split(" ")
                    .filter(Boolean)                // remove empty strings
                    .slice(0, 2)
                    .map((n) => n.charAt(0).toUpperCase())
                    .join("")
                  : "?"}
              </div>
            </div>

            <h2 className="profile-name">
              {formData.username && formData.username.trim()
                ? formData.username.trim().split(" ")[0]
                : (formData.fullName && formData.fullName.trim()
                  ? formData.fullName.trim().split(" ")[0]
                  : "User")}
            </h2>
            <p className="profile-bio">{formData.bio || "No bio added"}</p>

            <div className="member-info">
              <User size={14} />
              <span>Member since 2024</span>
            </div>

            <div className="profile-divider" />

            <div className="profile-actions">
              <button
                className="action-button"
                onClick={() => navigate("/user/security")}
              >
                <Lock size={18} />
                Change Password
              </button>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="profile-main-card">
            <div className="card-header">
              <h2>Edit Profile</h2>
              <p>Update your personal information</p>
            </div>

            <div className="card-content">
              {fetchingProfile ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <p style={{ color: "#6b7280" }}>Loading profile...</p>
                </div>
              ) : (
                <>
                  <div className="form-section">
                    <h3>Basic Information</h3>

                    <div className="field-row">
                      <div className="field-group">
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Your unique username"
                        />
                      </div>

                      <div className="field-group">
                        <label><User size={16} /> Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="field-row">
                      <div className="field-group">
                        <label><Mail size={16} /> Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="field-group">
                        <label><Phone size={16} /> Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="field-row">
                      <div className="field-group full-width">
                        <label><MapPin size={16} /> Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Social Links</h3>
                    <div className="field-row">
                      <div className="field-group">
                        <label><LinkIcon size={16} /> GitHub</label>
                        <input
                          type="text"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="github.com/username"
                        />
                      </div>

                      <div className="field-group">
                        <label><LinkIcon size={16} /> LinkedIn</label>
                        <input
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => navigate("/user/dashboard")}
                    >
                      <X size={18} /> Cancel
                    </button>

                    <button
                      className="btn-save"
                      onClick={handleSave}
                      disabled={loading || fetchingProfile}
                    >
                      <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div >
  );
};

export default EditProfile;