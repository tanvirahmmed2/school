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
      const res_err_1582 = { error: 'Student account is inactive or not found' };
      return NextResponse.json({
        success: false,
        message: res_err_1582?.error || res_err_1582?.message || 'An error occurred',
        error: res_err_1582?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_1277 = {
      student: result.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_1277?.message || 'Successfully fecthed data',
        paylod: res_data_1277
      }, { status: 200 });
  } catch (error) {
    console.error('Error in student/me endpoint:', error);
    const res_err_2347 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_2347?.error || res_err_2347?.message || 'An error occurred',
        error: res_err_2347?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
