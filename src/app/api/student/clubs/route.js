import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

// GET list of all clubs and join status
export async function GET() {
  try {
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

    // Fetch all clubs
    const allClubsRes = await query('SELECT * FROM clubs ORDER BY name ASC');

    // Fetch student's joined clubs
    const joinedClubsRes = await query('SELECT club_id FROM club_members WHERE student_id = $1', [studentId]);
    const joinedClubIds = joinedClubsRes.rows.map(row => String(row.club_id));

    return NextResponse.json({
      clubs: allClubsRes.rows,
      joinedClubIds
    });
  } catch (error) {
    console.error('Error fetching student clubs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST join or leave a club
export async function POST(request) {
  try {
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
    const { club_id, action } = await request.json();

    if (!club_id || !action || !['join', 'leave'].includes(action)) {
      return NextResponse.json({ error: 'club_id and action (join/leave) are required.' }, { status: 400 });
    }

    if (action === 'join') {
      await query(
        'INSERT INTO club_members (club_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [club_id, studentId]
      );
      return NextResponse.json({ message: 'Successfully joined the club.' });
    } else {
      await query(
        'DELETE FROM club_members WHERE club_id = $1 AND student_id = $2',
        [club_id, studentId]
      );
      return NextResponse.json({ message: 'Successfully left the club.' });
    }
  } catch (error) {
    console.error('Error modifying club membership:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
