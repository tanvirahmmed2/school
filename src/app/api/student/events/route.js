import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT, isStudent } from '@/lib/auth';
import { query } from '@/lib/db';

// GET all events and join status for logged-in student
export async function GET() {
  try {
    const authenticated = await isStudent();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Students only.' }, { status: 403 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const studentId = decoded.id;

    // Fetch all events
    const eventsRes = await query('SELECT * FROM events ORDER BY event_date ASC');

    // Fetch student's joined events
    const joinedRes = await query('SELECT event_id FROM event_participants WHERE student_id = $1', [studentId]);
    const joinedEventIds = joinedRes.rows.map(row => String(row.event_id));

    return NextResponse.json({
      events: eventsRes.rows,
      joinedEventIds
    });
  } catch (error) {
    console.error('Error fetching student events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST join or leave an event (Students only)
export async function POST(request) {
  try {
    const authenticated = await isStudent();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Students only.' }, { status: 403 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const studentId = decoded.id;
    const { event_id, action } = await request.json();

    if (!event_id || !action || !['join', 'leave'].includes(action)) {
      return NextResponse.json({ error: 'event_id and action (join/leave) are required.' }, { status: 400 });
    }

    if (action === 'join') {
      await query(
        'INSERT INTO event_participants (event_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [event_id, studentId]
      );
      return NextResponse.json({ message: 'Successfully registered for the event.' });
    } else {
      await query(
        'DELETE FROM event_participants WHERE event_id = $1 AND student_id = $2',
        [event_id, studentId]
      );
      return NextResponse.json({ message: 'Successfully cancelled event registration.' });
    }
  } catch (error) {
    console.error('Error modifying event participation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
