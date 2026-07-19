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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let sql;
    let result;

    if (type === 'staff') {
      sql = `
        SELECT s.*, 
               st.name as staff_name,
               st.role as staff_role
        FROM staff_salaries s
        LEFT JOIN staffs st ON s.staff_id = st.id
        ORDER BY s.id DESC
      `;
      result = await query(sql);
    } else {
      sql = `
        SELECT s.*, 
               t.name as teacher_name
        FROM salaries s
        LEFT JOIN teachers t ON s.teacher_id = t.id
      `;
      if (type === 'teacher') {
        sql += ` WHERE s.teacher_id IS NOT NULL`;
      }
      sql += ` ORDER BY s.id DESC`;
      result = await query(sql);
    }
    const res_data_784 = { salaries: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_784?.message || 'Successfully fecthed data',
        paylod: res_data_784
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching salaries:', error);
    const res_err_1371 = { error: 'Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_1371?.error || res_err_1371?.message || 'An error occurred',
        error: res_err_1371?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
