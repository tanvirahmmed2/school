import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update event (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { title, description, event_date, location } = await request.json();

    if (!title || !description || !event_date || !location) {
      return NextResponse.json(
        { error: 'All fields (title, description, event_date, location) are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE events 
       SET title = $1, description = $2, event_date = $3, location = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [title.trim(), description.trim(), event_date, location.trim(), id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Event updated successfully.',
      event: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE event (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Event deleted successfully.',
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event. Internal server error.' },
      { status: 500 }
    );
  }
}
