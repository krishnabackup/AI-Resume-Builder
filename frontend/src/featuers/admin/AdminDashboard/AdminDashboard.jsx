import React, { useMemo, useState, useEffect } from "react";
import { Users, FileText, CreditCard, IndianRupee, Loader2 } from "lucide-react";
import {
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart, Line,
  PieChart, Pie,
} from "recharts";
import axiosInstance from "../../../api/axios";
import { useQuery } from "@tanstack/react-query";

// ─── Module-level constants ───────────────────────────────────────────────────
// Defined here so they are created exactly once for the lifetime of the module,
// never re-allocated on component renders.

const INITIAL_STATS = {
  users:             { total: 0, change: 0 },
  subscriptions:     { total: 0, change: 0 },
  revenue:           { total: 0, change: 0 },
  resumes:           { total: 0, change: 0 },
  resumeChart:       [],
  subscriptionSplit: [],
  userGrowth:        [],
  dailyActiveUsers:  [],
};

const CHART_COLORS  = ["#6366F1", "#22C55E", "#F59E0B", "#EC4899"];
const CHART_MARGIN  = { top: 5, right: 4, left: -20, bottom: 0 };
const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 8 };

// Two stable axis-props objects — cheaper than useMemo for a 2-value toggle
const AXIS_PROPS_XS = { fontSize: 9,  tickLine: false, axisLine: false };
const AXIS_PROPS_MD = { fontSize: 10, tickLine: false, axisLine: false };

// Stable dot configs for Line chart — avoids new object on every render
const DOT_XS        = { r: 1.5 };
const DOT_MD        = { r: 2.5 };
const ACTIVE_DOT_XS = { r: 3 };
const ACTIVE_DOT_MD = { r: 5 };

// Stable cursor configs for Tooltip — same reason
const BAR_CURSOR    = { fill: "rgba(99,102,241,0.06)" };
const LINE_CURSOR   = { stroke: "#22C55E", strokeWidth: 1, strokeDasharray: "4 4" };

// Static stat card display config (only icons + labels + styles, no live data)
const STAT_CONFIG = [
  { title: "Total Users",          key: "users",         icon: Users,        color: "text-blue-600",   bg: "bg-blue-50",   prefix: ""  },
  { title: "Resumes Generated",    key: "resumes",       icon: FileText,     color: "text-indigo-600", bg: "bg-indigo-50", prefix: ""  },
  { title: "Active Subscriptions", key: "subscriptions", icon: CreditCard,   color: "text-purple-600", bg: "bg-purple-50", prefix: ""  },
  { title: "Total Revenue",        key: "revenue",       icon: IndianRupee,  color: "text-green-600",  bg: "bg-green-50",  prefix: "₹ " },
];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

// Returns the ORIGINAL array reference when sampling is not needed,
// preventing unnecessary useMemo dependency updates downstream.
const sampleData = (data, threshold = 30) => {
  if (!data || data.length <= threshold) return data;
  const step = Math.ceil(data.length / threshold);
  return data.filter((_, i) => i % step === 0);
};

const getBreakpoint = () => {
  if (typeof window === "undefined") return "lg";
  const w = window.innerWidth;
  if (w < 480)  return "xs";
  if (w < 640)  return "sm";
  if (w < 768)  return "md";
  if (w < 1024) return "lg";
  return "xl";
};

// ─── useBreakpoint ────────────────────────────────────────────────────────────
// Debounced: fires at most once per 150 ms.
// Bails out of setState when the breakpoint string hasn't actually changed,
// preventing spurious re-renders during slow drag-resize.

