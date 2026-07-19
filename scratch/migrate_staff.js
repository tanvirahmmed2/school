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
    console.log('Running staff DDL migrations...');
    
    // Create staffs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS staffs (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          number VARCHAR(50) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('cashier', 'register', 'staff')),
          designation VARCHAR(255),
          address TEXT,
          password_hash VARCHAR(255),
          recovery_token VARCHAR(255),
          recovery_token_expires TIMESTAMPTZ,
          is_active BOOLEAN DEFAULT FALSE,
          is_registered BOOLEAN DEFAULT FALSE,
          verification_token VARCHAR(255),
          verification_token_expires TIMESTAMPTZ,
          image TEXT,
          image_id VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created staffs table.');

    // Add updated_at trigger
    await pool.query(`
      DROP TRIGGER IF EXISTS update_staffs_updated_at ON staffs;
      CREATE TRIGGER update_staffs_updated_at
          BEFORE UPDATE ON staffs
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Configured staffs updated_at trigger.');

    console.log('Staff DDL migrations completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
