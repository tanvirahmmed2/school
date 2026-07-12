import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
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

    const res_data_1489 = { routine: routineRes.rows };
      return NextResponse.json({
        success: true,
        message: res_data_1489?.message || 'Successfully fecthed data',
        paylod: res_data_1489
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching teacher routine:', error);
    const res_err_2320 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_2320?.error || res_err_2320?.message || 'An error occurred',
        error: res_err_2320?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
