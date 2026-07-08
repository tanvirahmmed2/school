import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const examId = searchParams.get('exam_id');

    if (!studentId || !examId) {
      return NextResponse.json(
        { error: 'Parameters student_id and exam_id are required.' },
        { status: 400 }
      );
    }

    // 1. Fetch student info
    const studentRes = await query(
      `SELECT s.id, s.name, s.registration_number, s.date_of_birth,
              c.name AS class_name, sec.name AS section_name
       FROM students s
       JOIN classes c ON c.id = s.class_id
       LEFT JOIN sections sec ON sec.id = s.section_id
       WHERE s.id = $1`,
      [studentId]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    const student = studentRes.rows[0];

    // 2. Fetch overall result details
    const resultRes = await query(
      `SELECT gpa, grade, total_marks, status 
       FROM results 
       WHERE student_id = $1 AND exam_id = $2`,
      [studentId, examId]
    );

    const overallResult = resultRes.rows[0] || { gpa: 0.00, grade: 'Pending', total_marks: 0.00, status: 'Unpublished' };

    // 3. Fetch subject-wise score list
    const marksRes = await query(
      `SELECT sub.name AS subject_name, sub.code AS subject_code,
              m.marks_obtained, m.total_marks, m.remarks
       FROM marks m
       JOIN subjects sub ON sub.id = m.subject_id
       WHERE m.student_id = $1 AND m.exam_id = $2
       ORDER BY sub.name ASC`,
      [studentId, examId]
    );

    // 4. Log generation inside transcripts table
    await query(
      `INSERT INTO transcripts (student_id, exam_id, gpa, remarks)
       VALUES ($1, $2, $3, $4)`,
      [
        studentId,
        examId,
        parseFloat(overallResult.gpa),
        `Admin generated transcript card for ${student.name}.`
      ]
    );

    return NextResponse.json({
      student,
      overallResult,
      subjectMarks: marksRes.rows
    });
  } catch (error) {
    console.error('Error compiling transcript card:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve transcript details. Internal server error.' },
      { status: 500 }
    );
  }
}
