import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { comparePassword, signJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find teacher
    const result = await query('SELECT * FROM teachers WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const teacher = result.rows[0];

    // Check if teacher completed registration setup
    if (!teacher.is_registered) {
      return NextResponse.json(
        { error: 'This teacher account has not completed setup yet. Please self-register first.' },
        { status: 403 }
      );
    }

    // Check if teacher is active
    if (!teacher.is_active) {
      return NextResponse.json(
        { error: 'This teacher account has been deactivated. Please contact administration.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, teacher.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error logging in teacher:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate. Internal server error.' },
      { status: 500 }
    );
  }
}
