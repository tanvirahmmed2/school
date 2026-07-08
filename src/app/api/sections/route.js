import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET sections
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');

    let sql = `
      SELECT s.*, c.name AS class_name, c.code AS class_code 
      FROM sections s 
      JOIN classes c ON s.class_id = c.id
    `;
    let params = [];

    if (classId) {
      sql += ' WHERE s.class_id = $1';
      params.push(classId);
    }

    sql += ' ORDER BY c.numeric_name ASC, s.name ASC';

    const result = await query(sql, params);
    return NextResponse.json({ sections: result.rows });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve sections. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create section under class (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { class_id, name, capacity, room_number } = await request.json();

    if (!class_id || !name) {
      return NextResponse.json(
        { error: 'Class ID and Section Name are required.' },
        { status: 400 }
      );
    }

    const capVal = capacity !== undefined ? parseInt(capacity, 10) : 40;
    if (isNaN(capVal)) {
      return NextResponse.json(
        { error: 'Capacity must be a valid number.' },
        { status: 400 }
      );
    }

    // Verify class exists
    const classCheck = await query('SELECT id FROM classes WHERE id = $1', [class_id]);
    if (classCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Target class not found.' },
        { status: 404 }
      );
    }

    // Verify unique section name under the same class
    const duplicateCheck = await query(
      'SELECT id FROM sections WHERE class_id = $1 AND LOWER(name) = LOWER($2)',
      [class_id, name.trim()]
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'A section with this name already exists under the selected class.' },
        { status: 400 }
      );
    }

    const newSection = await query(
      `INSERT INTO sections (class_id, name, capacity, room_number) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [class_id, name.trim(), capVal, room_number ? room_number.trim() : null]
    );

    return NextResponse.json(
      { message: 'Section created successfully.', section: newSection.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section. Internal server error.' },
      { status: 500 }
    );
  }
}
