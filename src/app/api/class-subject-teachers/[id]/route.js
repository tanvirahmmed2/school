import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update class-subject-teacher mapping (Admin only)
export async function PUT(request, { params }) {
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

    const { id } = await params;
    const { class_subject_id, section_id, teacher_id, academic_year } = await request.json();

    if (!class_subject_id || !section_id || !teacher_id || !academic_year) {
      return NextResponse.json({
        success: false,
        message: 'Class Subject, Section, Teacher, and Academic Year are required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // Check duplicate mapping (excluding current mapping)
    const checkDup = await query(
      'SELECT id FROM class_subject_teachers WHERE class_subject_id = $1 AND section_id = $2 AND academic_year = $3 AND id <> $4',
      [class_subject_id, section_id, academic_year, id]
    );

    if (checkDup.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'This subject is already mapped to this section for the selected academic year.',
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }

    const updatedMapping = await query(
      `UPDATE class_subject_teachers 
       SET class_subject_id = $1, section_id = $2, teacher_id = $3, academic_year = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [class_subject_id, section_id, teacher_id, academic_year, id]
    );

    if (updatedMapping.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Assignment not found.',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }

    const res_data = {
      message: 'Teacher subject assignment updated successfully.',
      assignment: updatedMapping.rows[0]
    };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating teacher subject assignment:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update assignment.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// DELETE a class-subject-teacher mapping (Admin only)
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    const deleteResult = await query('DELETE FROM class_subject_teachers WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Assignment not found.',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }

    const res_data = {
      message: 'Teacher subject assignment deleted successfully.'
    };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting teacher subject assignment:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete assignment.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
