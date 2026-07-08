const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Manually load env variables from .env to avoid external dependency 'dotenv'
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Strip quotes if present
      if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
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
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log('Connecting to database...');
  const client = await pool.connect();
  try {
    console.log('Fetching all user tables...');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    
    const tables = tablesRes.rows.map(row => row.table_name);
    console.log(`Found tables to drop: ${tables.join(', ') || 'none'}`);
    
    if (tables.length > 0) {
      console.log('Dropping old tables...');
      for (const table of tables) {
        await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        console.log(`Dropped table: ${table}`);
      }
    }

    console.log('Reading schema.psql...');
    const schemaPath = path.resolve(__dirname, '../../schema.psql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.psql...');
    await client.query(sql);
    console.log('Database schema initialized successfully!');

  } catch (error) {
    console.error('Error during database initialization:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
