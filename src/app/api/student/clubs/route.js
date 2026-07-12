import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

// GET list of all clubs and join status
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) {
      const res_err_367 = { error: 'Not authenticated' };
      return NextResponse.json({
        success: false,
        message: res_err_367?.error || res_err_367?.message || 'An error occurred',
        error: res_err_367?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      const res_err_756 = { error: 'Invalid token' };
      return NextResponse.json({
        success: false,
        message: res_err_756?.error || res_err_756?.message || 'An error occurred',
        error: res_err_756?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const studentId = decoded.id;

    // Fetch all clubs
    const allClubsRes = await query('SELECT * FROM clubs ORDER BY name ASC');

    // Fetch student's joined clubs
    const joinedClubsRes = await query('SELECT club_id FROM club_members WHERE student_id = $1', [studentId]);
    const joinedClubIds = joinedClubsRes.rows.map(row => String(row.club_id));

    const res_data_1016 = {
      clubs: allClubsRes.rows,
      joinedClubIds
    };
      return NextResponse.json({
        success: true,
        message: res_data_1016?.message || 'Successfully fecthed data',
        paylod: res_data_1016
      }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student clubs:', error);
    const res_err_1875 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_1875?.error || res_err_1875?.message || 'An error occurred',
        error: res_err_1875?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}

// POST join or leave a club
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) {
      const res_err_2390 = { error: 'Not authenticated' };
      return NextResponse.json({
        success: false,
        message: res_err_2390?.error || res_err_2390?.message || 'An error occurred',
        error: res_err_2390?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      const res_err_2783 = { error: 'Invalid token' };
      return NextResponse.json({
        success: false,
        message: res_err_2783?.error || res_err_2783?.message || 'An error occurred',
        error: res_err_2783?.error || 'Internal Server Error',
        paylod: null
      }, { status: 401 });
    }

    const studentId = decoded.id;
    const { club_id, action } = await request.json();

    if (!club_id || !action || !['join', 'leave'].includes(action)) {
      const res_err_3258 = { error: 'club_id and action (join/leave) are required.' };
      return NextResponse.json({
        success: false,
        message: res_err_3258?.error || res_err_3258?.message || 'An error occurred',
        error: res_err_3258?.error || 'Internal Server Error',
        paylod: null
      }, { status: 400 });
    }

    if (action === 'join') {
      await query(
        'INSERT INTO club_members (club_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [club_id, studentId]
      );
      const res_data_2447 = { message: 'Successfully joined the club.' };
      return NextResponse.json({
        success: true,
        message: res_data_2447?.message || 'Successfully fecthed data',
        paylod: res_data_2447
      }, { status: 200 });
    } else {
      await query(
        'DELETE FROM club_members WHERE club_id = $1 AND student_id = $2',
        [club_id, studentId]
      );
      const res_data_2946 = { message: 'Successfully left the club.' };
      return NextResponse.json({
        success: true,
        message: res_data_2946?.message || 'Successfully fecthed data',
        paylod: res_data_2946
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error modifying club membership:', error);
    const res_err_4726 = { error: 'Internal server error' };
      return NextResponse.json({
        success: false,
        message: res_err_4726?.error || res_err_4726?.message || 'An error occurred',
        error: res_err_4726?.error || 'Internal Server Error',
        paylod: null
      }, { status: 500 });
  }
}
