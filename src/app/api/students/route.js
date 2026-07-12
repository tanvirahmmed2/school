import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all students (with class & section filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');
    const sectionId = searchParams.get('section_id');
    const regNo = searchParams.get('registration_number');

    let sql = `
      SELECT 
        s.*, 
        c.name AS class_name, 
        c.code AS class_code,
        sec.name AS section_name
      FROM students s
      JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
    `;
    let params = [];
    let conditions = [];

    if (classId) {
      params.push(classId);
      conditions.push(`s.class_id = $${params.length}`);
    }

    if (sectionId) {
      params.push(sectionId);
      conditions.push(`s.section_id = $${params.length}`);
    }

    if (regNo) {
      params.push(`%${regNo}%`);
      conditions.push(`s.registration_number ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY c.numeric_name ASC, sec.name ASC, s.registration_number ASC';

    const result = await query(sql, params);
    const res_data_1368 = { students: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_1368?.message || 'Successfully fecthed data',
        paylod: res_data_1368
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    const res_err_1733 = { error: 'Failed to retrieve students. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_1733?.error || res_err_1733?.message || 'An error occurred',
        error: res_err_1733?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST: Pre-create student account (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_2251 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_2251?.error || res_err_2251?.message || 'An error occurred',
        error: res_err_2251?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { registration_number, class_id, section_id } = await request.json();

    if (!registration_number || !class_id) {
      const res_err_2706 = { error: 'Registration number and Target class are required to pre-create account.' };
      return NextResponse.json({
        success: false,
        message: res_err_2706?.error || res_err_2706?.message || 'An error occurred',
        error: res_err_2706?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Verify class exists
    const classCheck = await query('SELECT id FROM classes WHERE id = $1', [class_id]);
    if (classCheck.rows.length === 0) {
      const res_err_3236 = { error: 'Target academic class not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_3236?.error || res_err_3236?.message || 'An error occurred',
        error: res_err_3236?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    // Verify section exists if provided
    if (section_id) {
      const secCheck = await query('SELECT id FROM sections WHERE id = $1 AND class_id = $2', [section_id, class_id]);
      if (secCheck.rows.length === 0) {
        const res_err_3795 = { error: 'Target section not found under this class.' };
      return NextResponse.json({
        success: false,
        message: res_err_3795?.error || res_err_3795?.message || 'An error occurred',
        error: res_err_3795?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
      }
    }

    // Check duplicate registration number
    const dupCheck = await query('SELECT id FROM students WHERE LOWER(registration_number) = LOWER($1)', [registration_number.trim()]);
    if (dupCheck.rows.length > 0) {
      const res_err_4363 = { error: 'A student account with this registration number already exists.' };
      return NextResponse.json({
        success: false,
        message: res_err_4363?.error || res_err_4363?.message || 'An error occurred',
        error: res_err_4363?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO students (registration_number, class_id, section_id, is_active, is_registered) 
       VALUES ($1, $2, $3, FALSE, FALSE) 
       RETURNING *`,
      [
        registration_number.trim(),
        class_id,
        section_id ? parseInt(section_id, 10) : null
      ]
    );

    const res_data_3702 = { message: 'Student account pre-created successfully.', student: result.rows[0] };
      return NextResponse.json({
        success: true,
        message: res_data_3702?.message || 'Successfully fecthed data',
        paylod: res_data_3702
      }, { status: 201 });
  } catch (error) {
    console.error('Error pre-creating student account:', error);
    const res_err_5526 = { error: 'Failed to pre-create student account. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_5526?.error || res_err_5526?.message || 'An error occurred',
        error: res_err_5526?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
