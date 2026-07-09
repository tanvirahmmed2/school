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
      SELECT la.*, 
             t.name as teacher_name
      FROM leave_applications la
      LEFT JOIN teachers t ON la.teacher_id = t.id
    `;

    if (type === 'teacher') {
      sql += ` WHERE la.teacher_id IS NOT NULL`;
    }

    sql += ` ORDER BY la.id DESC`;

    const result = await query(sql);
    return NextResponse.json({ applications: result.rows });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
