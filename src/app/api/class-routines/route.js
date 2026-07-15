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
        cs.class_id AS class_id,
        c.name AS class_name, 
        c.code AS class_code,
        s.name AS section_name, 
        sub.name AS subject_name, 
        sub.code AS subject_code,
        t.name AS teacher_name,
        p.name AS period_name,
        p.start_time AS start_time,
        p.end_time AS end_time
      FROM class_routines cr
      JOIN class_subjects cs ON cr.class_subject_id = cs.id
      JOIN classes c ON cs.class_id = c.id
      JOIN sections s ON cr.section_id = s.id
      JOIN subjects sub ON cs.subject_id = sub.id
      LEFT JOIN teachers t ON cr.teacher_id = t.id
      JOIN periods p ON cr.period_id = p.id
    `;
    let params = [];
    let conditions = [];

    if (classId) {
      params.push(classId);
      conditions.push(`cs.class_id = $${params.length}`);
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
        p.start_time ASC
    `;

    const result = await query(sql, params);
    const res_data = { routines: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched routine schedules',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching class routines:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve class routines.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// POST create class routine (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admins only.',
        error: 'Unauthorized',
        paylod: null
      }, { status: 403 });
    }

    const { class_subject_id, section_id, teacher_id, day_of_week, period_id, room_number } = await request.json();

    if (!class_subject_id || !section_id || !day_of_week || !period_id) {
      return NextResponse.json({
        success: false,
        message: 'Class Subject, Section, Day, and Period are required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // Verify Class Subject exists
    const csCheck = await query('SELECT * FROM class_subjects WHERE id = $1', [class_subject_id]);
    if (csCheck.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Selected class subject not found.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // Verify Period exists
    const periodCheck = await query('SELECT * FROM periods WHERE id = $1', [period_id]);
    if (periodCheck.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Selected routine period not found.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }
    const currentPeriod = periodCheck.rows[0];

    // Check Section Overlap (Same Period, Same Day)
    const sectionOverlap = await query(
      `SELECT cr.id, sub.name as subject_name, p.name as period_name
       FROM class_routines cr
       JOIN class_subjects cs ON cr.class_subject_id = cs.id
       JOIN subjects sub ON cs.subject_id = sub.id
       JOIN periods p ON cr.period_id = p.id
       WHERE cr.section_id = $1 
         AND cr.day_of_week = $2 
         AND cr.period_id = $3`,
      [section_id, day_of_week, period_id]
    );

    if (sectionOverlap.rows.length > 0) {
      const existing = sectionOverlap.rows[0];
      return NextResponse.json({
        success: false,
        message: `Section overlap detected. The section already has class "${existing.subject_name}" scheduled during period "${existing.period_name}" on ${day_of_week}.`,
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }

    // Check Teacher Overlap (if teacher is selected)
    if (teacher_id) {
      const teacherOverlap = await query(
        `SELECT cr.id, c.name as class_name, s.name as section_name, p.name as period_name
         FROM class_routines cr
         JOIN class_subjects cs ON cr.class_subject_id = cs.id
         JOIN classes c ON cs.class_id = c.id
         JOIN sections s ON cr.section_id = s.id
         JOIN periods p ON cr.period_id = p.id
         WHERE cr.teacher_id = $1 
           AND cr.day_of_week = $2 
           AND cr.period_id = $3`,
        [teacher_id, day_of_week, period_id]
      );

      if (teacherOverlap.rows.length > 0) {
        const existing = teacherOverlap.rows[0];
        return NextResponse.json({
          success: false,
          message: `Teacher overlap detected. This teacher is already teaching Class ${existing.class_name} Section ${existing.section_name} during period "${existing.period_name}" on ${day_of_week}.`,
          error: 'Conflict',
          paylod: null
        }, { status: 400 });
      }
    }

    const newRoutine = await query(
      `INSERT INTO class_routines (class_subject_id, section_id, teacher_id, period_id, day_of_week, room_number)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        class_subject_id,
        section_id,
        teacher_id ? parseInt(teacher_id, 10) : null,
        parseInt(period_id, 10),
        day_of_week,
        room_number ? room_number.trim() : null
      ]
    );

    const res_data = { message: 'Class routine entry created successfully.', routine: newRoutine.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating class routine:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create class routine.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
