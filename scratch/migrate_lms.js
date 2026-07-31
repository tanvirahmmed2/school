import { query } from '../src/lib/db.js';

async function migrate() {
  console.log('Migrating LMS and activity log tables...');
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS study_materials (
        id BIGSERIAL PRIMARY KEY,
        class_subject_id BIGINT NOT NULL REFERENCES class_subjects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_id VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS lesson_plans (
        id BIGSERIAL PRIMARY KEY,
        class_subject_id BIGINT NOT NULL REFERENCES class_subjects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Completed',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT,
        user_type VARCHAR(50),
        action VARCHAR(255) NOT NULL,
        details JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('LMS & activity_logs migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
