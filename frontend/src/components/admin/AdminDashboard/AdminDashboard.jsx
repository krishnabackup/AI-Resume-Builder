import React, { useState, useEffect, useMemo } from "react";
import { Users, FileText, CreditCard, IndianRupee, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";
import axiosInstance from "../../../api/axios";
import { useQuery } from "@tanstack/react-query";

const INITIAL_DASHBOARD_STATS = {
  users: { total: 0, change: 0 },
  subscriptions: { total: 0, change: 0 },
  revenue: { total: 0, change: 0 },
  resumes: { total: 0, change: 0 },
  resumeChart: [],
  subscriptionSplit: [],
  userGrowth: [],
  dailyActiveUsers: []
};

const sampleData = (data, threshold = 30) => {
  if (!data || data.length <= threshold) return data;
  const step = Math.ceil(data.length / threshold);
  return data.filter((_, index) => index % step === 0);
};

const StatCard = React.memo(({ item }) => {
  const Icon = item.icon;
  return (
    <div className="bg-white border rounded-2xl p-3 sm:p-5 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{item.title}</p>
          <p className="text-xl sm:text-2xl font-bold">{item.value}</p>
          <p className="text-xs sm:text-sm text-green-600">{item.change}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-xl ${item.bg} ${item.color}`}>
          <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
        </div>
      </div>
    </div>
  );
});

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: dashboardData = INITIAL_DASHBOARD_STATS,
    isLoading: loading,
    isError,
    error
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/admin/dashboard-stat");
      return {
        users: data?.users || { total: 0, change: 0 },
        subscriptions: data?.subscriptions || { total: 0, change: 0 },
        revenue: data?.revenue || { total: 0, change: 0 },
        resumes: data?.resumes || { total: 0, change: 0 },
        resumeChart: data?.resumeChart || [],
        subscriptionSplit: data?.subscriptionSplit || [],
        userGrowth: data?.userGrowth || [],
        dailyActiveUsers: data?.dailyActiveUsers || []
      };
    },
    refetchInterval: 30000,
    staleTime: 300000,
  });

  const sampledResumeChart = useMemo(() => sampleData(dashboardData.resumeChart), [dashboardData.resumeChart]);
  const sampledUserGrowth = useMemo(() => sampleData(dashboardData.userGrowth), [dashboardData.userGrowth]);
  const sampledDailyActiveUsers = useMemo(() => sampleData(dashboardData.dailyActiveUsers), [dashboardData.dailyActiveUsers]);

  const colors = useMemo(() => ["#6366F1", "#22C55E", "#F59E0B", "#EC4899"], []);

  const stats = useMemo(() => [
    {
      title: "Total Users",
      value: dashboardData.users.total,
      change: `+${dashboardData.users.change}%`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Resumes Generated",
      value: dashboardData.resumes.total,
      change: `+${dashboardData.resumes.change}%`,
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Subscriptions",
      value: dashboardData.subscriptions.total,
      change: `+${dashboardData.subscriptions.change}%`,
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `₹ ${dashboardData.revenue.total}`,
      change: `+${dashboardData.revenue.change}%`,
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ], [dashboardData.users, dashboardData.resumes, dashboardData.subscriptions, dashboardData.revenue]);

  if (loading && !dashboardData.users.total) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse text-sm">Syncing dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md">
          <p className="text-red-500 font-bold mb-2">Sync Error</p>
          <p className="text-slate-500 text-sm mb-4">{error?.message || "Failed to load dashboard data"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-white bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Welcome back, here’s what’s happening</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((item) => (
          <StatCard key={item.title} item={item} />
        ))}
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-6 mt-10">
        <div className="flex flex-col gap-3 sm:gap-6 min-w-0">
          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm min-h-[300px] sm:min-h-[400px] xl:col-span-2 min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center sm:text-left transition-colors">
              Resume Generation
            </h3>
            <div className="flex-1 w-full min-h-[250px] sm:min-h-[300px]">
              {isMounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sampledResumeChart} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="resumes" radius={[4, 4, 0, 0]}>
                      {sampledResumeChart.map((_, i) => (
                        <Cell key={i} fill={colors[i % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm min-h-[300px] sm:min-h-[400px] xl:col-span-2 min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center sm:text-left">User Growth</h3>
            <div className="flex-1 w-full min-h-[250px] sm:min-h-[300px]">
              {isMounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampledUserGrowth} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#22C55E"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-6 min-w-0">
          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm min-h-[350px] sm:min-h-[450px] min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center">
              Subscriptions
            </h3>

            <div className="flex-1 w-full min-h-[250px] sm:min-h-[300px]">
              {isMounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.subscriptionSplit}
                      dataKey="value"
                      innerRadius="40%"
                      outerRadius="70%"
                      paddingAngle={4}
                    >
                      {dashboardData.subscriptionSplit.map((_, i) => (
                        <Cell key={i} fill={colors[i % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mt-2 sm:mt-4">
              {dashboardData.subscriptionSplit.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm"
                >
                  <span
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  />
                  <span className="text-gray-600 whitespace-nowrap">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm min-h-[300px] sm:min-h-[400px] min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center sm:text-left">Active Users</h3>
            <div className="flex-1 w-full min-h-[250px] sm:min-h-[300px]">
              {isMounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sampledDailyActiveUsers} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
