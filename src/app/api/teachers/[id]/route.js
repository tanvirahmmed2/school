import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, hashPassword } from '@/lib/auth';

// PUT update a teacher (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, email, number, address, is_active, password } = await request.json();

    if (!name || !email || !number || !address || is_active === undefined) {
      return NextResponse.json(
        { error: 'All fields (name, email, number, address, is_active) are required.' },
        { status: 400 }
      );
    }

    // Check email uniqueness (excluding current teacher id)
    const duplicateCheck = await query(
      'SELECT id FROM teachers WHERE email = $1 AND id <> $2',
      [email, id]
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This email is already in use by another teacher.' }, { status: 400 });
    }

    let updatedTeacher;

    if (password) {
      const passwordHash = await hashPassword(password);
      updatedTeacher = await query(
        `UPDATE teachers 
         SET name = $1, email = $2, number = $3, address = $4, is_active = $5, password_hash = $6, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $7 
         RETURNING id, name, email, number, address, is_active`,
        [name.trim(), email.trim().toLowerCase(), number.trim(), address.trim(), is_active, passwordHash, id]
      );
    } else {
      updatedTeacher = await query(
        `UPDATE teachers 
         SET name = $1, email = $2, number = $3, address = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $6 
         RETURNING id, name, email, number, address, is_active`,
        [name.trim(), email.trim().toLowerCase(), number.trim(), address.trim(), is_active, id]
      );
    }

    if (updatedTeacher.rowCount === 0) {
      return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Teacher details updated successfully.',
      teacher: updatedTeacher.rows[0]
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to update teacher. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a teacher (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM teachers WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Teacher account deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { error: 'Failed to delete teacher. Internal server error.' },
      { status: 500 }
    );
  }
}
