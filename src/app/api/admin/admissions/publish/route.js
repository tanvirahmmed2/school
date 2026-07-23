import { NextResponse } from 'next/server';
import pool, { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { sendEmail } from '@/lib/brevo';

// POST publish admission results (Admin only)
export async function POST(request) {
  let client;
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { admission_id } = await request.json();

    if (!admission_id) {
      return NextResponse.json({ success: false, error: 'Admission circular ID is required.' }, { status: 400 });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    // 1. Fetch circular details
    const circularRes = await client.query('SELECT * FROM admissions WHERE id = $1', [admission_id]);
    if (circularRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Admission circular not found.' }, { status: 404 });
    }

    const circular = circularRes.rows[0];

    if (circular.is_result_published) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Results have already been published for this circular.' }, { status: 400 });
    }

    // 2. Fetch all approved applications for this circular
    const approvedCandidatesRes = await client.query(`
      SELECT 
        sa.id as student_admission_id,
        sa.admission_id,
        sa.applied_class_id as class_id,
        sa.applicant_name,
        sa.email,
        sa.phone,
        sa.date_of_birth,
        sa.gender,
        sa.address,
        sa.birth_regi_number,
        sa.guardian_name,
        sa.guardian_phone,
        sa.image,
        sa.image_id,
        sa.signature,
        sa.signature_id,
        c.name AS class_name,
        c.numeric_name AS class_numeric_name
      FROM student_admissions sa
      JOIN classes c ON sa.applied_class_id = c.id
      WHERE sa.admission_id = $1 AND sa.status = 'Approved'
      ORDER BY sa.applicant_name ASC, sa.id ASC
    `, [admission_id]);

    const candidates = approvedCandidatesRes.rows;

    const academicYear = new Date().getFullYear();
    let registeredCount = 0;

    // Get current max roll in this class
    const maxRollRes = await client.query(
      'SELECT MAX(roll) as max_roll FROM students WHERE class_id = $1',
      [circular.class_id]
    );
    let nextRoll = parseInt(maxRollRes.rows[0]?.max_roll || 0, 10) + 1;

    // 3. Register each approved candidate as an official student
    for (const cand of candidates) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const parentsInfo = `Parent Name: ${cand.guardian_name}, Contact: ${cand.guardian_phone}`;

      const classNumeric = cand.class_numeric_name || 0;
      const regPrefix = `${academicYear}-${classNumeric}`;

      // Calculate sequential registration number
      const maxRegRes = await client.query(
        `SELECT registration_number 
         FROM students 
         WHERE registration_number LIKE $1 
         ORDER BY registration_number DESC 
         LIMIT 1`,
        [`${regPrefix}%`]
      );

      let nextNum = 1;
      if (maxRegRes.rows.length > 0) {
        const lastReg = maxRegRes.rows[0].registration_number;
        const regParts = lastReg.split('-');
        if (regParts.length >= 2) {
          const suffixStr = regParts[1].substring(String(classNumeric).length);
          const parsed = parseInt(suffixStr, 10);
          if (!isNaN(parsed)) {
            nextNum = parsed + 1;
          }
        }
      }

      let isUnique = false;
      let regNo = '';
      while (!isUnique) {
        const suffix = String(nextNum).padStart(3, '0');
        regNo = `${regPrefix}${suffix}`;
        const check = await client.query('SELECT id FROM students WHERE LOWER(registration_number) = LOWER($1)', [regNo]);
        if (check.rows.length === 0) {
          isUnique = true;
        } else {
          nextNum++;
        }
      }

      // Check if student with email already exists
      const existingStudentRes = await client.query('SELECT id FROM students WHERE LOWER(email) = LOWER($1)', [cand.email.trim()]);
      
      let studentId = null;
      if (existingStudentRes.rows.length > 0) {
        studentId = existingStudentRes.rows[0].id;
        await client.query(`
          UPDATE students SET
            name = $1,
            phone = $2,
            class_id = $3,
            date_of_birth = $4,
            address = $5,
            gender = $6,
            birth_certificate_number = $7,
            parents_info = $8,
            verification_code = $9,
            verification_code_expires = $10,
            image = $11,
            image_id = $12,
            signature = $13,
            signature_id = $14,
            roll = $15,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $16
        `, [
          cand.applicant_name,
          cand.phone,
          cand.class_id,
          cand.date_of_birth,
          cand.address,
          cand.gender,
          cand.birth_regi_number,
          parentsInfo,
          verificationCode,
          codeExpires,
          cand.image,
          cand.image_id,
          cand.signature,
          cand.signature_id,
          nextRoll,
          studentId
        ]);
      } else {
        const studentRes = await client.query(`
          INSERT INTO students (
            name, email, phone, registration_number, class_id, date_of_birth, address,
            gender, birth_certificate_number, parents_info, is_active, is_registered,
            verification_code, verification_code_expires, image, image_id, signature, signature_id,
            roll
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, FALSE, FALSE, $11, $12, $13, $14, $15, $16, $17)
          RETURNING id
        `, [
          cand.applicant_name,
          cand.email,
          cand.phone,
          regNo,
          cand.class_id,
          cand.date_of_birth,
          cand.address,
          cand.gender,
          cand.birth_regi_number,
          parentsInfo,
          verificationCode,
          codeExpires,
          cand.image,
          cand.image_id,
          cand.signature,
          cand.signature_id,
          nextRoll
        ]);

        studentId = studentRes.rows[0].id;
      }

      // Create guardian record
      await client.query(`
        INSERT INTO student_guardians (
          student_id, name, relationship, phone
        ) VALUES ($1, $2, 'Guardian', $3)
      `, [studentId, cand.guardian_name, cand.guardian_phone]);

      // Create student enrollment record
      try {
        await client.query(`
          INSERT INTO student_enrollments (
            student_id, class_id, session_year, roll_number
          ) VALUES ($1, $2, $3, $4)
          ON CONFLICT (student_id, session_year) DO NOTHING
        `, [studentId, cand.class_id, String(academicYear), nextRoll]);
      } catch (enrollErr) {
        console.error('Failed to create student enrollment:', enrollErr);
      }

      // Send student registration & verification email
      try {
        const setupLink = `${request.headers.get('origin') || 'http://localhost:3000'}/auth/student/registration`;
        await sendEmail({
          to: cand.email,
          toName: cand.applicant_name,
          subject: `Admission Approved & Student Setup Code - ${circular.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 16px;">
              <h2 style="color: #0284c7;">Congratulations ${cand.applicant_name}!</h2>
              <p>You have been officially admitted to Class <strong>${cand.class_name}</strong> under circular "<strong>${circular.title}</strong>".</p>
              <p>Your official student credentials have been created. Please configure your student portal password using the credentials below:</p>
              
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 6px 0;"><strong>Registration Number:</strong> <code style="color: #0284c7; font-size: 16px; font-weight: bold;">${regNo}</code></p>
                <p style="margin: 6px 0;"><strong>Verification Code:</strong> <code style="color: #0284c7; font-size: 16px; font-weight: bold;">${verificationCode}</code></p>
              </div>

              <p style="text-align: center; margin: 24px 0;">
                <a href="${setupLink}" style="background-color: #0284c7; color: white; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">
                  Complete Student Registration
                </a>
              </p>
              
              <p style="font-size: 12px; color: #64748b;">Note: Verification code expires in 24 hours.</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error(`Failed to send setup email to ${cand.email}:`, mailErr);
      }

      registeredCount++;
      nextRoll++;
    }

    // 4. Update circular status to published
    await client.query('UPDATE admissions SET is_result_published = TRUE WHERE id = $1', [admission_id]);

    // 5. Create Notice board post
    await client.query(`
      INSERT INTO notices (title, link, is_pinned)
      VALUES ($1, '/auth/student/registration', FALSE)
    `, [`Admission Results Published: ${circular.title}`]);

    // 6. DELETE ALL applicant data for this circular from student_admissions table (cleans up both approved and rejected records)
    await client.query('DELETE FROM student_admissions WHERE admission_id = $1', [admission_id]);

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: `Admission results published successfully. Registered ${registeredCount} students and cleared temporary applicant records.`
    });
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rbErr) {
        console.error('Rollback error:', rbErr);
      }
      client.release();
    }
    console.error('Error publishing admission results:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
