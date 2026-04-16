import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  TrendingUp, Users, UserCheck, UserMinus, Activity, Target,
  Zap, Shield, Crown, Award, Gem, RefreshCw
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import axiosInstance from "../../../api/axios";
import AdminTopPagesAnalytics from "../AdminTopPagesAnalytics";
import { useQuery } from "@tanstack/react-query";
import CustomDateRange from "./CustomeDatePicker";
import FilterDropDown from "./FilterDropDown";

// ─── Constants (stable refs, never re-created) ────────────────────────────────

const INITIAL_ANALYTICS = {
  userGrowth: { count: 0, note: "" },
  conversions: { count: 0, note: "" },
  activeUsers: { count: 0, note: "" },
  deletedUsers: { count: 0, note: "" },
  mostUsedResumeTemplates: [],
  mostUsedCvTemplates: [],
  chartData: [],
  subscriptionBreakdown: [],
  summary: {
    apiSuccessRate: "0%",
    apiFailureRate: "0%",
    avgResponseTime: "0ms",
    totalApiCalls: 0,
    systemUptime: "99.98%",
  },
};

const TEMPLATE_COLORS = {
  resume: {
    text: ["text-blue-600", "text-purple-600", "text-emerald-600", "text-orange-600", "text-slate-500"],
    bg: ["bg-blue-50", "bg-purple-50", "bg-emerald-50", "bg-orange-50", "bg-slate-50"],
  },
  cv: {
    text: ["text-indigo-600", "text-cyan-600", "text-teal-600", "text-amber-600", "text-slate-500"],
    bg: ["bg-indigo-50", "bg-cyan-50", "bg-teal-50", "bg-amber-50", "bg-slate-50"],
  },
};

