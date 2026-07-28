import { SCHOOL_NAME } from '@/lib/secret';

function numberToWords(num) {
  const amount = Math.floor(Number(num) || 0);
  if (amount === 0) return 'Zero Taka Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanThousand = (n) => {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '') + ' ';
    return ones[Math.floor(n / 100)] + ' Hundred ' + convertLessThanThousand(n % 100);
  };

  let result = '';
  let n = amount;

  if (Math.floor(n / 100000)) {
    result += convertLessThanThousand(Math.floor(n / 100000)) + 'Lakh ';
    n %= 100000;
  }
  if (Math.floor(n / 1000)) {
    result += convertLessThanThousand(Math.floor(n / 1000)) + 'Thousand ';
    n %= 1000;
  }
  if (n > 0) {
    result += convertLessThanThousand(n);
  }

  return result.trim() + ' Taka Only';
}

export function generateStudentFeeReceiptHTML(fee, studentInfo = {}) {
  const schoolName = SCHOOL_NAME || 'Star Cadet Academia';
  const schoolAddress = studentInfo.school_address || 'Mymensingh, Bangladesh';
  
  let schoolContact = '';
  if (studentInfo.school_phone && studentInfo.school_email) {
    schoolContact = `${studentInfo.school_phone} | ${studentInfo.school_email}`;
  } else if (studentInfo.school_phone) {
    schoolContact = studentInfo.school_phone;
  } else if (studentInfo.school_email) {
    schoolContact = studentInfo.school_email;
  } else {
    schoolContact = '+880 1700-000000';
  }

  const receiptNo = `REC-FEE-2026${String(fee.id).padStart(4, '0')}`;
  const studentName = studentInfo?.student_name || studentInfo?.name || fee?.student_name || fee?.name || 'N/A';
  const regNo = studentInfo?.registration_number || studentInfo?.reg_no || fee?.registration_number || fee?.reg_no || 'N/A';
  
  const rawClass = studentInfo?.class_name || studentInfo?.class || fee?.class_name || fee?.class || 'N/A';
  const className = rawClass.toLowerCase().startsWith('class') ? rawClass : `Class ${rawClass}`;
  
  const rawPayStatus = (fee.status || 'unpaid').toUpperCase();
  const isPaid = rawPayStatus === 'PAID';
  const isPartiallyPaid = rawPayStatus === 'PARTIALLY PAID';

  const paymentDateStr = fee.payment_date
    ? new Date(fee.payment_date).toLocaleDateString('en-GB')
    : fee.due_date
    ? new Date(fee.due_date).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');

  const downloadedDate = new Date().toLocaleString('en-GB');

  const totalAmount = Number(fee.amount || 0);
  const paidAmount = Number(fee.paid_amount || (isPaid ? totalAmount : 0));
  const dueAmount = Math.max(totalAmount - paidAmount, 0);

  const amountInWords = numberToWords(isPaid ? totalAmount : paidAmount > 0 ? paidAmount : totalAmount);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fee Payment Receipt - ${receiptNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f3f4f6;
            color: #1e293b;
            padding: 30px 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }

          @media print {
            body { background-color: #ffffff; padding: 0; margin: 0; }
            .receipt-container { border: 4px double #334155 !important; box-shadow: none !important; margin: 0 auto; }
            .print-btn { display: none !important; }
          }

          .receipt-wrapper { width: 100%; max-width: 750px; }

          .receipt-container {
            background-color: #ffffff;
            border: 4px double #334155;
            border-radius: 16px;
            padding: 36px 44px;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }

          /* Diagonal Watermark */
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 8rem;
            font-weight: 900;
            color: ${isPaid ? 'rgba(16, 185, 129, 0.12)' : isPartiallyPaid ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.08)'};
            pointer-events: none;
            user-select: none;
            letter-spacing: 12px;
            z-index: 1;
            text-transform: uppercase;
          }

          .receipt-content { position: relative; z-index: 2; }

          /* Header */
          .school-header { text-align: center; margin-bottom: 24px; }
          .school-title { font-size: 1.65rem; font-weight: 800; color: #0f172a; tracking-tight; text-transform: uppercase; margin-bottom: 4px; }
          .school-subtitle { font-size: 0.85rem; color: #64748b; font-weight: 500; }
          .school-contact { font-size: 0.8rem; color: #64748b; font-weight: 500; margin-top: 2px; }

          .divider-double {
            height: 4px;
            border-top: 1px solid #cbd5e1;
            border-bottom: 1px solid #cbd5e1;
            margin: 18px 0 24px 0;
          }

          /* Receipt Info Bar */
          .info-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 18px;
            margin-bottom: 24px;
          }
          .info-bar-title { font-size: 1rem; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-bar-meta { font-size: 0.8rem; color: #475569; text-align: right; }
          .info-bar-meta span { font-weight: 700; color: #0f172a; }

          /* Student Info Grid */
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px 24px;
            margin-bottom: 28px;
            font-size: 0.875rem;
          }
          .details-field { display: flex; flex-direction: column; }
          .label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
          .value { font-weight: 600; color: #1e293b; }

          /* Fees Table */
          .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 0.875rem; }
          .fee-table th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.725rem;
            letter-spacing: 0.5px;
            padding: 10px 14px;
            border-top: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
          }
          .fee-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
          .fee-table .total-row td {
            font-weight: 700;
            background-color: #f8fafc;
            border-top: 2px solid #cbd5e1;
            border-bottom: 2px solid #cbd5e1;
            font-size: 0.925rem;
          }

          /* Amount Words Box */
          .amount-words {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 0.825rem;
            color: #334155;
            font-weight: 600;
            margin-bottom: 32px;
          }
          .amount-words span { color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; display: block; margin-bottom: 2px; }

          /* Status Pill */
          .status-pill {
            display: inline-block;
            padding: 3px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
          }
          .status-paid { background-color: #d1fae5; color: #047857; }
          .status-unpaid { background-color: #ffe4e6; color: #be123c; }
          .status-partial { background-color: #fef3c7; color: #b45309; }

          /* Footer */
          .footer {
            margin-top: 36px;
            padding-top: 18px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 0.75rem;
            color: #64748b;
          }
          .footer p { margin-bottom: 4px; font-weight: 500; }
          .download-meta { font-size: 0.675rem; color: #94a3b8; margin-top: 6px; }

          /* Action Bar */
          .action-bar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
          }
          .print-btn {
            background-color: #0f172a;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.2s;
          }
          .print-btn:hover { background-color: #1e293b; }
        </style>
      </head>
      <body>
        <div class="receipt-wrapper">
          <div class="action-bar">
            <button onclick="window.print()" class="print-btn">
              🖨️ Print / Save Receipt
            </button>
          </div>

          <div class="receipt-container">
            <!-- Diagonal Watermark -->
            <div class="watermark">${rawPayStatus}</div>

            <div class="receipt-content">
              <!-- School Header -->
              <div class="school-header">
                <h1 class="school-title">${schoolName}</h1>
                <p class="school-subtitle">${schoolAddress}</p>
                <p class="school-contact">${schoolContact}</p>
              </div>

              <div class="divider-double"></div>

              <!-- Receipt Title Bar -->
              <div class="info-bar">
                <div class="info-bar-title">Student Fee Receipt</div>
                <div class="info-bar-meta">
                  <div>Receipt No: <span>${receiptNo}</span></div>
                  <div>Date: <span>${paymentDateStr}</span></div>
                </div>
              </div>

              <!-- Student Metadata Grid -->
              <div class="details-grid">
                <div class="details-field">
                  <span class="label">Student Name</span>
                  <span class="value">${studentName}</span>
                </div>
                <div class="details-field">
                  <span class="label">Registration Number</span>
                  <span class="value">${regNo}</span>
                </div>
                <div class="details-field">
                  <span class="label">Academic Class</span>
                  <span class="value">${className}</span>
                </div>
                <div class="details-field">
                  <span class="label">Payment Status</span>
                  <span class="value">
                    <span class="status-pill ${isPaid ? 'status-paid' : isPartiallyPaid ? 'status-partial' : 'status-unpaid'}">
                      ${rawPayStatus}
                    </span>
                  </span>
                </div>
              </div>

              <!-- Fee Breakdown Table -->
              <table class="fee-table">
                <thead>
                  <tr>
                    <th style="width: 50px;">#</th>
                    <th style="text-align: left;">Description</th>
                    <th style="text-align: right;">Total Fee (৳)</th>
                    <th style="text-align: right;">Paid (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>${fee.title || 'Tuition Fee Invoice'}</td>
                    <td style="text-align: right;">৳ ${totalAmount.toLocaleString()}</td>
                    <td style="text-align: right;">৳ ${paidAmount.toLocaleString()}</td>
                  </tr>
                  <tr class="total-row">
                    <td colSpan="2" style="text-align: right;">Net Balance Due</td>
                    <td colSpan="2" style="text-align: right; color: ${dueAmount > 0 ? '#dc2626' : '#059669'};">৳ ${dueAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Amount in Words -->
              <div class="amount-words">
                <span>Amount Paid in Words:</span> ${amountInWords}
              </div>

              <!-- Footer Disclaimer -->
              <div class="footer">
                <p>This is a computer-generated receipt and does not require a seal.</p>
                <p class="download-meta">Downloaded / Printed on: ${downloadedDate}</p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
}

export function printStudentFeeReceipt(fee, studentInfo = {}) {
  if (typeof window === 'undefined') return;
  const mergedInfo = { ...fee, ...(studentInfo || {}) };
  const html = generateStudentFeeReceiptHTML(fee, mergedInfo);
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
