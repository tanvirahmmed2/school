import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, isTeacher } from '@/lib/auth';

// GET student attendance sheets (Admin/Teachers)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');
    const sectionId = searchParams.get('section_id');
    const date = searchParams.get('date');

    if (!classId || !sectionId || !date) {
      const res_err_478 = { error: 'Class ID, Section ID, and Date (YYYY-MM-DD) are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_478?.error || res_err_478?.message || 'An error occurred',
        error: res_err_478?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
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
    const res_data_1197 = { attendanceSheet: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_1197?.message || 'Successfully fecthed data',
        paylod: res_data_1197
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student attendance sheet:', error);
    const res_err_1813 = { error: 'Failed to retrieve attendance logs. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_1813?.error || res_err_1813?.message || 'An error occurred',
        error: res_err_1813?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST bulk log student attendance (Admin/Teachers only)
export async function POST(request) {
  try {
    const authenticated = (await isAdmin()) || (await isTeacher());
    if (!authenticated) {
      const res_err_2372 = { error: 'Unauthorized. Admins/Teachers only.' };
      return NextResponse.json({
        success: false,
        message: res_err_2372?.error || res_err_2372?.message || 'An error occurred',
        error: res_err_2372?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { class_id, section_id, date, records } = await request.json();

    if (!class_id || !section_id || !date || !records || !Array.isArray(records)) {
      const res_err_2869 = { error: 'Class, Section, Date, and records array are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_2869?.error || res_err_2869?.message || 'An error occurred',
        error: res_err_2869?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
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

    const res_data_2937 = {
      message: 'Student attendance logs saved successfully.'
    };
      return NextResponse.json({
        success: true,
        message: res_data_2937?.message || 'Successfully fecthed data',
        paylod: res_data_2937
      }, { status: 200 });
  } catch (error) {
    console.error('Error saving student attendance logs:', error);
    const res_err_4282 = { error: 'Failed to save attendance logs. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_4282?.error || res_err_4282?.message || 'An error occurred',
        error: res_err_4282?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
