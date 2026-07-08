import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

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

    // Direct database validation check, returning class/section info
    const result = await query(`
      SELECT s.id, s.name, s.email, s.phone, s.registration_number, s.date_of_birth, s.address, s.parents_info,
             s.class_id, s.section_id, c.name as class_name, sec.name as section_name
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE s.id = $1 AND s.is_active = TRUE AND s.is_registered = TRUE
    `, [decoded.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Student account is inactive or not found' }, { status: 404 });
    }

    return NextResponse.json({
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Error in student/me endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
