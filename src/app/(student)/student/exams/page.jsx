'use client';

import React, { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiInfo } from 'react-icons/fi';

const ExamsPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/student/exams');
        if (res.ok) {
          const data = await res.json();
          setSchedules(data.examSchedules || []);
        }
      } catch (error) {
        console.error('Error fetching exam schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Group schedules by exam name
  const examsMap = {};
  schedules.forEach((item) => {
    const key = `${item.exam_name} (${item.exam_term})`;
    if (!examsMap[key]) {
      examsMap[key] = {
        name: item.exam_name,
        term: item.exam_term,
        status: item.exam_status,
        schedules: []
      };
    }
    examsMap[key].schedules.push(item);
  });

  const examGroups = Object.values(examsMap);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Exam Routine</h1>
        <p className="text-slate-500 text-sm font-medium">Verify schedules and exam locations for current and upcoming terms.</p>
      </div>

      {examGroups.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Exams Scheduled</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">There are no upcoming exams listed for your class at this moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {examGroups.map((group, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{group.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Term: {group.term}</p>
                    {group.schedules[0]?.exam_fee !== undefined && parseFloat(group.schedules[0].exam_fee) > 0 && (
                      <span className="font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                        Fee: {parseFloat(group.schedules[0].exam_fee).toFixed(2)} BDT
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  group.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}>
                  {group.status}
                </span>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Timing</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Room Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.schedules.map((row) => (
                      <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="py-4 text-sm font-semibold text-slate-700">
                          {new Date(row.exam_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4">
                          <p className="text-sm font-bold text-slate-800">{row.subject_name}</p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Code: {row.subject_code}</span>
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-600">
                          <span className="inline-flex items-center gap-1"><FiClock /> {row.start_time} - {row.end_time}</span>
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-600">
                          <span className="inline-flex items-center gap-1"><FiMapPin /> Room {row.room_number || 'TBA'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamsPage;
