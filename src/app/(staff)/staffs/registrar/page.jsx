'use client';

import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase, FiShield } from 'react-icons/fi';

const RegistrarHomePage = () => {
  const [registrar, setRegistrar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/staff/me');
        if (response.ok) {
          const data = await response.json();
          setRegistrar(data.staff);
        }
      } catch (error) {
        console.error('Failed to fetch registrar profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!registrar) {
    return (
      <div className="p-6 bg-red-50 text-red-600 border border-red-100 rounded-2xl">
        Failed to load profile. Please sign in again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-fade-up">
      {/* Header card with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 md:p-8 shadow-[0_15px_30px_rgba(124,58,237,0.15)]">
        <div className="absolute top-0 right-0 w-[40%] aspect-square rounded-full bg-white/5 blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold">
            {registrar.name.charAt(0)}
          </div>
          <div className="flex flex-col text-center sm:text-left gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-200 flex items-center justify-center sm:justify-start gap-1">
              <FiShield /> Registrar Workspace
            </span>
            <h1 className="text-2xl font-bold tracking-tight">{registrar.name}</h1>
            <p className="text-xs text-purple-100 flex items-center justify-center sm:justify-start gap-1">
              <FiBriefcase className="text-sm" /> {registrar.designation} • System Registrar
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col gap-5">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3">
            <FiUser className="text-purple-600 text-base" /> Registrar Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <FiMail className="text-base" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                <span className="text-xs font-bold text-slate-700">{registrar.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <FiPhone className="text-base" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</span>
                <span className="text-xs font-bold text-slate-700">{registrar.number}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <FiMapPin className="text-base" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</span>
                <span className="text-xs font-bold text-slate-700">{registrar.address || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Roles and Status Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3">
              <FiShield className="text-purple-600 text-base" /> Registrar Status
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Status</span>
                <span className="px-2 py-0.5 font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Active
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Registrations</span>
                <span className="px-2 py-0.5 font-bold rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                  Registrar
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-slate-50 pt-4">
            <FiCalendar /> Verified system authority
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarHomePage;