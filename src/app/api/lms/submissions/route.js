import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isTeacher, isStudent, isAdmin, verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET submissions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignment_id');

    if (!assignmentId) {
      const res_err = { error: 'assignment_id query parameter is required.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    const teacherAuth = await isTeacher();
    const studentAuth = await isStudent();
    const adminAuth = await isAdmin();

    if (!teacherAuth && !studentAuth && !adminAuth) {
      const res_err = { error: 'Unauthorized.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 401 });
    }

    const cookieStore = await cookies();

    if (teacherAuth || adminAuth) {
      // Teachers and Admins get all submissions for the assignment
      const result = await query(
        `SELECT asub.*, s.name AS student_name, s.registration_number AS student_reg
         FROM assignment_submissions asub
         JOIN students s ON asub.student_id = s.id
         WHERE asub.assignment_id = $1
         ORDER BY asub.submitted_at DESC`,
        [assignmentId]
      );
      const res_data = { submissions: result.rows };
      return NextResponse.json({
        success: true,
        message: 'Submissions retrieved successfully',
        paylod: res_data
      }, { status: 200 });
    } else {
      // Students get their own submission
      const token = cookieStore.get('fit-student')?.value;
      const decoded = verifyJWT(token);
      const studentId = decoded.id;

      const result = await query(
        `SELECT * FROM assignment_submissions
         WHERE assignment_id = $1 AND student_id = $2`,
        [assignmentId, studentId]
      );
      const res_data = { submission: result.rows[0] || null };
      return NextResponse.json({
        success: true,
        message: 'Student submission retrieved successfully',
        paylod: res_data
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching submissions:', error);
    const res_err = { error: 'Failed to retrieve submissions.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}

// POST submit assignment (Student only)
export async function POST(request) {
  try {
    const studentAuth = await isStudent();
    if (!studentAuth) {
      const res_err = { error: 'Unauthorized. Students only.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 403 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    const decoded = verifyJWT(token);
    const studentId = decoded.id;

    const { assignment_id, file_url, file_id, submission_text } = await request.json();

    if (!assignment_id) {
      const res_err = { error: 'assignment_id is required.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    // Verify assignment exists and isn't past due date (optional, but let's allow late submissions with 'Late' status)
    const assignCheck = await query('SELECT due_date FROM assignments WHERE id = $1', [assignment_id]);
    if (assignCheck.rows.length === 0) {
      const res_err = { error: 'Assignment not found.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 404 });
    }

    const assignment = assignCheck.rows[0];
    const isLate = new Date() > new Date(assignment.due_date);
    const status = isLate ? 'Late' : 'Pending';

    // Insert or update submission
    const result = await query(
      `INSERT INTO assignment_submissions (assignment_id, student_id, file_url, file_id, submission_text, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (assignment_id, student_id) 
       DO UPDATE SET 
         file_url = EXCLUDED.file_url,
         file_id = EXCLUDED.file_id,
         submission_text = EXCLUDED.submission_text,
         status = EXCLUDED.status,
         submitted_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [assignment_id, studentId, file_url || null, file_id || null, submission_text || null, status]
    );

    const res_data = { message: 'Assignment submitted successfully.', submission: result.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    const res_err = { error: 'Failed to submit assignment.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}

// PUT grade assignment submission (Teacher only)
export async function PUT(request) {
  try {
    const teacherAuth = await isTeacher();
    const adminAuth = await isAdmin();

    if (!teacherAuth && !adminAuth) {
      const res_err = { error: 'Unauthorized. Teachers or Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 403 });
    }

    const { submission_id, marks_obtained, remarks } = await request.json();

    if (!submission_id || marks_obtained === undefined) {
      const res_err = { error: 'submission_id and marks_obtained are required.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    // Verify submission exists
    const subCheck = await query('SELECT id FROM assignment_submissions WHERE id = $1', [submission_id]);
    if (subCheck.rows.length === 0) {
      const res_err = { error: 'Submission not found.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 404 });
    }

    const result = await query(
      `UPDATE assignment_submissions
       SET marks_obtained = $1, remarks = $2, status = 'Graded', updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [marks_obtained, remarks || null, submission_id]
    );

    const res_data = { message: 'Submission graded successfully.', submission: result.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error grading submission:', error);
    const res_err = { error: 'Failed to grade submission.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}
