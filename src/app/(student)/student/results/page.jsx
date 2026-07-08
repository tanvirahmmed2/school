'use client';

import React, { useEffect, useState } from 'react';
import { FiAward, FiBook, FiCheck, FiInfo } from 'react-icons/fi';

const ResultsPage = () => {
  const [data, setData] = useState({ results: [], marks: [] });
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/student/results');
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
          if (resData.results && resData.results.length > 0) {
            setSelectedExamId(resData.results[0].exam_id);
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { results, marks } = data;

  const currentResult = results.find((r) => r.exam_id === selectedExamId);
  const filteredMarks = marks.filter((m) => m.exam_id === selectedExamId);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">My Marks & Results</h1>
        <p className="text-slate-500 text-sm font-medium">Verify your compiled semester GPA, letter grade, and subject-wise score cards.</p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Results Published</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">There are no compiled exam results published by administration yet.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Exam Selection List */}
          <div className="lg:w-1/3 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Published Exams</span>
            {results.map((res) => (
              <button
                key={res.exam_id}
                onClick={() => setSelectedExamId(res.exam_id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                  selectedExamId === res.exam_id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-white border-slate-100 text-slate-700 hover:border-slate-200'
                }`}
              >
                <h3 className="font-bold text-sm mb-1">{res.exam_name}</h3>
                <p className={`text-xs font-semibold ${selectedExamId === res.exam_id ? 'text-blue-100' : 'text-slate-400'}`}>
                  GPA: {res.gpa} • Grade: {res.grade}
                </p>
              </button>
            ))}
          </div>

          {/* Exam Marks Detailed Card */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {currentResult && (
              <>
                {/* Result summary banner */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 flex items-center justify-between border border-slate-800">
                  <div>
                    <h2 className="text-base font-bold mb-1">{currentResult.exam_name} Summary</h2>
                    <p className="text-xs font-medium text-slate-400">Term: {currentResult.exam_term}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GPA</span>
                      <span className="text-xl font-black text-blue-400">{currentResult.gpa}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-800"></div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grade</span>
                      <span className="text-xl font-black text-emerald-400">{currentResult.grade}</span>
                    </div>
                  </div>
                </div>

                {/* Marks breakdown table */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8">
                  <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FiBook className="text-blue-600" /> Subject-wise Score Breakdown
                  </h3>

                  {filteredMarks.length === 0 ? (
                    <p className="text-slate-400 text-xs font-semibold text-center py-6">No marks breakdown recorded for this exam.</p>
                  ) : (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Marks Obtained</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Total Marks</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMarks.map((mark) => {
                            const percent = Math.round((parseFloat(mark.marks_obtained) / parseFloat(mark.total_marks)) * 100);
                            return (
                              <tr key={mark.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                <td className="py-4 text-sm font-semibold text-slate-700">
                                  <p className="font-bold text-slate-800">{mark.subject_name}</p>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Code: {mark.subject_code}</span>
                                </td>
                                <td className="py-4 text-sm font-bold text-slate-700 text-center">
                                  {mark.marks_obtained}
                                </td>
                                <td className="py-4 text-sm font-semibold text-slate-400 text-center">
                                  {mark.total_marks}
                                </td>
                                <td className="py-4 text-center">
                                  <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                    percent >= 40 
                                      ? 'bg-emerald-50 text-emerald-600'
                                      : 'bg-rose-50 text-rose-600'
                                  }`}>
                                    {percent}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
