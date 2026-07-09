import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all notices
export async function GET() {
  try {
    const result = await query('SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC');
    return NextResponse.json({ notices: result.rows });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve notices. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create notice (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { title, link, is_pinned = false } = await request.json();

    if (!title || !link) {
      return NextResponse.json(
        { error: 'Title and Google Drive Link are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO notices (title, link, is_pinned) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title.trim(), link.trim(), !!is_pinned]
    );

    return NextResponse.json(
      { message: 'Notice created successfully.', notice: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { error: 'Failed to create notice. Internal server error.' },
      { status: 500 }
    );
  }
}
