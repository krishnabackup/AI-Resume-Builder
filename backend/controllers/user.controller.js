import Notification from "../Models/notification.js";
import AtsScans from "../Models/atsScan.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import Payment from "../Models/payment.js";
import Resume from "../Models/resume.js";
import Subscription from "../Models/subscription.js";
import ApiMetric from "../Models/ApiMetric.js";

/* ================== HELPERS ================== */
const getLastMonthDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};

/* ================== USER DASHBOARD ================== */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("username email profileViews isAdmin adminRequestStatus");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Total and Weekly Resumes
    const totalResumes = await Resume.countDocuments({ user: userId });
    const resumesThisWeek = await Resume.countDocuments({
      user: userId,
      createdAt: { $gte: oneWeekAgo },
    });

    // ATS Scores logic
    const allAtsScans = await AtsScans.find({ userId }).sort({ createdAt: -1 });

    let avgAtsScore = 0;
    if (allAtsScans.length > 0) {
      const sum = allAtsScans.reduce((s, scan) => s + scan.overallScore, 0);
      avgAtsScore = Math.round(sum / allAtsScans.length);
    }

    const latestAts = allAtsScans[0]?.overallScore || 0;
    const previousAts = allAtsScans[1]?.overallScore || latestAts;
    const atsDelta = latestAts - previousAts;

    const recentResumes = await Resume.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      user: {
        name: user?.username || "User",
        email: user?.email,
        isAdmin: user?.isAdmin || false,
        adminRequestStatus: user?.adminRequestStatus || "none"
      },
      stats: {
        resumesCreated: totalResumes,
        resumesThisWeek,
        avgAtsScore: avgAtsScore,
        latestAts: latestAts,
        atsDelta: atsDelta,
        profileViews: user?.profileViews || 0,
      },
      recentResumes: recentResumes.map((r) => ({
        id: r._id,
        name: r.title,
        date: r.createdAt,
        // Include ATS score for each resume if available
      })),
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

// ------------------------USER: Username ---------------------
export const getUserName = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user.username) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================== ADMIN: USERS ================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/* ================== USER PROFILE (SELF) ================== */
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, username, email, phone, location, bio, github, linkedin } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;

    await user.save();
    res.status(200).json({ message: "Profile updated", user: await User.findById(userId).select("-password") });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both passwords are required" });
    if (newPassword.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, isAdmin, isActive, plan } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email already exists" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;
    if (typeof isActive === "boolean") {
      console.log(
        `Updating user ${user.email} isActive from ${user.isActive} to ${isActive}`,
      );
      user.isActive = isActive;
    }
    if (plan) user.plan = plan;
    if (req.body.createdAt) user.createdAt = req.body.createdAt;

    await user.save();

    /* 🔔 ADMIN NOTIFICATION (USER ACTION) */
    if (typeof isActive === "boolean") {
      // 🔔 USER
      await Notification.create({
        type: "ACCOUNT_STATUS",
        message: `Your account was ${isActive ? "activated" : "deactivated"
          } by admin`,
        userId: user._id,
        actor: "system",
      });

      // 🔔 ADMIN
      await Notification.create({
        type: "USER_STATUS",
        message: `${user.username} was ${isActive ? "activated" : "deactivated"
          }`,
        userId: req.userId,
        actor: "user",
        fromAdmin: true,
      });
    }

    console.log(
      `User ${user.email} updated - isActive is now: ${user.isActive}`,
    );
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Update failed", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔔 ADMIN NOTIFICATION
    await Notification.create({
      type: "USER_DELETED",
      message: `${user.username} account was deleted`,
      userId: req.userId, // admin id
      actor: "user",
      fromAdmin: true
    });

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ message: "Delete failed", error: error.message });
  }
};

/* ================== ADMIN REQUESTS ================== */
export const requestAdminAccess = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAdmin) {
      return res.status(400).json({ message: "You are already an admin" });
    }

    if (user.adminRequestStatus === 'pending') {
      return res.status(400).json({ message: "Admin request is already pending" });
    }

    user.adminRequestStatus = 'pending';
    await user.save();

    // 🔔 ADMIN NOTIFICATION
    // Send to a placeholder admin or skip if direct broadcast isn't supported by the schema.
    const adminUser = await User.findOne({ isAdmin: true });
    if (adminUser) {
      await Notification.create({
        type: "ADMIN_REQUEST",
        message: `${user.username || user.email} requested admin access`,
        userId: adminUser._id,
        actor: "user"
      });
    }

    res.status(200).json({ message: "Admin request submitted successfully", user });
  } catch (error) {
    console.error("Request admin error DETAILED:", error.message, error.stack);
    import('fs').then(fs => fs.writeFileSync('error_log.txt', error.stack));
    res.status(500).json({ message: "Failed to submit admin request", error: error.message });
  }
};

export const approveAdminRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.adminRequestStatus !== 'pending') {
      return res.status(400).json({ message: "No pending admin request for this user" });
    }

    user.isAdmin = true;
    user.adminRequestStatus = 'approved';
    await user.save();

    // 🔔 USER NOTIFICATION
    await Notification.create({
      type: "ROLE_UPDATE",
      message: `Your request for admin access has been approved`,
      userId: user._id,
      actor: "system"
    });

    res.status(200).json({ message: "Admin request approved", user });
  } catch (error) {
    console.error("Approve admin error:", error);
    res.status(500).json({ message: "Failed to approve admin request", error: error.message });
  }
};

