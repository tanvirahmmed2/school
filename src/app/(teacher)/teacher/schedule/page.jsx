'use client';

import React, { useEffect, useState } from 'react';
import { FiClock, FiBook, FiMapPin, FiInfo, FiLayers } from 'react-icons/fi';

const SchedulePage = () => {
  const [routine, setRoutine] = useState([]);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [activeTab, setActiveTab] = useState(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return daysOfWeek.includes(today) ? today : 'Monday';
  });


  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch('/api/teacher/schedule');
        if (res.ok) {
          const data = await res.json();
          setRoutine(data.paylod.routine || []);
        }
      } catch (error) {
        console.error('Error fetching routine:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-650 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const dailyClasses = routine.filter((r) => r.day_of_week?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">My Class Schedule</h1>
        <p className="text-slate-500 text-sm font-medium">View your daily routine schedules, classes, and room numbers.</p>
      </div>

      {/* Weekday Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
        {daysOfWeek.map((day) => {
          const count = routine.filter((r) => r.day_of_week === day).length;
          const isActive = activeTab === day;
          return (
            <button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-200 hover:text-slate-800'
              }`}
            >
              {day} {count > 0 && <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Routine list */}
      {dailyClasses.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Classes Scheduled</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">You have no classes scheduled to teach on {activeTab}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dailyClasses.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-fit mb-4">
                  <FiClock />
                  <span>{item.start_time} - {item.end_time}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{item.subject_name}</h3>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-4">Code: {item.subject_code}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <FiLayers className="text-slate-400 text-sm" />
                  <span>Class: {item.class_name} • Section: {item.section_name}</span>
                </div>
                {item.room_number && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <FiMapPin className="text-slate-400 text-sm" />
                    <span>Room Number: {item.room_number}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
