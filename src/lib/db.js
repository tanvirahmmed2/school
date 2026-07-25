import pg from 'pg';
import { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } from './secret';

const { Pool } = pg;

let pool;

if (!global._postgresPool) {
  global._postgresPool = new Pool({
    user: PG_USER,
    password: PG_PASSWORD,
    host: PG_HOST,
    port: PG_PORT ? parseInt(PG_PORT, 10) : 5432,
    database: PG_DATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });
}
pool = global._postgresPool;

export const query = (text, params) => pool.query(text, params);

let clubTablesEnsured = false;
export async function ensureClubTables() {
  if (clubTablesEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS club_admin (
        id BIGSERIAL PRIMARY KEY,
        club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
        teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
        designation VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(club_id, teacher_id)
      );

      CREATE TABLE IF NOT EXISTS club_member (
        id BIGSERIAL PRIMARY KEY,
        club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator')),
        designation VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(club_id, student_id)
      );

      ALTER TABLE clubs ADD COLUMN IF NOT EXISTS notice_info TEXT;
    `);
    clubTablesEnsured = true;
  } catch (err) {
    console.error('Error ensuring club database tables:', err);
  }
}

let eventsTablesEnsured = false;
export async function ensureEventsTables() {
  if (eventsTablesEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date TIMESTAMPTZ NOT NULL,
        location VARCHAR(255) NOT NULL,
        image TEXT,
        image_id TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE events ADD COLUMN IF NOT EXISTS image TEXT;
      ALTER TABLE events ADD COLUMN IF NOT EXISTS image_id TEXT;

      CREATE TABLE IF NOT EXISTS event_participants (
        id BIGSERIAL PRIMARY KEY,
        event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, student_id)
      );
    `);
    eventsTablesEnsured = true;
  } catch (err) {
    console.error('Error ensuring events database tables:', err);
  }
}

let historiesTableEnsured = false;
export async function ensureHistoriesTable() {
  if (historiesTableEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS histories (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        infor TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE histories ADD COLUMN IF NOT EXISTS date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE histories ADD COLUMN IF NOT EXISTS infor TEXT;
      DO $$ 
      BEGIN 
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name='histories' AND column_name='year'
        ) THEN 
          ALTER TABLE histories ALTER COLUMN year DROP NOT NULL; 
        END IF; 
      END $$;
    `);
    historiesTableEnsured = true;
  } catch (err) {
    console.error('Error ensuring histories database table:', err);
  }
}

export default pool;

