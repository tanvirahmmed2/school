'use client';

import React, { useEffect, useState } from 'react';
import { 
  FiUser, FiUsers, FiBookOpen, FiActivity, FiDollarSign, 
  FiAward, FiCalendar, FiClock 
} from 'react-icons/fi';
import Link from 'next/link';

const StudentHomePage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch('/api/student/me'),
          fetch('/api/student/dashboard')
        ]);

        if (profileRes.ok && statsRes.ok) {
          const profileData = await profileRes.json();
          const statsData = await statsRes.json();
          setProfile(profileData.student);
          setStats(statsData.stats);
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
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
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
      title: 'Subjects & Coursework',
      value: stats?.subjectsCount || 0,
      subText: 'Enrolled in current term',
      icon: FiBookOpen,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      link: '/student/subjects'
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate || 100}%`,
      subText: `${stats?.presentAttendanceDays || 0}/${stats?.totalAttendanceDays || 0} class days logged`,
      icon: FiActivity,
      color: stats?.attendanceRate < 75 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100',
      link: '/student/attendance'
    },
    {
      title: 'Unpaid Fees & Fines',
      value: (stats?.unpaidFeesCount || 0) + (stats?.unpaidFinesCount || 0),
      subText: 'Pending payment dues',
      icon: FiDollarSign,
      color: ((stats?.unpaidFeesCount || 0) + (stats?.unpaidFinesCount || 0)) > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100',
      link: '/student/fees'
    },
    {
      title: 'Co-curricular Clubs',
      value: stats?.clubsCount || 0,
      subText: 'Active memberships',
      icon: FiUsers,
      color: 'bg-sky-50 text-sky-600 border-sky-100',
      link: '/student/clubs'
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-10 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            {welcomeMessage()}, {profile?.name || 'Student'}!
          </h1>
          <p className="text-blue-100 text-sm md:text-base font-medium max-w-xl">
            Welcome back to your academic hub. Keep track of your routines, progress, and assignments right here.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[200px] border border-white/15">
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block mb-1">
            Academic Information
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-white">Class: {profile?.class_name || 'N/A'}</span>
            <span className="text-xs font-semibold text-blue-100">Section: {profile?.section_name || 'N/A'}</span>
            <span className="text-xs font-semibold text-blue-100">Reg No: {profile?.registration_number}</span>
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
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800">
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
          <FiUser className="text-blue-600" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            href="/student/routine"
            className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50/50 transition-all duration-150"
          >
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <FiClock className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">View Schedule</h4>
              <p className="text-slate-400 text-xs font-medium">Daily class routines</p>
            </div>
          </Link>

          <Link 
            href="/student/results"
            className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50/50 transition-all duration-150"
          >
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <FiAward className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Report Cards</h4>
              <p className="text-slate-400 text-xs font-medium">Marks & semester grades</p>
            </div>
          </Link>

          <Link 
            href="/student/profile"
            className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50/50 transition-all duration-150"
          >
            <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
              <FiUser className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">My Profile</h4>
              <p className="text-slate-400 text-xs font-medium">Information & settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;