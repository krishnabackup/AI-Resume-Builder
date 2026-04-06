import { pool } from "../config/postgresdb.js";
import bcrypt from "bcryptjs";

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.is_admin = data.is_admin;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create user
  static async create(userData) {
    const { username, email, password, is_admin = false, is_active = true } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password, is_admin, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [username, email, hashedPassword, is_admin, is_active]);
      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Static method to find user by email
  static async findByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = $1
    `;
    
    try {
      const result = await pool.query(query, [email]);
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  // Static method to find user by ID
  static async findById(id) {
    const query = `
      SELECT *
      FROM users
      WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  // Static method to update user
  static async update(id, userData) {
    const { username, email, password, is_admin, is_active } = userData;
    
    let query = `
      UPDATE users
      SET username = $1, email = $2, updated_at = NOW()
    `;
    let params = [username, email];
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = $${params.length + 1}`;
      params.push(hashedPassword);
    }
    
    if (is_admin !== undefined) {
      query += `, is_admin = $${params.length + 1}`;
      params.push(is_admin);
    }
    
    if (is_active !== undefined) {
      query += `, is_active = $${params.length + 1}`;
      params.push(is_active);
    }
    
    query += ` WHERE id = $${params.length + 1} RETURNING *`;
    params.push(id);
    
    try {
      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Static method to delete user
  static async delete(id) {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Static method to verify password
  static async verifyPassword(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    
    return user;
  }

  // Static method to get all users (admin only)
  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT id, username, email, is_admin, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    try {
      const result = await pool.query(query, [limit, offset]);
      return result.rows.map(row => new User(row));
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Static method to get user count
  static async getCount() {
    const query = `
      SELECT COUNT(*) as count
      FROM users
    `;
    
    try {
      const result = await pool.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to get user count: ${error.message}`);
    }
  }

  // Instance method to update user
  async update(userData) {
    const updated = await User.update(this.id, userData);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to delete user
  async delete() {
    await User.delete(this.id);
    return this;
  }

  // Instance method to convert to JSON (excluding password)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      is_admin: this.is_admin,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default User;
