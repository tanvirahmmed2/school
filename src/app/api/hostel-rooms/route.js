import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET all rooms, optionally filter by hostel_id
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostelId = searchParams.get('hostel_id');

    let dbQuery = `
      SELECT hr.id, hr.hostel_id, hr.room_number, hr.room_type, hr.capacity, hr.availability_status, hr.created_at, 
             h.name as hostel_name, h.gender as hostel_gender
      FROM hostel_rooms hr
      JOIN hostels h ON hr.hostel_id = h.id
    `;
    const params = [];

    if (hostelId) {
      dbQuery += ' WHERE hr.hostel_id = $1';
      params.push(hostelId);
    }

    dbQuery += ' ORDER BY h.name ASC, hr.room_number ASC';

    const result = await query(dbQuery, params);
    const res_data = { rooms: result.rows };

    return NextResponse.json({
      success: true,
      message: 'Successfully fetched hostel rooms',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching hostel rooms:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve rooms. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}

// POST create a room
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

    const { hostel_id, room_number, room_type, capacity, availability_status } = await request.json();

    if (!hostel_id || !room_number || !room_type || !capacity) {
      return NextResponse.json({
        success: false,
        message: 'Hostel ID, room number, type, and capacity are required.',
        error: 'Bad Request',
        paylod: null
      }, { status: 400 });
    }

    // Check duplicate room number in same hostel
    const check = await query(
      'SELECT id FROM hostel_rooms WHERE hostel_id = $1 AND room_number = $2',
      [hostel_id, room_number.trim()]
    );
    if (check.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'A room with this number already exists in this hostel.',
        error: 'Conflict',
        paylod: null
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO hostel_rooms (hostel_id, room_number, room_type, capacity, availability_status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, hostel_id, room_number, room_type, capacity, availability_status`,
      [
        hostel_id,
        room_number.trim(),
        room_type.trim(),
        parseInt(capacity, 10),
        availability_status || 'Available'
      ]
    );

    const res_data = { message: 'Hostel room created successfully.', room: result.rows[0] };
    return NextResponse.json({
      success: true,
      message: res_data.message,
      paylod: res_data
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create room. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
