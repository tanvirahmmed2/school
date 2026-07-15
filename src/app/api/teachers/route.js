import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all teachers
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        t.id, 
        t.name, 
        t.email, 
        t.number, 
        t.designation, 
        t.address, 
        t.is_active, 
        t.is_registered, 
        t.is_permanent, 
        t.image, 
        t.created_at,
        t.grade_id,
        tps.name AS grade_name
      FROM teachers t
      LEFT JOIN teacher_pay_scale tps ON t.grade_id = tps.id
      ORDER BY t.name ASC
    `);
    const res_data = { teachers: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Teachers retrieved successfully',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve teachers. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// POST register a new teacher (Admin pre-creates placeholder)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admins only.',
        error: 'Unauthorized',
        paylod: null
      }, { status: 403 });
    }

    const { name, email, number, designation, is_permanent, grade_id } = await request.json();

    if (!name || !email || !number || !designation) {
      return NextResponse.json({
        success: false,
        message: 'All fields (name, email, number, designation) are required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // Check if email already registered in teachers table
    const teacherCheck = await query('SELECT id FROM teachers WHERE email = $1', [email.trim()]);
    if (teacherCheck.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'A teacher with this email is already registered.',
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }

    // Check if email already in admins table
    const adminCheck = await query('SELECT id FROM admins WHERE email = $1', [email.trim()]);
    if (adminCheck.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'This email is already in use by an administrative account.',
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }

    // Check if grade_id is valid if provided
    if (grade_id) {
      const gradeCheck = await query('SELECT id FROM teacher_pay_scale WHERE id = $1', [grade_id]);
      if (gradeCheck.rows.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Selected pay scale grade does not exist.',
          error: 'Bad Request',
          paylod: null
        }, { status: 400 });
      }
    }

    const newTeacher = await query(
      `INSERT INTO teachers (name, email, number, designation, is_active, is_registered, is_permanent, grade_id) 
       VALUES ($1, $2, $3, $4, FALSE, FALSE, $5, $6) 
       RETURNING id, name, email, number, designation, is_active, is_registered, is_permanent, grade_id`,
      [
        name.trim(), 
        email.trim().toLowerCase(), 
        number.trim(), 
        designation.trim(), 
        !!is_permanent,
        grade_id ? parseInt(grade_id, 10) : null
      ]
    );

    const res_data = { message: 'Teacher profile pre-created successfully.', teacher: newTeacher.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher placeholder:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create teacher placeholder. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
