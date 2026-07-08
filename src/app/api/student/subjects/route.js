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

    const studentId = decoded.id;

    // Get student class & section
    const studentRes = await query(`
      SELECT class_id, section_id FROM students WHERE id = $1
    `, [studentId]);

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { class_id, section_id } = studentRes.rows[0];

    // Fetch subjects mapping to the class/section and left join their syllabus details
    const subjectsRes = await query(`
      SELECT sub.id as subject_id, sub.name as subject_name, sub.code as subject_code,
             t.name as teacher_name, t.email as teacher_email,
             syl.title as syllabus_title, syl.link as syllabus_link
      FROM class_subjects cs
      JOIN subjects sub ON cs.subject_id = sub.id
      LEFT JOIN teachers t ON cs.teacher_id = t.id
      LEFT JOIN syllabuses syl ON cs.class_id = syl.class_id AND cs.subject_id = syl.subject_id
      WHERE cs.class_id = $1 AND (cs.section_id = $2 OR cs.section_id IS NULL)
      ORDER BY sub.name ASC
    `, [class_id, section_id]);

    return NextResponse.json({ subjects: subjectsRes.rows });
  } catch (error) {
    console.error('Error fetching student subjects and syllabus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
