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
    const res_data_456 = { clubNews: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_456?.message || 'Successfully fecthed data',
        paylod: res_data_456
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching club news:', error);
    const res_err_816 = { error: 'Failed to retrieve club news. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_816?.error || res_err_816?.message || 'An error occurred',
        error: res_err_816?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST create club news (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_1320 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_1320?.error || res_err_1320?.message || 'An error occurred',
        error: res_err_1320?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { club_id, title, content, image } = await request.json();

    if (!club_id || !title || !content) {
      const res_err_1761 = { error: 'Club, title, and content are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_1761?.error || res_err_1761?.message || 'An error occurred',
        error: res_err_1761?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
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
        const res_err_2464 = { error: 'Failed to upload cover image.' };
      return NextResponse.json({
        success: false,
        message: res_err_2464?.error || res_err_2464?.message || 'An error occurred',
        error: res_err_2464?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
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

    const res_data_2207 = { message: 'Club news created successfully.', clubNews: result.rows[0] };
      return NextResponse.json({
        success: true,
        message: res_data_2207?.message || 'Successfully fecthed data',
        paylod: res_data_2207
      }, { status: 201 });
  } catch (error) {
    console.error('Error creating club news:', error);
    const res_err_3544 = { error: 'Failed to create club news. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_3544?.error || res_err_3544?.message || 'An error occurred',
        error: res_err_3544?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
