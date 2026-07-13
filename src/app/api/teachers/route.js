import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all teachers
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, email, number, designation, address, is_active, is_registered, is_permanent, image, created_at FROM teachers ORDER BY name ASC'
    );
    const res_data_398 = { teachers: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_398?.message || 'Successfully fecthed data',
        paylod: res_data_398
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    const res_err_757 = { error: 'Failed to retrieve teachers. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_757?.error || res_err_757?.message || 'An error occurred',
        error: res_err_757?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST register a new teacher (Admin pre-creates placeholder)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_1285 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_1285?.error || res_err_1285?.message || 'An error occurred',
        error: res_err_1285?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { name, email, number, designation, is_permanent } = await request.json();

    if (!name || !email || !number || !designation) {
      const res_err_1740 = { error: 'All fields (name, email, number, designation) are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_1740?.error || res_err_1740?.message || 'An error occurred',
        error: res_err_1740?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check if email already registered in teachers table
    const teacherCheck = await query('SELECT id FROM teachers WHERE email = $1', [email.trim()]);
    if (teacherCheck.rows.length > 0) {
      const res_err_2299 = { error: 'A teacher with this email is already registered.' };
      return NextResponse.json({
        success: false,
        message: res_err_2299?.error || res_err_2299?.message || 'An error occurred',
        error: res_err_2299?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check if email already in admins table
    const adminCheck = await query('SELECT id FROM admins WHERE email = $1', [email.trim()]);
    if (adminCheck.rows.length > 0) {
      const res_err_2828 = { error: 'This email is already in use by an administrative account.' };
      return NextResponse.json({
        success: false,
        message: res_err_2828?.error || res_err_2828?.message || 'An error occurred',
        error: res_err_2828?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const newTeacher = await query(
      `INSERT INTO teachers (name, email, number, designation, is_active, is_registered, is_permanent) 
       VALUES ($1, $2, $3, $4, FALSE, FALSE, $5) 
       RETURNING id, name, email, number, designation, is_active, is_registered, is_permanent`,
      [name.trim(), email.trim().toLowerCase(), number.trim(), designation.trim(), !!is_permanent]
    );

    const res_data_2418 = { message: 'Teacher profile pre-created successfully.', teacher: newTeacher.rows[0] };
      return NextResponse.json({
        success: true,
        message: res_data_2418?.message || 'Successfully fecthed data',
        paylod: res_data_2418
      }, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher placeholder:', error);
    const res_err_4010 = { error: 'Failed to create teacher placeholder. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_4010?.error || res_err_4010?.message || 'An error occurred',
        error: res_err_4010?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
