-- Database: PostgreSQL

-- 1. Ensure `users` has the mongodb_id for migration linking
ALTER TABLE users ADD COLUMN IF NOT EXISTS mongodb_id VARCHAR(24);

-- 2. Modify `resumes` table
-- Convert id from integer to uuid, and user_id from varchar to uuid.
-- Note: This is written carefully to avoid dropping the table. If there is data that cannot be cast to UUID, it will throw an error.
DO $$ 
BEGIN
    -- Check if resumes.id is not already UUID
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'resumes' AND column_name = 'id' AND data_type != 'uuid'
    ) THEN
        ALTER TABLE resumes DROP CONSTRAINT IF EXISTS resumes_pkey CASCADE;
        ALTER TABLE resumes ALTER COLUMN id DROP DEFAULT;
        ALTER TABLE resumes ALTER COLUMN id SET DATA TYPE UUID USING (gen_random_uuid());
        ALTER TABLE resumes ALTER COLUMN id SET DEFAULT gen_random_uuid();
        ALTER TABLE resumes ADD PRIMARY KEY (id);
    END IF;

    -- Check if user_id is not already UUID
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'resumes' AND column_name = 'user_id' AND data_type != 'uuid'
    ) THEN
        -- Safely cast empty or matching strings to UUID
        ALTER TABLE resumes ALTER COLUMN user_id SET DATA TYPE UUID USING (NULLIF(user_id, '')::UUID);
    END IF;

    -- Add mongodb_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'resumes' AND column_name = 'mongodb_id'
    ) THEN
        ALTER TABLE resumes ADD COLUMN mongodb_id VARCHAR(24);
    END IF;
END $$;

-- 3. Modify `ats_results` into `ats_scores`
-- Rename table if ats_scores doesn't exist but ats_results does
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ats_results') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ats_scores') THEN
        ALTER TABLE ats_results RENAME TO ats_scores;
    END IF;
END $$;

-- Now alter ats_scores
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ats_scores') THEN
        
        -- Convert id to UUID
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ats_scores' AND column_name = 'id' AND data_type != 'uuid') THEN
            ALTER TABLE ats_scores DROP CONSTRAINT IF EXISTS ats_results_pkey CASCADE;
            ALTER TABLE ats_scores DROP CONSTRAINT IF EXISTS ats_scores_pkey CASCADE;
            ALTER TABLE ats_scores ALTER COLUMN id DROP DEFAULT;
            ALTER TABLE ats_scores ALTER COLUMN id SET DATA TYPE UUID USING (gen_random_uuid());
            ALTER TABLE ats_scores ALTER COLUMN id SET DEFAULT gen_random_uuid();
            ALTER TABLE ats_scores ADD PRIMARY KEY (id);
        END IF;

        -- Convert user_id to UUID
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ats_scores' AND column_name = 'user_id' AND data_type != 'uuid') THEN
            ALTER TABLE ats_scores ALTER COLUMN user_id SET DATA TYPE UUID USING (NULLIF(user_id, '')::UUID);
        END IF;

        -- Rename resume_id to cv_id and change to UUID
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ats_scores' AND column_name = 'resume_id') THEN
            ALTER TABLE ats_scores RENAME COLUMN resume_id TO cv_id;
        END IF;

        -- If cv_id is still integer, make it UUID
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ats_scores' AND column_name = 'cv_id' AND data_type != 'uuid') THEN
            ALTER TABLE ats_scores ALTER COLUMN cv_id SET DATA TYPE UUID USING NULL;
        END IF;

        -- Add job_title, mongodb_id
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ats_scores' AND column_name = 'job_title') THEN
            ALTER TABLE ats_scores ADD COLUMN job_title VARCHAR(255);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ats_scores' AND column_name = 'mongodb_id') THEN
            ALTER TABLE ats_scores ADD COLUMN mongodb_id VARCHAR(24);
        END IF;
        
        -- Add template_id
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ats_scores' AND column_name = 'template_id') THEN
            ALTER TABLE ats_scores ADD COLUMN template_id VARCHAR(255);
        END IF;
    END IF;
END $$;


-- 4. Create `cvs` table (ResumeProfile in MongoDB)
CREATE TABLE IF NOT EXISTS cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    headline VARCHAR(255),
    summary TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mongodb_id VARCHAR(24)
);

-- 5. Create `cover_letters` table
CREATE TABLE IF NOT EXISTS cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    template_id VARCHAR(100) DEFAULT 'professional',
    document_title VARCHAR(255) DEFAULT '',
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mongodb_id VARCHAR(24)
);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_mongodb_id ON users(mongodb_id);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_mongodb_id ON resumes(mongodb_id);

CREATE INDEX IF NOT EXISTS idx_ats_scores_user_id ON ats_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_scores_mongodb_id ON ats_scores(mongodb_id);

CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_mongodb_id ON cvs(mongodb_id);

CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_mongodb_id ON cover_letters(mongodb_id);

-- 7. Create `downloads` table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(100),
    action VARCHAR(50),
    format VARCHAR(50),
    html TEXT,
    views INTEGER DEFAULT 0,
    size INTEGER,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    template VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mongodb_id VARCHAR(24)
);

CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);

