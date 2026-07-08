import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a section (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { class_id, name, capacity, room_number } = await request.json();

    if (!class_id || !name) {
      return NextResponse.json(
        { error: 'Class ID and Section Name are required.' },
        { status: 400 }
      );
    }

    const capVal = capacity !== undefined ? parseInt(capacity, 10) : 40;
    if (isNaN(capVal)) {
      return NextResponse.json(
        { error: 'Capacity must be a valid number.' },
        { status: 400 }
      );
    }

    // Verify class exists
    const classCheck = await query('SELECT id FROM classes WHERE id = $1', [class_id]);
    if (classCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Selected class not found.' }, { status: 404 });
    }

    // Verify unique section name under the same class (excluding current section)
    const duplicateCheck = await query(
      'SELECT id FROM sections WHERE class_id = $1 AND LOWER(name) = LOWER($2) AND id <> $3',
      [class_id, name.trim(), id]
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'A section with this name already exists under the selected class.' },
        { status: 400 }
      );
    }

    const updatedSection = await query(
      `UPDATE sections 
       SET class_id = $1, name = $2, capacity = $3, room_number = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [class_id, name.trim(), capVal, room_number ? room_number.trim() : null, id]
    );

    if (updatedSection.rowCount === 0) {
      return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Section updated successfully.',
      section: updatedSection.rows[0]
    });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a section (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const deleteResult = await query('DELETE FROM sections WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Section deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section. Internal server error.' },
      { status: 500 }
    );
  }
}
