'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiAward, FiLayers, FiGrid, FiBook } from 'react-icons/fi';
import ClassSubjectAssignForm from '@/component/forms/ClassSubjectAssignForm';

const AdminAssignClassesPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch assignments
      const assignRes = await fetch('/api/class-subjects');
      const assignData = await assignRes.json();
      if (!assignRes.ok) throw new Error(assignData.error || 'Failed to fetch assignments.');

      // Fetch classes
      const classesRes = await fetch('/api/classes');
      const classesData = await classesRes.json();
      if (!classesRes.ok) throw new Error(classesData.error || 'Failed to fetch classes.');

      // Fetch subjects
      const subjectsRes = await fetch('/api/subjects');
      const subjectsData = await subjectsRes.json();
      if (!subjectsRes.ok) throw new Error(subjectsData.error || 'Failed to fetch subjects.');

      // Fetch teachers
      const teachersRes = await fetch('/api/teachers');
      const teachersData = await teachersRes.json();
      if (!teachersRes.ok) throw new Error(teachersData.error || 'Failed to fetch teachers.');

      setAssignments(assignData.assignments || []);
      setClasses(classesData.classes || []);
      setSubjects(subjectsData.subjects || []);
      setTeachers(teachersData.teachers || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAssignment = async (id, subjectName, className) => {
    const confirm = window.confirm(
      `Are you sure you want to remove the "${subjectName}" mapping from "${className}"?`
    );
    if (!confirm) return;

    try {
      const response = await fetch(`/api/class-subjects/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete assignment.');
      }

      toast.success(data.message || 'Assignment deleted successfully!');
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiAward className="text-blue-600" /> Class Assignments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Map subjects to classes/sections and assign teachers.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
        >
          {showAddForm ? (
            <>
              <FiX className="text-lg" /> Close Drawer
            </>
          ) : (
            <>
              <FiPlus className="text-lg" /> Assign Subject
            </>
          )}
        </button>
      </div>

      {/* Add Assignment Form Component */}
      {showAddForm && (
        <ClassSubjectAssignForm
          classes={classes}
          subjects={subjects}
          teachers={teachers}
          onSuccess={() => {
            fetchData();
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Assignments Registry Table */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Active Assignments Registry ({assignments.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading assignments...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-5xl mb-3">🎓</span>
            <h3 className="text-sm font-bold text-slate-650">No Assignments Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Assign subjects to classes and link educators to build your academic registry.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Subject Mapping
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
                {assignments.map((assign) => (
                  <tr key={assign.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                        <FiLayers className="text-xs text-blue-400" />
                        {assign.class_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <FiGrid className="text-slate-400" />
                        {assign.section_name || 'All Sections'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                          <FiBook className="text-slate-400 text-xs" />
                          {assign.subject_name}
                        </p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          Code: {assign.subject_code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assign.teacher_name ? (
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                            {assign.teacher_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                          {assign.teacher_name}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteAssignment(assign.id, assign.subject_name, assign.class_name)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Remove Mapping"
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

export default AdminAssignClassesPage;
