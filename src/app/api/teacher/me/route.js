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

    // Direct database validation check
    const result = await query(`
      SELECT id, name, email, number, designation, address, is_active, is_registered
      FROM teachers
      WHERE id = $1 AND is_active = TRUE AND is_registered = TRUE
    `, [decoded.id]);

    if (result.rows.length === 0) {
      const res_err_1330 = { error: 'Teacher account is inactive or not found' };
      return NextResponse.json({
        success: false,
        message: res_err_1330?.error || res_err_1330?.message || 'An error occurred',
        error: res_err_1330?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_1025 = {
      teacher: result.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_1025?.message || 'Successfully fecthed data',
        paylod: res_data_1025
      }, { status: 200 });
  } catch (error) {
    console.error('Error in teacher/me endpoint:', error);
    const res_err_2095 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_2095?.error || res_err_2095?.message || 'An error occurred',
        error: res_err_2095?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
