'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiCheck, FiInfo, FiFileText, FiLink, FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import TiptapEditor from '@/component/helper/TiptapEditor';
import RichTextDisplay from '@/component/helper/RichTextDisplay';

const SubmissionGradingPageContent = ({ params }) => {
  const unwrappedParams = use(params);
  const assignmentId = unwrappedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentTitle = searchParams.get('title') || 'Assignment Submissions';

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    marks_obtained: '',
    remarks: ''
  });

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`/api/lms/submissions?assignment_id=${assignmentId}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.paylod.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (gradeForm.marks_obtained === '') {
      toast.error('Please specify the marks obtained.');
      return;
    }

    try {
      const res = await fetch('/api/lms/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: gradingSubmission.id,
          marks_obtained: parseFloat(gradeForm.marks_obtained),
          remarks: gradeForm.remarks
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Submission graded successfully!');
        setGradingSubmission(null);
        setGradeForm({ marks_obtained: '', remarks: '' });
        fetchSubmissions();
      } else {
        toast.error(data.message || 'Failed to grade submission.');
      }
    } catch (error) {
      console.error('Grading submit error:', error);
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
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 bg-slate-50 border border-slate-100 text-slate-650 hover:bg-slate-150 hover:text-slate-800 rounded-2xl transition-colors cursor-pointer"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">{assignmentTitle}</h1>
          <p className="text-slate-500 text-sm font-medium">Review and grade assignment uploads from students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 text-base">Submitted Submissions ({submissions.length})</h3>
          {submissions.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
                <FiInfo className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">No Submissions Yet</h3>
              <p className="text-slate-400 text-xs font-medium max-w-xs">Students have not uploaded submissions for this assignment yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{sub.student_name}</h4>
                      <p className="text-slate-400 text-[10px] font-semibold">Reg: {sub.student_reg}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'Graded'
                            ? 'bg-emerald-50 text-emerald-600'
                            : sub.status === 'Late'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {sub.submission_text && (
                      <div className="bg-slate-50/50 border border-slate-100/50 rounded-2xl p-4 text-xs font-medium text-slate-650 text-slate-600 leading-relaxed whitespace-pre-line">
                        {sub.submission_text}
                      </div>
                    )}

                    {sub.file_url && (
                      <a
                        href={sub.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline w-fit"
                      >
                        <FiLink />
                        <span>Attached Solution file / link</span>
                      </a>
                    )}

                    <div className="text-[10px] font-semibold text-slate-400">
                      Submitted: {new Date(sub.submitted_at).toLocaleDateString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>

                    {sub.status === 'Graded' && (
                      <div className="mt-2 p-4 bg-emerald-50/30 border border-emerald-100/30 rounded-2xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-800">Grade details</span>
                          <span className="text-xs font-extrabold text-emerald-600">Obtained: {sub.marks_obtained}</span>
                        </div>
                        {sub.remarks && (
                          <div className="text-slate-500 text-[11px] font-medium italic mt-1">
                            <RichTextDisplay html={sub.remarks} />
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setGradingSubmission(sub);
                        setGradeForm({
                          marks_obtained: sub.marks_obtained !== null ? sub.marks_obtained : '',
                          remarks: sub.remarks || ''
                        });
                      }}
                      className="mt-3 flex items-center justify-center gap-1.5 w-fit px-4 py-2 border border-indigo-100 text-indigo-650 hover:bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <FiEdit3 />
                      <span>{sub.status === 'Graded' ? 'Edit Grades' : 'Grade Submission'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grade Action Sidebar */}
        <div className="lg:col-span-1">
          {gradingSubmission ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-800 text-base mb-2">Grade details</h3>
              <p className="text-slate-500 text-xs font-medium mb-6">Grading submission of <span className="font-bold text-slate-700">{gradingSubmission.student_name}</span></p>

              <form onSubmit={handleGradeSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Marks Obtained</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={gradeForm.marks_obtained}
                    onChange={(e) => setGradeForm({ ...gradeForm, marks_obtained: e.target.value })}
                    placeholder="e.g. 92.5"
                    className="w-full px-4 py-3 border border-slate-150 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Teacher Remarks (Optional)</label>
                  <TiptapEditor
                    value={gradeForm.remarks}
                    onChange={(val) => setGradeForm({ ...gradeForm, remarks: val })}
                    placeholder="Provide constructive feedback..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setGradingSubmission(null)}
                    className="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Save Grade
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-6 text-center text-slate-405 text-slate-400 text-xs font-medium">
              Select a submission from the list to start grading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SubmissionGradingPage = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    }>
      <SubmissionGradingPageContent {...props} />
    </Suspense>
  );
};

export default SubmissionGradingPage;
