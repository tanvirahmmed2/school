import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET participants for a specific event (Admin only)
export async function GET(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query(
      `SELECT s.id, s.name, s.email, s.registration_number, ep.joined_at 
       FROM event_participants ep 
       JOIN students s ON ep.student_id = s.id 
       WHERE ep.event_id = $1
       ORDER BY ep.joined_at DESC`,
      [id]
    );

    return NextResponse.json({ participants: result.rows });
  } catch (error) {
    console.error('Error fetching event participants:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve event participants. Internal server error.' },
      { status: 500 }
    );
  }
}
