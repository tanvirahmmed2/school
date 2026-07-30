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
      if (value.length > 0 && value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
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

const query = (text, params) => pool.query(text, params);

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function runMigration() {
  try {
    console.log(`Connecting to PostgreSQL at ${envVars.PG_HOST}:${envVars.PG_PORT}...`);

    // 1. Add columns to admins
    await query(`
      ALTER TABLE admins 
      ADD COLUMN IF NOT EXISTS date_of_birth DATE,
      ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
      ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
      ADD COLUMN IF NOT EXISTS nid_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS username VARCHAR(255);
    `);
    console.log('✔ admins columns verified.');

    // 2. Add columns to teachers
    await query(`
      ALTER TABLE teachers 
      ADD COLUMN IF NOT EXISTS date_of_birth DATE,
      ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
      ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
      ADD COLUMN IF NOT EXISTS nid_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS username VARCHAR(255);
    `);
    console.log('✔ teachers columns verified.');

    // 3. Ensure staffs table exists & add columns
    await query(`
      CREATE TABLE IF NOT EXISTS staffs (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(100) NOT NULL DEFAULT 'staff',
        address TEXT,
        password_hash VARCHAR(255),
        recovery_token VARCHAR(255),
        recovery_token_expires TIMESTAMPTZ,
        two_factor_code VARCHAR(10),
        two_factor_expires TIMESTAMPTZ,
        is_active BOOLEAN DEFAULT TRUE,
        is_registered BOOLEAN DEFAULT TRUE,
        is_two_factor_enabled BOOLEAN DEFAULT FALSE,
        image TEXT,
        image_id VARCHAR(255),
        date_of_birth DATE,
        nationality VARCHAR(100),
        blood_group VARCHAR(10),
        gender VARCHAR(20),
        nid_number VARCHAR(100),
        bio TEXT,
        username VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await query(`
      ALTER TABLE staffs 
      ADD COLUMN IF NOT EXISTS date_of_birth DATE,
      ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
      ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
      ADD COLUMN IF NOT EXISTS nid_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS username VARCHAR(255);
    `);
    console.log('✔ staffs table and columns verified.');

    // 4. Create experience tables
    await query(`
      CREATE TABLE IF NOT EXISTS teacher_experiences (
        id BIGSERIAL PRIMARY KEY,
        teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        is_current BOOLEAN DEFAULT FALSE,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS staff_experiences (
        id BIGSERIAL PRIMARY KEY,
        staff_id BIGINT NOT NULL REFERENCES staffs(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        is_current BOOLEAN DEFAULT FALSE,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS admin_experiences (
        id BIGSERIAL PRIMARY KEY,
        admin_id BIGINT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        is_current BOOLEAN DEFAULT FALSE,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✔ experience tables created.');

    // 5. Generate unique usernames for teachers, staffs, admins without username
    const tables = ['teachers', 'staffs', 'admins'];
    for (const tbl of tables) {
      const res = await query(`SELECT id, name, username FROM ${tbl} WHERE username IS NULL OR username = ''`);
      for (const row of res.rows) {
        let baseSlug = slugify(row.name) || `user-${row.id}`;
        let candidateSlug = baseSlug;
        let count = 1;

        while (true) {
          const check = await query(`SELECT id FROM ${tbl} WHERE username = $1 AND id <> $2`, [candidateSlug, row.id]);
          if (check.rows.length === 0) break;
          candidateSlug = `${baseSlug}-${count++}`;
        }

        await query(`UPDATE ${tbl} SET username = $1 WHERE id = $2`, [candidateSlug, row.id]);
        console.log(`Updated ${tbl} ID ${row.id} username -> ${candidateSlug}`);
      }
    }

    // Add unique constraint to username on tables if not already present
    for (const tbl of tables) {
      try {
        await query(`ALTER TABLE ${tbl} ADD CONSTRAINT ${tbl}_username_unique UNIQUE (username);`);
      } catch (cErr) {
        // Ignore if constraint already exists
      }
    }

    console.log('🎉 Extended profile tables, columns, and unique usernames migration finished successfully!');
    pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    pool.end();
    process.exit(1);
  }
}

runMigration();
