import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

// GET all authorities
export async function GET() {
  try {
    const result = await query('SELECT * FROM authorities ORDER BY id ASC');
    return NextResponse.json({ authorities: result.rows });
  } catch (error) {
    console.error('Error fetching authorities:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve authorities. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create authority member (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { name, bio, designation, email, contact, image } = await request.json();

    if (!name || !designation) {
      return NextResponse.json(
        { error: 'Name and designation are required.' },
        { status: 400 }
      );
    }

    let imageUrl = null;
    let imageId = null;

    // Handle Cloudinary upload if base64 image data is provided
    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'authorities');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;
      } catch (uploadErr) {
        console.error('Cloudinary upload failure:', uploadErr);
        return NextResponse.json({ error: 'Failed to upload profile photo.' }, { status: 500 });
      }
    } else if (image) {
      // If it's already an external URL
      imageUrl = image;
    }

    const result = await query(
      `INSERT INTO authorities (name, bio, designation, email, contact, image, image_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        name.trim(),
        bio ? bio.trim() : null,
        designation.trim(),
        email ? email.trim() : null,
        contact ? contact.trim() : null,
        imageUrl,
        imageId
      ]
    );

    return NextResponse.json(
      { message: 'Authority member created successfully.', authority: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating authority member:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email address already registered.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create authority member. Internal server error.' },
      { status: 500 }
    );
  }
}
