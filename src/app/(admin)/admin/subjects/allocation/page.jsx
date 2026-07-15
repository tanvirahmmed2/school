'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiLayers, FiBook } from 'react-icons/fi';

const AdminClassSubjectsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Create Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  // Edit Form State
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editClassId, setEditClassId] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial lookup lists
  const fetchAllData = async () => {
    try {
      const classRes = await fetch('/api/classes');
      const classData = await classRes.json();
      setClasses(classData.paylod?.classes || []);

      const subjectRes = await fetch('/api/subjects');
      const subjectData = await subjectRes.json();
      setSubjects(subjectData.paylod?.subjects || []);

      const assignmentsRes = await fetch('/api/class-subjects');
      const assignmentsData = await assignmentsRes.json();
      setAssignments(assignmentsData.paylod?.assignments || []);
    } catch (err) {
      toast.error('Failed to load class subject configuration lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle Create Submission
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!classId || !subjectId) {
      toast.error('Class and Subject selections are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/class-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          subject_id: subjectId,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to link subject with class.');

      toast.success(data.message || 'Subject successfully linked with class!');
      setClassId('');
      setSubjectId('');
      setShowAddForm(false);
      fetchAllData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Start Edit Mode
  const handleStartEdit = (item) => {
    setEditingAssignment(item);
    setEditClassId(item.class_id ? item.class_id.toString() : '');
    setEditSubjectId(item.subject_id ? item.subject_id.toString() : '');
    setShowAddForm(false);
  };

  // Handle Edit Submission
  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    if (!editClassId || !editSubjectId) {
      toast.error('Class and Subject selections are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/class-subjects/${editingAssignment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: editClassId,
          subject_id: editSubjectId,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update subject allocation.');

      toast.success(data.message || 'Subject allocation updated successfully!');
      setEditingAssignment(null);
      fetchAllData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteAssignment = async (id, subjectName, className) => {
    const confirm = window.confirm(`Are you sure you want to remove "${subjectName}" from "${className}"?`);
    if (!confirm) return;

    try {
      const res = await fetch(`/api/class-subjects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete allocation.');

      toast.success(data.message || 'Subject link deleted successfully!');
      fetchAllData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiBook className="text-blue-600" /> Subject Allocations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Map subjects to academic classes to configure the school curriculum.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingAssignment(null);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs"
        >
          {showAddForm ? (
            <>
              <FiX className="text-lg" /> Close Panel
            </>
          ) : (
            <>
              <FiPlus className="text-lg" /> Allocate Subject
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiPlus className="text-blue-600" /> Allocate Subject to Class
          </h2>
          <form onSubmit={handleCreateAssignment} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Class</label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
              >
                <option value="">Select class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Subject</label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
              >
                <option value="">Select subject...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
              >
                Link Subject
              </button>
            </div>
          </form>
        </div>
      )}

      {editingAssignment && (
        <div className="w-full bg-white border border-blue-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(59,130,246,0.02)]">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiEdit2 className="text-blue-650" /> Edit Subject Allocation
          </h2>
          <form onSubmit={handleUpdateAssignment} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Class</label>
              <select
                required
                value={editClassId}
                onChange={(e) => setEditClassId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Subject</label>
              <select
                required
                value={editSubjectId}
                onChange={(e) => setEditSubjectId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select subject...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* allocations registry */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Active Allocations Directory ({assignments.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-650 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading directory...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-5xl mb-3">📚</span>
            <h3 className="text-sm font-bold text-slate-600">No Allocations Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              No subjects have been linked to classes yet.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Mapping</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                        <FiLayers className="text-xs" />
                        {item.class_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <FiBook className="text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.subject_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-650 text-blue-600 rounded-xl transition-colors cursor-pointer"
                          title="Edit Allocation"
                        >
                          <FiEdit2 className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(item.id, item.subject_name, item.class_name)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-650 text-rose-600 rounded-xl transition-colors cursor-pointer"
                          title="Remove Allocation"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </div>
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

export default AdminClassSubjectsPage;
