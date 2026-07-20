import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET billing details by registration number (Public route)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const regNo = searchParams.get('reg_no');

    if (!regNo) {
      return NextResponse.json({ success: false, error: 'Registration number is required.' }, { status: 400 });
    }

    // Find student
    const studentRes = await query(`
      SELECT s.id, s.name, s.registration_number, c.name AS class_name 
      FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE LOWER(s.registration_number) = LOWER($1) AND s.is_registered = TRUE
    `, [regNo.trim()]);

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Student with this registration number not found.' }, { status: 404 });
    }

    const student = studentRes.rows[0];

    // Fetch student fees invoices
    const feesRes = await query(`
      SELECT id, title, amount, due_date, status, paid_amount, payment_date
      FROM student_fees
      WHERE student_id = $1
      ORDER BY due_date DESC
    `, [student.id]);

    // Fetch student fines log
    const finesRes = await query(`
      SELECT id, title, amount, status, created_at
      FROM student_fines
      WHERE student_id = $1
      ORDER BY created_at DESC
    `, [student.id]);

    return NextResponse.json({
      success: true,
      paylod: {
        student: {
          name: student.name,
          registration_number: student.registration_number,
          class_name: student.class_name
        },
        fees: feesRes.rows,
        fines: finesRes.rows
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public payments:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
