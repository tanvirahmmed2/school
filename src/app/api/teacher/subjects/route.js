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

    const teacherId = decoded.id;

    // Fetch subjects assigned to this teacher
    const subjectsRes = await query(`
      SELECT cs.id, cs.class_id, cs.section_id, cs.subject_id,
             c.name as class_name, 
             sec.name as section_name,
             sub.name as subject_name, sub.code as subject_code
      FROM class_subjects cs
      JOIN classes c ON cs.class_id = c.id
      LEFT JOIN sections sec ON cs.section_id = sec.id
      JOIN subjects sub ON cs.subject_id = sub.id
      WHERE cs.teacher_id = $1
      ORDER BY c.numeric_name ASC, sec.name ASC, sub.name ASC
    `, [teacherId]);

    return NextResponse.json({ subjects: subjectsRes.rows });
  } catch (error) {
    console.error('Error fetching teacher subjects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
