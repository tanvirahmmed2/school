const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

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
    console.log('Running migrations...');
    
    // 1. Alter admissions table
    await pool.query(`
      ALTER TABLE admissions 
      ADD COLUMN IF NOT EXISTS fees DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS description TEXT;
    `);
    console.log('Successfully updated admissions table columns (fees, description).');

    // 2. Create admission_fees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admission_fees (
        id BIGSERIAL PRIMARY KEY,
        student_admission_id BIGINT UNIQUE NOT NULL REFERENCES student_admissions(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Cancelled', 'Cancel', 'pending', 'paid', 'cancel')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Successfully created admission_fees table.');

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
