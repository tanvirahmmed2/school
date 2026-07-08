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
-- Create MARKS table
CREATE TABLE IF NOT EXISTS marks (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    total_marks DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    remarks VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_exam_subject UNIQUE(student_id, exam_id, subject_id)
);

DROP TRIGGER IF EXISTS update_marks_updated_at ON marks;
CREATE TRIGGER update_marks_updated_at
    BEFORE UPDATE ON marks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RESULTS table
CREATE TABLE IF NOT EXISTS results (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    gpa DECIMAL(3, 2) DEFAULT 0.00,
    grade VARCHAR(10),
    total_marks DECIMAL(6, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Pass',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_exam UNIQUE(student_id, exam_id)
);

DROP TRIGGER IF EXISTS update_results_updated_at ON results;
CREATE TRIGGER update_results_updated_at
    BEFORE UPDATE ON results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RESULT PUBLISH table
CREATE TABLE IF NOT EXISTS result_publish (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT UNIQUE NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_result_publish_updated_at ON result_publish;
CREATE TRIGGER update_result_publish_updated_at
    BEFORE UPDATE ON result_publish
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create TRANSCRIPTS table
CREATE TABLE IF NOT EXISTS transcripts (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    gpa DECIMAL(3, 2) DEFAULT 0.00,
    remarks TEXT,
    generated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
  console.log('Creating student results database tables...');
  try {
    await pool.query(sql);
    console.log('Success: Results database tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
