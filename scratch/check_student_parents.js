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
      if (value.length > 0 && value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
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

async function run() {
  const sRes = await pool.query("SELECT * FROM students WHERE name ILIKE '%sara%' OR registration_number ILIKE '%2026-6002%'");
  console.log('Student record:', sRes.rows[0]);

  if (sRes.rows[0]) {
    const studentId = sRes.rows[0].id;
    const rRes = await pool.query("SELECT * FROM student_relatives WHERE student_id = $1", [studentId]);
    console.log('Student relatives:', rRes.rows);
  }

  pool.end();
}

run().catch(console.error);
