import { NextResponse } from 'next/server';
import { getStaffUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const staff = await getStaffUser();
    if (!staff) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      paylod: { staff }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in staff /me endpoint:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
