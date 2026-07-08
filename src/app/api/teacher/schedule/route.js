import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const teacherId = decoded.id;

    // Fetch schedules/routines where this teacher is assigned
    const routineRes = await query(`
      SELECT r.id, r.day_of_week, r.start_time, r.end_time, r.room_number,
             c.name as class_name, sec.name as section_name,
             sub.name as subject_name, sub.code as subject_code
      FROM class_routines r
      JOIN classes c ON r.class_id = c.id
      JOIN sections sec ON r.section_id = sec.id
      JOIN subjects sub ON r.subject_id = sub.id
      WHERE r.teacher_id = $1
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
    `, [teacherId]);

    return NextResponse.json({ routine: routineRes.rows });
  } catch (error) {
    console.error('Error fetching teacher routine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
