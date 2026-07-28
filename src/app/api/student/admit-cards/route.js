import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';
import { syncExamStatuses } from '@/lib/exams';

export async function GET() {
  try {
    await syncExamStatuses();

    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
        error: 'Unauthorized',
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token',
        error: 'Unauthorized',
        paylod: null
      }, { status: 401 });
    }

    const studentId = decoded.id;

    // Fetch student complete profile
    const studentRes = await query(`
      SELECT s.id, s.name, s.registration_number, s.roll, s.date_of_birth, s.gender, s.class_id, s.section_id,
             c.name AS class_name, sec.name AS section_name
      FROM students s
      JOIN classes c ON c.id = s.class_id
      LEFT JOIN sections sec ON sec.id = s.section_id
      WHERE s.id = $1
    `, [studentId]);

    if (studentRes.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Student profile not found',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }

    const student = studentRes.rows[0];

    // Fetch exams for student's class
    const examsRes = await query(`
      SELECT e.*, c.name AS class_name
      FROM exams e
      JOIN classes c ON c.id = e.class_id
      WHERE e.class_id = $1
      ORDER BY e.start_date DESC
    `, [student.class_id]);

    const examList = [];

    for (const exam of examsRes.rows) {
      // Fetch schedules
      const schedulesRes = await query(`
        SELECT es.*, sub.name AS subject_name, sub.code AS subject_code
        FROM exam_schedules es
        JOIN subjects sub ON sub.id = es.subject_id
        WHERE es.exam_id = $1
        ORDER BY es.exam_date ASC, es.start_time ASC
      `, [exam.id]);

      // Check fee payment status in student_fees
      const feeRes = await query(`
        SELECT * FROM student_fees
        WHERE student_id = $1 AND (title LIKE $2 OR title LIKE $3)
        ORDER BY id DESC
        LIMIT 1
      `, [studentId, `%Exam Fee: ${exam.name.trim()}%`, `%${exam.name.trim()}%`]);

      const fee = feeRes.rows[0] || null;
      const rawFeeStatus = fee ? (fee.status || 'unpaid').toLowerCase() : 'unpaid';
      const examFeeAmount = exam.exam_fee ? parseFloat(exam.exam_fee) : 0.00;

      // isPaid is true if status is paid, or fee is 0, or no fee invoice required
      const isPaid = rawFeeStatus === 'paid' || examFeeAmount === 0 || (fee && parseFloat(fee.paid_amount || 0) >= parseFloat(fee.amount || 0) && parseFloat(fee.amount) > 0);

      examList.push({
        ...exam,
        schedules: schedulesRes.rows,
        feeRecord: fee,
        feeStatus: fee ? fee.status : (examFeeAmount === 0 ? 'Paid' : 'Unpaid'),
        isPaid
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Fetched student admit cards data successfully',
      paylod: {
        student,
        exams: examList
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching student admit cards:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
