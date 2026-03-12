import User from "../Models/User.js";
import Payment from "../Models/payment.js";
import Subscription from "../Models/subscription.js";
import Resume from "../Models/resume.js";
import ApiMetric from "../Models/ApiMetric.js";
import Notification from "../Models/notification.js"
import Download from "../Models/Download.js";
/* ================== ADMIN DASHBOARD ================== */

export const getAdminDashboardStats = async (req, res) => {
  try {
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);

    // ---------- CORE STATS ----------
    // USERS
    const [
      totalUsers,
      lastMonthUsers,
      totalResumes,
      lastMonthResumes,
      totalActiveSubs,
      lastMonthActiveSubs,
      totalRevenueAgg,
      lastMonthRevenueAgg,
    ] = await Promise.all([

      User.countDocuments(),
      User.countDocuments({ createdAt: { $lt: lastMonthStart } }),

      Resume.countDocuments(),
      Resume.countDocuments({ createdAt: { $lt: lastMonthStart } }),

      Subscription.countDocuments({ status: "active" }),
      Subscription.countDocuments({
        status: "active",
        createdAt: { $lt: lastMonthStart }
      }),

      await Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      await Payment.aggregate([
        {
          $match: {
            status: "success",
            createdAt: { $lt: lastMonthStart },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

    ]);

    const userChange = lastMonthUsers === 0 ? 0 : ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100;

    // RESUMES
    const resumeChange = lastMonthResumes === 0 ? 0 : ((totalResumes - lastMonthResumes) / lastMonthResumes) * 100;

    // SUBSCRIPTIONS

    const subsChange = lastMonthActiveSubs === 0 ? 0 : ((totalActiveSubs - lastMonthActiveSubs) / lastMonthActiveSubs) * 100;

    // REVENUE
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const revenueChange = lastMonthRevenue === 0 ? 0 : ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    // ---------- CHARTS & DISTRIBUTIONS ----------
   
    const lastSixMonths = new Date();
    lastSixMonths.setMonth(lastSixMonths.getMonth() - 6);
    lastSixMonths.setDate(1);
    lastSixMonths.setHours(0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      resumeGraph,
      userGrowthAgg,
      revenueByMonth,
      dailyActiveUsersAgg,
      apiStats,
      subscriptionCounts
    ] = await Promise.all([
      // resume counts for chart
      Resume.aggregate([
        { $match: { createdAt: { $gte: lastSixMonths } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            total: { $sum: 1 }
          }
        }
      ]),

      // user growth
      User.aggregate([
        { $match: { createdAt: { $gte: lastSixMonths } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            total: { $sum: 1 }
          }
        }
      ]),

      // revenue by month
      Payment.aggregate([
        { $match: { status: "success" } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            revenue: { $sum: "$amount" }
          }
        }
      ]),

      // daily active users
      User.aggregate([
        { $match: { lastLogin: { $gte: last7Days } } },
        {
          $group: {
            _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" } } },
            users: { $sum: 1 }
          }
        }
      ]),

      // api summary for past month
      ApiMetric.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: { $cond: [{ $lt: ["$statusCode", 400] }, "success", "failure"] },
            count: { $sum: 1 }
          }
        }
      ]),

      // subscription distribution
      Promise.all([
        User.countDocuments({ plan: "Free", isActive: true, isAdmin: false }),
        Subscription.aggregate([
          { $match: { status: "active" } },
          { $group: { _id: { $ifNull: ["$plan", "Unknown"] }, count: { $sum: 1 } } }
        ])
      ])
    ]);

    // resume chart maping  
    const resumeChartMap = new Map(resumeGraph.map((item) => [item._id.month, item.total]));
    const resumeChart = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthNumber = date.getMonth() + 1;
      return {
        month: date.toLocaleString("default", { month: "short" }),
        resumes: resumeChartMap.get(monthNumber) || 0,
      };
    });
    
    // user growth mapping

    const userGrowthMap = new Map(userGrowthAgg.map((item) => [item._id.month, item.total]));
    const userGrowth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthNumber = date.getMonth() + 1;
      return {
        month: date.toLocaleString("default", { month: "short" }),
        users: userGrowthMap.get(monthNumber) || 0,
      };
    });

   // daily active user mapping
   
    const dailyMap = new Map(dailyActiveUsersAgg.map((item) => [item._id.date, item.users]));
    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyActiveUsers = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyActiveUsers.push({ day: daysMap[d.getDay()], users: dailyMap.get(key) || 0 });
    }

    // api response rate
    let successCalls = 0;
    let failureCalls = 0;
    apiStats.forEach((s) => {
      if (s._id === "success") successCalls = s.count;
      else failureCalls = s.count;
    });
    const totalCalls = successCalls + failureCalls;
    const apiSuccessRate = totalCalls > 0 ? ((successCalls / totalCalls) * 100).toFixed(1) : 100;

    // subscription split maping
    const [freeUserCount, paidUserCount] = subscriptionCounts;
    const total = freeUserCount + paidUserCount.reduce((sum, item) => sum + item.count, 0);
    const paidMap = new Map(paidUserCount.map((p) => [p._id, p.count]));
    const subscriptionSplit = [
      { name: "Free", value: total === 0 ? 0 : Number(((freeUserCount / total) * 100).toFixed(2)) },
      { name: "Pro", value: total === 0 ? 0 : Number(((paidMap.get("Pro") || 0) / total * 100).toFixed(2)) },
      { name: "Lifetime", value: total === 0 ? 0 : Number(((paidMap.get("Lifetime") || 0) / total * 100).toFixed(2)) },
    ];


    // ---------- FINAL RESPONSE ---------
    res.status(200).json({
      users: {
        total: totalUsers,
        change: Number(userChange.toFixed(1)),
      },
      resumes: {
        total: totalResumes,
        change: Number(resumeChange.toFixed(1)),
      },
      subscriptions: {
        total: totalActiveSubs,
        change: Number(subsChange.toFixed(1)),
      },
      revenue: {
        total: Math.round(totalRevenue),
        change: Number(revenueChange.toFixed(1)),
      },
      apiMetrics: {
        totalCalls,
        successRate: `${apiSuccessRate}%`,
      },
      resumeChart,
      userGrowth,
      dailyActiveUsers,
      subscriptionSplit,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Dashboard stats fetch failed", error: error.message });
  }
};


