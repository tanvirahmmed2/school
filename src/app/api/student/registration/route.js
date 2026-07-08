import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST: Verify if registration number exists and is not yet registered
export async function POST(request) {
  try {
    const { registration_number } = await request.json();

    if (!registration_number) {
      return NextResponse.json(
        { error: 'Registration number is required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT s.id, s.registration_number, s.is_registered, c.name as class_name 
       FROM students s
       JOIN classes c ON s.class_id = c.id
       WHERE LOWER(s.registration_number) = LOWER($1)`,
      [registration_number.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Registration number not found in our registry. Please contact admin.' },
        { status: 404 }
      );
    }

    const student = result.rows[0];

    if (student.is_registered) {
      return NextResponse.json(
        { error: 'This registration number is already registered. Please go to Login.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Registration number verified successfully.',
      student: {
        id: student.id,
        registration_number: student.registration_number,
        class_name: student.class_name,
      }
    });
  } catch (error) {
    console.error('Error verifying student registration:', error);
    return NextResponse.json(
      { error: 'Failed to verify registration number. Internal server error.' },
      { status: 500 }
    );
  }
}

// PUT: Complete account setup
export async function PUT(request) {
  try {
    const {
      registration_number,
      name,
      email,
      phone,
      date_of_birth,
      address,
      parents_info,
      birth_certificate_number,
      password
    } = await request.json();

    if (!registration_number || !name || !email || !phone || !date_of_birth || !address || !parents_info || !birth_certificate_number || !password) {
      return NextResponse.json(
        { error: 'All fields are required to complete registration setup.' },
        { status: 400 }
      );
    }

    // Verify student exists and is unregistered
    const studentCheck = await query(
      'SELECT id, is_registered FROM students WHERE LOWER(registration_number) = LOWER($1)',
      [registration_number.trim()]
    );

    if (studentCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student registration record not found.' },
        { status: 404 }
      );
    }

    if (studentCheck.rows[0].is_registered) {
      return NextResponse.json(
        { error: 'This student account has already completed setup.' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const emailCheck = await query('SELECT id FROM students WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'A student account with this email address already exists.' },
        { status: 400 }
      );
    }

    // Check duplicate birth certificate number
    const certCheck = await query('SELECT id FROM students WHERE LOWER(birth_certificate_number) = LOWER($1)', [birth_certificate_number.trim()]);
    if (certCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'A student account with this birth certificate number already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPass = await hashPassword(password);

    // Save and activate student account
    const result = await query(
      `UPDATE students
       SET name = $1, 
           email = $2, 
           phone = $3, 
           date_of_birth = $4, 
           address = $5, 
           parents_info = $6, 
           birth_certificate_number = $7, 
           password_hash = $8,
           is_registered = TRUE,
           is_active = TRUE,
           updated_at = CURRENT_TIMESTAMP
       WHERE LOWER(registration_number) = LOWER($9)
       RETURNING id, name, email, registration_number, is_active, is_registered`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        date_of_birth,
        address.trim(),
        parents_info.trim(),
        birth_certificate_number.trim(),
        hashedPass,
        registration_number.trim()
      ]
    );

    return NextResponse.json({
      message: 'Student account setup completed successfully. You can now login.',
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Error completing student registration:', error);
    return NextResponse.json(
      { error: 'Failed to complete registration setup. Internal server error.' },
      { status: 500 }
    );
  }
}
