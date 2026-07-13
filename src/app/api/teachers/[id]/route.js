import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, hashPassword } from '@/lib/auth';

// GET a specific teacher (Public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const result = await query(
      'SELECT id, name, email, designation, address, image, is_permanent FROM teachers WHERE id = $1 AND is_active = TRUE',
      [id]
    );

    if (result.rows.length === 0) {
      const res_err_404 = { error: 'Teacher record not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_404?.error || res_err_404?.message || 'An error occurred',
        error: res_err_404?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_200 = { teacher: result.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data_200?.message || 'Successfully fecthed data',
      paylod: res_data_200
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    const res_err_500 = { error: 'Failed to retrieve teacher details. Internal server error.' };
    return NextResponse.json({
      success: false,
      message: res_err_500?.error || res_err_500?.message || 'An error occurred',
      error: res_err_500?.error || 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// PUT update a teacher (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_307 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_307?.error || res_err_307?.message || 'An error occurred',
        error: res_err_307?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;
    const { name, email, number, designation, address, is_active, is_permanent, password } = await request.json();

    if (!name || !email || !number || !designation || is_active === undefined || is_permanent === undefined) {
      const res_err_848 = { error: 'Name, email, phone number, designation, is_active, and is_permanent parameters are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_848?.error || res_err_848?.message || 'An error occurred',
        error: res_err_848?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Check email uniqueness (excluding current teacher id)
    const duplicateCheck = await query(
      'SELECT id FROM teachers WHERE email = $1 AND id <> $2',
      [email.trim(), id]
    );

    if (duplicateCheck.rows.length > 0) {
      const res_err_1464 = { error: 'This email is already in use by another teacher.' };
      return NextResponse.json({
        success: false,
        message: res_err_1464?.error || res_err_1464?.message || 'An error occurred',
        error: res_err_1464?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    let updatedTeacher;

    if (password) {
      const passwordHash = await hashPassword(password);
      updatedTeacher = await query(
        `UPDATE teachers 
         SET name = $1, email = $2, number = $3, designation = $4, address = $5, is_active = $6, is_permanent = $7, password_hash = $8, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $9 
         RETURNING id, name, email, number, designation, address, is_active, is_registered, is_permanent`,
        [name.trim(), email.trim().toLowerCase(), number.trim(), designation.trim(), address ? address.trim() : null, is_active, !!is_permanent, passwordHash, id]
      );
    } else {
      updatedTeacher = await query(
        `UPDATE teachers 
         SET name = $1, email = $2, number = $3, designation = $4, address = $5, is_active = $6, is_permanent = $7, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 
         RETURNING id, name, email, number, designation, address, is_active, is_registered, is_permanent`,
        [name.trim(), email.trim().toLowerCase(), number.trim(), designation.trim(), address ? address.trim() : null, is_active, !!is_permanent, id]
      );
    }

    if (updatedTeacher.rowCount === 0) {
      const res_err_2912 = { error: 'Teacher record not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_2912?.error || res_err_2912?.message || 'An error occurred',
        error: res_err_2912?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_2360 = {
      message: 'Teacher details updated successfully.',
      teacher: updatedTeacher.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_2360?.message || 'Successfully fecthed data',
        paylod: res_data_2360
      }, { status: 200 });
  } catch (error) {
    console.error('Error updating teacher:', error);
    const res_err_3720 = { error: 'Failed to update teacher. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_3720?.error || res_err_3720?.message || 'An error occurred',
        error: res_err_3720?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// DELETE a teacher (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_4233 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_4233?.error || res_err_4233?.message || 'An error occurred',
        error: res_err_4233?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM teachers WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      const res_err_4731 = { error: 'Teacher not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_4731?.error || res_err_4731?.message || 'An error occurred',
        error: res_err_4731?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_3476 = {
      message: 'Teacher account deleted successfully.'
    };
      return NextResponse.json({
        success: true,
        message: res_data_3476?.message || 'Successfully fecthed data',
        paylod: res_data_3476
      }, { status: 200 });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    const res_err_5493 = { error: 'Failed to delete teacher. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_5493?.error || res_err_5493?.message || 'An error occurred',
        error: res_err_5493?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
