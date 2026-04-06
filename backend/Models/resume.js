import { pool } from "../config/postgresdb.js";

class Resume {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.file_name = data.file_name;
    this.file_path = data.file_path;
    this.file_size = data.file_size;
    this.file_type = data.file_type;
    this.original_name = data.original_name;
    this.content_text = data.content_text;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create resume
  static async create(resumeData) {
    const { 
      user_id, 
      file_name, 
      file_path, 
      file_size, 
      file_type, 
      original_name, 
      content_text, 
      is_active = true 
    } = resumeData;
    
    const query = `
      INSERT INTO resumes (
        user_id, file_name, file_path, file_size, file_type, 
        original_name, content_text, is_active, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        user_id, file_name, file_path, file_size, file_type,
        original_name, content_text, is_active
      ]);
      return new Resume(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create resume: ${error.message}`);
    }
  }

  // Static method to find resume by ID
  static async findById(id) {
    const query = `
      SELECT r.*, u.email as user_email, u.username as user_name
      FROM resumes r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Resume(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to find resume by ID: ${error.message}`);
    }
  }

  // Static method to get resumes by user
  static async getByUserId(userId, limit = 10, offset = 0, activeOnly = true) {
    let query = `
      SELECT r.*, u.email as user_email, u.username as user_name
      FROM resumes r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1
    `;
    
    let params = [userId];
    
    if (activeOnly) {
      query += ` AND r.is_active = $${params.length + 1}`;
      params.push(true);
    }
    
    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    try {
      const result = await pool.query(query, params);
      return result.rows.map(row => new Resume(row));
    } catch (error) {
      throw new Error(`Failed to get resumes by user: ${error.message}`);
    }
  }

  // Static method to get active resume by user
  static async getActiveByUserId(userId) {
    const query = `
      SELECT r.*, u.email as user_email, u.username as user_name
      FROM resumes r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1 AND r.is_active = true
      ORDER BY r.created_at DESC
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Resume(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get active resume by user: ${error.message}`);
    }
  }

  // Static method to update resume
  static async update(id, resumeData) {
    const { 
      file_name, 
      file_path, 
      file_size, 
      file_type, 
      original_name, 
      content_text, 
      is_active 
    } = resumeData;
    
    let query = `
      UPDATE resumes
      SET updated_at = NOW()
    `;
    let params = [];
    
    if (file_name !== undefined) {
      query += `, file_name = $${params.length + 1}`;
      params.push(file_name);
    }
    
    if (file_path !== undefined) {
      query += `, file_path = $${params.length + 1}`;
      params.push(file_path);
    }
    
    if (file_size !== undefined) {
      query += `, file_size = $${params.length + 1}`;
      params.push(file_size);
    }
    
    if (file_type !== undefined) {
      query += `, file_type = $${params.length + 1}`;
      params.push(file_type);
    }
    
    if (original_name !== undefined) {
      query += `, original_name = $${params.length + 1}`;
      params.push(original_name);
    }
    
    if (content_text !== undefined) {
      query += `, content_text = $${params.length + 1}`;
      params.push(content_text);
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
        throw new Error('Resume not found');
      }
      return new Resume(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update resume: ${error.message}`);
    }
  }

  // Static method to set resume as active (deactivates others)
  static async setActive(id, userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Deactivate all other resumes for this user
      await client.query(
        'UPDATE resumes SET is_active = false, updated_at = NOW() WHERE user_id = $1 AND id != $2',
        [userId, id]
      );
      
      // Activate this resume
      const result = await client.query(
        'UPDATE resumes SET is_active = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      
      await client.query('COMMIT');
      
      if (result.rows.length === 0) {
        throw new Error('Resume not found or unauthorized');
      }
      
      return new Resume(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Failed to set active resume: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Static method to deactivate resume
  static async deactivate(id, userId) {
    const query = `
      UPDATE resumes
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, userId]);
      if (result.rows.length === 0) {
        throw new Error('Resume not found or unauthorized');
      }
      return new Resume(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to deactivate resume: ${error.message}`);
    }
  }

  // Static method to delete resume
  static async delete(id, userId) {
    const query = `
      DELETE FROM resumes
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, userId]);
      if (result.rows.length === 0) {
        throw new Error('Resume not found or unauthorized');
      }
      return new Resume(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to delete resume: ${error.message}`);
    }
  }

  // Static method to get resume count by user
  static async getCountByUserId(userId, activeOnly = true) {
    let query = `
      SELECT COUNT(*) as count
      FROM resumes
      WHERE user_id = $1
    `;
    
    let params = [userId];
    
    if (activeOnly) {
      query += ` AND is_active = $${params.length + 1}`;
      params.push(true);
    }
    
    try {
      const result = await pool.query(query, params);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to get resume count: ${error.message}`);
    }
  }

  // Static method to search resumes by content
  static async searchByContent(userId, searchTerm, limit = 10, offset = 0) {
    const query = `
      SELECT r.*, u.email as user_email, u.username as user_name
      FROM resumes r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1 
        AND r.is_active = true 
        AND (r.content_text ILIKE $2 OR r.original_name ILIKE $2)
      ORDER BY r.created_at DESC
      LIMIT $3 OFFSET $4
    `;
    
    try {
      const result = await pool.query(query, [userId, `%${searchTerm}%`, limit, offset]);
      return result.rows.map(row => new Resume(row));
    } catch (error) {
      throw new Error(`Failed to search resumes: ${error.message}`);
    }
  }

  // Static method to get resumes by date range
  static async getByDateRange(userId, startDate, endDate, limit = 10, offset = 0) {
    const query = `
      SELECT r.*, u.email as user_email, u.username as user_name
      FROM resumes r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1 
        AND r.created_at >= $2 
        AND r.created_at <= $3
      ORDER BY r.created_at DESC
      LIMIT $4 OFFSET $5
    `;
    
    try {
      const result = await pool.query(query, [userId, startDate, endDate, limit, offset]);
      return result.rows.map(row => new Resume(row));
    } catch (error) {
      throw new Error(`Failed to get resumes by date range: ${error.message}`);
    }
  }

  // Instance method to update resume
  async update(resumeData) {
    const updated = await Resume.update(this.id, resumeData);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to set as active
  async setActive() {
    const updated = await Resume.setActive(this.id, this.user_id);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to deactivate
  async deactivate() {
    const updated = await Resume.deactivate(this.id, this.user_id);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to delete resume
  async delete() {
    await Resume.delete(this.id, this.user_id);
    return this;
  }

  // Instance method to convert to JSON
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      file_name: this.file_name,
      file_path: this.file_path,
      file_size: this.file_size,
      file_type: this.file_type,
      original_name: this.original_name,
      content_text: this.content_text,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      // Additional fields from joins
      user_email: this.user_email,
      user_name: this.user_name
    };
  }
}

export default Resume;
