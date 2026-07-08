import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a class (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, numeric_name, code } = await request.json();

    if (!name || numeric_name === undefined || !code) {
      return NextResponse.json(
        { error: 'All fields (name, numeric_name, code) are required.' },
        { status: 400 }
      );
    }

    const numericVal = parseInt(numeric_name, 10);
    if (isNaN(numericVal)) {
      return NextResponse.json(
        { error: 'Numeric name must be a valid number.' },
        { status: 400 }
      );
    }

    // Check unique constraints (excluding current class ID)
    const duplicateCheck = await query(
      'SELECT id, name, code FROM classes WHERE (name = $1 OR code = $2) AND id <> $3',
      [name, code, id]
    );

    if (duplicateCheck.rows.length > 0) {
      const match = duplicateCheck.rows[0];
      if (match.name === name) {
        return NextResponse.json({ error: 'A class with this name already exists.' }, { status: 400 });
      }
      if (match.code === code) {
        return NextResponse.json({ error: 'A class with this code already exists.' }, { status: 400 });
      }
    }

    const updatedClass = await query(
      `UPDATE classes 
       SET name = $1, numeric_name = $2, code = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING *`,
      [name, numericVal, code, id]
    );

    if (updatedClass.rowCount === 0) {
      return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Class updated successfully.',
      class: updatedClass.rows[0]
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { error: 'Failed to update class. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a class (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM classes WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Class and all its associated sections deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Failed to delete class. Internal server error.' },
      { status: 500 }
    );
  }
}
