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

    // Get student class & section
    const studentRes = await query(`
      SELECT class_id, section_id FROM students WHERE id = $1
    `, [studentId]);

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { class_id, section_id } = studentRes.rows[0];

    // Fetch routine
    const routineRes = await query(`
      SELECT r.id, r.day_of_week, r.start_time, r.end_time, r.room_number,
             sub.name as subject_name, sub.code as subject_code,
             t.name as teacher_name
      FROM class_routines r
      JOIN subjects sub ON r.subject_id = sub.id
      LEFT JOIN teachers t ON r.teacher_id = t.id
      WHERE r.class_id = $1 AND r.section_id = $2
      ORDER BY 
        CASE r.day_of_week
          WHEN 'Sunday' THEN 1
          WHEN 'Monday' THEN 2
          WHEN 'Tuesday' THEN 3
          WHEN 'Wednesday' THEN 4
          WHEN 'Thursday' THEN 5
          WHEN 'Friday' THEN 6
          WHEN 'Saturday' THEN 7
          ELSE 8
        END,
        r.start_time ASC
    `, [class_id, section_id]);

    return NextResponse.json({ routine: routineRes.rows });
  } catch (error) {
    console.error('Error fetching student class routine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
