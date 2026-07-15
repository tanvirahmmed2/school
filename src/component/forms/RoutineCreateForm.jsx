'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlusCircle, FiClock, FiMapPin, FiBook, FiUser, FiLayers } from 'react-icons/fi';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const RoutineCreateForm = ({ initialClassId = '', initialSectionId = '', onSuccess, onCancel }) => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [classId, setClassId] = useState(initialClassId);
  const [sectionId, setSectionId] = useState(initialSectionId);
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Sunday');
  const [periodId, setPeriodId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const [loadingLists, setLoadingLists] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load initial dropdown data (classes, subjects, teachers, periods)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes, teachersRes, periodsRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/subjects'),
          fetch('/api/teachers'),
          fetch('/api/periods'),
        ]);

        const classesData = await classesRes.json();
        const subjectsData = await subjectsRes.json();
        const teachersData = await teachersRes.json();
        const periodsData = await periodsRes.json();

        setClasses(classesData.paylod?.classes || []);
        setSubjects(subjectsData.paylod?.subjects || []);
        setTeachers(teachersData.paylod?.teachers || []);
        setPeriods(periodsData.paylod?.periods || []);
      } catch (err) {
        toast.error('Failed to load form lookup data.');
      } finally {
        setLoadingLists(false);
      }
    };
    fetchData();
  }, []);

  // Fetch sections when classId changes
  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId('');
      return;
    }

    const fetchSections = async () => {
      try {
        const res = await fetch(`/api/sections?class_id=${classId}`);
        const data = await res.json();
        setSections(data.paylod?.sections || []);
        if (data.paylod?.sections?.length > 0) {
          if (initialClassId === classId && initialSectionId) {
            setSectionId(initialSectionId);
          } else {
            setSectionId(data.paylod.sections[0].id.toString());
          }
        } else {
          setSectionId('');
        }
      } catch (err) {
        toast.error('Failed to load sections for class.');
      }
    };
    fetchSections();
  }, [classId, initialClassId, initialSectionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId || !sectionId || !subjectId || !dayOfWeek || !periodId) {
      toast.error('All fields except teacher and room number are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/class-routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          section_id: sectionId,
          subject_id: subjectId,
          teacher_id: teacherId || null,
          day_of_week: dayOfWeek,
          period_id: periodId,
          room_number: roomNumber || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create routine entry.');
      }

      toast.success(data.message || 'Routine entry added successfully!');
      // Reset non-structural fields
      setRoomNumber('');
      setSubjectId('');
      setTeacherId('');
      setPeriodId('');

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingLists) {
    return (
      <div className="w-full bg-white border border-slate-100 rounded-3xl p-8 flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading form options...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <FiPlusCircle className="text-blue-600" /> Create Class Routine Entry
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Day of Week */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiClock className="text-slate-400" /> Day of Week
            </label>
            <select
              required
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Class selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiLayers className="text-slate-400" /> Class
            </label>
            <select
              required
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            >
              <option value="">Select Class...</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiLayers className="text-slate-400" /> Section
            </label>
            <select
              required
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              disabled={submitting || !classId}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50 disabled:opacity-60"
            >
              <option value="">Select Section...</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiBook className="text-slate-400" /> Subject
            </label>
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            >
              <option value="">Select Subject...</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Teacher selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiUser className="text-slate-400" /> Teacher
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            >
              <option value="">Unassigned (None)...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selection */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiClock className="text-slate-400" /> Routine Period *
            </label>
            <select
              required
              value={periodId}
              onChange={(e) => setPeriodId(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            >
              <option value="">Select Period Slot...</option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.start_time} - {p.end_time})
                </option>
              ))}
            </select>
          </div>

          {/* Room Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiMapPin className="text-slate-400" /> Room Number
            </label>
            <input
              type="text"
              placeholder="e.g. Room 102"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-55 text-slate-655 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-60 text-slate-600 bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-150 cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Save Routine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoutineCreateForm;
