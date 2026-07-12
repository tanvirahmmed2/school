import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST: Verify if teacher email exists and is not yet registered
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      const res_err_310 = { error: 'Email address is required.' };
      return NextResponse.json({
        success: false,
        message: res_err_310?.error || res_err_310?.message || 'An error occurred',
        error: res_err_310?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `SELECT id, name, email, number, designation, is_registered 
       FROM teachers 
       WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      const res_err_861 = { error: 'Teacher email not found in our registry. Please contact admin.' };
      return NextResponse.json({
        success: false,
        message: res_err_861?.error || res_err_861?.message || 'An error occurred',
        error: res_err_861?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const teacher = result.rows[0];

    if (teacher.is_registered) {
      const res_err_1292 = { error: 'This teacher account is already registered. Please go to Login.' };
      return NextResponse.json({
        success: false,
        message: res_err_1292?.error || res_err_1292?.message || 'An error occurred',
        error: res_err_1292?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const res_data_1010 = {
      message: 'Teacher registry record verified successfully.',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        number: teacher.number,
        designation: teacher.designation
      }
    };
      return NextResponse.json({
        success: true,
        message: res_data_1010?.message || 'Successfully fecthed data',
        paylod: res_data_1010
      }, { status: 200 });
  } catch (error) {
    console.error('Error verifying teacher email:', error);
    const res_err_2296 = { error: 'Failed to verify teacher account. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_2296?.error || res_err_2296?.message || 'An error occurred',
        error: res_err_2296?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// PUT: Complete teacher account setup
export async function PUT(request) {
  try {
    const { email, address, password } = await request.json();

    if (!email || !address || !password) {
      const res_err_2846 = { error: 'All fields (email, address, password) are required to complete account setup.' };
      return NextResponse.json({
        success: false,
        message: res_err_2846?.error || res_err_2846?.message || 'An error occurred',
        error: res_err_2846?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Verify teacher exists and is unregistered
    const teacherCheck = await query(
      'SELECT id, is_registered FROM teachers WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (teacherCheck.rows.length === 0) {
      const res_err_3463 = { error: 'Teacher record not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_3463?.error || res_err_3463?.message || 'An error occurred',
        error: res_err_3463?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    if (teacherCheck.rows[0].is_registered) {
      const res_err_3837 = { error: 'This teacher account has already completed setup.' };
      return NextResponse.json({
        success: false,
        message: res_err_3837?.error || res_err_3837?.message || 'An error occurred',
        error: res_err_3837?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Hash password
    const hashedPass = await hashPassword(password);

    // Save and activate teacher account
    const result = await query(
      `UPDATE teachers
       SET address = $1, 
           password_hash = $2,
           is_registered = TRUE,
           is_active = TRUE,
           updated_at = CURRENT_TIMESTAMP
       WHERE LOWER(email) = LOWER($3)
       RETURNING id, name, email, designation, is_active, is_registered`,
      [address.trim(), hashedPass, email.trim()]
    );

    const res_data_3114 = {
      message: 'Teacher account setup completed successfully. You can now login.',
      teacher: result.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_3114?.message || 'Successfully fecthed data',
        paylod: res_data_3114
      }, { status: 200 });
  } catch (error) {
    console.error('Error completing teacher registration:', error);
    const res_err_5204 = { error: 'Failed to complete registration setup. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_5204?.error || res_err_5204?.message || 'An error occurred',
        error: res_err_5204?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
