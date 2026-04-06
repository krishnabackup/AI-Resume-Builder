import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Lock,
} from "lucide-react";

import "./EditProfile.css";
import UserNavBar from "../UserNavBar/UserNavBar";
import axios from "../../../api/axios";
import toast from "react-hot-toast";
import ReactGoogleAutocomplete from "react-google-autocomplete";

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
    extraLinks: [],
    createdAt: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    location: ""
  });

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await axios.get("/api/user/profile");

        if (res.data?.user) {

          setFormData((prev) => ({
            ...prev,
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
          }));

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

  // Validation functions
  const validateFullName = (value) => {
    if (!value.trim()) return ""; // Optional field
    const nameRegex = /^[a-zA-Z\s'\-]+$/;
    return nameRegex.test(value) ? "" : "Full name can only contain letters, spaces, hyphens, and apostrophes";
  };

  const validatePhone = (value) => {
    if (!value.trim()) return ""; // Optional field
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(value) ? "" : "Phone can only contain digits, +, -, spaces, and parentheses";
  };

  const validateLocation = (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return "Location is required";
    }
    if (trimmedValue.length < 2) {
      return "Location must be at least 2 characters";
    }
    const locationRegex = /^[a-zA-Z0-9\s,\.\-]+$/;
    return locationRegex.test(trimmedValue) ? "" : "Location can only contain letters, numbers, spaces, commas, periods, and hyphens";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    let error = "";
    switch (name) {
      case "fullName":
        error = validateFullName(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "location":
        error = validateLocation(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const addLink = () => {

    setFormData({
      ...formData,
      extraLinks: [
        ...formData.extraLinks,
        { label: "Enter Platform", url: "" }
      ]
    });

  };

  const updateExtraLink = (index, field, value) => {

    const updated = [...formData.extraLinks];
    updated[index][field] = value;

    setFormData({
      ...formData,
      extraLinks: updated
    });

  };

  const removeLink = (index) => {

    const updated = formData.extraLinks.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      extraLinks: updated
    });

  };

  const handleSave = async () => {
    // Validate all fields before submission
    const fullNameError = validateFullName(formData.fullName);
    const phoneError = validatePhone(formData.phone);
    const locationError = validateLocation(formData.location);

    const newErrors = {
      fullName: fullNameError,
      phone: phoneError,
      location: locationError
    };

    setErrors(newErrors);

    // Check if there are any validation errors
    if (Object.values(newErrors).some(error => error !== "")) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put("/api/user/profile", formData);
      
      // Show success message
      toast.success("Profile updated successfully!", {
        duration: 3000,
        position: 'top-right'
      });
      
      // Redirect to profile overview after successful save
      setTimeout(() => {
        navigate("/user/profile");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.", {
        duration: 4000,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Dynamic Member Since Year
  const memberSince = formData.createdAt
    ? new Date(formData.createdAt).getFullYear()
    : "";

  return (

    <div className="edit-profile-page">

      <UserNavBar />

      <div className="profile-page-content">

        <div className="profile-card">

          {/* LEFT CARD */}

          <div className="profile-sidebar-card">

            <div className="profile-header-section">

              <div className="avatar-frame">

                {formData.username?.trim()
                  ? formData.username.trim().charAt(0).toUpperCase()
                  : formData.fullName?.trim()
                    ? formData.fullName
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

              {formData.username?.trim()
                ? formData.username.trim().split(" ")[0]
                : formData.fullName?.trim()
                ? formData.fullName.trim().split(" ")[0]
                : "User"}

            </h2>

            <p className="profile-bio">{formData.bio || "No bio added"}</p>

            {/* 🔹 Dynamic Member Since */}

            <div className="member-info">
              <User size={14} />
              <span>Member since {memberSince}</span>
            </div>

            <div className="profile-divider" />

            <button
              className="action-button"
              onClick={() => navigate("/user/security")}
            >
              <Lock size={18} />
              Change Password
            </button>

            {/* SOCIAL LINKS */}

            <div className="form-section">

              <h3>Social Links</h3>

              <div className="field-row">
                <div className="field-group">

                  <label>GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                  />

                  <label>LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />

                  {formData.extraLinks.map((link, index) => (

                    <div key={index} style={{ marginTop: "12px" }}>

                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateExtraLink(index, "label", e.target.innerText)
                        }
                      >
                        {link.label}
                      </label>

                      <input
                        type="text"
                        placeholder="Enter link"
                        value={link.url}
                        onChange={(e) =>
                          updateExtraLink(index, "url", e.target.value)
                        }
                      />

                      <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>

                        <button
                          type="button"
                          onClick={addLink}
                          style={{
                            background: "#0f172a",
                            color: "white",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Add More
                        </button>

                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                  {formData.extraLinks.length === 0 && (
                    <button
                      type="button"
                      onClick={addLink}
                      style={{
                        marginTop: "10px",
                        background: "#0f172a",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
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
                <p>Loading profile...</p>
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
                        />

                      </div>

                      <div className="field-group">

                        <label>
                          <User size={16}/> Full Name
                        </label>

                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={errors.fullName ? "input-error" : ""}
                        />
                        {errors.fullName && (
                          <span className="error-message">{errors.fullName}</span>
                        )}

                      </div>

                    </div>

                    <div className="field-row">

                      <div className="field-group">

                        <label>
                          <Mail size={16}/> Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />

                      </div>

                      <div className="field-group">

                        <label>
                          <Phone size={16}/> Phone
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={errors.phone ? "input-error" : ""}
                        />
                        {errors.phone && (
                          <span className="error-message">{errors.phone}</span>
                        )}

                      </div>

                    </div>

                    <div className="field-row">

                      <div className="field-group full-width">

                        <label>
                          <MapPin size={16}/> Location *
                        </label>

                        {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                          <ReactGoogleAutocomplete
                            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                            onPlaceSelected={(place) => {
                              const location = place.formatted_address || place.name || "";
                              setFormData((prev) => ({ ...prev, location }));
                              // Validate the selected location
                              const error = validateLocation(location);
                              setErrors(prev => ({ ...prev, location: error }));
                            }}
                            defaultValue={formData.location}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            name="location"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              borderRadius: '10px',
                              border: errors.location ? '1px solid #ef4444' : '1px solid #d1d5db',
                              fontSize: '0.9rem',
                              outline: 'none',
                              color: '#1e293b'
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your location*"
                            className={errors.location ? "input-error" : ""}
                            required
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              borderRadius: '10px',
                              border: errors.location ? '1px solid #ef4444' : '1px solid #d1d5db',
                              fontSize: '0.9rem',
                              outline: 'none',
                              color: '#1e293b'
                            }}
                          />
                        )}
                        {errors.location && (
                          <span className="error-message">{errors.location}</span>
                        )}

                      </div>

                    </div>

                  </div>

                  <div className="form-section">
                    <h3>Bio</h3>
                    <div className="field-row">
                      <div className="field-group full-width">
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.9rem',
                            minHeight: '100px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">

                    <button
                      className="btn-cancel"
                      onClick={() => navigate("/user/profile")}
                    >
                      <X size={18}/> Cancel
                    </button>

                    <button
                      className="btn-save"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      <Save size={18}/>
                      {loading ? "Saving..." : "Save Changes"}
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

export default EditProfile;