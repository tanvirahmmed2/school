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

async function checkCols() {
  const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'staffs'");
  console.log('Staffs columns:', res.rows.map(r => r.column_name));
  
  // Make sure both phone and number columns exist in staffs to prevent any runtime error
  await pool.query("ALTER TABLE staffs ADD COLUMN IF NOT EXISTS phone VARCHAR(50)");
  await pool.query("ALTER TABLE staffs ADD COLUMN IF NOT EXISTS number VARCHAR(50)");
  await pool.query("UPDATE staffs SET phone = number WHERE phone IS NULL AND number IS NOT NULL");
  await pool.query("UPDATE staffs SET number = phone WHERE number IS NULL AND phone IS NOT NULL");
  console.log('✔ Staffs phone and number columns synchronized.');
  
  pool.end();
}
checkCols().catch(console.error);
