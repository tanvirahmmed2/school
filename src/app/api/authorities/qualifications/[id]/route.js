import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update authority qualification (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { degree, institution, passing_year, result: examResult } = await request.json();

    if (!degree || !institution || !passing_year) {
      return NextResponse.json(
        { error: 'Fields (degree, institution, passing_year) are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE authority_qualifications 
       SET degree = $1, institution = $2, passing_year = $3, result = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [
        degree.trim(),
        institution.trim(),
        parseInt(passing_year, 10),
        examResult ? examResult.trim() : null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Qualification not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Qualification updated successfully.',
      qualification: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating authority qualification:', error);
    return NextResponse.json(
      { error: 'Failed to update qualification. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE authority qualification (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM authority_qualifications WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Qualification not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Qualification deleted successfully.',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deleting authority qualification:', error);
    return NextResponse.json(
      { error: 'Failed to delete qualification. Internal server error.' },
      { status: 500 }
    );
  }
}
