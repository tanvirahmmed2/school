'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiAward, FiSave, FiLayers, FiInfo } from 'react-icons/fi';

const MarksEntryPage = () => {
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

          setExams(examsData.exams || []);
          setClasses(classesData.classes || []);
          setSubjects(subjectsData.subjects || []);
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
          setSections(data.sections || []);
        }
      } catch (err) {
        console.error('Failed to load sections:', err);
      }
    };
    fetchSections();
  }, [classId]);

  // Load student list for marks entry
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
        setStudents(data.students || []);
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
        marks_obtained: s.marks_obtained ? parseFloat(s.marks_obtained) : 0,
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

  // Filter subjects assigned to the selected class
  const filteredSubjects = subjects.filter((s) => String(s.class_id) === String(classId));

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Student Marks Evaluation</h1>
        <p className="text-slate-500 text-sm font-medium">Record and update student exam marks for assigned classes and subjects.</p>
      </div>

      {/* Selectors Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Exam</label>
          <select
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            disabled={loadingDropdowns}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">-- Choose Exam --</option>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>{e.name} ({e.term})</option>
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
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
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
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
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
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">-- Choose Subject --</option>
            {filteredSubjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLoadStudents}
          disabled={!examId || !classId || !subjectId || loadingStudents}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-sm font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer h-[46px]"
        >
          {loadingStudents ? 'Loading...' : 'Load Students'}
        </button>
      </div>

      {/* Marks Sheet Table */}
      {students.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiLayers className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">Load Marks Sheet</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">Select exam and class/subject parameters, and load the students roll sheet to record marks.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-800">Grades Ledger Sheet</h2>
            <button
              onClick={handleSaveMarks}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
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
                        value={s.marks_obtained !== null && s.marks_obtained !== undefined ? s.marks_obtained : ''}
                        onChange={(e) => handleMarkChange(s.student_id, e.target.value)}
                        placeholder="e.g. 85"
                        className="w-24 mx-auto p-2 bg-slate-50 border border-slate-100 rounded-xl text-center text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </td>
                    <td className="py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={s.total_marks !== null && s.total_marks !== undefined ? s.total_marks : 100}
                        onChange={(e) => handleTotalMarkChange(s.student_id, e.target.value)}
                        placeholder="e.g. 100"
                        className="w-24 mx-auto p-2 bg-slate-50 border border-slate-100 rounded-xl text-center text-sm font-bold text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        value={s.remarks || ''}
                        onChange={(e) => handleRemarksChange(s.student_id, e.target.value)}
                        placeholder="e.g. Excellent work"
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

export default MarksEntryPage;
