import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

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

// POST create news (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { title, content, image, image_id, slug } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let finalSlug = slug ? slugify(slug) : slugify(title);
    if (!finalSlug) {
      finalSlug = `news-${Date.now()}`;
    }
    const checkSlug = await query('SELECT id FROM news WHERE slug = $1', [finalSlug]);
    if (checkSlug.rows.length > 0) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    let imageUrl = null;
    let imageId = null;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'news');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;
      } catch (uploadErr) {
        console.error('Cloudinary news upload failed:', uploadErr);
        return NextResponse.json({ error: 'Failed to upload cover image.' }, { status: 500 });
      }
    } else if (image) {
      imageUrl = image;
      imageId = image_id || null;
    }

    const result = await query(
      `INSERT INTO news (title, slug, content, image, image_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title.trim(), finalSlug, content.trim(), imageUrl, imageId]
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
