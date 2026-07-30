import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
        error: 'Not authenticated',
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token',
        error: 'Invalid token',
        paylod: null
      }, { status: 401 });
    }

    await query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT FALSE;');

    // Direct database query including is_two_factor_enabled
    const result = await query(`
      SELECT id, name, email, number, designation, address, is_active, is_registered, is_permanent, is_two_factor_enabled, image, image_id
      FROM teachers
      WHERE id = $1 AND is_active = TRUE AND is_registered = TRUE
    `, [decoded.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Teacher account is inactive or not found',
        error: 'Not found',
        paylod: null
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully fetched data',
      paylod: { teacher: result.rows[0] }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in teacher/me endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
        error: 'Not authenticated',
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token',
        error: 'Invalid token',
        paylod: null
      }, { status: 401 });
    }

    await query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT FALSE;');

    const body = await request.json();
    const { name, number, address, is_two_factor_enabled, image, image_id } = body;

    const checkRes = await query(
      'SELECT id, is_two_factor_enabled FROM teachers WHERE id = $1 AND is_active = TRUE',
      [decoded.id]
    );
    if (checkRes.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Teacher account not found',
        error: 'Not found',
        paylod: null
      }, { status: 404 });
    }

    const dbTeacher = checkRes.rows[0];

    const new2FASetting = is_two_factor_enabled !== undefined
      ? Boolean(is_two_factor_enabled)
      : Boolean(dbTeacher.is_two_factor_enabled);

    // Update query (email is read-only and NOT updated)
    const updateRes = await query(`
      UPDATE teachers
      SET name = COALESCE($1, name),
          number = COALESCE($2, number),
          address = COALESCE($3, address),
          is_two_factor_enabled = $4,
          image = COALESCE($5, image),
          image_id = COALESCE($6, image_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, name, email, number, designation, address, is_active, is_registered, is_permanent, is_two_factor_enabled, image, image_id
    `, [name, number, address, new2FASetting, image, image_id, decoded.id]);

    return NextResponse.json({
      success: true,
      message: 'Teacher profile updated successfully.',
      paylod: { teacher: updateRes.rows[0] }
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating teacher profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
