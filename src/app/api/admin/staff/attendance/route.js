import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all staff members and their attendance for a specific date
export async function GET(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const result = await query(
      `SELECT s.id AS staff_id, s.name, s.email, s.role,
              a.id AS attendance_id, a.date, a.check_in, a.check_out, a.status
       FROM staffs s
       LEFT JOIN staff_attendance a ON s.id = a.staff_id AND a.date = $1
       WHERE s.is_active = TRUE AND s.is_registered = TRUE
       ORDER BY s.name ASC`,
      [date]
    );

    return NextResponse.json({
      success: true,
      paylod: { staffAttendance: result.rows }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin staff attendance:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

// POST bulk save/override staff attendance marked by Admin
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { date, records } = await request.json();

    if (!date || !records || !Array.isArray(records)) {
      return NextResponse.json({ success: false, error: 'Date and records array are required.' }, { status: 400 });
    }

    for (const record of records) {
      const { staff_id, status, check_in, check_out } = record;
      if (!staff_id || !status) continue;

      await query(
        `INSERT INTO staff_attendance (staff_id, date, status, check_in, check_out)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (staff_id, date)
         DO UPDATE SET
           status = EXCLUDED.status,
           check_in = EXCLUDED.check_in,
           check_out = EXCLUDED.check_out,
           updated_at = CURRENT_TIMESTAMP`,
        [
          parseInt(staff_id, 10),
          date,
          status,
          check_in || null,
          check_out || null
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Staff attendance marked successfully.'
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving admin staff attendance:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
