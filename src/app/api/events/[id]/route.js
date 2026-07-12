import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update event (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_289 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_289?.error || res_err_289?.message || 'An error occurred',
        error: res_err_289?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;
    const { title, description, event_date, location } = await request.json();

    if (!title || !description || !event_date || !location) {
      const res_err_789 = { error: 'All fields (title, description, event_date, location) are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_789?.error || res_err_789?.message || 'An error occurred',
        error: res_err_789?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `UPDATE events 
       SET title = $1, description = $2, event_date = $3, location = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [title.trim(), description.trim(), event_date, location.trim(), id]
    );

    if (result.rows.length === 0) {
      const res_err_1474 = { error: 'Event not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_1474?.error || res_err_1474?.message || 'An error occurred',
        error: res_err_1474?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_1145 = {
      message: 'Event updated successfully.',
      event: result.rows[0],
    };
      return NextResponse.json({
        success: true,
        message: res_data_1145?.message || 'Successfully fecthed data',
        paylod: res_data_1145
      }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    const res_err_2252 = { error: 'Failed to update event. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_2252?.error || res_err_2252?.message || 'An error occurred',
        error: res_err_2252?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// DELETE event (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_2759 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_2759?.error || res_err_2759?.message || 'An error occurred',
        error: res_err_2759?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      const res_err_3246 = { error: 'Event not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_3246?.error || res_err_3246?.message || 'An error occurred',
        error: res_err_3246?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_2221 = {
      message: 'Event deleted successfully.',
      id: result.rows[0].id,
    };
      return NextResponse.json({
        success: true,
        message: res_data_2221?.message || 'Successfully fecthed data',
        paylod: res_data_2221
      }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    const res_err_4024 = { error: 'Failed to delete event. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_4024?.error || res_err_4024?.message || 'An error occurred',
        error: res_err_4024?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
