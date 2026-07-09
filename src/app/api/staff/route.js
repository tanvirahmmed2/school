import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all staff members
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, email, number, designation, address, role, is_active, is_registered, created_at FROM staff ORDER BY name ASC'
    );
    return NextResponse.json({ staff: result.rows });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve staff. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST register a new staff member (Admin pre-creates placeholder)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, email, number, designation, role } = await request.json();

    if (!name || !email || !number || !designation || !role) {
      return NextResponse.json(
        { error: 'All fields (name, email, number, designation, role) are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if email already registered in staff
    const staffCheck = await query('SELECT id FROM staff WHERE email = $1', [trimmedEmail]);
    if (staffCheck.rows.length > 0) {
      return NextResponse.json({ error: 'A staff member with this email is already registered.' }, { status: 400 });
    }

    // Check if email already registered in teachers
    const teacherCheck = await query('SELECT id FROM teachers WHERE email = $1', [trimmedEmail]);
    if (teacherCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by a teacher.' }, { status: 400 });
    }

    // Check if email already registered in admins
    const adminCheck = await query('SELECT id FROM admins WHERE email = $1', [trimmedEmail]);
    if (adminCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by an administrative account.' }, { status: 400 });
    }

    const newStaff = await query(
      `INSERT INTO staff (name, email, number, designation, role, is_active, is_registered) 
       VALUES ($1, $2, $3, $4, $5, FALSE, FALSE) 
       RETURNING id, name, email, number, designation, role, is_active, is_registered`,
      [name.trim(), trimmedEmail, number.trim(), designation.trim(), role.trim().toLowerCase()]
    );

    return NextResponse.json(
      { message: 'Staff profile pre-created successfully.', staff: newStaff.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating staff placeholder:', error);
    return NextResponse.json(
      { error: 'Failed to create staff placeholder. Internal server error.' },
      { status: 500 }
    );
  }
}
