'use client';

import React, { useEffect, useState } from 'react';
import { FiHome, FiMapPin, FiUser, FiInfo, FiLayers } from 'react-icons/fi';
import Link from 'next/link';

const HostelFacilities = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch('/api/hostels');
        if (res.ok) {
          const data = await res.json();
          setHostels(data.paylod?.hostels || []);
        }
      } catch (err) {
        console.error('Error fetching hostels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Residences
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Residential Housing Directory
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Secure housing accommodations for active FIT students. Rooms are allocated matching student profile genders.
          </p>
        </div>

        {/* Dynamic Hostels Directory */}
        {loading ? (
          <div className="w-full py-12 flex justify-center bg-white rounded-3xl border border-slate-100 shadow-xs">
            <div className="w-8 h-8 border-2 border-sky-655 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : hostels.length === 0 ? (
          <div className="w-full py-12 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center p-6 shadow-xs">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-sm mb-3">
              <FiInfo />
            </div>
            <p className="text-slate-400 text-xs font-medium">No hostel records registered in the directory directory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostels.map((hostel) => (
              <div
                key={hostel.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col gap-4 hover:shadow-xs transition-shadow"
              >
                {hostel.image ? (
                  <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-50 relative shrink-0">
                    <img src={hostel.image} alt={hostel.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-300 relative shrink-0">
                    <FiHome className="text-4xl" />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-slate-800 text-base">{hostel.name}</h3>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider shrink-0 ${
                      hostel.gender === 'Male'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : hostel.gender === 'Female'
                        ? 'bg-pink-50 text-pink-600 border border-pink-100'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {hostel.gender || 'Unspecified'} Only
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <FiMapPin /> {hostel.location}
                  </span>
                  
                  {hostel.description && (
                    <p className="text-slate-500 text-xs leading-relaxed mt-1 line-clamp-3">
                      {hostel.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <FiLayers /> {hostel.total_room || 0} rooms
                  </span>
                  <Link href="/auth/student/login" className="text-sky-600 hover:text-sky-800 transition-colors">
                    Login to Request Room →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Validation rule warning box */}
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 md:p-8 mt-8 shadow-xs flex gap-4 text-xs sm:text-sm text-amber-800 leading-relaxed items-start">
          <FiInfo className="text-amber-550 text-lg shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-amber-900">Important Allocation Policies</h4>
            <p className="text-xs">
              Room allocation matching rules are strictly hardcoded. Male students are allowed room allocations exclusively inside Male Designated Hostels, and Female students exclusively inside Female Designated Hostels. Attempted cross-gender allocations will be rejected by the portal registration API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelFacilities;