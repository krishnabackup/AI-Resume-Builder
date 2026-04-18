import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Save, X, Lock } from "lucide-react";
import "./AdminProfile.css";
import axios from "../../../api/axios";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  fullName: "", email: "", phone: "", location: "",
  username: "", bio: "", github: "", linkedin: "",
  extraLinks: [], createdAt: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = ({ username, fullName }) => {
  if (username?.trim()) return username.trim().charAt(0).toUpperCase();
  if (fullName?.trim()) {
    return fullName.trim().split(" ").filter(Boolean)
      .slice(0, 2).map(n => n.charAt(0).toUpperCase()).join("");
  }
  return "?";
};

const getDisplayName = ({ username, fullName }) =>
  username?.trim()?.split(" ")[0] || fullName?.trim()?.split(" ")[0] || "Admin";

const normalizeUser = user => ({
  fullName:   user.fullName   || "",
  email:      user.email      || "",
  phone:      user.phone      || "",
  location:   user.location   || "",
  username:   user.username   || "",
  bio:        user.bio        || "",
  github:     user.github     || "",
  linkedin:   user.linkedin   || "",
  extraLinks: user.extraLinks || [],
  createdAt:  user.createdAt  || "",
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldGroup = ({ label, icon: Icon, children }) => (
  <div className="field-group">
    <label>{Icon && <Icon size={16} />} {label}</label>
    {children}
  </div>
);

const ExtraLink = ({ link, index, onUpdate, onAdd, onRemove }) => (
  <div style={{ marginTop: "12px" }}>
    <label
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onUpdate(index, "label", e.target.innerText)}
    >
      {link.label}
    </label>
    <input
      type="text"
      placeholder="Enter link"
      value={link.url ?? ""}
      onChange={e => onUpdate(index, "url", e.target.value)}
    />
    <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
      <button
        type="button"
        onClick={onAdd}
        style={{ background: "#0f172a", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer" }}
      >
        Add More
      </button>
      <button
        type="button"
        onClick={() => onRemove(index)}
        style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer" }}
      >
        Remove
      </button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminProfile = () => {
  const navigate = useNavigate();

  const [formData,        setFormData]        = useState(INITIAL_FORM);
  const [loading,         setLoading]         = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // ── Fetch ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    axios.get("/api/user/profile")
      .then(res => { if (res.data?.user) setFormData(normalizeUser(res.data.user)); })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setFetchingProfile(false));
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const addLink = useCallback(() =>
    setFormData(prev => ({
      ...prev,
      extraLinks: [...prev.extraLinks, { label: "Enter Platform", url: "" }],
    })), []);

  const updateExtraLink = useCallback((index, field, value) =>
    setFormData(prev => {
      const extraLinks = [...prev.extraLinks];
      extraLinks[index] = { ...extraLinks[index], [field]: value };
      return { ...prev, extraLinks };
    }), []);

  const removeLink = useCallback(index =>
    setFormData(prev => ({
      ...prev,
      extraLinks: prev.extraLinks.filter((_, i) => i !== index),
    })), []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.put("/api/user/profile", formData);
      toast.success(res.data?.message || "Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // ── Derived ─────────────────────────────────────────────────────────────────

  const memberSince = formData.createdAt ? new Date(formData.createdAt).getFullYear() : "";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="edit-profile-page">
      <div className="profile-page-content">
        <div className="profile-card">

          {/* LEFT SIDEBAR */}
          <div className="profile-sidebar-card">
            <div className="profile-header-section">
              <div className="avatar-frame">{getInitials(formData)}</div>
            </div>

            <h2 className="profile-name">{getDisplayName(formData)}</h2>
            <p className="profile-bio">{formData.bio || "No bio added"}</p>

            <div className="member-info">
              <User size={14} />
              <span>Member since {memberSince}</span>
            </div>

            <div className="profile-divider" />

            <div className="profile-actions">
              <button className="action-button" onClick={() => navigate("/admin/change-password")}>
                <Lock size={18} /> Change Password
              </button>
            </div>

            {/* Social Links */}
            <div className="form-section">
              <h3>Social Links</h3>
              <div className="field-row">
                <div className="field-group">
                  <label>GitHub</label>
                  <input type="text" name="github" value={formData.github ?? ""} onChange={handleChange} />

                  <label>LinkedIn</label>
                  <input type="text" name="linkedin" value={formData.linkedin ?? ""} onChange={handleChange} />

                  {formData.extraLinks.map((link, index) => (
                    <ExtraLink
                      key={index}
                      link={link}
                      index={index}
                      onUpdate={updateExtraLink}
                      onAdd={addLink}
                      onRemove={removeLink}
                    />
                  ))}

                  {formData.extraLinks.length === 0 && (
                    <button
                      type="button"
                      onClick={addLink}
                      style={{ marginTop: "10px", background: "#0f172a", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Add Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="profile-form">
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
                  {/* Basic Info */}
                  <div className="form-section">
                    <h3>Basic Information</h3>

                    <div className="field-row">
                      <FieldGroup label="Username">
                        <input type="text" name="username" value={formData.username ?? ""} onChange={handleChange} placeholder="Your unique username" />
                      </FieldGroup>
                      <FieldGroup label="Full Name" icon={User}>
                        <input type="text" name="fullName" value={formData.fullName ?? ""} onChange={handleChange} />
                      </FieldGroup>
                    </div>

                    <div className="field-row">
                      <FieldGroup label="Email" icon={Mail}>
                        <input type="email" name="email" value={formData.email ?? ""} onChange={handleChange} />
                      </FieldGroup>
                      <FieldGroup label="Phone" icon={Phone}>
                        <input type="tel" name="phone" value={formData.phone ?? ""} onChange={handleChange} />
                      </FieldGroup>
                    </div>

                    <div className="field-row">
                      <FieldGroup label="Location" icon={MapPin}>
                        <input type="text" name="location" value={formData.location ?? ""} onChange={handleChange} />
                      </FieldGroup>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="form-section">
                    <h3>Bio</h3>
                    <div className="field-row">
                      <div className="field-group full-width">
                        <textarea
                          name="bio"
                          value={formData.bio ?? ""}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "0.9rem", minHeight: "100px", resize: "vertical" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="form-actions">
                    <button className="btn-cancel" onClick={() => navigate("/admin")}>
                      <X size={18} /> Cancel
                    </button>
                    <button className="btn-save" onClick={handleSave} disabled={loading || fetchingProfile}>
                      <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfile;