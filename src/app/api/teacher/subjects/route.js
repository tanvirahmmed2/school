import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
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

    const res_data_1225 = { subjects: subjectsRes.rows };
      return NextResponse.json({
        success: true,
        message: res_data_1225?.message || 'Successfully fecthed data',
        paylod: res_data_1225
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching teacher subjects:', error);
    const res_err_2059 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_2059?.error || res_err_2059?.message || 'An error occurred',
        error: res_err_2059?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
