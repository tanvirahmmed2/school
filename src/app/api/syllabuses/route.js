import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET syllabuses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');
    const subjectId = searchParams.get('subject_id');

    let sql = `
      SELECT 
        sy.*, 
        c.name AS class_name, 
        c.code AS class_code,
        sub.name AS subject_name, 
        sub.code AS subject_code
      FROM syllabuses sy
      JOIN classes c ON sy.class_id = c.id
      JOIN subjects sub ON sy.subject_id = sub.id
    `;
    let params = [];
    let conditions = [];

    if (classId) {
      params.push(classId);
      conditions.push(`sy.class_id = $${params.length}`);
    }

    if (subjectId) {
      params.push(subjectId);
      conditions.push(`sy.subject_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY c.numeric_name ASC, sub.name ASC, sy.title ASC';

    const result = await query(sql, params);
    return NextResponse.json({ syllabuses: result.rows });
  } catch (error) {
    console.error('Error fetching syllabuses:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve syllabuses. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create a syllabus (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, title, link, class_id, subject_id } = await request.json();

    if (!name || !title || !link || !class_id || !subject_id) {
      return NextResponse.json(
        { error: 'All fields (Name, Title, Document Link, Class, Subject) are required.' },
        { status: 400 }
      );
    }

    // Verify class exists
    const classCheck = await query('SELECT id FROM classes WHERE id = $1', [class_id]);
    if (classCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Target class not found.' }, { status: 404 });
    }

    // Verify subject exists
    const subjectCheck = await query('SELECT id FROM subjects WHERE id = $1', [subject_id]);
    if (subjectCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Target subject not found.' }, { status: 404 });
    }

    const newSyllabus = await query(
      `INSERT INTO syllabuses (name, title, link, class_id, subject_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name.trim(), title.trim(), link.trim(), class_id, subject_id]
    );

    return NextResponse.json(
      { message: 'Syllabus created successfully.', syllabus: newSyllabus.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating syllabus:', error);
    return NextResponse.json(
      { error: 'Failed to create syllabus. Internal server error.' },
      { status: 500 }
    );
  }
}
