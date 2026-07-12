import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST: Verify if registration number exists and is not yet registered
export async function POST(request) {
  try {
    const { registration_number } = await request.json();

    if (!registration_number) {
      const res_err_344 = { error: 'Registration number is required.' };
      return NextResponse.json({
        success: false,
        message: res_err_344?.error || res_err_344?.message || 'An error occurred',
        error: res_err_344?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `SELECT s.id, s.registration_number, s.is_registered, c.name as class_name 
       FROM students s
       JOIN classes c ON s.class_id = c.id
       WHERE LOWER(s.registration_number) = LOWER($1)`,
      [registration_number.trim()]
    );

    if (result.rows.length === 0) {
      const res_err_990 = { error: 'Registration number not found in our registry. Please contact admin.' };
      return NextResponse.json({
        success: false,
        message: res_err_990?.error || res_err_990?.message || 'An error occurred',
        error: res_err_990?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const student = result.rows[0];

    if (student.is_registered) {
      const res_err_1427 = { error: 'This registration number is already registered. Please go to Login.' };
      return NextResponse.json({
        success: false,
        message: res_err_1427?.error || res_err_1427?.message || 'An error occurred',
        error: res_err_1427?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const res_data_1149 = {
      message: 'Registration number verified successfully.',
      student: {
        id: student.id,
        registration_number: student.registration_number,
        class_name: student.class_name,
      }
    };
      return NextResponse.json({
        success: true,
        message: res_data_1149?.message || 'Successfully fecthed data',
        paylod: res_data_1149
      }, { status: 200 });
  } catch (error) {
    console.error('Error verifying student registration:', error);
    const res_err_2405 = { error: 'Failed to verify registration number. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_2405?.error || res_err_2405?.message || 'An error occurred',
        error: res_err_2405?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
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
      const res_err_3205 = { error: 'All fields are required to complete registration setup.' };
      return NextResponse.json({
        success: false,
        message: res_err_3205?.error || res_err_3205?.message || 'An error occurred',
        error: res_err_3205?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Verify student exists and is unregistered
    const studentCheck = await query(
      'SELECT id, is_registered FROM students WHERE LOWER(registration_number) = LOWER($1)',
      [registration_number.trim()]
    );

    if (studentCheck.rows.length === 0) {
      const res_err_3828 = { error: 'Student registration record not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_3828?.error || res_err_3828?.message || 'An error occurred',
        error: res_err_3828?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    if (studentCheck.rows[0].is_registered) {
      const res_err_4215 = { error: 'This student account has already completed setup.' };
      return NextResponse.json({
        success: false,
        message: res_err_4215?.error || res_err_4215?.message || 'An error occurred',
        error: res_err_4215?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check duplicate email
    const emailCheck = await query('SELECT id FROM students WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (emailCheck.rows.length > 0) {
      const res_err_4744 = { error: 'A student account with this email address already exists.' };
      return NextResponse.json({
        success: false,
        message: res_err_4744?.error || res_err_4744?.message || 'An error occurred',
        error: res_err_4744?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check duplicate birth certificate number
    const certCheck = await query('SELECT id FROM students WHERE LOWER(birth_certificate_number) = LOWER($1)', [birth_certificate_number.trim()]);
    if (certCheck.rows.length > 0) {
      const res_err_5336 = { error: 'A student account with this birth certificate number already exists.' };
      return NextResponse.json({
        success: false,
        message: res_err_5336?.error || res_err_5336?.message || 'An error occurred',
        error: res_err_5336?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
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

    const res_data_4585 = {
      message: 'Student account setup completed successfully. You can now login.',
      student: result.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_4585?.message || 'Successfully fecthed data',
        paylod: res_data_4585
      }, { status: 200 });
  } catch (error) {
    console.error('Error completing student registration:', error);
    const res_err_7139 = { error: 'Failed to complete registration setup. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_7139?.error || res_err_7139?.message || 'An error occurred',
        error: res_err_7139?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
