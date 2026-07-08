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

    // Find admin
    const result = await query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const admin = result.rows[0];

    // Check if admin is active
    if (!admin.is_active) {
      return NextResponse.json(
        { error: 'This administrative account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
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

    return NextResponse.json({
      message: 'Login successful.',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        number: admin.number,
        address: admin.address,
        is_active: admin.is_active,
      }
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate. Internal server error.' },
      { status: 500 }
    );
  }
}
