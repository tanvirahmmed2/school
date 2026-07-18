import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// GET Admissions (Admin only)
export async function GET(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await query(`
        SELECT sa.*, c.name AS class_name, adm.title AS admission_title 
        FROM student_admissions sa
        JOIN classes c ON sa.applied_class_id = c.id
        LEFT JOIN admissions adm ON sa.admission_id = adm.id
        WHERE sa.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Applicant not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        paylod: { applicant: result.rows[0] }
      });
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
      birth_regi_number,
      image,         // base64 image string
      signature      // base64 signature string
    } = body;

    if (!admission_id || !applicant_name || !email || !phone || !date_of_birth || !gender || 
        !address || !applied_class_id || !guardian_name || !guardian_phone ||
        !image || !signature) {
      return NextResponse.json({ success: false, error: 'All fields marked as required must be filled, including candidate image and signature.' }, { status: 400 });
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

    // Validate student email is unique (both in students table and student_admissions table)
    const emailCheck = await query('SELECT id FROM students WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'This email address is already registered to a student account.' }, { status: 400 });
    }

    const admissionsEmailCheck = await query(
      `SELECT id FROM student_admissions 
       WHERE LOWER(email) = LOWER($1) AND status <> 'Rejected'`, 
      [email.trim()]
    );
    if (admissionsEmailCheck.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'An admission application with this email address has already been submitted.' }, { status: 400 });
    }

    // Upload candidate profile image to Cloudinary
    let imageUrl = null;
    let imagePublicId = null;
    try {
      const uploadRes = await uploadImage(image, 'student_admissions_images');
      imageUrl = uploadRes.url;
      imagePublicId = uploadRes.publicId;
    } catch (uploadErr) {
      console.error('Cloudinary student image upload failure:', uploadErr);
      return NextResponse.json({ success: false, error: 'Failed to upload profile image to Cloudinary.' }, { status: 500 });
    }

    // Upload candidate signature to Cloudinary
    let signatureUrl = null;
    let signaturePublicId = null;
    try {
      const uploadRes = await uploadImage(signature, 'student_admissions_signatures');
      signatureUrl = uploadRes.url;
      signaturePublicId = uploadRes.publicId;
    } catch (uploadErr) {
      console.error('Cloudinary student signature upload failure:', uploadErr);
      return NextResponse.json({ success: false, error: 'Failed to upload signature image to Cloudinary.' }, { status: 500 });
    }

    const result = await query(`
      INSERT INTO student_admissions (
        admission_id, applicant_name, email, phone, date_of_birth, gender, address, 
        applied_class_id, previous_school, guardian_name, guardian_phone, birth_regi_number, 
        image, image_id, signature, signature_id, signatre_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'Pending')
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
      birth_regi_number ? birth_regi_number.trim() : null,
      imageUrl,
      imagePublicId,
      signatureUrl,
      signaturePublicId,
      signaturePublicId
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

    if (status === 'Approved') {
      // 1. Save accepted application in accepted_admissions table
      await query(`
        INSERT INTO accepted_admissions (
          student_admission_id, admission_id, class_id, applicant_name, email, phone
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (student_admission_id) DO NOTHING
      `, [
        id,
        admission.admission_id,
        admission.applied_class_id,
        admission.applicant_name,
        admission.email,
        admission.phone
      ]);

      // 2. Update status in student_admissions table
      await query(`
        UPDATE student_admissions SET
          status = 'Approved',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
    } else {
      // Reject application
      // Clean up Cloudinary assets if any exist
      if (admission.image_id) {
        try {
          await deleteImage(admission.image_id);
        } catch (err) {
          console.error('Failed to delete applicant image from Cloudinary:', err);
        }
      }
      if (admission.signature_id) {
        try {
          await deleteImage(admission.signature_id);
        } catch (err) {
          console.error('Failed to delete applicant signature from Cloudinary:', err);
        }
      } else if (admission.signatre_id) {
        try {
          await deleteImage(admission.signatre_id);
        } catch (err) {
          console.error('Failed to delete applicant signatre from Cloudinary:', err);
        }
      }

      // 1. Remove from accepted_admissions if present
      await query(`
        DELETE FROM accepted_admissions 
        WHERE student_admission_id = $1
      `, [id]);

      // 2. Update status to Rejected and clear image/signature fields
      await query(`
        UPDATE student_admissions SET
          status = 'Rejected',
          image = NULL,
          image_id = NULL,
          signature = NULL,
          signature_id = NULL,
          signatre_id = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
    }

    return NextResponse.json({
      success: true,
      message: `Admission candidate application has been ${status.toLowerCase()} successfully.`
    });
  } catch (error) {
    console.error('Error processing admission application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
