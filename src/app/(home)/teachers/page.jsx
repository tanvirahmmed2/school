'use client';

import React, { useEffect, useState } from 'react';
import { FiMail, FiPhone, FiUser } from 'react-icons/fi';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/teachers');
        if (res.ok) {
          const data = await res.json();
          setTeachers(data.paylod.teachers || []);
        }
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Academic Faculty
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Meet Our Expert Faculty
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Our professors, researchers, and technical lecturers guide student training with rich research experience.
          </p>
        </div>

        {/* Loading / Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs animate-pulse flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
                <div className="w-32 h-3 bg-slate-200 rounded"></div>
                <div className="w-full h-8 bg-slate-200 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : teachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all duration-200 p-6 flex flex-col items-center text-center group"
              >
                {/* Profile Avatar Placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-100 to-sky-50 flex items-center justify-center text-sky-600 text-2xl font-bold mb-4 shadow-inner group-hover:scale-105 transition-transform duration-200">
                  <FiUser />
                </div>

                {/* Info */}
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                  {teacher.name}
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {teacher.designation}
                </span>

                {/* Horizontal divider */}
                <div className="w-12 h-0.5 bg-sky-100/60 rounded my-4"></div>

                {/* Contact items */}
                <div className="flex flex-col gap-2 w-full text-xs text-slate-500 font-semibold mt-auto">
                  <span className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                    <FiMail className="text-slate-400 text-sm shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </span>
                  <span className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                    <FiPhone className="text-slate-400 text-sm shrink-0" />
                    <span>{teacher.number}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs mt-8">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiUser />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No active faculty found</h3>
            <p className="text-slate-500 text-xs mt-1">
              There are currently no listed academic teachers in our database records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
