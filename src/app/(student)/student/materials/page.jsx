'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiFile, FiLink, FiInfo } from 'react-icons/fi';

const StudentMaterialsPageContent = () => {
  const searchParams = useSearchParams();
  const classSubjectId = searchParams.get('class_subject_id');
  const subjectName = searchParams.get('subject_name') || 'Subject Details';

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`/api/lms/study-materials?class_subject_id=${classSubjectId}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.paylod.study_materials || []);
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
    }
  }, [classSubjectId]);

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
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Study Materials</h1>
        <p className="text-slate-500 text-sm font-medium">Access shared resources, lecture guides, slides, and files for <span className="text-blue-600 font-bold">{subjectName}</span>.</p>
      </div>

      {materials.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Study Materials</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">The teacher hasn't uploaded or shared any study resources for this subject yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
                  <FiFile className="text-xl" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{mat.title}</h3>
                {mat.description && (
                  <p className="text-slate-400 text-xs font-medium mb-4 leading-relaxed line-clamp-2">
                    {mat.description}
                  </p>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 mt-2">
                <a
                  href={mat.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <FiLink />
                  <span>Access File / Link</span>
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <StudentMaterialsPageContent />
    </Suspense>
  );
};

export default StudentMaterialsPage;
