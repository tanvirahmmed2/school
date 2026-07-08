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
             t.name as teacher_name, 
             st.name as staff_name, 
             st.role as staff_role
      FROM salaries s
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN staff st ON s.staff_id = st.id
    `;

    if (type === 'teacher') {
      sql += ` WHERE s.teacher_id IS NOT NULL`;
    } else if (type === 'staff') {
      sql += ` WHERE s.staff_id IS NOT NULL`;
    }

    sql += ` ORDER BY s.id DESC`;

    const result = await query(sql);
    return NextResponse.json({ salaries: result.rows });
  } catch (error) {
    console.error('Error fetching salaries:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
