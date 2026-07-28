import { SCHOOL_NAME } from '@/lib/secret';

export function generateAdmitCardHTML(exam, student = {}, schedules = []) {
  const schoolName = SCHOOL_NAME || 'Star Cadet Academia';
  const schoolAddress = student.school_address || 'Mymensingh, Bangladesh';
  const schoolContact = student.school_phone || '+880 1700-000000 | info@school.edu.bd';

  const admitCardNo = `ADM-${exam.id || 'EX'}-${student.registration_number || student.id || '000'}`;
  const studentName = student.name || 'Student Name';
  const regNo = student.registration_number || 'N/A';
  const rollNo = student.roll || 'N/A';
  const className = student.class_name ? (student.class_name.toLowerCase().startsWith('class') ? student.class_name : `Class ${student.class_name}`) : 'N/A';
  const sectionName = student.section_name || 'N/A';
  const dob = student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('en-GB') : 'N/A';
  const gender = student.gender || 'N/A';

  const startDateStr = exam.start_date ? new Date(exam.start_date).toLocaleDateString('en-GB') : 'N/A';
  const endDateStr = exam.end_date ? new Date(exam.end_date).toLocaleDateString('en-GB') : 'N/A';
  const issuedDate = new Date().toLocaleDateString('en-GB');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admit Card - ${exam.name} - ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      padding: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .admit-card-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    .action-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .btn-print {
      background-color: #0284c7;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
      transition: all 0.2s;
    }
    .btn-print:hover { background-color: #0369a1; }

    .admit-card {
      background: #ffffff;
      border: 3px double #0284c7;
      border-radius: 12px;
      padding: 30px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    }

    /* Watermark */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 80px;
      font-weight: 900;
      color: rgba(2, 132, 199, 0.03);
      pointer-events: none;
      white-space: nowrap;
      text-transform: uppercase;
    }

    /* Header */
    .header {
      text-align: center;
      border-b: 2px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .school-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .school-sub {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
      font-weight: 500;
    }

    .badge-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .admit-badge {
      background-color: #0284c7;
      color: #ffffff;
      padding: 6px 18px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .admit-no {
      font-size: 12px;
      font-weight: 700;
      color: #475569;
    }

    /* Exam Title */
    .exam-title-box {
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 12px 16px;
      text-align: center;
      margin-bottom: 24px;
    }
    .exam-name {
      font-size: 16px;
      font-weight: 800;
      color: #0369a1;
    }
    .exam-dates {
      font-size: 12px;
      color: #0284c7;
      font-weight: 600;
      margin-top: 4px;
    }

    /* Student Info Grid */
    .student-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px 16px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .info-item { display: flex; flex-direction: column; }
    .info-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-val { font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px; }

    /* Schedule Table */
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .schedule-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .schedule-table th, .schedule-table td {
      border: 1px solid #cbd5e1;
      padding: 10px 12px;
      font-size: 12px;
      text-align: left;
    }
    .schedule-table th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      font-size: 11px;
    }
    .schedule-table td { font-weight: 600; color: #1e293b; }

    /* Candidate Rules */
    .rules-box {
      background-color: #fffbebf5;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 30px;
    }
    .rules-title { font-size: 11px; font-weight: 800; color: #92400e; text-transform: uppercase; margin-bottom: 6px; }
    .rules-list { font-size: 11px; color: #78350f; padding-left: 16px; line-height: 1.6; font-weight: 500; }

    /* Footer Signatures */
    .signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      padding-top: 20px;
    }
    .sig-block {
      text-align: center;
      width: 200px;
    }
    .sig-line {
      border-top: 1px solid #475569;
      margin-bottom: 6px;
    }
    .sig-text {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }

    /* Print Specifics */
    @media print {
      body { background: #ffffff; padding: 0; }
      .action-bar { display: none; }
      .admit-card { border-color: #000000; box-shadow: none; padding: 20px; }
      .exam-title-box { background: #ffffff !important; border-color: #000000 !important; }
      .student-grid { background: #ffffff !important; border-color: #000000 !important; }
      .schedule-table th { background: #f1f5f9 !important; }
    }
  </style>
</head>
<body>
  <div class="admit-card-wrapper">
    <div class="action-bar">
      <button class="btn-print" onclick="window.print()">🖨️ Print / Download Admit Card</button>
    </div>

    <div class="admit-card">
      <div class="watermark">${schoolName}</div>

      <!-- Header -->
      <div class="header">
        <h1 class="school-title">${schoolName}</h1>
        <p class="school-sub">${schoolAddress} | Phone: ${schoolContact}</p>
      </div>

      <!-- Badge bar -->
      <div class="badge-bar">
        <span class="admit-badge">Official Admit Card</span>
        <span class="admit-no">Admit No: ${admitCardNo}</span>
      </div>

      <!-- Exam Name -->
      <div class="exam-title-box">
        <div class="exam-name">${exam.name} ${exam.term ? `(${exam.term})` : ''}</div>
        <div class="exam-dates">Schedule Period: ${startDateStr} to ${endDateStr}</div>
      </div>

      <!-- Student Details -->
      <div class="student-grid">
        <div class="info-item">
          <span class="info-label">Candidate Name</span>
          <span class="info-val">${studentName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Registration No</span>
          <span class="info-val">${regNo}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Roll Number</span>
          <span class="info-val">${rollNo}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Class</span>
          <span class="info-val">${className}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Section</span>
          <span class="info-val">${sectionName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Date of Birth</span>
          <span class="info-val">${dob}</span>
        </div>
      </div>

      <!-- Timetable -->
      <div class="section-title">Examination Schedule & Timetable</div>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject Name</th>
            <th>Code</th>
            <th>Exam Timings</th>
            <th>Room No</th>
          </tr>
        </thead>
        <tbody>
          ${schedules.length === 0 ? `
            <tr>
              <td colspan="5" style="text-align: center; color: #94a3b8; font-style: italic;">No specific schedule entries mapped for this examination.</td>
            </tr>
          ` : schedules.map(s => `
            <tr>
              <td>${new Date(s.exam_date).toLocaleDateString('en-GB')}</td>
              <td>${s.subject_name || 'N/A'}</td>
              <td>${s.subject_code || 'N/A'}</td>
              <td>${s.start_time} - ${s.end_time}</td>
              <td>Room ${s.room_number || 'TBA'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Instructions -->
      <div class="rules-box">
        <div class="rules-title">Candidate Instructions & Exam Rules</div>
        <ol class="rules-list">
          <li>Students must bring this original printed Admit Card to the examination hall for every session.</li>
          <li>Candidates must arrive at the examination hall at least 15 minutes prior to start time.</li>
          <li>Mobile phones, smartwatches, and unauthorized materials are strictly prohibited inside the hall.</li>
        </ol>
      </div>

      <!-- Signatures -->
      <div class="signatures">
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-text">Candidate's Signature</div>
        </div>
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-text">Controller of Examinations</div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;
}

export function printAdmitCard(exam, student = {}, schedules = []) {
  const html = generateAdmitCardHTML(exam, student, schedules);
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  }
}
