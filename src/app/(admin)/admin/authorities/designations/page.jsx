'use client';

import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  FiAward,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiLayers,
  FiHash,
  FiRefreshCw
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';

export default function DesignationsManagementPage() {
  const { setDesignations: setContextDesignations } = useContext(Context);

  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSlugUserEdited, setIsSlugUserEdited] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [editingDesignation, setEditingDesignation] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // Auto-generate slug from title
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/authorities/designations');
      const fetched = res.data.paylod?.designations || [];
      setDesignations(fetched);
      if (setContextDesignations) {
        setContextDesignations(fetched);
      }
    } catch (err) {
      console.error('Error loading designations:', err);
      toast.error('Failed to load designations list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  // Title change handler in Create Modal
  const handleCreateTitleChange = (e) => {
    const val = e.target.value;
    setNewTitle(val);
    if (!isSlugUserEdited) {
      setNewSlug(slugify(val));
    }
  };

  const handleCreateSlugChange = (e) => {
    setNewSlug(e.target.value);
    setIsSlugUserEdited(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) {
      toast.error('Title and Slug are required.');
      return;
    }

    setCreateLoading(true);
    try {
      const res = await axios.post('/api/authorities/designations', {
        title: newTitle.trim(),
        slug: newSlug.trim().toLowerCase(),
        description: newDescription.trim() || null
      });

      toast.success(res.data.message || 'Designation created successfully.');
      setIsCreateOpen(false);
      setNewTitle('');
      setNewSlug('');
      setNewDescription('');
      setIsSlugUserEdited(false);
      fetchDesignations();
    } catch (err) {
      console.error('Error creating designation:', err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to create designation.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = (des) => {
    setEditingDesignation(des);
    setEditTitle(des.title || '');
    setEditSlug(des.slug || '');
    setEditDescription(des.description || '');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editSlug.trim()) {
      toast.error('Title and Slug are required.');
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await axios.put(`/api/authorities/designations/${editingDesignation.id}`, {
        title: editTitle.trim(),
        slug: editSlug.trim().toLowerCase(),
        description: editDescription.trim() || null
      });

      toast.success(res.data.message || 'Designation updated successfully.');
      setEditingDesignation(null);
      fetchDesignations();
    } catch (err) {
      console.error('Error updating designation:', err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to update designation.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this designation?')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await axios.delete(`/api/authorities/designations/${id}`);
      toast.success(res.data.message || 'Designation deleted successfully.');
      fetchDesignations();
    } catch (err) {
      console.error('Error deleting designation:', err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to delete designation.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered designations
  const filteredDesignations = useMemo(() => {
    if (!searchQuery.trim()) return designations;
    const query = searchQuery.toLowerCase().trim();
    return designations.filter(
      (d) =>
        (d.title && d.title.toLowerCase().includes(query)) ||
        (d.slug && d.slug.toLowerCase().includes(query)) ||
        (d.description && d.description.toLowerCase().includes(query))
    );
  }, [designations, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0 shadow-xs">
            <FiAward />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Designations Management
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Create, update, and manage official designations for institutional board members and leadership staff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDesignations}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer text-sm"
            title="Refresh List"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => {
              setIsCreateOpen(true);
              setNewTitle('');
              setNewSlug('');
              setNewDescription('');
              setIsSlugUserEdited(false);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex items-center gap-2 cursor-pointer"
          >
            <FiPlus className="text-sm" /> Add Designation
          </button>
        </div>
      </div>

      {/* Metrics Card & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-lg">
            <FiLayers />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Designations</span>
            <h3 className="text-2xl font-black text-slate-800">{designations.length}</h3>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-slate-100 flex items-center shadow-xs">
          <div className="relative w-full flex items-center">
            <FiSearch className="absolute left-4 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Search by designation title, slug, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Designations Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading designations list...</span>
          </div>
        ) : filteredDesignations.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2 text-center px-4">
            <FiAward className="text-4xl text-slate-300 mb-1" />
            <span className="text-sm font-bold text-slate-500">
              {searchQuery ? 'No designations found matching your query.' : 'No designations created yet.'}
            </span>
            <p className="text-xs text-slate-400 max-w-sm">
              {searchQuery
                ? 'Try searching with different keywords or clear the search filter.'
                : 'Click "Add Designation" button above to create your first official designation.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Slug</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDesignations.map((des, index) => (
                  <tr key={des.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">{index + 1}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <FiAward className="text-blue-600 shrink-0 text-base" />
                        <span>{des.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs px-2.5 py-1 rounded-lg">
                        <FiHash className="text-slate-400 text-[10px]" /> {des.slug}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                      {des.description || <span className="text-slate-300 italic">No description provided</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(des)}
                          className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-xl transition-all cursor-pointer"
                          title="Edit Designation"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(des.id)}
                          disabled={deletingId === des.id}
                          className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                          title="Delete Designation"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiPlus className="text-lg" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">Add New Designation</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Director, Principal"
                  value={newTitle}
                  onChange={handleCreateTitleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Slug <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">Auto-generated identifier</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. executive-director"
                  value={newSlug}
                  onChange={handleCreateSlugChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief role description or details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Save Designation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingDesignation && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FiEdit2 className="text-lg" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">Edit Designation</h3>
              </div>
              <button
                onClick={() => setEditingDesignation(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Director"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. executive-director"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief role description or details..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDesignation(null)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {updateLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Designation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
