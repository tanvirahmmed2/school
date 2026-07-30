'use client';

import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen, FiAward, FiUsers } from 'react-icons/fi';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/student/me');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.paylod?.student || null);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  const formatBirthDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/60 flex items-center justify-center text-3xl sm:text-4xl font-bold shrink-0 shadow-inner">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : <FiUser />}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">{profile?.name}</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Reg No: <span className="text-slate-700 font-mono">{profile?.registration_number}</span>
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Student Record
          </span>
        </div>
      </div>

      {/* Profile Details Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiUser className="text-emerald-600" /> Personal Information
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400">
                <FiMail className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400">
                <FiPhone className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400">
                <FiCalendar className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth</span>
                <span className="text-sm font-semibold text-slate-700">{formatBirthDate(profile?.date_of_birth)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400">
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
        <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiBookOpen className="text-emerald-600" /> Academic & Guardian Info
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400">
                <FiBookOpen className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Class</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.class_name || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400">
                <FiAward className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class Section</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.section_name || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400">
                <FiUsers className="text-sm" />
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
