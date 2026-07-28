'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiMail,
  FiAward,
  FiBookOpen,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiLayers
} from 'react-icons/fi';
import Image from 'next/image';

const TeacherDetailPage = () => {
  const params = useParams();
  const { id } = params;

  const [teacher, setTeacher] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        // Fetch teacher profile
        const profileRes = await fetch(`/api/teachers/${id}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setTeacher(profileData.paylod?.teacher || null);
        }

        // Fetch qualifications
        const qualRes = await fetch(`/api/teachers/qualifications?teacher_id=${id}`);
        if (qualRes.ok) {
          const qualData = await qualRes.json();
          setQualifications(qualData.paylod?.qualifications || []);
        }

        // Fetch assigned subjects & classes
        const assignRes = await fetch(`/api/class-subject-teachers?teacher_id=${id}`);
        if (assignRes.ok) {
          const assignData = await assignRes.json();
          setAssignments(assignData.paylod?.assignments || []);
        }
      } catch (err) {
        console.error('Error fetching teacher details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'T';
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/teachers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-2xs"
          >
            <FiArrowLeft className="text-sm" /> Back to Faculty
          </Link>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-2xs space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full"></div>
              <div className="space-y-3 w-full max-w-md">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="h-32 bg-slate-100 rounded-2xl"></div>
          </div>
        ) : teacher ? (
          <div className="space-y-6 animate-fade-up">
            
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
              
              <div className="h-32 bg-primary p-6 flex justify-end items-start relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/30 uppercase tracking-wider">
                    {teacher.designation || 'Faculty Member'}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-12 sm:-mt-14">
                
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                  {teacher.image ? (
                    <Image width={400} height={400}
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white shadow-md bg-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center text-3xl font-bold ring-4 ring-white shadow-md shrink-0">
                      {getInitials(teacher.name)}
                    </div>
                  )}

                  <div className="space-y-1 mb-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-xl font-bold text-slate-900 tracking-tight">{teacher.name}</h1>
                      {teacher.is_permanent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-semibold">
                          <FiCheckCircle className="text-xs" /> Permanent
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                      <FiBriefcase className="text-primary text-xs" />
                      {teacher.designation || 'Faculty Member'}
                    </p>
                  </div>
                </div>

                {/* Contact Quick Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-xs font-medium text-slate-600 w-full sm:w-auto">
                  {teacher.email && (
                    <a
                      href={`mailto:${teacher.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-white hover:border-primary transition-all text-slate-700"
                    >
                      <FiMail className="text-primary" /> {teacher.email}
                    </a>
                  )}
                </div>

              </div>

            </div>

            {/* Content Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Qualifications & Academic Degrees Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FiAward className="text-primary text-base" /> Degrees & Qualifications ({qualifications.length})
                  </h2>
                </div>

                {qualifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    No qualification entries recorded.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {qualifications.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between hover:bg-white transition-all"
                      >
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-800 text-xs">{q.degree}</h3>
                          <p className="text-[11px] font-medium text-slate-500">{q.institution}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="px-2 py-0.5 bg-slate-200/70 text-slate-600 text-[10px] font-semibold rounded-md">
                              Passing Year: {q.passing_year}
                            </span>
                            {q.result && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-semibold rounded-md">
                                {q.result}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FiBookOpen className="text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Teaching Responsibilities & Classes Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FiLayers className="text-primary text-base" /> Teaching Assignments ({assignments.length})
                  </h2>
                </div>

                {assignments.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    No active class or subject assignments assigned yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((a) => (
                      <div
                        key={a.id}
                        className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between hover:bg-white transition-all"
                      >
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-slate-800 text-xs">{a.subject_name} ({a.subject_code})</h3>
                          <p className="text-[11px] font-medium text-slate-500">
                            Class: <strong className="text-slate-700">{a.class_name}</strong>
                            {a.section_name && <span> • Section {a.section_name}</span>}
                          </p>
                          {a.academic_year && (
                            <span className="inline-block mt-1 text-[10px] text-slate-400 font-semibold">
                              Academic Year: {a.academic_year}
                            </span>
                          )}
                        </div>

                        <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                          {a.class_code || a.class_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          /* Empty / Not Found State */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-md mx-auto shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              <FiUser />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Teacher Profile Not Found</h3>
            <p className="text-xs text-slate-400">
              The requested faculty profile does not exist or has been deactivated.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TeacherDetailPage;
