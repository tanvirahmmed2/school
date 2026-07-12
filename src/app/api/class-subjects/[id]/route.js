import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update class-subject mapping (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_305 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_305?.error || res_err_305?.message || 'An error occurred',
        error: res_err_305?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;
    const { class_id, section_id, subject_id, teacher_id } = await request.json();

    if (!class_id || !subject_id) {
      const res_err_783 = { error: 'Class ID and Subject ID are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_783?.error || res_err_783?.message || 'An error occurred',
        error: res_err_783?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const sectId = section_id ? parseInt(section_id, 10) : null;
    const teachId = teacher_id ? parseInt(teacher_id, 10) : null;

    // Check duplicate mapping (excluding current mapping)
    let checkDup;
    if (sectId === null) {
      checkDup = await query(
        'SELECT id FROM class_subjects WHERE class_id = $1 AND section_id IS NULL AND subject_id = $2 AND id <> $3',
        [class_id, subject_id, id]
      );
    } else {
      checkDup = await query(
        'SELECT id FROM class_subjects WHERE class_id = $1 AND section_id = $2 AND subject_id = $3 AND id <> $4',
        [class_id, sectId, subject_id, id]
      );
    }

    if (checkDup.rows.length > 0) {
      const res_err_1798 = { error: 'This subject is already mapped to the selected class/section in another assignment.' };
      return NextResponse.json({
        success: false,
        message: res_err_1798?.error || res_err_1798?.message || 'An error occurred',
        error: res_err_1798?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const updatedMapping = await query(
      `UPDATE class_subjects 
       SET class_id = $1, section_id = $2, subject_id = $3, teacher_id = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [class_id, sectId, subject_id, teachId, id]
    );

    if (updatedMapping.rowCount === 0) {
      const res_err_2505 = { error: 'Assignment not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_2505?.error || res_err_2505?.message || 'An error occurred',
        error: res_err_2505?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_1949 = {
      message: 'Class subject assignment updated successfully.',
      assignment: updatedMapping.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_1949?.message || 'Successfully fecthed data',
        paylod: res_data_1949
      }, { status: 200 });
  } catch (error) {
    console.error('Error updating class subject mapping:', error);
    const res_err_3335 = { error: 'Failed to update mapping. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_3335?.error || res_err_3335?.message || 'An error occurred',
        error: res_err_3335?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// DELETE a class-subject mapping (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_3862 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_3862?.error || res_err_3862?.message || 'An error occurred',
        error: res_err_3862?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM class_subjects WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      const res_err_4366 = { error: 'Assignment not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_4366?.error || res_err_4366?.message || 'An error occurred',
        error: res_err_4366?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_3114 = {
      message: 'Class subject assignment deleted successfully.'
    };
      return NextResponse.json({
        success: true,
        message: res_data_3114?.message || 'Successfully fecthed data',
        paylod: res_data_3114
      }, { status: 200 });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    const res_err_5143 = { error: 'Failed to delete assignment. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_5143?.error || res_err_5143?.message || 'An error occurred',
        error: res_err_5143?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
