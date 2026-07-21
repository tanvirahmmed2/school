'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiSearch, FiLayers, FiChevronDown, FiRefreshCw } from 'react-icons/fi';

const statusBadge = (status) => {
  if (status === 'Present')
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
        Present
      </span>
    );
  if (status === 'Absent')
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
        Absent
      </span>
    );
  if (status === 'Late')
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
        Late
      </span>
    );
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-500">
      {status}
    </span>
  );
};

const AttendanceViewPage = () => {
  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterClassId, setFilterClassId] = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState('');
  const [filterPeriodId, setFilterPeriodId] = useState('');

  // Data
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Dropdown options for filtering
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);

  // Load filter metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch('/api/teacher/attendance-dropdowns');
        const data = await res.json();
        if (res.ok && data.success) {
          const { assignments, periods } = data.paylod;

          // Unique class options
          const classesMap = new Map();
          for (const a of assignments || []) {
            const label = `Class ${a.class_name}${a.section_name ? ` · Sec ${a.section_name}` : ''}`;
            classesMap.set(a.class_id, label);
          }
          setClassOptions([...classesMap.entries()].map(([id, name]) => ({ id, name })));

          // Unique subject options
          const subjectsMap = new Map();
          for (const a of assignments || []) {
            subjectsMap.set(a.subject_id, `${a.subject_name} (${a.subject_code})`);
          }
          setSubjectOptions([...subjectsMap.entries()].map(([id, name]) => ({ id, name })));

          // Period options
          setPeriodOptions((periods || []).map(p => ({
            id: p.id,
            name: `${p.name} (${p.start_time} – ${p.end_time})`
          })));
        }
      } catch (err) {
        console.error('Failed to load filters metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setFetched(false);
    try {
      const params = new URLSearchParams({ mode: 'records' });
      if (filterDate) params.append('date', filterDate);
      if (filterClassId) params.append('class_id', filterClassId);
      if (filterSubjectId) params.append('subject_id', filterSubjectId);
      if (filterPeriodId) params.append('period_id', filterPeriodId);

      const res = await fetch(`/api/teacher/attendence?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        const rows = data.paylod.records || [];
        setRecords(rows);
      } else {
        toast.error(data.message || 'Failed to load records.');
      }
    } catch {
      toast.error('Error loading attendance records.');
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [filterDate, filterClassId, filterSubjectId, filterPeriodId]);

  // Fetch records whenever filters change or on mount
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Group records by date for display
  const groupedByDate = records.reduce((acc, r) => {
    const d = r.date ? String(r.date).split('T')[0] : 'Unknown';
    if (!acc[d]) acc[d] = [];
    acc[d].push(r);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount  = records.filter((r) => r.status === 'Absent').length;
  const lateCount    = records.filter((r) => r.status === 'Late').length;

  return (
    <div className="flex flex-col gap-8 w-full mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Attendance Records</h1>
        <p className="text-slate-500 text-sm font-medium">
          View all attendance you have recorded across your classes. Use the filters to narrow results.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col gap-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Records</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiCalendar className="text-xs" /> Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Class */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class</label>
            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">— All Classes —</option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">— All Subjects —</option>
              {subjectOptions.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Period</label>
            <select
              value={filterPeriodId}
              onChange={(e) => setFilterPeriodId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">— All Periods —</option>
              {periodOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchRecords}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
          >
            <FiSearch className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Searching...' : 'Search Records'}</span>
          </button>
          {(filterDate || filterClassId || filterSubjectId || filterPeriodId) && (
            <button
              onClick={() => {
                setFilterDate('');
                setFilterClassId('');
                setFilterSubjectId('');
                setFilterPeriodId('');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-slate-500 hover:text-slate-700 rounded-2xl text-xs font-bold border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FiRefreshCw className="text-xs" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {fetched && records.length > 0 && (
        <div className="grid grid-cols-3 gap-4 -mt-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
            <p className="text-2xl font-black text-slate-800">{records.length}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Present</p>
            <p className="text-2xl font-black text-emerald-700">{presentCount}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Absent</p>
            <p className="text-2xl font-black text-rose-600">{absentCount}</p>
          </div>
        </div>
      )}

      {/* Records list */}
      {loading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading records...</p>
          </div>
        </div>
      ) : fetched && records.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiLayers className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Records Found</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">
            No attendance records match your filters. Try adjusting or clearing them, or go to{' '}
            <a href="/teacher/attendance/record" className="text-indigo-600 font-bold hover:underline">
              Record Attendance
            </a>{' '}
            to add some.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedDates.map((date) => {
            const dayRecords = groupedByDate[date];
            const d = new Date(date + 'T00:00:00');
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            return (
              <div key={date} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-4">
                {/* Date header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-800">{dayLabel}</h2>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{dayRecords.length} records</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                      ✓ {dayRecords.filter((r) => r.status === 'Present').length}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                      ✗ {dayRecords.filter((r) => r.status === 'Absent').length}
                    </span>
                    {dayRecords.filter((r) => r.status === 'Late').length > 0 && (
                      <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                        ⧗ {dayRecords.filter((r) => r.status === 'Late').length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Records table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">#</th>
                        <th className="pb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student</th>
                        <th className="pb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class</th>
                        <th className="pb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                        <th className="pb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Period</th>
                        <th className="pb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                        <th className="pb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayRecords.map((r, i) => (
                        <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                          <td className="py-3 text-xs text-slate-400 font-bold">{i + 1}</td>
                          <td className="py-3">
                            <p className="text-sm font-bold text-slate-800">{r.student_name}</p>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              {r.registration_number}
                            </span>
                          </td>
                          <td className="py-3 text-xs font-semibold text-slate-600">
                            {r.class_name}{r.section_name ? ` · ${r.section_name}` : ''}
                          </td>
                          <td className="py-3 text-xs font-semibold text-slate-600">{r.subject_name}</td>
                          <td className="py-3 text-xs font-semibold text-slate-600">
                            {r.period_name}
                            <span className="block text-[10px] text-slate-400">
                              {r.period_start_time} – {r.period_end_time}
                            </span>
                          </td>
                          <td className="py-3 text-center">{statusBadge(r.status)}</td>
                          <td className="py-3 text-xs text-slate-500">{r.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceViewPage;
