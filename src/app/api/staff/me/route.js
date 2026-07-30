import { NextResponse } from 'next/server';
import { getStaffUser, comparePassword, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionStaff = await getStaffUser();
    if (!sessionStaff) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await query('ALTER TABLE staffs ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT FALSE;');

    const result = await query(
      'SELECT id, name, email, phone, role, address, is_active, is_registered, is_two_factor_enabled, created_at, updated_at FROM staffs WHERE id = $1',
      [sessionStaff.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Staff account not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paylod: { staff: result.rows[0] }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in staff /me GET endpoint:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sessionStaff = await getStaffUser();
    if (!sessionStaff) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await query('ALTER TABLE staffs ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT FALSE;');

    const body = await request.json();
    const { name, phone, address, is_two_factor_enabled, current_password, new_password } = body;

    const checkRes = await query('SELECT * FROM staffs WHERE id = $1 AND is_active = TRUE', [sessionStaff.id]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Staff account not found.' }, { status: 404 });
    }

    const dbStaff = checkRes.rows[0];

    let hashedNewPassword = null;
    if (new_password) {
      if (!current_password) {
        return NextResponse.json({ success: false, error: 'Current password is required.' }, { status: 400 });
      }

      const isValidPassword = await comparePassword(current_password, dbStaff.password_hash);
      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400 });
      }

      hashedNewPassword = await hashPassword(new_password);
    }

    const new2FASetting = is_two_factor_enabled !== undefined
      ? Boolean(is_two_factor_enabled)
      : Boolean(dbStaff.is_two_factor_enabled);

    // Update query (email is locked / read-only and NOT updated)
    const updateRes = await query(`
      UPDATE staffs
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          address = COALESCE($3, address),
          is_two_factor_enabled = $4,
          password_hash = COALESCE($5, password_hash),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, name, email, phone, role, address, is_active, is_registered, is_two_factor_enabled, created_at, updated_at
    `, [name, phone, address, new2FASetting, hashedNewPassword, sessionStaff.id]);

    return NextResponse.json({
      success: true,
      message: 'Staff profile updated successfully.',
      paylod: { staff: updateRes.rows[0] }
    }, { status: 200 });

  } catch (error) {
    console.error('Error in staff /me PUT endpoint:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