const PIE_COLORS = ["#94a3b8", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"];

const POLL_INTERVAL_MS = 30_000;

// ─── Pure helpers (defined once, outside component) ───────────────────────────

function getPlanConfig(rawPlan) {
  const key = String(rawPlan ?? "").trim().toLowerCase();
  if (key === "free")
    return { icon: <Users size={18} />, color: "bg-slate-500", light: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" };
  if (key === "pro")
    return { icon: <TrendingUp size={18} />, color: "bg-blue-600", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" };
  if (key.includes("premium"))
    return { icon: <Award size={18} />, color: "bg-purple-600", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" };
  if (key.includes("ultra") || key.includes("lifetime") || key.includes("life time"))
    return { icon: <Crown size={18} />, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" };
  if (key.includes("basic"))
    return { icon: <Zap size={18} />, color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" };
  return { icon: <Gem size={18} />, color: "bg-slate-400", light: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" };
}

function mergeAnalytics(prev, data) {
  return {
    userGrowth: data.userGrowth ?? prev.userGrowth,
    conversions: data.conversions ?? prev.conversions,
    activeUsers: data.activeUsers ?? prev.activeUsers,
    deletedUsers: data.deletedUsers ?? prev.deletedUsers,
    mostUsedResumeTemplates: data.mostUsedResumeTemplates ?? data.mostUsedTemplates ?? [],
    mostUsedCvTemplates: data.mostUsedCvTemplates ?? [],
    chartData: data.chartData ?? [],
    subscriptionBreakdown: data.subscriptionBreakdown ?? [],
    summary: data.summary ?? prev.summary,
  };
}

const sampleData = (data, threshold = 30) => {
  if (!data || data.length <= threshold) return data;
  const step = Math.ceil(data.length / threshold);
  return data.filter((_, index) => index % step === 0);
};

// ─── Sub-components (memoised) ────────────────────────────────────────────────

const StatCard = React.memo(({ title, value, note, icon, iconBg, valueColor }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <p className="text-slate-500 text-sm">{title}</p>
      <div className={`${iconBg} p-3 rounded-full`}>{icon}</div>
    </div>
    <p className={`text-3xl font-bold mt-3 ${valueColor}`}>{value}</p>
    <p className="text-slate-500 text-sm mt-2">{note}</p>
  </div>
));

const TemplateList = React.memo(({ templates, type }) => {
  const { text: textColors, bg: bgColors } = TEMPLATE_COLORS[type];
  if (!templates.length) {
    return (
      <div className="text-center text-slate-400 py-6 border border-dashed border-slate-200 rounded-xl">
        No {type} template usage yet
      </div>
    );
  }
  return (
    <div className="space-y-3 text-sm">
      {templates.map((template, index) => (
        <div
          key={`${type}-${template.templateId}-${index}`}
          className={`flex justify-between items-center p-3 rounded-xl ${bgColors[index % bgColors.length]}`}
        >
          <span className="font-medium text-slate-700">{template.templateId}</span>
          <span className={`${textColors[index % textColors.length]} font-bold`}>
            {template.count} uses ({template.percentage}%)
          </span>
        </div>
      ))}
    </div>
  );
});

const SubscriptionCard = React.memo(({ item, totalUsers }) => {
  const config = useMemo(() => getPlanConfig(item.plan), [item.plan]);
  const percentage = totalUsers > 0 ? Math.round((item.count / totalUsers) * 100) : 0;
  return (
    <div className={`p-5 rounded-2xl border ${config.border} bg-white`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${config.light} ${config.text}`}>{config.icon}</div>
          <div>
            <h4 className="font-bold text-slate-800">{item.plan}</h4>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Subscription Tier</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-900 leading-none">{item.count}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1">{percentage}% SHARE</p>
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${config.color} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

export default function AdminAnalytics() {
  const [templateView, setTemplateView] = useState("resume");
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ name: "Last 30days", range: 30 });
  const [showCustomDate,setCustomDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: analyticsData = INITIAL_ANALYTICS,
    isLoading: loading,
    refetch: fetchAnalyticsData,
    isFetching: refreshingTemplates,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      console.log('Fetching admin analytics stats');
      const { data } = await axiosInstance.get("/api/admin/analytics-stat");
      return mergeAnalytics(INITIAL_ANALYTICS, data);
    },
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 300000, // 5 minutes fresh
  });

  const lastUpdated = useMemo(() => 
    dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null, 
    [dataUpdatedAt]
  );

  // ── Derived data ────────────────────────────────────────────────────────────

  const sampledChartData = useMemo(() => sampleData(analyticsData.chartData), [analyticsData.chartData]);

  const displaySubscriptionBreakdown = useMemo(
    () => [...analyticsData.subscriptionBreakdown].sort((a, b) => b.count - a.count),
    [analyticsData.subscriptionBreakdown]
  );

  const totalSubscriptionUsers = useMemo(
    () => displaySubscriptionBreakdown.reduce((acc, { count }) => acc + count, 0),
    [displaySubscriptionBreakdown]
  );

  const retentionRate = useMemo(() => {
    const total = (analyticsData.activeUsers.count || 0) + (analyticsData.deletedUsers.count || 0);
    return total > 0 ? Math.round((analyticsData.activeUsers.count / total) * 100) : 0;
  }, [analyticsData.activeUsers.count, analyticsData.deletedUsers.count]);

  const retentionStyle = useMemo(() => {
    if (retentionRate >= 80) return { color: "text-indigo-600", bar: "bg-indigo-600", label: "Healthy retention" };
    if (retentionRate >= 60) return { color: "text-amber-500", bar: "bg-amber-500", label: "Moderate retention" };
    return { color: "text-red-500", bar: "bg-red-500", label: "Needs attention" };
  }, [retentionRate]);

  const stats = useMemo(() => [
    {
      title: "User Growth",
      value: (loading && analyticsData.userGrowth.count === 0) ? "..." : `${analyticsData.userGrowth.count} Users`,
      note: `${analyticsData.userGrowth.change > 0 ? "+" : ""}${analyticsData.userGrowth.change}% this month`,
      icon: <TrendingUp className="text-blue-600" />,
      iconBg: "bg-blue-50",
      valueColor: "text-blue-600",
    },
    {
      title: "Paid Conversions",
      value: (loading && analyticsData.conversions.count === 0) ? "..." : `${analyticsData.conversions.count}%`,
      note: `${analyticsData.conversions.change > 0 ? "+" : ""}${analyticsData.conversions.change}% from last month`,
      icon: <Target className="text-emerald-600" />,
      iconBg: "bg-emerald-50",
      valueColor: "text-emerald-600",
    },
    {
      title: "Active Users",
      value: (loading && analyticsData.activeUsers.count === 0) ? "..." : analyticsData.activeUsers.count.toLocaleString(),
      note: `${analyticsData.activeUsers.change > 0 ? "+" : ""}${analyticsData.activeUsers.change}% vs last week`,
      icon: <Activity className="text-amber-600" />,
      iconBg: "bg-amber-50",
      valueColor: "text-amber-600",
    },
    {
      title: "Deleted Users",
      value: (loading && analyticsData.deletedUsers.count === 0) ? "..." : analyticsData.deletedUsers.count.toLocaleString(),
      note: "Users who left recently",
      icon: <UserMinus className="text-rose-600" />,
      iconBg: "bg-rose-50",
      valueColor: "text-rose-600",
    },
  ], [loading, analyticsData.userGrowth, analyticsData.conversions, analyticsData.activeUsers, analyticsData.deletedUsers]);

  const handleRefreshTemplates = useCallback(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleTemplateViewResume = useCallback(() => setTemplateView("resume"), []);
  const handleTemplateViewCv = useCallback(() => setTemplateView("cv"), []);
  
  const handleFilter = useCallback((option) => {
    if(option.custom) return;
    const range = option.range;
    fetchAnalyticsData({range});
  }, [fetchAnalyticsData]);

  const handleDatePick = useCallback(() => {
    if(!startDate || !endDate) return;
    fetchAnalyticsData({startDate: startDate.toISOString(), endDate: endDate.toISOString()});
    setCustomDate(false);
    setOpen(false);
  }, [fetchAnalyticsData, startDate, endDate]);

 

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex-1 p-4 sm:p-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">System Analytics</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">
            Deep dive into platform performance &amp; user engagement.
          </p>
        </div>
        <div className="flex items-center gap-4">
        {lastUpdated && (
          <div className="text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 w-fit">
            Last updated: <span className="font-medium">{lastUpdated}</span>
          </div>
        )}
        <div>
          <FilterDropDown selected={selected} setSelected={setSelected} handleFilter={handleFilter} showCustomDate={showCustomDate} setCustomDate={setCustomDate} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} handleDatePick={handleDatePick} open={open} setOpen={setOpen}/>
        </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-10">
        {stats.map(item => <StatCard key={item.title} {...item} />)}
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Platform Health */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Platform Health</h3>
            <div className="bg-green-50 p-2 rounded-full">
              <Activity className="text-green-600" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-600">
              {loading ? "..." : analyticsData.summary.apiSuccessRate.replace("%", "")}
            </span>
            <span className="text-slate-500">/100</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {parseFloat(analyticsData.summary.apiSuccessRate) > 95 ? "System running smoothly" : "Monitoring performance"}
          </p>
          <div className="mt-4 bg-slate-100 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: analyticsData.summary.apiSuccessRate }} />
          </div>
        </div>

        {/* User Retention */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">User Retention Rate</h3>
            <div className="bg-indigo-50 p-2 rounded-full">
              <RefreshCw className="text-indigo-600" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${retentionStyle.color}`}>
              {loading ? "..." : `${retentionRate}%`}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">{retentionStyle.label}</p>
          <div className="mt-4 bg-slate-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${retentionStyle.bar}`} style={{ width: `${retentionRate}%` }} />
          </div>
          {!loading && (
            <p className="text-xs text-slate-400 mt-2">
              {analyticsData.activeUsers.count} active · {analyticsData.deletedUsers.count} churned
            </p>
          )}
        </div>

        {/* Response Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Avg Response Time</h3>
            <div className="bg-blue-50 p-2 rounded-full">
              <Zap className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-600">
              {loading ? "..." : analyticsData.summary.avgResponseTime.replace("ms", "")}
            </span>
            <span className="text-slate-500">ms</span>
          </div>
          <p className="text-sm text-green-600 mt-2">Platform latency</p>
        </div>
      </div>

      {/* Small metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {[
          { label: "System Uptime", value: analyticsData.summary.systemUptime, note: "Last 30 days", noteColor: "text-slate-500", icon: <Shield className="text-green-600" size={16} />, iconBg: "bg-green-50" },
          { label: "Total API Calls", value: analyticsData.summary.totalApiCalls, note: "Last 30 days", noteColor: "text-slate-500", icon: <Activity className="text-purple-600" size={16} />, iconBg: "bg-purple-50" },
          { label: "API Success Rate", value: analyticsData.summary.apiSuccessRate, note: "Real-time health", noteColor: "text-green-600", icon: <Zap className="text-blue-600" size={16} />, iconBg: "bg-blue-50" },
          { label: "API Failure Rate", value: analyticsData.summary.apiFailureRate, note: "Real-time error monitoring", noteColor: "text-red-600", icon: <Activity className="text-red-600" size={16} />, iconBg: "bg-red-50" },
        ].map(({ label, value, note, noteColor, icon, iconBg }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">{label}</p>
              <div className={`${iconBg} p-2 rounded-full`}>{icon}</div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{loading ? "..." : value}</p>
            <p className={`text-xs ${noteColor} mt-1`}>{note}</p>
          </div>
        ))}
      </div>

      {/* Growth & Revenue Chart */}
      <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col min-w-0">
        <h2 className="text-lg font-semibold mb-1">Platform Growth &amp; Revenue</h2>
        <p className="text-sm text-slate-500 mb-6">User acquisition vs Revenue generated</p>
        <div className="flex-1 w-full min-h-[300px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">Loading chart data...</div>
          ) : isMounted && sampledChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampledChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Legend />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (₹)" dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="New Users" dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-xl">
              No trend data available yet
            </div>
          )}
        </div>
      </div>

      {/* Templates + Top Pages */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Most Used Templates</h2>
            <button
              type="button"
              onClick={handleRefreshTemplates}
              disabled={refreshingTemplates || loading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw size={14} className={refreshingTemplates ? "animate-spin" : ""} />
              {refreshingTemplates ? "Refreshing" : "Refresh"}
            </button>
          </div>

          <div className="inline-flex bg-slate-100 rounded-lg p-1 mb-4 w-fit">
            {[{ key: "resume", label: "Resume" }, { key: "cv", label: "CV" }].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={key === "resume" ? handleTemplateViewResume : handleTemplateViewCv}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                  templateView === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="text-center text-slate-400 py-8">Loading stats...</div>
            ) : (
              <TemplateList
                templates={templateView === "resume" ? analyticsData.mostUsedResumeTemplates : analyticsData.mostUsedCvTemplates}
                type={templateView}
              />
            )}
          </div>
        </div>

        <AdminTopPagesAnalytics />
      </div>

      {/* Subscription Breakdown */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Subscription Distribution</h2>
            <p className="text-sm text-slate-500 mt-1">Breakdown of user tiers and market share</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center min-w-0">
          {/* Donut Chart */}
          <div className="xl:col-span-4 flex justify-center min-w-0 h-[280px]">
            {loading ? (
              <div className="w-64 h-64 rounded-full bg-slate-50 animate-pulse border-4 border-slate-100 flex items-center justify-center text-slate-300">
                Charting...
              </div>
            ) : (
              <div className="relative w-full max-w-[280px] h-[280px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={displaySubscriptionBreakdown} cx="50%" cy="50%" innerRadius={75} outerRadius={100} paddingAngle={5} dataKey="count">
                        {displaySubscriptionBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-900">{totalSubscriptionUsers}</span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-widest text-center">Total<br/>Users</span>
                </div>
              </div>
            )}
          </div>

          {/* Subscription Cards */}
          <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse" />
              ))
            ) : displaySubscriptionBreakdown.length > 0 ? (
              displaySubscriptionBreakdown.map(item => (
                <SubscriptionCard key={item.plan} item={item} totalUsers={totalSubscriptionUsers} />
              ))
            ) : (
              <div className="md:col-span-2 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400 font-medium">No subscription data discovered yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-14 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AI Resume Builder · Analytics
      </footer>
    </div>
  );
}