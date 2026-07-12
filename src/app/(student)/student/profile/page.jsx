'use client';

import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen, FiAward } from 'react-icons/fi';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/student/me');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.paylod.student);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatBirthDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">My Profile</h1>
        <p className="text-slate-500 text-sm font-medium">Verify your official records, parents details, and class admissions.</p>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-4xl font-extrabold shadow-sm">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{profile?.name}</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Registration Number: {profile?.registration_number}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Student
          </span>
        </div>
      </div>

      {/* Profile Details Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
            <FiUser className="text-blue-600" /> Personal Details
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiMail className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiPhone className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiCalendar className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth</span>
                <span className="text-sm font-semibold text-slate-700">{formatBirthDate(profile?.date_of_birth)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiMapPin className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential Address</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
            <FiBookOpen className="text-blue-600" /> Academic Details
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiBookOpen className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class Name</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.class_name || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiAward className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Section Name</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.section_name || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiUser className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Parents / Guardian Details</span>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed max-w-xs">{profile?.parents_info || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
