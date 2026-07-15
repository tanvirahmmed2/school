import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a class routine (Admin only)
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
    const { class_subject_id, section_id, teacher_id, day_of_week, period_id, room_number } = await request.json();

    if (!class_subject_id || !section_id || !day_of_week || !period_id) {
      return NextResponse.json({
        success: false,
        message: 'Class Subject, Section, Day, and Period are required.',
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

    // Check Section Overlap (excluding this routine entry)
    const sectionOverlap = await query(
      `SELECT cr.id, sub.name as subject_name, p.name as period_name
       FROM class_routines cr
       JOIN class_subjects cs ON cr.class_subject_id = cs.id
       JOIN subjects sub ON cs.subject_id = sub.id
       JOIN periods p ON cr.period_id = p.id
       WHERE cr.section_id = $1 
         AND cr.day_of_week = $2 
         AND cr.period_id = $3
         AND cr.id <> $4`,
      [section_id, day_of_week, period_id, id]
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

    // Check Teacher Overlap (excluding this routine entry)
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
           AND cr.period_id = $3
           AND cr.id <> $4`,
        [teacher_id, day_of_week, period_id, id]
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

    const updatedRoutine = await query(
      `UPDATE class_routines
       SET class_subject_id = $1, section_id = $2, teacher_id = $3, 
           period_id = $4, day_of_week = $5, room_number = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        class_subject_id,
        section_id,
        teacher_id ? parseInt(teacher_id, 10) : null,
        parseInt(period_id, 10),
        day_of_week,
        room_number ? room_number.trim() : null,
        id
      ]
    );

    if (updatedRoutine.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Class routine entry not found.',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }

    const res_data = {
      message: 'Class routine entry updated successfully.',
      routine: updatedRoutine.rows[0]
    };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating class routine:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update class routine.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// DELETE a class routine (Admin only)
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

    const deleteResult = await query('DELETE FROM class_routines WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Class routine entry not found.',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }

    const res_data = {
      message: 'Class routine entry deleted successfully.'
    };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting class routine:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete class routine.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
