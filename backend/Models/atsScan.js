import { pool } from "../config/postgresdb.js";

class AtsScan {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.resume_file = data.resume_file;
    this.resume_text = data.resume_text;
    this.job_title = data.job_title;
    this.overall_score = data.overall_score;
    this.analysis_data = data.analysis_data;
    section_scores = data.section_scores;
    this.misspelled_words = data.misspelled_words;
    this.pronoun_analysis = data.pronoun_analysis;
    this.extracted_data = data.extracted_data;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create ATS scan
  static async create(scanData) {
    const { 
      user_id, 
      resume_file, 
      resume_text, 
      job_title, 
      overall_score, 
      analysis_data, 
      section_scores,
      misspelled_words, 
      pronoun_analysis, 
      extracted_data 
    } = scanData;
    
    const query = `
      INSERT INTO ats_scans (
        user_id, resume_file, resume_text, job_title, overall_score, 
        analysis_data, section_scores, misspelled_words, pronoun_analysis, 
        extracted_data, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        user_id, resume_file, resume_text, job_title, overall_score,
        JSON.stringify(analysis_data), JSON.stringify(section_scores),
        JSON.stringify(misspelled_words), JSON.stringify(pronoun_analysis),
        JSON.stringify(extracted_data)
      ]);
      return new AtsScan(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create ATS scan: ${error.message}`);
    }
  }

  // Static method to find scan by ID
  static async findById(id) {
    const query = `
      SELECT *
      FROM ats_scans
      WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      const scanData = result.rows[0];
      // Parse JSON fields
      scanData.analysis_data = scanData.analysis_data ? JSON.parse(scanData.analysis_data) : null;
      scanData.section_scores = scanData.section_scores ? JSON.parse(scanData.section_scores) : null;
      scanData.misspelled_words = scanData.misspelled_words ? JSON.parse(scanData.misspelled_words) : null;
      scanData.pronoun_analysis = scanData.pronoun_analysis ? JSON.parse(scanData.pronoun_analysis) : null;
      scanData.extracted_data = scanData.extracted_data ? JSON.parse(scanData.extracted_data) : null;
      
      return new AtsScan(scanData);
    } catch (error) {
      throw new Error(`Failed to find ATS scan by ID: ${error.message}`);
    }
  }

  // Static method to get scans by user
  static async getByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT *
      FROM ats_scans
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows.map(row => {
        // Parse JSON fields
        const scanData = {
          ...row,
          analysis_data: row.analysis_data ? JSON.parse(row.analysis_data) : null,
          section_scores: row.section_scores ? JSON.parse(row.section_scores) : null,
          misspelled_words: row.misspelled_words ? JSON.parse(row.misspelled_words) : null,
          pronoun_analysis: row.pronoun_analysis ? JSON.parse(row.pronoun_analysis) : null,
          extracted_data: row.extracted_data ? JSON.parse(row.extracted_data) : null
        };
        return new AtsScan(scanData);
      });
    } catch (error) {
      throw new Error(`Failed to get ATS scans by user: ${error.message}`);
    }
  }

  // Static method to get recent scans by user
  static async getRecentByUserId(userId, limit = 5) {
    return await AtsScan.getByUserId(userId, limit, 0);
  }

  // Static method to update scan
  static async update(id, scanData) {
    const { 
      overall_score, 
      analysis_data, 
      section_scores,
      misspelled_words, 
      pronoun_analysis, 
      extracted_data 
    } = scanData;
    
    const query = `
      UPDATE ats_scans
      SET overall_score = $1, analysis_data = $2, section_scores = $3,
          misspelled_words = $4, pronoun_analysis = $5, extracted_data = $6,
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        overall_score,
        JSON.stringify(analysis_data),
        JSON.stringify(section_scores),
        JSON.stringify(misspelled_words),
        JSON.stringify(pronoun_analysis),
        JSON.stringify(extracted_data),
        id
      ]);
      
      if (result.rows.length === 0) {
        throw new Error('ATS scan not found');
      }
      
      const updatedData = result.rows[0];
      // Parse JSON fields
      updatedData.analysis_data = updatedData.analysis_data ? JSON.parse(updatedData.analysis_data) : null;
      updatedData.section_scores = updatedData.section_scores ? JSON.parse(updatedData.section_scores) : null;
      updatedData.misspelled_words = updatedData.misspelled_words ? JSON.parse(updatedData.misspelled_words) : null;
      updatedData.pronoun_analysis = updatedData.pronoun_analysis ? JSON.parse(updatedData.pronoun_analysis) : null;
      updatedData.extracted_data = updatedData.extracted_data ? JSON.parse(updatedData.extracted_data) : null;
      
      return new AtsScan(updatedData);
    } catch (error) {
      throw new Error(`Failed to update ATS scan: ${error.message}`);
    }
  }

  // Static method to delete scan
  static async delete(id) {
    const query = `
      DELETE FROM ats_scans
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('ATS scan not found');
      }
      return new AtsScan(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to delete ATS scan: ${error.message}`);
    }
  }

  // Static method to get scan count by user
  static async getCountByUserId(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM ats_scans
      WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to get ATS scan count: ${error.message}`);
    }
  }

  // Static method to get average score by user
  static async getAverageScoreByUserId(userId) {
    const query = `
      SELECT AVG(overall_score) as average_score
      FROM ats_scans
      WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0].average_score ? parseFloat(result.rows[0].average_score) : 0;
    } catch (error) {
      throw new Error(`Failed to get average ATS score: ${error.message}`);
    }
  }

  // Static method to get latest scan by user
  static async getLatestByUserId(userId) {
    const query = `
      SELECT *
      FROM ats_scans
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const scanData = result.rows[0];
      // Parse JSON fields
      scanData.analysis_data = scanData.analysis_data ? JSON.parse(scanData.analysis_data) : null;
      scanData.section_scores = scanData.section_scores ? JSON.parse(scanData.section_scores) : null;
      scanData.misspelled_words = scanData.misspelled_words ? JSON.parse(scanData.misspelled_words) : null;
      scanData.pronoun_analysis = scanData.pronoun_analysis ? JSON.parse(scanData.pronoun_analysis) : null;
      scanData.extracted_data = scanData.extracted_data ? JSON.parse(scanData.extracted_data) : null;
      
      return new AtsScan(scanData);
    } catch (error) {
      throw new Error(`Failed to get latest ATS scan: ${error.message}`);
    }
  }

  // Instance method to update scan
  async update(scanData) {
    const updated = await AtsScan.update(this.id, scanData);
    Object.assign(this, updated);
    return this;
  }

  // Instance method to delete scan
  async delete() {
    await AtsScan.delete(this.id);
    return this;
  }

  // Instance method to convert to JSON
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      resume_file: this.resume_file,
      resume_text: this.resume_text,
      job_title: this.job_title,
      overall_score: this.overall_score,
      analysis_data: this.analysis_data,
      section_scores: this.section_scores,
      misspelled_words: this.misspelled_words,
      pronoun_analysis: this.pronoun_analysis,
      extracted_data: this.extracted_data,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default AtsScan;
