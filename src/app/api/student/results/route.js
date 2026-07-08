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

    // Fetch published results for this student
    const resultsRes = await query(`
      SELECT r.id, r.gpa, r.grade, r.total_marks, r.status,
             e.id as exam_id, e.name as exam_name, e.term as exam_term,
             rp.published_at
      FROM results r
      JOIN exams e ON r.exam_id = e.id
      JOIN result_publish rp ON rp.exam_id = e.id
      WHERE r.student_id = $1 AND rp.is_published = TRUE
      ORDER BY rp.published_at DESC
    `, [studentId]);

    // Fetch subject-wise marks for this student's published exams
    const marksRes = await query(`
      SELECT m.id, m.exam_id, m.marks_obtained, m.total_marks, m.remarks,
             sub.name as subject_name, sub.code as subject_code
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.id
      JOIN result_publish rp ON m.exam_id = rp.exam_id
      WHERE m.student_id = $1 AND rp.is_published = TRUE
      ORDER BY m.exam_id ASC, sub.name ASC
    `, [studentId]);

    return NextResponse.json({
      results: resultsRes.rows,
      marks: marksRes.rows
    });
  } catch (error) {
    console.error('Error fetching student results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
