import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all exams
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'current', 'upcoming', 'previous'

    let sql = 'SELECT * FROM exams';
    const params = [];

    if (status) {
      sql += ' WHERE status = $1';
      params.push(status);
    }

    sql += ' ORDER BY start_date DESC';

    const result = await query(sql, params);
    return NextResponse.json({ exams: result.rows });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve exams. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create a new exam with optional schedule routines (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, term, start_date, end_date, status, schedules } = await request.json();

    if (!name || !start_date || !end_date || !status) {
      return NextResponse.json(
        { error: 'Name, start date, end date, and status are required fields.' },
        { status: 400 }
      );
    }

    // Insert exam
    const newExamRes = await query(
      `INSERT INTO exams (name, term, start_date, end_date, status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name.trim(), term ? term.trim() : null, start_date, end_date, status]
    );

    const exam = newExamRes.rows[0];

    // If schedule routines were provided, insert them
    if (schedules && Array.isArray(schedules) && schedules.length > 0) {
      for (const item of schedules) {
        const { class_id, subject_id, exam_date, start_time, end_time, room_number } = item;
        if (class_id && subject_id && exam_date && start_time && end_time) {
          await query(
            `INSERT INTO exam_schedules (exam_id, class_id, subject_id, exam_date, start_time, end_time, room_number) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [exam.id, class_id, subject_id, exam_date, start_time, end_time, room_number || null]
          );
        }
      }
    }

    return NextResponse.json(
      { message: 'Exam routine created successfully.', exam },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating exam:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'An exam with this name already exists.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create exam routine. Internal server error.' },
      { status: 500 }
    );
  }
}
