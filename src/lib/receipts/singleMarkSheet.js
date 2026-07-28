import { SCHOOL_NAME } from '@/lib/secret';

export function generateSingleMarkSheetHTML(data = {}) {
  const { student = {}, exam = {}, result = {}, marks = [] } = data;

  const schoolName = SCHOOL_NAME || 'Star Cadet Academia';
  const schoolAddress = student.school_address || 'Mymensingh, Bangladesh';
  const schoolContact = student.school_phone || '+880 1700-000000 | info@school.edu.bd';

  const studentName = student.name || 'Student Name';
  const regNo = student.registration_number || student.reg_no || 'N/A';
  const rollNo = student.roll || 'N/A';
  const rawClass = student.class_name || 'N/A';
  const className = rawClass.toLowerCase().startsWith('class') ? rawClass : `Class ${rawClass}`;
  const sectionName = student.section_name || 'N/A';

  const examName = exam.name || 'Term Examination';
  const examTerm = exam.term ? `(${exam.term})` : '';

  const gpaVal = result.gpa !== undefined && result.gpa !== null ? Number(result.gpa).toFixed(2) : '0.00';
  const gradeVal = result.grade || (Number(gpaVal) >= 5 ? 'A+' : Number(gpaVal) >= 4 ? 'A' : Number(gpaVal) >= 3.5 ? 'A-' : Number(gpaVal) >= 3 ? 'B' : Number(gpaVal) >= 2 ? 'C' : 'F');
  const statusVal = result.status ? result.status.toUpperCase() : (Number(gpaVal) >= 2.00 ? 'PASS' : 'FAIL');
  const isPass = statusVal === 'PASS';

  const totalMarksObtained = marks.reduce((sum, m) => sum + Number(m.marks_obtained || 0), 0);
  const totalMaxMarks = marks.reduce((sum, m) => sum + Number(m.total_marks || 100), 0);
  const percentage = totalMaxMarks > 0 ? ((totalMarksObtained / totalMaxMarks) * 100).toFixed(2) : '0.00';

  const issuedDate = new Date().toLocaleDateString('en-GB');

  const rankDisplay = isPass && result.merit_rank ? result.merit_rank : '-';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Academic Transcript - ${studentName} - ${examName}</title>
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

    .marksheet-wrapper {
      max-width: 850px;
      margin: 0 auto;
    }

    .action-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .btn-print {
      background-color: #0f172a;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
      transition: all 0.2s;
    }
    .btn-print:hover { background-color: #1e293b; }

    .marksheet-container {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }

    /* Header */
    .header {
      text-align: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .school-title {
      font-size: 26px;
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

    .doc-title-bar {
      text-align: center;
      margin-bottom: 24px;
    }
    .doc-title {
      display: inline-block;
      background-color: #0284c7;
      color: #ffffff;
      padding: 6px 24px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .exam-title-text {
      font-size: 15px;
      font-weight: 700;
      color: #0369a1;
      margin-top: 8px;
    }

    /* Student Roster Info */
    .student-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px 16px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .info-item { display: flex; flex-direction: column; }
    .info-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-val { font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px; }

    /* Performance Summary Badges */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 28px;
    }
    .sum-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 10px;
      text-align: center;
    }
    .sum-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .sum-val { font-size: 17px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .sum-val.gpa { color: #0284c7; }
    .sum-val.rank { color: #7c3aed; }
    .sum-val.pass { color: #059669; }
    .sum-val.fail { color: #dc2626; }

    /* Marks Table */
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .marks-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .marks-table th, .marks-table td {
      border: 1px solid #cbd5e1;
      padding: 10px 14px;
      font-size: 12px;
    }
    .marks-table th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      font-size: 11px;
    }
    .marks-table td { font-weight: 600; color: #1e293b; }
    .marks-table td.text-center { text-align: center; }
    .marks-table td.text-right { text-align: right; }

    .grade-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 11px;
    }
    .grade-badge.pass { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .grade-badge.fail { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

    /* Grading Scale Legend */
    .legend-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 32px;
      font-size: 11px;
      color: #475569;
    }
    .legend-title { font-weight: 800; color: #1e293b; margin-bottom: 6px; text-transform: uppercase; font-size: 10px; }

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
      .marksheet-container { border: 1px solid #000000; box-shadow: none; padding: 20px; }
      .doc-title { background-color: #0f172a !important; }
      .sum-card, .student-grid { background: #ffffff !important; border-color: #000000 !important; }
      .marks-table th { background: #f1f5f9 !important; }
    }
  </style>
</head>
<body>
  <div class="marksheet-wrapper">
    <div class="action-bar">
      <button class="btn-print" onclick="window.print()">🖨️ Print / Download Mark Sheet</button>
    </div>

    <div class="marksheet-container">
      <!-- Header -->
      <div class="header">
        <h1 class="school-title">${schoolName}</h1>
        <p class="school-sub">${schoolAddress} | Phone: ${schoolContact}</p>
      </div>

      <!-- Title Bar -->
      <div class="doc-title-bar">
        <span class="doc-title">Official Academic Transcript</span>
        <div class="exam-title-text">${examName} ${examTerm}</div>
      </div>

      <!-- Student Credentials -->
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
          <span class="info-label">Academic Class</span>
          <span class="info-val">${className}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Section</span>
          <span class="info-val">${sectionName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Issue Date</span>
          <span class="info-val">${issuedDate}</span>
        </div>
      </div>

      <!-- Summary Badges -->
      <div class="summary-grid">
        <div class="sum-card">
          <div class="sum-label">Grand Total</div>
          <div class="sum-val">${totalMarksObtained} <span style="font-size: 11px; color: #94a3b8;">/ ${totalMaxMarks}</span></div>
        </div>
        <div class="sum-card">
          <div class="sum-label">Percentage</div>
          <div class="sum-val">${percentage}%</div>
        </div>
        <div class="sum-card">
          <div class="sum-label">GPA Point</div>
          <div class="sum-val gpa">${gpaVal}</div>
        </div>
        <div class="sum-card">
          <div class="sum-label">Merit Rank</div>
          <div class="sum-val rank">${rankDisplay}</div>
        </div>
        <div class="sum-card">
          <div class="sum-label">Final Status</div>
          <div class="sum-val ${isPass ? 'pass' : 'fail'}">${statusVal} (${gradeVal})</div>
        </div>
      </div>

      <!-- Subject Marks Breakdown Table -->
      <div class="section-title">Subject-Wise Marks & Grade Breakdown</div>
      <table class="marks-table">
        <thead>
          <tr>
            <th style="width: 40px;" class="text-center">#</th>
            <th>Subject Name</th>
            <th class="text-center" style="width: 90px;">Code</th>
            <th class="text-right" style="width: 100px;">Full Marks</th>
            <th class="text-right" style="width: 110px;">Marks Obtained</th>
            <th class="text-center" style="width: 80px;">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${marks.length === 0 ? `
            <tr>
              <td colspan="6" class="text-center" style="color: #94a3b8; font-style: italic; py-4;">No subject marks recorded for this examination.</td>
            </tr>
          ` : marks.map((m, idx) => {
            const obtained = Number(m.marks_obtained || 0);
            const total = Number(m.total_marks || 100);
            const pct = total > 0 ? (obtained / total) * 100 : 0;
            const letter = m.letter_grade || (pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'A-' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : 'F');
            const isFailSub = letter === 'F' || pct < 40;

            return `
              <tr>
                <td class="text-center">${idx + 1}</td>
                <td>${m.subject_name || 'Subject'}</td>
                <td class="text-center">${m.subject_code || 'N/A'}</td>
                <td class="text-right">${total}</td>
                <td class="text-right" style="font-weight: 800; color: ${isFailSub ? '#dc2626' : '#0f172a'};">${obtained}</td>
                <td class="text-center">
                  <span class="grade-badge ${isFailSub ? 'fail' : 'pass'}">${letter}</span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <!-- Legend -->
      <div class="legend-box">
        <div class="legend-title">Grading Scale Legend</div>
        <p>A+ (80-100% | 5.00) &bull; A (70-79% | 4.00) &bull; A- (60-69% | 3.50) &bull; B (50-59% | 3.00) &bull; C (40-49% | 2.00) &bull; F (0-39% | 0.00)</p>
      </div>

      <!-- Signatures -->
      <div class="signatures">
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-text">Class Teacher's Signature</div>
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

export function printSingleMarkSheet(data = {}) {
  if (typeof window === 'undefined') return;
  const html = generateSingleMarkSheetHTML(data);
  const printWindow = window.open('', '_blank', 'width=900,height=950');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  }
}
