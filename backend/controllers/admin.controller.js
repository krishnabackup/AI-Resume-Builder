import { pool } from "../config/postgresdb.js";

const DASHBOARD_STATS_TTL_MS = 60 * 1000;
let dashboardStatsCache = {
  expiresAt: 0,
  payload: null,
};
/* ================== ADMIN DASHBOARD ================== */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const now = Date.now();
    if (dashboardStatsCache.payload && dashboardStatsCache.expiresAt > now) {
      return res.status(200).json(dashboardStatsCache.payload);
    }

    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);

    const lastSixMonths = new Date();
    lastSixMonths.setMonth(lastSixMonths.getMonth() - 6);
    lastSixMonths.setDate(1);
    lastSixMonths.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // 🚀 BATCHED QUERIES
    const [
      usersStats,
      resumesStats,
      subsStats,
      revenueStats,
      chartsStats
    ] = await Promise.all([

      // USERS
      pool.query(`
        SELECT
          COUNT(*)::bigint AS total_users,
          COUNT(*) FILTER (WHERE created_at < $1)::bigint AS last_month_users,
          COUNT(*) FILTER (WHERE plan = 'Free' AND is_active = true AND is_admin = false)::bigint AS free_users
        FROM users
      `, [lastMonthStart]),

      // RESUMES
      pool.query(`
        SELECT
          COUNT(*)::bigint AS total_resumes,
          COUNT(*) FILTER (WHERE created_at < $1)::bigint AS last_month_resumes
        FROM resumes
      `, [lastMonthStart]),

      // SUBSCRIPTIONS
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') AS total_active,
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND created_at < $1) AS last_month_active,
          json_agg(json_build_object('plan', plan, 'count', count)) AS plans
        FROM (
          SELECT plan, COUNT(*)::int AS count
          FROM subscriptions
          WHERE status = 'active'
          GROUP BY plan
        ) t
      `, [lastMonthStart]),

      // REVENUE
      pool.query(`
        SELECT
          COALESCE(SUM(amount) FILTER (WHERE status = 'success'), 0) AS total_revenue,
          COALESCE(SUM(amount) FILTER (WHERE status = 'success' AND created_at < $1), 0) AS last_month_revenue
        FROM payments
      `, [lastMonthStart]),

      // CHARTS
      pool.query(`
        SELECT
          (
            SELECT json_agg(row_to_json(r))
            FROM (
              SELECT EXTRACT(YEAR FROM created_at)::int AS year,
                     EXTRACT(MONTH FROM created_at)::int AS month,
                     COUNT(*)::int AS total
              FROM resumes
              WHERE created_at >= $1
              GROUP BY 1, 2
            ) r
          ) AS resume_graph,

          (
            SELECT json_agg(row_to_json(u))
            FROM (
              SELECT EXTRACT(YEAR FROM created_at)::int AS year,
                     EXTRACT(MONTH FROM created_at)::int AS month,
                     COUNT(*)::int AS total
              FROM users
              WHERE created_at >= $1
              GROUP BY 1, 2
            ) u
          ) AS user_growth,

          (
            SELECT json_agg(row_to_json(d))
            FROM (
              SELECT TO_CHAR(last_login::date, 'YYYY-MM-DD') AS day,
                     COUNT(*)::int AS users
              FROM users
              WHERE last_login >= $2
              GROUP BY 1
            ) d
          ) AS daily_active,

          (
            SELECT json_agg(row_to_json(a))
            FROM (
              SELECT CASE WHEN status_code < 400 THEN 'success' ELSE 'failure' END AS metric,
                     COUNT(*)::int AS count
              FROM api_metrics
              WHERE created_at >= $3
              GROUP BY 1
            ) a
          ) AS api_stats
      `, [lastSixMonths, last7Days, last30Days])
    ]);

    // 🔹 Extract
    const u = usersStats.rows[0];
    const r = resumesStats.rows[0];
    const s = subsStats.rows[0];
    const rev = revenueStats.rows[0];
    const c = chartsStats.rows[0];

    // 📊 Basic Stats
    const totalUsers = Number(u.total_users);
    const lastMonthUsers = Number(u.last_month_users);

    const totalResumes = Number(r.total_resumes);
    const lastMonthResumes = Number(r.last_month_resumes);

    const totalActiveSubs = Number(s.total_active);
    const lastMonthActiveSubs = Number(s.last_month_active);

    const totalRevenue = Number(rev.total_revenue);
    const lastMonthRevenue = Number(rev.last_month_revenue);

    const userChange = lastMonthUsers === 0 ? 0 : ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100;
    const resumeChange = lastMonthResumes === 0 ? 0 : ((totalResumes - lastMonthResumes) / lastMonthResumes) * 100;
    const subsChange = lastMonthActiveSubs === 0 ? 0 : ((totalActiveSubs - lastMonthActiveSubs) / lastMonthActiveSubs) * 100;
    const revenueChange = lastMonthRevenue === 0 ? 0 : ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    // 📊 API Stats
    let successCalls = 0, failureCalls = 0;
    (c.api_stats || []).forEach((item) => {
      if (item.metric === "success") successCalls = item.count;
      else failureCalls = item.count;
    });

    const totalCalls = successCalls + failureCalls;
    const apiSuccessRate = totalCalls > 0 ? ((successCalls / totalCalls) * 100).toFixed(1) : "100.0";

    // 📊 Resume Chart
    let resumeChart = [];
    if (c.resume_graph?.length) {
      const map = new Map(
        c.resume_graph.map(i => [`${i.year}-${i.month}`, Number(i.total)])
      );

      resumeChart = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        return {
          month: d.toLocaleString("default", { month: "short" }),
          resumes: map.get(key) || 0
        };
      });
    }

    // 📊 User Growth
    let userGrowth = [];
    if (c.user_growth?.length) {
      const map = new Map(
        c.user_growth.map(i => [`${i.year}-${i.month}`, Number(i.total)])
      );

      userGrowth = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        return {
          month: d.toLocaleString("default", { month: "short" }),
          users: map.get(key) || 0
        };
      });
    }

    // 📊 Daily Active
    const dailyActiveUsers = c.daily_active || [];

    // 📊 Subscription Split
    const freeUserCount = Number(u.free_users || 0);
    const plans = s.plans || [];

    const total =
      freeUserCount +
      plans.reduce((sum, item) => sum + Number(item.count || 0), 0);

    const subscriptionSplit = [
      {
        name: "Free",
        value: total ? Number(((freeUserCount / total) * 100).toFixed(2)) : 0
      },
      ...plans.map(p => ({
        name: p.plan || "Unknown",
        value: total ? Number(((p.count / total) * 100).toFixed(2)) : 0
      }))
    ];

    // ✅ RESPONSE
    const responsePayload = {
      users: { total: totalUsers, change: Number(userChange.toFixed(1)) },
      resumes: { total: totalResumes, change: Number(resumeChange.toFixed(1)) },
      subscriptions: { total: totalActiveSubs, change: Number(subsChange.toFixed(1)) },
      revenue: { total: Math.round(totalRevenue), change: Number(revenueChange.toFixed(1)) },
      apiMetrics: { totalCalls, successRate: `${apiSuccessRate}%` },

      resumeChart,
      userGrowth,
      dailyActiveUsers,
      subscriptionSplit
    };

    dashboardStatsCache = {
      expiresAt: now + DASHBOARD_STATS_TTL_MS,
      payload: responsePayload,
    };

    res.status(200).json(responsePayload);

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      message: "Dashboard stats fetch failed",
      error: error.message
    });
  }
};


export const getAnalyticsStats = async (req, res) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const lastSixMonths = new Date();
    lastSixMonths.setMonth(lastSixMonths.getMonth() - 5);
    lastSixMonths.setDate(1);
    lastSixMonths.setHours(0, 0, 0, 0);

    const [
      newUsersResult,
      activeUsersResult,
      deletedUsersResult,
      availablePlansResult,
      subscriptionDistributionResult,
      apiStatsResult,
      userGrowthResult,
      revenueResult,
      resumeTemplatesResult,
      resumeDownloadsResult,
      cvDownloadsResult
    ] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE created_at >= $1", [last30Days]),
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE last_login >= $1 AND is_admin = false", [last7Days]),
      pool.query("SELECT COUNT(*)::int AS count FROM notifications WHERE type = 'USER_DELETED'"),
      pool.query("SELECT name FROM plans"),
      pool.query("SELECT plan AS id, COUNT(*)::int AS count FROM users WHERE is_admin = false GROUP BY 1"),
      pool.query(`
        SELECT 
          CASE WHEN status_code < 400 THEN 'success' ELSE 'failure' END AS metric,
          COUNT(*)::int AS count,
          AVG(response_time)::float AS avg_response
        FROM api_metrics
        WHERE created_at >= $1
        GROUP BY 1
      `, [last30Days]),
      pool.query(`
        SELECT 
          EXTRACT(YEAR FROM created_at)::int AS year,
          EXTRACT(MONTH FROM created_at)::int AS month,
          COUNT(*)::int AS count
        FROM users
        WHERE created_at >= $1
        GROUP BY 1, 2
      `, [lastSixMonths]),
      pool.query(`
        SELECT 
          EXTRACT(YEAR FROM created_at)::int AS year,
          EXTRACT(MONTH FROM created_at)::int AS month,
          SUM(amount)::float AS revenue
        FROM payments
        WHERE status = 'success' AND created_at >= $1
        GROUP BY 1, 2
      `, [lastSixMonths]),
      pool.query(`
        SELECT 
          data->>'templateId' AS id,
          COUNT(*)::int AS count
        FROM resumes
        WHERE data->>'templateId' IS NOT NULL
        GROUP BY 1
        ORDER BY count DESC
      `),
      pool.query(`
        SELECT 
          template AS id,
          COUNT(*)::int AS count
        FROM downloads
        WHERE type = 'resume' AND action = 'download' AND template IS NOT NULL AND template != ''
        GROUP BY 1
        ORDER BY count DESC
      `),
      pool.query(`
        SELECT 
          template AS id,
          COUNT(*)::int AS count
        FROM downloads
        WHERE type = 'cv' AND action = 'download' AND template IS NOT NULL AND template != ''
        GROUP BY 1
        ORDER BY count DESC
      `)
    ]);

    const newUsersLast30Days = newUsersResult.rows[0]?.count || 0;
    const activeUsersLast7Days = activeUsersResult.rows[0]?.count || 0;
    const deletedUsersCount = deletedUsersResult.rows[0]?.count || 0;

    // ---------- SUBSCRIPTION BREAKDOWN ----------
    const availablePlans = availablePlansResult.rows;
    const subscriptionDistribution = subscriptionDistributionResult.rows;

    const toTitleCase = (value = "") =>
      String(value)
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

    const canonicalPlanByKey = new Map();
    availablePlans.forEach((plan) => {
      if (!plan?.name) return;
      canonicalPlanByKey.set(plan.name.trim().toLowerCase(), plan.name.trim());
    });

    if (!canonicalPlanByKey.has("free")) {
      canonicalPlanByKey.set("free", "Free");
    }

    const normalizePlanName = (rawPlan) => {
      const raw = String(rawPlan || "Free").trim();
      const key = raw.toLowerCase();

      if (canonicalPlanByKey.has(key)) {
        return canonicalPlanByKey.get(key);
      }

      if (["lifetime", "life time"].includes(key)) {
        return canonicalPlanByKey.get("ultra pro") || "Ultra Pro";
      }

      return toTitleCase(raw) || "Free";
    };

    const groupedPlanCounts = new Map();
    subscriptionDistribution.forEach((item) => {
      const planName = normalizePlanName(item.id);
      groupedPlanCounts.set(planName, (groupedPlanCounts.get(planName) || 0) + item.count);
    });

    const knownPlanOrder = availablePlans
      .map((plan) => plan?.name)
      .filter(Boolean)
      .map((name) => normalizePlanName(name));

    const orderedPlans = [
      ...new Set([
        "Free",
        ...knownPlanOrder,
        ...Array.from(groupedPlanCounts.keys()),
      ]),
    ];

    const subscriptionBreakdown = orderedPlans
      .map((plan) => ({
        plan,
        count: groupedPlanCounts.get(plan) || 0,
      }))
      .filter((item) => item.count > 0);

    const totalPaidUsers = subscriptionBreakdown.reduce(
      (sum, item) => (item.plan.toLowerCase() === "free" ? sum : sum + item.count),
      0
    );

    // ---------- API PERFORMANCE ----------
    let apiSuccessCount = 0;
    let apiFailureCount = 0;
    let totalRespTime = 0;
    let callsForAvg = 0;

    apiStatsResult.rows.forEach(stat => {
      if (stat.metric === "success") apiSuccessCount = stat.count;
      else apiFailureCount = stat.count;

      if (stat.avg_response) {
        totalRespTime += (stat.avg_response * stat.count);
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
      const month = d.getMonth() + 1;
      const monthName = d.toLocaleString("default", { month: "short" });

      trendData.push({
        year,
        month,
        monthName,
        users: 0,
        revenue: 0
      });
    }

    trendData.forEach(tick => {
      const growthMatch = userGrowthResult.rows.find(g => Number(g.year) === tick.year && Number(g.month) === tick.month);
      const revenueMatch = revenueResult.rows.find(r => Number(r.year) === tick.year && Number(r.month) === tick.month);

      if (growthMatch) tick.users = Number(growthMatch.count || 0);
      if (revenueMatch) tick.revenue = Number(revenueMatch.revenue || 0);
    });

    // ---------- MOST USED TEMPLATES ----------
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
      return str
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
    };

    const resumeTemplateCountMap = new Map();
    const cvTemplateCountMap = new Map();

    resumeTemplatesResult.rows.forEach((item) => {
      let name = item.name;
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
        const rawId = String(item.id);
        name = hardcodedNames[rawId] || toReadableTemplateName(rawId);
      }
      const key = name || "Standard";
      resumeTemplateCountMap.set(key, (resumeTemplateCountMap.get(key) || 0) + item.count);
    });

    resumeDownloadsResult.rows.forEach((item) => {
      const key = toReadableTemplateName(item.id);
      resumeTemplateCountMap.set(key, (resumeTemplateCountMap.get(key) || 0) + item.count);
    });

    cvDownloadsResult.rows.forEach((item) => {
      const key = toReadableTemplateName(item.id);
      cvTemplateCountMap.set(key, (cvTemplateCountMap.get(key) || 0) + item.count);
    });

    const buildTopTemplates = (countMap) => {
      const total = Array.from(countMap.values()).reduce((sum, count) => sum + count, 0);
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
    resumeTemplateCountMap.forEach((count, key) => combinedTemplateCountMap.set(key, (combinedTemplateCountMap.get(key) || 0) + count));
    cvTemplateCountMap.forEach((count, key) => combinedTemplateCountMap.set(key, (combinedTemplateCountMap.get(key) || 0) + count));

    const totalTemplateUsage = Array.from(combinedTemplateCountMap.values()).reduce((sum, count) => sum + count, 0);
    const mostUsedTemplates = Array.from(combinedTemplateCountMap.entries())
      .map(([templateId, count]) => ({
        templateId,
        count,
        percentage: totalTemplateUsage > 0 ? Math.round((count / totalTemplateUsage) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const chartData = trendData.map(item => ({
      month: item.monthName,
      users: item.users,
      revenue: item.revenue
    }));

    const baseUptime = 99.95;
    const uptimeDeduction = (100 - parseFloat(apiSuccessRate)) * 0.01;
    const systemUptime = Math.max(99.90, baseUptime - uptimeDeduction).toFixed(2);

    res.status(200).json({
      userGrowth: {
        count: Number(newUsersLast30Days),
        note: "New users in last 30 days",
      },
      conversions: {
        count: totalPaidUsers,
        note: "Total paid subscriptions",
      },
      activeUsers: {
        count: Number(activeUsersLast7Days),
        note: "Active last 7 days",
      },
      deletedUsers: {
        count: Number(deletedUsersCount),
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
        totalApiCalls: Number(totalApiCalls),
        systemUptime: `${systemUptime}%`,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Analytics fetch failed", error: error.message });
  }
};



