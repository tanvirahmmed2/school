import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isRegistrar } from '@/lib/auth';

// GET all events
export async function GET() {
  try {
    const result = await query('SELECT * FROM events ORDER BY event_date ASC');
    return NextResponse.json({ events: result.rows });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve events. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create event (Registrar only)
export async function POST(request) {
  try {
    const authenticated = await isRegistrar();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Registrars only.' }, { status: 403 });
    }

    const { title, description, event_date, location } = await request.json();

    if (!title || !description || !event_date || !location) {
      return NextResponse.json(
        { error: 'All fields (title, description, event_date, location) are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO events (title, description, event_date, location) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title.trim(), description.trim(), event_date, location.trim()]
    );

    return NextResponse.json(
      { message: 'Event created successfully.', event: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event. Internal server error.' },
      { status: 500 }
    );
  }
}
