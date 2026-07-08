import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-admin')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Missing token.' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Unauthorized. Invalid or expired token.' }, { status: 401 });
    }

    // Retrieve admin list
    const result = await query(
      `SELECT id, name, email, number, address, is_active, created_at 
       FROM admins 
       ORDER BY id ASC`
    );

    return NextResponse.json({ admins: result.rows });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve admins. Internal server error.' },
      { status: 500 }
    );
  }
}
