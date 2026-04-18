import { useNavigate } from "react-router-dom";
import UserNavBar from "../UserNavBar/UserNavBar";
import {
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { HiSparkles, HiClock } from "react-icons/hi";
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

import { useDashboardData, useAdminRequest } from "../../../hooks/useDashboardData";
import HorizontalStatCard from "./components/HorizontalStatCard";
import ActivityItem from "./components/ActivityItem";
import HealthScoreCard from "./components/HealthScoreCard";
import { timeAgo } from "../../../utils/dashboardUtils";
import "./Dashboard.css";




const Dashboard = ({ setActivePage }) => {
  const navigate = useNavigate();
  const { dashboardData, summaryData, loading, error, refetch } = useDashboardData();
  const { requestLoading, handleRequestAdmin } = useAdminRequest();

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
    <div className="dashboard-page bg-[#f8fafc] min-h-screen pb-10 ">
      <UserNavBar />

      <div className="dashboard-content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-0 pt-24">
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
            <FileText /> Create New Resume
          </button>
        </div>

        {/* --- HERO SECTION: Resume Health Focus --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <HealthScoreCard
            avgAtsScore={avgAtsScore}
            healthStatusLabel={healthStatusLabel}
            healthStatusColor={healthStatusColor}
            healthStrokeColor={healthStrokeColor}
            feedbackMessage={feedbackMessage}
          />

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
              label="Current ATS Score"
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
                        timeAgo: timeAgo(activity.timestamp)
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
                onClick={() => {
                  handleRequestAdmin(() => {
                    refetch();
                  });
                }}
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
