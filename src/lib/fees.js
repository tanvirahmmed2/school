import { query } from './db';

/**
 * Automatically checks and generates monthly fee invoices for all active/registered students.
 * For the current calendar month, it checks if a student already has a fee invoice named
 * "Monthly Fee - [Month] [Year]" (e.g. "Monthly Fee - July 2026"). If not, it inserts one
 * using the tuition rate configured for their class in class_monthly_fees.
 */
export async function triggerMonthlyFeeGeneration() {
  try {
    const today = new Date();
    // Get full month name and year (e.g. "July 2026")
    const monthName = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();
    const feeTitle = `Monthly Fee - ${monthName} ${year}`;

    // Get last day of current month as due date
    const lastDayOfMonth = new Date(year, today.getMonth() + 1, 0);
    const formattedDueDate = lastDayOfMonth.toISOString().slice(0, 10);

    const insertSql = `
      INSERT INTO student_fees (student_id, title, amount, due_date, status)
      SELECT 
        s.id AS student_id,
        $1 AS title,
        cmf.amount AS amount,
        $2::date AS due_date,
        'Unpaid' AS status
      FROM students s
      JOIN class_monthly_fees cmf ON s.class_id = cmf.class_id
      WHERE s.is_registered = TRUE
        AND s.is_active = TRUE
        AND NOT EXISTS (
          SELECT 1 FROM student_fees sf 
          WHERE sf.student_id = s.id 
            AND sf.title = $1
        )
    `;

    const res = await query(insertSql, [feeTitle, formattedDueDate]);
    if (res.rowCount > 0) {
      console.log(`Generated ${res.rowCount} new monthly fee invoices for ${monthName} ${year}.`);
    }
  } catch (err) {
    console.error('Error in triggerMonthlyFeeGeneration:', err);
  }
}
