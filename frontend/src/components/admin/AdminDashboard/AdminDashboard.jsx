import React, { useEffect, useState } from "react";
import { Users, FileText, CreditCard, DollarSign } from "lucide-react";
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

export default function AdminDashboard() {
  const [totalUser, setTotalUser] = useState(0);
  const [totalUserChange, setTotalUserChange] = useState(0);
  const [totalActiveSub, setTotalActiveSub] = useState(0);
  const [totalActiveSubChange, setTotalActiveSubChange] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRevenueChange, setTotalRevenueChange] = useState(0);
  const [totalResumeGen, setResumeGen] = useState(0);
  const [totalResumeGenChange, setTotalResumeGenChange] = useState(0);
  const [resumeChart, setResumeChart] = useState([]);

  const [subscriptionSplit, setSubscriptionSplit] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);

  /* ------------------ DUMMY DATA ------------------ */
  const colors = ["#6366F1", "#22C55E", "#F59E0B", "#EC4899"];

  const stats = [
    {
      title: "Total Users",
      value: totalUser,
      change: `+${totalUserChange}%`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Resumes Generated",
      value: totalResumeGen,
      change: `+${totalResumeGenChange}%`,
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Subscriptions",
      value: totalActiveSub,
      change: `+${totalActiveSubChange}%`,
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `$ ${totalRevenue}`,
      change: `+${totalRevenueChange}%`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const fetchTotalUser = async () => {
    try {
      const result = await axiosInstance.get(
        "/api/user/dashboard-stat"
      );

      setTotalUser(result.data?.users?.total || 0);
      setTotalUserChange(result.data?.users?.change || 0);
      setTotalActiveSub(result.data?.subscriptions?.total || 0);
      setTotalActiveSubChange(result.data?.subscriptions?.change || 0);
      setTotalRevenue(result.data?.revenue?.total || 0);
      setTotalRevenueChange(result.data?.revenue?.change || 0);
      setResumeGen(result.data?.resumes?.total || 0);
      setTotalResumeGenChange(result.data?.resumes?.change || 0);
      setResumeChart(result.data?.resumeChart || []);
      setSubscriptionSplit(result.data?.subscriptionSplit || []);
      setUserGrowth(result.data?.userGrowth || []);
      setDailyActivity(result.data?.dailyActiveUsers || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTotalUser();
  }, []);

  return (
    <div className="bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Welcome back, here’s what’s happening</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white border rounded-2xl p-3 sm:p-5 shadow-sm"
            >
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
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-6 mt-10">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-3 sm:gap-6">
          {/* Resume Trend */}
          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm h-[250px] sm:h-[350px] xl:col-span-2 min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center sm:text-left">
              Resume Generation
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumeChart} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="resumes" radius={[4, 4, 0, 0]}>
                    {resumeChart.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm h-[250px] sm:h-[350px] xl:col-span-2 min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center sm:text-left">User Growth</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-3 sm:gap-6">
          {/* Subscription Plans */}
          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm h-[250px] sm:h-[350px] min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center">
              Subscriptions
            </h3>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionSplit}
                    dataKey="value"
                    innerRadius="40%"
                    outerRadius="70%"
                    paddingAngle={4}
                  >
                    {subscriptionSplit.map((_, i) => (
                      <Cell key={i} fill={colors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mt-2 sm:mt-4">
              {subscriptionSplit.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm"
                >
                  <span
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                    style={{ backgroundColor: colors[i] }}
                  />
                  <span className="text-gray-600 whitespace-nowrap">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Active Users */}
          <div className="bg-white border rounded-2xl p-3 sm:p-6 shadow-sm h-[250px] sm:h-[350px] min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-base font-semibold mb-4 text-center sm:text-left">Active Users</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyActivity} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="users" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
