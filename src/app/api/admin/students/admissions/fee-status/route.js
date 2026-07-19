import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function PUT(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { student_admission_id, status } = body; // status = 'Paid', 'Pending', 'Cancelled'

    if (!student_admission_id || !status || !['Pending', 'Paid', 'Cancelled'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student Admission ID and valid fee status (Pending/Paid/Cancelled) are required.' 
      }, { status: 400 });
    }

    // Update the admission fee status
    const result = await query(`
      UPDATE admission_fees
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE student_admission_id = $2
      RETURNING *
    `, [status, parseInt(student_admission_id, 10)]);

    if (result.rows.length === 0) {
      // If it doesn't exist for some reason, fetch from admissions circular and insert
      const admRes = await query(`
        SELECT sa.admission_id, adm.fees 
        FROM student_admissions sa
        LEFT JOIN admissions adm ON sa.admission_id = adm.id
        WHERE sa.id = $1
      `, [parseInt(student_admission_id, 10)]);

      if (admRes.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Admission application not found.' }, { status: 404 });
      }

      const fees = admRes.rows[0].fees || 0.00;
      await query(`
        INSERT INTO admission_fees (student_admission_id, amount, status)
        VALUES ($1, $2, $3)
      `, [parseInt(student_admission_id, 10), fees, status]);
    }

    return NextResponse.json({
      success: true,
      message: `Admission fee status updated to ${status} successfully.`
    });
  } catch (error) {
    console.error('Error updating admission fee status:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
