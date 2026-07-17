const pg = require('pg');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
});

const pool = new pg.Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: parseInt(env.PG_PORT, 10) || 5432,
  database: env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    const cols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'student_attendances';
    `);
    console.log("student_attendances columns:", cols.rows);

    const logsCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'student_attendance_logs';
    `);
    console.log("student_attendance_logs columns:", logsCols.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
