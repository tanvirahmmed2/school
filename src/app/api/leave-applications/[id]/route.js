import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid status (Approved or Rejected) is required.' }, { status: 400 });
    }

    const result = await query(
      `UPDATE leave_applications 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, status`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Leave application not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Leave application status updated to ${status}.`,
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating leave application:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
