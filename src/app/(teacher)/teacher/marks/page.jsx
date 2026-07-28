'use client';

import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiAward, FiSave, FiLayers, FiInfo, FiUploadCloud, FiDownload,
  FiFileText, FiCheck, FiAlertCircle, FiEdit3
} from 'react-icons/fi';

const MarksEntryPage = () => {
  const [activeMode, setActiveMode] = useState('manual'); // 'manual' | 'spreadsheet'

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [examId, setExamId] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // Spreadsheet Upload States
  const [xlsxLoaded, setXlsxLoaded] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsedRecords, setParsedRecords] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadSummary, setUploadSummary] = useState(null);

  // Load SheetJS for Spreadsheet handling
  useEffect(() => {
    if (typeof window !== 'undefined' && window.XLSX) {
      setXlsxLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.async = true;
    script.onload = () => setXlsxLoaded(true);
    script.onerror = () => toast.error('Failed to load Excel library.');
    document.head.appendChild(script);
  }, []);

  // Load dropdown resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [examsRes, classesRes, subjectsRes] = await Promise.all([
          fetch('/api/exams'),
          fetch('/api/classes'),
          fetch('/api/teacher/subjects')
        ]);

        if (examsRes.ok && classesRes.ok && subjectsRes.ok) {
          const examsData = await examsRes.json();
          const classesData = await classesRes.json();
          const subjectsData = await subjectsRes.json();

          setExams(examsData.paylod?.exams || []);
          setClasses(classesData.paylod?.classes || []);
          setSubjects(subjectsData.paylod?.subjects || []);
        }
      } catch (err) {
        console.error('Failed to load form dropdowns:', err);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchResources();
  }, []);

  // Fetch sections when class changes
  useEffect(() => {
    if (!classId) {
      const timer = setTimeout(() => {
        setSections([]);
        setSectionId('');
      }, 0);
      return () => clearTimeout(timer);
    }

    const fetchSections = async () => {
      try {
        const res = await fetch(`/api/sections?class_id=${classId}`);
        if (res.ok) {
          const data = await res.json();
          setSections(data.paylod?.sections || []);
        }
      } catch (err) {
        console.error('Failed to load sections:', err);
      }
    };
    fetchSections();
  }, [classId]);

  // Load student list for manual marks entry
  const handleLoadStudents = async () => {
    if (!examId || !classId || !subjectId) {
      toast.error('Exam, Class, and Subject are required to load student lists.');
      return;
    }

    setLoadingStudents(true);
    try {
      const targetSec = sectionId || 'all';
      const res = await fetch(`/api/students/marks?exam_id=${examId}&class_id=${classId}&section_id=${targetSec}&subject_id=${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.paylod?.students || []);
        toast.success('Student list loaded.');
      } else {
        toast.error('Failed to load student list.');
      }
    } catch (err) {
      toast.error('An error occurred loading students.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, marks_obtained: value } : s))
    );
  };

  const handleTotalMarkChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, total_marks: value } : s))
    );
  };

  const handleRemarksChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, remarks: value } : s))
    );
  };

  const handleSaveMarks = async () => {
    if (students.length === 0) return;

    setSaving(true);
    try {
      const marksPayload = students.map((s) => ({
        student_id: s.student_id,
        exam_id: parseInt(examId, 10),
        subject_id: parseInt(subjectId, 10),
        marks_obtained: s.marks_obtained !== null && s.marks_obtained !== '' ? parseFloat(s.marks_obtained) : 0,
        total_marks: s.total_marks ? parseFloat(s.total_marks) : 100,
        remarks: s.remarks || null
      }));

      const res = await fetch('/api/students/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks: marksPayload })
      });

      if (res.ok) {
        toast.success('Marks saved successfully!');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save marks.');
      }
    } catch (err) {
      toast.error('An error occurred saving marks.');
    } finally {
      setSaving(false);
    }
  };

  // --- SPREADSHEET DOWNLOAD & UPLOAD LOGIC ---
  const handleDownloadTemplate = async () => {
    if (!examId || !classId || !subjectId) {
      toast.error('Please select Exam, Class, and Subject to download template.');
      return;
    }
    if (!xlsxLoaded || !window.XLSX) {
      toast.error('Excel library is loading, please wait.');
      return;
    }

    setDownloadingTemplate(true);
    try {
      const targetSec = sectionId || 'all';
      const res = await fetch(`/api/students/marks?exam_id=${examId}&class_id=${classId}&section_id=${targetSec}&subject_id=${subjectId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error('Failed to load student list for template.');
        return;
      }

      const roster = data.paylod?.students || [];
      if (roster.length === 0) {
        toast.error('No students found for the selected class/section.');
        return;
      }

      const selectedSub = subjects.find(s => String(s.subject_id || s.id) === String(subjectId));
      const subCode = selectedSub?.subject_code || selectedSub?.code || 'SUB';

      const rows = [
        ['Subject Code', 'Student Registration Number', 'Mark', 'Exam ID', 'Student Name (read-only)']
      ];

      for (const st of roster) {
        rows.push([subCode, st.registration_number, st.marks_obtained ?? '', examId, st.name]);
      }

      const ws = window.XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 16 }, { wch: 28 }, { wch: 12 }, { wch: 12 }, { wch: 28 }];
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, 'Marks');

      const fileName = `marks_exam${examId}_class${classId}_${subCode}.xlsx`;
      window.XLSX.writeFile(wb, fileName);
      toast.success(`Downloaded template with ${roster.length} student rows.`);
    } catch {
      toast.error('Failed to generate spreadsheet template.');
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      toast.error('Unsupported format. Please upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }
    if (!xlsxLoaded || !window.XLSX) {
      toast.error('Excel library is loading, please wait.');
      return;
    }

    setFileName(file.name);
    setUploadSummary(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = window.XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rows.length < 2) {
          toast.error('The sheet is empty or has no header row.');
          return;
        }

        const headerRow = rows[0].map((h) => String(h).trim().toLowerCase());
        
        const subCodeIdx = headerRow.findIndex(h => h.includes('subject') || h.includes('sub'));
        const regIdx = headerRow.findIndex(h => h.includes('reg') || h.includes('number') || h.includes('student'));
        const markIdx = headerRow.findIndex(h => h.includes('mark') || h.includes('score'));
        const examIdx = headerRow.findIndex(h => h.includes('exam'));

        if (regIdx === -1 || markIdx === -1 || subCodeIdx === -1 || examIdx === -1) {
          toast.error('Sheet must contain headers: "Subject Code", "Student Registration Number", "Mark", and "Exam ID".');
          return;
        }

        const records = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;
          
          const subCode = row[subCodeIdx];
          const reg = row[regIdx];
          const markVal = row[markIdx];
          const exVal = row[examIdx];

          if (reg !== undefined && reg !== null && String(reg).trim() !== '') {
            records.push({
              subject_code: String(subCode || '').trim(),
              registration_number: String(reg).trim(),
              mark: markVal !== undefined && markVal !== null ? String(markVal).trim() : '',
              exam_id: String(exVal || examId || '').trim()
            });
          }
        }

        if (records.length === 0) {
          toast.error('No valid records found in spreadsheet.');
          return;
        }

        setParsedRecords(records);
        toast.success(`Parsed ${records.length} records from spreadsheet "${file.name}".`);
      } catch (err) {
        toast.error('Failed to parse spreadsheet file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleSaveSpreadsheetMarks = async () => {
    if (parsedRecords.length === 0) {
      toast.error('Please upload and parse a spreadsheet file first.');
      return;
    }

    setSaving(true);
    setUploadSummary(null);
    try {
      const res = await fetch('/api/students/marks/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: parsedRecords })
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        const summary = resData.paylod;
        setUploadSummary(summary);
        toast.success(`Successfully uploaded marks for ${summary.successCount} student(s).`);
        if (summary.warningCount > 0) {
          toast(`⚠ ${summary.warningCount} row warnings logged during import.`);
        }
        setParsedRecords([]);
        setFileName('');
      } else {
        toast.error(resData.error || resData.message || 'Failed to upload spreadsheet marks.');
      }
    } catch {
      toast.error('An error occurred during spreadsheet marks submission.');
    } finally {
      setSaving(false);
    }
  };

  // Filter subjects assigned to the selected class
  const filteredSubjects = subjects.filter((s) => String(s.class_id) === String(classId));

  return (
    <div className="flex flex-col gap-8 w-full mx-auto animate-fade-up">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <FiAward className="text-primary" /> Student Subject Marks Evaluation
          </h1>
          <p className="text-slate-500 text-sm font-medium">Record and update student exam marks via manual roster or Excel spreadsheet upload.</p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'manual'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FiEdit3 className="text-sm" /> Manual Roster
          </button>
          <button
            onClick={() => setActiveMode('spreadsheet')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'spreadsheet'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FiUploadCloud className="text-sm" /> Spreadsheet Upload
          </button>
        </div>
      </div>

      {/* Shared Dropdowns Selection Bar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Exam</label>
          <select
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            disabled={loadingDropdowns}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-primary transition-colors"
          >
            <option value="">-- Choose Exam --</option>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>{e.name} ({e.term || 'General'})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Class</label>
          <select
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              setSubjectId('');
            }}
            disabled={loadingDropdowns}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-primary transition-colors"
          >
            <option value="">-- Choose Class --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Section</label>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            disabled={!classId}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-primary transition-colors"
          >
            <option value="">-- All Sections --</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={!classId}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-primary transition-colors"
          >
            <option value="">-- Choose Subject --</option>
            {filteredSubjects.map((s) => (
              <option key={s.subject_id || s.id} value={s.subject_id || s.id}>{s.subject_name || s.name}</option>
            ))}
          </select>
        </div>

        {activeMode === 'manual' ? (
          <button
            onClick={handleLoadStudents}
            disabled={!examId || !classId || !subjectId || loadingStudents}
            className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-sm font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer h-[46px]"
          >
            {loadingStudents ? 'Loading...' : 'Load Students'}
          </button>
        ) : (
          <button
            onClick={handleDownloadTemplate}
            disabled={!examId || !classId || !subjectId || downloadingTemplate}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer h-[46px] flex items-center justify-center gap-1.5"
          >
            <FiDownload className="text-base" />
            <span>{downloadingTemplate ? 'Downloading...' : 'Get Template'}</span>
          </button>
        )}
      </div>

      {/* MODE 1: MANUAL ENTRY */}
      {activeMode === 'manual' && (
        <>
          {students.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
                <FiLayers className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Load Marks Sheet</h3>
              <p className="text-slate-400 text-xs font-medium max-w-xs">Select exam, class, and subject parameters, then click Load Students to record marks.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-800">Grades Ledger Sheet ({students.length} Students)</h2>
                <button
                  onClick={handleSaveMarks}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  <FiSave className="text-sm" />
                  <span>{saving ? 'Saving...' : 'Save Marks'}</span>
                </button>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center w-36">Marks Obtained</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center w-36">Total Marks</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.student_id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="py-4">
                          <p className="text-sm font-bold text-slate-800">{s.name}</p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reg: {s.registration_number}</span>
                        </td>
                        <td className="py-4 text-center">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={s.marks_obtained !== null && s.marks_obtained !== undefined ? s.marks_obtained : ''}
                            onChange={(e) => handleMarkChange(s.student_id, e.target.value)}
                            className="w-24 mx-auto p-2 bg-slate-50 border border-slate-100 rounded-xl text-center text-sm font-bold text-slate-700 outline-none focus:border-primary transition-colors"
                          />
                        </td>
                        <td className="py-4 text-center">
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={s.total_marks !== null && s.total_marks !== undefined ? s.total_marks : 100}
                            onChange={(e) => handleTotalMarkChange(s.student_id, e.target.value)}
                            className="w-24 mx-auto p-2 bg-slate-50 border border-slate-100 rounded-xl text-center text-sm font-bold text-slate-400 outline-none focus:border-primary transition-colors"
                          />
                        </td>
                        <td className="py-4">
                          <input
                            type="text"
                            value={s.remarks || ''}
                            onChange={(e) => handleRemarksChange(s.student_id, e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary transition-colors"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODE 2: SPREADSHEET UPLOAD */}
      {activeMode === 'spreadsheet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: File Dropzone & Instructions */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 min-h-[220px] text-center bg-white ${
                dragActive ? 'border-primary bg-primary-light/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />
              <div className="p-4 bg-primary-light border border-primary-light text-primary rounded-2xl mb-4">
                <FiUploadCloud className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">
                {fileName ? 'Change File' : 'Upload Spreadsheet Marks Sheet'}
              </h3>
              <p className="text-slate-400 text-xs font-semibold max-w-[220px]">
                Drag &amp; drop Excel (.xlsx, .xls) or CSV, or click to browse
              </p>
              {fileName && (
                <span className="mt-4 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold truncate max-w-full">
                  {fileName}
                </span>
              )}
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex gap-3">
              <FiInfo className="text-base text-emerald-700 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <h4 className="font-bold text-emerald-800">Spreadsheet Columns Required</h4>
                <p className="leading-relaxed font-medium text-emerald-700">
                  Ensure the spreadsheet contains columns:<br />
                  • <strong>Subject Code</strong> (e.g. <code>MATH101</code>)<br />
                  • <strong>Student Registration Number</strong> (e.g. <code>REG-001</code>)<br />
                  • <strong>Mark</strong> (Obtained score)<br />
                  • <strong>Exam ID</strong> (Target exam ID number)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Preview / Summary */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {parsedRecords.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Parsed Spreadsheet Preview</h2>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">{parsedRecords.length} records parsed from sheet.</p>
                  </div>
                  <button
                    onClick={handleSaveSpreadsheetMarks}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <FiCheck className="text-sm" />
                    <span>{saving ? 'Uploading...' : 'Submit & Register Marks'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto w-full max-h-[360px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Sub Code</th>
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Registration No.</th>
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Mark</th>
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Exam ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRecords.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                          <td className="py-2.5 px-3 text-xs font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 text-xs font-bold text-slate-700">{row.subject_code}</td>
                          <td className="py-2.5 px-3 text-xs font-bold text-slate-800">{row.registration_number}</td>
                          <td className="py-2.5 px-3 text-xs font-bold text-emerald-600 text-center">{row.mark}</td>
                          <td className="py-2.5 px-3 text-xs font-semibold text-slate-500 text-center">{row.exam_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {parsedRecords.length === 0 && !uploadSummary && (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
                  <FiFileText className="text-3xl" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Upload Marks Spreadsheet</h3>
                <p className="text-slate-400 text-xs font-medium max-w-xs">
                  Select parameters → click Get Template → fill marks → upload file here to batch register.
                </p>
              </div>
            )}

            {/* Execution summary log */}
            {uploadSummary && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <FiCheck className="text-primary text-lg" /> Spreadsheet Processing Execution Summary
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Successfully Saved</span>
                    <span className="text-2xl font-semibold text-emerald-600">{uploadSummary.successCount}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Warnings / Errors</span>
                    <span className={`text-2xl font-semibold ${uploadSummary.warningCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {uploadSummary.warningCount}
                    </span>
                  </div>
                </div>

                {uploadSummary.warnings?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <FiAlertCircle className="text-sm" /> Import Warning Logs
                    </h4>
                    <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl max-h-[140px] overflow-y-auto flex flex-col gap-1.5">
                      {uploadSummary.warnings.map((w, i) => (
                        <p key={i} className="text-xs font-semibold text-amber-800/80 leading-relaxed">• {w}</p>
                      ))}
                    </div>
                  </div>
                )}

                {uploadSummary.savedRecords?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <FiLayers className="text-sm" /> Registered Student Marks
                    </h4>
                    <div className="overflow-x-auto w-full max-h-[220px]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                            <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration</th>
                            <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                            <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadSummary.savedRecords.map((rec, i) => (
                            <tr key={i} className="border-b border-slate-50">
                              <td className="py-2 text-xs font-bold text-slate-800">{rec.student_name}</td>
                              <td className="py-2 text-xs font-medium text-slate-500">{rec.registration_number}</td>
                              <td className="py-2 text-xs font-semibold text-slate-600">{rec.subject_name} ({rec.subject_code})</td>
                              <td className="py-2 text-xs font-bold text-emerald-600 text-center">{rec.marks_obtained}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntryPage;
