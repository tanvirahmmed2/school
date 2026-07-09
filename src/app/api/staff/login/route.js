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

    // Find staff member
    const result = await query('SELECT * FROM staff WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const staff = result.rows[0];

    // Check if staff completed registration setup
    if (!staff.is_registered) {
      return NextResponse.json(
        { error: 'This staff account has not completed setup yet. Please register first.' },
        { status: 403 }
      );
    }

    // Check if staff is active
    if (!staff.is_active) {
      return NextResponse.json(
        { error: 'This staff account has been deactivated. Please contact administration.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, staff.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signJWT({ id: staff.id, email: staff.email, name: staff.name, role: staff.role });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('fit-staff', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict',
    });

    return NextResponse.json({
      message: 'Staff login successful.',
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        number: staff.number,
        designation: staff.designation,
        address: staff.address,
        role: staff.role,
        is_active: staff.is_active,
        is_registered: staff.is_registered
      }
    });
  } catch (error) {
    console.error('Error logging in staff:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate. Internal server error.' },
      { status: 500 }
    );
  }
}
