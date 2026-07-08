import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET student fines (Admin and Students)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    let sql = `
      SELECT 
        sf.*, 
        s.name AS student_name, 
        s.registration_number,
        fee.title AS linked_fee_title
      FROM student_fines sf
      JOIN students s ON sf.student_id = s.id
      LEFT JOIN student_fees fee ON sf.fee_id = fee.id
    `;
    let params = [];
    let conditions = [];

    if (studentId) {
      params.push(studentId);
      conditions.push(`sf.student_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY sf.created_at DESC, s.registration_number ASC';

    const result = await query(sql, params);
    return NextResponse.json({ fines: result.rows });
  } catch (error) {
    console.error('Error fetching student fines:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve student fines. Internal server error.' },
      { status: 500 }
    );
  }
}

// POST: Add student fine (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { student_id, fee_id, title, amount } = await request.json();

    if (!student_id || !title || amount === undefined) {
      return NextResponse.json(
        { error: 'Student ID, Fine Title, and Fine Amount are required.' },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      return NextResponse.json(
        { error: 'Fine Amount must be a valid non-negative number.' },
        { status: 400 }
      );
    }

    // Verify student exists
    const studentCheck = await query('SELECT id FROM students WHERE id = $1', [student_id]);
    if (studentCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Target student not found.' }, { status: 404 });
    }

    // Verify fee exists if linked
    if (fee_id) {
      const feeCheck = await query('SELECT id FROM student_fees WHERE id = $1 AND student_id = $2', [fee_id, student_id]);
      if (feeCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Linked student fee invoice not found.' }, { status: 404 });
      }
    }

    const result = await query(
      `INSERT INTO student_fines (student_id, fee_id, title, amount, status)
       VALUES ($1, $2, $3, $4, 'Unpaid')
       RETURNING *`,
      [student_id, fee_id ? parseInt(fee_id, 10) : null, title.trim(), numAmount]
    );

    return NextResponse.json(
      { message: 'Fine logged successfully for student.', fine: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error logging student fine:', error);
    return NextResponse.json(
      { error: 'Failed to log fine. Internal server error.' },
      { status: 500 }
    );
  }
}

// PUT: Update student fine payment status (Admin only)
export async function PUT(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { fine_id, status } = await request.json();

    if (!fine_id || !status) {
      return NextResponse.json(
        { error: 'Fine ID and payment status are required.' },
        { status: 400 }
      );
    }

    if (status !== 'Paid' && status !== 'Unpaid') {
      return NextResponse.json(
        { error: "Status must be either 'Paid' or 'Unpaid'." },
        { status: 400 }
      );
    }

    const checkExist = await query('SELECT id FROM student_fines WHERE id = $1', [fine_id]);
    if (checkExist.rows.length === 0) {
      return NextResponse.json({ error: 'Fine record not found.' }, { status: 404 });
    }

    const result = await query(
      `UPDATE student_fines
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, fine_id]
    );

    return NextResponse.json({
      message: `Fine marked as ${status} successfully.`,
      fine: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating fine status:', error);
    return NextResponse.json(
      { error: 'Failed to update fine status. Internal server error.' },
      { status: 500 }
    );
  }
}
