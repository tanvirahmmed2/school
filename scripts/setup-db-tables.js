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

-- ============================================================================
-- STUDENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id BIGINT REFERENCES sections(id) ON DELETE SET NULL,
    date_of_birth DATE,
    address TEXT,
    parents_info TEXT,
    birth_certificate_number VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    recovery_token VARCHAR(255),
    recovery_token_expires TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT FALSE,
    is_registered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STUDENT ATTENDANCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_attendances (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late', 'Half Day')),
    remarks VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

DROP TRIGGER IF EXISTS update_student_attendances_updated_at ON student_attendances;
CREATE TRIGGER update_student_attendances_updated_at
    BEFORE UPDATE ON student_attendances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STUDENT FEES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_fees (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid', 'Partially Paid')),
    paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_student_fees_updated_at ON student_fees;
CREATE TRIGGER update_student_fees_updated_at
    BEFORE UPDATE ON student_fees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STUDENT FINES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_fines (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_id BIGINT REFERENCES student_fees(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_student_fines_updated_at ON student_fines;
CREATE TRIGGER update_student_fines_updated_at
    BEFORE UPDATE ON student_fines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function main() {
  console.log('Connecting to database and running tables setup...');
  try {
    await pool.query(sql);
    console.log('Success: All new database tables initialized successfully.');
  } catch (error) {
    console.error('Error initializing tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
