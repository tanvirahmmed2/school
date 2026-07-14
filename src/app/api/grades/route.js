import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all grades
export async function GET() {
  try {
    const result = await query('SELECT * FROM mark_grades ORDER BY min_mark DESC');
    const res_data = { grades: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched grades data',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching grades:', error);
    const res_err = { error: 'Failed to retrieve grades. Internal server error.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}

// POST create grade (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 403 });
    }

    const { letter_grade, min_mark, max_mark } = await request.json();

    if (!letter_grade || min_mark === undefined || max_mark === undefined) {
      const res_err = { error: 'Letter grade, minimum mark, and maximum mark are required.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    const min = parseFloat(min_mark);
    const max = parseFloat(max_mark);

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > 100 || max > 100) {
      const res_err = { error: 'Marks must be numeric values between 0 and 100.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    if (min > max) {
      const res_err = { error: 'Minimum mark cannot be greater than maximum mark.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    const trimmedLetterGrade = letter_grade.trim();
    if (trimmedLetterGrade.length > 5) {
      const res_err = { error: 'Letter grade must be 5 characters or less.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    // Check unique constraint for letter_grade
    const duplicateCheck = await query(
      'SELECT letter_grade FROM mark_grades WHERE UPPER(letter_grade) = UPPER($1)',
      [trimmedLetterGrade]
    );

    if (duplicateCheck.rows.length > 0) {
      const res_err = { error: `A grade with the letter "${trimmedLetterGrade}" already exists.` };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 400 });
    }

    const newGrade = await query(
      `INSERT INTO mark_grades (letter_grade, min_mark, max_mark) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [trimmedLetterGrade, min, max]
    );

    const res_data = { message: 'Grade created successfully.', grade: newGrade.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating grade:', error);
    const res_err = { error: 'Failed to create grade. Internal server error.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}
