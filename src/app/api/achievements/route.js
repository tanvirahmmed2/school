import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

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

    const { title, description, image } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    let imageUrl = null;
    let imageId = null;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'achievements');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;
      } catch (uploadErr) {
        console.error('Cloudinary achievements upload failed:', uploadErr);
        return NextResponse.json({ error: 'Failed to upload cover image.' }, { status: 500 });
      }
    } else if (image) {
      imageUrl = image;
    }

    const result = await query(
      `INSERT INTO achievements (title, description, image_url, image_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title.trim(), description.trim(), imageUrl, imageId]
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
