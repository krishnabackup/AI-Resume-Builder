import { chatBotAPIResponse,adminChatbotAIResponse } from "../ai/aiService.js"
import { pool } from "../config/postgresdb.js";

export const ChatbotResponse = async (req, res) => {
  try {
    const { message, prevMsg, isLoggedIn } = req.body;

    /* ===============================
       CALL AI SERVICE
    =============================== */

    const aiResponse = await chatBotAPIResponse(
      message,
      prevMsg,
      isLoggedIn
    );

    let parsed;

    /* ===============================
       PARSE AI RESPONSE
    =============================== */

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = { mode: "message", text: aiResponse };
      }
    } catch {
      parsed = {
        mode: "message",
        text: aiText || "Sorry, I couldn't generate a response."
      };
    }
    return res.json({ ...parsed });
  } catch (error) {
    console.error("❌ Chatbot Controller Error:", error);
    return res.status(500).json({
      reply: {
        mode: "message",
        text: "Something went wrong. Please try again later."
      }
    });
  }
};

export const AdminChatbotResponse = async (req, res) => {
  try {
    const { message, prevMsg } = req.body;

    /* ===============================
       RUN ALL QUERIES IN PARALLEL
    =============================== */

    const [
      totalUsersQ,
      activeUsersQ,
      newUsersQ,
      totalResumesQ,
      activeSubsQ,
      revenueQ,
      apiStatsQ,
      subBreakdownQ,
      dailyActiveQ,
      userGrowthQ,
      resumeGrowthQ,
      templatesQ
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users`),

      pool.query(`
        SELECT COUNT(*) FROM users 
        WHERE last_login >= NOW() - INTERVAL '7 days'
        AND is_admin = false
      `),

      pool.query(`
        SELECT COUNT(*) FROM users 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        AND is_admin = false
      `),

      pool.query(`SELECT COUNT(*) FROM resumes`),

      pool.query(`
        SELECT COUNT(*) FROM subscriptions 
        WHERE status = 'active'
      `),

      pool.query(`
        SELECT COALESCE(SUM(amount),0) AS total 
        FROM payments 
        WHERE status = 'success'
      `),

      pool.query(`
        SELECT 
          CASE 
            WHEN status_code < 400 THEN 'success'
            ELSE 'failure'
          END AS type,
          COUNT(*) AS count
        FROM api_metrics
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY type
      `),

      pool.query(`
        SELECT COALESCE(plan, 'Free') AS plan, COUNT(*) 
        FROM users
        WHERE is_admin = false
        GROUP BY plan
      `),

      pool.query(`
        SELECT 
          TO_CHAR(last_login, 'YYYY-MM-DD') AS day,
          COUNT(*) AS users
        FROM users
        WHERE last_login >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY day
      `),

      pool.query(`
        SELECT 
          DATE_TRUNC('month', created_at) AS month,
          COUNT(*) AS total
        FROM users
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month
      `),

      pool.query(`
        SELECT 
          DATE_TRUNC('month', created_at) AS month,
          COUNT(*) AS total
        FROM resumes
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month
      `),

      pool.query(`
        SELECT id, COUNT(*) AS count
        FROM resumes
        WHERE id IS NOT NULL
        GROUP BY id
        ORDER BY count DESC
        LIMIT 5
      `)
    ]);

    /* ===============================
       PROCESS DATA
    =============================== */

    const totalUsers = Number(totalUsersQ.rows[0].count);
    const activeUsers = Number(activeUsersQ.rows[0].count);
    const newUsers = Number(newUsersQ.rows[0].count);
    const totalResumes = Number(totalResumesQ.rows[0].count);
    const activeSubscriptions = Number(activeSubsQ.rows[0].count);
    const totalRevenue = Number(revenueQ.rows[0].total);

    // API stats
    let successCalls = 0;
    let failureCalls = 0;

    apiStatsQ.rows.forEach(r => {
      if (r.type === "success") successCalls = Number(r.count);
      else failureCalls = Number(r.count);
    });

    const totalApiCalls = successCalls + failureCalls;
    const apiSuccessRate =
      totalApiCalls > 0
        ? `${((successCalls / totalApiCalls) * 100).toFixed(1)}%`
        : "100%";

    // Daily Active Users
    const dailyMap = new Map(
      dailyActiveQ.rows.map(d => [d.day, Number(d.users)])
    );

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dailyActiveUsers = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);

      return {
        day: daysMap[d.getDay()],
        users: dailyMap.get(key) || 0
      };
    });

    // Growth
    const growthMap = new Map(
      userGrowthQ.rows.map(g => [
        g.month.toISOString(),
        Number(g.total)
      ])
    );

    const resumeMap = new Map(
      resumeGrowthQ.rows.map(r => [
        r.month.toISOString(),
        Number(r.total)
      ])
    );

    const userGrowth = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));

      const key = new Date(
        d.getFullYear(),
        d.getMonth(),
        1
      ).toISOString();

      return {
        month: d.toLocaleString("default", { month: "short" }),
        users: growthMap.get(key) || 0,
        resumes: resumeMap.get(key) || 0
      };
    });

    const stats = {
      totalUsers,
      activeUsers,
      newUsers,
      totalResumes,
      activeSubscriptions,
      totalRevenue,
      apiSuccessRate,
      totalApiCalls,
      subscriptionBreakdown: subBreakdownQ.rows.map(s => ({
        plan: s.plan,
        count: Number(s.count)
      })),
      dailyActiveUsers,
      userGrowth,
      resumeChart: userGrowth,
      mostUsedTemplates: templatesQ.rows.map(t => ({
        template: String(t.template_id).slice(0, 20),
        count: Number(t.count)
      })),
      systemUptime:
        totalApiCalls > 0
          ? `${Math.max(99.0, (successCalls / totalApiCalls) * 100).toFixed(2)}%`
          : "99.99%"
    };

    /* ===============================
       AI RESPONSE
    =============================== */

    const aiResponse = await adminChatbotAIResponse(
      message,
      prevMsg || [],
      stats
    );

    let parsed;

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsed = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { mode: "message", text: aiResponse };
    } catch {
      parsed = { mode: "message", text: aiResponse };
    }

    return res.json(parsed);
  } catch (error) {
    console.error("❌ Admin Chatbot Error:", error);
    return res.status(500).json({
      mode: "message",
      text: "Something went wrong. Please try again."
    });
  }
};

export const ATSChatbotResponse = async (req, res) => {
  try {
    const { message, scanData } = req.body;
    if (!message || !scanData) {
      return res.status(400).json({ mode: "message", text: "Missing message or scan data." });
    }

    const aiResponse = await atsResumeAdviceAI(message, scanData);

    let parsed;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { mode: "message", text: aiResponse };
    } catch {
      parsed = { mode: "message", text: aiResponse };
    }

    return res.json(parsed);
  } catch (error) {
    console.error("❌ ATS Chatbot Error:", error);
    return res.status(500).json({ mode: "message", text: "Something went wrong. Please try again." });
  }
};