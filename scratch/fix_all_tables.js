import pg from 'pg';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');

const env = {};
envConfig.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    value = value.trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
});

const { Pool } = pg;

const pool = new Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: env.PG_PORT ? parseInt(env.PG_PORT, 10) : 5432,
  database: env.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function fixAllTables() {
  let client;
  try {
    console.log('Connecting to PostgreSQL...');
    client = await pool.connect();
    console.log('Connected!');

    // 1. Admins 2FA columns
    await client.query(`
      ALTER TABLE admins 
      ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS two_factor_code VARCHAR(10),
      ADD COLUMN IF NOT EXISTS two_factor_expires TIMESTAMPTZ;
    `);
    console.log('✔ admins 2FA columns verified.');

    // 2. Teachers 2FA columns
    await client.query(`
      ALTER TABLE teachers 
      ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS two_factor_code VARCHAR(10),
      ADD COLUMN IF NOT EXISTS two_factor_expires TIMESTAMPTZ;
    `);
    console.log('✔ teachers 2FA columns verified.');

    // 3. Staffs 2FA columns
    await client.query(`
      ALTER TABLE staffs 
      ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS two_factor_code VARCHAR(10),
      ADD COLUMN IF NOT EXISTS two_factor_expires TIMESTAMPTZ;
    `);
    console.log('✔ staffs 2FA columns verified.');

    // 4. Clubs columns
    await client.query(`
      ALTER TABLE clubs 
      ADD COLUMN IF NOT EXISTS motto TEXT,
      ADD COLUMN IF NOT EXISTS notice_info TEXT;
    `);
    console.log('✔ clubs columns verified.');

    // 5. Club News columns
    await client.query(`
      ALTER TABLE club_news 
      ADD COLUMN IF NOT EXISTS slug TEXT;
    `);
    console.log('✔ club_news columns verified.');

    // 6. Events columns
    await client.query(`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
    `);
    console.log('✔ events columns verified.');

    // 7. Exam Schedules columns
    await client.query(`
      ALTER TABLE exam_schedules 
      ADD COLUMN IF NOT EXISTS full_marks DECIMAL(5,2) DEFAULT 100.00;
    `);
    console.log('✔ exam_schedules columns verified.');

    // 8. Mark Grades columns
    await client.query(`
      ALTER TABLE mark_grades 
      ADD COLUMN IF NOT EXISTS point DECIMAL(5,2) NOT NULL DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
    `);
    console.log('✔ mark_grades columns verified.');

    // 9. Authority Designations columns
    await client.query(`
      ALTER TABLE authority_designations 
      ADD COLUMN IF NOT EXISTS is_head BOOLEAN DEFAULT FALSE;
    `);
    console.log('✔ authority_designations columns verified.');

    // 10. Website Settings columns
    await client.query(`
      ALTER TABLE website_settings 
      ADD COLUMN IF NOT EXISTS map_url TEXT,
      ADD COLUMN IF NOT EXISTS motto TEXT,
      ADD COLUMN IF NOT EXISTS mission TEXT,
      ADD COLUMN IF NOT EXISTS vission TEXT,
      ADD COLUMN IF NOT EXISTS history TEXT,
      ADD COLUMN IF NOT EXISTS facebook_url TEXT,
      ADD COLUMN IF NOT EXISTS twitter_url TEXT,
      ADD COLUMN IF NOT EXISTS instagram_url TEXT,
      ADD COLUMN IF NOT EXISTS youtube_url TEXT;
    `);
    console.log('✔ website_settings columns verified.');

    console.log('🎉 All PostgreSQL database tables fixed and verified!');
  } catch (err) {
    console.error('Error fixing tables:', err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

fixAllTables();
