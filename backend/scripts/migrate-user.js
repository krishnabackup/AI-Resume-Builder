// migrate-users.js - Migrate MongoDB users → PostgreSQL
import { MongoClient } from 'mongodb';
import { pool } from '../config/postgresdb.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const MONGODB_URL = 'mongodb+srv://AiResumeBuilder_db_user:RtgWLL2enMQ8yoMP@airesume.reirunk.mongodb.net/?';

async function migrateUsers() {
  console.log('🚀 Starting users migration...');
  
  const mongo = new MongoClient(MONGODB_URL);
  await mongo.connect();
  
  // Find database
  let db;
  const { databases } = await mongo.db().admin().listDatabases();
  for (const database of databases) {
    if (['admin','config','local'].includes(database.name)) continue;
    const testDb = mongo.db(database.name);
    const collections = await testDb.listCollections().toArray();
    if (collections.some(c => c.name === 'users')) {
      db = testDb;
      console.log(`✅ Found database: ${database.name}`);
      break;
    }
  }
  if (!db) { 
    console.error('❌ "users" collection not found'); 
    await mongo.close(); 
    return; 
  }
  
  console.log('📦 Loading MongoDB users...');
  const mongoUsers = await db.collection('users').find({}).toArray();
  console.log(`📊 Total MongoDB users: ${mongoUsers.length}`);
  
  const pg = await pool.connect();
  
  // 🗂️ Track mapping: MongoDB _id → PostgreSQL id
  const idMapping = new Map();
  
  let success = 0, skipped = 0, duplicate = 0;
  
  for (const mongoUser of mongoUsers) {
    try {
      const email = mongoUser.email?.toLowerCase()?.trim();
      if (!email) {
        skipped++;
        continue;
      }
      
      // Check if user already exists in PostgreSQL
      const existing = await pg.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rowCount > 0) {
        // Map MongoDB _id to existing PostgreSQL id
        idMapping.set(mongoUser._id.toString(), existing.rows[0].id);
        duplicate++;
        continue;
      }
      
      // Create new PostgreSQL user
      const newUserId = crypto.randomUUID();
      const hashedPass = mongoUser.password?.startsWith('$2') 
        ? mongoUser.password  // Already hashed
        : await bcrypt.hash(mongoUser.password || 'temp123', 10);
      
      await pg.query(
        `INSERT INTO users (id, username, email, password, is_admin, is_active, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (email) DO NOTHING`,
        [
          newUserId,
          mongoUser.username || mongoUser.name || email.split('@')[0],
          email,
          hashedPass,
          false,  // is_admin
          true,   // is_active
          mongoUser.createdAt || new Date(),
          mongoUser.updatedAt || new Date()
        ]
      );
      
      // Also create user_profile
      await pg.query(
        `INSERT INTO user_profiles (id, user_id, full_name, phone, location, bio, github, linkedin) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          crypto.randomUUID(),
          newUserId,
          mongoUser.fullName || mongoUser.name || '',
          mongoUser.phone || '',
          mongoUser.location || mongoUser.address || '',
          mongoUser.bio || '',
          mongoUser.github || '',
          mongoUser.linkedin || ''
        ]
      );
      
      // Store mapping for downloads migration
      idMapping.set(mongoUser._id.toString(), newUserId);
      success++;
      
    } catch(e) {
      skipped++;
      if (skipped <= 5) console.log(`⚠️ Skip user:`, e.message.substring(0, 80));
    }
  }
  
  // 💾 Save mapping to file for downloads migration
  const fs = await import('fs');
  fs.writeFileSync(
    './user-id-mapping.json',
    JSON.stringify(Object.fromEntries(idMapping), null, 2)
  );
  console.log(`💾 Saved mapping to user-id-mapping.json`);
  
  pg.release();
  await mongo.close();
  await pool.end();
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ USERS MIGRATION COMPLETE!`);
  console.log(`   ✓ New users created: ${success}`);
  console.log(`   ↩️  Already existed: ${duplicate}`);
  console.log(`   ✗ Skipped: ${skipped}`);
  console.log(`   🗂️  ID mapping saved for downloads migration`);
  console.log('='.repeat(60));
}

migrateUsers().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});