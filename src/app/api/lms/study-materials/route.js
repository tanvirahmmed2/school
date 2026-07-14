import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isTeacher, isAdmin, isStudent } from '@/lib/auth';

// GET study materials
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classSubjectId = searchParams.get('class_subject_id');

    if (!classSubjectId) {
      const res_err = { error: 'class_subject_id query parameter is required.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    // Verify authentication
    const teacherAuth = await isTeacher();
    const studentAuth = await isStudent();
    const adminAuth = await isAdmin();

    if (!teacherAuth && !studentAuth && !adminAuth) {
      const res_err = { error: 'Unauthorized.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 401 });
    }

    const result = await query(
      `SELECT sm.*, cs.class_id, cs.section_id, cs.subject_id,
              c.name AS class_name, s.name AS subject_name
       FROM study_materials sm
       JOIN class_subjects cs ON sm.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects s ON cs.subject_id = s.id
       WHERE sm.class_subject_id = $1
       ORDER BY sm.created_at DESC`,
      [classSubjectId]
    );

    const res_data = { study_materials: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Study materials fetched successfully',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    const res_err = { error: 'Failed to retrieve study materials.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}

// POST create study material (Teacher/Admin only)
export async function POST(request) {
  try {
    const teacherAuth = await isTeacher();
    const adminAuth = await isAdmin();

    if (!teacherAuth && !adminAuth) {
      const res_err = { error: 'Unauthorized. Teachers or Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 403 });
    }

    const { class_subject_id, title, description, file_url, file_id } = await request.json();

    if (!class_subject_id || !title || !file_url) {
      const res_err = { error: 'Class subject, title, and file link are required.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    // Verify class subject exists
    const csCheck = await query('SELECT id FROM class_subjects WHERE id = $1', [class_subject_id]);
    if (csCheck.rows.length === 0) {
      const res_err = { error: 'Class subject mapping not found.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 404 });
    }

    const insertRes = await query(
      `INSERT INTO study_materials (class_subject_id, title, description, file_url, file_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [class_subject_id, title.trim(), description ? description.trim() : null, file_url.trim(), file_id || null]
    );

    const res_data = { message: 'Study material created successfully.', study_material: insertRes.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating study material:', error);
    const res_err = { error: 'Failed to create study material.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}
