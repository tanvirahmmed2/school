import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST: Verify if teacher email exists and is not yet registered
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT id, name, email, number, designation, is_registered 
       FROM teachers 
       WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Teacher email not found in our registry. Please contact admin.' },
        { status: 404 }
      );
    }

    const teacher = result.rows[0];

    if (teacher.is_registered) {
      return NextResponse.json(
        { error: 'This teacher account is already registered. Please go to Login.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Teacher registry record verified successfully.',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        number: teacher.number,
        designation: teacher.designation
      }
    });
  } catch (error) {
    console.error('Error verifying teacher email:', error);
    return NextResponse.json(
      { error: 'Failed to verify teacher account. Internal server error.' },
      { status: 500 }
    );
  }
}

// PUT: Complete teacher account setup
export async function PUT(request) {
  try {
    const { email, address, password } = await request.json();

    if (!email || !address || !password) {
      return NextResponse.json(
        { error: 'All fields (email, address, password) are required to complete account setup.' },
        { status: 400 }
      );
    }

    // Verify teacher exists and is unregistered
    const teacherCheck = await query(
      'SELECT id, is_registered FROM teachers WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (teacherCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Teacher record not found.' },
        { status: 404 }
      );
    }

    if (teacherCheck.rows[0].is_registered) {
      return NextResponse.json(
        { error: 'This teacher account has already completed setup.' },
        { status: 400 }
      );
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

    return NextResponse.json({
      message: 'Teacher account setup completed successfully. You can now login.',
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error('Error completing teacher registration:', error);
    return NextResponse.json(
      { error: 'Failed to complete registration setup. Internal server error.' },
      { status: 500 }
    );
  }
}
