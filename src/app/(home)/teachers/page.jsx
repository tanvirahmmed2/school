'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUser, FiArrowRight, FiBriefcase } from 'react-icons/fi';

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

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs animate-pulse flex">
                {/* Image side */}
                <div className="w-[110px] shrink-0 bg-slate-100"></div>
                {/* Info side */}
                <div className="flex-1 p-5 flex flex-col justify-center gap-3">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2.5 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-7 bg-slate-100 rounded-lg w-28 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : teachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-[0_8px_30px_rgba(14,165,233,0.1)] transition-all duration-250 overflow-hidden flex"
              >
                {/* ── Left: Image Panel ──────────────────── */}
                <div className="w-[110px] shrink-0 relative bg-gradient-to-br from-sky-50 to-slate-100 overflow-hidden">
                  {teacher.image ? (
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FiUser className="text-sky-500 text-2xl" />
                      </div>
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-sky-600/0 group-hover:bg-sky-600/8 transition-all duration-300 pointer-events-none"></div>
                </div>

                {/* ── Right: Info Panel ──────────────────── */}
                <div className="flex-1 min-w-0 p-4 flex flex-col justify-center gap-1.5">
                  {/* Name */}
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight truncate">
                    {teacher.name}
                  </h3>

                  {/* Designation */}
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                    <FiBriefcase className="text-slate-300 shrink-0" />
                    <span className="truncate">{teacher.designation || 'Faculty Member'}</span>
                  </span>

                  {/* Divider */}
                  <div className="w-8 h-0.5 bg-sky-200 rounded my-1.5"></div>

                  {/* View Profile Link */}
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 transition-colors w-fit px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-100 hover:border-sky-200 group/link"
                  >
                    View Profile
                    <FiArrowRight className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
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
