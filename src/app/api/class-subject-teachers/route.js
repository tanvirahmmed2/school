import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all class-subject-teacher mappings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');
    const teacherId = searchParams.get('teacher_id');

    let sql = `
      SELECT 
        cst.id,
        cst.class_subject_id,
        cst.section_id,
        cst.teacher_id,
        cst.academic_year,
        c.id AS class_id,
        c.name AS class_name,
        c.code AS class_code,
        s.name AS section_name,
        sub.id AS subject_id,
        sub.name AS subject_name,
        sub.code AS subject_code,
        t.name AS teacher_name
      FROM class_subject_teachers cst
      JOIN class_subjects cs ON cst.class_subject_id = cs.id
      JOIN classes c ON cs.class_id = c.id
      JOIN sections s ON cst.section_id = s.id
      JOIN subjects sub ON cs.subject_id = sub.id
      JOIN teachers t ON cst.teacher_id = t.id
    `;
    let params = [];
    let conditions = [];

    if (classId) {
      params.push(classId);
      conditions.push(`cs.class_id = $${params.length}`);
    }

    if (teacherId) {
      params.push(teacherId);
      conditions.push(`cst.teacher_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY c.numeric_name ASC, s.name ASC, sub.name ASC';

    const result = await query(sql, params);
    const res_data = { assignments: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched class subject teachers',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching class-subject-teachers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve assignments.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// POST create a class-subject-teacher mapping (Admin only)
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

    const { class_subject_id, section_id, teacher_id, academic_year } = await request.json();

    if (!class_subject_id || !section_id || !teacher_id || !academic_year) {
      return NextResponse.json({
        success: false,
        message: 'Class Subject, Section, Teacher, and Academic Year are required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // Check duplicate mapping
    const checkDup = await query(
      'SELECT id FROM class_subject_teachers WHERE class_subject_id = $1 AND section_id = $2 AND academic_year = $3',
      [class_subject_id, section_id, academic_year]
    );

    if (checkDup.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'This subject is already mapped to this section for the selected academic year.',
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }

    const newMapping = await query(
      `INSERT INTO class_subject_teachers (class_subject_id, section_id, teacher_id, academic_year) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [class_subject_id, section_id, teacher_id, academic_year]
    );

    const res_data = { message: 'Teacher assigned to subject successfully.', assignment: newMapping.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error assigning teacher to subject:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create teacher subject assignment.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
