import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const teacherId = decoded.id;

    // Fetch salary ledger for this teacher
    const result = await query(`
      SELECT id, month, basic, allowance, deductions, status, created_at, updated_at
      FROM salaries
      WHERE teacher_id = $1
      ORDER BY id DESC
    `, [teacherId]);

    return NextResponse.json({ salaries: result.rows });
  } catch (error) {
    console.error('Error fetching teacher salary history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
