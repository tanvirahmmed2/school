'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiPlus, FiTrash2, FiClock, FiMapPin, FiLayers, FiBook } from 'react-icons/fi';

const ExamCreateForm = ({ examId, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [term, setTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [classId, setClassId] = useState('');
  const [examFee, setExamFee] = useState('0');

  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // Fetch initial classes and subjects, and load exam details if in edit mode
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          axios.get('/api/classes'),
          axios.get('/api/subjects'),
        ]);
        setClasses(classesRes.data.paylod.classes || []);
        setSubjects(subjectsRes.data.paylod.subjects || []);

        if (examId) {
          const examRes = await axios.get(`/api/exams/${examId}`);
          const { exam, schedules: loadedSchedules } = examRes.data.paylod;
          if (exam) {
            setName(exam.name);
            setTerm(exam.term || '');
            // format date string for HTML date input (YYYY-MM-DD)
            setStartDate(new Date(exam.start_date).toISOString().split('T')[0]);
            setEndDate(new Date(exam.end_date).toISOString().split('T')[0]);
            setStatus(exam.status);
            setClassId(exam.class_id ? exam.class_id.toString() : '');
            setExamFee(exam.exam_fee ? exam.exam_fee.toString() : '0');
          }
          if (loadedSchedules) {
            setSchedules(
              loadedSchedules.map((s) => ({
                id: s.id,
                class_id: s.class_id,
                subject_id: s.subject_id,
                exam_date: new Date(s.exam_date).toISOString().split('T')[0],
                start_time: s.start_time,
                end_time: s.end_time,
                room_number: s.room_number || '',
              }))
            );
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.error || err.message || 'Failed to load form dependencies.');
      } finally {
        setFetchingData(false);
      }
    };

    loadInitialData();
  }, [examId]);

  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      {
        class_id: classes[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        exam_date: startDate || new Date().toISOString().split('T')[0],
        start_time: '10:00 AM',
        end_time: '01:00 PM',
        room_number: '',
      },
    ]);
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index, field, value) => {
    setSchedules(
      schedules.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || !status || !classId) {
      toast.error('Name, class, start date, end date, and status are required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        term,
        start_date: startDate,
        end_date: endDate,
        status,
        class_id: classId,
        exam_fee: examFee,
        schedules,
      };

      if (examId) {
        await axios.put(`/api/exams/${examId}`, payload);
        toast.success('Exam and schedules updated successfully!');
      } else {
        await axios.post('/api/exams', payload);
        toast.success('Exam routine created successfully!');
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading form parameters...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
        <FiCalendar className="text-blue-600" /> {examId ? 'Edit Exam Routine' : 'Create New Exam Routine'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Core Exam Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Exam Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midterm Evaluation Exam - 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Academic Term / Session
            </label>
            <input
              type="text"
              placeholder="e.g. First Term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Routine Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 cursor-pointer"
            >
              <option value="upcoming">Upcoming Exam</option>
              <option value="current">Current Active Exam</option>
              <option value="previous">Previous Past Exam</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Target Class
            </label>
            <select
              required
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 cursor-pointer"
            >
              <option value="">Select class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Exam Fee (BDT)
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="e.g. 500"
              value={examFee}
              onChange={(e) => setExamFee(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              End Date
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
            />
          </div>
        </div>

        {/* Schedules Routine Section */}
        <div className="flex flex-col gap-4 border-t border-slate-50 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Subject Exam Schedules</h3>
              <p className="text-xs text-slate-400">Map exam subjects, timings, and rooms to different classes.</p>
            </div>
            <button
              type="button"
              onClick={handleAddSchedule}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer"
            >
              <FiPlus /> Add Subject Schedule
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-xs text-slate-400">No subject routines mapped to this exam yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {schedules.map((schedule, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end p-4 border border-slate-100 rounded-2xl bg-slate-50/30">
                  
                  {/* Class Selection */}
                  <div className="flex flex-col gap-1.5 md:col-span-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <FiLayers /> Class
                    </label>
                    <select
                      value={schedule.class_id}
                      onChange={(e) => handleScheduleChange(index, 'class_id', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Selection */}
                  <div className="flex flex-col gap-1.5 md:col-span-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <FiBook /> Subject
                    </label>
                    <select
                      value={schedule.subject_id}
                      onChange={(e) => handleScheduleChange(index, 'subject_id', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Exam Date */}
                  <div className="flex flex-col gap-1.5 md:col-span-1.2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={schedule.exam_date}
                      onChange={(e) => handleScheduleChange(index, 'exam_date', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>

                  {/* Timings */}
                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <FiClock /> Start
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="10:00 AM"
                      value={schedule.start_time}
                      onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <FiClock /> End
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="01:00 PM"
                      value={schedule.end_time}
                      onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>

                  {/* Room Number */}
                  <div className="flex flex-col gap-1.5 md:col-span-0.8">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <FiMapPin /> Room
                    </label>
                    <input
                      type="text"
                      placeholder="Room 101"
                      value={schedule.room_number}
                      onChange={(e) => handleScheduleChange(index, 'room_number', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="text-right md:col-span-0.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(index)}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-650 text-red-600 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                      title="Remove routine item"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-50 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              examId ? 'Update Routine' : 'Create Routine'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamCreateForm;
