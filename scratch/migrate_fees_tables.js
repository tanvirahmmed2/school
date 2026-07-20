const pg = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    // Remove quotes
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const pool = new pg.Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: env.PG_PORT ? parseInt(env.PG_PORT, 10) : 5432,
  database: env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Database connected.');

    // 1. Create class_monthly_fees
    console.log('Creating class_monthly_fees table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS class_monthly_fees (
          id BIGSERIAL PRIMARY KEY,
          class_id BIGINT UNIQUE NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add updated_at trigger
    await client.query(`
      DROP TRIGGER IF EXISTS update_class_monthly_fees_updated_at ON class_monthly_fees;
      CREATE TRIGGER update_class_monthly_fees_updated_at
          BEFORE UPDATE ON class_monthly_fees
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('class_monthly_fees table created.');

    // 2. Create exam_fee_payments
    console.log('Creating exam_fee_payments table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_fee_payments (
          id BIGSERIAL PRIMARY KEY,
          fee_id BIGINT NOT NULL REFERENCES student_fees(id) ON DELETE CASCADE,
          exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
          student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          amount DECIMAL(10, 2) NOT NULL,
          payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash',
          transaction_id VARCHAR(100),
          remarks TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add updated_at trigger
    await client.query(`
      DROP TRIGGER IF EXISTS update_exam_fee_payments_updated_at ON exam_fee_payments;
      CREATE TRIGGER update_exam_fee_payments_updated_at
          BEFORE UPDATE ON exam_fee_payments
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('exam_fee_payments table created.');

    client.release();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

run();
