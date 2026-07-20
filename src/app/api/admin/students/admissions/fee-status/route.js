import { NextResponse } from 'next/server';
import pool, { query } from '@/lib/db';
import { isAdmin, isRegister, isCashier } from '@/lib/auth';

export async function PUT(request) {
  let client;
  try {
    const authorized = (await isAdmin()) || (await isRegister()) || (await isCashier());
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      student_admission_id, 
      status, 
      amount_paid, 
      payment_method, 
      transaction_id, 
      remarks 
    } = body; // status = 'Paid', 'Pending', 'Cancelled'

    if (!student_admission_id || !status || !['Pending', 'Paid', 'Cancelled'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student Admission ID and valid fee status (Pending/Paid/Cancelled) are required.' 
      }, { status: 400 });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    // Update the admission fee status
    let feeResult = await client.query(`
      UPDATE admission_fees
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE student_admission_id = $2
      RETURNING *
    `, [status, parseInt(student_admission_id, 10)]);

    let feeRecord;

    if (feeResult.rows.length === 0) {
      // If it doesn't exist for some reason, fetch from admissions circular and insert
      const admRes = await client.query(`
        SELECT sa.admission_id, sa.applicant_name, sa.email, sa.phone, adm.fees 
        FROM student_admissions sa
        LEFT JOIN admissions adm ON sa.admission_id = adm.id
        WHERE sa.id = $1
      `, [parseInt(student_admission_id, 10)]);

      if (admRes.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json({ success: false, error: 'Admission application not found.' }, { status: 404 });
      }

      const fees = admRes.rows[0].fees || 0.00;
      const insertResult = await client.query(`
        INSERT INTO admission_fees (student_admission_id, amount, status)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [parseInt(student_admission_id, 10), fees, status]);
      
      feeRecord = insertResult.rows[0];
    } else {
      feeRecord = feeResult.rows[0];
    }

    // If status is Paid, record the payment details and unified ledger transaction
    if (status === 'Paid') {
      const actualAmountPaid = amount_paid !== undefined ? parseFloat(amount_paid) : parseFloat(feeRecord.amount);
      const method = payment_method || 'Cash';
      const txnId = transaction_id || null;
      const rmk = remarks || `Collected admission fee for candidate #${student_admission_id}`;

      // Insert into admission_fee_payments
      const paymentRes = await client.query(`
        INSERT INTO admission_fee_payments (admission_fee_id, amount_paid, payment_method, transaction_id, remarks)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [feeRecord.id, actualAmountPaid, method, txnId, rmk]);

      // Insert into unified transactions ledger (Credit transaction)
      const transactionNo = `TXN-ADM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      await client.query(`
        INSERT INTO payment_transactions (
          transaction_number, payment_method, amount, transaction_type, category, 
          reference_id, status, remarks, payment_date
        ) VALUES ($1, $2, $3, 'Credit', 'Admission Fee', $4, 'Success', $5, CURRENT_TIMESTAMP)
      `, [
        transactionNo,
        method,
        actualAmountPaid,
        paymentRes.rows[0].id,
        rmk
      ]);
    }

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: `Admission fee status updated to ${status} successfully.`,
      paylod: { fee: feeRecord }
    });
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('Error during rollback:', rollbackErr);
      }
      client.release();
    }
    console.error('Error updating admission fee status:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
