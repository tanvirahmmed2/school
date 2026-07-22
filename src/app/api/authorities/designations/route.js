import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all designations
export async function GET() {
  try {
    const result = await query('SELECT * FROM authority_designations ORDER BY id ASC');
    const res_data = { designations: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched designations',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching designations:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve designations. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// POST create designation (Admin only)
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

    const { title, slug, description } = await request.json();

    if (!title || !slug) {
      return NextResponse.json({
        success: false,
        message: 'Title and slug are required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO authority_designations (title, slug, description) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title.trim(), slug.trim().toLowerCase(), description ? description.trim() : null]
    );

    return NextResponse.json({
      success: true,
      message: 'Designation created successfully.',
      paylod: { designation: result.rows[0] }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating designation:', error);
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        message: 'Designation title or slug already exists.',
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      message: 'Failed to create designation. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
