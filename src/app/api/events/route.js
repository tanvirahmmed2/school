import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all events
export async function GET() {
  try {
    const result = await query('SELECT * FROM events ORDER BY event_date ASC');
    const res_data_306 = { events: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_306?.message || 'Successfully fecthed data',
        paylod: res_data_306
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    const res_err_661 = { error: 'Failed to retrieve events. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_661?.error || res_err_661?.message || 'An error occurred',
        error: res_err_661?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST create event (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_1158 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_1158?.error || res_err_1158?.message || 'An error occurred',
        error: res_err_1158?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { title, description, event_date, location } = await request.json();

    if (!title || !description || !event_date || !location) {
      const res_err_1629 = { error: 'All fields (title, description, event_date, location) are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_1629?.error || res_err_1629?.message || 'An error occurred',
        error: res_err_1629?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO events (title, description, event_date, location) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title.trim(), description.trim(), event_date, location.trim()]
    );

    const res_data_1580 = { message: 'Event created successfully.', event: result.rows[0] };
      return NextResponse.json({
        success: true,
        message: res_data_1580?.message || 'Successfully fecthed data',
        paylod: res_data_1580
      }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    const res_err_2674 = { error: 'Failed to create event. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_2674?.error || res_err_2674?.message || 'An error occurred',
        error: res_err_2674?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
