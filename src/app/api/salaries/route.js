import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let sql = `
      SELECT s.*, 
             t.name as teacher_name
      FROM salaries s
      LEFT JOIN teachers t ON s.teacher_id = t.id
    `;

    if (type === 'teacher') {
      sql += ` WHERE s.teacher_id IS NOT NULL`;
    }

    sql += ` ORDER BY s.id DESC`;

    const result = await query(sql);
    return NextResponse.json({ salaries: result.rows });
  } catch (error) {
    console.error('Error fetching salaries:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
