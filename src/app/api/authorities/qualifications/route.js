import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET qualifications for an authority member
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authorityId = searchParams.get('authority_id');

    if (!authorityId) {
      return NextResponse.json({ error: 'authority_id parameter is required.' }, { status: 400 });
    }

    const result = await query(
      'SELECT * FROM authority_qualifications WHERE authority_id = $1 ORDER BY passing_year DESC',
      [authorityId]
    );

    return NextResponse.json({ qualifications: result.rows });
  } catch (error) {
    console.error('Error fetching authority qualifications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve qualifications. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create qualification for authority member (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { authority_id, degree, institution, passing_year, result: examResult } = await request.json();

    if (!authority_id || !degree || !institution || !passing_year) {
      return NextResponse.json(
        { error: 'All fields (authority_id, degree, institution, passing_year) are required.' },
        { status: 400 }
      );
    }

    // Verify authority member exists
    const authCheck = await query('SELECT id FROM authorities WHERE id = $1', [authority_id]);
    if (authCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Authority member not found.' }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO authority_qualifications (authority_id, degree, institution, passing_year, result) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        authority_id,
        degree.trim(),
        institution.trim(),
        parseInt(passing_year, 10),
        examResult ? examResult.trim() : null
      ]
    );

    return NextResponse.json(
      { message: 'Qualification added successfully.', qualification: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating authority qualification:', error);
    return NextResponse.json(
      { error: 'Failed to add qualification. Internal server error.' },
      { status: 500 }
    );
  }
}
