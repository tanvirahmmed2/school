import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// PUT update a club
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_277 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_277?.error || res_err_277?.message || 'An error occurred',
        error: res_err_277?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;
    const { name, slug, description, image } = await request.json();

    if (!name) {
      const res_err_715 = { error: 'Club name is required.' };
      return NextResponse.json({
        success: false,
        message: res_err_715?.error || res_err_715?.message || 'An error occurred',
        error: res_err_715?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const finalSlug = slug 
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check duplicate name or slug (excluding current ID)
    const duplicate = await query(
      'SELECT id FROM clubs WHERE (name = $1 OR slug = $2) AND id <> $3',
      [name.trim(), finalSlug, id]
    );

    if (duplicate.rows.length > 0) {
      const res_err_1439 = { error: 'Another club with this name or slug already exists.' };
      return NextResponse.json({
        success: false,
        message: res_err_1439?.error || res_err_1439?.message || 'An error occurred',
        error: res_err_1439?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const existing = await query('SELECT image, image_id FROM clubs WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      const res_err_2115 = { error: 'Club profile not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_2115?.error || res_err_2115?.message || 'An error occurred',
        error: res_err_2115?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }
    const currentClub = existing.rows[0];

    let imageUrl = currentClub.image;
    let imageId = currentClub.image_id;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'clubs');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;

        if (currentClub.image_id) {
          try {
            await deleteImage(currentClub.image_id);
          } catch (delErr) {
            console.error('Failed to delete old club image:', delErr);
          }
        }
      } catch (uploadErr) {
        console.error('Cloudinary upload failure:', uploadErr);
        const res_err = { error: 'Failed to upload club image.' };
        return NextResponse.json({
          success: false,
          message: res_err?.error || res_err?.message || 'An error occurred',
          error: res_err?.error || 'Internal Server Error',
          paylod: null
        }, { status: 500 });
      }
    } else if (image === null) {
      imageUrl = null;
      imageId = null;
      if (currentClub.image_id) {
        try {
          await deleteImage(currentClub.image_id);
        } catch (delErr) {
          console.error('Failed to delete old club image:', delErr);
        }
      }
    }

    const result = await query(
      `UPDATE clubs 
       SET name = $1, slug = $2, description = $3, image = $4, image_id = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING id, name, slug, description, image, image_id`,
      [name.trim(), finalSlug, description ? description.trim() : null, imageUrl, imageId, id]
    );

    if (result.rowCount === 0) {
      const res_err_2115 = { error: 'Club profile not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_2115?.error || res_err_2115?.message || 'An error occurred',
        error: res_err_2115?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_1561 = {
      message: 'Club details updated successfully.',
      club: result.rows[0]
    };
      return NextResponse.json({
        success: true,
        message: res_data_1561?.message || 'Successfully fecthed data',
        paylod: res_data_1561
      }, { status: 200 });
  } catch (error) {
    console.error('Error updating club:', error);
    const res_err_2904 = { error: 'Failed to update club. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_2904?.error || res_err_2904?.message || 'An error occurred',
        error: res_err_2904?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// DELETE a club
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_3398 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_3398?.error || res_err_3398?.message || 'An error occurred',
        error: res_err_3398?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const existing = await query('SELECT image_id FROM clubs WHERE id = $1', [id]);
    const result = await query('DELETE FROM clubs WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      const res_err_3881 = { error: 'Club not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_3881?.error || res_err_3881?.message || 'An error occurred',
        error: res_err_3881?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    if (existing.rows.length > 0 && existing.rows[0].image_id) {
      try {
        await deleteImage(existing.rows[0].image_id);
      } catch (delErr) {
        console.error('Failed to delete club image from Cloudinary:', delErr);
      }
    }

    const res_data_2623 = {
      message: 'Club deleted successfully.'
    };
      return NextResponse.json({
        success: true,
        message: res_data_2623?.message || 'Successfully fecthed data',
        paylod: res_data_2623
      }, { status: 200 });
  } catch (error) {
    console.error('Error deleting club:', error);
    const res_err_4626 = { error: 'Failed to delete club. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_4626?.error || res_err_4626?.message || 'An error occurred',
        error: res_err_4626?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
