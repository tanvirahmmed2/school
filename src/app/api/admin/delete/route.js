import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyJWT, comparePassword } from '@/lib/auth';

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-admin')?.value;

    let loggedInAdminId = null;

    if (token) {
      const decoded = verifyJWT(token);
      if (decoded && decoded.id) {
        loggedInAdminId = decoded.id;
      }
    }

    // Try parsing the request body for parameters
    let targetId = null;
    let email = null;
    let password = null;
    try {
      const body = await request.json();
      if (body) {
        targetId = body.id;
        email = body.email;
        password = body.password;
      }
    } catch (e) {
      // Body is empty or not JSON, which is fine
    }

    // Fallback authentication check if token is missing
    if (!loggedInAdminId && email && password) {
      const result = await query('SELECT * FROM admins WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        const admin = result.rows[0];
        const isPasswordValid = await comparePassword(password, admin.password_hash);
        if (isPasswordValid) {
          loggedInAdminId = admin.id;
        }
      }
    }

    // If still unauthorized, return 401
    if (!loggedInAdminId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login or provide valid email and password.' },
        { status: 401 }
      );
    }

    // CASE 1: Delete another admin by ID
    if (targetId && Number(targetId) !== Number(loggedInAdminId)) {
      // Perform deletion of target
      const deleteResult = await query('DELETE FROM admins WHERE id = $1 RETURNING id', [targetId]);
      
      if (deleteResult.rowCount === 0) {
        return NextResponse.json(
          { error: 'Admin account to delete not found.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Admin account deleted successfully.'
      });
    }

    // CASE 2: Self-deletion warning/prevent (if targetId matches loggedInAdminId)
    if (targetId && Number(targetId) === Number(loggedInAdminId)) {
      return NextResponse.json(
        { error: 'Self-deletion is not permitted from the Access Panel to avoid admin lockout.' },
        { status: 400 }
      );
    }

    // Execute self-delete (for generic call to delete own account)
    await query('DELETE FROM admins WHERE id = $1', [loggedInAdminId]);

    // Clear session cookie
    cookieStore.set('fit-admin', '', {
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
