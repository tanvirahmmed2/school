import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { sendEmail } from '@/lib/brevo';

// POST publish admission results (Admin only)
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { admission_id } = await request.json();

    if (!admission_id) {
      return NextResponse.json({ success: false, error: 'Admission ID is required.' }, { status: 400 });
    }

    // 1. Fetch circular details
    const circularRes = await query('SELECT * FROM admissions WHERE id = $1', [admission_id]);
    if (circularRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Admission circular not found.' }, { status: 404 });
    }

    const circular = circularRes.rows[0];

    if (circular.is_result_published) {
      return NextResponse.json({ success: false, error: 'Results have already been published for this circular.' }, { status: 400 });
    }

    // 2. Fetch all accepted applications for this circular
    const acceptedCandidatesRes = await query(`
      SELECT 
        aa.id as accepted_id,
        aa.student_admission_id,
        aa.admission_id,
        aa.class_id,
        aa.applicant_name,
        aa.email,
        aa.phone,
        sa.date_of_birth,
        sa.gender,
        sa.address,
        sa.birth_regi_number,
        sa.guardian_name,
        sa.guardian_phone,
        c.name AS class_name,
        c.numeric_name AS class_numeric_name
      FROM accepted_admissions aa
      JOIN student_admissions sa ON aa.student_admission_id = sa.id
      JOIN classes c ON aa.class_id = c.id
      WHERE aa.admission_id = $1
    `, [admission_id]);

    const candidates = acceptedCandidatesRes.rows;

    if (candidates.length === 0) {
      return NextResponse.json({ success: false, error: 'No approved applicants found for this circular to publish results.' }, { status: 400 });
    }

    // 3. Pre-validate that there are no duplicate registered emails or duplicate birth certificate numbers
    for (const cand of candidates) {
      const emailCheck = await query('SELECT id, registration_number, is_registered FROM students WHERE LOWER(email) = LOWER($1)', [cand.email.trim()]);
      if (emailCheck.rows.length > 0) {
        const existing = emailCheck.rows[0];
        if (existing.is_registered) {
          return NextResponse.json({
            success: false,
            error: `Email ${cand.email} is already registered to an active student account (Reg No: ${existing.registration_number}). Please resolve this before publishing results.`
          }, { status: 400 });
        }
      }

      if (cand.birth_regi_number) {
        const certCheck = await query('SELECT id, registration_number, email FROM students WHERE LOWER(birth_certificate_number) = LOWER($1)', [cand.birth_regi_number.trim()]);
        if (certCheck.rows.length > 0) {
          const existing = certCheck.rows[0];
          if (existing.email.toLowerCase() !== cand.email.toLowerCase()) {
            return NextResponse.json({
              success: false,
              error: `Birth certificate number ${cand.birth_regi_number} is already associated with student ${existing.email} (Reg No: ${existing.registration_number}).`
            }, { status: 400 });
          }
        }
      }
    }

    const academicYear = new Date().getFullYear();
    let registeredCount = 0;

    // 4. Process each accepted candidate
    for (const cand of candidates) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const parentsInfo = `Parent Name: ${cand.guardian_name}, Contact: ${cand.guardian_phone}`;

      const classNumeric = cand.class_numeric_name || 0;
      const regPrefix = `${academicYear}-${classNumeric}`;
      
      // Find the maximum existing registration number with this prefix to continue the counter
      const maxRegRes = await query(
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

      const emailCheck = await query('SELECT id, registration_number FROM students WHERE LOWER(email) = LOWER($1)', [cand.email.trim()]);
      
      let studentId = null;
      let regNo = '';

      if (emailCheck.rows.length > 0) {
        // Reuse and update existing unregistered student profile
        const existing = emailCheck.rows[0];
        studentId = existing.id;
        
        // If they already have a registration number in the correct class-prefixed format, keep it
        if (existing.registration_number.startsWith(regPrefix)) {
          regNo = existing.registration_number;
        } else {
          let isUnique = false;
          while (!isUnique) {
            const suffix = String(nextNum).padStart(3, '0');
            regNo = `${regPrefix}${suffix}`;
            const check = await query('SELECT id FROM students WHERE LOWER(registration_number) = LOWER($1) AND id <> $2', [regNo, studentId]);
            if (check.rows.length === 0) {
              isUnique = true;
            } else {
              nextNum++;
            }
          }
        }

        await query(`
          UPDATE students SET
            name = $1,
            phone = $2,
            class_id = $3,
            date_of_birth = $4,
            address = $5,
            gender = $6,
            birth_certificate_number = $7,
            parents_info = $8,
            registration_number = $9,
            is_active = FALSE,
            is_registered = FALSE,
            verification_code = $10,
            verification_code_expires = $11,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $12
        `, [
          cand.applicant_name,
          cand.phone,
          cand.class_id,
          cand.date_of_birth,
          cand.address,
          cand.gender,
          cand.birth_regi_number,
          parentsInfo,
          regNo,
          verificationCode,
          codeExpires,
          studentId
        ]);

        // Clean up any existing duplicate guardians before re-inserting
        await query('DELETE FROM student_guardians WHERE student_id = $1', [studentId]);
      } else {
        let isUnique = false;
        while (!isUnique) {
          const suffix = String(nextNum).padStart(3, '0');
          regNo = `${regPrefix}${suffix}`;
          const check = await query('SELECT id FROM students WHERE LOWER(registration_number) = LOWER($1)', [regNo]);
          if (check.rows.length === 0) {
            isUnique = true;
          } else {
            nextNum++;
          }
        }

        // Insert new student record
        const studentRes = await query(`
          INSERT INTO students (
            name, email, phone, registration_number, class_id, date_of_birth, address,
            gender, birth_certificate_number, parents_info, is_active, is_registered,
            verification_code, verification_code_expires
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, FALSE, FALSE, $11, $12)
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
          codeExpires
        ]);

        studentId = studentRes.rows[0].id;
      }

      // Create guardian record
      await query(`
        INSERT INTO student_guardians (
          student_id, name, relationship, phone
        ) VALUES ($1, $2, 'Guardian', $3)
      `, [studentId, cand.guardian_name, cand.guardian_phone]);

      // Link student_id back in candidate application
      await query(`
        UPDATE student_admissions 
        SET student_id = $1 
        WHERE id = $2
      `, [studentId, cand.student_admission_id]);

      // Send verification email
      try {
        const setupLink = `${request.headers.get('origin') || 'http://localhost:3000'}/auth/student/registration`;
        await sendEmail({
          to: cand.email,
          toName: cand.applicant_name,
          subject: `Admission Selected & Student Setup Code - ${circular.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f1f5f9; rounded: 12px;">
              <h2 style="color: #4f46e5;">Congratulations ${cand.applicant_name}!</h2>
              <p>We are delighted to inform you that you have been selected for admission to Class <strong>${cand.class_name}</strong> under the circular "<strong>${circular.title}</strong>".</p>
              <p>Your permanent student registration credentials have been prepared. Please complete your online registration portal setup using the credentials below:</p>
              
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Registration Number:</strong> <code style="color: #4f46e5; font-size: 16px;">${regNo}</code></p>
                <p style="margin: 5px 0;"><strong>Verification Code:</strong> <code style="color: #4f46e5; font-size: 16px;">${verificationCode}</code></p>
              </div>

              <p>Please navigate to the student portal setup page to verify your credentials and configure your password:</p>
              <p style="margin: 25px 0; text-align: center;">
                <a href="${setupLink}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Set Up Your Account</a>
              </p>
              
              <p style="font-size: 11px; color: #64748b;">Note: The verification code is temporary and will expire in 24 hours. Please do not share this email with others.</p>
              <p style="margin-top: 30px; border-t: 1px solid #e2e8f0; pt: 15px; font-size: 12px; color: #475569;">Best regards,<br/>Academic Administration Board</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error(`Failed to send setup email to ${cand.email}:`, mailErr);
      }

      registeredCount++;
    }

    // 4. Update circular to published
    await query('UPDATE admissions SET is_result_published = TRUE WHERE id = $1', [admission_id]);

    // 5. Create Notice announcement on notice board
    await query(`
      INSERT INTO notices (title, link, is_pinned)
      VALUES ($1, '/auth/student/registration', FALSE)
    `, [
      `Admission Results Published: ${circular.title}`
    ]);

    return NextResponse.json({
      success: true,
      message: `Admission results published successfully. Registered ${registeredCount} students and sent verification codes.`
    });
  } catch (error) {
    console.error('Error publishing admission results:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
