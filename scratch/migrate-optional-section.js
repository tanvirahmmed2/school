const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const client = new Client({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: parseInt(env.PG_PORT || '5432', 10),
  database: env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  await client.connect();
  console.log('Connected to database!');

  console.log('Altering section_id column and constraints...');
  // Drop unique constraint
  await client.query('ALTER TABLE class_routines DROP CONSTRAINT IF EXISTS unique_section_day_time');
  
  // Make section_id nullable
  await client.query('ALTER TABLE class_routines ALTER COLUMN section_id DROP NOT NULL');
  
  // Add unique index handling NULL/optional section_id
  await client.query('DROP INDEX IF EXISTS class_routine_unique_idx');
  await client.query('CREATE UNIQUE INDEX class_routine_unique_idx ON class_routines (class_id, day_id, start_time, end_time, COALESCE(section_id, -1))');

  console.log('Database alteration completed successfully!');
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
