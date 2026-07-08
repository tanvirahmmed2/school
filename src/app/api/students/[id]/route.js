import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT: Update student record (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      email,
      phone,
      registration_number,
      class_id,
      section_id,
      date_of_birth,
      address,
      parents_info,
      birth_certificate_number,
      is_active
    } = body;

    if (!registration_number || !class_id) {
      return NextResponse.json(
        { error: 'Registration number and Class are required.' },
        { status: 400 }
      );
    }

    // Verify student exists
    const checkExist = await query('SELECT id FROM students WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return NextResponse.json({ error: 'Student record not found.' }, { status: 404 });
    }

    // Check duplicate registration_number (excluding current ID)
    const dupReg = await query('SELECT id FROM students WHERE LOWER(registration_number) = LOWER($1) AND id <> $2', [registration_number.trim(), id]);
    if (dupReg.rows.length > 0) {
      return NextResponse.json(
        { error: 'A student account with this registration number already exists.' },
        { status: 400 }
      );
    }

    // Check duplicate email (if provided)
    if (email) {
      const dupEmail = await query('SELECT id FROM students WHERE LOWER(email) = LOWER($1) AND id <> $2', [email.trim(), id]);
      if (dupEmail.rows.length > 0) {
        return NextResponse.json(
          { error: 'A student account with this email address already exists.' },
          { status: 400 }
        );
      }
    }

    // Check duplicate birth_certificate_number (if provided)
    if (birth_certificate_number) {
      const dupCert = await query('SELECT id FROM students WHERE LOWER(birth_certificate_number) = LOWER($1) AND id <> $2', [birth_certificate_number.trim(), id]);
      if (dupCert.rows.length > 0) {
        return NextResponse.json(
          { error: 'A student account with this birth certificate number already exists.' },
          { status: 400 }
        );
      }
    }

    const result = await query(
      `UPDATE students
       SET name = $1,
           email = $2,
           phone = $3,
           registration_number = $4,
           class_id = $5,
           section_id = $6,
           date_of_birth = $7,
           address = $8,
           parents_info = $9,
           birth_certificate_number = $10,
           is_active = $11,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        name ? name.trim() : null,
        email ? email.trim().toLowerCase() : null,
        phone ? phone.trim() : null,
        registration_number.trim(),
        class_id,
        section_id ? parseInt(section_id, 10) : null,
        date_of_birth || null,
        address ? address.trim() : null,
        parents_info ? parents_info.trim() : null,
        birth_certificate_number ? birth_certificate_number.trim() : null,
        is_active === undefined ? true : is_active,
        id
      ]
    );

    return NextResponse.json({
      message: 'Student account updated successfully.',
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student account. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete student (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Student record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Student record deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student. Internal server error.' },
      { status: 500 }
    );
  }
}
