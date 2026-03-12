import PageView from "../Models/PageView.js";

export const trackPageView = async (req, res) => {
  try {
    const { page, route } = req.body;

    if (!page || !route) {
      return res.status(400).json({
        success: false,
        message: "'page' and 'route' are required",
      });
    }

    const pageView = await PageView.create({
      page,
      route,
      userId: req.userId || null,
    });

    return res.status(201).json({
      success: true,
      message: "Page view tracked",
      data: {
        id: pageView._id,
      },
    });
  } catch (error) {
    console.error("Track Page View Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to track page view",
      error: error.message,
    });
  }
};

export const getTopViewedPages = async (req, res) => {
  try {
    const topPagesAgg = await PageView.aggregate([
      {
        $group: {
          _id: "$page",
          views: { $sum: 1 },
          uniqueUserSet: { $addToSet: "$userId" },
        },
      },
      {
        $addFields: {
          uniqueUsers: {
            $size: {
              $filter: {
                input: "$uniqueUserSet",
                as: "uid",
                cond: { $ne: ["$$uid", null] },
              },
            },
          },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          page: "$_id",
          views: 1,
          uniqueUsers: 1,
        },
      },
    ]);

    return res.status(200).json(topPagesAgg);
  } catch (error) {
    console.error("Get Top Viewed Pages Error:", error);
    return res.status(500).json({
      message: "Failed to fetch top viewed pages",
      error: error.message,
    });
  }
};
