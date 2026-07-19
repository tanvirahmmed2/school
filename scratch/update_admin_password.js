const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Read .env file in the root directory
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found at:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val.trim();
  }
});

const pool = new Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: env.PG_PORT ? parseInt(env.PG_PORT, 10) : 5432,
  database: env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    await pool.query('UPDATE admins SET password_hash = $1 WHERE email = $2', [hash, 'support@disibin.com']);
    console.log('Successfully updated password for support@disibin.com to "admin123"');
  } catch (err) {
    console.error('Error updating admin password:', err);
  } finally {
    await pool.end();
  }
}

main();
