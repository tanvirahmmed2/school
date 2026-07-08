import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, isTeacher } from '@/lib/auth';

// GET student marks for entry screen
export async function GET(request) {
  try {
    const authenticated = (await isAdmin()) || (await isTeacher());
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins/Teachers only.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('exam_id');
    const classId = searchParams.get('class_id');
    const sectionId = searchParams.get('section_id');
    const subjectId = searchParams.get('subject_id');

    if (!examId || !classId || !subjectId) {
      return NextResponse.json(
        { error: 'Parameters exam_id, class_id, and subject_id are required.' },
        { status: 400 }
      );
    }

    // Retrieve students matching filters with their marks (left join marks table)
    let dbQuery = `
      SELECT s.id AS student_id, s.name, s.registration_number,
             m.marks_obtained, m.total_marks, m.remarks
      FROM students s
      LEFT JOIN marks m ON m.student_id = s.id AND m.exam_id = $1 AND m.subject_id = $2
      WHERE s.class_id = $3
    `;
    const params = [examId, subjectId, classId];

    if (sectionId && sectionId !== 'all') {
      dbQuery += ` AND s.section_id = $4`;
      params.push(sectionId);
    }

    dbQuery += ` ORDER BY s.name ASC`;

    const result = await query(dbQuery, params);

    return NextResponse.json({ students: result.rows });
  } catch (error) {
    console.error('Error fetching students marks:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve students marks. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST batch upload / upsert marks
export async function POST(request) {
  try {
    const authenticated = (await isAdmin()) || (await isTeacher());
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins/Teachers only.' }, { status: 403 });
    }

    const body = await request.json();
    const { marks } = body; // Array: [{ student_id, exam_id, subject_id, marks_obtained, total_marks, remarks }]

    if (!marks || !Array.isArray(marks)) {
      return NextResponse.json(
        { error: 'Invalid payload. An array of marks is required.' },
        { status: 400 }
      );
    }

    // Start database loop updates
    for (const entry of marks) {
      const { student_id, exam_id, subject_id, marks_obtained, total_marks, remarks } = entry;

      if (!student_id || !exam_id || !subject_id || marks_obtained === undefined) {
        continue; // skip incomplete entries
      }

      await query(
        `INSERT INTO marks (student_id, exam_id, subject_id, marks_obtained, total_marks, remarks)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (student_id, exam_id, subject_id)
         DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained,
                       total_marks = EXCLUDED.total_marks,
                       remarks = EXCLUDED.remarks,
                       updated_at = CURRENT_TIMESTAMP`,
        [
          student_id,
          exam_id,
          subject_id,
          parseFloat(marks_obtained),
          total_marks ? parseFloat(total_marks) : 100.00,
          remarks ? remarks.trim() : null
        ]
      );
    }

    return NextResponse.json({
      message: 'Student marks registered and saved successfully.'
    });
  } catch (error) {
    console.error('Error saving student marks:', error);
    return NextResponse.json(
      { error: 'Failed to register student marks. Internal server error.' },
      { status: 500 }
    );
  }
}
