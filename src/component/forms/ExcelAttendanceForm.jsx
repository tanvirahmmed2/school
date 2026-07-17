'use client';

import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiCalendar, FiClock, FiInfo, FiUploadCloud, FiFileText,
  FiDownload, FiBook, FiLayers
} from 'react-icons/fi';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ExcelAttendanceForm = () => {
  // ── Step 1: Date ─────────────────────────────────────────────────────────
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dayName, setDayName] = useState('');

  // ── Step 2: Dropdowns ────────────────────────────────────────────────────
  const [assignments, setAssignments] = useState([]); // teacher's scheduled class/section/subject combos for the day
  const [periods, setPeriods] = useState([]);          // all academic periods from the system
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [dropdownError, setDropdownError] = useState('');

  // Unique classes derived from assignments
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClassKey, setSelectedClassKey] = useState(''); // "classId|sectionId"
  const [selectedPeriodId, setSelectedPeriodId] = useState('');

  // ── Step 3: Download ─────────────────────────────────────────────────────
  const [xlsxLoaded, setXlsxLoaded] = useState(false);
  const [downloadingList, setDownloadingList] = useState(false);

  // ── Step 4: Upload ───────────────────────────────────────────────────────
  const [fileName, setFileName] = useState('');
  const [parsedRecords, setParsedRecords] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  // ── Load SheetJS ─────────────────────────────────────────────────────────
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

  // ── When date changes: derive day name + fetch dropdowns ─────────────────
  useEffect(() => {
    if (!date) {
      setDayName('');
      resetSelections();
      return;
    }

    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const name = DAY_NAMES[localDate.getDay()];
    setDayName(name);
    resetSelections();
    fetchDropdowns(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Derive unique class options from assignments
  useEffect(() => {
    const seen = new Set();
    const options = [];
    for (const a of assignments) {
      const key = `${a.class_id}|${a.section_id ?? 'null'}`;
      if (!seen.has(key)) {
        seen.add(key);
        options.push({
          key,
          class_id: a.class_id,
          class_name: a.class_name,
          section_id: a.section_id,
          section_name: a.section_name,
        });
      }
    }
    setClassOptions(options);
  }, [assignments]);

  const resetSelections = () => {
    setAssignments([]);
    setPeriods([]);
    setClassOptions([]);
    setSelectedClassKey('');
    setSelectedPeriodId('');
    setFileName('');
    setParsedRecords([]);
    setImportSummary(null);
    setDropdownError('');
  };

  const fetchDropdowns = async (dateStr) => {
    setLoadingDropdowns(true);
    setDropdownError('');
    try {
      const res = await fetch(`/api/teacher/attendance-dropdowns?date=${dateStr}`);
      const data = await res.json();
      if (res.ok && data.success) {
        const { assignments: ass, periods: per } = data.paylod;
        setAssignments(ass || []);
        setPeriods(per || []);

        if ((ass || []).length === 0) {
          setDropdownError(`No classes scheduled for you on ${dayName || 'this day'}.`);
        } else if ((per || []).length === 0) {
          setDropdownError(
            'No academic periods found in the system. Contact the administrator to create periods.'
          );
        }
      } else {
        setDropdownError(data.message || 'Failed to load class/period data.');
      }
    } catch (err) {
      console.error('fetchDropdowns error:', err);
      setDropdownError('Network error loading class/period data.');
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const subjectsForClass = assignments.filter((a) => {
    const key = `${a.class_id}|${a.section_id ?? 'null'}`;
    return key === selectedClassKey;
  });

  const selectedClassObj = classOptions.find((c) => c.key === selectedClassKey) || null;

  const canProceed = selectedClassObj && selectedPeriodId && date;

  const handleDownloadStudentList = async () => {
    if (!canProceed) {
      toast.error('Please select date, class and period first.');
      return;
    }
    if (!xlsxLoaded || !window.XLSX) {
      toast.error('Excel library is still loading, please wait.');
      return;
    }

    setDownloadingList(true);
    try {
      const params = new URLSearchParams({ class_id: selectedClassObj.class_id });
      if (selectedClassObj.section_id) params.append('section_id', selectedClassObj.section_id);

      const res = await fetch(`/api/teacher/students-list?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || data.message || 'Failed to fetch student list.');
        return;
      }

      const students = data.paylod.students || [];
      if (students.length === 0) {
        toast.error('No registered students found for this class/section.');
        return;
      }

      const selectedPeriod = periods.find((p) => String(p.id) === String(selectedPeriodId));
      const periodLabel = selectedPeriod ? `${selectedPeriod.name}` : `P${selectedPeriodId}`;

      const rows = [
        ['Registration Number', 'Status (1=Present, 0=Absent, L=Late)', 'Student Name (read-only)']
      ];
      for (const s of students) {
        rows.push([s.registration_number, '', s.student_name]);
      }

      const ws = window.XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 24 }, { wch: 34 }, { wch: 32 }];
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

      const secSuffix = selectedClassObj.section_id ? `_sec${selectedClassObj.section_id}` : '';
      const fileName = `attendance_class${selectedClassObj.class_id}${secSuffix}_${periodLabel}_${date}.xlsx`;
      window.XLSX.writeFile(wb, fileName);
      toast.success(`Downloaded sheet for ${students.length} students.`);
    } catch {
      toast.error('Failed to download student list.');
    } finally {
      setDownloadingList(false);
    }
  };

  // ── Parse uploaded file ───────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      toast.error('Unsupported format. Upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }
    if (!xlsxLoaded || !window.XLSX) {
      toast.error('Excel library is loading, please wait.');
      return;
    }

    setFileName(file.name);
    setImportSummary(null);

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
        const regIdx = headerRow.findIndex(
          (h) => h.includes('reg') || h.includes('number') || h.includes('id')
        );
        const statusIdx = headerRow.findIndex(
          (h) => h.includes('status') || h.includes('absent') || h.includes('present') || h.includes('attend')
        );

        if (regIdx === -1 || statusIdx === -1) {
          toast.error('Cannot detect columns. Ensure headers contain "Registration Number" and "Status".');
          return;
        }

        const records = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;
          const reg = row[regIdx];
          const stat = row[statusIdx];
          if (reg !== undefined && reg !== null && String(reg).trim() !== '') {
            records.push({
              registration_number: String(reg).trim(),
              status: stat !== undefined && stat !== null ? String(stat).trim() : '1',
            });
          }
        }

        if (records.length === 0) {
          toast.error('No registration number records found in the sheet.');
          return;
        }

        setParsedRecords(records);
        toast.success(`Parsed ${records.length} student records from "${file.name}".`);
      } catch {
        toast.error('Failed to parse the spreadsheet.');
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

  // ── Submit parsed records ─────────────────────────────────────────────────
  const handleSaveAttendance = async () => {
    if (!canProceed) {
      toast.error('Please select date, class and period first.');
      return;
    }
    if (parsedRecords.length === 0) {
      toast.error('Please upload and parse an Excel sheet first.');
      return;
    }

    // Determine subject — use first matching subject for selected class
    const subject = subjectsForClass[0];
    if (!subject) {
      toast.error('No subject found for the selected class. Contact the admin.');
      return;
    }

    setSaving(true);
    setImportSummary(null);
    try {
      const res = await fetch('/api/students/attendance/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: selectedClassObj.class_id,
          section_id: selectedClassObj.section_id || null,
          subject_id: subject.subject_id,
          period_id: selectedPeriodId,
          date,
          records: parsedRecords,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        const summary = resData.paylod;
        setImportSummary(summary);
        toast.success(`Registered attendance for ${summary.successCount} student(s).`);
        if (summary.warningCount > 0) {
          toast(`⚠ ${summary.warningCount} unmatched registration number(s). See log below.`);
        }
        if (summary.warningCount === 0) {
          setParsedRecords([]);
          setFileName('');
        }
      } else {
        toast.error(resData.error || resData.message || 'Failed to import attendance.');
      }
    } catch {
      toast.error('An error occurred during submission.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status).trim().toLowerCase();
    if (s === '0' || s === 'absent' || s === 'a')
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600">Absent</span>;
    if (s === '1' || s === 'present' || s === 'p')
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">Present</span>;
    if (s === 'late' || s === 'l')
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600">Late</span>;
    return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-500">{status}</span>;
  };

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* ── STEP 1 + 2: Date + Class + Period ────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col gap-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 1 — Set Date &amp; Period</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiCalendar className="text-xs" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Class / Section */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiBook className="text-xs" /> Class
              {dayName && (
                <span className="ml-auto px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold rounded-lg border border-indigo-100">
                  {dayName}
                </span>
              )}
            </label>
            <select
              value={selectedClassKey}
              onChange={(e) => {
                setSelectedClassKey(e.target.value);
                setSelectedPeriodId('');
                setParsedRecords([]);
                setFileName('');
                setImportSummary(null);
              }}
              disabled={loadingDropdowns || classOptions.length === 0}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors disabled:opacity-60"
            >
              <option value="">
                {loadingDropdowns
                  ? 'Loading...'
                  : classOptions.length === 0
                  ? '— No assigned classes —'
                  : '— Select Class —'}
              </option>
              {classOptions.map((c) => (
                <option key={c.key} value={c.key}>
                  Class {c.class_name}{c.section_name ? ` · Sec ${c.section_name}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiClock className="text-xs" /> Period
              {!loadingDropdowns && periods.length > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-indigo-50 text-indigo-650 text-[10px] font-extrabold rounded-lg border border-indigo-100">
                  {periods.length} system periods
                </span>
              )}
            </label>
            <select
              value={selectedPeriodId}
              onChange={(e) => {
                setSelectedPeriodId(e.target.value);
                setParsedRecords([]);
                setFileName('');
                setImportSummary(null);
              }}
              disabled={loadingDropdowns || periods.length === 0}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors disabled:opacity-60"
            >
              <option value="">
                {loadingDropdowns
                  ? 'Loading periods...'
                  : periods.length === 0
                  ? '— No periods defined —'
                  : '— Select Period —'}
              </option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.start_time} – {p.end_time})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Error message */}
        {dropdownError && !loadingDropdowns && (
          <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
            <FiInfo className="text-sm shrink-0" /> {dropdownError}
          </p>
        )}
      </div>

      {/* ── Info badges ────────────────────────────────────────────────────── */}
      {canProceed && (
        <div className="flex flex-wrap gap-2.5 -mt-4">
          {selectedClassObj && (
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-xl border border-indigo-100">
              🏫 Class {selectedClassObj.class_name}{selectedClassObj.section_name ? ` · Sec ${selectedClassObj.section_name}` : ''}
            </span>
          )}
          {selectedPeriodId && (() => {
            const p = periods.find((x) => String(x.id) === String(selectedPeriodId));
            return p ? (
              <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100">
                ⏱ {p.name} · {p.start_time} – {p.end_time}
              </span>
            ) : null;
          })()}
          <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100">
            📅 {date} ({dayName})
          </span>
        </div>
      )}

      {/* ── STEP 2: Download + Upload ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: instructions + dropzone */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Download button */}
          <button
            onClick={handleDownloadStudentList}
            disabled={!canProceed || downloadingList}
            className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <FiDownload className="text-base" />
            <span>{downloadingList ? 'Downloading...' : 'Download Student List (.xlsx)'}</span>
          </button>

          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 min-h-[200px] text-center bg-white ${
              dragActive ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl mb-4">
              <FiUploadCloud className="text-3xl" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">
              {fileName ? 'Change File' : 'Upload Filled Sheet'}
            </h3>
            <p className="text-slate-400 text-xs font-semibold max-w-[200px]">
              Drag &amp; drop Excel / CSV or click to browse
            </p>
            {fileName && (
              <span className="mt-4 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold truncate max-w-full">
                {fileName}
              </span>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <FiInfo className="text-base text-amber-700 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs">
              <h4 className="font-bold text-amber-800">How to use</h4>
              <p className="leading-relaxed font-medium text-amber-700">
                1. Select the date, class &amp; period above.<br />
                2. Click <strong>Download Student List</strong> to get the Excel template.<br />
                3. Fill the <strong>Status</strong> column: <strong>1</strong> = Present, <strong>0</strong> = Absent, <strong>L</strong> = Late.<br />
                4. Upload the filled file and click <strong>Register Attendance</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right: preview / summary */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Preview table */}
          {parsedRecords.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Sheet Preview</h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    {parsedRecords.length} records parsed — review before registering.
                  </p>
                </div>
                <button
                  onClick={handleSaveAttendance}
                  disabled={saving || !canProceed}
                  className="flex items-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  <FiCheck className="text-sm" />
                  <span>{saving ? 'Registering...' : 'Register Attendance'}</span>
                </button>
              </div>

              <div className="overflow-x-auto w-full max-h-[340px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">#</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Registration No.</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Raw Value</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Mapped Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRecords.map((record, index) => (
                      <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 text-xs font-bold text-slate-400 pl-2">{index + 1}</td>
                        <td className="py-3 text-sm font-bold text-slate-800">{record.registration_number}</td>
                        <td className="py-3 text-xs font-semibold text-slate-500">{record.status}</td>
                        <td className="py-3 text-center">{getStatusBadge(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state */}
          {parsedRecords.length === 0 && !importSummary && (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4 animate-bounce">
                <FiFileText className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Upload Attendance Sheet</h3>
              <p className="text-slate-400 text-xs font-medium max-w-xs">
                Select date, class and period → download the template → fill statuses → upload here.
              </p>
            </div>
          )}

          {/* Import summary */}
          {importSummary && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <FiCheck className="text-emerald-500 text-lg" /> Upload Execution Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Imported</span>
                  <span className="text-2xl font-black text-emerald-700">{importSummary.successCount}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Warnings</span>
                  <span className={`text-2xl font-black ${importSummary.warningCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {importSummary.warningCount}
                  </span>
                </div>
              </div>

              {importSummary.warnings?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <FiAlertCircle className="text-sm" /> Unmatched Registrations
                  </h4>
                  <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl max-h-[140px] overflow-y-auto flex flex-col gap-1.5">
                    {importSummary.warnings.map((w, i) => (
                      <p key={i} className="text-xs font-semibold text-amber-800/80 leading-relaxed">• {w}</p>
                    ))}
                  </div>
                </div>
              )}

              {importSummary.savedRecords?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <FiLayers className="text-sm" /> Registered Students
                  </h4>
                  <div className="overflow-x-auto w-full max-h-[220px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                          <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration</th>
                          <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importSummary.savedRecords.map((rec, i) => (
                          <tr key={i} className="border-b border-slate-50">
                            <td className="py-2 text-xs font-bold text-slate-800">{rec.student_name}</td>
                            <td className="py-2 text-xs font-medium text-slate-500">{rec.registration_number}</td>
                            <td className="py-2 text-center">{getStatusBadge(rec.status)}</td>
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
    </div>
  );
};

export default ExcelAttendanceForm;
