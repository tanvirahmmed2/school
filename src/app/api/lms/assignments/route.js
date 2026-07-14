import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isTeacher, isAdmin, isStudent } from '@/lib/auth';

// GET assignments
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
      `SELECT a.*, cs.class_id, cs.section_id, cs.subject_id,
              c.name AS class_name, s.name AS subject_name
       FROM assignments a
       JOIN class_subjects cs ON a.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects s ON cs.subject_id = s.id
       WHERE a.class_subject_id = $1
       ORDER BY a.due_date ASC, a.created_at DESC`,
      [classSubjectId]
    );

    const res_data = { assignments: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Assignments fetched successfully',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    const res_err = { error: 'Failed to retrieve assignments.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}

// POST create assignment (Teacher/Admin only)
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

    const { class_subject_id, title, description, file_url, file_id, due_date, max_marks } = await request.json();

    if (!class_subject_id || !title || !description || !due_date) {
      const res_err = { error: 'Class subject, title, description, and due date are required.' };
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
      `INSERT INTO assignments (class_subject_id, title, description, file_url, file_id, due_date, max_marks)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        class_subject_id,
        title.trim(),
        description.trim(),
        file_url ? file_url.trim() : null,
        file_id || null,
        due_date,
        max_marks || 100.00
      ]
    );

    const res_data = { message: 'Assignment created successfully.', assignment: insertRes.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    const res_err = { error: 'Failed to create assignment.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}
