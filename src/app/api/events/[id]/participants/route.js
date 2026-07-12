import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET participants for a specific event (Admin only)
export async function GET(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      const res_err_310 = { error: 'Unauthorized. Admins only.' };
      return NextResponse.json({
        success: false,
        message: res_err_310?.error || res_err_310?.message || 'An error occurred',
        error: res_err_310?.error || 'Internal Server Error',
        paylod: null
      }, { status: 403 });
    }

    const { id } = await params;

    const result = await query(
      `SELECT s.id, s.name, s.email, s.registration_number, ep.joined_at 
       FROM event_participants ep 
       JOIN students s ON ep.student_id = s.id 
       WHERE ep.event_id = $1
       ORDER BY ep.joined_at DESC`,
      [id]
    );

    const res_data_755 = { participants: result.rows };
      return NextResponse.json({
        success: true,
        message: res_data_755?.message || 'Successfully fecthed data',
        paylod: res_data_755
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event participants:', error);
    const res_err_1356 = { error: 'Failed to retrieve event participants. Internal server error.' };
      return NextResponse.json({
        success: false,
        message: res_err_1356?.error || res_err_1356?.message || 'An error occurred',
        error: res_err_1356?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
