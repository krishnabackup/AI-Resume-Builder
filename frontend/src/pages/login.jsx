import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import images from "../assets";

export default function Login() {
  const [emailtext, setEmailText] = useState("");
  const [passwordtext, setPasswordText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // Auto login (checks both localStorage & sessionStorage)
  // Auto login ONLY for Remember Me users
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin") || "false");

    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/user/dashboard");
    }
  }
}, [navigate]);

  const validate = () => {
    if (!emailtext) {
      toast.error("Please enter your email");
      return false;
    }
    if (!passwordtext) {
      toast.error("Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
  if (!validate()) return;
  setLoading(true);

  try {
    const response = await axiosInstance.post("/api/auth/login", {
      email: emailtext,
      password: passwordtext,
      rememberMe: rememberMe,
    });

    console.log("Login response:", response.data);

    const isAdmin = response.data.isAdmin || false;

    // Storage logic based on Remember Me
    if (rememberMe) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAdmin", JSON.stringify(isAdmin));

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("isAdmin");
    } else {
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("isAdmin", JSON.stringify(isAdmin));

      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    }

    setTimeout(() => {
      if (isAdmin) {
        toast.success("Welcome Admin!");
        navigate("/admin");
      } else {
        const username = emailtext.split("@")[0];
        toast.success(`Welcome back, ${username}!`);
        navigate("/user/dashboard");
      }
    }, 150);

  } catch (error) {
    console.log(error);
    toast.error(
      error?.response?.data?.message || "Login failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen flex">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-orange-50 p-12 flex-col justify-center items-center">
          <img
            src={images.resumeexample || "/resumeexample.jpg"}
            alt="Resume Building Illustration"
            className="w-full max-w-lg"
          />
          <div className="mt-12 text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Build Your Future</h2>
            <p className="text-lg text-gray-600">Create professional resumes with AI-powered tools</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome to{' '}
                <span className="font-bold text-blue-600">AI Resume Builder</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">by</p>
              <Link to="/" className="inline-block">
                <img
                  src={images.logo6 || "/logo6.png"}
                  alt="UptoSkills Logo"
                  className="w-28 mx-auto mt-2 mb-4"
                />
              </Link>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">
                Login to your account
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={emailtext}
                    onChange={(e) => setEmailText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={passwordtext}
                    onChange={(e) => setPasswordText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition transform ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105'
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}