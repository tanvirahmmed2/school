const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
  database: process.env.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Updating student_fees table check constraint...');

    await client.query(`
      ALTER TABLE student_fees 
      DROP CONSTRAINT IF EXISTS student_fees_status_check;
    `);

    await client.query(`
      UPDATE student_fees 
      SET status = LOWER(status);
    `);

    await client.query(`
      ALTER TABLE student_fees 
      ADD CONSTRAINT student_fees_status_check 
      CHECK (LOWER(status) IN ('unpaid', 'paid', 'partially paid', 'pending', 'cancelled'));
    `);

    console.log('Successfully updated student_fees check constraint!');
  } catch (err) {
    console.error('Error updating constraint:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
