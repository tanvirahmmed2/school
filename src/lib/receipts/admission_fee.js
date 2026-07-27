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

export function generateAdmissionFeeReceiptHTML(application) {
  const schoolName = SCHOOL_NAME || 'School Management Portal';
  const schoolAddress = application.school_address || 'Mymensingh, Bangladesh';
  
  let schoolContact = '';
  if (application.school_phone && application.school_email) {
    schoolContact = `${application.school_phone} | ${application.school_email}`;
  } else if (application.school_phone) {
    schoolContact = application.school_phone;
  } else if (application.school_email) {
    schoolContact = application.school_email;
  } else {
    schoolContact = '+880 1700-000000';
  }

  const receiptNo = `APP-1000${application.application_id || application.id}`;
  const studentName = application.candidate_name || application.applicant_name || 'N/A';
  const candidateEmail = application.candidate_email || application.email || 'N/A';
  const rawClass = application.class_name || 'N/A';
  const className = rawClass.toLowerCase().startsWith('class') ? rawClass : `Class ${rawClass}`;
  
  const rawPayStatus = (application.payment_status || 'unpaid').toUpperCase();
  const isPaid = rawPayStatus === 'PAID';
  const rawAppStatus = (application.application_status || 'incomplete').toLowerCase();
  
  let appStatusDisplay = 'Incomplete';
  if (['approved', 'accepted'].includes(rawAppStatus)) {
    appStatusDisplay = 'Approved';
  } else if (rawAppStatus === 'rejected') {
    appStatusDisplay = 'Rejected';
  } else if (rawAppStatus === 'pending') {
    appStatusDisplay = 'Pending Review';
  }

  const dateStr = application.created_at
    ? new Date(application.created_at).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');

  const downloadedDate = new Date().toLocaleString('en-GB');

  const feeAmount = Number(application.fee_amount || application.amount || 0);
  const fees = [
    { description: application.circular_name || 'Admission Intake Processing Fee', amount: feeAmount }
  ];
  const total = fees.reduce((sum, item) => sum + Number(item.amount), 0);
  const amountInWords = numberToWords(total);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admission Fee Receipt - ${receiptNo}</title>
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
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .receipt-box {
            width: 100%;
            max-width: 768px;
            background-color: #ffffff;
            border: 4px double #1e293b;
            border-radius: 8px;
            padding: 36px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          }

          ${isPaid ? `
          .paid-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg);
            font-size: 110px;
            font-weight: 900;
            color: rgba(22, 163, 74, 0.13);
            border: 8px solid rgba(22, 163, 74, 0.18);
            padding: 10px 48px;
            border-radius: 20px;
            pointer-events: none;
            user-select: none;
            text-transform: uppercase;
            letter-spacing: 12px;
            z-index: 1;
          }
          ` : ''}

          .receipt-content {
            position: relative;
            z-index: 2;
          }

          /* Header */
          .header {
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 16px;
          }

          .header h1 {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 4px;
          }

          .header p {
            color: #475569;
            font-size: 14px;
            margin-top: 2px;
          }

          /* Title */
          .title {
            text-align: center;
            font-size: 18px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 24px 0;
            color: #0f172a;
          }

          /* Info Grid */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            font-size: 14px;
            margin-bottom: 24px;
          }

          .info-grid p {
            color: #334155;
          }

          .info-grid span {
            font-weight: 600;
            color: #0f172a;
          }

          /* Fee Table */
          .fee-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #94a3b8;
            font-size: 14px;
            margin-bottom: 20px;
          }

          .fee-table th {
            background-color: #f1f5f9;
            border: 1px solid #94a3b8;
            padding: 10px 12px;
            font-weight: 700;
            color: #0f172a;
          }

          .fee-table td {
            border: 1px solid #94a3b8;
            padding: 10px 12px;
            color: #334155;
          }

          .total-row {
            font-weight: 700;
            background-color: #f8fafc;
          }

          /* Amount in Words */
          .amount-words {
            font-size: 14px;
            margin-top: 16px;
            color: #1e293b;
          }

          .amount-words span {
            font-weight: 700;
          }

          /* Status Badges */
          .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 700;
          }
          .pay-paid { background-color: #dcfce7; color: #15803d; }
          .pay-unpaid { background-color: #fee2e2; color: #b91c1c; }

          /* Footer */
          .footer {
            border-top: 1px solid #e2e8f0;
            margin-top: 36px;
            padding-top: 16px;
            text-align: center;
          }

          .footer p {
            font-size: 12px;
            font-style: italic;
            color: #64748b;
          }

          .download-meta {
            font-size: 10px;
            color: #94a3b8;
            margin-top: 4px;
            font-style: normal !important;
          }

          @media print {
            body { background: #ffffff; padding: 0; min-height: auto; }
            .receipt-box { border-width: 4px; box-shadow: none; width: 100%; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          ${isPaid ? `<div class="paid-watermark">PAID</div>` : ''}

          <div class="receipt-content">
            <!-- Header -->
            <div class="header">
              <h1>${schoolName}</h1>
              <p>${schoolAddress}</p>
              <p>${schoolContact}</p>
            </div>

            <!-- Title -->
            <h2 class="title">School Admission Fee Receipt</h2>

            <!-- Student & Application Info -->
            <div class="info-grid">
              <p><span>Student Name:</span> ${studentName}</p>
              <p><span>Date:</span> ${dateStr}</p>
              <p><span>Class:</span> ${className}</p>
              <p><span>Receipt No:</span> ${receiptNo}</p>
              <p><span>Email:</span> ${candidateEmail}</p>
              <p><span>Payment Status:</span> <span class="status-badge ${isPaid ? 'pay-paid' : 'pay-unpaid'}">${rawPayStatus}</span></p>
              <p><span>Application Status:</span> ${appStatusDisplay}</p>
            </div>

            <!-- Fee Table -->
            <table class="fee-table">
              <thead>
                <tr>
                  <th style="width: 50px; text-align: left;">Sl.</th>
                  <th style="text-align: left;">Description</th>
                  <th style="text-align: right;">Amount (৳)</th>
                </tr>
              </thead>
              <tbody>
                ${fees.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.description}</td>
                    <td style="text-align: right;">৳ ${Number(item.amount).toLocaleString()}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colSpan="2" style="text-align: right;">Total</td>
                  <td style="text-align: right;">৳ ${total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <!-- Amount in Words -->
            <div class="amount-words">
              <span>Amount in Words:</span> ${amountInWords}
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>This is a computer-generated receipt and does not require a seal.</p>
              <p class="download-meta">Downloaded / Printed on: ${downloadedDate}</p>
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

export function printAdmissionFeeReceipt(application) {
  if (typeof window === 'undefined') return;
  const html = generateAdmissionFeeReceiptHTML(application);
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
