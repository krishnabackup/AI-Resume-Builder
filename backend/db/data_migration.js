import { MongoClient } from 'mongodb';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function migrate() {
    console.log("Starting Migration...");
    
    // Connect to Mongo
    const mongoClient = new MongoClient(process.env.MONGO_DB_URL);
    await mongoClient.connect();
    const db = mongoClient.db();
    console.log("Connected to MongoDB.");

    // Connect to PG
    const pgClient = new Client({ connectionString: process.env.POSTGRESQL_URI });
    await pgClient.connect();
    console.log("Connected to PostgreSQL.");

    const usersCol = db.collection('users');
    const resumesCol = db.collection('resumes');
    const resumeProfilesCol = db.collection('resumeprofiles');
    const coverLettersCol = db.collection('coverletters');
    const atsScansCol = db.collection('atsscans');

    // 1. Migrate Users
    console.log("Migrating users...");
    const users = await usersCol.find({}).toArray();
    for (const u of users) {
        const m_id = u._id.toString();
        const existing = await pgClient.query('SELECT id FROM users WHERE email = $1 OR mongodb_id = $2', [u.email, m_id]);
        
        let pgUserId;
        if (existing.rows.length > 0) {
            pgUserId = existing.rows[0].id;
            await pgClient.query(`
                UPDATE users SET 
                    username = $1, password = $2, is_admin = $3, plan = $4, is_active = $5,
                    full_name = $6, phone = $7, location = $8, bio = $9, github = $10, linkedin = $11, mongodb_id = $12
                WHERE id = $13
            `, [
                u.username || '', u.password, u.isAdmin || false, u.plan || 'Free', u.isActive ?? true,
                u.fullName || '', u.phone || '', u.location || '', u.bio || '', u.github || '', u.linkedin || '',
                m_id, pgUserId
            ]);
        } else {
            const res = await pgClient.query(`
                INSERT INTO users (username, email, password, is_admin, plan, is_active, full_name, phone, location, bio, github, linkedin, mongodb_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id
            `, [
                u.username || '', u.email, u.password, u.isAdmin || false, u.plan || 'Free', u.isActive ?? true,
                u.fullName || '', u.phone || '', u.location || '', u.bio || '', u.github || '', u.linkedin || '',
                m_id
            ]);
            pgUserId = res.rows[0].id;
        }
    }
    
    const usersMap = {};
    const allUsers = await pgClient.query('SELECT id, mongodb_id FROM users WHERE mongodb_id IS NOT NULL');
    for (let row of allUsers.rows) {
        usersMap[row.mongodb_id] = row.id;
    }

    // 2. Migrate Resumes
    console.log("Migrating resumes...");
    const resumes = await resumesCol.find({}).toArray();
    for (const r of resumes) {
        const m_id = r._id.toString();
        const user_id = usersMap[r.user?.toString()];
        if (!user_id) continue;
        
        const data = {
            fullName: r.fullName,
            email: r.email,
            linkedin: r.linkedin,
            location: r.location,
            phone: r.phone,
            summary: r.summary,
            website: r.website,
            education: r.education || [],
            experience: r.experience || [],
            projects: r.projects || [],
            skills: r.skills || {},
            certifications: r.certifications || [],
            templateId: r.templateId?.toString()
        };

        const existing = await pgClient.query('SELECT id FROM resumes WHERE mongodb_id = $1', [m_id]);
        if (existing.rows.length > 0) {
            await pgClient.query(`UPDATE resumes SET user_id = $1, data = $2 WHERE mongodb_id = $3`, [user_id, data, m_id]);
        } else {
            await pgClient.query(`INSERT INTO resumes (user_id, mongodb_id, data) VALUES ($1, $2, $3)`, [user_id, m_id, data]);
        }
    }

    // 3. Migrate CVs
    console.log("Migrating CVs...");
    const cvs = await resumeProfilesCol.find({}).toArray();
    for (const cv of cvs) {
        const m_id = cv._id.toString();
        const user_id = usersMap[cv.userId?.toString()];
        if (!user_id) continue;
        
        const existing = await pgClient.query('SELECT id FROM cvs WHERE mongodb_id = $1', [m_id]);
        if (existing.rows.length > 0) {
            await pgClient.query(`
                UPDATE cvs SET title=$1, name=$2, headline=$3, summary=$4, email=$5, phone=$6, location=$7, experience=$8, education=$9, skills=$10, projects=$11
                WHERE mongodb_id = $12
            `, [cv.title||'', cv.name||'', cv.headline||'', cv.summary||'', cv.email||'', cv.phone||'', cv.location||'', JSON.stringify(cv.experience||[]), JSON.stringify(cv.education||[]), JSON.stringify(cv.skills||[]), JSON.stringify(cv.projects||[]), m_id]);
        } else {
            await pgClient.query(`
                INSERT INTO cvs (user_id, title, name, headline, summary, email, phone, location, experience, education, skills, projects, mongodb_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `, [user_id, cv.title||'', cv.name||'', cv.headline||'', cv.summary||'', cv.email||'', cv.phone||'', cv.location||'', JSON.stringify(cv.experience||[]), JSON.stringify(cv.education||[]), JSON.stringify(cv.skills||[]), JSON.stringify(cv.projects||[]), m_id]);
        }
    }

    // 4. Migrate Cover Letters
    console.log("Migrating cover letters...");
    const cls = await coverLettersCol.find({}).toArray();
    for (const cl of cls) {
        const m_id = cl._id.toString();
        const user_id = usersMap[cl.user?.toString()];
        if (!user_id) continue;

        const existing = await pgClient.query('SELECT id FROM cover_letters WHERE user_id = $1 OR mongodb_id = $2', [user_id, m_id]);
        if (existing.rows.length > 0) {
            await pgClient.query(`UPDATE cover_letters SET template_id=$1, document_title=$2, content=$3, mongodb_id=$4 WHERE id=$5`,
                [cl.templateId||'professional', cl.documentTitle||'', JSON.stringify(cl.content||{}), m_id, existing.rows[0].id]
            );
        } else {
             await pgClient.query(`INSERT INTO cover_letters (user_id, template_id, document_title, content, mongodb_id) VALUES ($1, $2, $3, $4, $5)`,
                [user_id, cl.templateId||'professional', cl.documentTitle||'', JSON.stringify(cl.content||{}), m_id]
            );
        }
    }

    // 5. Migrate ATS Scans
    console.log("Migrating ATS scores...");
    const ats = await atsScansCol.find({}).toArray();
    for (const a of ats) {
        const m_id = a._id.toString();
        const user_id = usersMap[a.userId?.toString()];
        if (!user_id) continue;
        
        let cvIdMapped = null;
        if (a.resumeprofileId) {
            const fetchCv = await pgClient.query('SELECT id FROM cvs WHERE mongodb_id = $1', [a.resumeprofileId.toString()]);
            if (fetchCv.rows.length > 0) cvIdMapped = fetchCv.rows[0].id;
        }

        const data = {
            sectionScores: a.sectionScores || [],
            matchedKeywords: a.matchedKeywords || [],
            missingKeywords: a.missingKeywords || []
        };

        const existing = await pgClient.query('SELECT id FROM ats_scores WHERE mongodb_id = $1', [m_id]);
        if (existing.rows.length > 0) {
             await pgClient.query(`UPDATE ats_scores SET user_id=$1, cv_id=$2, template_id=$3, job_title=$4, score=$5, feedback=$6 WHERE mongodb_id=$7`,
                 [user_id, cvIdMapped, a.templateId||'', a.jobTitle||'', a.overallScore||0, JSON.stringify(data), m_id]
             );
        } else {
             await pgClient.query(`INSERT INTO ats_scores (user_id, cv_id, template_id, job_title, score, feedback, mongodb_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                 [user_id, cvIdMapped, a.templateId||'', a.jobTitle||'', a.overallScore||0, JSON.stringify(data), m_id]
             );
        }
    }

    console.log("Migration finished successfully.");
    await mongoClient.close();
    await pgClient.end();
}

migrate().catch(console.error);
