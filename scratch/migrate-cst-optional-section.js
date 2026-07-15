const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx < 0) return;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
});

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Drop the existing unique constraint
    await client.query(`
      ALTER TABLE class_subject_teachers
        DROP CONSTRAINT IF EXISTS class_subject_teachers_class_subject_id_section_id_academic__key
    `);
    console.log('Dropped old unique constraint');

    // 2. Make section_id nullable
    await client.query(`
      ALTER TABLE class_subject_teachers
        ALTER COLUMN section_id DROP NOT NULL
    `);
    console.log('Made section_id nullable');

    // 3. Add new unique index using COALESCE so NULL is treated as -1
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS cst_unique_idx
        ON class_subject_teachers (class_subject_id, academic_year, COALESCE(section_id, -1))
    `);
    console.log('Created new unique index with COALESCE');

    await client.query('COMMIT');
    console.log('Migration complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
