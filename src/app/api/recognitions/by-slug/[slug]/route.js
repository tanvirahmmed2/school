import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET single recognition by slug (public)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const result = await query('SELECT * FROM recognitions WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Recognition not found.' }, { status: 404 });
    }
    return NextResponse.json({ recognition: result.rows[0] });
  } catch (error) {
    console.error('Error fetching recognition by slug:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve recognition. Internal server error.' },
      { status: 500 }
    );
  }
}
