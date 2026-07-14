'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiFile, FiPlus, FiLink, FiDownload, FiInfo, FiTrash } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MaterialsPageContent = () => {
  const searchParams = useSearchParams();
  const classSubjectId = searchParams.get('class_subject_id');
  const subjectName = searchParams.get('subject_name') || 'Subject Details';

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.file_url) {
      toast.error('Title and resource link are required.');
      return;
    }

    try {
      const res = await fetch('/api/lms/study-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_subject_id: classSubjectId,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Study material uploaded!');
        setFormData({
          title: '',
          description: '',
          file_url: ''
        });
        setShowAddForm(false);
        fetchMaterials();
      } else {
        toast.error(data.message || 'Failed to add study material.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Study Materials</h1>
          <p className="text-slate-500 text-sm font-medium">Distribute PDFs, slides, and reference links for <span className="text-indigo-600 font-bold">{subjectName}</span>.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm w-fit"
        >
          <FiPlus className="text-sm" />
          <span>{showAddForm ? 'View Materials' : 'Share Material'}</span>
        </button>
      </div>

      {showAddForm ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-xl mx-auto w-full shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Share Study Resource</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Resource Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Lecture Slides - Week 1"
                className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Resource URL / File Link</label>
              <input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="e.g. https://drive.google.com/..."
                className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Description (Optional)</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of this material..."
                className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600 resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Post Material
            </button>
          </form>
        </div>
      ) : (
        <>
          {materials.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
                <FiInfo className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">No Study Materials</h3>
              <p className="text-slate-400 text-xs font-medium max-w-xs">You haven't uploaded or shared any study resources yet.</p>
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
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors"
                    >
                      <FiLink />
                      <span>Access File / Link</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const MaterialsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    }>
      <MaterialsPageContent />
    </Suspense>
  );
};

export default MaterialsPage;
