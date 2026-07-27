import { query } from './db';
import { MONTHLY_FEE_DUE_DAY } from './secret';

/**
 * Automatically checks and generates monthly fee invoices for active/registered students.
 * Title format: "Monthly Fee (Month Year)" (e.g. "Monthly Fee (July 2026)").
 * Due date: 6th day of the current calendar month (configurable via MONTHLY_FEE_DUE_DAY).
 * Amount: Class monthly tuition fee from class_monthly_fees.
 * Status: 'unpaid'.
 */
export async function triggerMonthlyFeeGeneration(targetStudentId = null) {
  try {
    const today = new Date();
    const monthName = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();
    const feeTitle = `Monthly Fee (${monthName} ${year})`;

    const dueDay = Math.min(Math.max(MONTHLY_FEE_DUE_DAY || 6, 1), 28);
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(dueDay).padStart(2, '0');
    const formattedDueDate = `${year}-${monthStr}-${dayStr}`;

    let insertSql = `
      INSERT INTO student_fees (student_id, title, amount, due_date, status)
      SELECT 
        s.id AS student_id,
        $1::varchar AS title,
        COALESCE(cmf.amount, 0.00) AS amount,
        $2::date AS due_date,
        'unpaid' AS status
      FROM students s
      JOIN class_monthly_fees cmf ON s.class_id = cmf.class_id
      WHERE s.is_registered = TRUE
        AND s.is_active = TRUE
        AND NOT EXISTS (
          SELECT 1 FROM student_fees sf 
          WHERE sf.student_id = s.id 
            AND LOWER(sf.title) = LOWER($1::varchar)
        )
    `;

    const params = [feeTitle, formattedDueDate];

    if (targetStudentId) {
      params.push(parseInt(targetStudentId, 10));
      insertSql += ` AND s.id = $3`;
    }

    const res = await query(insertSql, params);
    if (res.rowCount > 0) {
      console.log(`Generated ${res.rowCount} new monthly fee invoices for ${monthName} ${year}.`);
    }
  } catch (err) {
    console.error('Error in triggerMonthlyFeeGeneration:', err);
  }
}
