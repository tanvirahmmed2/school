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

    // Find admin
    const result = await query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      const res_err_786 = { error: 'Invalid email or password.' };
      return NextResponse.json({
        success: false,
        message: res_err_786?.error || res_err_786?.message || 'An error occurred',
        error: res_err_786?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const admin = result.rows[0];

    // Check if admin is active
    if (!admin.is_active) {
      const res_err_1206 = { error: 'This administrative account has been deactivated. Please contact support.' };
      return NextResponse.json({
        success: false,
        message: res_err_1206?.error || res_err_1206?.message || 'An error occurred',
        error: res_err_1206?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password_hash);
    if (!isPasswordValid) {
      const res_err_1715 = { error: 'Invalid email or password.' };
      return NextResponse.json({
        success: false,
        message: res_err_1715?.error || res_err_1715?.message || 'An error occurred',
        error: res_err_1715?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    // Generate JWT token
    const token = signJWT({ id: admin.id, email: admin.email, name: admin.name });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('fit-admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict',
    });

    const res_data_1544 = {
      message: 'Login successful.',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        number: admin.number,
        address: admin.address,
        is_active: admin.is_active,
      }
    };
      return NextResponse.json({
        success: true,
        message: res_data_1544?.message || 'Successfully fecthed data',
        paylod: res_data_1544
      }, { status: 200 });
  } catch (error) {
    console.error('Error logging in admin:', error);
    const res_err_3043 = { error: 'Failed to authenticate. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_3043?.error || res_err_3043?.message || 'An error occurred',
        error: res_err_3043?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
