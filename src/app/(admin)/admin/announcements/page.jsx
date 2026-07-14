'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiBell, FiPlus, FiTrash2, FiTag, FiBookOpen, FiMapPin, FiLayers } from 'react-icons/fi';

const AdminAnnouncementsPage = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [totalRoom, setTotalRoom] = useState('');
  const [location, setLocation] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/announcements');
      const active = response.data.paylod.announcement;
      setAnnouncement(active);
      if (active) {
        setName(active.name || '');
        setSlug(active.slug || '');
        setDescription(active.description || '');
        setTotalRoom(active.total_room !== null ? active.total_room : '');
        setLocation(active.location || '');
      } else {
        clearForm();
      }
    } catch (error) {
      toast.error('Failed to load active announcement.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setTotalRoom('');
    setLocation('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Announcement Title (Name) is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        slug,
        description,
        total_room: totalRoom !== '' ? parseInt(totalRoom, 10) : null,
        location
      };

      const response = await axios.post('/api/announcements', payload);
      toast.success(response.data.message || 'Announcement updated successfully!');
      fetchAnnouncement();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to remove the current announcement?');
    if (!confirm) return;

    try {
      const response = await axios.delete('/api/announcements');
      toast.success(response.data.message || 'Announcement deleted.');
      setAnnouncement(null);
      clearForm();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiBell className="text-amber-600" /> Website Homepage Announcement
        </h1>
        <p className="text-sm text-slate-500">
          Publish a single system announcement that will pop up to visitors when they land on the home page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form panel */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiPlus className="text-amber-600" /> 
            {announcement ? 'Update Active Announcement' : 'Create Homepage Announcement'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Announcement Name / Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Admission Open for Session 2026-27"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiTag /> Slug (Optional URL handle)
                </label>
                <input
                  type="text"
                  placeholder="e.g. admission-open-2026"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiMapPin /> Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campus Auditorium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiLayers /> Total Room (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={totalRoom}
                  onChange={(e) => setTotalRoom(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FiBookOpen /> Description
              </label>
              <textarea
                rows={4}
                required
                placeholder="Details of the announcement, guidelines, eligibility criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              {announcement && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FiTrash2 /> Remove Announcement
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : announcement ? (
                  'Update Announcement'
                ) : (
                  'Publish Announcement'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
            <h2 className="text-base font-bold text-slate-800 mb-4">Live Preview Status</h2>
            {loading ? (
              <div className="py-6 flex justify-center">
                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : announcement ? (
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <FiBell /> Active Broadcast
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{announcement.name}</h3>
                  <p className="text-xs text-slate-400">/{announcement.slug}</p>
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {announcement.description}
                </p>
                {(announcement.location || announcement.total_room !== null) && (
                  <div className="border-t border-slate-100 pt-2 flex flex-col gap-1 text-[11px] text-slate-500">
                    {announcement.location && (
                      <div><strong>Location:</strong> {announcement.location}</div>
                    )}
                    {announcement.total_room !== null && (
                      <div><strong>Total Rooms:</strong> {announcement.total_room}</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-slate-200 rounded-2xl">
                <span className="text-2xl">📭</span>
                <p className="text-xs font-semibold text-slate-400 mt-2">No Active Announcement</p>
                <p className="text-[10px] text-slate-400 px-4 mt-0.5">
                  Use the editor to publish a notice to all visitors.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementsPage;
