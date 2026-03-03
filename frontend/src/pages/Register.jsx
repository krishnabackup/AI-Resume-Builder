import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import aiResumeImg from "../assets/ai_resume_illustration_3.svg";
import images from "../assets";

export default function Register() {
  const [usernametext, setUserNameText] = useState("");
  const [emailtext, setEmailText] = useState("");
  const [passwordtext, setPasswordText] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!usernametext.trim()) return toast.error("Please enter a username");
    if (!emailtext.trim()) return toast.error("Please enter an email");
    if (!passwordtext) return toast.error("Please enter a password");
    if (passwordtext.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (passwordtext !== confirmpassword)
      return toast.error("Passwords do not match");
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await axiosInstance.post(`/api/auth/register`, {
        username: usernametext.trim(),
        email: emailtext.trim(),
        password: passwordtext,
      });

      toast.success(`Welcome ${usernametext}! Redirecting to login...`);
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="h-screen flex overflow-hidden">
        {/* LEFT SIDE - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-orange-50 px-12 flex-col justify-center items-center">
          <div className="h-[500px] w-[500px] bg-[#A3E5FF] flex justify-center rounded-md">
            <img
              src={aiResumeImg}
              alt="Resume Illustration"
              className="max-h-[75vh] w-auto object-contain"
            />
          </div>

          <div className="mt-6 text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Build Your Future
            </h2>
            <p className="text-lg text-gray-600">
              Create professional resumes with AI-powered tools
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="w-full md:w-1/2 bg-white px-8 md:px-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            {/* HEADER */}
            <div className="mb-6 text-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Join{" "}
                <span className="font-bold text-blue-600">
                  AI Resume Builder
                </span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">by</p>

              <Link to="/" className="inline-block">
                <img
                  src={images.logo6 || "/logo6.png"}
                  alt="UptoSkills Logo"
                  className="w-28 mx-auto mt-2 mb-3"
                />
              </Link>

              <h2 className="text-lg font-semibold text-gray-800">
                Create your account
              </h2>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={usernametext}
                    onChange={(e) => setUserNameText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={emailtext}
                    onChange={(e) => setEmailText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={passwordtext}
                    onChange={(e) => setPasswordText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition transform ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>

            {/* FOOTER */}
            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}