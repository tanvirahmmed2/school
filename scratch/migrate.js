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
    console.log('Database connected. Running migrations...');

    // 1. Create admission_fee_payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admission_fee_payments (
          id BIGSERIAL PRIMARY KEY,
          admission_fee_id BIGINT NOT NULL REFERENCES admission_fees(id) ON DELETE CASCADE,
          amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash',
          transaction_id VARCHAR(100),
          remarks TEXT,
          payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created table: admission_fee_payments');

    // Trigger for admission_fee_payments
    await client.query(`
      DROP TRIGGER IF EXISTS update_admission_fee_payments_updated_at ON admission_fee_payments;
      CREATE TRIGGER update_admission_fee_payments_updated_at
          BEFORE UPDATE ON admission_fee_payments
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // 2. Create teacher_salary_payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher_salary_payments (
          id BIGSERIAL PRIMARY KEY,
          salary_id BIGINT NOT NULL REFERENCES salaries(id) ON DELETE CASCADE,
          amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          payment_method VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
          transaction_id VARCHAR(100),
          remarks TEXT,
          payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created table: teacher_salary_payments');

    // Trigger for teacher_salary_payments
    await client.query(`
      DROP TRIGGER IF EXISTS update_teacher_salary_payments_updated_at ON teacher_salary_payments;
      CREATE TRIGGER update_teacher_salary_payments_updated_at
          BEFORE UPDATE ON teacher_salary_payments
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // 3. Create staff_salary_payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff_salary_payments (
          id BIGSERIAL PRIMARY KEY,
          staff_salary_id BIGINT NOT NULL REFERENCES staff_salaries(id) ON DELETE CASCADE,
          amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          payment_method VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
          transaction_id VARCHAR(100),
          remarks TEXT,
          payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created table: staff_salary_payments');

    // Trigger for staff_salary_payments
    await client.query(`
      DROP TRIGGER IF EXISTS update_staff_salary_payments_updated_at ON staff_salary_payments;
      CREATE TRIGGER update_staff_salary_payments_updated_at
          BEFORE UPDATE ON staff_salary_payments
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    client.release();
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

run();
