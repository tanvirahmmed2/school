'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiClock, 
  FiTarget, 
  FiMap, 
  FiArrowRight, 
  FiBookOpen, 
  FiUsers, 
  FiAward, 
  FiLayers, 
  FiBriefcase,
  FiMail,
  FiShield
} from 'react-icons/fi';

const About = () => {
  const stats = [
    { value: '5,000+', label: 'Enrolled Students', desc: 'Active scholars across multiple technical and management programs.', color: 'from-blue-600 to-sky-500' },
    { value: '150+', label: 'Expert Faculty', desc: 'PhD holders, certified mentors, and leading industry professionals.', color: 'from-amber-600 to-orange-500' },
    { value: '94%', label: 'Placement Rate', desc: 'Graduates hired by top-tier global software and business corporations.', color: 'from-emerald-600 to-teal-500' },
    { value: '15+', label: 'Active Clubs', desc: 'Nurturing leadership, coding skills, and extra-curricular interests.', color: 'from-rose-600 to-pink-500' },
  ];

  const sections = [
    {
      title: 'Our Historic Journey',
      desc: 'Explore the major milestones, founding chronicles, and institutional growth of Fontana Institute of Technology since 2015.',
      href: '/about/history',
      icon: FiClock,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    },
    {
      title: 'Vision & Core Values',
      desc: 'Learn about our long-term academic objectives, ethical guidelines, code of conduct, and dedication to advanced research.',
      href: '/about/vision',
      icon: FiTarget,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      title: 'Mission Statement',
      desc: 'Read our institutional mission detailing progressive teaching frameworks, student care plans, and administrative criteria.',
      href: '/about/mission-vission',
      icon: FiBookOpen,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Campus & Infrastructure',
      desc: 'Take a virtual tour of our state-of-the-art libraries, high-tech engineering labs, design studios, and residential hostels.',
      href: '/about/campus',
      icon: FiMap,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    }
  ];

  const leaders = [
    {
      name: 'Dr. Arthur Pendelton',
      role: 'Principal & Director',
      credentials: 'Ph.D. in Computer Science, MIT',
      bio: 'Dr. Arthur leads the overall academic vision of FIT, bringing over 20 years of research experience in distributed architectures.',
      email: 'director@fit.edu.bd'
    },
    {
      name: 'Prof. Sarah Jenkins',
      role: 'Dean of Academics',
      credentials: 'M.Sc. in Educational Leadership, Oxford',
      bio: 'Prof. Sarah supervises the course curriculum, standardizes syllabi, and runs international academic collaboration programs.',
      email: 'academics@fit.edu.bd'
    },
    {
      name: 'Marcus Vance',
      role: 'Registrar of Admissions',
      credentials: 'MBA in Strategic Management, IBA',
      bio: 'Marcus oversees student enrollment, registration compliance, digital registrar records, and corporate placement relationships.',
      email: 'registrar@fit.edu.bd'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Hero Header Section */}
        <div className="relative bg-slate-900 text-white rounded-3xl p-8 md:p-14 overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/80 via-slate-900 to-indigo-950/80 z-0" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center flex flex-col items-center gap-4">
            <span className="text-[10px] sm:text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-400/20 px-3.5 py-1.5 rounded-full uppercase tracking-widest">
              Institutional Profile
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-2 max-w-2xl leading-[1.15]">
              Empowering Minds, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Engineering Futures</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed mt-2">
              Fontana Institute of Technology (FIT) is a premier academic institution built to inspire, train, and support student success in technology, hardware engineering, and business management fields.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
              <span className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </span>
              <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                {stat.label}
              </span>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mt-1">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Our Core Pillars
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Select a section below to read more about our historic milestones, academic beliefs, and campus settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <Link
                  key={idx}
                  href={sec.href}
                  className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 hover:shadow-sm hover:border-slate-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${sec.color}`}>
                      <Icon className="text-sm sm:text-base" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-sky-650 transition-colors">
                      {sec.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {sec.desc}
                  </p>
                  <div className="mt-auto pt-2 text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1 group-hover:text-sky-800">
                    <span>Explore Section</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Leadership Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Leadership & Administration
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Meet the administrative directors coordinating student pathways and academic success at FIT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map((leader, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4 relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-650 flex items-center justify-center font-bold text-base shrink-0 border border-slate-200">
                    {leader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-sm sm:text-base">
                      {leader.name}
                    </h4>
                    <span className="inline-block text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded mt-0.5">
                      {leader.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[11px] font-bold text-slate-700">
                    {leader.credentials}
                  </span>
                  <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <FiMail className="shrink-0 text-xs" />
                  <span>{leader.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FIT Charter Section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-sky-600" />
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 mt-1">
            <FiShield className="text-lg" />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              FIT Charter of Academic Quality
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              We are committed to delivering global standard computer science and business administration courses. Fontana recruits seasoned faculty members, hosts regular career placement seminars, and maintains modern lab setups. By utilizing clean digital registry workflows (student records, results, schedules), we ensure maximum transparency for parents and students alike.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;