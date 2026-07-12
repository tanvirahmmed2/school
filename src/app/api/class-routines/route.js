import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET class routines
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');
    const sectionId = searchParams.get('section_id');
    const teacherId = searchParams.get('teacher_id');

    let sql = `
      SELECT 
        cr.*, 
        c.name AS class_name, 
        c.code AS class_code,
        s.name AS section_name, 
        sub.name AS subject_name, 
        sub.code AS subject_code,
        t.name AS teacher_name
      FROM class_routines cr
      JOIN classes c ON cr.class_id = c.id
      JOIN sections s ON cr.section_id = s.id
      JOIN subjects sub ON cr.subject_id = sub.id
      LEFT JOIN teachers t ON cr.teacher_id = t.id
    `;
    let params = [];
    let conditions = [];

    if (classId) {
      params.push(classId);
      conditions.push(`cr.class_id = $${params.length}`);
    }

    if (sectionId) {
      params.push(sectionId);
      conditions.push(`cr.section_id = $${params.length}`);
    }

    if (teacherId) {
      params.push(teacherId);
      conditions.push(`cr.teacher_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += `
      ORDER BY 
        CASE cr.day_of_week 
          WHEN 'Sunday' THEN 1 
          WHEN 'Monday' THEN 2 
          WHEN 'Tuesday' THEN 3 
          WHEN 'Wednesday' THEN 4 
          WHEN 'Thursday' THEN 5 
          WHEN 'Friday' THEN 6 
          WHEN 'Saturday' THEN 7 
        END ASC, 
        cr.start_time ASC
    `;

    const result = await query(sql, params);
    const res_data_1785 = { routines: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_1785?.message || 'Successfully fecthed data',
        paylod: res_data_1785
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching class routines:', error);
    const res_err_2156 = { error: 'Failed to retrieve class routines. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_2156?.error || res_err_2156?.message || 'An error occurred',
        error: res_err_2156?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST create class routine (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_2673 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_2673?.error || res_err_2673?.message || 'An error occurred',
        error: res_err_2673?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { class_id, section_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number } = await request.json();

    if (!class_id || !section_id || !subject_id || !day_of_week || !start_time || !end_time) {
      const res_err_3229 = { error: 'Class, Section, Subject, Day, Start Time, and End Time are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_3229?.error || res_err_3229?.message || 'An error occurred',
        error: res_err_3229?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Verify times format HH:mm and start < end
    if (start_time >= end_time) {
      const res_err_3683 = { error: 'Start time must be strictly before end time.' };
      return NextResponse.json({
        success: false,
        message: res_err_3683?.error || res_err_3683?.message || 'An error occurred',
        error: res_err_3683?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check Section Overlap
    const sectionOverlap = await query(
      `SELECT cr.id, cr.start_time, cr.end_time, sub.name as subject_name
       FROM class_routines cr
       JOIN subjects sub ON cr.subject_id = sub.id
       WHERE cr.section_id = $1 
         AND cr.day_of_week = $2 
         AND cr.start_time < $3 
         AND cr.end_time > $4`,
      [section_id, day_of_week, end_time, start_time]
    );

    if (sectionOverlap.rows.length > 0) {
      const existing = sectionOverlap.rows[0];
      const res_err_4537 = { error: `Section overlap detected. The section already has class "${existing.subject_name}" scheduled from ${existing.start_time} to ${existing.end_time} on ${day_of_week}.` };
      return NextResponse.json({
        success: false,
        message: res_err_4537?.error || res_err_4537?.message || 'An error occurred',
        error: res_err_4537?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check Teacher Overlap (if teacher is selected)
    if (teacher_id) {
      const teacherOverlap = await query(
        `SELECT cr.id, cr.start_time, cr.end_time, c.name as class_name, s.name as section_name
         FROM class_routines cr
         JOIN classes c ON cr.class_id = c.id
         JOIN sections s ON cr.section_id = s.id
         WHERE cr.teacher_id = $1 
           AND cr.day_of_week = $2 
           AND cr.start_time < $3 
           AND cr.end_time > $4`,
        [teacher_id, day_of_week, end_time, start_time]
      );

      if (teacherOverlap.rows.length > 0) {
        const existing = teacherOverlap.rows[0];
        const res_err_5645 = { error: `Teacher overlap detected. This teacher is already teaching Class ${existing.class_name} Section ${existing.section_name} from ${existing.start_time} to ${existing.end_time} on ${day_of_week}.` };
      return NextResponse.json({
        success: false,
        message: res_err_5645?.error || res_err_5645?.message || 'An error occurred',
        error: res_err_5645?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
      }
    }

    const newRoutine = await query(
      `INSERT INTO class_routines (class_id, section_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        class_id,
        section_id,
        subject_id,
        teacher_id ? parseInt(teacher_id, 10) : null,
        day_of_week,
        start_time,
        end_time,
        room_number ? room_number.trim() : null
      ]
    );

    const res_data_5271 = { message: 'Class routine entry created successfully.', routine: newRoutine.rows[0] };
      return NextResponse.json({
        success: true,
        message: res_data_5271?.message || 'Successfully fecthed data',
        paylod: res_data_5271
      }, { status: 201 });
  } catch (error) {
    console.error('Error creating class routine:', error);
    const res_err_7093 = { error: 'Failed to create class routine. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_7093?.error || res_err_7093?.message || 'An error occurred',
        error: res_err_7093?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
