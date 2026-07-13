import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

// GET all clubs
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, slug, description, image, image_id, created_at FROM clubs ORDER BY name ASC'
    );
    const res_data_348 = { clubs: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_348?.message || 'Successfully fecthed data',
        paylod: res_data_348
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    const res_err_701 = { error: 'Failed to retrieve clubs. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_701?.error || res_err_701?.message || 'An error occurred',
        error: res_err_701?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST create a new club
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_1189 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_1189?.error || res_err_1189?.message || 'An error occurred',
        error: res_err_1189?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { name, slug, description, image } = await request.json();

    if (!name) {
      const res_err_1598 = { error: 'Club name is required.' };
      return NextResponse.json({
        success: false,
        message: res_err_1598?.error || res_err_1598?.message || 'An error occurred',
        error: res_err_1598?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    // Auto-generate slug if not provided
    const finalSlug = slug 
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check uniqueness of name/slug
    const check = await query('SELECT id FROM clubs WHERE name = $1 OR slug = $2', [name.trim(), finalSlug]);
    if (check.rows.length > 0) {
      const res_err_2300 = { error: 'A club with this name or slug already exists.' };
      return NextResponse.json({
        success: false,
        message: res_err_2300?.error || res_err_2300?.message || 'An error occurred',
        error: res_err_2300?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    let imageUrl = null;
    let imageId = null;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(image, 'clubs');
        imageUrl = uploadResult.url;
        imageId = uploadResult.publicId;
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
    } else if (image) {
      imageUrl = image;
    }

    const result = await query(
      `INSERT INTO clubs (name, slug, description, image, image_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, slug, description, image, image_id`,
      [name.trim(), finalSlug, description ? description.trim() : null, imageUrl, imageId]
    );

    const res_data_2003 = { message: 'Club created successfully.', club: result.rows[0] };
      return NextResponse.json({
        success: true,
        message: res_data_2003?.message || 'Successfully fecthed data',
        paylod: res_data_2003
      }, { status: 201 });
  } catch (error) {
    console.error('Error creating club:', error);
    const res_err_3326 = { error: 'Failed to create club. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_3326?.error || res_err_3326?.message || 'An error occurred',
        error: res_err_3326?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
