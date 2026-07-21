'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiBookOpen, 
  FiActivity, 
  FiHome, 
  FiHeart, 
  FiArrowLeft,
  FiAward
} from 'react-icons/fi';

const CampusDetailsPage = () => {
  const specs = [
    {
      title: 'Central Library Parameters',
      desc: 'FIT’s library serves as our academic core. It holds digital and print materials accessible through advanced search systems.',
      icon: FiBookOpen,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
      details: [
        'Operational hours: Mon - Sat, 8:00 AM to 9:00 PM.',
        'Seating capacity: 200 concurrent reading seats.',
        'Database partnerships: Subscriptions to IEEE Xplore, ScienceDirect, and ACM Digital Library.',
        'Terminals: 20 high-speed PC workstations with direct printer access.'
      ]
    },
    {
      title: 'Hardware & Engineering Labs',
      desc: 'Our labs provide students with hands-on practice, equipped with professional prototyping tools and hardware diagnostic systems.',
      icon: FiActivity,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      details: [
        'Lab capacity: 30 students per class batch.',
        'Development kits: Arduino Uno/Mega, Raspberry Pi 4, FPGA boards, and ESP32 nodes.',
        'Diagnostic gear: Rigol digital oscilloscopes, function generators, and regulated DC power benches.',
        'Fabrication tools: Soldering extraction stations, PCB etching gear, and dual-extrusion 3D printers.'
      ]
    },
    {
      title: 'Residential Hostels',
      desc: 'FIT maintains secure, clean on-campus residential housing, fostering cooperative learning and community living.',
      icon: FiHome,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      details: [
        'Room style: Modern twin-sharing rooms with study desks and storage closets.',
        'Power fallback: 150kVA silent diesel generator supporting 24/7 electricity.',
        'Sanitary standards: Deep cleaning services twice daily, pure reverse-osmosis drinking water systems.',
        'Recreation space: Common room featuring table tennis, chess, and multi-channel displays.'
      ]
    },
    {
      title: 'Medical Center & Clinic Support',
      desc: 'A safe campus requires dedicated health services. Our clinic offers daily consultations and coordinates immediate emergency responses.',
      icon: FiHeart,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      details: [
        'Doctor hours: Registered medical officer available daily from 9:30 AM to 4:30 PM.',
        'Diagnostics: Basic blood pressure, blood glucose, and ECG units.',
        'Emergency response: Dedicated ambulance contact and direct tie-up with local general hospitals.',
        'Rehab assets: Simple physical therapy items and sports injury recovery aids.'
      ]
    }
  ];

  const tableData = [
    { metric: 'Academic Campus Area', value: '4.5 Acres (Dhaka Main Site)' },
    { metric: 'Library Printed Volumes', value: '50,000+ reference textbooks' },
    { metric: 'Total Computer Workstations', value: '150 client nodes in central labs' },
    { metric: 'Solar Power Installation', value: '80 kW rooftop grid connection' },
    { metric: 'Internet Backbone Link', value: '1 Gbps symmetric fiber connection' },
    { metric: 'Hostel Bed Capacity', value: '450 twin-share residential spots' }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Navigation back */}
        <div className="flex justify-between items-center">
          <Link
            href="/about/campus"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <FiArrowLeft className="text-sm" />
            Back to Campus Overview
          </Link>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Detailed Specs
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Fontana Campus Details
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Review the exact technical parameters, licensing databases, laboratory equipment, and hostel guidelines of Fontana Institute.
          </p>
        </div>

        {/* Detailed Specs list */}
        <div className="flex flex-col gap-8">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5"
              >
                <div className="flex gap-4 items-center border-b border-slate-50 pb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${item.color}`}>
                    <Icon className="text-base sm:text-lg" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-650 list-none pl-0">
                  {item.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex gap-2.5 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-2" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Quick Parameters Table */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex gap-3 items-center border-b border-slate-55 pb-4">
            <FiAward className="text-xl text-sky-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Key Metrics & Inventory Table
            </h3>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-100 text-xs sm:text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-extrabold">
                <tr>
                  <th className="px-6 py-3.5">Campus Asset / Parameter</th>
                  <th className="px-6 py-3.5">Specifications & Values</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-800">{row.metric}</td>
                    <td className="px-6 py-3.5">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampusDetailsPage;