import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all subjects
export async function GET() {
  try {
    const result = await query('SELECT * FROM subjects ORDER BY name ASC');
    return NextResponse.json({ subjects: result.rows });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subjects. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create subject (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, code } = await request.json();

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Subject Name and Subject Code are required.' },
        { status: 400 }
      );
    }

    // Check unique constraints
    const duplicateCheck = await query(
      'SELECT name, code FROM subjects WHERE name = $1 OR code = $2',
      [name.trim(), code.trim().toUpperCase()]
    );

    if (duplicateCheck.rows.length > 0) {
      const match = duplicateCheck.rows[0];
      if (match.name === name.trim()) {
        return NextResponse.json({ error: 'A subject with this name already exists.' }, { status: 400 });
      }
      if (match.code === code.trim().toUpperCase()) {
        return NextResponse.json({ error: 'A subject with this code already exists.' }, { status: 400 });
      }
    }

    const newSubject = await query(
      `INSERT INTO subjects (name, code) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name.trim(), code.trim().toUpperCase()]
    );

    return NextResponse.json(
      { message: 'Subject created successfully.', subject: newSubject.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { error: 'Failed to create subject. Internal server error.' },
      { status: 500 }
    );
  }
}
