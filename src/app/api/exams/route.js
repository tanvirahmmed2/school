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
    const res_data_602 = { exams: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_602?.message || 'Successfully fecthed data',
        paylod: res_data_602
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching exams:', error);
    const res_err_955 = { error: 'Failed to retrieve exams. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_955?.error || res_err_955?.message || 'An error occurred',
        error: res_err_955?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST create a new exam with optional schedule routines (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_1488 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_1488?.error || res_err_1488?.message || 'An error occurred',
        error: res_err_1488?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { name, term, start_date, end_date, status, schedules } = await request.json();

    if (!name || !start_date || !end_date || !status) {
      const res_err_1964 = { error: 'Name, start date, end date, and status are required fields.' };
      return NextResponse.json({
        success: false,
        message: res_err_1964?.error || res_err_1964?.message || 'An error occurred',
        error: res_err_1964?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
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

    const res_data_2643 = { message: 'Exam routine created successfully.', exam };
      return NextResponse.json({
        success: true,
        message: res_data_2643?.message || 'Successfully fecthed data',
        paylod: res_data_2643
      }, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);
    if (error.code === '23505') {
      const res_err_3762 = { error: 'An exam with this name already exists.' };
      return NextResponse.json({
        success: false,
        message: res_err_3762?.error || res_err_3762?.message || 'An error occurred',
        error: res_err_3762?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }
    const res_err_4100 = { error: 'Failed to create exam routine. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_4100?.error || res_err_4100?.message || 'An error occurred',
        error: res_err_4100?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
