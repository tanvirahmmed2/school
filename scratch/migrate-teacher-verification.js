const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env manually and strip surrounding quotes from values
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

pool.query(`
  ALTER TABLE teachers 
    ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
    ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ
`)
  .then(() => {
    console.log('Migration successful: added verification_token + verification_token_expires to teachers');
    pool.end();
  })
  .catch(e => {
    console.error('Migration error:', e.message);
    pool.end();
  });
