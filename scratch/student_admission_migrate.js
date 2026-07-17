const pg = require('pg');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
});

const pool = new pg.Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: parseInt(env.PG_PORT, 10) || 5432,
  database: env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    console.log("Running student system database migrations...");
    
    // 1. Alter students table
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS verification_code VARCHAR(255);");
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS verification_code_expires TIMESTAMPTZ;");
    
    // 2. Alter admissions table
    await pool.query("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS is_result_published BOOLEAN DEFAULT FALSE;");
    
    // 3. Create accepted_admissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accepted_admissions (
          id BIGSERIAL PRIMARY KEY,
          student_admission_id BIGINT UNIQUE NOT NULL REFERENCES student_admissions(id) ON DELETE CASCADE,
          admission_id BIGINT NOT NULL REFERENCES admissions(id) ON DELETE CASCADE,
          class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          applicant_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

main();
