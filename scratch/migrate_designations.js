const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
let config = {};
try {
  const envContent = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf-8");
  envContent.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length === 2) {
      const key = parts[0].trim();
      let val = parts[1].trim();
      // Remove quotes if present
      if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);
      if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
      config[key] = val;
    }
  });
} catch (err) {
  console.error("Could not parse .env file:", err);
}

const pool = new Pool({
  user: config.PG_USER,
  password: config.PG_PASSWORD,
  host: config.PG_HOST,
  port: config.PG_PORT ? parseInt(config.PG_PORT, 10) : 5432,
  database: config.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Connected to PostgreSQL. Starting migration...");

    // 1. Create authority_designations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS authority_designations (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) UNIQUE NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created authority_designations table if not exists.");

    // 2. Insert default designations
    await client.query(`
      INSERT INTO authority_designations (title, slug, description) VALUES
      ('Principal', 'principal', 'Office of the Principal, chief academic officer overview.'),
      ('Chairman', 'chairman', 'Governing board of directors chairman profiles.'),
      ('Managing Director', 'director', 'Operational development strategy division statement.'),
      ('Academic Council Member', 'council', 'Central curriculum review senate board roster.'),
      ('Registrar', 'registrar', 'Student registrations, admissions, transcripts, and records.'),
      ('Support Staff', 'staff', 'Support staff teams, desks, and contact timings.'),
      ('Executive Officer', 'officers', 'Directory of institutional officers and department leads.')
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log("Inserted default designations.");

    // 3. Check if designation_id column exists in authorities
    const colCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'authorities' AND column_name = 'designation_id';
    `);

    if (colCheck.rows.length === 0) {
      // Add column
      await client.query(`
        ALTER TABLE authorities ADD COLUMN designation_id BIGINT REFERENCES authority_designations(id) ON DELETE RESTRICT;
      `);
      console.log("Added column designation_id to authorities.");

      // Migrate existing string designations
      await client.query(`
        UPDATE authorities a
        SET designation_id = ad.id
        FROM authority_designations ad
        WHERE LOWER(a.designation) = LOWER(ad.slug);
      `);
      console.log("Migrated designation values to designation_id.");

      // Fill remaining NULL designation_ids with a fallback
      await client.query(`
        UPDATE authorities 
        SET designation_id = (SELECT id FROM authority_designations WHERE slug = 'staff' LIMIT 1)
        WHERE designation_id IS NULL;
      `);
      console.log("Filled NULL designation_ids with fallback.");

      // Set NOT NULL constraint
      await client.query(`
        ALTER TABLE authorities ALTER COLUMN designation_id SET NOT NULL;
      `);
      console.log("Set designation_id column as NOT NULL.");

      // Drop old designation column
      await client.query(`
        ALTER TABLE authorities DROP COLUMN IF EXISTS designation;
      `);
      console.log("Dropped old designation column.");
    } else {
      console.log("designation_id column already exists. Skipping column creation.");
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
