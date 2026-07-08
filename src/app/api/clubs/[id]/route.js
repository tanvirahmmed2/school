import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a club
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, slug, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Club name is required.' }, { status: 400 });
    }

    const finalSlug = slug 
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check duplicate name or slug (excluding current ID)
    const duplicate = await query(
      'SELECT id FROM clubs WHERE (name = $1 OR slug = $2) AND id <> $3',
      [name.trim(), finalSlug, id]
    );

    if (duplicate.rows.length > 0) {
      return NextResponse.json({ error: 'Another club with this name or slug already exists.' }, { status: 400 });
    }

    const result = await query(
      `UPDATE clubs 
       SET name = $1, slug = $2, description = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, name, slug, description`,
      [name.trim(), finalSlug, description ? description.trim() : null, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Club profile not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Club details updated successfully.',
      club: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating club:', error);
    return NextResponse.json(
      { error: 'Failed to update club. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE a club
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM clubs WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Club not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Club deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting club:', error);
    return NextResponse.json(
      { error: 'Failed to delete club. Internal server error.' },
      { status: 500 }
    );
  }
}
