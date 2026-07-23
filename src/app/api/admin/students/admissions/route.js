import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, isRegister, isCashier } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { sendEmail } from '@/lib/brevo';

// GET Admissions (Admin/Registrar/Cashier only)
export async function GET(request) {
  try {
    const authorized = (await isAdmin()) || (await isRegister()) || (await isCashier());
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await query(`
        SELECT sa.*, c.name AS class_name, 
               adm.title AS admission_title,
               adm.fees AS admission_fees_amount,
               af.amount AS fee_amount,
               af.status AS fee_status
        FROM student_admissions sa
        JOIN classes c ON sa.applied_class_id = c.id
        LEFT JOIN admissions adm ON sa.admission_id = adm.id
        LEFT JOIN admission_fees af ON sa.id = af.student_admission_id
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
      SELECT sa.*, c.name AS class_name, 
             adm.title AS admission_title,
             adm.fees AS admission_fees_amount,
             af.amount AS fee_amount,
             af.status AS fee_status
      FROM student_admissions sa
      JOIN classes c ON sa.applied_class_id = c.id
      LEFT JOIN admissions adm ON sa.admission_id = adm.id
      LEFT JOIN admission_fees af ON sa.id = af.student_admission_id
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

// POST Admission Application (Public Candidate Submission)
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
      image,         // optional base64 string
      signature      // optional base64 string
    } = body;

    if (!admission_id || !applicant_name || !email || !phone || !date_of_birth || !gender || 
        !address || !applied_class_id || !guardian_name || !guardian_phone) {
      return NextResponse.json({ success: false, error: 'All required candidate details must be filled.' }, { status: 400 });
    }

    // 1. Fetch the admission circular configuration
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
      return NextResponse.json({ success: false, error: `Candidate is too young. Minimum age required is ${circular.min_age} years.` }, { status: 400 });
    }

    if (circular.max_age !== null && age > circular.max_age) {
      return NextResponse.json({ success: false, error: `Candidate is too old. Maximum age allowed is ${circular.max_age} years.` }, { status: 400 });
    }

    // Validate circular deadline
    const currentDate = new Date();
    if (currentDate > new Date(circular.finish_date)) {
      return NextResponse.json({ success: false, error: 'Admission circular deadline has closed.' }, { status: 400 });
    }

    // 2. Validate uniqueness of Email (in students and student_admissions)
    const studentEmailCheck = await query('SELECT id FROM students WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (studentEmailCheck.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'This email address is already registered to an active student account.' }, { status: 400 });
    }

    const applicantEmailCheck = await query(
      `SELECT id FROM student_admissions WHERE LOWER(email) = LOWER($1)`, 
      [email.trim()]
    );
    if (applicantEmailCheck.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'An admission application with this email address has already been submitted.' }, { status: 400 });
    }

    // 3. Validate uniqueness of Birth Registration Number if provided
    if (birth_regi_number && birth_regi_number.trim()) {
      const cleanBirthNo = birth_regi_number.trim();

      const studentBirthCheck = await query('SELECT id FROM students WHERE LOWER(birth_certificate_number) = LOWER($1)', [cleanBirthNo]);
      if (studentBirthCheck.rows.length > 0) {
        return NextResponse.json({ success: false, error: 'This birth registration number is already registered to a student.' }, { status: 400 });
      }

      const applicantBirthCheck = await query('SELECT id FROM student_admissions WHERE LOWER(birth_regi_number) = LOWER($1)', [cleanBirthNo]);
      if (applicantBirthCheck.rows.length > 0) {
        return NextResponse.json({ success: false, error: 'An admission application with this birth registration number already exists.' }, { status: 400 });
      }
    }

    // Optional image upload
    let imageUrl = null;
    let imagePublicId = null;
    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await uploadImage(image, 'student_admissions_images');
        imageUrl = uploadRes.url;
        imagePublicId = uploadRes.publicId;
      } catch (uploadErr) {
        console.error('Cloudinary student image upload failure:', uploadErr);
      }
    }

    // Optional signature upload
    let signatureUrl = null;
    let signaturePublicId = null;
    if (signature && signature.startsWith('data:image')) {
      try {
        const uploadRes = await uploadImage(signature, 'student_admissions_signatures');
        signatureUrl = uploadRes.url;
        signaturePublicId = uploadRes.publicId;
      } catch (uploadErr) {
        console.error('Cloudinary student signature upload failure:', uploadErr);
      }
    }

    // 4. Save to student_admissions
    const result = await query(`
      INSERT INTO student_admissions (
        admission_id, applicant_name, email, phone, date_of_birth, gender, address, 
        applied_class_id, previous_school, guardian_name, guardian_phone, birth_regi_number, 
        image, image_id, signature, signature_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'Pending')
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
      signaturePublicId
    ]);

    const applicant = result.rows[0];
    const applicantNumber = `APP-1000${applicant.id}`;
    const admissionFeeAmount = circular.fees || 0.00;

    // 5. Create unpaid admission fee record
    try {
      await query(`
        INSERT INTO admission_fees (student_admission_id, amount, status)
        VALUES ($1, $2, 'pending')
        ON CONFLICT (student_admission_id) DO UPDATE SET amount = EXCLUDED.amount
      `, [applicant.id, admissionFeeAmount]);
    } catch (feeErr) {
      console.error('Failed to create admission fee record:', feeErr);
    }

    // 6. Fetch class name for email template
    const classRes = await query('SELECT name FROM classes WHERE id = $1', [applied_class_id]);
    const className = classRes.rows[0]?.name || 'N/A';

    // 7. Send email receipt to applicant
    try {
      await sendEmail({
        to: applicant.email,
        toName: applicant.applicant_name,
        subject: `Application Submitted & Payment Receipt - ${applicantNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <div style="text-align: center; padding-bottom: 16px; border-b: 1px solid #f1f5f9;">
              <h2 style="color: #0284c7; margin: 0;">Admission Application Receipt</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Thank you for applying to our institution</p>
            </div>
            
            <div style="margin: 20px 0; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <p style="margin: 6px 0; font-size: 14px;"><strong>Applicant Number:</strong> <span style="color: #0284c7; font-family: monospace; font-weight: bold; font-size: 16px;">${applicantNumber}</span></p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Applicant Name:</strong> ${applicant.applicant_name}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Applied Circular:</strong> ${circular.title}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Applied Class:</strong> ${className}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Admission Fee Amount:</strong> <span style="color: #16a34a; font-weight: bold;">BDT ${parseFloat(admissionFeeAmount).toFixed(2)}</span></p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Payment Status:</strong> <span style="color: #dc2626; font-weight: bold; background: #fee2e2; padding: 2px 8px; border-radius: 9999px;">UNPAID</span></p>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 14px; border-radius: 12px; margin-bottom: 20px;">
              <h4 style="color: #b45309; margin: 0 0 6px 0;">Next Step: Pay Admission Fee at Cashier</h4>
              <p style="color: #78350f; font-size: 13px; margin: 0; line-height: 1.5;">
                Please visit the school cashier office and provide your <strong>Applicant Number (${applicantNumber})</strong> to complete your fee payment. Once paid, you will receive an email to upload your profile photo and signature.
              </p>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
              School Academic Administration Board
            </p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('Failed to send application email receipt:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Admission candidate application submitted successfully.',
      paylod: { 
        admission: applicant,
        applicant_number: applicantNumber,
        fee_amount: admissionFeeAmount
      }
    });
  } catch (error) {
    console.error('Error submitting admission application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT Single Applicant Status Update (Admin / Registrar only)
export async function PUT(request) {
  try {
    const authorized = (await isAdmin()) || (await isRegister());
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body; // status = 'Approved' or 'Rejected'

    if (!id || !status || !['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'ID and valid status (Approved/Rejected) are required.' }, { status: 400 });
    }

    // Get candidate record
    const admissionRes = await query('SELECT * FROM student_admissions WHERE id = $1', [id]);
    if (admissionRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Admission application not found.' }, { status: 404 });
    }

    const admission = admissionRes.rows[0];

    if (status === 'Approved') {
      const feeCheck = await query('SELECT status FROM admission_fees WHERE student_admission_id = $1', [id]);
      const feeStatus = feeCheck.rows[0]?.status;
      if (!feeStatus || (feeStatus.toLowerCase() !== 'paid')) {
        return NextResponse.json({ success: false, error: 'Only paid candidates are eligible for admission approval. Please complete fee payment first.' }, { status: 400 });
      }

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

      await query(`
        UPDATE student_admissions SET
          status = 'Approved',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
    } else {
      await query(`
        DELETE FROM accepted_admissions 
        WHERE student_admission_id = $1
      `, [id]);

      await query(`
        UPDATE student_admissions SET
          status = 'Rejected',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
    }

    return NextResponse.json({
      success: true,
      message: `Admission candidate application status updated to ${status}.`
    });
  } catch (error) {
    console.error('Error processing admission application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
