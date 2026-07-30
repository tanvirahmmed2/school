import fs from 'fs';
import path from 'path';
import pg from 'pg';
const { Pool } = pg;

const envPath = path.resolve(process.cwd(), '.env');
const envVars = {};
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
      envVars[key] = value.trim();
    }
  });
}

const pool = new Pool({
  user: envVars.PG_USER,
  password: envVars.PG_PASSWORD,
  host: envVars.PG_HOST,
  port: envVars.PG_PORT ? parseInt(envVars.PG_PORT, 10) : 5432,
  database: envVars.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('Connecting to PostgreSQL database for student document tables migration...');

  // 1. student_testimonials
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_testimonials (
      id BIGSERIAL PRIMARY KEY,
      testimonial_no VARCHAR(100) UNIQUE NOT NULL,
      student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      academic_character VARCHAR(100) DEFAULT 'Excellent',
      conduct VARCHAR(100) DEFAULT 'Good',
      remarks TEXT,
      issued_by_type VARCHAR(50) NOT NULL,
      issued_by_id BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✔ student_testimonials table created/verified.');

  // 2. student_transfer_certificates
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_transfer_certificates (
      id BIGSERIAL PRIMARY KEY,
      tc_number VARCHAR(100) UNIQUE NOT NULL,
      student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      reason_for_leaving TEXT NOT NULL,
      destination_school VARCHAR(255),
      conduct VARCHAR(100) DEFAULT 'Good',
      last_class_attended VARCHAR(100),
      promoted_to_class VARCHAR(100),
      fee_cleared BOOLEAN DEFAULT TRUE,
      remarks TEXT,
      issued_by_type VARCHAR(50) NOT NULL,
      issued_by_id BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✔ student_transfer_certificates table created/verified.');

  // 3. transferred_students
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transferred_students (
      id BIGSERIAL PRIMARY KEY,
      student_id BIGINT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      tc_id BIGINT REFERENCES student_transfer_certificates(id) ON DELETE SET NULL,
      transfer_date DATE NOT NULL DEFAULT CURRENT_DATE,
      reason TEXT,
      destination_school VARCHAR(255),
      previous_class VARCHAR(100),
      previous_roll INT,
      archived_by_type VARCHAR(50),
      archived_by_id BIGINT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✔ transferred_students table created/verified.');

  // 4. student_admit_cards
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_admit_cards (
      id BIGSERIAL PRIMARY KEY,
      admit_card_no VARCHAR(100) UNIQUE NOT NULL,
      student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      fee_cleared BOOLEAN DEFAULT TRUE,
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      issued_by_type VARCHAR(50) NOT NULL,
      issued_by_id BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✔ student_admit_cards table created/verified.');

  // 5. student_id_cards
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_id_cards (
      id BIGSERIAL PRIMARY KEY,
      id_card_no VARCHAR(100) UNIQUE NOT NULL,
      student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      expiry_date DATE,
      status VARCHAR(50) DEFAULT 'active',
      issued_by_type VARCHAR(50) NOT NULL,
      issued_by_id BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✔ student_id_cards table created/verified.');

  // 6. student_transcripts
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_transcripts (
      id BIGSERIAL PRIMARY KEY,
      transcript_no VARCHAR(100) UNIQUE NOT NULL,
      student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      exam_id BIGINT REFERENCES exams(id) ON DELETE SET NULL,
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      remarks TEXT,
      issued_by_type VARCHAR(50) NOT NULL,
      issued_by_id BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✔ student_transcripts table created/verified.');

  // Ensure status column exists on students table if not present
  await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';");
  console.log('✔ students status column verified.');

  console.log('🎉 Student Document tables migration finished successfully!');
  pool.end();
}

runMigration().catch(console.error);
