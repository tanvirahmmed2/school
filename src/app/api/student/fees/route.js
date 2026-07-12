import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) {
      const res_err_326 = { error: 'Not authenticated' };
      return NextResponse.json({
        success: false,
        message: res_err_326?.error || res_err_326?.message || 'An error occurred',
        error: res_err_326?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      const res_err_715 = { error: 'Invalid token' };
      return NextResponse.json({
        success: false,
        message: res_err_715?.error || res_err_715?.message || 'An error occurred',
        error: res_err_715?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const studentId = decoded.id;

    // Fetch student fees
    const feesRes = await query(`
      SELECT id, title, amount, due_date, status, paid_amount, payment_date
      FROM student_fees
      WHERE student_id = $1
      ORDER BY due_date DESC
    `, [studentId]);

    // Fetch student fines
    const finesRes = await query(`
      SELECT id, title, amount, status, created_at
      FROM student_fines
      WHERE student_id = $1
      ORDER BY created_at DESC
    `, [studentId]);

    const res_data_1104 = {
      fees: feesRes.rows,
      fines: finesRes.rows
    };
      return NextResponse.json({
        success: true,
        message: res_data_1104?.message || 'Successfully fecthed data',
        paylod: res_data_1104
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student fees and fines:', error);
    const res_err_1974 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_1974?.error || res_err_1974?.message || 'An error occurred',
        error: res_err_1974?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
