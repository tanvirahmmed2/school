import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all achievements
export async function GET() {
  try {
    const result = await query('SELECT * FROM achievements ORDER BY created_at DESC');
    return NextResponse.json({ achievements: result.rows });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve achievements. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create achievement (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { title, description, category } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO achievements (title, description, category) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title.trim(), description.trim(), category.trim()]
    );

    return NextResponse.json(
      { message: 'Achievement created successfully.', achievement: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Failed to create achievement. Internal server error.' },
      { status: 500 }
    );
  }
}
