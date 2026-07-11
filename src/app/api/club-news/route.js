import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

// GET all club news
export async function GET() {
  try {
    const result = await query(`
      SELECT cn.*, c.name as club_name 
      FROM club_news cn
      JOIN clubs c ON cn.club_id = c.id
      ORDER BY cn.created_at DESC
    `);
    return NextResponse.json({ clubNews: result.rows });
  } catch (error) {
    console.error('Error fetching club news:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve club news. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create club news (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { club_id, title, content, image } = await request.json();

    if (!club_id || !title || !content) {
      return NextResponse.json(
        { error: 'Club, title, and content are required.' },
        { status: 400 }
      );
    }

    let imageUrl = null;
    let imageId = null;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'club_news');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;
      } catch (uploadErr) {
        console.error('Cloudinary club news upload failed:', uploadErr);
        return NextResponse.json({ error: 'Failed to upload cover image.' }, { status: 500 });
      }
    } else if (image) {
      imageUrl = image;
    }

    const result = await query(
      `INSERT INTO club_news (club_id, title, content, image_url, image_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [club_id, title.trim(), content.trim(), imageUrl, imageId]
    );

    return NextResponse.json(
      { message: 'Club news created successfully.', clubNews: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating club news:', error);
    return NextResponse.json(
      { error: 'Failed to create club news. Internal server error.' },
      { status: 500 }
    );
  }
}
