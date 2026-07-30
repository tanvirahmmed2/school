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

  const examName = exam.name || 'Higher Secondary Certificate Examination - 2023';
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
  <title>Academic Transcript - ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:ital,wght@0,400;0,700;1,400;1,700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      background-color: #f4f4f5;
      color: #000000;
      padding: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .marksheet-wrapper {
      max-width: 820px;
      margin: 0 auto;
    }

    .action-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .btn-print {
      background-color: #000000;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: bold;
      font-family: sans-serif;
      cursor: pointer;
      border-radius: 4px;
    }

    /* Board Pattern Outer Border Container */
    .marksheet-container {
      background: #ffffff;
      border: 12px double #333333;
      padding: 30px 35px;
      position: relative;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 5px;
    }
    .board-title {
      font-size: 20px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .country-title {
      font-size: 16px;
      font-weight: bold;
      margin-top: 2px;
      text-transform: uppercase;
    }
    .exam-title {
      font-size: 17px;
      font-weight: bold;
      margin-top: 8px;
    }

    /* Serial and Grade Scale Header Area */
    .top-meta-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 15px;
      margin-bottom: 10px;
    }

    .serial-box {
      font-size: 13px;
      line-height: 1.6;
      font-weight: bold;
    }

    .doc-title-wrapper {
      text-align: center;
      flex-grow: 1;
      padding-top: 35px;
    }

    .doc-title {
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      letter-spacing: 1px;
    }

    /* Official Board Grading Table Header Top Right */
    .grading-scale-table {
      border-collapse: collapse;
      font-size: 11px;
      text-align: center;
    }
    .grading-scale-table th, .grading-scale-table td {
      border: 1px solid #000000;
      padding: 1px 6px;
    }
    .grading-scale-table th {
      font-weight: bold;
      background-color: #f8f8f8;
    }

    /* Student Information Section */
    .student-info-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 1.6;
    }
    .student-info-table td {
      padding: 2px 0;
      vertical-align: top;
    }
    .student-info-table td.label {
      width: 180px;
    }
    .student-info-table td.colon {
      width: 15px;
      text-align: center;
    }
    .student-info-table td.val {
      font-weight: bold;
      font-style: italic;
    }

    /* Main Academic Marks Table */
    .marks-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 5px;
    }
    .marks-table th, .marks-table td {
      border: 1px solid #000000;
      padding: 6px 8px;
      font-size: 13px;
    }
    .marks-table th {
      font-weight: bold;
      text-align: center;
      background-color: #ffffff;
    }
    .marks-table td.text-center { text-align: center; }
    .marks-table td.text-right { text-align: right; }
    .marks-table td.subject-name { font-weight: bold; }

    .additional-header-row td {
      font-weight: bold;
      font-style: italic;
      border: 1px solid #000000;
      padding: 4px 8px;
      font-size: 13px;
    }

    /* Footer Signatures and Date */
    .footer-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 13px;
    }

    .pub-date {
      font-weight: bold;
    }

    .signature-block {
      text-align: center;
      font-weight: bold;
      font-style: italic;
    }

    /* Print Formatting */
    @media print {
      body { background: #ffffff; padding: 0; }
      .action-bar { display: none; }
      .marksheet-container {
        border: 10px double #000000;
        box-shadow: none;
        padding: 20px 25px;
      }
    }
  </style>
</head>
<body>
  <div class="marksheet-wrapper">
    <div class="action-bar">
      <button class="btn-print" onclick="window.print()">Print Transcript</button>
    </div>

    <div class="marksheet-container">
      <!-- Board Header -->
      <div class="header">
        <div class="board-title">${schoolName}</div>
        <div class="country-title">BANGLADESH</div>
        <div class="exam-title">${examName} ${examTerm}</div>
      </div>

      <!-- Serial & Grading Scale Header -->
      <div class="top-meta-container">
        <div class="serial-box">
          <div>Serial No. DBHT 23 &nbsp; 0009554</div>
          <div style="margin-top: 4px;">DBCH &nbsp; 23008043</div>
        </div>

        <div class="doc-title-wrapper">
          <span class="doc-title">ACADEMIC TRANSCRIPT</span>
        </div>

        <!-- Grading System Reference Box -->
        <table class="grading-scale-table">
          <thead>
            <tr>
              <th>Letter<br/>Grade</th>
              <th>Class<br/>Interval (%)</th>
              <th>Grade<br/>Point</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>A+</td><td>80-100</td><td>5</td></tr>
            <tr><td>A</td><td>70-79</td><td>4</td></tr>
            <tr><td>A-</td><td>60-69</td><td>3.5</td></tr>
            <tr><td>B</td><td>50-59</td><td>3</td></tr>
            <tr><td>C</td><td>40-49</td><td>2</td></tr>
            <tr><td>D</td><td>33-39</td><td>1</td></tr>
            <tr><td>F</td><td>00-32</td><td>0</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Student Details Table -->
      <table class="student-info-table">
        <tr>
          <td class="label">Name of Student</td>
          <td class="colon">:</td>
          <td class="val">${studentName}</td>
        </tr>
        <tr>
          <td class="label">Father's Name</td>
          <td class="colon">:</td>
          <td class="val">${student.father_name || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Mother's Name</td>
          <td class="colon">:</td>
          <td class="val">${student.mother_name || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Name of Institution</td>
          <td class="colon">:</td>
          <td class="val">${schoolName}</td>
        </tr>
        <tr>
          <td class="label">Name of Centre</td>
          <td class="colon">:</td>
          <td class="val">${student.centre_name || schoolAddress}</td>
        </tr>
        <tr>
          <td class="label">Roll No.</td>
          <td class="colon">:</td>
          <td class="val" style="width: 200px;">${rollNo}</td>
          <td class="label" style="width: 120px;">Registration No.</td>
          <td class="colon">:</td>
          <td class="val">${regNo}</td>
        </tr>
        <tr>
          <td class="label">Group / Class</td>
          <td class="colon">:</td>
          <td class="val">${className} (${sectionName})</td>
          <td class="label">Type of Student</td>
          <td class="colon">:</td>
          <td class="val">${student.type || 'Regular'}</td>
        </tr>
      </table>

      <!-- Main Marks & GPA Breakdown Table -->
      <table class="marks-table">
        <thead>
          <tr>
            <th style="width: 45px;">SL. No.</th>
            <th>Name of Subjects</th>
            <th style="width: 75px;">Letter<br/>Grade</th>
            <th style="width: 75px;">Grade<br/>Point</th>
            <th style="width: 130px;">GPA<br/><span style="font-size: 9px; font-weight: normal;">(without additional subject)</span></th>
            <th style="width: 80px;">GPA</th>
          </tr>
        </thead>
        <tbody>
          ${marks.length === 0 ? `
            <tr>
              <td colspan="6" class="text-center" style="font-style: italic; padding: 15px;">No marks entry found.</td>
            </tr>
          ` : (() => {
            const rowCount = marks.length;
            return marks.map((m, idx) => {
              const obtained = Number(m.marks_obtained || 0);
              const total = Number(m.total_marks || 100);
              const pct = total > 0 ? (obtained / total) * 100 : 0;
              
              const letter = m.letter_grade || (pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'A-' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : pct >= 33 ? 'D' : 'F');
              const point = pct >= 80 ? '5' : pct >= 70 ? '4' : pct >= 60 ? '3.5' : pct >= 50 ? '3' : pct >= 40 ? '2' : pct >= 33 ? '1' : '0';

              return `
                <tr>
                  <td class="text-center">${idx + 1}</td>
                  <td class="subject-name">${m.subject_name || 'Subject'}</td>
                  <td class="text-center" style="font-weight: bold;">${letter}</td>
                  <td class="text-center" style="font-weight: bold;">${point}</td>
                  ${idx === 0 ? `<td rowspan="${rowCount}" class="text-center" style="font-size: 16px; font-weight: bold; vertical-align: middle;">${gpaVal}</td>` : ''}
                  ${idx === 0 ? `<td rowspan="${rowCount}" class="text-center" style="font-size: 16px; font-weight: bold; vertical-align: middle;">${gpaVal}</td>` : ''}
                </tr>
              `;
            }).join('');
          })()}
        </tbody>
      </table>

      <!-- Optional / Additional Subject Box Structure -->
      <table class="marks-table" style="margin-top: 10px;">
        <tr class="additional-header-row">
          <td colspan="6">Additional Subject :</td>
        </tr>
        <tr>
          <td class="text-center" style="width: 45px;">${marks.length + 1}</td>
          <td class="subject-name">${student.additional_subject || 'Statistics / Optional Subject'}</td>
          <td class="text-center" style="width: 75px; font-weight: bold;">A+</td>
          <td class="text-center" style="width: 75px; font-weight: bold;">5</td>
          <td class="text-center" style="width: 210px;" colspan="2">
            <div style="font-size: 10px; font-weight: bold;">GP above 2</div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 2px;">3.0</div>
          </td>
        </tr>
      </table>

      <!-- Footer Date and Signature -->
      <div class="footer-section">
        <div class="pub-date">
          Date of Publication of Results : <span style="font-style: italic;">${issuedDate}</span>
        </div>
        <div class="signature-block">
          <div style="font-size: 22px; font-family: cursive; margin-bottom: -6px;">Controller</div>
          <div>Controller of Examinations</div>
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