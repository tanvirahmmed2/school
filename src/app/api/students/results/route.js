import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// Helper to determine GPA and Letter Grade from Percentage
function calculateGPAAndGrade(percentage) {
  if (percentage >= 80.0) return { gpa: 5.00, grade: 'A+' };
  if (percentage >= 70.0) return { gpa: 4.00, grade: 'A' };
  if (percentage >= 60.0) return { gpa: 3.50, grade: 'A-' };
  if (percentage >= 50.0) return { gpa: 3.00, grade: 'B' };
  if (percentage >= 40.0) return { gpa: 2.00, grade: 'C' };
  return { gpa: 0.00, grade: 'F' };
}

// GET all exams and publication status
export async function GET() {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const result = await query(`
      SELECT e.id AS exam_id, e.name, e.term, e.start_date, e.end_date, e.status, 
             COALESCE(rp.is_published, FALSE) AS is_published, rp.published_at
      FROM exams e
      LEFT JOIN result_publish rp ON rp.exam_id = e.id
      ORDER BY e.start_date DESC
    `);

    return NextResponse.json({ exams: result.rows });
  } catch (error) {
    console.error('Error fetching exam publications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve exam publications. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST toggle publication status & compile marks
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { exam_id, is_published } = await request.json();

    if (!exam_id || is_published === undefined) {
      return NextResponse.json(
        { error: 'Parameters exam_id and is_published are required.' },
        { status: 400 }
      );
    }

    if (is_published) {
      // 1. Compile results: Select distinct students with marks in this exam
      const studentsRes = await query(
        'SELECT DISTINCT student_id FROM marks WHERE exam_id = $1',
        [exam_id]
      );

      const studentIds = studentsRes.rows.map(r => r.student_id);

      for (const studentId of studentIds) {
        // Fetch all subject marks for this student and exam
        const marksRes = await query(
          'SELECT marks_obtained, total_marks FROM marks WHERE student_id = $1 AND exam_id = $2',
          [studentId, exam_id]
        );

        let totalObtained = 0.00;
        let totalMax = 0.00;
        let hasFailedSubject = false;

        for (const mark of marksRes.rows) {
          const obtained = parseFloat(mark.marks_obtained);
          const max = parseFloat(mark.total_marks);
          totalObtained += obtained;
          totalMax += max;

          // Check subject-level fail state (below 40% in any subject)
          if (max > 0 && (obtained / max) * 100 < 40.0) {
            hasFailedSubject = true;
          }
        }

        let overallGPA = 0.00;
        let overallGrade = 'F';
        let status = 'Fail';

        if (totalMax > 0) {
          const overallPercentage = (totalObtained / totalMax) * 100;
          const { gpa, grade } = calculateGPAAndGrade(overallPercentage);
          
          overallGPA = gpa;
          overallGrade = grade;

          // If a student failed any single subject, their overall GPA becomes 0.00 and overall Grade 'F'
          if (hasFailedSubject) {
            overallGPA = 0.00;
            overallGrade = 'F';
          }

          status = overallGPA >= 2.00 ? 'Pass' : 'Fail';
        }

        // Upsert summary inside results table
        await query(
          `INSERT INTO results (student_id, exam_id, gpa, grade, total_marks, status)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (student_id, exam_id)
           DO UPDATE SET gpa = EXCLUDED.gpa,
                         grade = EXCLUDED.grade,
                         total_marks = EXCLUDED.total_marks,
                         status = EXCLUDED.status,
                         updated_at = CURRENT_TIMESTAMP`,
          [studentId, exam_id, overallGPA, overallGrade, totalObtained, status]
        );
      }
    }

    // 2. Upsert the publish record
    const publishedAt = is_published ? new Date() : null;
    await query(
      `INSERT INTO result_publish (exam_id, is_published, published_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (exam_id)
       DO UPDATE SET is_published = EXCLUDED.is_published,
                     published_at = EXCLUDED.published_at,
                     updated_at = CURRENT_TIMESTAMP`,
      [exam_id, is_published, publishedAt]
    );

    return NextResponse.json({
      message: is_published 
        ? 'Results compiled, graded, and published successfully.' 
        : 'Results unpublished successfully.'
    });
  } catch (error) {
    console.error('Error handling exam results compilation/publication:', error);
    return NextResponse.json(
      { error: 'Failed to process compilation or publication toggles. Internal server error.' },
      { status: 500 }
    );
  }
}
