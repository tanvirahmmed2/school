import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isRegistrar } from '@/lib/auth';

// PUT update notice (Registrar only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isRegistrar();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Registrars only.' }, { status: 403 });
    }

    const { id } = await params;
    const { title, link, is_pinned = false } = await request.json();

    if (!title || !link) {
      return NextResponse.json(
        { error: 'Title and Google Drive Link are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE notices 
       SET title = $1, link = $2, is_pinned = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 
       RETURNING *`,
      [title.trim(), link.trim(), !!is_pinned, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Notice not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Notice updated successfully.',
      notice: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { error: 'Failed to update notice. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE notice (Registrar only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isRegistrar();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Registrars only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM notices WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Notice not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Notice deleted successfully.',
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { error: 'Failed to delete notice. Internal server error.' },
      { status: 500 }
    );
  }
}
