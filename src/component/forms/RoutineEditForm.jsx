'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit3, FiClock, FiMapPin, FiBook, FiUser, FiLayers } from 'react-icons/fi';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const RoutineEditForm = ({ routine, onSuccess, onCancel }) => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [classId, setClassId] = useState(routine.class_id ? routine.class_id.toString() : '');
  const [sectionId, setSectionId] = useState(routine.section_id ? routine.section_id.toString() : '');
  const [subjectId, setSubjectId] = useState(routine.subject_id ? routine.subject_id.toString() : '');
  const [teacherId, setTeacherId] = useState(routine.teacher_id ? routine.teacher_id.toString() : '');
  const [dayOfWeek, setDayOfWeek] = useState(routine.day_of_week || 'Sunday');
  const [startTime, setStartTime] = useState(routine.start_time || '09:00');
  const [endTime, setEndTime] = useState(routine.end_time || '10:00');
  const [roomNumber, setRoomNumber] = useState(routine.room_number || '');

  const [loadingLists, setLoadingLists] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load classes, subjects, teachers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes, teachersRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/subjects'),
          fetch('/api/teachers'),
        ]);

        const classesData = await classesRes.json();
        const subjectsData = await subjectsRes.json();
        const teachersData = await teachersRes.json();

        setClasses(classesData.paylod.classes || []);
        setSubjects(subjectsData.paylod.subjects || []);
        setTeachers(teachersData.paylod.teachers || []);
      } catch (err) {
        toast.error('Failed to load lookup data.');
      } finally {
        setLoadingLists(false);
      }
    };
    fetchData();
  }, []);

  // Fetch sections based on class selection
  useEffect(() => {
    if (!classId) {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      try {
        const res = await fetch(`/api/sections?class_id=${classId}`);
        const data = await res.json();
        setSections(data.paylod.sections || []);
      } catch (err) {
        toast.error('Failed to fetch sections.');
      }
    };
    fetchSections();
  }, [classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId || !sectionId || !subjectId || !dayOfWeek || !startTime || !endTime) {
      toast.error('Required fields are missing.');
      return;
    }

    if (startTime >= endTime) {
      toast.error('Start time must be strictly before end time.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/class-routines/${routine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          section_id: sectionId,
          subject_id: subjectId,
          teacher_id: teacherId || null,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          room_number: roomNumber || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update routine entry.');
      }

      toast.success(data.message || 'Routine entry updated successfully!');
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
        <FiEdit3 className="text-blue-600" /> Edit Class Routine Entry
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

          {/* Start Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiClock className="text-slate-400" /> Start Time (24h)
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            />
          </div>

          {/* End Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FiClock className="text-slate-400" /> End Time (24h)
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            />
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
              className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-905 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-150 cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? 'Updating...' : 'Update Routine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoutineEditForm;
