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
      SELECT sa.*, c.name AS class_name, adm.title AS admission_title 
      FROM student_admissions sa
      JOIN classes c ON sa.applied_class_id = c.id
      LEFT JOIN admissions adm ON sa.admission_id = adm.id
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

// POST Admission Application (Public / Temporary Save Candidate Info)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      admission_id,
      applicant_name,
      email,
      phone,
      date_of_birth,
      gender,
      address,
      applied_class_id,
      previous_school,
      guardian_name,
      guardian_phone,
      birth_regi_number
    } = body;

    if (!admission_id || !applicant_name || !email || !phone || !date_of_birth || !gender || !address || !applied_class_id || !guardian_name || !guardian_phone) {
      return NextResponse.json({ success: false, error: 'All fields marked as required must be filled.' }, { status: 400 });
    }

    // Fetch the admission circular configuration
    const circularRes = await query('SELECT * FROM admissions WHERE id = $1', [admission_id]);
    if (circularRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Selected admission circular not found.' }, { status: 404 });
    }

    const circular = circularRes.rows[0];

    // Validate class matches circular target
    if (parseInt(applied_class_id, 10) !== parseInt(circular.class_id, 10)) {
      return NextResponse.json({ success: false, error: 'Applied class does not match target circular class.' }, { status: 400 });
    }

    // Validate candidate age constraints
    const dob = new Date(date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (circular.min_age !== null && age < circular.min_age) {
      return NextResponse.json({ success: false, error: `Candidate is too young. Minimum age is ${circular.min_age} years.` }, { status: 400 });
    }

    if (circular.max_age !== null && age > circular.max_age) {
      return NextResponse.json({ success: false, error: `Candidate is too old. Maximum age is ${circular.max_age} years.` }, { status: 400 });
    }

    // Validate circular deadlines
    const currentDate = new Date();
    if (currentDate > new Date(circular.finish_date)) {
      return NextResponse.json({ success: false, error: 'Admission circular deadline has closed.' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO student_admissions (
        admission_id, applicant_name, email, phone, date_of_birth, gender, address, 
        applied_class_id, previous_school, guardian_name, guardian_phone, birth_regi_number, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Pending')
      RETURNING *
    `, [
      parseInt(admission_id, 10),
      applicant_name.trim(),
      email.trim(),
      phone.trim(),
      date_of_birth,
      gender,
      address.trim(),
      parseInt(applied_class_id, 10),
      previous_school?.trim() || null,
      guardian_name.trim(),
      guardian_phone.trim(),
      birth_regi_number ? birth_regi_number.trim() : null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Admission candidate application submitted successfully.',
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

    // Get the temporary application record
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

      // 2. Insert into students table (Create permanent student profile)
      const studentRes = await query(`
        INSERT INTO students (
          name, email, phone, registration_number, class_id, date_of_birth, address,
          gender, birth_certificate_number, is_active, is_registered
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, FALSE)
        RETURNING *
      `, [
        admission.applicant_name,
        admission.email,
        admission.phone,
        regNo,
        admission.applied_class_id,
        admission.date_of_birth,
        admission.address,
        admission.gender,
        admission.birth_regi_number // Map candidate birth registration to student profile
      ]);

      studentRecord = studentRes.rows[0];

      // 3. Create guardian record in student_guardians table
      await query(`
        INSERT INTO student_guardians (
          student_id, name, relationship, phone
        ) VALUES ($1, $2, 'Guardian', $3)
      `, [studentRecord.id, admission.guardian_name, admission.guardian_phone]);

      // 4. Update student_id in temporary applications table
      await query(`
        UPDATE student_admissions SET
          status = 'Approved',
          student_id = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [studentRecord.id, id]);
    } else {
      // Reject application
      await query(`
        UPDATE student_admissions SET
          status = 'Rejected',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
    }

    return NextResponse.json({
      success: true,
      message: `Admission candidate application has been ${status.toLowerCase()} and student record created.`,
      paylod: { student: studentRecord }
    });
  } catch (error) {
    console.error('Error processing admission application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
