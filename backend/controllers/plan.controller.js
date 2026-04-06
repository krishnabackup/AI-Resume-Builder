import { pool } from "../config/postgresdb.js";

const mapPlan = (row) => ({
  _id: row.id,
  id: row.id,
  planId: Number(row.plan_id),
  name: row.name,
  badge: row.badge,
  price: Number(row.price),
  active: row.active,
  description: row.description,
  features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
  order: row.display_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

// -------------------- GET ALL PLANS --------------------
export const getAllPlans = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM plans ORDER BY display_order ASC");
    const plans = result.rows.map(mapPlan);
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans", error: error.message });
  }
};

// -------------------- GET SINGLE PLAN --------------------
export const getPlanById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM plans WHERE plan_id = $1 LIMIT 1", [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(mapPlan(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plan", error: error.message });
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
        return res.status(400).json({ message: "Each plan must have planId, name, and price" });
      }
      
      const notUniqueRes = await pool.query("SELECT id FROM plans WHERE name = $1 AND plan_id != $2 LIMIT 1", [plan.name, plan.planId]);
      if (notUniqueRes.rows.length > 0) return res.status(409).json({ message: `Plan name cannot be same , Change Plan Name : ${plan.name}` });
    }

    // Delete missing plans dynamically
    const incomingPlanIds = plans.map(p => p.planId);
    if (incomingPlanIds.length > 0) {
      const placeholders = incomingPlanIds.map((_, i) => `$${i+1}`).join(', ');
      await pool.query(`DELETE FROM plans WHERE plan_id NOT IN (${placeholders})`, incomingPlanIds);
    } else {
      await pool.query("DELETE FROM plans");
    }

    // Update each plan
    const updatedPlans = [];
    for (const plan of plans) {
      const checkRes = await pool.query("SELECT id FROM plans WHERE plan_id = $1 LIMIT 1", [plan.planId]);
      let savedRow;

      if (checkRes.rows.length > 0) {
        const updateRes = await pool.query(`
          UPDATE plans SET 
            name = $1, badge = $2, price = $3, active = $4, display_order = $5, 
            description = $6, features = $7, updated_at = NOW()
          WHERE plan_id = $8 RETURNING *
        `, [
          plan.name, plan.badge || null, plan.price, plan.active, plan.order, 
          plan.description || null, JSON.stringify(plan.features || []), plan.planId
        ]);
        savedRow = updateRes.rows[0];
      } else {
        const insertRes = await pool.query(`
          INSERT INTO plans (plan_id, name, badge, price, active, display_order, description, features, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *
        `, [
          plan.planId, plan.name, plan.badge || null, plan.price, plan.active, plan.order, 
          plan.description || null, JSON.stringify(plan.features || [])
        ]);
        savedRow = insertRes.rows[0];
      }
      updatedPlans.push(mapPlan(savedRow));
    }

    res.status(200).json({
      message: "Plans updated successfully",
      plans: updatedPlans.sort((a,b) => a.order - b.order),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update plans", error: error.message });
  }
};

// -------------------- UPDATE SINGLE PLAN --------------------
export const updatePlan = async (req, res) => {
  try {
    const { name, badge, price, active, description, features } = req.body;
    const planId = req.params.id;
    
    const currRes = await pool.query("SELECT * FROM plans WHERE plan_id = $1 LIMIT 1", [planId]);
    if (currRes.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }
    const curr = currRes.rows[0];
    
    const updateRes = await pool.query(`
      UPDATE plans SET 
        name = $1, badge = $2, price = $3, active = $4, description = $5, features = $6, updated_at = NOW()
      WHERE plan_id = $7 RETURNING *
    `, [
      name || curr.name, 
      badge !== undefined ? badge : curr.badge, 
      price !== undefined ? price : curr.price, 
      active !== undefined ? active : curr.active, 
      description || curr.description, 
      features ? JSON.stringify(features) : curr.features, 
      planId
    ]);

    res.status(200).json({
      message: "Plan updated successfully",
      plan: mapPlan(updateRes.rows[0]),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update plan", error: error.message });
  }
};

// -------------------- INITIALIZE DEFAULT PLANS --------------------
export const initializePlans = async (req, res) => {
  try {
    const countRes = await pool.query("SELECT COUNT(*) FROM plans");
    const existingPlans = parseInt(countRes.rows[0].count, 10);

    if (existingPlans > 0) {
      return res.status(400).json({ message: "Plans already initialized", count: existingPlans });
    }

    const defaultPlans = [
      {
        planId: 1,
        name: "Free",
        price: 0,
        active: true,
        order: 1,
        description: "For testing & basic usage",
        features: ["1 Resume Template", "Limited AI Suggestions", "Watermark on Resume", "Community Support"],
      },
      {
        planId: 2,
        name: "Pro",
        price: 299,
        active: true,
        order: 2,
        description: "Best for students & professionals",
        features: ["Unlimited Templates", "Full AI Resume Writing", "No Watermark", "PDF & DOCX Export", "Priority Support"],
      },
      {
        planId: 3,
        name: "Ultra Pro",
        price: 999,
        active: true,
        order: 3,
        description: "One-time payment",
        features: ["All Pro Features", "Lifetime Access", "Priority Support", "Future Updates"],
      },
    ];

    const createdPlans = [];
    for (const plan of defaultPlans) {
      const insertRes = await pool.query(`
        INSERT INTO plans (plan_id, name, badge, price, active, display_order, description, features, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *
      `, [
        plan.planId, plan.name, null, plan.price, plan.active, plan.order, 
        plan.description, JSON.stringify(plan.features)
      ]);
      createdPlans.push(mapPlan(insertRes.rows[0]));
    }

    res.status(201).json({
      message: "Default plans initialized successfully",
      plans: createdPlans,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to initialize plans", error: error.message });
  }
};