import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a class routine (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_299 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_299.error,
        error: res_err_299.error,
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;
    const { class_id, section_id, subject_id, teacher_id, day_of_week, period_id, room_number } = await request.json();

    if (!class_id || !section_id || !subject_id || !day_of_week || !period_id) {
      const res_err_884 = { error: 'Class, Section, Subject, Day, and Period are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_884.error,
        error: res_err_884.error,
        paylod: null
      }, { status: 400 });
    }

    // Verify Period exists
    const periodCheck = await query('SELECT * FROM periods WHERE id = $1', [period_id]);
    if (periodCheck.rows.length === 0) {
      const res_err = { error: 'Selected routine period not found.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    // Check Section Overlap (excluding this routine entry)
    const sectionOverlap = await query(
      `SELECT cr.id, sub.name as subject_name, p.name as period_name
       FROM class_routines cr
       JOIN subjects sub ON cr.subject_id = sub.id
       JOIN periods p ON cr.period_id = p.id
       WHERE cr.section_id = $1 
         AND cr.day_of_week = $2 
         AND cr.period_id = $3
         AND cr.id <> $4`,
      [section_id, day_of_week, period_id, id]
    );

    if (sectionOverlap.rows.length > 0) {
      const existing = sectionOverlap.rows[0];
      const res_err_2199 = { error: `Section overlap detected. The section already has class "${existing.subject_name}" scheduled during period "${existing.period_name}" on ${day_of_week}.` };
      return NextResponse.json({
        success: false,
        message: res_err_2199.error,
        error: res_err_2199.error,
        paylod: null
      }, { status: 400 });
    }

    // Check Teacher Overlap (excluding this routine entry)
    if (teacher_id) {
      const teacherOverlap = await query(
        `SELECT cr.id, c.name as class_name, s.name as section_name, p.name as period_name
         FROM class_routines cr
         JOIN classes c ON cr.class_id = c.id
         JOIN sections s ON cr.section_id = s.id
         JOIN periods p ON cr.period_id = p.id
         WHERE cr.teacher_id = $1 
           AND cr.day_of_week = $2 
           AND cr.period_id = $3
           AND cr.id <> $4`,
        [teacher_id, day_of_week, period_id, id]
      );

      if (teacherOverlap.rows.length > 0) {
        const existing = teacherOverlap.rows[0];
        const res_err_3344 = { error: `Teacher overlap detected. This teacher is already teaching Class ${existing.class_name} Section ${existing.section_name} during period "${existing.period_name}" on ${day_of_week}.` };
        return NextResponse.json({
          success: false,
          message: res_err_3344.error,
          error: res_err_3344.error,
          paylod: null
        }, { status: 400 });
      }
    }

    const updatedRoutine = await query(
      `UPDATE class_routines
       SET class_id = $1, section_id = $2, subject_id = $3, teacher_id = $4, 
           period_id = $5, day_of_week = $6, room_number = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        class_id,
        section_id,
        subject_id,
        teacher_id ? parseInt(teacher_id, 10) : null,
        parseInt(period_id, 10),
        day_of_week,
        room_number ? room_number.trim() : null,
        id
      ]
    );

    if (updatedRoutine.rowCount === 0) {
      const res_err_4452 = { error: 'Class routine entry not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_4452.error,
        error: res_err_4452.error,
        paylod: null
      }, { status: 404 });
    }

    const res_data_3441 = {
      message: 'Class routine entry updated successfully.',
      routine: updatedRoutine.rows[0]
    };
    return NextResponse.json({
      success: true,
      message: res_data_3441.message,
      paylod: res_data_3441
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating class routine:', error);
    const res_err_5275 = { error: 'Failed to update class routine. Internal server error.' };
    return NextResponse.json({
      success: false,
      message: res_err_5275.error,
      error: res_err_5275.error,
      paylod: null
    }, { status: 500 });
  }
}

// DELETE a class routine (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_5800 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_5800.error,
        error: res_err_5800.error,
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM class_routines WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      const res_err_6304 = { error: 'Class routine entry not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_6304.error,
        error: res_err_6304.error,
        paylod: null
      }, { status: 404 });
    }

    const res_data_4597 = {
      message: 'Class routine entry deleted successfully.'
    };
    return NextResponse.json({
      success: true,
      message: res_data_4597.message,
      paylod: res_data_4597
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting class routine:', error);
    const res_err_7088 = { error: 'Failed to delete class routine. Internal server error.' };
    return NextResponse.json({
      success: false,
      message: res_err_7088.error,
      error: res_err_7088.error,
      paylod: null
    }, { status: 500 });
  }
}
