'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiLayers, FiBook, FiUser } from 'react-icons/fi';

const AdminClassSubjectsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Create Assignment Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [createSectionsList, setCreateSectionsList] = useState([]);

  // Edit Assignment Form State
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editClassId, setEditClassId] = useState('');
  const [editSectionId, setEditSectionId] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editTeacherId, setEditTeacherId] = useState('');
  const [editSectionsList, setEditSectionsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial lookup lists
  const fetchAllData = async () => {
    try {
      const classRes = await fetch('/api/classes');
      const classData = await classRes.json();
      setClasses(classData.classes || []);

      const subjectRes = await fetch('/api/subjects');
      const subjectData = await subjectRes.json();
      setSubjects(subjectData.subjects || []);

      const teacherRes = await fetch('/api/teachers');
      const teacherData = await teacherRes.json();
      setTeachers(teacherData.teachers || []);

      const assignmentsRes = await fetch('/api/class-subjects');
      const assignmentsData = await assignmentsRes.json();
      setAssignments(assignmentsData.assignments || []);
    } catch (err) {
      toast.error('Failed to load class subject configuration lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch sections based on selected class in Create Form
  useEffect(() => {
    if (!classId) {
      setCreateSectionsList([]);
      setSectionId('');
      return;
    }
    const fetchCreateSections = async () => {
      try {
        const res = await fetch(`/api/sections?class_id=${classId}`);
        const data = await res.json();
        setCreateSectionsList(data.sections || []);
        setSectionId('');
      } catch (err) {
        toast.error('Failed to retrieve class sections.');
      }
    };
    fetchCreateSections();
  }, [classId]);

  // Fetch sections based on selected class in Edit Form
  useEffect(() => {
    if (!editClassId) {
      setEditSectionsList([]);
      setEditSectionId('');
      return;
    }
    const fetchEditSections = async () => {
      try {
        const res = await fetch(`/api/sections?class_id=${editClassId}`);
        const data = await res.json();
        setEditSectionsList(data.sections || []);
      } catch (err) {
        toast.error('Failed to retrieve class sections.');
      }
    };
    fetchEditSections();
  }, [editClassId]);

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
          section_id: sectionId || null,
          subject_id: subjectId,
          teacher_id: teacherId || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to link subject with class.');

      toast.success(data.message || 'Subject successfully linked with class!');
      setClassId('');
      setSectionId('');
      setSubjectId('');
      setTeacherId('');
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
    setEditSectionId(item.section_id ? item.section_id.toString() : '');
    setEditSubjectId(item.subject_id ? item.subject_id.toString() : '');
    setEditTeacherId(item.teacher_id ? item.teacher_id.toString() : '');
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
          section_id: editSectionId || null,
          subject_id: editSubjectId,
          teacher_id: editTeacherId || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update linkage.');

      toast.success(data.message || 'Linkage successfully updated.');
      setEditingAssignment(null);
      fetchAllData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteAssignment = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this class subject linkage?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/class-subjects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete allocation.');

      toast.success(data.message || 'Subject mapping removed.');
      fetchAllData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiBook className="text-blue-600" /> Class Subject Allocations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Map academic subjects to classes and sections, and assign teachers to them.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingAssignment(null);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
        >
          {showAddForm ? (
            <>
              <FiX className="text-lg" /> Close Panel
            </>
          ) : (
            <>
              <FiPlus className="text-lg" /> Link Subject
            </>
          )}
        </button>
      </div>

      {/* Creation form */}
      {showAddForm && !editingAssignment && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            🔗 Create Subject-Class Association
          </h2>
          <form onSubmit={handleCreateAssignment} className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Class
              </label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select class...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Section (Optional)
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                disabled={submitting || !classId}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 disabled:opacity-60"
              >
                <option value="">Select section...</option>
                {createSectionsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Subject
              </label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select subject...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assign Teacher (Optional)
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select teacher...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-155 cursor-pointer"
              >
                {submitting ? 'Allocating...' : 'Assign Link'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingAssignment && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            📝 Edit Subject-Class Association
          </h2>
          <form onSubmit={handleUpdateAssignment} className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Class
              </label>
              <select
                required
                value={editClassId}
                onChange={(e) => setEditClassId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select class...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Section (Optional)
              </label>
              <select
                value={editSectionId}
                onChange={(e) => setEditSectionId(e.target.value)}
                disabled={submitting || !editClassId}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 disabled:opacity-65"
              >
                <option value="">Select section...</option>
                {editSectionsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Subject
              </label>
              <select
                required
                value={editSubjectId}
                onChange={(e) => setEditSubjectId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select subject...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assign Teacher (Optional)
              </label>
              <select
                value={editTeacherId}
                onChange={(e) => setEditTeacherId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="">Select teacher...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-155 cursor-pointer"
              >
                {submitting ? 'Updating...' : 'Update Link'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster Listing Grid */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Subject-to-Class Assignment Registry ({assignments.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading assignments...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-350 text-6xl mb-4">📚</span>
            <h3 className="text-sm font-bold text-slate-600">No Assignments Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              No subjects have been linked to academic classes yet. Click "Link Subject" above to configure associations.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Academic Class
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Subject
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Teacher
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <FiLayers className="text-slate-400" />
                        {item.class_name}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-655">
                        {item.section_name || 'Class-wide (No Section)'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.subject_name}</p>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                          {item.subject_code}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-655 flex items-center gap-1 text-slate-700">
                        <FiUser className="text-slate-400" />
                        {item.teacher_name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Edit Allocation"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(item.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-655 text-red-655 text-red-655 text-red-655 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Remove Linkage"
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

export default AdminClassSubjectsPage;
