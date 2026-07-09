import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isRegistrar } from '@/lib/auth';

// PUT update news (Registrar only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isRegistrar();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Registrars only.' }, { status: 403 });
    }

    const { id } = await params;
    const { title, content, image, image_id } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE news 
       SET title = $1, content = $2, image = $3, image_id = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [title.trim(), content.trim(), image ? image.trim() : null, image_id ? image_id.trim() : null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News article not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'News article updated successfully.',
      news: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news article. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE news (Registrar only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isRegistrar();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Registrars only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News article not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'News article deleted successfully.',
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article. Internal server error.' },
      { status: 500 }
    );
  }
}
