import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isRegistrar } from '@/lib/auth';

// GET all news
export async function GET() {
  try {
    const result = await query('SELECT * FROM news ORDER BY created_at DESC');
    return NextResponse.json({ news: result.rows });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve news. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create news (Registrar only)
export async function POST(request) {
  try {
    const authenticated = await isRegistrar();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Registrars only.' }, { status: 403 });
    }

    const { title, content, image, image_id } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO news (title, content, image, image_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title.trim(), content.trim(), image ? image.trim() : null, image_id ? image_id.trim() : null]
    );

    return NextResponse.json(
      { message: 'News article created successfully.', news: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news article. Internal server error.' },
      { status: 500 }
    );
  }
}
