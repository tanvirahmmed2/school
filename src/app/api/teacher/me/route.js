import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

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

    // Direct database validation check
    const result = await query(`
      SELECT id, name, email, number, designation, address, is_active, is_registered
      FROM teachers
      WHERE id = $1 AND is_active = TRUE AND is_registered = TRUE
    `, [decoded.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Teacher account is inactive or not found' }, { status: 404 });
    }

    return NextResponse.json({
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error('Error in teacher/me endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
