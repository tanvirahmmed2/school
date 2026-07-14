import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) {
      const res_err_326 = { error: 'Not authenticated' };
      return NextResponse.json({
        success: false,
        message: res_err_326?.error || res_err_326?.message || 'An error occurred',
        error: res_err_326?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      const res_err_715 = { error: 'Invalid token' };
      return NextResponse.json({
        success: false,
        message: res_err_715?.error || res_err_715?.message || 'An error occurred',
        error: res_err_715?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const studentId = decoded.id;

    // Get student class & section
    const studentRes = await query(`
      SELECT class_id, section_id FROM students WHERE id = $1
    `, [studentId]);

    if (studentRes.rows.length === 0) {
      const res_err_1258 = { error: 'Student not found' };
      return NextResponse.json({
        success: false,
        message: res_err_1258?.error || res_err_1258?.message || 'An error occurred',
        error: res_err_1258?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const { class_id, section_id } = studentRes.rows[0];

    // Fetch subjects mapping to the class/section and left join their syllabus details
    const subjectsRes = await query(`
      SELECT cs.id as class_subject_id, sub.id as subject_id, sub.name as subject_name, sub.code as subject_code,
             t.name as teacher_name, t.email as teacher_email,
             syl.title as syllabus_title, syl.link as syllabus_link
      FROM class_subjects cs
      JOIN subjects sub ON cs.subject_id = sub.id
      LEFT JOIN teachers t ON cs.teacher_id = t.id
      LEFT JOIN syllabuses syl ON cs.class_id = syl.class_id AND cs.subject_id = syl.subject_id
      WHERE cs.class_id = $1 AND (cs.section_id = $2 OR cs.section_id IS NULL)
      ORDER BY sub.name ASC
    `, [class_id, section_id]);

    const res_data_1698 = { subjects: subjectsRes.rows };
      return NextResponse.json({
        success: true,
        message: res_data_1698?.message || 'Successfully fecthed data',
        paylod: res_data_1698
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student subjects and syllabus:', error);
    const res_err_2777 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_2777?.error || res_err_2777?.message || 'An error occurred',
        error: res_err_2777?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
