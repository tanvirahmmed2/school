import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, hashPassword } from '@/lib/auth';

// PUT update a staff member (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, email, number, designation, address, role, is_active, password } = await request.json();

    if (!name || !email || !number || !designation || !role || is_active === undefined) {
      return NextResponse.json(
        { error: 'All fields (name, email, number, designation, role, is_active) are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check email uniqueness in staff (excluding current staff id)
    const duplicateStaffCheck = await query(
      'SELECT id FROM staff WHERE email = $1 AND id <> $2',
      [trimmedEmail, id]
    );
    if (duplicateStaffCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by another staff member.' }, { status: 400 });
    }

    // Check email uniqueness in teachers
    const teacherCheck = await query('SELECT id FROM teachers WHERE email = $1', [trimmedEmail]);
    if (teacherCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by a teacher.' }, { status: 400 });
    }

    // Check email uniqueness in admins
    const adminCheck = await query('SELECT id FROM admins WHERE email = $1', [trimmedEmail]);
    if (adminCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by an administrative account.' }, { status: 400 });
    }

    let updatedStaff;

    if (password) {
      const passwordHash = await hashPassword(password);
      updatedStaff = await query(
        `UPDATE staff 
         SET name = $1, email = $2, number = $3, designation = $4, address = $5, role = $6, is_active = $7, password_hash = $8, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $9 
         RETURNING id, name, email, number, designation, address, role, is_active, is_registered`,
        [name.trim(), trimmedEmail, number.trim(), designation.trim(), address ? address.trim() : null, role.trim().toLowerCase(), is_active, passwordHash, id]
      );
    } else {
      updatedStaff = await query(
        `UPDATE staff 
         SET name = $1, email = $2, number = $3, designation = $4, address = $5, role = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 
         RETURNING id, name, email, number, designation, address, role, is_active, is_registered`,
        [name.trim(), trimmedEmail, number.trim(), designation.trim(), address ? address.trim() : null, role.trim().toLowerCase(), is_active, id]
      );
    }

    if (updatedStaff.rowCount === 0) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Staff member details updated successfully.',
      staff: updatedStaff.rows[0]
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a staff member (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM staff WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Staff member account deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff member. Internal server error.' },
      { status: 500 }
    );
  }
}
