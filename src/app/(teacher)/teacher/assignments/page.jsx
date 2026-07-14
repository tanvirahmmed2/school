'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiPlus, FiCalendar, FiBookOpen, FiEye, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';

const TeacherAssignmentsPageContent = () => {
  const searchParams = useSearchParams();
  const classSubjectId = searchParams.get('class_subject_id');
  const subjectName = searchParams.get('subject_name') || 'Subject Details';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    max_marks: 100,
    due_date: '',
    file_url: ''
  });

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`/api/lms/assignments?class_subject_id=${classSubjectId}`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.paylod.assignments || []);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classSubjectId) {
      fetchAssignments();
    }
  }, [classSubjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.due_date) {
      toast.error('Title, description, and due date are required.');
      return;
    }

    try {
      const res = await fetch('/api/lms/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_subject_id: classSubjectId,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Assignment created!');
        setFormData({
          title: '',
          description: '',
          max_marks: 100,
          due_date: '',
          file_url: ''
        });
        setShowAddForm(false);
        fetchAssignments();
      } else {
        toast.error(data.message || 'Failed to create assignment.');
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
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Class Assignments</h1>
          <p className="text-slate-500 text-sm font-medium">Post homework tasks and review submissions for <span className="text-indigo-600 font-bold">{subjectName}</span>.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm w-fit"
        >
          <FiPlus className="text-sm" />
          <span>{showAddForm ? 'View Assignments' : 'Post Assignment'}</span>
        </button>
      </div>

      {showAddForm ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-xl mx-auto w-full shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Create Assignment</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Assignment Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Midterm Homework 1"
                className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Task Instructions</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail what tasks students need to perform..."
                className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Due Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Max Marks</label>
                <input
                  type="number"
                  value={formData.max_marks}
                  onChange={(e) => setFormData({ ...formData, max_marks: parseInt(e.target.value, 10) })}
                  className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Reference File/Attachment link (Optional)</label>
              <input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="e.g. Google Drive/OneDrive PDF URL link"
                className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Post Assignment
            </button>
          </form>
        </div>
      ) : (
        <>
          {assignments.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
                <FiInfo className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">No Assignments Posted</h3>
              <p className="text-slate-400 text-xs font-medium max-w-xs">You haven't posted any assignments for this class yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-50 px-2.5 py-1 rounded-full">
                        <FiCalendar /> Due: {new Date(assignment.due_date).toLocaleDateString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Max Marks: {assignment.max_marks}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                      <FiBookOpen className="text-indigo-500" />
                      {assignment.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4 whitespace-pre-line">
                      {assignment.description}
                    </p>
                    {assignment.file_url && (
                      <a
                        href={assignment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-indigo-650 text-indigo-600 hover:underline block mb-4"
                      >
                        Attachment Link
                      </a>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-4 mt-2">
                    <Link
                      href={`/teacher/assignments/${assignment.id}?title=${encodeURIComponent(assignment.title)}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-indigo-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <FiEye />
                      <span>Review Submissions</span>
                    </Link>
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

const TeacherAssignmentsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    }>
      <TeacherAssignmentsPageContent />
    </Suspense>
  );
};

export default TeacherAssignmentsPage;
