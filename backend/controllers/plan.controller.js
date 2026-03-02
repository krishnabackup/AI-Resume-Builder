
import Plan from "../Models/Plan.js";

// -------------------- GET ALL PLANS --------------------
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ planId: 1 });
    res.status(200).json(plans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch plans", error: error.message });
  }
};

// -------------------- GET SINGLE PLAN --------------------
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findOne({ planId: req.params.id });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch plan", error: error.message });
  }
};

// -------------------- UPDATE ALL PLANS (Admin) --------------------
export const updateAllPlans = async (req, res) => {
  try {
    const plans = req.body;

    if (!Array.isArray(plans)) {
      return res.status(400).json({ message: "Invalid data format. Expected an array of plans." });
    }

    // Validate each plan
    for (const plan of plans) {
      if (!plan.planId || !plan.name || plan.price === undefined) {
        return res.status(400).json({
          message: "Each plan must have planId, name, and price"
        });
      }
    }

    // Update each plan
    const updatePromises = plans.map(async (plan) => {
      return await Plan.findOneAndUpdate(
        { planId: plan.planId },
        {
          name: plan.name,
          price: plan.price,
          active: plan.active,
          description: plan.description,
          features: plan.features,
        },
        { new: true, upsert: true } // Create if doesn't exist
      );
    });

    const updatedPlans = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Plans updated successfully",
      plans: updatedPlans,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update plans", error: error.message });
  }
};

// -------------------- UPDATE SINGLE PLAN --------------------
export const updatePlan = async (req, res) => {
  try {
    const { name, price, active, description, features } = req.body;
    const planId = req.params.id;

    const plan = await Plan.findOne({ planId });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update fields
    if (name) plan.name = name;
    if (price !== undefined) plan.price = price;
    if (active !== undefined) plan.active = active;
    if (description) plan.description = description;
    if (features) plan.features = features;

    await plan.save();

    res.status(200).json({
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update plan", error: error.message });
  }
};

// -------------------- INITIALIZE DEFAULT PLANS --------------------
export const initializePlans = async (req, res) => {
  try {
    // Check if plans already exist
    const existingPlans = await Plan.countDocuments();

    if (existingPlans > 0) {
      return res.status(400).json({
        message: "Plans already initialized",
        count: existingPlans
      });
    }

    const defaultPlans = [
      {
        planId: 1,
        name: "Free",
        price: 0,
        active: true,
        description: "For testing & basic usage",
        features: [
          "1 Resume Template",
          "Limited AI Suggestions",
          "Watermark on Resume",
          "Community Support",
        ],
      },
      {
        planId: 2,
        name: "Pro",
        price: 299,
        active: true,
        description: "Best for students & professionals",
        features: [
          "Unlimited Templates",
          "Full AI Resume Writing",
          "No Watermark",
          "PDF & DOCX Export",
          "Priority Support",
        ],
      },
      {
        planId: 3,
        name: "Ultra Pro",
        price: 999,
        active: true,
        description: "One-time payment",
        features: [
          "All Pro Features",
          "Lifetime Access",
          "Priority Support",
          "Future Updates",
        ],
      },
    ];

    const createdPlans = await Plan.insertMany(defaultPlans);

    res.status(201).json({
      message: "Default plans initialized successfully",
      plans: createdPlans,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to initialize plans", error: error.message });
  }
};