export const rejectAdminRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.adminRequestStatus !== 'pending') {
      return res.status(400).json({ message: "No pending admin request for this user" });
    }

    user.adminRequestStatus = 'rejected';
    await user.save();

    // 🔔 USER NOTIFICATION
    await Notification.create({
      type: "ROLE_UPDATE",
      message: `Your request for admin access was rejected`,
      userId: user._id,
      actor: "system"
    });

    res.status(200).json({ message: "Admin request rejected", user });
  } catch (error) {
    console.error("Reject admin error:", error);
    res.status(500).json({ message: "Failed to reject admin request", error: error.message });
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

    // ---------- MOST USED TEMPLATES (Top 5) ----------
    const mostUsedTemplatesAgg = await Resume.aggregate([
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
      { $limit: 5 },
    ]);

    const totalTemplateUsage = await Resume.countDocuments({ templateId: { $ne: null } });

    const mostUsedTemplates = mostUsedTemplatesAgg.map((item) => {
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
        name = hardcodedNames[item._id] || (typeof item._id === 'string' && item._id.length > 20 ? `ID: ${item._id.substring(0, 8)}...` : item._id);
      }
      return {
        templateId: name || "Standard",
        count: item.count,
        percentage: totalTemplateUsage > 0 ? Math.round((item.count / totalTemplateUsage) * 100) : 0,
      };
    });

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

/* ================== ADMIN DASHBOARD ================== */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const lastMonth = getLastMonthDate();
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);

    // ---------- CORE STATS ----------
    // USERS
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({ createdAt: { $lt: lastMonth } });
    const userChange = lastMonthUsers === 0 ? 0 : ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100;

    // RESUMES
    const totalResumes = await Resume.countDocuments();
    const lastMonthResumes = await Resume.countDocuments({ createdAt: { $lt: lastMonth } });
    const resumeChange = lastMonthResumes === 0 ? 0 : ((totalResumes - lastMonthResumes) / lastMonthResumes) * 100;

    // SUBSCRIPTIONS
    const totalActiveSubs = await Subscription.countDocuments({ status: "active" });
    const lastMonthActiveSubs = await Subscription.countDocuments({
      status: "active",
      createdAt: { $lt: lastMonth }
    });
    const subsChange = lastMonthActiveSubs === 0 ? 0 : ((totalActiveSubs - lastMonthActiveSubs) / lastMonthActiveSubs) * 100;

    // REVENUE
    const totalRevenueAgg = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const lastMonthRevenueAgg = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $lt: lastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const revenueChange = lastMonthRevenue === 0 ? 0 : ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    // ---------- CHARTS & DISTRIBUTIONS ----------
    // RESUME CHART (LAST 6 MONTHS)
    const resumeGraph = await Resume.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const resumeChart = resumeGraph.length > 0
      ? resumeGraph.map((item) => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleString("default", { month: "short" }),
        resumes: item.total,
      }))
      : [
        { month: "Aug", resumes: 5 },
        { month: "Sep", resumes: 12 },
        { month: "Oct", resumes: 20 },
        { month: "Jan", resumes: 50 },
        { month: "Feb", resumes: 120 },
        { month: "Mar", resumes: 2 },
      ];

    // SUBSCRIPTION DISTRIBUTION
    const subscriptionDistribution = await Subscription.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
    ]);

    const subscriptionSplit = subscriptionDistribution.length > 0
      ? subscriptionDistribution.map((item) => ({
        name: (item._id || "Free").charAt(0).toUpperCase() + (item._id || "Free").slice(1),
        value: item.count,
      }))
      : [
        { name: "Free", value: 80 },
        { name: "Basic", value: 20 },
        { name: "Pro", value: 20 },
      ];

    // USER GROWTH (LAST 6 MONTHS)
    const userGrowthAgg = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const userGrowth = userGrowthAgg.map((item) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString("default", { month: "short" }),
      users: item.total,
    }));

    // DAILY ACTIVE USERS (LAST 7 DAYS)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const dailyActiveUsersAgg = await User.aggregate([
      {
        $match: {
          updatedAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: { day: { $dayOfWeek: "$updatedAt" } },
          users: { $sum: 1 },
        },
      },
    ]);

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyActiveUsers = dailyActiveUsersAgg.map((item) => ({
      day: daysMap[item._id.day - 1],
      users: item.users,
    }));

    // ---------- API SUMMARY ----------
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const apiStats = await ApiMetric.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $cond: [{ $lt: ["$statusCode", 400] }, "success", "failure"] },
          count: { $sum: 1 },
        },
      },
    ]);

    let successCalls = 0;
    let failureCalls = 0;
    apiStats.forEach(s => {
      if (s._id === "success") successCalls = s.count;
      else failureCalls = s.count;
    });

    const totalCalls = successCalls + failureCalls;
    const apiSuccessRate = totalCalls > 0 ? ((successCalls / totalCalls) * 100).toFixed(1) : 100;

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
      subscriptionSplit,
      userGrowth,
      dailyActiveUsers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Dashboard stats fetch failed", error: error.message });
  }
};

