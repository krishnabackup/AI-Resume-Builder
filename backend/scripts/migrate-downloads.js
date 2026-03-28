// migrate-downloads.js
import { MongoClient } from 'mongodb';
import { pool } from '../config/postgresdb.js';

const MONGODB_URL = 'mongodb+srv://AiResumeBuilder_db_user:RtgWLL2enMQ8yoMP@airesume.reirunk.mongodb.net/?';

async function migrateDownloads() {
  try {
    console.log('🚀 Starting downloads migration (PostgreSQL users)...\n');
    
    const mongo = new MongoClient(MONGODB_URL);
    await mongo.connect();
    
    // 🔍 Find database with 'downloads' collection
    let db;
    const { databases } = await mongo.db().admin().listDatabases();
    for (const database of databases) {
      if (['admin','config','local'].includes(database.name)) continue;
      const testDb = mongo.db(database.name);
      const collections = await testDb.listCollections().toArray();
      if (collections.some(c => c.name === 'downloads')) {
        db = testDb;
        console.log(`✅ Found database: ${database.name}`);
        break;
      }
    }
    if (!db) {
      console.error('❌ "downloads" collection not found');
      await mongo.close();
      return;
    }
    
    // ================= STEP 1: Build PostgreSQL email → id Map =================
    console.log('📥 Building PostgreSQL email → id lookup map...');
    const pgUsers = await pool.query('SELECT id, email FROM users');
    const emailToUserId = new Map();
    
    for (const user of pgUsers.rows) {
      // Normalize email: lowercase + trim for reliable matching
      const normalizedEmail = user.email.toLowerCase().trim();
      emailToUserId.set(normalizedEmail, user.id);
    }
    console.log(`✅ Cached ${emailToUserId.size} PostgreSQL users\n`);
    
    // ================= STEP 2: Load MongoDB downloads =================
    console.log('📦 Loading MongoDB downloads...');
    const downloads = await db.collection('downloads').find({}).toArray();
    console.log(`📊 Total downloads to migrate: ${downloads.length}\n`);
    
    // ================= STEP 3: Migration Loop =================
    let success = 0, skipped = 0, matched = 0, noEmail = 0, emailNotFound = 0;
    
    // 🔧 Helper: Extract email from ANY possible location in doc
    function getEmail(doc) {
      if (doc.content?.email) return doc.content.email;  // ✅ Your structure
      if (doc.email) return doc.email;
      if (doc.userEmail) return doc.userEmail;
      if (doc.user?.email) return doc.user.email;
      return null;
    }
    
    // 🔧 Helper: Truncate strings for PostgreSQL VARCHAR limits
    const truncate = (str, max) => {
      if (!str) return null;
      const s = String(str);
      return s.length > max ? s.substring(0, max) : s;
    };
    
    console.log('🔄 Migrating downloads...\n');
    
    for (let i = 0; i < downloads.length; i++) {
      const doc = downloads[i];
      
      try {
        // 🔍 Step A: Extract email from MongoDB doc
        const email = getEmail(doc);
        const normalizedEmail = email ? email.toLowerCase().trim() : null;
        
        // 🔗 Step B: Lookup PostgreSQL user_id by email
        let pgUserId = null;
        
        if (normalizedEmail) {
          pgUserId = emailToUserId.get(normalizedEmail) || null;
          
          if (pgUserId) {
            matched++;  // ✅ Email found in PostgreSQL users
          } else {
            emailNotFound++;  // ⚠️ Email exists in MongoDB but NOT in PostgreSQL
            // Optional: Log first few mismatches for debugging
            if (emailNotFound <= 5) {
              console.log(`ℹ️  No PostgreSQL user for: ${normalizedEmail}`);
            }
          }
        } else {
          noEmail++;  // ❌ No email field found in this download doc
        }
        
        // 💾 Step C: Insert into PostgreSQL downloads table
        await pool.query(
          `INSERT INTO downloads 
           (user_id, name, type, action, format, html, views, size, download_date, created_at, template, mongodb_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (mongodb_id) DO NOTHING`,  // Avoid duplicates on re-run
          [
            pgUserId,                              // $1: UUID from PostgreSQL users (or NULL)
            truncate(doc.name, 500),               // $2: name
            truncate(doc.type, 100),               // $3: type
            truncate(doc.action || 'download', 50), // $4: action
            truncate(doc.format, 50),              // $5: format
            JSON.stringify(doc.content || {}),     // $6: html (store full content as JSON)
            typeof doc.views === 'number' ? doc.views : 1,  // $7: views (integer)
            typeof doc.size === 'number' ? doc.size : null, // $8: size (integer or NULL)
            doc.downloadDate || doc.createdAt || new Date(), // $9: download_date (timestamp)
            doc.createdAt || new Date(),           // $10: created_at (timestamp)
            truncate(doc.template, 100),           // $11: template
            doc._id?.toString?.() || null          // $12: mongodb_id (keep reference)
          ]
        );
        
        success++;
        
        // Progress indicator
        if ((i + 1) % 500 === 0) {
          console.log(`   📊 ${i + 1}/${downloads.length} (${Math.round((i+1)/downloads.length*100)}%)`);
        }
        
      } catch (err) {
        skipped++;
        if (skipped <= 10) {
          console.log(`⚠️ Skip #${i+1}: ${err.message.substring(0, 100)}`);
        }
      }
    }
    
    // ================= STEP 4: Summary =================
    console.log('\n' + '='.repeat(70));
    console.log(`✅ MIGRATION COMPLETE!`);
    console.log(`   ✓ Successfully inserted: ${success}`);
    console.log(`   ✗ Skipped (errors): ${skipped}`);
    console.log(`   🔗 Matched to PostgreSQL users: ${matched}`);
    console.log(`   ❓ No email in download doc: ${noEmail}`);
    console.log(`   👤 Email not in PostgreSQL users: ${emailNotFound}`);
    console.log(`   📊 Downloads with user_id: ${matched}`);
    console.log(`   📊 Downloads with NULL user_id: ${success - matched} (guest/unregistered)`);
    console.log('='.repeat(70));
    
    // 💡 Helpful tip
    if (matched === 0 && emailNotFound > 0) {
      console.log('\n💡 TIP: To get more matches, add missing emails to PostgreSQL users:');
      console.log(`   INSERT INTO users (id, email, username, ...) VALUES (gen_random_uuid(), 'hmeghana719@example.com', 'Meghana', ...);`);
    }
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error(err.stack);
  } finally {
    // 🔌 Cleanup connections
    await pool.end();
    console.log('\n🔌 Database connections closed');
  }
}

// 🚀 Run the migration
migrateDownloads();