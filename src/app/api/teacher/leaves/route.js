import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

// GET leave applications submitted by the logged-in teacher
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const teacherId = decoded.id;

    const result = await query(`
      SELECT id, type, start_date, end_date, reason, status, created_at
      FROM leave_applications
      WHERE teacher_id = $1
      ORDER BY created_at DESC
    `, [teacherId]);

    return NextResponse.json({ applications: result.rows });
  } catch (error) {
    console.error('Error fetching teacher leave applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST submit a new leave application
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const teacherId = decoded.id;
    const { type, start_date, end_date, reason } = await request.json();

    if (!type || !start_date || !end_date || !reason) {
      return NextResponse.json({ error: 'All fields (type, start_date, end_date, reason) are required.' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO leave_applications (teacher_id, type, start_date, end_date, reason)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, type, start_date, end_date, reason, status, created_at
    `, [teacherId, type.trim(), start_date, end_date, reason.trim()]);

    return NextResponse.json({
      message: 'Leave application submitted successfully.',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting teacher leave application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
