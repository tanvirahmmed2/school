'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiBook, FiFolder, FiArrowLeft, FiLayers } from 'react-icons/fi';

const ClassDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          const list = data.paylod.classes || [];
          setClasses(list);
          
          // Find matching class by code or id
          const found = list.find(c => String(c.code) === String(id) || String(c.id) === String(id));
          setSelectedClass(found || null);
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-6 transition-colors cursor-pointer"
        >
          <FiArrowLeft />
          <span>Back to Programs</span>
        </button>

        {loading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs animate-pulse flex flex-col gap-4">
            <div className="w-32 h-6 bg-slate-200 rounded"></div>
            <div className="w-48 h-4 bg-slate-200 rounded"></div>
            <div className="w-full h-24 bg-slate-200 rounded mt-4"></div>
          </div>
        ) : selectedClass ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
            {/* Header details */}
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-650 flex items-center justify-center text-xl shrink-0">
                <FiLayers />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                  Class Room
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-1">
                  Class: {selectedClass.name}
                </h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                  Code: {selectedClass.code} | Numeric Label: {selectedClass.numeric_name}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 my-2"></div>

            {/* Description Info */}
            <div className="flex flex-col gap-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <h3 className="font-extrabold text-slate-800 text-base">Course Objectives</h3>
              <p>
                This class follows the Fontana Institute of Technology core academic training structures. It covers the complete set of primary curriculum guidelines, periodic test series, practical assignments, and midterm exams specified by the Academic Council.
              </p>
              <p>
                Students registered in this class can download syllabus PDF attachments, inspect classroom timetables, and monitor daily attendance logs by logging directly into their secure Student Portal account.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiBook />
            </div>
            <h3 className="font-bold text-slate-800 text-base font-extrabold">Class not found</h3>
            <p className="text-slate-500 text-xs mt-1">
              The requested class code or directory ID does not match any records in our database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailsPage;
