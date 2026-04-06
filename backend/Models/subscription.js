import { pool } from "../config/postgresdb.js";

class Subscription {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.plan_id = data.plan_id;
    this.status = data.status;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.auto_renew = data.auto_renew;
    this.cancelled_at = data.cancelled_at;
    this.payment_id = data.payment_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create subscription
  static async create(subscriptionData) {
    const { 
      user_id, 
      plan_id, 
      status = 'active',
      start_date,
      end_date,
      auto_renew = true,
      payment_id 
    } = subscriptionData;
    
    const query = `
      INSERT INTO subscriptions (
        user_id, plan_id, status, start_date, end_date, 
        auto_renew, payment_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        user_id, plan_id, status, start_date, end_date,
        auto_renew, payment_id
      ]);
      return new Subscription(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  // Static method to find subscription by ID
  static async findById(id) {
    const query = `
      SELECT s.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration, 
             pl.price as plan_price, pl.features as plan_features
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN plans pl ON s.plan_id = pl.id
      WHERE s.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const subscriptionData = result.rows[0];
      // Parse JSON fields if they exist
      if (subscriptionData.plan_features) {
        subscriptionData.plan_features = JSON.parse(subscriptionData.plan_features);
      }
      
      return new Subscription(subscriptionData);
    } catch (error) {
      throw new Error(`Failed to find subscription by ID: ${error.message}`);
    }
  }

  // Static method to get active subscription by user
  static async getActiveByUserId(userId) {
    const query = `
      SELECT s.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration, 
             pl.price as plan_price, pl.features as plan_features
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN plans pl ON s.plan_id = pl.id
      WHERE s.user_id = $1 AND s.status = 'active' AND s.end_date > NOW()
      ORDER BY s.created_at DESC
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const subscriptionData = result.rows[0];
      // Parse JSON fields if they exist
      if (subscriptionData.plan_features) {
        subscriptionData.plan_features = JSON.parse(subscriptionData.plan_features);
      }
      
      return new Subscription(subscriptionData);
    } catch (error) {
      throw new Error(`Failed to get active subscription by user: ${error.message}`);
    }
  }

  // Static method to get all subscriptions by user
  static async getByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT s.*, pl.name as plan_name, pl.duration as plan_duration, 
             pl.price as plan_price, pl.features as plan_features
      FROM subscriptions s
      LEFT JOIN plans pl ON s.plan_id = pl.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows.map(row => {
        // Parse JSON fields if they exist
        if (row.plan_features) {
          row.plan_features = JSON.parse(row.plan_features);
        }
        return new Subscription(row);
      });
    } catch (error) {
      throw new Error(`Failed to get subscriptions by user: ${error.message}`);
    }
  }

  // Static method to update subscription status
  static async updateStatus(id, status, additionalData = {}) {
    const { end_date, cancelled_at, auto_renew } = additionalData;
    
    let query = `
      UPDATE subscriptions
      SET status = $1, updated_at = NOW()
    `;
    let params = [status];
    
    if (end_date) {
      query += `, end_date = $${params.length + 1}`;
      params.push(end_date);
    }
    
    if (cancelled_at) {
      query += `, cancelled_at = $${params.length + 1}`;
      params.push(cancelled_at);
    }
    
    if (auto_renew !== undefined) {
      query += `, auto_renew = $${params.length + 1}`;
      params.push(auto_renew);
    }
    
    query += ` WHERE id = $${params.length + 1} RETURNING *`;
    params.push(id);
    
    try {
      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        throw new Error('Subscription not found');
      }
      return new Subscription(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update subscription status: ${error.message}`);
    }
  }

  // Static method to cancel subscription
  static async cancel(id, userId) {
    const query = `
      UPDATE subscriptions
      SET status = 'cancelled', cancelled_at = NOW(), auto_renew = false, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, userId]);
      if (result.rows.length === 0) {
        throw new Error('Subscription not found or unauthorized');
      }
      return new Subscription(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  // Static method to renew subscription
  static async renew(id, userId, newEndDate) {
    const query = `
      UPDATE subscriptions
      SET status = 'active', end_date = $1, cancelled_at = NULL, updated_at = NOW()
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [newEndDate, id, userId]);
      if (result.rows.length === 0) {
        throw new Error('Subscription not found or unauthorized');
      }
      return new Subscription(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to renew subscription: ${error.message}`);
    }
  }

  // Static method to get expiring subscriptions
  static async getExpiringSubscriptions(days = 7) {
    const query = `
      SELECT s.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN plans pl ON s.plan_id = pl.id
      WHERE s.status = 'active' 
        AND s.end_date <= NOW() + INTERVAL '${days} days'
        AND s.end_date > NOW()
        AND s.auto_renew = true
      ORDER BY s.end_date ASC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows.map(row => new Subscription(row));
    } catch (error) {
      throw new Error(`Failed to get expiring subscriptions: ${error.message}`);
    }
  }

  // Static method to get expired subscriptions
  static async getExpiredSubscriptions() {
    const query = `
      SELECT s.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN plans pl ON s.plan_id = pl.id
      WHERE s.status = 'active' AND s.end_date <= NOW()
      ORDER BY s.end_date ASC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows.map(row => new Subscription(row));
    } catch (error) {
      throw new Error(`Failed to get expired subscriptions: ${error.message}`);
    }
  }

  // Static method to get subscription statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_subscriptions,
        COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_subscriptions,
        COUNT(CASE WHEN auto_renew = true THEN 1 END) as auto_renew_enabled,
        COUNT(CASE WHEN end_date <= NOW() AND status = 'active' THEN 1 END) as expired_but_active
      FROM subscriptions
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get subscription statistics: ${error.message}`);
    }
  }

  // Static method to delete subscription
  static async delete(id, userId) {
    const query = `
      DELETE FROM subscriptions
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, userId]);
      if (result.rows.length === 0) {
        throw new Error('Subscription not found or unauthorized');
      }
      return new Subscription(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }
  }

  // Instance method to update subscription
  async update(subscriptionData) {
    const { status, end_date, cancelled_at, auto_renew } = subscriptionData;
    
    const updated = await Subscription.updateStatus(this.id, status, {
      end_date, cancelled_at, auto_renew
    });
    Object.assign(this, updated);
    return this;
  }

  // Instance method to cancel subscription
  async cancel() {
    const updated = await Subscription.cancel(this.id, this.user_id);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to renew subscription
  async renew(newEndDate) {
    const updated = await Subscription.renew(this.id, this.user_id, newEndDate);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to check if expired
  isExpired() {
    return new Date() > new Date(this.end_date);
  }

  // Instance method to check if expiring soon
  isExpiringSoon(days = 7) {
    const now = new Date();
    const endDate = new Date(this.end_date);
    const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= days && daysUntilExpiry > 0;
  }

  // Instance method to delete subscription
  async delete() {
    await Subscription.delete(this.id, this.user_id);
    return this;
  }

  // Instance method to convert to JSON
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      plan_id: this.plan_id,
      status: this.status,
      start_date: this.start_date,
      end_date: this.end_date,
      auto_renew: this.auto_renew,
      cancelled_at: this.cancelled_at,
      payment_id: this.payment_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      // Additional fields from joins
      user_email: this.user_email,
      user_name: this.user_name,
      plan_name: this.plan_name,
      plan_duration: this.plan_duration,
      plan_price: this.plan_price,
      plan_features: this.plan_features
    };
  }
}

export default Subscription;
