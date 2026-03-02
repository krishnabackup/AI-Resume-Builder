import StatCard from "./StatCard";
import RecentResumes from "./RecentResumes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserNavBar from "../UserNavBar/UserNavBar";
import axiosInstance from "../../../api/axios"; // Use the configured axios instance

import { FaFileAlt, FaEye, FaChartLine, FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import "./Dashboard.css";

const Dashboard = ({ setActivePage }) => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const handleRequestAdmin = async () => {
    try {
      setRequestLoading(true);
      const res = await axiosInstance.post("/api/user/request-admin");
      toast.success(res.data?.message || "Admin request submitted");
      // update local state so UI reflects pending status
      setDashboardData((prev) => ({
        ...prev,
        user: { ...prev.user, adminRequestStatus: "pending" },
      }));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit request");
    } finally {
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/user/dashboard");
        setDashboardData(res.data);
        setError(null);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <UserNavBar />
        <div className="dashboard-content-container flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <UserNavBar />
        <div className="dashboard-content-container flex items-center justify-center min-h-[60vh]">
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center max-w-md">
            <div className="text-red-600 mb-4">
              <FaFileAlt className="text-4xl mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Oops!</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extraction of data from backend response
  const stats = dashboardData?.stats || {};
  const resumesCreated = stats.resumesCreated || 0;
  const resumesThisWeek = stats.resumesThisWeek || 0;
  const avgAtsScore = stats.avgAtsScore || 0;
  const atsDelta = stats.atsDelta || 0;
  const profileViews = stats.profileViews || 0;

  const isAdmin = dashboardData?.user?.isAdmin || false;
  const adminRequestStatus = dashboardData?.user?.adminRequestStatus || "none";

  return (
    <div className="dashboard-page">
      <UserNavBar />

      <div className="dashboard-content-container">
        <div className="page-header">
          <h1>Welcome back, {dashboardData?.user.name || "User"}</h1>
          <button
            className="create-btn"
            onClick={() => navigate("/user/resume-builder")}
          >
            + Create New Resume
          </button>
        </div>

        {/* AI Resume Analysis Section */}
        <div className="ai-card">
          <div className="ai-left">
            <span className="ai-label">✨ AI RESUME ANALYSIS</span>
            <h2>{avgAtsScore}/100</h2>

            <div className="ai-progress">
              <div
                className="ai-progress-fill"
                style={{ width: `${Math.min(avgAtsScore, 100)}%` }}
              />
            </div>

            <p className="ai-subtext">
              {avgAtsScore >= 80
                ? "Your resume looks fantastic! You're ready to apply."
                : avgAtsScore >= 50
                  ? "Your resume is looking good, but could be stronger."
                  : "Your resume needs some work to pass ATS filters."}
            </p>
          </div>

          <div className="ai-right">
            <div className="ai-tip">
              💡 Tip:{" "}
              {avgAtsScore < 70
                ? "Try adding more strong action verbs to your 'Experience' section to increase impact."
                : "Optimize your skills section with keywords from specific job descriptions."}
            </div>
            <button
              className="ai-btn"
              onClick={() => navigate("/user/ats-checker")}
            >
              Improve Now
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="dashboard-stats">
          <StatCard
            label="Resumes Created"
            value={resumesCreated}
            trend={`+${resumesThisWeek} this week`}
            icon={<FaFileAlt />}
          />

          <StatCard
            label="Avg ATS Score"
            value={`${avgAtsScore}%`}
            trend={`${atsDelta >= 0 ? "+" : ""}${atsDelta}% since last scan`}
            icon={<FaChartLine />}
          />

          <StatCard
            label="Profile Views"
            value={profileViews}
            trend="+0 vs last week"
            icon={<FaEye />}
          />
        </div>

        {/* Upgrade to Admin Card */}
        {!isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FaShieldAlt size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Upgrade to Admin
                </h3>
                <p className="text-gray-500 text-sm">
                  Request administrator privileges to moderate templates, manage
                  users, and view platform analytics.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequestAdmin}
              disabled={adminRequestStatus === "pending" || requestLoading}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all shrink-0 whitespace-nowrap ${
                adminRequestStatus === "pending"
                  ? "bg-amber-100 text-amber-700 cursor-not-allowed"
                  : adminRequestStatus === "rejected"
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              }`}
            >
              {adminRequestStatus === "pending"
                ? "Request Pending"
                : adminRequestStatus === "rejected"
                  ? "Request Rejected (Apply Again)"
                  : "Request Admin Access"}
            </button>
          </div>
        )}

        <div className="dashboard-grid full-width-list">
          <RecentResumes
            resumes={dashboardData?.recentResumes || []}
            onViewAll={() => navigate("/user/my-resumes")}
          />
        </div>
        <footer className="footer pb-6">
          © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
