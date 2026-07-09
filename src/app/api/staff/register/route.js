import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST: Verify if staff email exists and is not yet registered
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
      `SELECT id, name, email, number, designation, role, is_registered 
       FROM staff 
       WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Staff email not found in our registry. Please contact admin.' },
        { status: 404 }
      );
    }

    const staff = result.rows[0];

    if (staff.is_registered) {
      return NextResponse.json(
        { error: 'This staff account is already registered. Please go to Login.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Staff registry record verified successfully.',
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        number: staff.number,
        designation: staff.designation,
        role: staff.role
      }
    });
  } catch (error) {
    console.error('Error verifying staff email:', error);
    return NextResponse.json(
      { error: 'Failed to verify staff account. Internal server error.' },
      { status: 500 }
    );
  }
}

// PUT: Complete staff account setup
export async function PUT(request) {
  try {
    const { email, address, password } = await request.json();

    if (!email || !address || !password) {
      return NextResponse.json(
        { error: 'All fields (email, address, password) are required to complete account setup.' },
        { status: 400 }
      );
    }

    // Verify staff exists and is unregistered
    const staffCheck = await query(
      'SELECT id, is_registered FROM staff WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (staffCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Staff record not found.' },
        { status: 404 }
      );
    }

    if (staffCheck.rows[0].is_registered) {
      return NextResponse.json(
        { error: 'This staff account has already completed setup.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPass = await hashPassword(password);

    // Save and activate staff account
    const result = await query(
      `UPDATE staff
       SET address = $1, 
           password_hash = $2,
           is_registered = TRUE,
           is_active = TRUE,
           updated_at = CURRENT_TIMESTAMP
       WHERE LOWER(email) = LOWER($3)
       RETURNING id, name, email, role, designation, is_active, is_registered`,
      [address.trim(), hashedPass, email.trim()]
    );

    return NextResponse.json({
      message: 'Staff account setup completed successfully. You can now login.',
      staff: result.rows[0]
    });
  } catch (error) {
    console.error('Error completing staff setup:', error);
    return NextResponse.json(
      { error: 'Failed to complete staff account setup. Internal server error.' },
      { status: 500 }
    );
  }
}
