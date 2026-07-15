'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiAward, FiLayers, FiGrid, FiBook, FiUser, FiCalendar } from 'react-icons/fi';
import ClassSubjectAssignForm from '@/component/forms/ClassSubjectAssignForm';
import ClassTeacherAssignForm from '@/component/forms/ClassTeacherAssignForm';

const AdminAssignClassesPage = () => {
  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' or 'classes'
  const [assignments, setAssignments] = useState([]);
  const [classTeacherAssignments, setClassTeacherAssignments] = useState([]);
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch classes
      const classesRes = await fetch('/api/classes');
      const classesData = await classesRes.json();
      if (!classesRes.ok) throw new Error(classesData.message || 'Failed to fetch classes.');

      // Fetch subjects
      const subjectsRes = await fetch('/api/subjects');
      const subjectsData = await subjectsRes.json();
      if (!subjectsRes.ok) throw new Error(subjectsData.message || 'Failed to fetch subjects.');

      // Fetch teachers
      const teachersRes = await fetch('/api/teachers');
      const teachersData = await teachersRes.json();
      if (!teachersRes.ok) throw new Error(teachersData.message || 'Failed to fetch teachers.');

      setClasses(classesData.paylod?.classes || []);
      setSubjects(subjectsData.paylod?.subjects || []);
      setTeachers(teachersData.paylod?.teachers || []);

      // Fetch Subject Assignments
      const assignRes = await fetch('/api/class-subject-teachers');
      const assignData = await assignRes.json();
      if (!assignRes.ok) throw new Error(assignData.message || 'Failed to fetch subject assignments.');
      setAssignments(assignData.paylod?.assignments || []);

      // Fetch Class Teacher Assignments
      const classTeacherRes = await fetch('/api/teacher-classes');
      const classTeacherData = await classTeacherRes.json();
      if (!classTeacherRes.ok) throw new Error(classTeacherData.message || 'Failed to fetch class teachers.');
      setClassTeacherAssignments(classTeacherData.paylod?.assignments || []);

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
      const response = await fetch(`/api/class-subject-teachers/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete assignment.');
      }

      toast.success(data.message || 'Assignment deleted successfully!');
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteClassTeacher = async (id, teacherName, className, sectionName, year) => {
    const sectionText = sectionName ? `Section ${sectionName}` : 'All Sections';
    const confirm = window.confirm(
      `Are you sure you want to remove ${teacherName} as Class Teacher of ${className} (${sectionText}) for academic year ${year}?`
    );
    if (!confirm) return;

    try {
      const response = await fetch(`/api/teacher-classes/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete class teacher assignment.');
      }

      toast.success(data.message || 'Class teacher assignment removed successfully!');
      setClassTeacherAssignments(classTeacherAssignments.filter((a) => a.id !== id));
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
            <FiAward className="text-blue-600" /> Teacher & Class Assignments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Assign teachers to subject routines or designate homeroom Class Teachers.
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
              <FiPlus className="text-lg" /> {activeTab === 'subjects' ? 'Assign Subject' : 'Assign Class Teacher'}
            </>
          )}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-5 border-b border-slate-100 pb-px">
        <button
          onClick={() => { setActiveTab('subjects'); setShowAddForm(false); }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all duration-150 cursor-pointer ${
            activeTab === 'subjects'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          Subject Teacher Assignments
        </button>
        <button
          onClick={() => { setActiveTab('classes'); setShowAddForm(false); }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all duration-150 cursor-pointer ${
            activeTab === 'classes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          Homeroom Class Teachers
        </button>
      </div>

      {/* Add Assignment Forms */}
      {showAddForm && activeTab === 'subjects' && (
        <ClassSubjectAssignForm
          classes={classes}
          teachers={teachers}
          onSuccess={() => {
            fetchData();
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showAddForm && activeTab === 'classes' && (
        <ClassTeacherAssignForm
          classes={classes}
          teachers={teachers}
          onSuccess={() => {
            fetchData();
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Registry Tables */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading assignments...</span>
          </div>
        ) : activeTab === 'subjects' ? (
          // SUBJECT TEACHERS TABLE
          <>
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Active Subject Mappings Registry ({assignments.length})
              </h2>
            </div>
            {assignments.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
                <span className="text-slate-300 text-5xl mb-3">🎓</span>
                <h3 className="text-sm font-bold text-slate-650">No Mappings Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  Map subjects to classes and assign subject teachers to build your registry.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Section</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Teacher</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Year</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
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
                            {assign.section_name}
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
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <FiUser className="text-xs" />
                            </span>
                            {assign.teacher_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-655 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                            <FiCalendar className="text-xs text-slate-400" /> {assign.academic_year}
                          </span>
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
          </>
        ) : (
          // CLASS TEACHERS TABLE
          <>
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Active Class Teachers Registry ({classTeacherAssignments.length})
              </h2>
            </div>
            {classTeacherAssignments.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
                <span className="text-slate-300 text-5xl mb-3">👨‍🏫</span>
                <h3 className="text-sm font-bold text-slate-650">No Class Teachers Assigned</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  Designate homeroom class teachers for classes and sections.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Section</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Class Teacher</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Year</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classTeacherAssignments.map((assign) => (
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
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <FiUser className="text-xs" />
                            </span>
                            {assign.teacher_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            <FiCalendar className="text-xs text-slate-400" /> {assign.academic_year}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteClassTeacher(assign.id, assign.teacher_name, assign.class_name, assign.section_name, assign.academic_year)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-655 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                            title="Remove Class Teacher"
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAssignClassesPage;
