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
-- Add designation and is_registered columns
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS designation VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_registered BOOLEAN DEFAULT FALSE;

-- Add recovery token columns
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS recovery_token VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS recovery_token_expires TIMESTAMPTZ;

-- Drop NOT NULL constraints from address and password_hash
ALTER TABLE teachers ALTER COLUMN address DROP NOT NULL;
ALTER TABLE teachers ALTER COLUMN password_hash DROP NOT NULL;

-- Set is_active default to false for new teachers
ALTER TABLE teachers ALTER COLUMN is_active SET DEFAULT FALSE;
`;

async function main() {
  console.log('Altering teachers database table structure...');
  try {
    await pool.query(sql);
    console.log('Success: Teachers database table altered successfully.');
  } catch (error) {
    console.error('Error altering table:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
