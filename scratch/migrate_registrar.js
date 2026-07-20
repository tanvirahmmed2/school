const pg = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    // Remove quotes
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const pool = new pg.Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: env.PG_PORT ? parseInt(env.PG_PORT, 10) : 5432,
  database: env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Database connected.');

    // 1. Drop check constraint and add updated check constraint
    console.log('Updating staffs table check constraint...');
    // Find the check constraint name. Usually it matches 'staffs_role_check'
    // We drop and re-add constraint with registrar
    await client.query(`
      ALTER TABLE staffs DROP CONSTRAINT IF EXISTS staffs_role_check;
      ALTER TABLE staffs ADD CONSTRAINT staffs_role_check CHECK (role IN ('cashier', 'registrar', 'staff'));
    `);
    console.log('Constraint updated successfully.');

    // 2. Update existing rows with 'register' to 'registrar'
    console.log('Updating user roles from register to registrar...');
    const res = await client.query(`
      UPDATE staffs SET role = 'registrar' WHERE role = 'register' RETURNING id, name, role;
    `);
    console.log(`Updated ${res.rowCount} rows.`);
    console.log(res.rows);

    client.release();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

run();
