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

    // Fetch student's attendance history
    const historyRes = await query(`
      SELECT id, date, status, remarks 
      FROM student_attendances 
      WHERE student_id = $1 
      ORDER BY date DESC
    `, [studentId]);

    // Fetch summaries
    const summaryRes = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Present' THEN 1 END) as present,
        COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent,
        COUNT(CASE WHEN status = 'Late' THEN 1 END) as late,
        COUNT(CASE WHEN status = 'Half Day' THEN 1 END) as half_day
      FROM student_attendances 
      WHERE student_id = $1
    `, [studentId]);

    return NextResponse.json({
      history: historyRes.rows,
      summary: summaryRes.rows[0]
    });
  } catch (error) {
    console.error('Error fetching student attendance history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
