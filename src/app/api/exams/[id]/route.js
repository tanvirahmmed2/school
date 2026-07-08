import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET details of a single exam including routines
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const examRes = await query('SELECT * FROM exams WHERE id = $1', [id]);
    if (examRes.rows.length === 0) {
      return NextResponse.json({ error: 'Exam not found.' }, { status: 404 });
    }

    const exam = examRes.rows[0];

    const schedulesRes = await query(
      `SELECT es.*, c.name as class_name, sub.name as subject_name 
       FROM exam_schedules es
       JOIN classes c ON es.class_id = c.id
       JOIN subjects sub ON es.subject_id = sub.id
       WHERE es.exam_id = $1
       ORDER BY es.exam_date ASC, es.start_time ASC`,
      [id]
    );

    return NextResponse.json({ exam, schedules: schedulesRes.rows });
  } catch (error) {
    console.error('Error fetching exam details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve exam details. Internal server error.' },
      { status: 500 }
    );
  }
}

// PUT update an exam and its routines (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, term, start_date, end_date, status, schedules } = await request.json();

    if (!name || !start_date || !end_date || !status) {
      return NextResponse.json(
        { error: 'Name, start date, end date, and status are required fields.' },
        { status: 400 }
      );
    }

    // Update exam table
    const updateExamRes = await query(
      `UPDATE exams 
       SET name = $1, term = $2, start_date = $3, end_date = $4, status = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING *`,
      [name.trim(), term ? term.trim() : null, start_date, end_date, status, id]
    );

    if (updateExamRes.rowCount === 0) {
      return NextResponse.json({ error: 'Exam not found.' }, { status: 404 });
    }

    const updatedExam = updateExamRes.rows[0];

    // If schedules array is provided, replace existing schedules
    if (schedules && Array.isArray(schedules)) {
      // Clear old schedules
      await query('DELETE FROM exam_schedules WHERE exam_id = $1', [id]);

      // Insert new schedules
      for (const item of schedules) {
        const { class_id, subject_id, exam_date, start_time, end_time, room_number } = item;
        if (class_id && subject_id && exam_date && start_time && end_time) {
          await query(
            `INSERT INTO exam_schedules (exam_id, class_id, subject_id, exam_date, start_time, end_time, room_number) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, class_id, subject_id, exam_date, start_time, end_time, room_number || null]
          );
        }
      }
    }

    return NextResponse.json({
      message: 'Exam routine updated successfully.',
      exam: updatedExam,
    });
  } catch (error) {
    console.error('Error updating exam:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'An exam with this name already exists.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update exam routine. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE an exam and all schedules (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM exams WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Exam not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Exam and all its routines deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { error: 'Failed to delete exam routine. Internal server error.' },
      { status: 500 }
    );
  }
}
