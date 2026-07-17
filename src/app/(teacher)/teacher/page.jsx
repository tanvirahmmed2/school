'use client';

import React, { useEffect, useState } from 'react';
import { 
  FiUser, FiBookOpen, FiActivity, FiDollarSign, 
  FiAward, FiCalendar, FiClock 
} from 'react-icons/fi';
import Link from 'next/link';

const TeacherHomePage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch('/api/teacher/me'),
          fetch('/api/teacher/dashboard')
        ]);

        if (profileRes.ok && statsRes.ok) {
          const profileData = await profileRes.json();
          const statsData = await statsRes.json();
          setProfile(profileData.paylod?.teacher);
          setStats(statsData.paylod?.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-650 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const welcomeMessage = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statCards = [
    {
      title: 'Assigned Subjects',
      value: stats?.subjectsCount || 0,
      subText: 'Classes teaching this term',
      icon: FiBookOpen,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      link: '/teacher/subjects'
    },
    {
      title: 'Students Taught',
      value: stats?.studentsCount || 0,
      subText: 'Registered class students',
      icon: FiUser,
      color: 'bg-sky-50 text-sky-600 border-sky-100',
      link: '/teacher/subjects'
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeavesCount || 0,
      subText: 'Applications under review',
      icon: FiCalendar,
      color: stats?.pendingLeavesCount > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100',
      link: '/teacher/leaves'
    },
    {
      title: 'Salary Received',
      value: `৳${(stats?.salaryReceived || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subText: 'Total credited amount',
      icon: FiDollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      link: '/teacher/salary'
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      
      <div className="bg-linear-to-r from-indigo-600 to-violet-700 rounded-3xl p-6 md:p-10 text-white shadow-lg shadow-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            {welcomeMessage()}, {profile?.name || 'Teacher'}!
          </h1>
          <p className="text-indigo-100 text-sm md:text-base font-medium max-w-xl">
            Welcome to your portal. Check schedules, track student attendance, and evaluate marks with ease.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-50 border border-white/15">
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block mb-1">
            Teacher Credentials
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-white">Designation: {profile?.designation || 'N/A'}</span>
            <span className="text-xs font-semibold text-indigo-100">Email: {profile?.email}</span>
            <span className="text-xs font-semibold text-indigo-100">Number: {profile?.number}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link 
              key={idx} 
              href={card.link}
              className="group bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${card.color} transition-transform duration-200 group-hover:scale-105`}>
                  <Icon className="text-xl" />
                </div>
                <span className="text-xl md:text-2xl font-extrabold text-slate-800">
                  {card.value}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{card.title}</h3>
                <p className="text-slate-400 text-xs font-medium">{card.subText}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Access / Shortcuts */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiActivity className="text-indigo-650 text-indigo-600" /> Dashboard Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            href="/teacher/schedule"
            className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50/50 transition-all duration-150"
          >
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <FiClock className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Class Schedule</h4>
              <p className="text-slate-400 text-xs font-medium">Daily teaching timetable</p>
            </div>
          </Link>

          <Link 
            href="/teacher/attendance"
            className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50/50 transition-all duration-150"
          >
            <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
              <FiCalendar className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Register Attendance</h4>
              <p className="text-slate-400 text-xs font-medium">Student roll logs</p>
            </div>
          </Link>

          <Link 
            href="/teacher/marks"
            className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50/50 transition-all duration-150"
          >
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <FiAward className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Evaluate Marks</h4>
              <p className="text-slate-400 text-xs font-medium">Record student exam marks</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;