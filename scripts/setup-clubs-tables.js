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
-- Create CLUB EDITORS table
CREATE TABLE IF NOT EXISTS club_editors (
    id BIGSERIAL PRIMARY KEY,
    club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_club_staff UNIQUE(club_id, staff_id)
);

DROP TRIGGER IF EXISTS update_club_editors_updated_at ON club_editors;
CREATE TRIGGER update_club_editors_updated_at
    BEFORE UPDATE ON club_editors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create CLUB MEMBERS table
CREATE TABLE IF NOT EXISTS club_members (
    id BIGSERIAL PRIMARY KEY,
    club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_club_student UNIQUE(club_id, student_id)
);

DROP TRIGGER IF EXISTS update_club_members_updated_at ON club_members;
CREATE TRIGGER update_club_members_updated_at
    BEFORE UPDATE ON club_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function main() {
  console.log('Creating club assignments database tables...');
  try {
    await pool.query(sql);
    console.log('Success: Clubs database tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
