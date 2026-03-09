import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserNavBar from "../UserNavBar/UserNavBar";
import axiosInstance from "../../../api/axios";
import {
  FaFileAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaHistory,
} from "react-icons/fa";
import { HiLightningBolt, HiSparkles, HiClock } from "react-icons/hi";
import toast from "react-hot-toast";
import {
  FileText,
  PenLine,
  Download,
  CheckCircle,
  Sparkles,
  Clock,
  Activity,
} from "lucide-react";

import {
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import "./Dashboard.css";

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "just now";
};

const HorizontalStatCard = ({ icon: Icon, label, value, subtext, iconColor, iconBg }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center group">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${iconBg} ${iconColor} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">{label}</span>
    <h4 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">{value}</h4>
    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate w-full px-1 flex-shrink-0" title={String(subtext)}>{subtext}</span>
  </div>
);

const ActivityItem = ({ activity }) => {
  const getIconConfig = (type) => {
    switch (type) {
      case 'created': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'edited': return { icon: PenLine, color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'download': return { icon: Download, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'scan': return { icon: CheckCircle, color: 'text-indigo-500', bg: 'bg-indigo-50' };
      case 'improved': return { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' };
      default: return { icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  const { icon: Icon, color, bg } = getIconConfig(activity.type);

  return (
    <div className="relative pl-6">
      <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${bg} shadow-sm z-10`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="pr-2 pb-1 relative top-0.5">
        <p className="text-sm font-semibold text-slate-700">{activity.label}</p>
        {activity.docTitle && (
          <p className="text-[13px] text-slate-500 mt-0.5 max-w-full truncate">
            {activity.docTitle}
          </p>
        )}
        <p className="text-[11px] text-slate-400 mt-1 font-medium">{timeAgo(activity.time)}</p>
      </div>
    </div>
  );
};

const Dashboard = ({ setActivePage }) => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const handleRequestAdmin = async () => {
    try {
      setRequestLoading(true);
      const res = await axiosInstance.post("/api/user/request-admin");
      toast.success(res.data?.message || "Admin request submitted");
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
        const [userRes, summaryRes] = await Promise.all([
          axiosInstance.get("/api/user/dashboard"),
          axiosInstance.get("/api/dashboard/summary", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
        ]);
        setDashboardData(userRes.data);
        setSummaryData(summaryRes.data);
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
              Loading your AI Intelligence Center...
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

  // --- Dynamic Data Mapping & Fallbacks ---
  const stats = dashboardData?.stats || {};
  const recentResumes = dashboardData?.recentResumes || [];
  const user = dashboardData?.user || {};

  const avgAtsScore = stats.avgAtsScore || 0;
  // Document breakdown counts (per logged-in user)
  const resumesCreatedCount = stats.resumesCreated || 0;
  const cvsCreatedCount = stats.cvsCreated || 0;
  const coverLettersCreatedCount = stats.coverLettersCreated || 0;
  const totalAssets =
    resumesCreatedCount + cvsCreatedCount + coverLettersCreatedCount;

  // Calculate Resume Health Status
  let healthStatusLabel = "Needs Work";
  let healthStatusColor = "text-red-400";
  let healthStrokeColor = "#ef4444"; // red-500
  let feedbackMessage = "Critical improvements needed to pass ATS filters.";

  if (avgAtsScore >= 80) {
    healthStatusLabel = "Interview Ready";
    healthStatusColor = "text-emerald-400";
    healthStrokeColor = "#10b981"; // emerald-500
    feedbackMessage = "Your resume looks fantastic! Excellent keyword density.";
  } else if (avgAtsScore >= 65) {
    healthStatusLabel = "Good";
    healthStatusColor = "text-blue-400";
    healthStrokeColor = "#3b82f6"; // blue-500
    feedbackMessage =
      "Solid foundation. A few tweaks will elevate your profile.";
  } else if (avgAtsScore >= 50) {
    healthStatusLabel = "Needs Work";
    healthStatusColor = "text-amber-400";
    healthStrokeColor = "#f59e0b"; // amber-500
    feedbackMessage = "Your resume is okay, but lacks impact and strong verbs.";
  }

  const isAdmin = user.isAdmin || false;
  const adminRequestStatus = user.adminRequestStatus || "none";

  // Mock Data Visualizations
  const documentData = [
    { name: "Resumes", value: resumesCreatedCount, color: "#0284c7" },
    { name: "CVs", value: cvsCreatedCount, color: "#1e3a8a" },
    {
      name: "Cover Letters",
      value: coverLettersCreatedCount,
      color: "#f97316",
    },
  ];

  // Calculations for Circular Progress
  const circleRadius = 55;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (avgAtsScore / 100) * circleCircumference;

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-100 shadow-md rounded-md text-sm font-medium">
          <span style={{ color: payload[0].payload.color }}>● </span>
          {payload[0].name}: {payload[0].value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-page bg-[#f8fafc] min-h-screen pb-10">
      <UserNavBar />

      <div className="dashboard-content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* --- Page Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, {user.name || "User"}{" "}
              <HiSparkles className="text-blue-500" />
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Here is your Resume Intelligence & Command Center.
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all sm:w-auto w-full"
            onClick={() => navigate("/user/resume-builder")}
          >
            <FaFileAlt /> Create New Resume
          </button>
        </div>

        {/* --- HERO SECTION: Resume Health Focus --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Health Card (Takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 border border-slate-700">
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className="flex-1 z-10 w-full text-center sm:text-left">
              <span className="inline-block px-3 py-1 bg-slate-800/80 border border-slate-700 text-blue-300 text-xs font-bold tracking-wider rounded-full mb-4 uppercase">
                Overall Resume Health
              </span>
              <h2
                className={`text-3xl sm:text-4xl font-extrabold mb-2 ${healthStatusColor}`}
              >
                {healthStatusLabel}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
                {feedbackMessage}
              </p>

              <div className="mt-8">
                <button
                  onClick={() => navigate("/user/ats-checker")}
                  className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 sm:w-auto w-full mx-auto sm:mx-0"
                >
                  Improve Resume <FaArrowRight className="text-sm" />
                </button>
              </div>
            </div>

            {/* Circular Progress Indicator */}
            <div className="relative flex items-center justify-center z-10 shrink-0">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={circleRadius}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={circleRadius}
                  stroke={healthStrokeColor}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {avgAtsScore}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Score
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats / Next Goal Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HiSparkles className="text-orange-500" /> Next Milestone
            </h3>

            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-slate-600">
                    Reach 80+ Score
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    {avgAtsScore}/80
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((avgAtsScore / 80) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                    <FaCheckCircle className="text-emerald-500 shrink-0" /> ATS
                    Readiness
                  </span>
                  <span className="font-bold text-slate-800">
                    {stats.atsReadiness || avgAtsScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                    <HiClock className="text-blue-500 shrink-0" /> Last Edited
                  </span>
                  <span className="font-bold text-slate-800">
                    {recentResumes.length > 0 ? "Today" : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN DASHBOARD GRID --- */}
        <div className="flex flex-col gap-8 mb-8 w-full">
          {/* TOP ROW: Horizontal Cards taking full width */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <HorizontalStatCard
              icon={CheckCircle}
              label="Avg ATS Score"
              value={summaryData?.avgAtsScore > 0 ? summaryData.avgAtsScore : "0"}
              subtext={summaryData?.avgAtsScore > 0 ? "Out of 100" : "No scans yet"}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <HorizontalStatCard
              icon={Download}
              label="Total Downloads"
              value={summaryData?.totalDownloads > 0 ? summaryData.totalDownloads : "0"}
              subtext={summaryData?.totalDownloads > 0 ? "All time" : "No downloads yet"}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <HorizontalStatCard
              icon={FileText}
              label="Last Edited"
              value={summaryData?.lastEditedDoc ? timeAgo(summaryData.lastEditedDoc.updatedAt) : "None"}
              subtext={summaryData?.lastEditedDoc ? summaryData.lastEditedDoc.title : "Create a resume"}
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
          </div>

          {/* BOTTOM ROW: Timeline & Document Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch w-full">
            {/* LEFT: Recent Activity Timeline */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-hidden h-full max-h-[420px]">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Recent Activity
              </h3>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {summaryData?.recentActivity && summaryData.recentActivity.length > 0 ? (
                  <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
                    {summaryData.recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={{
                        ...activity,
                        time: activity.timestamp
                      }} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full py-8 text-slate-500">
                    <Activity className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="font-medium text-slate-600">No recent activity</p>
                    <p className="text-[13px] mt-1 text-slate-500">Create your first resume to see timeline</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Document Breakdown */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center h-full max-h-[420px]">
              <h3 className="text-lg font-bold text-slate-800 self-start mb-6">
                Document Breakdown
              </h3>
              <div className="relative flex-1 w-full flex items-center justify-center min-h-[160px]">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={documentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {documentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center font-bold pointer-events-none">
                  <span className="text-4xl text-slate-900">{totalAssets}</span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider">
                    TOTAL ASSETS
                  </span>
                </div>
              </div>
              {/* Legend below */}
              <div className="mt-4 flex flex-wrap justify-center w-full gap-6 px-2">
                {documentData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-semibold text-slate-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {item.value} Units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM ROW: Admin Section --- */}
        <div className="grid grid-cols-1 gap-6 pb-12 w-full">
          {/* Upgrade to Admin Card (Moved to bottom, visually secondary) */}
          {!isAdmin && (
            <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:bg-slate-50">
              <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-slate-200/50 text-slate-500 flex items-center justify-center shrink-0">
                  <FaShieldAlt size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm mb-0.5">
                    Admin Access Request
                  </h3>
                  <p className="text-slate-500 text-xs max-w-lg leading-relaxed">
                    View platform analytics and manage templates by upgrading to
                    an administrator account.
                  </p>
                </div>
              </div>

              <button
                onClick={handleRequestAdmin}
                disabled={adminRequestStatus === "pending" || requestLoading}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all shrink-0 whitespace-nowrap w-full sm:w-auto ${adminRequestStatus === "pending"
                  ? "bg-amber-100 text-amber-700 cursor-not-allowed"
                  : adminRequestStatus === "rejected"
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                  }`}
              >
                {adminRequestStatus === "pending"
                  ? "Request Pending"
                  : adminRequestStatus === "rejected"
                    ? "Request Rejected"
                    : "Request Access"}
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-auto text-center py-4 bg-white border-t text-sm text-gray-600">
        © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
