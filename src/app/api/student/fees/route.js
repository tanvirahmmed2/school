import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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

    return NextResponse.json({
      fees: feesRes.rows,
      fines: finesRes.rows
    });
  } catch (error) {
    console.error('Error fetching student fees and fines:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