const useBreakpoint = () => {
  const [bp, setBp] = useState(getBreakpoint);

  useEffect(() => {
    let timer;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const next = getBreakpoint();
        setBp(prev => (prev !== next ? next : prev));
      }, 150);
    };
    window.addEventListener("resize", handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return bp;
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
// Kept outside AdminDashboard so its function identity is stable across parent
// renders — otherwise React.memo's shallow-compare bailout is useless.

const StatCard = React.memo(({ title, value, change, icon: Icon, color, bg }) => (
  <div className="bg-white border rounded-2xl p-3 sm:p-5 shadow-sm">
    <div className="flex justify-between items-start gap-2">
      <div className="min-w-0">
        <p className="text-[11px] sm:text-sm text-gray-500 truncate">{title}</p>
        <p className="text-lg sm:text-2xl font-bold truncate">{value}</p>
        <p className="text-[11px] sm:text-sm text-green-600">{change}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-xl shrink-0 ${bg} ${color}`}>
        <Icon size={18} className="sm:w-[22px] sm:h-[22px]" />
      </div>
    </div>
  </div>
));
StatCard.displayName = "StatCard";

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const bp = useBreakpoint();

  // Cheap scalar derivations from breakpoint — plain ternaries, no useMemo
  const isXs          = bp === "xs";
  const chartHeight   = isXs ? 200 : bp === "sm" ? 220 : bp === "md" ? 240 : 280;
  const pieOuterRadius = isXs || bp === "sm" ? "55%" : "65%";
  const axisProps     = isXs ? AXIS_PROPS_XS : AXIS_PROPS_MD;
  const dotProps      = isXs ? DOT_XS        : DOT_MD;
  const activeDotProps = isXs ? ACTIVE_DOT_XS : ACTIVE_DOT_MD;

  // ── Data fetching ──────────────────────────────────────────────────────────
  const {
    data: d = INITIAL_STATS,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/admin/dashboard-stat");
      return {
        users:             data?.users             || { total: 0, change: 0 },
        subscriptions:     data?.subscriptions     || { total: 0, change: 0 },
        revenue:           data?.revenue           || { total: 0, change: 0 },
        resumes:           data?.resumes           || { total: 0, change: 0 },
        resumeChart:       data?.resumeChart       || [],
        subscriptionSplit: data?.subscriptionSplit || [],
        userGrowth:        data?.userGrowth        || [],
        dailyActiveUsers:  data?.dailyActiveUsers  || [],
      };
    },
    refetchInterval: 30000,
    staleTime:       300000,
  });

  // Single useMemo for all three sampled chart datasets.
  // Collapsed from three separate useMemos — reduces hook call count by 2
  // while keeping the same memoisation granularity (each output only changes
  // when its specific source array reference changes).
  const [sampledResume, sampledGrowth, sampledActive] = useMemo(
    () => [
      sampleData(d.resumeChart),
      sampleData(d.userGrowth),
      sampleData(d.dailyActiveUsers),
    ],
    [d.resumeChart, d.userGrowth, d.dailyActiveUsers]
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading && !d.users.total) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          Syncing dashboard data...
        </p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md w-full">
          <p className="text-red-500 font-bold mb-2">Sync Error</p>
          <p className="text-slate-500 text-sm mb-4">
            {error?.message || "Failed to load dashboard data"}
          </p>
          {/* refetch is stable from TanStack Query — no useCallback wrapper needed */}
          <button
            onClick={refetch}
            className="text-white bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-50 p-3 sm:p-4 lg:p-6 min-h-screen">

      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-500 mt-1">
          Welcome back, here's what's happening
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
        {STAT_CONFIG.map(({ key, title, icon, color, bg, prefix }) => (
          <StatCard
            key={key}
            title={title}
            value={`${prefix}${d[key].total}`}
            change={`+${d[key].change}%`}
            icon={icon}
            color={color}
            bg={bg}
          />
        ))}
      </div>

      {/* Charts — 1-col mobile/tablet, 2-col desktop */}
      <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">

        {/* Resume Generation */}
        <div className="bg-white border rounded-2xl p-3 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold mb-3 sm:mb-4 text-slate-700">
            Resume Generation
          </h3>
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampledResume} margin={CHART_MARGIN}>
                <XAxis dataKey="month" {...axisProps} interval="preserveStartEnd" />
                <YAxis {...axisProps} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={BAR_CURSOR} />
                <Bar dataKey="resumes" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {sampledResume.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscriptions Pie */}
        <div className="bg-white border rounded-2xl p-3 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold mb-3 sm:mb-4 text-slate-700">
            Subscriptions
          </h3>
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={d.subscriptionSplit}
                  dataKey="value"
                  innerRadius="35%"
                  outerRadius={pieOuterRadius}
                  paddingAngle={4}
                >
                  {d.subscriptionSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2">
            {d.subscriptionSplit.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-600">
                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="whitespace-nowrap">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white border rounded-2xl p-3 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold mb-3 sm:mb-4 text-slate-700">
            User Growth
          </h3>
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampledGrowth} margin={CHART_MARGIN}>
                <XAxis dataKey="month" {...axisProps} interval="preserveStartEnd" />
                <YAxis {...axisProps} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={LINE_CURSOR} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={dotProps}
                  activeDot={activeDotProps}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Active Users */}
        <div className="bg-white border rounded-2xl p-3 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold mb-3 sm:mb-4 text-slate-700">
            Daily Active Users
          </h3>
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampledActive} margin={CHART_MARGIN}>
                <XAxis dataKey="day" {...axisProps} interval="preserveStartEnd" />
                <YAxis {...axisProps} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={BAR_CURSOR} />
                <Bar dataKey="users" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}