'use client';

import React, { useEffect, useState } from 'react';
import { FiBook, FiUser, FiDownload, FiInfo } from 'react-icons/fi';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/student/subjects');
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
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Subjects & Syllabus</h1>
        <p className="text-slate-500 text-sm font-medium">View the list of subjects and download course curriculums.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Subjects Registered</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">There are no subjects assigned to your current class level.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4">
                  <FiBook className="text-xl" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{sub.subject_name}</h3>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-4">Code: {sub.subject_code}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <FiUser className="text-slate-400 text-sm" />
                  <div>
                    <p className="font-bold">{sub.teacher_name || 'Assigned soon'}</p>
                    {sub.teacher_email && <p className="text-slate-400 font-medium text-[10px]">{sub.teacher_email}</p>}
                  </div>
                </div>

                {sub.syllabus_link ? (
                  <a
                    href={sub.syllabus_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 text-slate-600 border border-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FiDownload className="text-sm" />
                    <span>Syllabus: {sub.syllabus_title}</span>
                  </a>
                ) : (
                  <div className="py-2 bg-slate-50 border border-slate-100/50 text-slate-400 rounded-xl text-xs font-semibold text-center">
                    No syllabus uploaded yet
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`/student/materials?class_subject_id=${sub.class_subject_id}&subject_name=${encodeURIComponent(sub.subject_name)}`}
                    className="flex items-center justify-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-650 text-blue-600 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
                  >
                    Study Materials
                  </a>
                  <a
                    href={`/student/assignments?class_subject_id=${sub.class_subject_id}&subject_name=${encodeURIComponent(sub.subject_name)}`}
                    className="flex items-center justify-center py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-650 text-emerald-600 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
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
