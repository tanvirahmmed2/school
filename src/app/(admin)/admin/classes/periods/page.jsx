'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiClock, FiList } from 'react-icons/fi';

const AdminPeriodsPage = () => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:50');
  const [submitting, setSubmitting] = useState(false);

  const fetchPeriods = async () => {
    try {
      const response = await fetch('/api/periods');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch periods.');
      setPeriods(data.paylod?.periods || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !startTime || !endTime) {
      toast.error('All fields are required.');
      return;
    }
    if (startTime >= endTime) {
      toast.error('Start time must be strictly before end time.');
      return;
    }

    setSubmitting(true);
    try {
      const isEditing = !!editingPeriod;
      const url = isEditing ? `/api/periods/${editingPeriod.id}` : '/api/periods';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, start_time: startTime, end_time: endTime })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Operation failed.');

      toast.success(data.message || (isEditing ? 'Period updated successfully!' : 'Period created successfully!'));
      
      // Reset form
      setName('');
      setStartTime('09:00');
      setEndTime('09:50');
      setShowAddForm(false);
      setEditingPeriod(null);
      
      fetchPeriods();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (period) => {
    setEditingPeriod(period);
    setName(period.name);
    setStartTime(period.start_time);
    setEndTime(period.end_time);
    setShowAddForm(true);
  };

  const handleDeletePeriod = async (id, periodName) => {
    const confirm = window.confirm(`Are you sure you want to delete "${periodName}"? This will delete all routine slots mapped to this period!`);
    if (!confirm) return;

    try {
      const response = await fetch(`/api/periods/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to delete period.');

      toast.success(data.message || 'Period deleted successfully!');
      setPeriods(periods.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiClock className="text-blue-600" /> Routine Period Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure schedule periods and daily class time blocks.
          </p>
        </div>

        <button
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingPeriod(null);
              setName('');
            } else {
              setShowAddForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
        >
          {showAddForm ? (
            <>
              <FiX className="text-lg" /> Close Form
            </>
          ) : (
            <>
              <FiPlus className="text-lg" /> Add Period
            </>
          )}
        </button>
      </div>

      {/* Form Card */}
      {showAddForm && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <FiClock className="text-blue-600" /> {editingPeriod ? 'Edit Routine Period' : 'Create Routine Period'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Period Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Period 1, Lunch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPeriod(null);
                  setName('');
                }}
                disabled={submitting}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Save Period'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Registry Table */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FiList className="text-slate-400" /> Active Time Periods ({periods.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading periods...</span>
          </div>
        ) : periods.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-5xl mb-3">🕒</span>
            <h3 className="text-sm font-bold text-slate-650">No Periods Defined</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Set up schedule blocks (e.g., Class 1, Lunch) to map routine classes.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Period Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map((period) => (
                  <tr key={period.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center font-bold text-xs">
                          {period.name.substring(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{period.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            DB Key: {period.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                        {period.start_time}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-655 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-600">
                        {period.end_time}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(period)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Edit Period"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeletePeriod(period.id, period.name)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-655 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Delete Period"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPeriodsPage;
