import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, hashPassword } from '@/lib/auth';

// GET all teachers
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, email, number, address, is_active, created_at FROM teachers ORDER BY name ASC'
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

// POST register a new teacher (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, email, number, address, password } = await request.json();

    if (!name || !email || !number || !address || !password) {
      return NextResponse.json(
        { error: 'All fields (name, email, number, address, password) are required.' },
        { status: 400 }
      );
    }

    // Check if email already registered
    const teacherCheck = await query('SELECT id FROM teachers WHERE email = $1', [email]);
    if (teacherCheck.rows.length > 0) {
      return NextResponse.json({ error: 'A teacher with this email is already registered.' }, { status: 400 });
    }

    const adminCheck = await query('SELECT id FROM admins WHERE email = $1', [email]);
    if (adminCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by an administrative account.' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    const newTeacher = await query(
      `INSERT INTO teachers (name, email, number, address, password_hash) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, number, address, is_active`,
      [name.trim(), email.trim().toLowerCase(), number.trim(), address.trim(), passwordHash]
    );

    return NextResponse.json(
      { message: 'Teacher registered successfully.', teacher: newTeacher.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher. Internal server error.' },
      { status: 500 }
    );
  }
}
