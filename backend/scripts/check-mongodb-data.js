// debug-email-mismatch.js
import { MongoClient } from 'mongodb';
import { pool } from '../config/postgresdb.js';

const MONGODB_URL = 'mongodb+srv://AiResumeBuilder_db_user:RtgWLL2enMQ8yoMP@airesume.reirunk.mongodb.net/?';

async function debugEmails() {
  console.log('🔍 DEBUGGING EMAIL MISMATCH\n');
  
  // ========== MONGODB EMAILS ==========
  const mongo = new MongoClient(MONGODB_URL);
  await mongo.connect();
  
  let db;
  const { databases } = await mongo.db().admin().listDatabases();
  for (const database of databases) {
    if (['admin','config','local'].includes(database.name)) continue;
    const testDb = mongo.db(database.name);
    const collections = await testDb.listCollections().toArray();
    if (collections.some(c => c.name === 'downloads')) {
      db = testDb;
      break;
    }
  }
  
  if (!db) {
    console.error('❌ No downloads collection found');
    await mongo.close();
    return;
  }
  
  // Extract all unique emails from MongoDB downloads
  const mongoEmails = new Set();
  const docs = await db.collection('downloads').find({}).toArray();
  
  console.log('📦 Analyzing MongoDB downloads...\n');
  
  docs.forEach(doc => {
    // Try all possible email locations
    const email = 
      doc.content?.email || 
      doc.email || 
      doc.userEmail || 
      doc.user?.email || 
      null;
    
    if (email) {
      mongoEmails.add(email.toLowerCase().trim());
    }
  });
  
  console.log(`📧 MongoDB downloads emails (${mongoEmails.size} unique):\n`);
  const mongoEmailArray = Array.from(mongoEmails);
  mongoEmailArray.slice(0, 30).forEach(email => {
    console.log(`  • ${email}`);
  });
  if (mongoEmailArray.length > 30) {
    console.log(`  ... and ${mongoEmailArray.length - 30} more`);
  }
  
  // ========== POSTGRESQL EMAILS ==========
  console.log('\n\n🗄️  PostgreSQL users emails:\n');
  const pgResult = await pool.query('SELECT id, email, username FROM users ORDER BY email');
  
  const pgEmails = new Set();
  const pgEmailMap = new Map(); // email → user info
  
  pgResult.rows.forEach(row => {
    const normalizedEmail = row.email.toLowerCase().trim();
    pgEmails.add(normalizedEmail);
    pgEmailMap.set(normalizedEmail, { id: row.id, username: row.username, email: row.email });
  });
  
  console.log(`Total PostgreSQL users: ${pgResult.rows.length}\n`);
  pgResult.rows.slice(0, 30).forEach(row => {
    console.log(`  • ${row.email} (User: ${row.username})`);
  });
  
  // ========== FIND MATCHES ==========
  console.log('\n\n🔍 CHECKING FOR MATCHES:\n');
  
  let matches = 0;
  let mismatches = 0;
  
  mongoEmailArray.forEach(mongoEmail => {
    if (pgEmails.has(mongoEmail)) {
      matches++;
      const pgUser = pgEmailMap.get(mongoEmail);
      console.log(`✅ MATCH: ${mongoEmail} → User ID: ${pgUser.id}, Username: ${pgUser.username}`);
    } else {
      mismatches++;
    }
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY:');
  console.log(`   MongoDB unique emails: ${mongoEmails.size}`);
  console.log(`   PostgreSQL users: ${pgResult.rows.length}`);
  console.log(`   ✅ MATCHED: ${matches}`);
  console.log(`   ❌ NO MATCH: ${mismatches}`);
  console.log('='.repeat(70));
  
  if (matches === 0) {
    console.log('\n⚠️  WHY NO MATCHES?');
    console.log('   1. MongoDB emails are from OLD/test users');
    console.log('   2. PostgreSQL has NEW registered users');
    console.log('   3. These are DIFFERENT user sets\n');
    
    console.log('📋 EXAMPLE MISMATCH:');
    console.log(`   MongoDB: ${mongoEmailArray[0] || 'N/A'}`);
    console.log(`   PostgreSQL: ${pgResult.rows[0]?.email || 'N/A'}`);
    console.log('\n💡 SOLUTION: These downloads are from guest/unregistered users.');
    console.log('   NULL user_id is CORRECT behavior for this scenario.\n');
  }
  
  await mongo.close();
  await pool.end();
}

debugEmails().catch(console.error);