export const getAnalyticsStats = async (req, res) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: last30Days },
    });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const activeUsersLast7Days = await User.countDocuments({
      updatedAt: { $gte: last7Days },
    });

    // ---------- DELETED USERS ----------
    const deletedUsersCount = await Notification.countDocuments({
      type: "USER_DELETED",
    });

    // ---------- SUBSCRIPTION BREAKDOWN ----------
    const subscriptionDistribution = await User.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
    ]);

    const subscriptionBreakdown = subscriptionDistribution.map((item) => ({
      plan: (item._id || "Free").charAt(0).toUpperCase() + (item._id || "Free").slice(1),
      count: item.count,
    }));

    const totalPaidUsers = subscriptionBreakdown.reduce((sum, item) => {
      if (item.plan !== "Free") return sum + item.count;
      return sum;
    }, 0);

    // ---------- API PERFORMANCE ----------
    const apiStats = await ApiMetric.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $cond: [{ $lt: ["$statusCode", 400] }, "success", "failure"] },
          count: { $sum: 1 },
          avgResponse: { $avg: "$responseTime" },
        },
      },
    ]);

    let apiSuccessCount = 0;
    let apiFailureCount = 0;
    let totalRespTime = 0;
    let callsForAvg = 0;

    apiStats.forEach(stat => {
      if (stat._id === "success") apiSuccessCount = stat.count;
      else apiFailureCount = stat.count;

      if (stat.avgResponse) {
        totalRespTime += (stat.avgResponse * stat.count);
        callsForAvg += stat.count;
      }
    });

    const totalApiCalls = apiSuccessCount + apiFailureCount;
    const apiSuccessRate = totalApiCalls > 0 ? ((apiSuccessCount / totalApiCalls) * 100).toFixed(1) : 100;
    const apiFailureRate = totalApiCalls > 0 ? ((apiFailureCount / totalApiCalls) * 100).toFixed(1) : 0;
    const avgResponseTime = callsForAvg > 0 ? Math.round(totalRespTime / callsForAvg) : 250;

    // ---------- CONSOLIDATED TREND DATA (LAST 6 MONTHS) ----------
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed
      const monthName = d.toLocaleString("default", { month: "short" });

      trendData.push({
        year,
        month: month,
        monthName,
        users: 0,
        revenue: 0
      });
    }

    // Fill User Growth
    const userGrowthAgg = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Fill Revenue
    const revenueByMonth = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
        },
      },
    ]);

    trendData.forEach(tick => {
      const growthMatch = userGrowthAgg.find(g => g._id.year === tick.year && g._id.month === tick.month);
      const revenueMatch = revenueByMonth.find(r => r._id.year === tick.year && r._id.month === tick.month);

      if (growthMatch) tick.users = growthMatch.count;
      if (revenueMatch) tick.revenue = revenueMatch.revenue;
    });

    // ---------- MOST USED TEMPLATES (Resume + CV templates) ----------
    const mostUsedResumeTemplatesAgg = await Resume.aggregate([
      {
        $match: { templateId: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: "$templateId",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          tId: {
            $convert: {
              input: "$_id",
              to: "objectId",
              onError: "$_id",
              onNull: "$_id"
            }
          }
        }
      },
      {
        $lookup: {
          from: "templates",
          localField: "tId",
          foreignField: "_id",
          as: "templateDetails",
        },
      },
      { $unwind: { path: "$templateDetails", preserveNullAndEmptyArrays: true } },
      { $sort: { count: -1 } },
    ]);

    const mostUsedResumeDownloadTemplatesAgg = await Download.aggregate([
      {
        $match: {
          type: "resume",
          action: "download",
          template: { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$template",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const mostUsedCvTemplatesAgg = await Download.aggregate([
      {
        $match: {
          type: "cv",
          action: "download",
          template: { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$template",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const toReadableTemplateName = (value) => {
      if (!value) return "Standard";
      const str = String(value);

      const canonicalNames = {
        professional: "Professional",
        modern: "Modern",
        creative: "Creative",
        minimal: "Minimal",
        executive: "Executive",
        academic: "Academic",
        twoColumn: "Two Column ATS",
        simple: "Simple",
        academicSidebar: "Academic Sidebar",
        Elegant: "Clinica Elegant",
        vertex: "Vertex Sidebar",
        elite: "Elite Sidebar",
        eclipse: "Eclipse",
        eclipse1: "Eclipse Alt",
        harbor: "Harbor",
        "jessica-claire": "Jessica Claire (Sidebar)",
        "jessica-claire-1": "Jessica Claire (Classic)",
        "jessica-claire-2": "Jessica Claire (Refined)",
        "jessica-claire-3": "Jessica Claire (Modern Blue)",
        "jessica-claire-4": "Jessica Claire (Green Accent)",
        "jessica-claire-5": "Jessica Claire (Green/Blue)",
        "jessica-claire-6": "Jessica Claire (Teal Three-Tone)",
        "jessica-claire-7": "Jessica Claire (Saira Blue)",
        "jessica-claire-8": "Jessica Claire (Fira Sans)",
        "jessica-claire-9": "Jessica Claire (Saira Split)",
        "jessica-claire-10": "Jessica Claire (Cyan Header)",
      };

      if (canonicalNames[str]) return canonicalNames[str];
      if (str.length > 40) return `ID: ${str.substring(0, 8)}...`;
      // Convert template ids like "jessica-claire" into "Jessica Claire".
      return str
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
    };

    const resumeTemplateCountMap = new Map();
    const cvTemplateCountMap = new Map();

    mostUsedResumeTemplatesAgg.forEach((item) => {
      let name = item.templateDetails?.name;
      if (!name) {
        const hardcodedNames = {
          professional: "Professional",
          modern: "Modern",
          creative: "Creative",
          minimal: "Minimal",
          executive: "Executive",
          academic: "Academic",
          twoColumn: "Two Column ATS",
          simple: "Simple",
          academicSidebar: "Academic Sidebar",
          Elegant: "Clinica Elegant",
          vertex: "Vertex Sidebar",
          elite: "Elite Sidebar",
          eclipse: "Eclipse",
          eclipse1: "Eclipse Alt",
          harbor: "Harbor"
        };
        const rawId = typeof item._id === "string" ? item._id : String(item._id);
        name = hardcodedNames[rawId] || toReadableTemplateName(rawId);
      }

      const key = name || "Standard";
      resumeTemplateCountMap.set(key, (resumeTemplateCountMap.get(key) || 0) + item.count);
    });

    mostUsedResumeDownloadTemplatesAgg.forEach((item) => {
      const key = toReadableTemplateName(item._id);
      resumeTemplateCountMap.set(key, (resumeTemplateCountMap.get(key) || 0) + item.count);
    });

    mostUsedCvTemplatesAgg.forEach((item) => {
      const key = toReadableTemplateName(item._id);
      cvTemplateCountMap.set(key, (cvTemplateCountMap.get(key) || 0) + item.count);
    });

    const buildTopTemplates = (countMap) => {
      const total = Array.from(countMap.values()).reduce(
        (sum, count) => sum + count,
        0
      );

      return Array.from(countMap.entries())
        .map(([templateId, count]) => ({
          templateId,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    const mostUsedResumeTemplates = buildTopTemplates(resumeTemplateCountMap);
    const mostUsedCvTemplates = buildTopTemplates(cvTemplateCountMap);

    const combinedTemplateCountMap = new Map();
    Array.from(resumeTemplateCountMap.entries()).forEach(([key, count]) => {
      combinedTemplateCountMap.set(key, (combinedTemplateCountMap.get(key) || 0) + count);
    });
    Array.from(cvTemplateCountMap.entries()).forEach(([key, count]) => {
      combinedTemplateCountMap.set(key, (combinedTemplateCountMap.get(key) || 0) + count);
    });

    const totalTemplateUsage = Array.from(combinedTemplateCountMap.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    const mostUsedTemplates = Array.from(combinedTemplateCountMap.entries())
      .map(([templateId, count]) => ({
        templateId,
        count,
        percentage:
          totalTemplateUsage > 0
            ? Math.round((count / totalTemplateUsage) * 100)
            : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const chartData = trendData.map(item => ({
      month: item.monthName,
      users: item.users,
      revenue: item.revenue
    }));

    // ---------- SYSTEM UPTIME ----------
    const baseUptime = 99.95;
    const uptimeDeduction = (100 - parseFloat(apiSuccessRate)) * 0.01;
    const systemUptime = Math.max(99.90, baseUptime - uptimeDeduction).toFixed(2);

    res.status(200).json({
      userGrowth: {
        count: newUsersLast30Days,
        note: "New users in last 30 days",
      },
      conversions: {
        count: totalPaidUsers,
        note: "Total paid subscriptions",
      },
      activeUsers: {
        count: activeUsersLast7Days,
        note: "Active last 7 days",
      },
      deletedUsers: {
        count: deletedUsersCount,
        note: "Total deleted accounts",
      },
      mostUsedResumeTemplates,
      mostUsedCvTemplates,
      mostUsedTemplates,
      chartData,
      subscriptionBreakdown,
      summary: {
        apiSuccessRate: `${apiSuccessRate}%`,
        apiFailureRate: `${apiFailureRate}%`,
        avgResponseTime: `${avgResponseTime}ms`,
        totalApiCalls,
        systemUptime: `${systemUptime}%`,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Analytics fetch failed", error: error.message });
  }
};


