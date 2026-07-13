'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiMail, FiMapPin, FiAward, FiBookOpen, FiUser } from 'react-icons/fi';

const TeacherDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [teacher, setTeacher] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTeacherData = async () => {
      try {
        // Fetch teacher profile
        const profileRes = await fetch(`/api/teachers/${id}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setTeacher(profileData.paylod.teacher);
        } else {
          console.error('Failed to load teacher profile');
        }

        // Fetch qualifications
        const qualRes = await fetch(`/api/teachers/qualifications?teacher_id=${id}`);
        if (qualRes.ok) {
          const qualData = await qualRes.json();
          setQualifications(qualData.paylod.qualifications || []);
        } else {
          console.error('Failed to load teacher qualifications');
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
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'T';
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/teachers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors mb-8"
        >
          <FiArrowLeft />
          Back to Faculty
        </Link>

        {loading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs animate-pulse flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 h-48 bg-slate-200 rounded-2xl"></div>
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <div className="w-32 h-6 bg-slate-200 rounded"></div>
              <div className="w-full h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : teacher ? (
          <div className="flex flex-col gap-8">
            {/* Main Header Info Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Card left */}
              <div className="w-full md:w-1/3 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center">
                {teacher.image ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md bg-slate-100">
                    <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-100 text-sky-750 flex items-center justify-center text-3xl font-black mb-4">
                    {getInitials(teacher.name)}
                  </div>
                )}
                <h3 className="font-extrabold text-slate-900 text-base">{teacher.name}</h3>
                <div className="flex flex-col items-center gap-1.5 mt-1.5">
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {teacher.designation || 'Faculty Member'}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                    teacher.is_permanent 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100/50' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100/50'
                  }`}>
                    {teacher.is_permanent ? 'Permanent Staff' : 'Temporary / Contract'}
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200 rounded my-4"></div>
                <div className="flex flex-col gap-2 w-full text-xs text-slate-500 font-semibold">
                  {teacher.email && (
                    <span className="flex items-center justify-center gap-1.5 truncate">
                      <FiMail className="shrink-0" /> {teacher.email}
                    </span>
                  )}
                  {teacher.address && (
                    <span className="flex items-center justify-center gap-1.5">
                      <FiMapPin className="shrink-0" /> {teacher.address}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Content section */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest w-fit">
                  Faculty Profile
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  Academic Background
                </h2>
                
                {/* Qualifications List */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <FiBookOpen className="text-lg text-sky-600" />
                    <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Degrees & Qualifications</h3>
                  </div>

                  {qualifications.length === 0 ? (
                    <p className="text-xs text-slate-400 italic font-medium py-2">
                      No educational qualification records are currently listed in our academic registry.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {qualifications.map(q => (
                        <div key={q.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-all bg-white">
                          <div className="flex flex-col gap-0.5">
                            <h4 className="font-extrabold text-slate-800 text-xs">{q.degree}</h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">{q.institution}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-605 text-slate-500 rounded-full">Graduation: {q.passing_year}</span>
                              {q.result && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{q.result}</span>
                              )}
                            </div>
                          </div>
                          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                            <FiAward className="text-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiUser />
            </div>
            <h3 className="font-bold text-slate-800 text-base font-extrabold">Teacher not found</h3>
            <p className="text-slate-500 text-xs mt-1">
              The requested faculty profile does not match any active records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetailPage;
