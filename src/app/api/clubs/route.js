import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all clubs
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, slug, description, created_at FROM clubs ORDER BY name ASC'
    );
    return NextResponse.json({ clubs: result.rows });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve clubs. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create a new club
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, slug, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Club name is required.' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    const finalSlug = slug 
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check uniqueness of name/slug
    const check = await query('SELECT id FROM clubs WHERE name = $1 OR slug = $2', [name.trim(), finalSlug]);
    if (check.rows.length > 0) {
      return NextResponse.json({ error: 'A club with this name or slug already exists.' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO clubs (name, slug, description) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, slug, description`,
      [name.trim(), finalSlug, description ? description.trim() : null]
    );

    return NextResponse.json(
      { message: 'Club created successfully.', club: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating club:', error);
    return NextResponse.json(
      { error: 'Failed to create club. Internal server error.' },
      { status: 500 }
    );
  }
}
