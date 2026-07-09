'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiActivity, FiTag, FiBookOpen } from 'react-icons/fi';

const AdminClubsNewPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/clubs');
      setClubs(response.data.clubs || []);
    } catch (error) {
      toast.error('Failed to load clubs registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Club Name is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (editId) {
        const response = await axios.put(`/api/clubs/${editId}`, { name, slug, description });
        toast.success(response.data.message || 'Club details updated successfully!');
        setEditId(null);
      } else {
        const response = await axios.post('/api/clubs', { name, slug, description });
        toast.success(response.data.message || 'Club registered successfully!');
      }

      setName('');
      setSlug('');
      setDescription('');
      fetchClubs();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (club) => {
    setEditId(club.id);
    setName(club.name);
    setSlug(club.slug);
    setDescription(club.description || '');
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleDeleteClub = async (id, clubName) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${clubName}"? This will permanently delete all logs, assigned admins, registers, and student memberships.`
    );
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/clubs/${id}`);
      toast.success(response.data.message || 'Club deleted.');
      setClubs(prev => prev.filter(c => c.id !== id));
      if (editId === id) {
        handleCancelEdit();
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
          <FiActivity className="text-blue-600" /> Student Clubs & Societies
        </h1>
        <p className="text-sm text-slate-500">
          Create, edit, or remove school club registries and co-curricular programs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Form panel */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiPlus className="text-blue-600" /> 
            {editId ? 'Modify Club Profile' : 'Register New Club'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Club Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Debating Society"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FiTag /> Slug (Optional URL handle)
              </label>
              <input
                type="text"
                placeholder="e.g. debating-society"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FiBookOpen /> Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of the club's objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                  editId ? 'bg-indigo-650 hover:bg-indigo-700 bg-indigo-600' : 'bg-blue-600 hover:bg-blue-700 w-full'
                } ${editId && 'w-1/2'} disabled:opacity-50`}
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : editId ? (
                  'Update Club'
                ) : (
                  'Create Club'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* List panel */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">
              Active Clubs Registry ({clubs.length})
            </h2>
          </div>

          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading clubs list...</span>
            </div>
          ) : clubs.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-350 text-5xl mb-3">🎨</span>
              <h3 className="text-sm font-bold text-slate-655">No Clubs Registered</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Pre-populate school club registries using the form on the left.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Club Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clubs.map((club) => (
                    <tr key={club.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{club.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">/{club.slug}</td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-[240px] truncate">
                        {club.description || <span className="text-slate-300 italic">No description</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(club)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors cursor-pointer"
                          title="Edit Club details"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteClub(club.id, club.name)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="Delete Club"
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

export default AdminClubsNewPage;
