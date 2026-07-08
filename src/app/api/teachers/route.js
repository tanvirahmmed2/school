import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all teachers
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, email, number, designation, address, is_active, is_registered, created_at FROM teachers ORDER BY name ASC'
    );
    return NextResponse.json({ teachers: result.rows });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve teachers. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST register a new teacher (Admin pre-creates placeholder)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, email, number, designation } = await request.json();

    if (!name || !email || !number || !designation) {
      return NextResponse.json(
        { error: 'All fields (name, email, number, designation) are required.' },
        { status: 400 }
      );
    }

    // Check if email already registered in teachers table
    const teacherCheck = await query('SELECT id FROM teachers WHERE email = $1', [email.trim()]);
    if (teacherCheck.rows.length > 0) {
      return NextResponse.json({ error: 'A teacher with this email is already registered.' }, { status: 400 });
    }

    // Check if email already in admins table
    const adminCheck = await query('SELECT id FROM admins WHERE email = $1', [email.trim()]);
    if (adminCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by an administrative account.' }, { status: 400 });
    }

    const newTeacher = await query(
      `INSERT INTO teachers (name, email, number, designation, is_active, is_registered) 
       VALUES ($1, $2, $3, $4, FALSE, FALSE) 
       RETURNING id, name, email, number, designation, is_active, is_registered`,
      [name.trim(), email.trim().toLowerCase(), number.trim(), designation.trim()]
    );

    return NextResponse.json(
      { message: 'Teacher profile pre-created successfully.', teacher: newTeacher.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating teacher placeholder:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher placeholder. Internal server error.' },
      { status: 500 }
    );
  }
}
