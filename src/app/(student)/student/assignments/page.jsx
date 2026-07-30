'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiCalendar, FiBookOpen, FiFileText, FiLink, FiInfo, FiUploadCloud, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StudentAssignmentsPageContent = () => {
  const searchParams = useSearchParams();
  const classSubjectId = searchParams.get('class_subject_id');
  const subjectName = searchParams.get('subject_name') || 'Subject Assignments';

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({}); // maps assignmentId -> submission object
  const [loading, setLoading] = useState(true);
  const [submitModalAssignment, setSubmitModalAssignment] = useState(null);
  const [formData, setFormData] = useState({
    submission_text: '',
    file_url: ''
  });

  const fetchData = async () => {
    try {
      // 1. Fetch assignments
      const res = await fetch(`/api/lms/assignments?class_subject_id=${classSubjectId}`);
      if (res.ok) {
        const data = await res.json();
        const assignmentsList = data.paylod?.assignments || [];
        setAssignments(assignmentsList);

        // 2. Fetch submission for each assignment
        const submissionMap = {};
        for (const assignment of assignmentsList) {
          const subRes = await fetch(`/api/lms/submissions?assignment_id=${assignment.id}`);
          if (subRes.ok) {
            const subData = await subRes.json();
            if (subData.paylod?.submission) {
              submissionMap[assignment.id] = subData.paylod.submission;
            }
          }
        }
        setSubmissions(submissionMap);
      }
    } catch (error) {
      console.error('Error fetching student assignments/submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classSubjectId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [classSubjectId]);

  const handleOpenSubmit = (assignment) => {
    const existing = submissions[assignment.id] || {};
    setSubmitModalAssignment(assignment);
    setFormData({
      submission_text: existing.submission_text || '',
      file_url: existing.file_url || ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.submission_text && !formData.file_url) {
      toast.error('Please provide submission text notes or a file link.');
      return;
    }

    try {
      const res = await fetch('/api/lms/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: submitModalAssignment.id,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Assignment submitted successfully!');
        setSubmitModalAssignment(null);
        setFormData({ submission_text: '', file_url: '' });
        fetchData();
      } else {
        toast.error(data.message || 'Submission failed.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <FiBookOpen /> Coursework & Tasks
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Class Assignments</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-normal mt-0.5">
            View pending homework tasks, submission deadlines, and grading feedback for <strong className="text-emerald-700">{subjectName}</strong>.
          </p>
        </div>
      </div>

      {!classSubjectId ? (
        <div className="bg-white border border-slate-200/70 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-3">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">Select a Subject</h3>
          <p className="text-slate-400 text-xs max-w-xs">Please navigate from your Subjects page to view assignments for a specific subject.</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white border border-slate-200/70 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-3">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Assignments Assigned</h3>
          <p className="text-slate-400 text-xs max-w-xs">There are no pending or active assignments assigned for this subject yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => {
            const submission = submissions[assignment.id];
            const isOverdue = new Date() > new Date(assignment.due_date);

            return (
              <div
                key={assignment.id}
                className="bg-white border border-slate-200/70 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                      isOverdue && !submission 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <FiCalendar className="text-xs" /> Due: {new Date(assignment.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Max Marks: {assignment.max_marks}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                    <FiBookOpen className="text-emerald-600 text-base" />
                    {assignment.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 whitespace-pre-line">
                    {assignment.description}
                  </p>

                  {assignment.file_url && (
                    <a
                      href={assignment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-xl mb-4 transition-colors"
                    >
                      <FiLink className="text-xs" /> View Attached Document
                    </a>
                  )}

                  {submission && (
                    <div className="p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl mt-4">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Record</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          submission.status === 'Graded'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : submission.status === 'Late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      {submission.status === 'Graded' ? (
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>Score:</span>
                            <span className="text-emerald-700">{submission.marks_obtained} / {assignment.max_marks}</span>
                          </div>
                          {submission.remarks && (
                            <p className="text-slate-500 font-medium italic text-xs mt-1">"{submission.remarks}"</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 font-medium text-xs">Submitted & awaiting review by teacher.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4">
                  {submission && submission.status === 'Graded' ? (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed border border-slate-200/60"
                    >
                      <FiCheckCircle /> Graded & Finalized
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmit(assignment)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <FiUploadCloud className="text-sm" />
                      <span>{submission ? 'Resubmit Assignment' : 'Submit Assignment'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal Dialog */}
      {submitModalAssignment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-lg relative animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Submit Assignment</h3>
                <p className="text-slate-400 text-xs font-medium">Task: <strong className="text-slate-700">{submitModalAssignment.title}</strong></p>
              </div>
              <button 
                onClick={() => setSubmitModalAssignment(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <FiX className="text-base" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Submission Answer / Text Notes</label>
                <textarea
                  rows={4}
                  placeholder="Enter your written answer or submission notes..."
                  value={formData.submission_text}
                  onChange={(e) => setFormData({ ...formData, submission_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Submission Document Link (PDF / Google Drive URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalAssignment(null)}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center shadow-xs"
                >
                  Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentAssignmentsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading assignments...</p>
      </div>
    }>
      <StudentAssignmentsPageContent />
    </Suspense>
  );
};

export default StudentAssignmentsPage;
