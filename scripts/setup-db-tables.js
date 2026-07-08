const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 1. Manually parse .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals === -1) return;
    const key = trimmed.substring(0, firstEquals).trim();
    let val = trimmed.substring(firstEquals + 1).trim();
    // Remove wrapping quotes if any
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
}

// 2. Set up DB pool
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = `
-- ============================================================================
-- CLASS ROUTINES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS class_routines (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id BIGINT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE SET NULL,
    day_of_week VARCHAR(50) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_section_day_time UNIQUE(section_id, day_of_week, start_time)
);

DROP TRIGGER IF EXISTS update_class_routines_updated_at ON class_routines;
CREATE TRIGGER update_class_routines_updated_at
    BEFORE UPDATE ON class_routines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SYLLABUSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS syllabuses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    link TEXT NOT NULL,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_syllabuses_updated_at ON syllabuses;
CREATE TRIGGER update_syllabuses_updated_at
    BEFORE UPDATE ON syllabuses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function main() {
  console.log('Connecting to database and running table setup...');
  try {
    await pool.query(sql);
    console.log('Success: class_routines and syllabuses tables initialized successfully.');
  } catch (error) {
    console.error('Error initializing tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
