'use client';

import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';

const CouncilPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouncil = async () => {
      try {
        const res = await fetch('/api/authorities');
        if (res.ok) {
          const data = await res.json();
          const list = data.paylod.authorities || [];
          const filtered = list.filter(m => m.designation === 'council');
          if (filtered.length > 0) {
            setMembers(filtered.map(m => ({
              name: m.name,
              designation: 'Academic Council Member',
              department: m.bio || 'Academic Senate Faculty'
            })));
          } else {
            // Default mock fallback
            setMembers([
              { name: 'Prof. Dr. Rahman', designation: 'Chairman / Principal', department: 'Executive Board' },
              { name: 'Dr. Sarah Islam', designation: 'Member Secretary / Registrar', department: 'Registry Administration' },
              { name: 'Prof. Anisul Haque', designation: 'Senior Member', department: 'Computer Science & Engineering' },
              { name: 'Dr. Farhana Yasmin', designation: 'Member', department: 'Electrical & Electronics Engineering' },
              { name: 'Mr. Rafiqul Bari', designation: 'Member', department: 'School of Business' }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Council:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCouncil();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Academic Senate
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Academic Council
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            The Council regulates curricula, defines grading metrics, and oversees standard academic processes at the institute.
          </p>
        </div>

        {/* Council Table list */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FiUsers className="text-xl text-sky-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">Council Committee Roster</h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-slate-605">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Department Division</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {members.map((member, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{member.name}</td>
                      <td className="py-3.5 px-4 text-sky-650">{member.designation}</td>
                      <td className="py-3.5 px-4 text-slate-500">{member.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouncilPage;
