import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUser, comparePassword, hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const sessionAdmin = await getAdminUser();
    if (!sessionAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin session invalid or expired.',
        error: 'Unauthorized',
        paylod: null,
      }, { status: 401 });
    }

    await query('ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT TRUE;');

    const res = await query(
      'SELECT id, name, email, number, address, is_active, is_two_factor_enabled, created_at, updated_at FROM admins WHERE id = $1',
      [sessionAdmin.id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Admin profile not found.',
        error: 'Not Found',
        paylod: null,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin profile retrieved successfully.',
      paylod: { admin: res.rows[0] },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve admin profile.',
      error: 'Internal Server Error',
      paylod: null,
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sessionAdmin = await getAdminUser();
    if (!sessionAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin session invalid or expired.',
        error: 'Unauthorized',
        paylod: null,
      }, { status: 401 });
    }

    await query('ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT TRUE;');

    const body = await request.json();
    const { name, number, address, is_two_factor_enabled, current_password, new_password } = body;

    // Fetch admin record
    const adminResult = await query('SELECT * FROM admins WHERE id = $1', [sessionAdmin.id]);
    if (adminResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Admin record not found.',
        error: 'Not Found',
        paylod: null,
      }, { status: 404 });
    }

    const dbAdmin = adminResult.rows[0];

    let hashedNewPassword = null;
    if (new_password) {
      if (!current_password) {
        return NextResponse.json({
          success: false,
          message: 'Current password is required to set a new password.',
          error: 'Missing Current Password',
          paylod: null,
        }, { status: 400 });
      }

      const isValidPassword = await comparePassword(current_password, dbAdmin.password_hash);
      if (!isValidPassword) {
        return NextResponse.json({
          success: false,
          message: 'Current password is incorrect.',
          error: 'Invalid Password',
          paylod: null,
        }, { status: 400 });
      }

      hashedNewPassword = await hashPassword(new_password);
    }

    const new2FASetting = is_two_factor_enabled !== undefined 
      ? Boolean(is_two_factor_enabled) 
      : (dbAdmin.is_two_factor_enabled !== false);

    // Perform update (Notice: email is NOT updated, keeping email read-only)
    const updateResult = await query(
      `UPDATE admins 
       SET name = COALESCE($1, name), 
           number = COALESCE($2, number), 
           address = COALESCE($3, address), 
           is_two_factor_enabled = $4,
           password_hash = COALESCE($5, password_hash), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING id, name, email, number, address, is_active, is_two_factor_enabled, created_at, updated_at`,
      [name, number, address, new2FASetting, hashedNewPassword, sessionAdmin.id]
    );

    const updatedAdmin = updateResult.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Admin profile updated successfully.',
      paylod: { admin: updatedAdmin },
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update admin profile.',
      error: 'Internal Server Error',
      paylod: null,
    }, { status: 500 });
  }
}
