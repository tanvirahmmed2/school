import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_244 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_244?.error || res_err_244?.message || 'An error occurred',
        error: res_err_244?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const result = await query(
      `SELECT ta.*, t.name as teacher_name 
       FROM teacher_attendances ta
       JOIN teachers t ON ta.teacher_id = t.id
       ORDER BY ta.date DESC, t.name ASC`
    );

    const res_data_589 = { attendances: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_589?.message || 'Successfully fecthed data',
        paylod: res_data_589
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendances:', error);
    const res_err_1182 = { error: 'Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_1182?.error || res_err_1182?.message || 'An error occurred',
        error: res_err_1182?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
