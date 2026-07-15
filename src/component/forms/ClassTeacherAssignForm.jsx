'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiFolderPlus, FiLayers, FiGrid, FiUserCheck, FiCalendar } from 'react-icons/fi';

const ClassTeacherAssignForm = ({ classes, teachers, onSuccess, onCancel }) => {
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [academicYear, setAcademicYear] = useState('2026');
  const [submitting, setSubmitting] = useState(false);

  const [filteredSections, setFilteredSections] = useState([]);

  // Fetch sections dynamically based on selected class
  useEffect(() => {
    if (classId) {
      fetch(`/api/sections?class_id=${classId}`)
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setFilteredSections(data.paylod?.sections || []);
        })
        .catch(() => {
          setFilteredSections([]);
        });
    } else {
      setFilteredSections([]);
      setSectionId('');
    }
  }, [classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId || !teacherId || !academicYear) {
      toast.error('Class, Teacher, and Academic Year are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/teacher-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          section_id: sectionId || null,
          teacher_id: teacherId,
          academic_year: academicYear.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign class teacher.');
      }

      toast.success(data.message || 'Class teacher assigned successfully!');
      setClassId('');
      setSectionId('');
      setTeacherId('');
      setAcademicYear('2026');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FiFolderPlus className="text-blue-600" /> Assign Class Teacher
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {/* Class Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FiLayers className="text-slate-400" /> Class *
          </label>
          <select
            required
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          >
            <option value="">Select a class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FiGrid className="text-slate-400" /> Section (Optional)
          </label>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            disabled={submitting || !classId}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50 disabled:opacity-60"
          >
            <option value="">Select a section...</option>
            {filteredSections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned Teacher */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FiUserCheck className="text-slate-400" /> Class Teacher *
          </label>
          <select
            required
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          >
            <option value="">Assign a teacher...</option>
            {teachers.map((teach) => (
              <option key={teach.id} value={teach.id}>
                {teach.name}
              </option>
            ))}
          </select>
        </div>

        {/* Academic Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FiCalendar className="text-slate-400" /> Academic Year *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 2026"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
          />
        </div>

        <div className="flex justify-end gap-3 md:col-span-4 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Assign Class Teacher'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassTeacherAssignForm;
