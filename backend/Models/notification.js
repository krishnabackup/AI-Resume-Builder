import { pool } from "../config/postgresdb.js";

class Notification {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.actor = data.actor;
    this.message = data.message;
    this.type = data.type;
    this.read = data.read;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create notification
  static async create(notificationData) {
    const { user_id, actor, message, type = 'info', read = false } = notificationData;
    
    const query = `
      INSERT INTO notifications (user_id, actor, message, type, read, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [user_id, actor, message, type, read]);
      return new Notification(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  // Static method to get notifications by user
  static async getByUserId(userId, actor = 'system') {
    const query = `
      SELECT *
      FROM notifications
      WHERE user_id = $1 AND actor = $2
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId, actor]);
      return result.rows.map(row => new Notification(row));
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  // Static method to mark notification as read
  static async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications
      SET read = true, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [notificationId, userId]);
      if (result.rows.length === 0) {
        throw new Error('Notification not found or unauthorized');
      }
      return new Notification(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  // Static method to mark all notifications as read for user
  static async markAllAsRead(userId, actor = 'system') {
    const query = `
      UPDATE notifications
      SET read = true, updated_at = NOW()
      WHERE user_id = $1 AND actor = $2 AND read = false
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [userId, actor]);
      return result.rows.map(row => new Notification(row));
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  // Static method to delete notification
  static async delete(notificationId, userId) {
    const query = `
      DELETE FROM notifications
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [notificationId, userId]);
      if (result.rows.length === 0) {
        throw new Error('Notification not found or unauthorized');
      }
      return new Notification(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  // Static method to get unread count
  static async getUnreadCount(userId, actor = 'system') {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND actor = $2 AND read = false
    `;
    
    try {
      const result = await pool.query(query, [userId, actor]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  // Instance method to save/update
  async save() {
    if (this.id) {
      // Update existing notification
      const query = `
        UPDATE notifications
        SET message = $1, type = $2, read = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;
      
      try {
        const result = await pool.query(query, [this.message, this.type, this.read, this.id]);
        return new Notification(result.rows[0]);
      } catch (error) {
        throw new Error(`Failed to update notification: ${error.message}`);
      }
    } else {
      // Create new notification
      const created = await Notification.create({
        user_id: this.user_id,
        actor: this.actor,
        message: this.message,
        type: this.type,
        read: this.read
      });
      return created;
    }
  }
}

export default Notification;
