import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const result = await query(
      `SELECT ta.*, t.name as teacher_name 
       FROM teacher_attendances ta
       JOIN teachers t ON ta.teacher_id = t.id
       ORDER BY ta.date DESC, t.name ASC`
    );

    return NextResponse.json({ attendances: result.rows });
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
