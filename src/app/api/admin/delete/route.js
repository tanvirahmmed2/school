import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyJWT, comparePassword } from '@/lib/auth';

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let adminId = null;

    if (token) {
      const decoded = verifyJWT(token);
      if (decoded && decoded.id) {
        adminId = decoded.id;
      }
    }

    // If not authenticated via JWT, check request body for credentials as a fallback/confirmation
    if (!adminId) {
      try {
        const body = await request.json();
        const { email, password } = body;
        if (email && password) {
          const result = await query('SELECT * FROM admins WHERE email = $1', [email]);
          if (result.rows.length > 0) {
            const admin = result.rows[0];
            const isPasswordValid = await comparePassword(password, admin.password_hash);
            if (isPasswordValid) {
              adminId = admin.id;
            }
          }
        }
      } catch (e) {
        // Body reading failed or empty
      }
    }

    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login or provide valid email and password to delete admin account.' },
        { status: 401 }
      );
    }

    // Delete admin account
    await query('DELETE FROM admins WHERE id = $1', [adminId]);

    // Clear session cookie
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'strict',
    });

    return NextResponse.json({
      message: 'Admin account deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting admin account:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin account. Internal server error.' },
      { status: 500 }
    );
  }
}
