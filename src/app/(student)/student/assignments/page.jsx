'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiCalendar, FiBookOpen, FiFileText, FiLink, FiInfo, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StudentAssignmentsPageContent = () => {
  const searchParams = useSearchParams();
  const classSubjectId = searchParams.get('class_subject_id');
  const subjectName = searchParams.get('subject_name') || 'Subject Details';

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
        const assignmentsList = data.paylod.assignments || [];
        setAssignments(assignmentsList);

        // 2. Fetch submission for each assignment
        const submissionMap = {};
        for (const assignment of assignmentsList) {
          const subRes = await fetch(`/api/lms/submissions?assignment_id=${assignment.id}`);
          if (subRes.ok) {
            const subData = await subRes.json();
            if (subData.paylod.submission) {
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
      toast.error('Please provide some submission text or a file link.');
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
        toast.success(data.message || 'Assignment submitted!');
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Class Assignments</h1>
        <p className="text-slate-500 text-sm font-medium">View active coursework, task due dates, and track your grading status for <span className="text-blue-600 font-bold">{subjectName}</span>.</p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Assignments Assigned</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">There are no assignments assigned for this subject yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => {
            const submission = submissions[assignment.id];
            const isOverdue = new Date() > new Date(assignment.due_date);

            return (
              <div
                key={assignment.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${isOverdue && !submission ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-500'}`}>
                      <FiCalendar /> Due: {new Date(assignment.due_date).toLocaleDateString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Max Marks: {assignment.max_marks}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                    <FiBookOpen className="text-blue-500" />
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
                      className="text-xs font-bold text-blue-600 hover:underline block mb-4"
                    >
                      Attached Document
                    </a>
                  )}

                  {submission && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mt-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Submission</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          submission.status === 'Graded'
                            ? 'bg-emerald-50 text-emerald-600'
                            : submission.status === 'Late'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-650'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      {submission.status === 'Graded' ? (
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>Score:</span>
                            <span className="text-emerald-600">{submission.marks_obtained} / {assignment.max_marks}</span>
                          </div>
                          {submission.remarks && (
                            <p className="text-slate-500 font-medium italic text-[11px] mt-1">"{submission.remarks}"</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 font-medium text-[10px]">Awaiting feedback from the teacher.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4">
                  {submission && submission.status === 'Graded' ? (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed"
                    >
                      Graded & Finalized
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmit(assignment)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <FiUploadCloud />
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-lg relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Submit Assignment</h3>
            <p className="text-slate-400 text-xs font-medium mb-6">Subject: <span className="font-bold text-slate-655 text-slate-600">{submitModalAssignment.title}</span></p>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Submission Answer / Text Notes</label>
                <textarea
                  rows={4}
                  value={formData.submission_text}
                  onChange={(e) => setFormData({ ...formData, submission_text: e.target.value })}
                  placeholder="Type your notes, solution summary, or explanations here..."
                  className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Link to Submission File (PDF / Drive URL)</label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="e.g. https://drive.google.com/your-submission-file"
                  className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSubmitModalAssignment(null)}
                  className="py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer text-center"
                >
                  Submit
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <StudentAssignmentsPageContent />
    </Suspense>
  );
};

export default StudentAssignmentsPage;
