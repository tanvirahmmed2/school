import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a subject (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, code } = await request.json();

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Subject Name and Subject Code are required.' },
        { status: 400 }
      );
    }

    // Check unique constraints (excluding current ID)
    const duplicateCheck = await query(
      'SELECT id, name, code FROM subjects WHERE (name = $1 OR code = $2) AND id <> $3',
      [name.trim(), code.trim().toUpperCase(), id]
    );

    if (duplicateCheck.rows.length > 0) {
      const match = duplicateCheck.rows[0];
      if (match.name === name.trim()) {
        return NextResponse.json({ error: 'A subject with this name already exists.' }, { status: 400 });
      }
      if (match.code === code.trim().toUpperCase()) {
        return NextResponse.json({ error: 'A subject with this code already exists.' }, { status: 400 });
      }
    }

    const updatedSubject = await query(
      `UPDATE subjects 
       SET name = $1, code = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [name.trim(), code.trim().toUpperCase(), id]
    );

    if (updatedSubject.rowCount === 0) {
      return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Subject updated successfully.',
      subject: updatedSubject.rows[0]
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json(
      { error: 'Failed to update subject. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a subject (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM subjects WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Subject deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Failed to delete subject. Internal server error.' },
      { status: 500 }
    );
  }
}
