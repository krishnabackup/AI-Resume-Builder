import { pool } from "../config/postgresdb.js";

class Payment {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.plan_id = data.plan_id;
    this.amount = data.amount;
    this.currency = data.currency;
    this.status = data.status;
    this.payment_method = data.payment_method;
    this.transaction_id = data.transaction_id;
    this.stripe_payment_intent_id = data.stripe_payment_intent_id;
    this.paid_at = data.paid_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create payment
  static async create(paymentData) {
    const { 
      user_id, 
      plan_id, 
      amount, 
      currency = 'USD', 
      status = 'pending',
      payment_method,
      transaction_id,
      stripe_payment_intent_id 
    } = paymentData;
    
    const query = `
      INSERT INTO payments (
        user_id, plan_id, amount, currency, status, payment_method, 
        transaction_id, stripe_payment_intent_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        user_id, plan_id, amount, currency, status, payment_method,
        transaction_id, stripe_payment_intent_id
      ]);
      return new Payment(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  // Static method to find payment by ID
  static async findById(id) {
    const query = `
      SELECT p.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration, pl.features as plan_features
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN plans pl ON p.plan_id = pl.id
      WHERE p.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const paymentData = result.rows[0];
      // Parse JSON fields if they exist
      if (paymentData.plan_features) {
        paymentData.plan_features = JSON.parse(paymentData.plan_features);
      }
      
      return new Payment(paymentData);
    } catch (error) {
      throw new Error(`Failed to find payment by ID: ${error.message}`);
    }
  }

  // Static method to find payment by transaction ID
  static async findByTransactionId(transactionId) {
    const query = `
      SELECT p.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration, pl.features as plan_features
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN plans pl ON p.plan_id = pl.id
      WHERE p.transaction_id = $1
    `;
    
    try {
      const result = await pool.query(query, [transactionId]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const paymentData = result.rows[0];
      // Parse JSON fields if they exist
      if (paymentData.plan_features) {
        paymentData.plan_features = JSON.parse(paymentData.plan_features);
      }
      
      return new Payment(paymentData);
    } catch (error) {
      throw new Error(`Failed to find payment by transaction ID: ${error.message}`);
    }
  }

  // Static method to find payment by Stripe payment intent ID
  static async findByStripePaymentIntentId(stripePaymentIntentId) {
    const query = `
      SELECT p.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration, pl.features as plan_features
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN plans pl ON p.plan_id = pl.id
      WHERE p.stripe_payment_intent_id = $1
    `;
    
    try {
      const result = await pool.query(query, [stripePaymentIntentId]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const paymentData = result.rows[0];
      // Parse JSON fields if they exist
      if (paymentData.plan_features) {
        paymentData.plan_features = JSON.parse(paymentData.plan_features);
      }
      
      return new Payment(paymentData);
    } catch (error) {
      throw new Error(`Failed to find payment by Stripe payment intent ID: ${error.message}`);
    }
  }

  // Static method to get payments by user
  static async getByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT p.*, pl.name as plan_name, pl.duration as plan_duration, pl.features as plan_features
      FROM payments p
      LEFT JOIN plans pl ON p.plan_id = pl.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows.map(row => {
        // Parse JSON fields if they exist
        if (row.plan_features) {
          row.plan_features = JSON.parse(row.plan_features);
        }
        return new Payment(row);
      });
    } catch (error) {
      throw new Error(`Failed to get payments by user: ${error.message}`);
    }
  }

  // Static method to update payment status
  static async updateStatus(id, status, additionalData = {}) {
    const { paid_at, transaction_id, stripe_payment_intent_id } = additionalData;
    
    let query = `
      UPDATE payments
      SET status = $1, updated_at = NOW()
    `;
    let params = [status];
    
    if (paid_at) {
      query += `, paid_at = $${params.length + 1}`;
      params.push(paid_at);
    }
    
    if (transaction_id) {
      query += `, transaction_id = $${params.length + 1}`;
      params.push(transaction_id);
    }
    
    if (stripe_payment_intent_id) {
      query += `, stripe_payment_intent_id = $${params.length + 1}`;
      params.push(stripe_payment_intent_id);
    }
    
    query += ` WHERE id = $${params.length + 1} RETURNING *`;
    params.push(id);
    
    try {
      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        throw new Error('Payment not found');
      }
      return new Payment(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  // Static method to get payment statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_payments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_payment_amount
      FROM payments
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get payment statistics: ${error.message}`);
    }
  }

  // Static method to get payments by date range
  static async getByDateRange(startDate, endDate, status = null) {
    let query = `
      SELECT p.*, u.email as user_email, u.username as user_name,
             pl.name as plan_name, pl.duration as plan_duration
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN plans pl ON p.plan_id = pl.id
      WHERE p.created_at >= $1 AND p.created_at <= $2
    `;
    let params = [startDate, endDate];
    
    if (status) {
      query += ` AND p.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    try {
      const result = await pool.query(query, params);
      return result.rows.map(row => new Payment(row));
    } catch (error) {
      throw new Error(`Failed to get payments by date range: ${error.message}`);
    }
  }

  // Static method to delete payment
  static async delete(id) {
    const query = `
      DELETE FROM payments
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('Payment not found');
      }
      return new Payment(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to delete payment: ${error.message}`);
    }
  }

  // Instance method to update payment
  async update(paymentData) {
    const { status, paid_at, transaction_id, stripe_payment_intent_id } = paymentData;
    
    const updated = await Payment.updateStatus(this.id, status, {
      paid_at, transaction_id, stripe_payment_intent_id
    });
    Object.assign(this, updated);
    return this;
  }

  // Instance method to mark as completed
  async markCompleted(additionalData = {}) {
    return await this.update({ 
      status: 'completed', 
      paid_at: new Date(), 
      ...additionalData 
    });
  }

  // Instance method to mark as failed
  async markFailed() {
    return await this.update({ status: 'failed' });
  }

  // Instance method to delete payment
  async delete() {
    await Payment.delete(this.id);
    return this;
  }

  // Instance method to convert to JSON
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      plan_id: this.plan_id,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      payment_method: this.payment_method,
      transaction_id: this.transaction_id,
      stripe_payment_intent_id: this.stripe_payment_intent_id,
      paid_at: this.paid_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
      // Additional fields from joins
      user_email: this.user_email,
      user_name: this.user_name,
      plan_name: this.plan_name,
      plan_duration: this.plan_duration,
      plan_features: this.plan_features
    };
  }
}

export default Payment;
