import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET admission application status by ID or Email (Public route)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    if (!search) {
      return NextResponse.json({ success: false, error: 'Application ID or Email is required.' }, { status: 400 });
    }

    let sql = `
      SELECT 
        sa.id AS application_id,
        sa.name AS candidate_name,
        sa.email AS candidate_email,
        sa.status AS application_status,
        sa.payment_status,
        sa.created_at,
        c.name AS class_name,
        adm.name AS circular_name,
        adm.is_result_published,
        aa.roll_number,
        sec.name AS section_name
      FROM student_admissions sa
      LEFT JOIN classes c ON sa.class_id = c.id
      LEFT JOIN admissions adm ON sa.admission_id = adm.id
      LEFT JOIN accepted_admissions aa ON sa.id = aa.student_admission_id
      LEFT JOIN sections sec ON aa.section_id = sec.id
    `;

    const params = [];
    const searchTrimmed = search.trim();

    // Check if search looks like an email or id
    if (searchTrimmed.includes('@')) {
      sql += ' WHERE LOWER(sa.email) = LOWER($1)';
      params.push(searchTrimmed);
    } else if (!isNaN(parseInt(searchTrimmed, 10))) {
      sql += ' WHERE sa.id = $1';
      params.push(parseInt(searchTrimmed, 10));
    } else {
      // Fallback: search email or name partially
      sql += ' WHERE LOWER(sa.email) = LOWER($1) OR LOWER(sa.name) LIKE LOWER($2)';
      params.push(searchTrimmed, `%${searchTrimmed}%`);
    }

    sql += ' ORDER BY sa.created_at DESC LIMIT 1';

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Admission application not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paylod: {
        application: result.rows[0]
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking public admission status:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
