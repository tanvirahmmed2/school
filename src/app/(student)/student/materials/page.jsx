'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiFile, FiLink, FiInfo, FiBookOpen, FiDownload } from 'react-icons/fi';

const StudentMaterialsPageContent = () => {
  const searchParams = useSearchParams();
  const classSubjectId = searchParams.get('class_subject_id');
  const subjectName = searchParams.get('subject_name') || 'Subject Materials';

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`/api/lms/study-materials?class_subject_id=${classSubjectId}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.paylod?.study_materials || []);
      }
    } catch (error) {
      console.error('Error fetching study materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classSubjectId) {
      fetchMaterials();
    } else {
      setLoading(false);
    }
  }, [classSubjectId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading study resources...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <FiBookOpen /> Resource Repository
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Study Materials & Notes</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-normal mt-0.5">
            Access downloadable handouts, slides, and reference links for <strong className="text-emerald-700">{subjectName}</strong>.
          </p>
        </div>
      </div>

      {!classSubjectId ? (
        <div className="bg-white border border-slate-200/70 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-3">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">Select a Subject</h3>
          <p className="text-slate-400 text-xs max-w-xs">Please navigate from your Subjects page to view materials for a specific subject.</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white border border-slate-200/70 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-3">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Study Materials Available</h3>
          <p className="text-slate-400 text-xs max-w-xs">The teacher hasn't uploaded or shared any study resources for this subject yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white border border-slate-200/70 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md hover:border-emerald-500/40 transition-all duration-200"
            >
              <div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 w-fit mb-4">
                  <FiFile className="text-xl" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{mat.title}</h3>
                {mat.description && (
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                    {mat.description}
                  </p>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 mt-2">
                <a
                  href={mat.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FiDownload className="text-sm" />
                  <span>Access Resource / File</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StudentMaterialsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading page...</p>
      </div>
    }>
      <StudentMaterialsPageContent />
    </Suspense>
  );
};

export default StudentMaterialsPage;
