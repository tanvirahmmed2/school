import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update news (Admin only)
export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_288 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_288?.error || res_err_288?.message || 'An error occurred',
        error: res_err_288?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;
    const { title, content, image, image_id } = await request.json();

    if (!title || !content) {
      const res_err_747 = { error: 'Title and content are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_747?.error || res_err_747?.message || 'An error occurred',
        error: res_err_747?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `UPDATE news 
       SET title = $1, content = $2, image = $3, image_id = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [title.trim(), content.trim(), image ? image.trim() : null, image_id ? image_id.trim() : null, id]
    );

    if (result.rows.length === 0) {
      const res_err_1416 = { error: 'News article not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_1416?.error || res_err_1416?.message || 'An error occurred',
        error: res_err_1416?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_1094 = {
      message: 'News article updated successfully.',
      news: result.rows[0],
    };
      return NextResponse.json({
        success: true,
        message: res_data_1094?.message || 'Successfully fecthed data',
        paylod: res_data_1094
      }, { status: 200 });
  } catch (error) {
    console.error('Error updating news:', error);
    const res_err_2206 = { error: 'Failed to update news article. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_2206?.error || res_err_2206?.message || 'An error occurred',
        error: res_err_2206?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// DELETE news (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_2719 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_2719?.error || res_err_2719?.message || 'An error occurred',
        error: res_err_2719?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const result = await query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      const res_err_3204 = { error: 'News article not found.' };
      return NextResponse.json({
        success: false,
        message: res_err_3204?.error || res_err_3204?.message || 'An error occurred',
        error: res_err_3204?.error || 'Internal Server Error',
        paylod: null
      }, { status: 404 });
    }

    const res_data_2186 = {
      message: 'News article deleted successfully.',
      id: result.rows[0].id,
    };
      return NextResponse.json({
        success: true,
        message: res_data_2186?.message || 'Successfully fecthed data',
        paylod: res_data_2186
      }, { status: 200 });
  } catch (error) {
    console.error('Error deleting news:', error);
    const res_err_3995 = { error: 'Failed to delete news article. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_3995?.error || res_err_3995?.message || 'An error occurred',
        error: res_err_3995?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
