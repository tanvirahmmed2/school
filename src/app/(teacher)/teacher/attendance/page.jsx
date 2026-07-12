'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiCheck, FiSave, FiLayers, FiInfo } from 'react-icons/fi';

const AttendanceRegistryPage = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch classes initially
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          setClasses(data.paylod.classes || []);
        }
      } catch (err) {
        console.error('Failed to load classes:', err);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchClasses();
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
          setSections(data.paylod.sections || []);
        }
      } catch (err) {
        console.error('Failed to load sections:', err);
      }
    };
    fetchSections();
  }, [classId]);

  // Fetch student roll list
  const handleLoadSheet = async () => {
    if (!classId || !sectionId || !date) {
      toast.error('Please select class, section, and date.');
      return;
    }

    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/students/attendance?class_id=${classId}&section_id=${sectionId}&date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.attendanceSheet || []);
        toast.success('Attendance sheet loaded.');
      } else {
        toast.error('Failed to load sheet.');
      }
    } catch (err) {
      toast.error('An error occurred loading the sheet.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, status } : s))
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, remarks } : s))
    );
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) return;

    setSaving(true);
    try {
      const records = students.map((s) => ({
        student_id: s.student_id,
        status: s.status,
        remarks: s.remarks
      }));

      const res = await fetch('/api/students/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          section_id: sectionId,
          date,
          records
        })
      });

      if (res.ok) {
        toast.success('Attendance sheet saved successfully!');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save attendance.');
      }
    } catch (err) {
      toast.error('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Student Attendance Registry</h1>
        <p className="text-slate-500 text-sm font-medium">Record student attendance sheets by class level and date.</p>
      </div>

      {/* Selectors Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Class</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            disabled={loadingDropdowns}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">-- Choose Class --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Section</label>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            disabled={!classId}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">-- Choose Section --</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <button
          onClick={handleLoadSheet}
          disabled={!classId || !sectionId || loadingStudents}
          className="w-full md:w-auto px-6 py-3 bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-sm font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer"
        >
          {loadingStudents ? 'Loading...' : 'Load Sheet'}
        </button>
      </div>

      {/* Attendance Registry List */}
      {students.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiLayers className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">Load Attendance Sheet</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">Select class details and load the list of students to register attendance.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-800">Roll Call Registry</h2>
            <button
              onClick={handleSaveAttendance}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              <FiSave className="text-sm" />
              <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4">
                      <p className="text-sm font-bold text-slate-800">{student.student_name}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reg: {student.registration_number}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-1">
                        {['Present', 'Absent', 'Late', 'Half Day'].map((status) => {
                          const isSelected = student.status === status;
                          let theme = 'border-slate-200 text-slate-500 hover:border-slate-300';
                          if (isSelected) {
                            if (status === 'Present') theme = 'bg-emerald-600 border-emerald-600 text-white';
                            if (status === 'Absent') theme = 'bg-rose-600 border-rose-600 text-white';
                            if (status === 'Late') theme = 'bg-amber-500 border-amber-500 text-white';
                            if (status === 'Half Day') theme = 'bg-indigo-650 bg-indigo-600 border-indigo-600 text-white';
                          }

                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(student.student_id, status)}
                              className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${theme}`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        value={student.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.student_id, e.target.value)}
                        placeholder="Add optional remarks..."
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRegistryPage;
