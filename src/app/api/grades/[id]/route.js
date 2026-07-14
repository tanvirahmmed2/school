import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// PUT update a grade (Admin only)
export async function PUT(request, { params }) {
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

    const { id } = await params;
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

    // Check unique constraint for letter_grade (excluding current grade_id)
    const duplicateCheck = await query(
      'SELECT grade_id FROM mark_grades WHERE UPPER(letter_grade) = UPPER($1) AND grade_id <> $2',
      [trimmedLetterGrade, id]
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

    const updatedGrade = await query(
      `UPDATE mark_grades 
       SET letter_grade = $1, min_mark = $2, max_mark = $3 
       WHERE grade_id = $4 
       RETURNING *`,
      [trimmedLetterGrade, min, max, id]
    );

    if (updatedGrade.rowCount === 0) {
      const res_err = { error: 'Grade not found.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 404 });
    }

    const res_data = {
      message: 'Grade updated successfully.',
      grade: updatedGrade.rows[0]
    };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating grade:', error);
    const res_err = { error: 'Failed to update grade. Internal server error.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}

// DELETE a grade (Admin only)
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    const deleteResult = await query('DELETE FROM mark_grades WHERE grade_id = $1 RETURNING grade_id', [id]);

    if (deleteResult.rowCount === 0) {
      const res_err = { error: 'Grade not found.' };
      return NextResponse.json({
        success: false,
        message: res_err.error,
        error: res_err.error,
        paylod: null
      }, { status: 404 });
    }

    const res_data = {
      message: 'Grade deleted successfully.'
    };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting grade:', error);
    const res_err = { error: 'Failed to delete grade. Internal server error.' };
    return NextResponse.json({
      success: false,
      message: res_err.error,
      error: res_err.error,
      paylod: null
    }, { status: 500 });
  }
}
