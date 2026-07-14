import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all allocations
export async function GET() {
  try {
    const result = await query(`
      SELECT ha.id, ha.student_id, ha.room_id, ha.allocated_at, ha.vacated_at, ha.status, ha.created_at, 
             s.name as student_name, s.registration_number as student_reg_number, 
             hr.room_number, hr.room_type, hr.capacity, 
             h.name as hostel_name
      FROM hostel_allocations ha
      JOIN students s ON ha.student_id = s.id
      JOIN hostel_rooms hr ON ha.room_id = hr.id
      JOIN hostels h ON hr.hostel_id = h.id
      ORDER BY ha.status ASC, ha.allocated_at DESC
    `);
    const res_data = { allocations: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched allocations list',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching allocations:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve allocations list. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// POST allocate a room
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

    const { student_id, room_id, allocated_at } = await request.json();

    if (!student_id || !room_id) {
      return NextResponse.json({
        success: false,
        message: 'Student and Room selection are required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // Gender matching validation check
    const studentRes = await query('SELECT name, gender FROM students WHERE id = $1', [student_id]);
    if (studentRes.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Student record not found.',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }
    const studentGender = studentRes.rows[0].gender;
    const studentName = studentRes.rows[0].name || 'Unnamed Student';

    const hostelRes = await query(`
      SELECT h.name as hostel_name, h.gender as hostel_gender 
      FROM hostel_rooms hr 
      JOIN hostels h ON hr.hostel_id = h.id 
      WHERE hr.id = $1
    `, [room_id]);
    if (hostelRes.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Hostel/Room record not found.',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }
    const hostelGender = hostelRes.rows[0].hostel_gender;
    const hostelName = hostelRes.rows[0].hostel_name;

    if (!studentGender || !hostelGender || studentGender.toLowerCase() !== hostelGender.toLowerCase()) {
      return NextResponse.json({
        success: false,
        message: `Gender mismatch. Student ${studentName} is ${studentGender || 'unspecified'}, but Hostel ${hostelName} is designated for ${hostelGender || 'unspecified'}.`,
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // 1. Check if the student already has an active allocation
    const checkActive = await query(
      "SELECT id FROM hostel_allocations WHERE student_id = $1 AND status = 'Active'",
      [student_id]
    );
    if (checkActive.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'This student already has an active room allocation.',
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }

    // 2. Check room capacity
    const roomRes = await query('SELECT capacity FROM hostel_rooms WHERE id = $1', [room_id]);
    if (roomRes.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Room not found.',
        error: 'Not Found',
        paylod: null
      }, { status: 404 });
    }
    const capacity = roomRes.rows[0].capacity;

    const countRes = await query(
      "SELECT COUNT(*) as count FROM hostel_allocations WHERE room_id = $1 AND status = 'Active'",
      [room_id]
    );
    const activeCount = parseInt(countRes.rows[0].count, 10);

    if (activeCount >= capacity) {
      return NextResponse.json({
        success: false,
        message: 'This room is already at full capacity.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // 3. Perform allocation
    const result = await query(
      `INSERT INTO hostel_allocations (student_id, room_id, allocated_at, status) 
       VALUES ($1, $2, $3, 'Active') 
       RETURNING id, student_id, room_id, allocated_at, status`,
      [student_id, room_id, allocated_at ? new Date(allocated_at) : new Date()]
    );

    const res_data = { message: 'Room allocated successfully.', allocation: result.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error allocating room:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to allocate room. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
