import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, isRegistrar } from '@/lib/auth';

// GET student fee payment logs (Admin and Registrars only)
export async function GET(request) {
  try {
    const authenticated = (await isAdmin()) || (await isRegistrar());
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins or Registrars only.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const feeId = searchParams.get('student_fee_id');
    const studentId = searchParams.get('student_id');

    let sql = `
      SELECT 
        sfp.*,
        sf.title AS fee_title,
        sf.amount AS fee_total_amount,
        s.name AS student_name, 
        s.registration_number,
        c.name AS class_name
      FROM student_fee_payments sfp
      JOIN student_fees sf ON sfp.student_fee_id = sf.id
      JOIN students s ON sf.student_id = s.id
      JOIN classes c ON s.class_id = c.id
    `;
    let params = [];
    let conditions = [];

    if (feeId) {
      params.push(feeId);
      conditions.push(`sfp.student_fee_id = $${params.length}`);
    }

    if (studentId) {
      params.push(studentId);
      conditions.push(`sf.student_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY sfp.payment_date DESC';

    const result = await query(sql, params);
    return NextResponse.json({ payments: result.rows });
  } catch (error) {
    console.error('Error fetching student fee payments:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment logs. Internal server error.' },
      { status: 500 }
    );
  }
}
