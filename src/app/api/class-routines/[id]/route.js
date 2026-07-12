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
        message: res_err_299?.error || res_err_299?.message || 'An error occurred',
        error: res_err_299?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;
    const { class_id, section_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number } = await request.json();

    if (!class_id || !section_id || !subject_id || !day_of_week || !start_time || !end_time) {
      const res_err_884 = { error: 'Class, Section, Subject, Day, Start Time, and End Time are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_884?.error || res_err_884?.message || 'An error occurred',
        error: res_err_884?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    if (start_time >= end_time) {
      const res_err_1285 = { error: 'Start time must be strictly before end time.' };
      return NextResponse.json({
        success: false,
        message: res_err_1285?.error || res_err_1285?.message || 'An error occurred',
        error: res_err_1285?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check Section Overlap (excluding this routine entry)
    const sectionOverlap = await query(
      `SELECT cr.id, cr.start_time, cr.end_time, sub.name as subject_name
       FROM class_routines cr
       JOIN subjects sub ON cr.subject_id = sub.id
       WHERE cr.section_id = $1 
         AND cr.day_of_week = $2 
         AND cr.start_time < $3 
         AND cr.end_time > $4
         AND cr.id <> $5`,
      [section_id, day_of_week, end_time, start_time, id]
    );

    if (sectionOverlap.rows.length > 0) {
      const existing = sectionOverlap.rows[0];
      const res_err_2199 = { error: `Section overlap detected. The section already has class "${existing.subject_name}" scheduled from ${existing.start_time} to ${existing.end_time} on ${day_of_week}.` };
      return NextResponse.json({
        success: false,
        message: res_err_2199?.error || res_err_2199?.message || 'An error occurred',
        error: res_err_2199?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check Teacher Overlap (excluding this routine entry)
    if (teacher_id) {
      const teacherOverlap = await query(
        `SELECT cr.id, cr.start_time, cr.end_time, c.name as class_name, s.name as section_name
         FROM class_routines cr
         JOIN classes c ON cr.class_id = c.id
         JOIN sections s ON cr.section_id = s.id
         WHERE cr.teacher_id = $1 
           AND cr.day_of_week = $2 
           AND cr.start_time < $3 
           AND cr.end_time > $4
           AND cr.id <> $5`,
        [teacher_id, day_of_week, end_time, start_time, id]
      );

      if (teacherOverlap.rows.length > 0) {
        const existing = teacherOverlap.rows[0];
        const res_err_3344 = { error: `Teacher overlap detected. This teacher is already teaching Class ${existing.class_name} Section ${existing.section_name} from ${existing.start_time} to ${existing.end_time} on ${day_of_week}.` };
      return NextResponse.json({
        success: false,
        message: res_err_3344?.error || res_err_3344?.message || 'An error occurred',
        error: res_err_3344?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
      }
    }

    const updatedRoutine = await query(
      `UPDATE class_routines
       SET class_id = $1, section_id = $2, subject_id = $3, teacher_id = $4, 
           day_of_week = $5, start_time = $6, end_time = $7, room_number = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        class_id,
        section_id,
        subject_id,
        teacher_id ? parseInt(teacher_id, 10) : null,
        day_of_week,
        start_time,
        end_time,
        room_number ? room_number.trim() : null,
        id
      ]
    );

    if (updatedRoutine.rowCount === 0) {
      const res_err_4452 = { error: 'Class routine entry not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_4452?.error || res_err_4452?.message || 'An error occurred',
        error: res_err_4452?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_3441 = {
      message: 'Class routine entry updated successfully.',
      routine: updatedRoutine.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_3441?.message || 'Successfully fecthed data',
        paylod: res_data_3441
      }, { status: 200 });
  } catch (error) {
    console.error('Error updating class routine:', error);
    const res_err_5275 = { error: 'Failed to update class routine. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_5275?.error || res_err_5275?.message || 'An error occurred',
        error: res_err_5275?.error || 'Internal Server Error',
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
        message: res_err_5800?.error || res_err_5800?.message || 'An error occurred',
        error: res_err_5800?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM class_routines WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      const res_err_6304 = { error: 'Class routine entry not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_6304?.error || res_err_6304?.message || 'An error occurred',
        error: res_err_6304?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_4597 = {
      message: 'Class routine entry deleted successfully.'
    };
      return NextResponse.json({
        success: true,
        message: res_data_4597?.message || 'Successfully fecthed data',
        paylod: res_data_4597
      }, { status: 200 });
  } catch (error) {
    console.error('Error deleting class routine:', error);
    const res_err_7088 = { error: 'Failed to delete class routine. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_7088?.error || res_err_7088?.message || 'An error occurred',
        error: res_err_7088?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
