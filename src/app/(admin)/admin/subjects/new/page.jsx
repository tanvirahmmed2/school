'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiBook } from 'react-icons/fi';
import SubjectCreateForm from '@/component/forms/SubjectCreateForm';
import SubjectEditForm from '@/component/forms/SubjectEditForm';

const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subjects.');
      }
      setSubjects(data.subjects || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDeleteSubject = async (id, subjectName) => {
    const confirm = window.confirm(
      `Are you sure you want to delete subject "${subjectName}"? This will delete all class/section mappings for this subject as well!`
    );
    if (!confirm) return;

    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete subject.');
      }

      toast.success(data.message || 'Subject deleted successfully!');
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStartEdit = (sub) => {
    setEditingSubject(sub);
    setShowAddForm(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiBook className="text-blue-600" /> Subject Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and delete school subjects.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingSubject(null);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
        >
          {showAddForm ? (
            <>
              <FiX className="text-lg" /> Close
            </>
          ) : (
            <>
              <FiPlus className="text-lg" /> Add Subject
            </>
          )}
        </button>
      </div>

      {/* Add Subject Form component */}
      {showAddForm && !editingSubject && (
        <SubjectCreateForm
          onSuccess={() => {
            fetchSubjects();
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Subject Form component */}
      {editingSubject && (
        <SubjectEditForm
          subject={editingSubject}
          onSuccess={() => {
            fetchSubjects();
            setEditingSubject(null);
          }}
          onCancel={() => setEditingSubject(null)}
        />
      )}

      {/* Subjects Registry Table */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Active Subjects Registry ({subjects.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading subjects...</span>
          </div>
        ) : subjects.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-350 text-5xl mb-3">📚</span>
            <h3 className="text-sm font-bold text-slate-600">No Subjects Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Add subjects to connect them with classes, sections, and teachers.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Subject Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Subject Code
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center font-bold text-sm">
                          {sub.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{sub.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            DB Key: {sub.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                        {sub.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(sub)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Edit Subject"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub.id, sub.name)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-650 text-red-650 text-red-650 text-red-650 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Delete Subject"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubjectsPage;
