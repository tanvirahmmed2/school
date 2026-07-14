import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET Admissions circular list (public or admin)
export async function GET() {
  try {
    const result = await query(`
      SELECT adm.*, c.name AS class_name 
      FROM admissions adm
      JOIN classes c ON adm.class_id = c.id
      ORDER BY adm.admission_start_date DESC
    `);
    return NextResponse.json({
      success: true,
      paylod: { circulars: result.rows }
    });
  } catch (error) {
    console.error('Error fetching admissions circulars:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create admission circular (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      class_id,
      min_age,
      max_age,
      birth_regi_number,
      admission_start_date,
      finish_date,
      result_date
    } = body;

    if (!title || !class_id || !admission_start_date || !finish_date) {
      return NextResponse.json({ success: false, error: 'Title, Class, Start Date and Finish Date are required.' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO admissions (
        title, class_id, min_age, max_age, birth_regi_number, 
        admission_start_date, finish_date, result_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title.trim(),
      parseInt(class_id, 10),
      min_age ? parseInt(min_age, 10) : null,
      max_age ? parseInt(max_age, 10) : null,
      birth_regi_number ? birth_regi_number.trim() : null,
      admission_start_date,
      finish_date,
      result_date || null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Admission circular created successfully.',
      paylod: { circular: result.rows[0] }
    });
  } catch (error) {
    console.error('Error creating admission circular:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT update admission circular (Admin only)
export async function PUT(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      title,
      class_id,
      min_age,
      max_age,
      birth_regi_number,
      admission_start_date,
      finish_date,
      result_date
    } = body;

    if (!id || !title || !class_id || !admission_start_date || !finish_date) {
      return NextResponse.json({ success: false, error: 'ID, Title, Class, Start Date and Finish Date are required.' }, { status: 400 });
    }

    const result = await query(`
      UPDATE admissions SET
        title = $1,
        class_id = $2,
        min_age = $3,
        max_age = $4,
        birth_regi_number = $5,
        admission_start_date = $6,
        finish_date = $7,
        result_date = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [
      title.trim(),
      parseInt(class_id, 10),
      min_age ? parseInt(min_age, 10) : null,
      max_age ? parseInt(max_age, 10) : null,
      birth_regi_number ? birth_regi_number.trim() : null,
      admission_start_date,
      finish_date,
      result_date || null,
      parseInt(id, 10)
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Admission circular not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admission circular updated successfully.',
      paylod: { circular: result.rows[0] }
    });
  } catch (error) {
    console.error('Error updating admission circular:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE admission circular (Admin only)
export async function DELETE(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID parameter is required.' }, { status: 400 });
    }

    const result = await query('DELETE FROM admissions WHERE id = $1 RETURNING *', [parseInt(id, 10)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Admission circular not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admission circular deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting admission circular:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
