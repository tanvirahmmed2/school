import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET the active announcement (at most one exists)
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, slug, description, total_room, location, created_at, updated_at FROM announcements LIMIT 1'
    );
    const res_data = { announcement: result.rows[0] || null };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched announcement',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve announcement. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// POST create/overwrite the single announcement
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admins only.',
        error: 'Unauthorized',
        paylod: null
      }, { status: 403 });
    }

    const { name, slug, description, total_room, location } = await request.json();

    if (!name) {
      return NextResponse.json({
        success: false,
        message: 'Announcement title/name is required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    const finalSlug = slug 
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Remove any existing announcements to enforce the single-announcement policy
    await query('DELETE FROM announcements');

    const result = await query(
      `INSERT INTO announcements (name, slug, description, total_room, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, slug, description, total_room, location, created_at, updated_at`,
      [
        name.trim(),
        finalSlug,
        description ? description.trim() : null,
        total_room ? parseInt(total_room, 10) : null,
        location ? location.trim() : null
      ]
    );

    const res_data = {
      message: 'Announcement updated successfully.',
      announcement: result.rows[0]
    };

    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update announcement. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// DELETE the active announcement
export async function DELETE() {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admins only.',
        error: 'Unauthorized',
        paylod: null
      }, { status: 403 });
    }

    await query('DELETE FROM announcements');

    const res_data = { message: 'Announcement deleted successfully.' };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete announcement. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
