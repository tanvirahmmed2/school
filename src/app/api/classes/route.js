import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all classes
export async function GET() {
  try {
    const result = await query('SELECT * FROM classes ORDER BY numeric_name ASC, name ASC');
    return NextResponse.json({ classes: result.rows });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve classes. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create a new class (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, numeric_name, code } = await request.json();

    if (!name || numeric_name === undefined || !code) {
      return NextResponse.json(
        { error: 'All fields (name, numeric_name, code) are required.' },
        { status: 400 }
      );
    }

    const numericVal = parseInt(numeric_name, 10);
    if (isNaN(numericVal)) {
      return NextResponse.json(
        { error: 'Numeric name must be a valid number.' },
        { status: 400 }
      );
    }

    // Check unique constraints
    const duplicateCheck = await query(
      'SELECT name, code FROM classes WHERE name = $1 OR code = $2',
      [name, code]
    );

    if (duplicateCheck.rows.length > 0) {
      const match = duplicateCheck.rows[0];
      if (match.name === name) {
        return NextResponse.json({ error: 'A class with this name already exists.' }, { status: 400 });
      }
      if (match.code === code) {
        return NextResponse.json({ error: 'A class with this code already exists.' }, { status: 400 });
      }
    }

    const newClass = await query(
      `INSERT INTO classes (name, numeric_name, code) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [name, numericVal, code]
    );

    return NextResponse.json(
      { message: 'Class created successfully.', class: newClass.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Failed to create class. Internal server error.' },
      { status: 500 }
    );
  }
}
