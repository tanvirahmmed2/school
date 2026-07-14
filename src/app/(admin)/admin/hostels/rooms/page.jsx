'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiGrid, FiPlus, FiEdit, FiTrash2, FiHome, FiCheckCircle } from 'react-icons/fi';

const AdminHostelRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterHostelId, setFilterHostelId] = useState('');

  // Form states
  const [hostelId, setHostelId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Non-AC Double');
  const [capacity, setCapacity] = useState('2');
  const [availabilityStatus, setAvailabilityStatus] = useState('Available');
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHostels();
    fetchRooms();
  }, [filterHostelId]);

  const fetchHostels = async () => {
    try {
      const response = await axios.get('/api/hostels');
      setHostels(response.data.paylod.hostels || []);
    } catch (error) {
      console.error('Failed to load hostels:', error);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const url = filterHostelId 
        ? `/api/hostel-rooms?hostel_id=${filterHostelId}`
        : '/api/hostel-rooms';
      const response = await axios.get(url);
      setRooms(response.data.paylod.rooms || []);
    } catch (error) {
      toast.error('Failed to load rooms registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hostelId || !roomNumber || !roomType || !capacity) {
      toast.error('All fields except status are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        hostel_id: hostelId,
        room_number: roomNumber,
        room_type: roomType,
        capacity: parseInt(capacity, 10),
        availability_status: availabilityStatus
      };

      if (editId) {
        const response = await axios.put(`/api/hostel-rooms/${editId}`, payload);
        toast.success(response.data.message || 'Room details updated!');
        setEditId(null);
      } else {
        const response = await axios.post('/api/hostel-rooms', payload);
        toast.success(response.data.message || 'Room created!');
      }

      clearForm();
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const clearForm = () => {
    setHostelId('');
    setRoomNumber('');
    setRoomType('Non-AC Double');
    setCapacity('2');
    setAvailabilityStatus('Available');
    setEditId(null);
  };

  const handleEditClick = (room) => {
    setEditId(room.id);
    setHostelId(room.hostel_id);
    setRoomNumber(room.room_number);
    setRoomType(room.room_type);
    setCapacity(room.capacity.toString());
    setAvailabilityStatus(room.availability_status);
  };

  const handleDeleteRoom = async (id, roomNum, hostelName) => {
    const confirm = window.confirm(
      `Are you sure you want to delete room "${roomNum}" of "${hostelName}"? This will permanently release all student allocations associated with it.`
    );
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/hostel-rooms/${id}`);
      toast.success(response.data.message || 'Room deleted.');
      setRooms(prev => prev.filter(r => r.id !== id));
      if (editId === id) {
        clearForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiGrid className="text-emerald-600" /> Hostel Rooms Directory
        </h1>
        <p className="text-sm text-slate-500">
          Configure rooms, bedding capacities, AC/Non-AC categories, and status checks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form panel */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiPlus className="text-emerald-600" /> 
            {editId ? 'Modify Room Details' : 'Register New Room'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Hostel
              </label>
              <select
                required
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              >
                <option value="">-- Choose Hostel --</option>
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Room Number / Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Block A-102"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Room Category / Type
              </label>
              <select
                required
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              >
                <option value="AC Single">AC Single</option>
                <option value="AC Double">AC Double</option>
                <option value="Non-AC Single">Non-AC Single</option>
                <option value="Non-AC Double">Non-AC Double</option>
                <option value="Non-AC Quadruple (4-Bed)">Non-AC Quadruple (4-Bed)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Bedding Capacity (Students)
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                placeholder="e.g. 2"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </label>
              <select
                required
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              >
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {editId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                  editId ? 'bg-emerald-600 hover:bg-emerald-700 w-1/2' : 'bg-emerald-650 hover:bg-emerald-700 w-full bg-emerald-600'
                } disabled:opacity-50`}
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : editId ? (
                  'Update Room'
                ) : (
                  'Register Room'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* List panel */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          {/* Filtering Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-base font-bold text-slate-800">
              Active Room Inventory ({rooms.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Hostel:</span>
              <select
                value={filterHostelId}
                onChange={(e) => setFilterHostelId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white"
              >
                <option value="">All Hostels</option>
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading rooms registry...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-350 text-5xl mb-3">🛏️</span>
              <h3 className="text-sm font-bold text-slate-655">No Rooms Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Create room entries for residential halls using the form on the left.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hostel</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Room Number</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type / Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                        {room.hostel_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-2.5">
                        <FiHome className="text-slate-400" /> {room.room_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-550">
                        {room.room_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                        {room.capacity} beds
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                          room.availability_status === 'Available'
                            ? 'bg-emerald-50 text-emerald-600'
                            : room.availability_status === 'Full'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-650 text-red-600'
                        }`}>
                          {room.availability_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(room)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors cursor-pointer"
                          title="Edit Room"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id, room.room_number, room.hostel_name)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="Delete Room"
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

export default AdminHostelRoomsPage;
