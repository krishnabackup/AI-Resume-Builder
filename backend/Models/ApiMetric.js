import { pool } from "../config/postgresdb.js";

class ApiMetric {
  constructor(data) {
    this.id = data.id;
    this.endpoint = data.endpoint;
    this.method = data.method;
    this.status_code = data.status_code;
    this.response_time = data.response_time;
    this.user_id = data.user_id;
    this.ip_address = data.ip_address;
    this.user_agent = data.user_agent;
    this.request_size = data.request_size;
    this.response_size = data.response_size;
    this.error_message = data.error_message;
    this.created_at = data.created_at;
  }

  // Static method to create API metric
  static async create(metricData) {
    const { 
      endpoint, 
      method, 
      status_code, 
      response_time, 
      user_id = null, 
      ip_address, 
      user_agent, 
      request_size = null, 
      response_size = null, 
      error_message = null 
    } = metricData;
    
    const query = `
      INSERT INTO api_metrics (
        endpoint, method, status_code, response_time, user_id,
        ip_address, user_agent, request_size, response_size, 
        error_message, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        endpoint, method, status_code, response_time, user_id,
        ip_address, user_agent, request_size, response_size, error_message
      ]);
      return new ApiMetric(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create API metric: ${error.message}`);
    }
  }

  // Static method to get metrics by date range
  static async getByDateRange(startDate, endDate, filters = {}) {
    let query = `
      SELECT am.*, u.email as user_email, u.username as user_name
      FROM api_metrics am
      LEFT JOIN users u ON am.user_id = u.id
      WHERE am.created_at >= $1 AND am.created_at <= $2
    `;
    
    let params = [startDate, endDate];
    
    if (filters.endpoint) {
      query += ` AND am.endpoint = $${params.length + 1}`;
      params.push(filters.endpoint);
    }
    
    if (filters.method) {
      query += ` AND am.method = $${params.length + 1}`;
      params.push(filters.method);
    }
    
    if (filters.status_code) {
      query += ` AND am.status_code = $${params.length + 1}`;
      params.push(filters.status_code);
    }
    
    if (filters.user_id) {
      query += ` AND am.user_id = $${params.length + 1}`;
      params.push(filters.user_id);
    }
    
    if (filters.min_response_time) {
      query += ` AND am.response_time >= $${params.length + 1}`;
      params.push(filters.min_response_time);
    }
    
    if (filters.max_response_time) {
      query += ` AND am.response_time <= $${params.length + 1}`;
      params.push(filters.max_response_time);
    }
    
    if (filters.has_errors) {
      query += ` AND am.error_message IS NOT NULL`;
    }
    
    query += ` ORDER BY am.created_at DESC`;
    
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
      return result.rows.map(row => new ApiMetric(row));
    } catch (error) {
      throw new Error(`Failed to get API metrics: ${error.message}`);
    }
  }

  // Static method to get metrics by user
  static async getByUserId(userId, limit = 100, offset = 0) {
    const query = `
      SELECT am.*, u.email as user_email, u.username as user_name
      FROM api_metrics am
      LEFT JOIN users u ON am.user_id = u.id
      WHERE am.user_id = $1
      ORDER BY am.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows.map(row => new ApiMetric(row));
    } catch (error) {
      throw new Error(`Failed to get API metrics by user: ${error.message}`);
    }
  }

  // Static method to get metrics by endpoint
  static async getByEndpoint(endpoint, limit = 100, offset = 0) {
    const query = `
      SELECT am.*, u.email as user_email, u.username as user_name
      FROM api_metrics am
      LEFT JOIN users u ON am.user_id = u.id
      WHERE am.endpoint = $1
      ORDER BY am.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [endpoint, limit, offset]);
      return result.rows.map(row => new ApiMetric(row));
    } catch (error) {
      throw new Error(`Failed to get API metrics by endpoint: ${error.message}`);
    }
  }

  // Static method to get API statistics
  static async getStats(startDate, endDate, filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END) as success_requests,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_requests,
        AVG(response_time) as avg_response_time,
        MIN(response_time) as min_response_time,
        MAX(response_time) as max_response_time,
        AVG(request_size) as avg_request_size,
        AVG(response_size) as avg_response_size,
        COUNT(DISTINCT endpoint) as unique_endpoints,
        COUNT(DISTINCT user_id) as unique_users
      FROM api_metrics
      WHERE created_at >= $1 AND created_at <= $2
    `;
    
    let params = [startDate, endDate];
    
    if (filters.endpoint) {
      query += ` AND endpoint = $${params.length + 1}`;
      params.push(filters.endpoint);
    }
    
    if (filters.method) {
      query += ` AND method = $${params.length + 1}`;
      params.push(filters.method);
    }
    
    if (filters.user_id) {
      query += ` AND user_id = $${params.length + 1}`;
      params.push(filters.user_id);
    }
    
    try {
      const result = await pool.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get API statistics: ${error.message}`);
    }
  }

  // Static method to get hourly statistics
  static async getHourlyStats(startDate, endDate, filters = {}) {
    let query = `
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        COUNT(*) as requests,
        AVG(response_time) as avg_response_time,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as errors
      FROM api_metrics
      WHERE created_at >= $1 AND created_at <= $2
    `;
    
    let params = [startDate, endDate];
    
    if (filters.endpoint) {
      query += ` AND endpoint = $${params.length + 1}`;
      params.push(filters.endpoint);
    }
    
    if (filters.method) {
      query += ` AND method = $${params.length + 1}`;
      params.push(filters.method);
    }
    
    query += `
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY hour ASC
    `;
    
    try {
      const result = await pool.query(query, params);
      return result.rows.map(row => ({
        hour: row.hour,
        requests: parseInt(row.requests),
        avg_response_time: parseFloat(row.avg_response_time),
        errors: parseInt(row.errors)
      }));
    } catch (error) {
      throw new Error(`Failed to get hourly API statistics: ${error.message}`);
    }
  }

  // Static method to get endpoint statistics
  static async getEndpointStats(startDate, endDate, limit = 20) {
    const query = `
      SELECT 
        endpoint,
        COUNT(*) as requests,
        AVG(response_time) as avg_response_time,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as errors,
        COUNT(DISTINCT user_id) as unique_users
      FROM api_metrics
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY endpoint
      ORDER BY requests DESC
      LIMIT $3
    `;
    
    try {
      const result = await pool.query(query, [startDate, endDate, limit]);
      return result.rows.map(row => ({
        endpoint: row.endpoint,
        requests: parseInt(row.requests),
        avg_response_time: parseFloat(row.avg_response_time),
        errors: parseInt(row.errors),
        unique_users: parseInt(row.unique_users)
      }));
    } catch (error) {
      throw new Error(`Failed to get endpoint statistics: ${error.message}`);
    }
  }

  // Static method to get error metrics
  static async getErrorMetrics(startDate, endDate, limit = 50) {
    const query = `
      SELECT 
        endpoint,
        method,
        status_code,
        COUNT(*) as error_count,
        error_message,
        array_agg(DISTINCT user_id) as affected_users
      FROM api_metrics
      WHERE created_at >= $1 AND created_at <= $2 
        AND status_code >= 400
      GROUP BY endpoint, method, status_code, error_message
      ORDER BY error_count DESC
      LIMIT $3
    `;
    
    try {
      const result = await pool.query(query, [startDate, endDate, limit]);
      return result.rows.map(row => ({
        endpoint: row.endpoint,
        method: row.method,
        status_code: row.status_code,
        error_count: parseInt(row.error_count),
        error_message: row.error_message,
        affected_users: row.affected_users
      }));
    } catch (error) {
      throw new Error(`Failed to get error metrics: ${error.message}`);
    }
  }

  // Static method to get slow requests
  static async getSlowRequests(startDate, endDate, threshold = 1000, limit = 50) {
    const query = `
      SELECT am.*, u.email as user_email, u.username as user_name
      FROM api_metrics am
      LEFT JOIN users u ON am.user_id = u.id
      WHERE am.created_at >= $1 AND am.created_at <= $2 
        AND am.response_time > $3
      ORDER BY am.response_time DESC
      LIMIT $4
    `;
    
    try {
      const result = await pool.query(query, [startDate, endDate, threshold, limit]);
      return result.rows.map(row => new ApiMetric(row));
    } catch (error) {
      throw new Error(`Failed to get slow requests: ${error.message}`);
    }
  }

  // Static method to get user activity
  static async getUserActivity(startDate, endDate, limit = 20) {
    const query = `
      SELECT 
        u.id as user_id,
        u.email,
        u.username,
        COUNT(*) as requests,
        AVG(am.response_time) as avg_response_time,
        COUNT(DISTINCT am.endpoint) as unique_endpoints,
        MAX(am.created_at) as last_activity
      FROM api_metrics am
      LEFT JOIN users u ON am.user_id = u.id
      WHERE am.created_at >= $1 AND am.created_at <= $2
        AND am.user_id IS NOT NULL
      GROUP BY u.id, u.email, u.username
      ORDER BY requests DESC
      LIMIT $3
    `;
    
    try {
      const result = await pool.query(query, [startDate, endDate, limit]);
      return result.rows.map(row => ({
        user_id: row.user_id,
        email: row.email,
        username: row.username,
        requests: parseInt(row.requests),
        avg_response_time: parseFloat(row.avg_response_time),
        unique_endpoints: parseInt(row.unique_endpoints),
        last_activity: row.last_activity
      }));
    } catch (error) {
      throw new Error(`Failed to get user activity: ${error.message}`);
    }
  }

  // Static method to delete old metrics
  static async deleteOldMetrics(daysToKeep = 30) {
    const query = `
      DELETE FROM api_metrics
      WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
      RETURNING COUNT(*) as deleted_count
    `;
    
    try {
      const result = await pool.query(query);
      return parseInt(result.rows[0].deleted_count);
    } catch (error) {
      throw new Error(`Failed to delete old API metrics: ${error.message}`);
    }
  }

  // Static method to get metrics count
  static async getCount(filters = {}) {
    let query = `
      SELECT COUNT(*) as count
      FROM api_metrics
      WHERE 1=1
    `;
    
    let params = [];
    
    if (filters.startDate && filters.endDate) {
      query += ` AND created_at >= $${params.length + 1} AND created_at <= $${params.length + 2}`;
      params.push(filters.startDate, filters.endDate);
    }
    
    if (filters.endpoint) {
      query += ` AND endpoint = $${params.length + 1}`;
      params.push(filters.endpoint);
    }
    
    if (filters.method) {
      query += ` AND method = $${params.length + 1}`;
      params.push(filters.method);
    }
    
    if (filters.status_code) {
      query += ` AND status_code = $${params.length + 1}`;
      params.push(filters.status_code);
    }
    
    if (filters.user_id) {
      query += ` AND user_id = $${params.length + 1}`;
      params.push(filters.user_id);
    }
    
    try {
      const result = await pool.query(query, params);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to get API metrics count: ${error.message}`);
    }
  }

  // Instance method to convert to JSON
  toJSON() {
    return {
      id: this.id,
      endpoint: this.endpoint,
      method: this.method,
      status_code: this.status_code,
      response_time: this.response_time,
      user_id: this.user_id,
      ip_address: this.ip_address,
      user_agent: this.user_agent,
      request_size: this.request_size,
      response_size: this.response_size,
      error_message: this.error_message,
      created_at: this.created_at,
      // Additional fields from joins
      user_email: this.user_email,
      user_name: this.user_name
    };
  }
}

export default ApiMetric;
