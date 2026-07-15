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
        message: res_err_326.error,
        error: res_err_326.error,
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      const res_err_715 = { error: 'Invalid token' };
      return NextResponse.json({
        success: false,
        message: res_err_715.error,
        error: res_err_715.error,
        paylod: null
      }, { status: 401 });
    }

    const studentId = decoded.id;

    // Get student class & section
    const studentRes = await query(`
      SELECT class_id, section_id FROM students WHERE id = $1
    `, [studentId]);

    if (studentRes.rows.length === 0) {
      const res_err_1258 = { error: 'Student not found' };
      return NextResponse.json({
        success: false,
        message: res_err_1258.error,
        error: res_err_1258.error,
        paylod: null
      }, { status: 404 });
    }

    const { class_id, section_id } = studentRes.rows[0];

    // Fetch routine joining periods table
    const routineRes = await query(`
      SELECT r.id, r.day_of_week, p.start_time, p.end_time, p.name as period_name, r.room_number,
             sub.name as subject_name, sub.code as subject_code,
             t.name as teacher_name
      FROM class_routines r
      JOIN subjects sub ON r.subject_id = sub.id
      JOIN periods p ON r.period_id = p.id
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
        p.start_time ASC
    `, [class_id, section_id]);

    const res_data_1755 = { routine: routineRes.rows };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched routine schedule',
      paylod: res_data_1755
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student class routine:', error);
    const res_err_2824 = { error: 'Internal server error' };
    return NextResponse.json({
      success: false,
      message: res_err_2824.error,
      error: res_err_2824.error,
      paylod: null
    }, { status: 500 });
  }
}
