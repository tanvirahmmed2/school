import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET assignments for a club and options
export async function GET(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('club_id');

    // Load static lookups
    const teachersPromise = query('SELECT id, name, email FROM teachers ORDER BY name ASC');
    const staffPromise = query("SELECT id, name, email FROM staff WHERE role = 'register' ORDER BY name ASC");
    const studentsPromise = query('SELECT id, name, registration_number FROM students ORDER BY name ASC');

    const [teachersRes, staffRes, studentsRes] = await Promise.all([
      teachersPromise,
      staffPromise,
      studentsPromise
    ]);

    let assignedAdmins = [];
    let assignedEditors = [];
    let assignedMembers = [];

    if (clubId) {
      const adminsPromise = query(
        `SELECT teacher_id AS id, designation FROM clubs_admins WHERE club_id = $1`,
        [clubId]
      );
      const editorsPromise = query(
        `SELECT staff_id AS id FROM club_editors WHERE club_id = $1`,
        [clubId]
      );
      const membersPromise = query(
        `SELECT student_id AS id FROM club_members WHERE club_id = $1`,
        [clubId]
      );

      const [adminsRes, editorsRes, membersRes] = await Promise.all([
        adminsPromise,
        editorsPromise,
        membersPromise
      ]);

      assignedAdmins = adminsRes.rows.map(r => ({ teacher_id: parseInt(r.id, 10), designation: r.designation || '' }));
      assignedEditors = editorsRes.rows.map(r => r.id);
      assignedMembers = membersRes.rows.map(r => r.id);
    }

    return NextResponse.json({
      teachers: teachersRes.rows,
      staff: staffRes.rows,
      students: studentsRes.rows,
      assignedAdmins,
      assignedEditors,
      assignedMembers
    });
  } catch (error) {
    console.error('Error fetching assignments details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve assignment data. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST update assignments
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const body = await request.json();
    const { club_id, teachers, teacher_ids, staff_ids, student_ids } = body;

    if (!club_id) {
      return NextResponse.json({ error: 'Parameter club_id is required.' }, { status: 400 });
    }

    // 1. Wipe old assignments
    await query('DELETE FROM clubs_admins WHERE club_id = $1', [club_id]);
    await query('DELETE FROM club_editors WHERE club_id = $1', [club_id]);
    await query('DELETE FROM club_members WHERE club_id = $1', [club_id]);

    // 2. Insert new ones
    if (teachers && Array.isArray(teachers)) {
      for (const entry of teachers) {
        const tId = typeof entry === 'object' ? entry.teacher_id : entry;
        const des = typeof entry === 'object' ? entry.designation : null;
        await query(
          'INSERT INTO clubs_admins (club_id, teacher_id, designation) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [club_id, tId, des ? des.trim() : null]
        );
      }
    } else if (teacher_ids && Array.isArray(teacher_ids)) {
      for (const tId of teacher_ids) {
        await query(
          'INSERT INTO clubs_admins (club_id, teacher_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [club_id, tId]
        );
      }
    }

    if (staff_ids && Array.isArray(staff_ids)) {
      for (const sId of staff_ids) {
        await query(
          'INSERT INTO club_editors (club_id, staff_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [club_id, sId]
        );
      }
    }

    if (student_ids && Array.isArray(student_ids)) {
      for (const stId of student_ids) {
        await query(
          'INSERT INTO club_members (club_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [club_id, stId]
        );
      }
    }

    return NextResponse.json({
      message: 'Club administrative, editor, and member roles updated successfully.'
    });
  } catch (error) {
    console.error('Error updating club assignments:', error);
    return NextResponse.json(
      { error: 'Failed to process assignments. Internal server error.' },
      { status: 500 }
    );
  }
}
