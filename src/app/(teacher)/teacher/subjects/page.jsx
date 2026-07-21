'use client';

import React, { useEffect, useState } from 'react';
import { FiBook, FiLayers, FiInfo } from 'react-icons/fi';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/teacher/subjects');
        if (res.ok) {
          const data = await res.json();
          setSubjects(data.paylod.subjects || []);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-650 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">My Subjects</h1>
        <p className="text-slate-500 text-sm font-medium">View the list of subjects you are assigned to teach across class sections.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Subjects Assigned</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">You are not assigned to teach any subjects currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4">
                  <FiBook className="text-xl" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{sub.subject_name}</h3>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-4">Code: {sub.subject_code}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5"><FiLayers className="text-slate-400" /> Class: {sub.class_name}</span>
                    {sub.section_name && <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px]">Sec: {sub.section_name}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <a
                    href={`/teacher/lessons?class_subject_id=${sub.id}&subject_name=${encodeURIComponent(sub.subject_name)}`}
                    className="flex flex-col items-center justify-center p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors text-center text-[10px] font-bold"
                  >
                    Lessons
                  </a>
                  <a
                    href={`/teacher/materials?class_subject_id=${sub.id}&subject_name=${encodeURIComponent(sub.subject_name)}`}
                    className="flex flex-col items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors text-center text-[10px] font-bold"
                  >
                    Materials
                  </a>
                  <a
                    href={`/teacher/assignments?class_subject_id=${sub.id}&subject_name=${encodeURIComponent(sub.subject_name)}`}
                    className="flex flex-col items-center justify-center p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors text-center text-[10px] font-bold"
                  >
                    Assignments
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
