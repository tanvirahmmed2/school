import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET all recognitions
export async function GET() {
  try {
    const result = await query('SELECT * FROM recognitions ORDER BY date DESC, created_at DESC');
    return NextResponse.json({ recognitions: result.rows });
  } catch (error) {
    console.error('Error fetching recognitions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve recognitions. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create recognition (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, description, awarded_by, date, image } = await request.json();

    if (!name || !awarded_by || !date) {
      return NextResponse.json(
        { error: 'Name, awarded by, and date are required.' },
        { status: 400 }
      );
    }

    // Generate unique slug from name
    let finalSlug = slugify(name);
    if (!finalSlug) finalSlug = `recognition-${Date.now()}`;
    const checkSlug = await query('SELECT id FROM recognitions WHERE slug = $1', [finalSlug]);
    if (checkSlug.rows.length > 0) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    let imageUrl = null;
    let imageId = null;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'recognitions');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;
      } catch (uploadErr) {
        console.error('Cloudinary recognitions upload failed:', uploadErr);
        return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
      }
    } else if (image) {
      imageUrl = image;
    }

    const result = await query(
      `INSERT INTO recognitions (name, slug, description, awarded_by, date, image, image_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name.trim(), finalSlug, description?.trim() || null, awarded_by.trim(), date, imageUrl, imageId]
    );

    return NextResponse.json(
      { message: 'Recognition created successfully.', recognition: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating recognition:', error);
    return NextResponse.json(
      { error: 'Failed to create recognition. Internal server error.' },
      { status: 500 }
    );
  }
}
