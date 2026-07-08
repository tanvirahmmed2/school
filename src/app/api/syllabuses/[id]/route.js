import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a syllabus (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, title, link, class_id, subject_id } = await request.json();

    if (!name || !title || !link || !class_id || !subject_id) {
      return NextResponse.json(
        { error: 'All fields (Name, Title, Document Link, Class, Subject) are required.' },
        { status: 400 }
      );
    }

    // Verify class exists
    const classCheck = await query('SELECT id FROM classes WHERE id = $1', [class_id]);
    if (classCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Target class not found.' }, { status: 404 });
    }

    // Verify subject exists
    const subjectCheck = await query('SELECT id FROM subjects WHERE id = $1', [subject_id]);
    if (subjectCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Target subject not found.' }, { status: 404 });
    }

    const updatedSyllabus = await query(
      `UPDATE syllabuses 
       SET name = $1, title = $2, link = $3, class_id = $4, subject_id = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING *`,
      [name.trim(), title.trim(), link.trim(), class_id, subject_id, id]
    );

    if (updatedSyllabus.rowCount === 0) {
      return NextResponse.json({ error: 'Syllabus not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Syllabus updated successfully.',
      syllabus: updatedSyllabus.rows[0]
    });
  } catch (error) {
    console.error('Error updating syllabus:', error);
    return NextResponse.json(
      { error: 'Failed to update syllabus. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a syllabus (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM syllabuses WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Syllabus not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Syllabus deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting syllabus:', error);
    return NextResponse.json(
      { error: 'Failed to delete syllabus. Internal server error.' },
      { status: 500 }
    );
  }
}
