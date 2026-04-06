import { pool } from "../config/postgresdb.js";

class Download {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.template_id = data.template_id;
    this.file_name = data.file_name;
    this.file_path = data.file_path;
    this.file_size = data.file_size;
    this.file_type = data.file_type;
    this.download_count = data.download_count;
    this.last_downloaded_at = data.last_downloaded_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create download record
  static async create(downloadData) {
    const { 
      user_id, 
      template_id, 
      file_name, 
      file_path, 
      file_size, 
      file_type,
      download_count = 0 
    } = downloadData;
    
    const query = `
      INSERT INTO downloads (
        user_id, template_id, file_name, file_path, file_size, 
        file_type, download_count, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        user_id, template_id, file_name, file_path, file_size,
        file_type, download_count
      ]);
      return new Download(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create download record: ${error.message}`);
    }
  }

  // Static method to find download by ID
  static async findById(id) {
    const query = `
      SELECT d.*, u.email as user_email, u.username as user_name,
             t.name as template_name, t.category as template_category
      FROM downloads d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN templates t ON d.template_id = t.id
      WHERE d.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Download(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to find download by ID: ${error.message}`);
    }
  }

  // Static method to get downloads by user
  static async getByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT d.*, t.name as template_name, t.category as template_category,
             t.preview_url as template_preview_url
      FROM downloads d
      LEFT JOIN templates t ON d.template_id = t.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows.map(row => new Download(row));
    } catch (error) {
      throw new Error(`Failed to get downloads by user: ${error.message}`);
    }
  }

  // Static method to get downloads by template
  static async getByTemplateId(templateId, limit = 10, offset = 0) {
    const query = `
      SELECT d.*, u.email as user_email, u.username as user_name
      FROM downloads d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.template_id = $1
      ORDER BY d.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [templateId, limit, offset]);
      return result.rows.map(row => new Download(row));
    } catch (error) {
      throw new Error(`Failed to get downloads by template: ${error.message}`);
    }
  }

  // Static method to increment download count
  static async incrementDownloadCount(id) {
    const query = `
      UPDATE downloads
      SET download_count = download_count + 1, 
          last_downloaded_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('Download record not found');
      }
      return new Download(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to increment download count: ${error.message}`);
    }
  }

  // Static method to get download statistics
  static async getStats(startDate = null, endDate = null) {
    let query = `
      SELECT 
        COUNT(*) as total_downloads,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT template_id) as unique_templates,
        SUM(download_count) as total_download_count,
        AVG(download_count) as avg_downloads_per_file,
        COUNT(CASE WHEN last_downloaded_at >= NOW() - INTERVAL '7 days' THEN 1 END) as downloads_last_7_days
      FROM downloads
    `;
    
    let params = [];
    
    if (startDate && endDate) {
      query += ` WHERE created_at >= $1 AND created_at <= $2`;
      params.push(startDate, endDate);
    }
    
    try {
      const result = await pool.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get download statistics: ${error.message}`);
    }
  }

  // Static method to get popular templates by downloads
  static async getPopularTemplates(limit = 10, startDate = null, endDate = null) {
    let query = `
      SELECT 
        t.id as template_id,
        t.name as template_name,
        t.category as template_category,
        COUNT(d.id) as download_count,
        COUNT(DISTINCT d.user_id) as unique_downloaders,
        AVG(d.download_count) as avg_downloads_per_user
      FROM templates t
      LEFT JOIN downloads d ON t.id = d.template_id
    `;
    
    let params = [];
    
    if (startDate && endDate) {
      query += ` WHERE d.created_at >= $1 AND d.created_at <= $2`;
      params.push(startDate, endDate);
    }
    
    query += `
      GROUP BY t.id, t.name, t.category
      HAVING COUNT(d.id) > 0
      ORDER BY download_count DESC
      LIMIT $${params.length + 1}
    `;
    params.push(limit);
    
    try {
      const result = await pool.query(query, params);
      return result.rows.map(row => ({
        template_id: row.template_id,
        template_name: row.template_name,
        template_category: row.template_category,
        download_count: parseInt(row.download_count),
        unique_downloaders: parseInt(row.unique_downloaders),
        avg_downloads_per_user: parseFloat(row.avg_downloads_per_user)
      }));
    } catch (error) {
      throw new Error(`Failed to get popular templates: ${error.message}`);
    }
  }

  // Static method to get user download activity
  static async getUserActivity(userId, limit = 20) {
    const query = `
      SELECT 
        d.*,
        t.name as template_name,
        t.category as template_category,
        t.preview_url as template_preview_url
      FROM downloads d
      LEFT JOIN templates t ON d.template_id = t.id
      WHERE d.user_id = $1
      ORDER BY d.last_downloaded_at DESC NULLS LAST, d.created_at DESC
      LIMIT $2
    `;
    
    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows.map(row => new Download(row));
    } catch (error) {
      throw new Error(`Failed to get user download activity: ${error.message}`);
    }
  }

  // Static method to get recent downloads
  static async getRecentDownloads(limit = 10) {
    const query = `
      SELECT 
        d.*,
        u.email as user_email,
        u.username as user_name,
        t.name as template_name,
        t.category as template_category
      FROM downloads d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN templates t ON d.template_id = t.id
      ORDER BY d.last_downloaded_at DESC NULLS LAST, d.created_at DESC
      LIMIT $1
    `;
    
    try {
      const result = await pool.query(query, [limit]);
      return result.rows.map(row => new Download(row));
    } catch (error) {
      throw new Error(`Failed to get recent downloads: ${error.message}`);
    }
  }

  // Static method to get downloads by date range
  static async getByDateRange(startDate, endDate, filters = {}) {
    let query = `
      SELECT d.*, u.email as user_email, u.username as user_name,
             t.name as template_name, t.category as template_category
      FROM downloads d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN templates t ON d.template_id = t.id
      WHERE d.created_at >= $1 AND d.created_at <= $2
    `;
    
    let params = [startDate, endDate];
    
    if (filters.user_id) {
      query += ` AND d.user_id = $${params.length + 1}`;
      params.push(filters.user_id);
    }
    
    if (filters.template_id) {
      query += ` AND d.template_id = $${params.length + 1}`;
      params.push(filters.template_id);
    }
    
    if (filters.category) {
      query += ` AND t.category = $${params.length + 1}`;
      params.push(filters.category);
    }
    
    query += ` ORDER BY d.created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ` OFFSET $${params.length + 1}`;
        params.push(filters.offset);
      }
    }
    
    try {
      const result = await pool.query(query, params);
      return result.rows.map(row => new Download(row));
    } catch (error) {
      throw new Error(`Failed to get downloads by date range: ${error.message}`);
    }
  }

  // Static method to update download
  static async update(id, downloadData) {
    const { 
      file_name, 
      file_path, 
      file_size, 
      file_type,
      download_count 
    } = downloadData;
    
    let query = `
      UPDATE downloads
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
    
    if (download_count !== undefined) {
      query += `, download_count = $${params.length + 1}`;
      params.push(download_count);
    }
    
    query += ` WHERE id = $${params.length + 1} RETURNING *`;
    params.push(id);
    
    try {
      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        throw new Error('Download not found');
      }
      return new Download(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update download: ${error.message}`);
    }
  }

  // Static method to delete download
  static async delete(id, userId = null) {
    let query = `
      DELETE FROM downloads
      WHERE id = $1
    `;
    let params = [id];
    
    if (userId) {
      query += ` AND user_id = $${params.length + 1}`;
      params.push(userId);
    }
    
    query += ` RETURNING *`;
    
    try {
      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        throw new Error('Download not found or unauthorized');
      }
      return new Download(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to delete download: ${error.message}`);
    }
  }

  // Static method to get download count by user
  static async getCountByUserId(userId) {
    const query = `
      SELECT COUNT(*) as count, SUM(download_count) as total_downloads
      FROM downloads
      WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return {
        count: parseInt(result.rows[0].count),
        total_downloads: parseInt(result.rows[0].total_downloads) || 0
      };
    } catch (error) {
      throw new Error(`Failed to get download count by user: ${error.message}`);
    }
  }

  // Instance method to update download
  async update(downloadData) {
    const updated = await Download.update(this.id, downloadData);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to increment download count
  async incrementDownloadCount() {
    const updated = await Download.incrementDownloadCount(this.id);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to delete download
  async delete(userId = null) {
    await Download.delete(this.id, userId);
    return this;
  }

  // Instance method to convert to JSON
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      template_id: this.template_id,
      file_name: this.file_name,
      file_path: this.file_path,
      file_size: this.file_size,
      file_type: this.file_type,
      download_count: this.download_count,
      last_downloaded_at: this.last_downloaded_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
      // Additional fields from joins
      user_email: this.user_email,
      user_name: this.user_name,
      template_name: this.template_name,
      template_category: this.template_category,
      template_preview_url: this.template_preview_url
    };
  }
}

export default Download;
