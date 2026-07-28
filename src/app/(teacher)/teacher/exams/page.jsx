'use client';

import React, { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiInfo, FiBook, FiLayers } from 'react-icons/fi';

const TeacherExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/teacher/exams');
        if (res.ok) {
          const data = await res.json();
          const payload = data.paylod || {};
          setExams(payload.exams || []);
          setSchedules(payload.schedules || []);
        }
      } catch (error) {
        console.error('Error fetching teacher exam routines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-primary-light border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredExams = selectedStatus === 'all' 
    ? exams 
    : exams.filter(e => e.status === selectedStatus);

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <FiCalendar className="text-primary" /> Examination Routines
          </h1>
          <p className="text-slate-500 text-sm font-medium">View upcoming, active, and completed school exam routines and schedules.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-white border border-slate-100 p-1.5 rounded-2xl">
          {['all', 'current', 'upcoming', 'previous'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Examination Routines Found</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">There are no exam routines currently categorized under "{selectedStatus}".</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredExams.map((exam) => {
            const examSchedules = schedules.filter(s => s.exam_id === exam.id);
            const startStr = new Date(exam.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            const endStr = new Date(exam.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div key={exam.id} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{exam.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      {exam.term && (
                        <span className="text-xs font-bold text-primary bg-primary-light border border-primary-light px-2.5 py-0.5 rounded-full">
                          Term: {exam.term}
                        </span>
                      )}
                      {exam.class_name && (
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Class: {exam.class_name}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        Timeline: <strong>{startStr}</strong> – <strong>{endStr}</strong>
                      </span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize w-fit ${
                    exam.status === 'current'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : exam.status === 'upcoming'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {exam.status}
                  </span>
                </div>

                {/* Schedules Table */}
                {examSchedules.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No timetable entries mapped for this exam routine yet.</p>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Class</th>
                          <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                          <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timing</th>
                          <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {examSchedules.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                              {new Date(row.exam_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                              <span className="inline-flex items-center gap-1">
                                <FiLayers className="text-slate-400" /> {row.class_name}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-xs font-bold text-slate-800 inline-flex items-center gap-1">
                                <FiBook className="text-slate-400" /> {row.subject_name}
                              </p>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Code: {row.subject_code}</span>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                              <span className="inline-flex items-center gap-1"><FiClock className="text-slate-400" /> {row.start_time} - {row.end_time}</span>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px]">
                                <FiMapPin className="text-[10px]" /> Room {row.room_number || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherExamsPage;
