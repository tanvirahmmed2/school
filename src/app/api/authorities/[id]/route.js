import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// GET authority member by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query('SELECT * FROM authorities WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Authority member not found.' }, { status: 404 });
    }

    return NextResponse.json({ authority: result.rows[0] });
  } catch (error) {
    console.error('Error fetching authority member details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve authority member. Internal server error.' },
      { status: 500 }
    );
  }
}

// PUT update authority member (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { name, bio, designation, email, contact, image } = await request.json();

    if (!name || !designation) {
      return NextResponse.json(
        { error: 'Name and designation are required.' },
        { status: 400 }
      );
    }

    // Fetch existing member details to know the old image
    const existing = await query('SELECT image, image_id FROM authorities WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Authority member not found.' }, { status: 404 });
    }

    const oldImage = existing.rows[0];
    let imageUrl = oldImage.image;
    let imageId = oldImage.image_id;

    // If new image base64 is provided, upload and delete old
    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'authorities');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;

        // Delete old image if it exists in Cloudinary
        if (oldImage.image_id) {
          await deleteImage(oldImage.image_id);
        }
      } catch (uploadErr) {
        console.error('Cloudinary replace failure:', uploadErr);
        return NextResponse.json({ error: 'Failed to upload new profile photo.' }, { status: 500 });
      }
    } else if (image === null || image === '') {
      // Clear image
      imageUrl = null;
      imageId = null;
      if (oldImage.image_id) {
        await deleteImage(oldImage.image_id);
      }
    }

    const result = await query(
      `UPDATE authorities 
       SET name = $1, bio = $2, designation = $3, email = $4, contact = $5, image = $6, image_id = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [
        name.trim(),
        bio ? bio.trim() : null,
        designation.trim(),
        email ? email.trim() : null,
        contact ? contact.trim() : null,
        imageUrl,
        imageId,
        id
      ]
    );

    return NextResponse.json({
      message: 'Authority member updated successfully.',
      authority: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating authority member:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email address already in use.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update authority member. Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE authority member (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;

    // Fetch existing member details to know the old image
    const existing = await query('SELECT image_id FROM authorities WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Authority member not found.' }, { status: 404 });
    }

    const oldImage = existing.rows[0];

    // Delete database record first
    const result = await query('DELETE FROM authorities WHERE id = $1 RETURNING id', [id]);

    // Clean up photo on Cloudinary if present
    if (oldImage.image_id) {
      await deleteImage(oldImage.image_id);
    }

    return NextResponse.json({
      message: 'Authority member deleted successfully.',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deleting authority member:', error);
    return NextResponse.json(
      { error: 'Failed to delete authority member. Internal server error.' },
      { status: 500 }
    );
  }
}
