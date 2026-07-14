'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUsers, FiPlus, FiTrash2, FiSearch, FiCheck, FiXCircle, FiCalendar, FiHome } from 'react-icons/fi';

const AdminHostelAllocationsPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search student states
  const [searchRegNo, setSearchRegNo] = useState('');
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [foundStudent, setFoundStudent] = useState(null);

  // Form states
  const [roomId, setRoomId] = useState('');
  const [allocatedAt, setAllocatedAt] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllocations();
    fetchAvailableRooms();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/hostel-allocations');
      setAllocations(response.data.paylod.allocations || []);
    } catch (error) {
      toast.error('Failed to load room allocations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get('/api/hostel-rooms');
      // Only list rooms that have 'Available' status
      const allRooms = response.data.paylod.rooms || [];
      const available = allRooms.filter(r => r.availability_status === 'Available');
      setRooms(available);
    } catch (error) {
      console.error('Failed to fetch rooms list:', error);
    }
  };

  const handleSearchStudent = async () => {
    if (!searchRegNo.trim()) {
      toast.error('Enter a registration number.');
      return;
    }

    setSearchingStudent(true);
    setFoundStudent(null);
    try {
      const response = await axios.get(`/api/students?registration_number=${searchRegNo.trim()}`);
      const students = response.data.paylod.students || [];
      if (students.length === 0) {
        toast.error('No student found with this registration number.');
      } else {
        // Find the exact match or first match
        const match = students.find(
          s => s.registration_number.toLowerCase() === searchRegNo.trim().toLowerCase()
        ) || students[0];
        
        setFoundStudent(match);
        toast.success(`Verified: ${match.name || 'Pre-created student'}`);
      }
    } catch (error) {
      toast.error('Failed to search student record.');
    } finally {
      setSearchingStudent(false);
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!foundStudent) {
      toast.error('Verify and select a student first.');
      return;
    }
    if (!roomId) {
      toast.error('Select a room to allocate.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/hostel-allocations', {
        student_id: foundStudent.id,
        room_id: roomId,
        allocated_at: allocatedAt
      });

      toast.success(response.data.message || 'Room allocated successfully!');
      setFoundStudent(null);
      setSearchRegNo('');
      setRoomId('');
      fetchAllocations();
      fetchAvailableRooms(); // Refresh rooms capacity status
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVacateRoom = async (id, studentName) => {
    const confirm = window.confirm(`Mark "${studentName}" as vacated from room?`);
    if (!confirm) return;

    try {
      const vacateDate = new Date().toISOString().split('T')[0];
      const response = await axios.put(`/api/hostel-allocations/${id}`, {
        status: 'Vacated',
        vacated_at: vacateDate
      });

      toast.success(response.data.message || 'Room marked as vacated.');
      fetchAllocations();
      fetchAvailableRooms();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteAllocation = async (id) => {
    const confirm = window.confirm('Are you sure you want to permanently delete this allocation log record?');
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/hostel-allocations/${id}`);
      toast.success(response.data.message || 'Allocation record deleted.');
      setAllocations(prev => prev.filter(a => a.id !== id));
      fetchAvailableRooms();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiUsers className="text-sky-655 text-sky-600" /> Room Allocation Registry
        </h1>
        <p className="text-sm text-slate-500">
          Assign students to hostel rooms, verify occupancies, and process checkout vacations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Allocations Form Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-5">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FiPlus className="text-sky-600" /> Allocate Space
            </h2>
            <p className="text-[11px] text-slate-450 text-slate-400">
              Verify the student registration number first, then select an available room.
            </p>
          </div>

          {/* Student Search Section */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Registration No.
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. REG-10293"
                value={searchRegNo}
                onChange={(e) => setSearchRegNo(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={handleSearchStudent}
                disabled={searchingStudent}
                className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors cursor-pointer"
                title="Search student registration"
              >
                {searchingStudent ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSearch />
                )}
              </button>
            </div>

            {/* Found student confirmation */}
            {foundStudent && (
              <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-800">{foundStudent.name || 'Unnamed Student'}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {foundStudent.class_name || 'Class N/A'} • Gender: {foundStudent.gender || 'Unspecified'}
                  </span>
                </div>
                <FiCheck className="text-emerald-600 font-bold" />
              </div>
            )}
          </div>

          {/* Allocation Details form */}
          <form onSubmit={handleAllocate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Available Room
              </label>
              <select
                required
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
              >
                <option value="">-- Choose Room --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.hostel_name} ({r.hostel_gender || 'Unspecified'} Only) - Room {r.room_number} ({r.room_type}, capacity: {r.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FiCalendar /> Allocation Date
              </label>
              <input
                type="date"
                required
                value={allocatedAt}
                onChange={(e) => setAllocatedAt(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !foundStudent}
              className="py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer bg-sky-650 hover:bg-sky-700 w-full disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed mt-2 bg-sky-600"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                'Allocate Space'
              )}
            </button>
          </form>
        </div>

        {/* Allocations Logs List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">
              Allocations History ({allocations.length})
            </h2>
          </div>

          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading allocation registry...</span>
            </div>
          ) : allocations.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-350 text-5xl mb-3">📋</span>
              <h3 className="text-sm font-bold text-slate-655">No Allocations Registered</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Search students and assign them beds to display logs here.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hostel & Room</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Allocation Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allocations.map((alloc) => (
                    <tr key={alloc.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                        <div className="flex flex-col">
                          <span>{alloc.student_name || 'Unnamed Student'}</span>
                          <span className="text-[10px] text-slate-450 text-slate-400 font-semibold">{alloc.student_reg_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                        <div className="flex flex-col">
                          <span>{alloc.hostel_name}</span>
                          <span className="text-[10px] font-bold text-slate-500">Room {alloc.room_number} ({alloc.room_type})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-550 flex flex-col mt-2">
                        <span><strong>Allocated:</strong> {new Date(alloc.allocated_at).toLocaleDateString()}</span>
                        {alloc.vacated_at && (
                          <span className="text-red-500 font-semibold">
                            <strong>Vacated:</strong> {new Date(alloc.vacated_at).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                          alloc.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {alloc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                        {alloc.status === 'Active' && (
                          <button
                            onClick={() => handleVacateRoom(alloc.id, alloc.student_name)}
                            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors cursor-pointer"
                            title="Mark Vacated"
                          >
                            <FiXCircle className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAllocation(alloc.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="Delete Log Record"
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
    </div>
  );
};

export default AdminHostelAllocationsPage;
