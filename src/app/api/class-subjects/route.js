import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all class-subject mappings
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        cs.*, 
        c.name AS class_name, 
        c.code AS class_code,
        s.name AS section_name, 
        sub.name AS subject_name, 
        sub.code AS subject_code,
        t.name AS teacher_name
      FROM class_subjects cs
      JOIN classes c ON cs.class_id = c.id
      LEFT JOIN sections s ON cs.section_id = s.id
      JOIN subjects sub ON cs.subject_id = sub.id
      LEFT JOIN teachers t ON cs.teacher_id = t.id
      ORDER BY c.numeric_name ASC, s.name ASC, sub.name ASC
    `);
    return NextResponse.json({ assignments: result.rows });
  } catch (error) {
    console.error('Error fetching class-subjects assignments:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve assignments. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create a class-subject mapping (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { class_id, section_id, subject_id, teacher_id } = await request.json();

    if (!class_id || !subject_id) {
      return NextResponse.json(
        { error: 'Class ID and Subject ID are required.' },
        { status: 400 }
      );
    }

    // Clean up nullable IDs
    const sectId = section_id ? parseInt(section_id, 10) : null;
    const teachId = teacher_id ? parseInt(teacher_id, 10) : null;

    // Check duplicate mapping
    let checkDup;
    if (sectId === null) {
      checkDup = await query(
        'SELECT id FROM class_subjects WHERE class_id = $1 AND section_id IS NULL AND subject_id = $2',
        [class_id, subject_id]
      );
    } else {
      checkDup = await query(
        'SELECT id FROM class_subjects WHERE class_id = $1 AND section_id = $2 AND subject_id = $3',
        [class_id, sectId, subject_id]
      );
    }

    if (checkDup.rows.length > 0) {
      return NextResponse.json(
        { error: 'This subject is already mapped to the selected class/section. Edit the mapping to change the teacher.' },
        { status: 400 }
      );
    }

    const newMapping = await query(
      `INSERT INTO class_subjects (class_id, section_id, subject_id, teacher_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [class_id, sectId, subject_id, teachId]
    );

    return NextResponse.json(
      { message: 'Class subject assignment created successfully.', assignment: newMapping.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error assigning class subject:', error);
    return NextResponse.json(
      { error: 'Failed to create class subject mapping. Internal server error.' },
      { status: 500 }
    );
  }
}
