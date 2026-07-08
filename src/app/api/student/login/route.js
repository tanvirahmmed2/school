import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { comparePassword, signJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { registration_number, password } = await request.json();

    if (!registration_number || !password) {
      return NextResponse.json(
        { error: 'Registration number and password are required.' },
        { status: 400 }
      );
    }

    // Find student
    const result = await query('SELECT * FROM students WHERE LOWER(registration_number) = LOWER($1)', [registration_number.trim()]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid registration number or password.' },
        { status: 401 }
      );
    }

    const student = result.rows[0];

    // Check if student completed registration setup
    if (!student.is_registered) {
      return NextResponse.json(
        { error: 'This account has not yet completed setup. Please register/setup your account first.' },
        { status: 403 }
      );
    }

    // Check if student account is active
    if (!student.is_active) {
      return NextResponse.json(
        { error: 'Your student account has been deactivated. Please contact administration.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, student.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid registration number or password.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signJWT({
      id: student.id,
      registration_number: student.registration_number,
      email: student.email,
      name: student.name,
      role: 'student'
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('fit-student', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict',
    });

    return NextResponse.json({
      message: 'Login successful.',
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        registration_number: student.registration_number,
        phone: student.phone,
        is_active: student.is_active,
        is_registered: student.is_registered
      }
    });
  } catch (error) {
    console.error('Error logging in student:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate. Internal server error.' },
      { status: 500 }
    );
  }
}
