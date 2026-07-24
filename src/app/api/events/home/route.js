import { NextResponse } from 'next/server';
import { query, ensureEventsTables } from '@/lib/db';

export async function GET() {
  try {
    await ensureEventsTables();
    const result = await query('SELECT * FROM events ORDER BY event_date ASC LIMIT 2');
    const res_data = { events: result.rows };
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched home events',
      paylod: res_data
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching home events:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve home events. Internal server error.',
      error: 'Internal Server Error',
      paylod: null
    }, { status: 500 });
  }
}
