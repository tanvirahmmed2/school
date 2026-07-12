import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { comparePassword, signJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      const res_err_319 = { error: 'Email and password are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_319?.error || res_err_319?.message || 'An error occurred',
        error: res_err_319?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Find teacher
    const result = await query('SELECT * FROM teachers WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (result.rows.length === 0) {
      const res_err_811 = { error: 'Invalid email or password.' };
      return NextResponse.json({
        success: false,
        message: res_err_811?.error || res_err_811?.message || 'An error occurred',
        error: res_err_811?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const teacher = result.rows[0];

    // Check if teacher completed registration setup
    if (!teacher.is_registered) {
      const res_err_1260 = { error: 'This teacher account has not completed setup yet. Please self-register first.' };
      return NextResponse.json({
        success: false,
        message: res_err_1260?.error || res_err_1260?.message || 'An error occurred',
        error: res_err_1260?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    // Check if teacher is active
    if (!teacher.is_active) {
      const res_err_1704 = { error: 'This teacher account has been deactivated. Please contact administration.' };
      return NextResponse.json({
        success: false,
        message: res_err_1704?.error || res_err_1704?.message || 'An error occurred',
        error: res_err_1704?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, teacher.password_hash);
    if (!isPasswordValid) {
      const res_err_2215 = { error: 'Invalid email or password.' };
      return NextResponse.json({
        success: false,
        message: res_err_2215?.error || res_err_2215?.message || 'An error occurred',
        error: res_err_2215?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    // Generate JWT token
    const token = signJWT({ id: teacher.id, email: teacher.email, name: teacher.name, role: 'teacher' });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('fit-teacher', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict',
    });

    const res_data_1837 = {
      message: 'Teacher login successful.',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        number: teacher.number,
        designation: teacher.designation,
        address: teacher.address,
        is_active: teacher.is_active,
        is_registered: teacher.is_registered
      }
    };
      return NextResponse.json({
        success: true,
        message: res_data_1837?.message || 'Successfully fecthed data',
        paylod: res_data_1837
      }, { status: 200 });
  } catch (error) {
    console.error('Error logging in teacher:', error);
    const res_err_3679 = { error: 'Failed to authenticate. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_3679?.error || res_err_3679?.message || 'An error occurred',
        error: res_err_3679?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
