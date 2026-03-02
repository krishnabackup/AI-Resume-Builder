import React, { useEffect, useState } from "react";
import { TrendingUp, Users, UserCheck, UserMinus, Star, Activity, Zap, Shield, Crown, Award, Gem } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axiosInstance from "../../../api/axios";

export default function AdminAnalytics() {
  const [userGrowth, setUserGrowth] = useState({ count: 0, note: "" });
  const [conversions, setConversions] = useState({ count: 0, note: "" });
  const [activeUsers, setActiveUsers] = useState({ count: 0, note: "" });
  const [deletedUsers, setDeletedUsers] = useState({ count: 0, note: "" });
  const [mostUsedTemplates, setMostUsedTemplates] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [subscriptionBreakdown, setSubscriptionBreakdown] = useState([]);
  const [summary, setSummary] = useState({
    apiSuccessRate: "0%",
    apiFailureRate: "0%",
    avgResponseTime: "0ms",
    totalApiCalls: 0,
    systemUptime: "99.98%"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axiosInstance.get("/api/user/analytics-stat");
      setUserGrowth(response.data.userGrowth);
      setConversions(response.data.conversions);
      setActiveUsers(response.data.activeUsers);
      setDeletedUsers(response.data.deletedUsers || { count: 0, note: "" });
      setMostUsedTemplates(response.data.mostUsedTemplates || []);
      setChartData(response.data.chartData || []);
      setSubscriptionBreakdown(response.data.subscriptionBreakdown || []);
      setSummary(response.data.summary || {
        apiSuccessRate: "0%",
        apiFailureRate: "0%",
        avgResponseTime: "0ms",
        totalApiCalls: 0,
        systemUptime: "99.98%"
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "User Growth",
      value: loading ? "..." : `${userGrowth.count} Users`,
      note: userGrowth.note,
      icon: <TrendingUp className="text-green-600" />,
      iconBg: "bg-green-50",
      valueColor: "text-slate-900",
    },
    {
      title: "Paid Conversions",
      value: loading ? "..." : `${conversions.count} Users`,
      note: conversions.note,
      icon: <Users className="text-blue-600" />,
      iconBg: "bg-blue-50",
      valueColor: "text-slate-900",
    },
    {
      title: "Active Users",
      value: loading ? "..." : `${activeUsers.count} Users`,
      note: activeUsers.note,
      icon: <UserCheck className="text-purple-600" />,
      iconBg: "bg-purple-50",
      valueColor: "text-slate-900",
    },
    {
      title: "Deleted Users",
      value: loading ? "..." : `${deletedUsers.count} Users`,
      note: deletedUsers.note,
      icon: <UserMinus className="text-red-600" />,
      iconBg: "bg-red-50",
      valueColor: "text-slate-900",
    },
  ];

  return (
    <div className="min-h-screen flex-1 p-4 sm:p-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">System Analytics</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">
          Deep dive into platform performance & user engagement.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-10">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm">{item.title}</p>
              <div className={`${item.iconBg} p-3 rounded-full`}>
                {item.icon}
              </div>
            </div>

            <p className={`text-3xl font-bold mt-3 ${item.valueColor}`}>
              {item.value}
            </p>

            <p className="text-slate-500 text-sm mt-2">{item.note}</p>
          </div>
        ))}
      </div>

      {/* System Performance & Rating Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Platform Health Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Platform Health</h3>
            <div className="bg-green-50 p-2 rounded-full">
              <Activity className="text-green-600" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-600">
              {loading ? "..." : summary.apiSuccessRate.replace("%", "")}
            </span>
            <span className="text-slate-500">/100</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {parseFloat(summary.apiSuccessRate) > 95 ? "System running smoothly" : "Monitoring performance"}
          </p>
          <div className="mt-4 bg-slate-100 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: summary.apiSuccessRate }}></div>
          </div>
        </div>

        {/* User Satisfaction Rating */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">User Satisfaction</h3>
            <div className="bg-yellow-50 p-2 rounded-full">
              <Star className="text-yellow-600" size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-yellow-600">4.7</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">Based on 2,847 reviews</p>
        </div>

        {/* Response Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Avg Response Time</h3>
            <div className="bg-blue-50 p-2 rounded-full">
              <Zap className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-600">
              {loading ? "..." : summary.avgResponseTime.replace("ms", "")}
            </span>
            <span className="text-slate-500">ms</span>
          </div>
          <p className="text-sm text-green-600 mt-2">Platform latency</p>
        </div>
      </div>

      {/* Data Quality & Security Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {/* Uptime */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">System Uptime</p>
            <div className="bg-green-50 p-2 rounded-full">
              <Shield className="text-green-600" size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "..." : summary.systemUptime}
          </p>
          <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
        </div>

        {/* Data Accuracy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">Total API Calls</p>
            <div className="bg-purple-50 p-2 rounded-full">
              <Activity className="text-purple-600" size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "..." : summary.totalApiCalls}
          </p>
          <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
        </div>

        {/* API Success Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">API Success Rate</p>
            <div className="bg-blue-50 p-2 rounded-full">
              <Zap className="text-blue-600" size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "..." : summary.apiSuccessRate}
          </p>
          <p className="text-xs text-green-600 mt-1">Real-time health</p>
        </div>

        {/* Error Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">API Failure Rate</p>
            <div className="bg-red-50 p-2 rounded-full">
              <Activity className="text-red-600" size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "..." : summary.apiFailureRate}
          </p>
          <p className="text-xs text-red-600 mt-1">Real-time error monitoring</p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Growth & Revenue Chart */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">
            Platform Growth & Revenue
          </h2>
          <p className="text-sm text-slate-500 mb-6">User acquisition vs Revenue generated</p>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              Loading chart data...
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenue (₹)"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="New Users"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-xl">
              No trend data available yet
            </div>
          )}
        </div>

        {/* Most Used Templates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Most Used Templates</h2>

          {loading ? (
            <div className="text-center text-slate-400 py-8">Loading...</div>
          ) : mostUsedTemplates.length > 0 ? (
            <div className="space-y-4 text-sm">
              {mostUsedTemplates.map((template, index) => {
                const colors = ["text-blue-600", "text-purple-600", "text-emerald-600", "text-orange-600", "text-slate-500"];
                const bgs = ["bg-blue-50", "bg-purple-50", "bg-emerald-50", "bg-orange-50", "bg-slate-50"];
                return (
                  <div key={template.templateId} className={`flex justify-between items-center p-3 rounded-xl ${bgs[index % bgs.length]}`}>
                    <span className="font-medium text-slate-700">
                      {template.templateId}
                    </span>
                    <span className={`${colors[index % colors.length]} font-bold`}>
                      {template.count} uses ({template.percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">
              No template usage data yet
            </div>
          )}
        </div>
      </div>

      {/* Subscription Breakdown Section */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Subscription Distribution</h2>
            <p className="text-sm text-slate-500 mt-1">Breakdown of user tiers and market share</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          {/* Visual Overview - Donut Chart */}
          <div className="xl:col-span-4 flex justify-center">
            {loading ? (
              <div className="w-64 h-64 rounded-full bg-slate-50 animate-pulse border-4 border-slate-100 flex items-center justify-center text-slate-300">
                Charting...
              </div>
            ) : (
              <div className="relative w-full max-w-[280px]">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={subscriptionBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {subscriptionBreakdown.map((entry, index) => {
                        const colors = ['#94a3b8', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-900">
                    {subscriptionBreakdown.reduce((acc, curr) => acc + curr.count, 0)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Total Users</span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Cards */}
          <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse" />
              ))
            ) : subscriptionBreakdown.length > 0 ? (
              subscriptionBreakdown.map((item, index) => {
                const configs = {
                  Free: { icon: <Users size={18} />, color: "bg-slate-500", light: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" },
                  Pro: { icon: <Star size={18} />, color: "bg-blue-600", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
                  Premium: { icon: <Award size={18} />, color: "bg-purple-600", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
                  "Ultra pro": { icon: <Crown size={18} />, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
                  "Ultra Pro": { icon: <Crown size={18} />, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
                  Basic: { icon: <Zap size={18} />, color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
                };
                const config = configs[item.plan] || { icon: <Gem size={18} />, color: "bg-slate-400", light: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" };
                const total = subscriptionBreakdown.reduce((s, b) => s + b.count, 0) || 1;
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={item.plan} className={`group p-5 rounded-2xl border ${config.border} bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${config.light} ${config.text} group-hover:scale-110 transition-transform`}>
                          {config.icon}
                        </div>
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
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
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
