import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all class-subject mappings
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        cs.*, 
        c.name AS class_name, 
        c.code AS class_code,
        s.name AS section_name, 
        sub.name AS subject_name, 
        sub.code AS subject_code,
        t.name AS teacher_name
      FROM class_subjects cs
      JOIN classes c ON cs.class_id = c.id
      LEFT JOIN sections s ON cs.section_id = s.id
      JOIN subjects sub ON cs.subject_id = sub.id
      LEFT JOIN teachers t ON cs.teacher_id = t.id
      ORDER BY c.numeric_name ASC, s.name ASC, sub.name ASC
    `);
    const res_data_790 = { assignments: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_790?.message || 'Successfully fecthed data',
        paylod: res_data_790
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching class-subjects assignments:', error);
    const res_err_1170 = { error: 'Failed to retrieve assignments. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_1170?.error || res_err_1170?.message || 'An error occurred',
        error: res_err_1170?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST create a class-subject mapping (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_1694 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_1694?.error || res_err_1694?.message || 'An error occurred',
        error: res_err_1694?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { class_id, section_id, subject_id, teacher_id } = await request.json();

    if (!class_id || !subject_id) {
      const res_err_2143 = { error: 'Class ID and Subject ID are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_2143?.error || res_err_2143?.message || 'An error occurred',
        error: res_err_2143?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Clean up nullable IDs
    const sectId = section_id ? parseInt(section_id, 10) : null;
    const teachId = teacher_id ? parseInt(teacher_id, 10) : null;

    // Check duplicate mapping
    let checkDup;
    if (sectId === null) {
      checkDup = await query(
        'SELECT id FROM class_subjects WHERE class_id = $1 AND section_id IS NULL AND subject_id = $2',
        [class_id, subject_id]
      );
    } else {
      checkDup = await query(
        'SELECT id FROM class_subjects WHERE class_id = $1 AND section_id = $2 AND subject_id = $3',
        [class_id, sectId, subject_id]
      );
    }

    if (checkDup.rows.length > 0) {
      const res_err_3129 = { error: 'This subject is already mapped to the selected class/section. Edit the mapping to change the teacher.' };
      return NextResponse.json({
        success: false,
        message: res_err_3129?.error || res_err_3129?.message || 'An error occurred',
        error: res_err_3129?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const newMapping = await query(
      `INSERT INTO class_subjects (class_id, section_id, subject_id, teacher_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [class_id, sectId, subject_id, teachId]
    );

    const res_data_2870 = { message: 'Class subject assignment created successfully.', assignment: newMapping.rows[0] };
      return NextResponse.json({
        success: true,
        message: res_data_2870?.message || 'Successfully fecthed data',
        paylod: res_data_2870
      }, { status: 201 });
  } catch (error) {
    console.error('Error assigning class subject:', error);
    const res_err_4237 = { error: 'Failed to create class subject mapping. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_4237?.error || res_err_4237?.message || 'An error occurred',
        error: res_err_4237?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
