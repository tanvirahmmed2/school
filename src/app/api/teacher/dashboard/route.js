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

    // 1. Total assigned subjects
    const subjectsCountRes = await query(`
      SELECT COUNT(*) as count FROM class_subjects WHERE teacher_id = $1
    `, [teacherId]);
    const subjectsCount = parseInt(subjectsCountRes.rows[0]?.count || 0, 10);

    // 2. Total students in teacher's classes
    const studentsCountRes = await query(`
      SELECT COUNT(DISTINCT s.id) as count 
      FROM students s
      JOIN class_subjects cs ON s.class_id = cs.class_id 
      WHERE cs.teacher_id = $1 AND s.is_registered = TRUE AND s.is_active = TRUE
    `, [teacherId]);
    const studentsCount = parseInt(studentsCountRes.rows[0]?.count || 0, 10);

    // 3. Pending leave applications
    const pendingLeavesRes = await query(`
      SELECT COUNT(*) as count FROM leave_applications 
      WHERE teacher_id = $1 AND status = 'Pending'
    `, [teacherId]);
    const pendingLeavesCount = parseInt(pendingLeavesRes.rows[0]?.count || 0, 10);

    // 4. Total salary received (sum of basic + allowance - deductions for status = 'Paid')
    const salaryReceivedRes = await query(`
      SELECT SUM(basic + allowance - deductions) as total 
      FROM salaries 
      WHERE teacher_id = $1 AND status = 'Paid'
    `, [teacherId]);
    const salaryReceived = parseFloat(salaryReceivedRes.rows[0]?.total || 0);

    return NextResponse.json({
      stats: {
        subjectsCount,
        studentsCount,
        pendingLeavesCount,
        salaryReceived
      }
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
