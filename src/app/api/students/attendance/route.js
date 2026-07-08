import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET student attendance sheets (Admin/Teachers)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');
    const sectionId = searchParams.get('section_id');
    const date = searchParams.get('date');

    if (!classId || !sectionId || !date) {
      return NextResponse.json(
        { error: 'Class ID, Section ID, and Date (YYYY-MM-DD) are required.' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.registration_number,
        sa.id AS attendance_id,
        COALESCE(sa.status, 'Present') AS status,
        sa.remarks,
        sa.date
      FROM students s
      LEFT JOIN student_attendances sa ON s.id = sa.student_id AND sa.date = $3
      WHERE s.class_id = $1 
        AND s.section_id = $2
        AND s.is_registered = TRUE
      ORDER BY s.registration_number ASC
    `;

    const result = await query(sql, [classId, sectionId, date]);
    return NextResponse.json({ attendanceSheet: result.rows });
  } catch (error) {
    console.error('Error fetching student attendance sheet:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve attendance logs. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST bulk log student attendance (Admin/Teachers only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { class_id, section_id, date, records } = await request.json();

    if (!class_id || !section_id || !date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'Class, Section, Date, and records array are required.' },
        { status: 400 }
      );
    }

    // Process each student record inside database transactions or sequential loops
    for (const rec of records) {
      const { student_id, status, remarks } = rec;
      if (!student_id || !status) continue;

      await query(
        `INSERT INTO student_attendances (student_id, date, status, remarks)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (student_id, date)
         DO UPDATE SET 
           status = EXCLUDED.status, 
           remarks = EXCLUDED.remarks, 
           updated_at = CURRENT_TIMESTAMP`,
        [student_id, date, status, remarks || null]
      );
    }

    return NextResponse.json({
      message: 'Student attendance logs saved successfully.'
    });
  } catch (error) {
    console.error('Error saving student attendance logs:', error);
    return NextResponse.json(
      { error: 'Failed to save attendance logs. Internal server error.' },
      { status: 500 }
    );
  }
}
