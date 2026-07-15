'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiClock, FiLayers } from 'react-icons/fi';
import RoutineCreateForm from '@/component/forms/RoutineCreateForm';
import RoutineEditForm from '@/component/forms/RoutineEditForm';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const AdminClassRoutinePage = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setClasses(data.paylod.classes || []);
      } catch (err) {
        toast.error('Failed to retrieve academic classes.');
      }
    };
    fetchClasses();
  }, []);

  // Fetch sections when selectedClassId changes
  useEffect(() => {
    if (!selectedClassId) {
      setSections([]);
      setSelectedSectionId('');
      setRoutines([]);
      return;
    }

    const fetchSections = async () => {
      try {
        const response = await fetch(`/api/sections?class_id=${selectedClassId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setSections(data.paylod.sections || []);
        if (data.paylod.sections?.length > 0) {
          setSelectedSectionId(data.paylod.sections[0].id.toString());
        } else {
          setSelectedSectionId('');
          setRoutines([]);
        }
      } catch (err) {
        toast.error('Failed to retrieve class sections.');
      }
    };
    fetchSections();
  }, [selectedClassId]);

  // Fetch routines when class and section are selected
  const fetchRoutines = async () => {
    if (!selectedClassId || !selectedSectionId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/class-routines?class_id=${selectedClassId}&section_id=${selectedSectionId}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRoutines(data.paylod.routines || []);
    } catch (err) {
      toast.error('Failed to load routine timetables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [selectedClassId, selectedSectionId]);

  const handleDeleteRoutine = async (id, subjectName, day, start, end) => {
    const confirm = window.confirm(
      `Are you sure you want to delete the schedule for "${subjectName}" on ${day} (${start} - ${end})?`
    );
    if (!confirm) return;

    try {
      const response = await fetch(`/api/class-routines/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete routine.');
      }

      toast.success(data.message || 'Routine entry deleted successfully!');
      fetchRoutines();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStartEdit = (routine) => {
    setEditingRoutine(routine);
    setShowAddForm(false);
  };

  // Group routines by Day
  const groupedRoutines = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = routines.filter((r) => r.day_of_week === day);
    return acc;
  }, {});

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiClock className="text-blue-600" /> Class Routine Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure day-to-day timetable routine schedules for classes and sections.
          </p>
        </div>

        {selectedClassId && selectedSectionId && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingRoutine(null);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
          >
            {showAddForm ? (
              <>
                <FiX className="text-lg" /> Close Form
              </>
            ) : (
              <>
                <FiPlus className="text-lg" /> Add Routine Slot
              </>
            )}
          </button>
        )}
      </div>

      {/* Selectors card */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FiLayers /> Select Academic Class
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 cursor-pointer"
          >
            <option value="">Select a class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.code})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FiLayers /> Select Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            disabled={!selectedClassId}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 cursor-pointer disabled:opacity-60"
          >
            <option value="">Select a section...</option>
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Forms */}
      {showAddForm && !editingRoutine && (
        <RoutineCreateForm
          initialClassId={selectedClassId}
          initialSectionId={selectedSectionId}
          onSuccess={() => {
            fetchRoutines();
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingRoutine && (
        <RoutineEditForm
          routine={editingRoutine}
          onSuccess={() => {
            fetchRoutines();
            setEditingRoutine(null);
          }}
          onCancel={() => setEditingRoutine(null)}
        />
      )}

      {/* Timetable Grid View */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden p-6 md:p-8">
        <h2 className="text-base font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
          📅 Day-to-Day Routine Schedule
        </h2>

        {!selectedClassId || !selectedSectionId ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-6xl mb-4">📅</span>
            <h3 className="text-sm font-bold text-slate-600">No Target Specified</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              Select an academic class and section from the selectors above to view and construct the routine schedule.
            </p>
          </div>
        ) : loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading schedule routines...</span>
          </div>
        ) : routines.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-6xl mb-4">🔔</span>
            <h3 className="text-sm font-bold text-slate-600">Routine Grid Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              There are no classes mapped on the timetable yet for the selected section. Click the add button to define timeslots.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {DAYS_OF_WEEK.map((day) => {
              const daySlots = groupedRoutines[day];
              if (daySlots.length === 0) return null;

              return (
                <div key={day} className="flex flex-col md:flex-row gap-4 border-b border-slate-100/70 pb-5 last:border-0 last:pb-0">
                  {/* Day column label */}
                  <div className="w-full md:w-32 flex-shrink-0 flex items-center">
                    <span className="inline-flex px-3 py-1.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl">
                      {day}
                    </span>
                  </div>

                  {/* Slots list */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200/80 p-4.5 rounded-2xl flex flex-col justify-between gap-3.5 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100/50 relative group"
                      >
                        {/* Action buttons (hover) */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleStartEdit(slot)}
                            className="p-1.5 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-100 rounded-lg shadow-xs transition-colors duration-150 cursor-pointer"
                            title="Edit Slot"
                          >
                            <FiEdit2 className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoutine(slot.id, slot.subject_name, slot.day_of_week, slot.start_time, slot.end_time)}
                            className="p-1.5 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-100 rounded-lg shadow-xs transition-colors duration-150 cursor-pointer"
                            title="Delete Slot"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>

                        <div>
                          {/* Subject Code & Name */}
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-md">
                            {slot.subject_code}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800 mt-2 pr-12">
                            {slot.subject_name}
                          </h4>

                          {/* Time Slots */}
                          <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                            <FiClock className="text-slate-400" /> {slot.period_name ? `${slot.period_name}: ` : ''}{slot.start_time} — {slot.end_time}
                          </p>
                        </div>

                        {/* Teacher & Room info */}
                        <div className="flex items-center justify-between border-t border-slate-100/80 pt-2.5 text-[11px] font-semibold text-slate-400">
                          <span className="truncate max-w-[120px]">
                            👤 {slot.teacher_name || 'Unassigned'}
                          </span>
                          <span>
                            📍 {slot.room_number ? `Room ${slot.room_number}` : 'No Room'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClassRoutinePage;
