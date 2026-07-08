import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update class-subject mapping (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { class_id, section_id, subject_id, teacher_id } = await request.json();

    if (!class_id || !subject_id) {
      return NextResponse.json(
        { error: 'Class ID and Subject ID are required.' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'This subject is already mapped to the selected class/section in another assignment.' },
        { status: 400 }
      );
    }

    const updatedMapping = await query(
      `UPDATE class_subjects 
       SET class_id = $1, section_id = $2, subject_id = $3, teacher_id = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [class_id, sectId, subject_id, teachId, id]
    );

    if (updatedMapping.rowCount === 0) {
      return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Class subject assignment updated successfully.',
      assignment: updatedMapping.rows[0]
    });
  } catch (error) {
    console.error('Error updating class subject mapping:', error);
    return NextResponse.json(
      { error: 'Failed to update mapping. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a class-subject mapping (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM class_subjects WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Class subject assignment deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment. Internal server error.' },
      { status: 500 }
    );
  }
}
