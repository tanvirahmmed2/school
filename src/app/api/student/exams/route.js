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

    // Get student class
    const studentRes = await query(`
      SELECT class_id FROM students WHERE id = $1
    `, [studentId]);

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { class_id } = studentRes.rows[0];

    // Fetch schedules for student's class
    const schedulesRes = await query(`
      SELECT es.id, es.exam_date, es.start_time, es.end_time, es.room_number,
             e.name as exam_name, e.term as exam_term, e.status as exam_status,
             sub.name as subject_name, sub.code as subject_code
      FROM exam_schedules es
      JOIN exams e ON es.exam_id = e.id
      JOIN subjects sub ON es.subject_id = sub.id
      WHERE es.class_id = $1
      ORDER BY es.exam_date ASC, es.start_time ASC
    `, [class_id]);

    return NextResponse.json({ examSchedules: schedulesRes.rows });
  } catch (error) {
    console.error('Error fetching student exam schedules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
