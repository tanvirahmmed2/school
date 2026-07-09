import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

// Helper to verify if the requester has permission for this teacher's qualifications
async function verifyAccess(teacherId) {
  const adminAuth = await isAdmin();
  if (adminAuth) return true;

  const cookieStore = await cookies();
  const token = cookieStore.get('fit-teacher')?.value;
  if (!token) return false;

  const decoded = verifyJWT(token);
  if (!decoded || !decoded.id) return false;

  return parseInt(decoded.id, 10) === parseInt(teacherId, 10);
}

// GET qualifications for a teacher
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');

    if (!teacherId) {
      return NextResponse.json({ error: 'teacher_id parameter is required.' }, { status: 400 });
    }

    const hasAccess = await verifyAccess(teacherId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized. Admins or the owner teacher only.' }, { status: 403 });
    }

    const result = await query(
      'SELECT * FROM teacher_qualifications WHERE teacher_id = $1 ORDER BY passing_year DESC',
      [teacherId]
    );

    return NextResponse.json({ qualifications: result.rows });
  } catch (error) {
    console.error('Error fetching teacher qualifications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve qualifications. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST create qualification for teacher
export async function POST(request) {
  try {
    const { teacher_id, degree, institution, passing_year, result: examResult } = await request.json();

    if (!teacher_id || !degree || !institution || !passing_year) {
      return NextResponse.json(
        { error: 'All fields (teacher_id, degree, institution, passing_year) are required.' },
        { status: 400 }
      );
    }

    const hasAccess = await verifyAccess(teacher_id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized. Admins or the owner teacher only.' }, { status: 403 });
    }

    // Verify teacher exists
    const teacherCheck = await query('SELECT id FROM teachers WHERE id = $1', [teacher_id]);
    if (teacherCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO teacher_qualifications (teacher_id, degree, institution, passing_year, result) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        teacher_id,
        degree.trim(),
        institution.trim(),
        parseInt(passing_year, 10),
        examResult ? examResult.trim() : null
      ]
    );

    return NextResponse.json(
      { message: 'Qualification added successfully.', qualification: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating teacher qualification:', error);
    return NextResponse.json(
      { error: 'Failed to add qualification. Internal server error.' },
      { status: 500 }
    );
  }
}
