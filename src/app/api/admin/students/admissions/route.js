import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET Admissions (Admin only)
export async function GET() {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const result = await query(`
      SELECT sa.*, c.name AS class_name 
      FROM student_admissions sa
      JOIN classes c ON sa.applied_class_id = c.id
      ORDER BY sa.applied_date DESC
    `);

    return NextResponse.json({
      success: true,
      paylod: { admissions: result.rows }
    });
  } catch (error) {
    console.error('Error fetching admissions applications:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST Admission Application (Public)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      applicant_name,
      email,
      phone,
      date_of_birth,
      gender,
      address,
      applied_class_id,
      previous_school,
      guardian_name,
      guardian_phone
    } = body;

    if (!applicant_name || !email || !phone || !date_of_birth || !gender || !address || !applied_class_id || !guardian_name || !guardian_phone) {
      return NextResponse.json({ success: false, error: 'All fields marked as required must be filled.' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO student_admissions (
        applicant_name, email, phone, date_of_birth, gender, address, 
        applied_class_id, previous_school, guardian_name, guardian_phone, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Pending')
      RETURNING *
    `, [
      applicant_name.trim(), email.trim(), phone.trim(), date_of_birth, gender, address.trim(),
      parseInt(applied_class_id, 10), previous_school?.trim() || null,
      guardian_name.trim(), guardian_phone.trim()
    ]);

    return NextResponse.json({
      success: true,
      message: 'Admission application submitted successfully.',
      paylod: { admission: result.rows[0] }
    });
  } catch (error) {
    console.error('Error submitting admission application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT Approve/Reject Admission (Admin only)
export async function PUT(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body; // status = 'Approved' or 'Rejected'

    if (!id || !status || !['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'ID and valid status (Approved/Rejected) are required.' }, { status: 400 });
    }

    // Get the admission record
    const admissionRes = await query('SELECT * FROM student_admissions WHERE id = $1', [id]);
    if (admissionRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Admission application not found.' }, { status: 404 });
    }

    const admission = admissionRes.rows[0];

    if (admission.status !== 'Pending') {
      return NextResponse.json({ success: false, error: 'This application has already been processed.' }, { status: 400 });
    }

    let studentRecord = null;

    if (status === 'Approved') {
      // 1. Generate unique registration number
      const academicYear = new Date().getFullYear();
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const regNo = `REG-${academicYear}-${randomDigits}`;

      // 2. Insert into students table
      const studentRes = await query(`
        INSERT INTO students (
          name, email, phone, registration_number, class_id, date_of_birth, address,
          gender, is_active, is_registered
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, FALSE)
        RETURNING *
      `, [
        admission.applicant_name,
        admission.email,
        admission.phone,
        regNo,
        admission.applied_class_id,
        admission.date_of_birth,
        admission.address,
        admission.gender
      ]);

      studentRecord = studentRes.rows[0];

      // 3. Create guardian record in student_guardians table
      await query(`
        INSERT INTO student_guardians (
          student_id, name, relationship, phone
        ) VALUES ($1, $2, 'Guardian', $3)
      `, [studentRecord.id, admission.guardian_name, admission.guardian_phone]);

      // 4. Update student_id in admissions table
      await query(`
        UPDATE student_admissions SET
          status = 'Approved',
          student_id = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [studentRecord.id, id]);
    } else {
      // Reject
      await query(`
        UPDATE student_admissions SET
          status = 'Rejected',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
    }

    return NextResponse.json({
      success: true,
      message: `Admission application has been ${status.toLowerCase()} successfully.`,
      paylod: { student: studentRecord }
    });
  } catch (error) {
    console.error('Error processing admission application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
