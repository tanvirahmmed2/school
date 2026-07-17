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
    console.log("Recreating student_attendances table in database...");
    
    // Drop old table
    await pool.query("DROP TABLE IF EXISTS student_attendances CASCADE;");

    // Create new table
    await pool.query(`
      CREATE TABLE student_attendances (
          id BIGSERIAL PRIMARY KEY,
          student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
          period_id BIGINT NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late')),
          remarks TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, date, subject_id, period_id)
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
