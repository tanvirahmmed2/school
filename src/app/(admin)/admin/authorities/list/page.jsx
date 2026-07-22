'use client';

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUsers, FiEdit2, FiTrash2, FiAward, FiMail, FiPhone, FiInfo, FiPlus, FiCamera, FiUpload, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { Context } from '@/component/helper/Context';

const DESIGNATION_LABELS = {
  chairman: 'Chairman',
  director: 'Managing Director',
  principal: 'Principal',
  registrar: 'Registrar',
  council: 'Academic Council Member',
  officers: 'Executive Officer',
  staff: 'Support Staff'
};

const DESIGNATIONS = [
  { value: 'chairman', label: 'Chairman' },
  { value: 'director', label: 'Managing Director' },
  { value: 'principal', label: 'Principal' },
  { value: 'registrar', label: 'Registrar' },
  { value: 'council', label: 'Academic Council Member' },
  { value: 'officers', label: 'Executive Officer' },
  { value: 'staff', label: 'Support Staff' }
];

export default function AuthoritiesListPage() {
  const { designations } = useContext(Context);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/authorities');
      setMembers(res.data.paylod.authorities || []);
    } catch (err) {
      toast.error('Failed to load board members registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this board member? This will delete all their qualifications and profile photo.')) return;

    try {
      await axios.delete(`/api/authorities/${id}`);
      toast.success('Member removed successfully.');
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete member.');
    }
  };

  const handleEditClick = (member) => {
    setEditingMember({ ...member });
    setPreview(member.image || '');
  };

  const handleEditChange = (e) => {
    setEditingMember({
      ...editingMember,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setEditingMember(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingMember.name.trim() || !editingMember.designation) {
      toast.error('Name and designation are required.');
      return;
    }

    setSaveLoading(true);
    try {
      const res = await axios.put(`/api/authorities/${editingMember.id}`, editingMember);
      toast.success(res.data.message || 'Board member details updated.');
      setEditingMember(null);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update member.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FiUsers className="text-blue-600" /> Governing Board Registry
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage institutional administration members, bios, contact details, and qualifications.
          </p>
        </div>
        <div>
          <Link
            href="/admin/authorities/new"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex items-center gap-2"
          >
            <FiPlus className="text-sm" /> Add Member
          </Link>
        </div>
      </div>

      {/* Grid Roster */}
      {loading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3 bg-white border border-slate-100 rounded-3xl">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-400">Loading roster files...</span>
        </div>
      ) : members.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-2 bg-white border border-slate-100 rounded-3xl text-center">
          <span className="text-sm font-bold text-slate-400">No board members onboarded yet.</span>
          <p className="text-xs text-slate-400">Onboard a member first to begin managing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(m => (
            <div key={m.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col h-full hover:border-blue-200 transition-all duration-200 group">
              {/* Photo & Identity */}
              <div className="p-6 pb-4 flex items-center gap-4 border-b border-slate-50">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-150 bg-slate-50 shrink-0 shadow-sm flex items-center justify-center text-slate-400">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold">{m.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">{m.name}</h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100/50 mt-1 capitalize">
                    {m.designation_title || DESIGNATION_LABELS[m.designation] || m.designation}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 py-4 flex flex-col gap-3 flex-1">
                {m.email && (
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                    <FiMail className="text-slate-400 shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </div>
                )}
                {m.contact && (
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                    <FiPhone className="text-slate-400 shrink-0" />
                    <span>{m.contact}</span>
                  </div>
                )}
                {m.bio ? (
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-1 font-medium italic">
                    "{m.bio}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-350 italic mt-1 font-medium">No bio provided.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 grid grid-cols-3 gap-2 shrink-0">
                <button
                  onClick={() => handleEditClick(m)}
                  className="flex items-center justify-center gap-1.5 py-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
                >
                  <FiEdit2 /> Edit
                </button>
                <Link
                  href={`/admin/authorities/qualification?id=${m.id}`}
                  className="flex items-center justify-center gap-1.5 py-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all text-center"
                >
                  <FiAward /> Degrees
                </Link>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex items-center justify-center gap-1.5 py-2 hover:bg-red-50 hover:text-red-650 rounded-xl text-xs font-bold text-red-600 transition-all cursor-pointer"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editing Dialog Modal overlay */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>

            <div className="flex flex-col gap-1.5 border-b border-slate-50 pb-4">
              <h2 className="text-lg font-extrabold text-slate-800">Edit Board Member</h2>
              <p className="text-xs text-slate-400">Modify photo and credentials parameters below.</p>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo Preview Upload */}
                <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-3xl p-5 bg-slate-50/50">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border border-slate-200 bg-white shadow-inner flex items-center justify-center text-slate-400">
                    {preview ? (
                      <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FiCamera className="text-2xl" />
                    )}
                  </div>
                  <label className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all">
                    <FiUpload /> Change Photo
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {/* Details inputs */}
                <div className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editingMember.name}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Designation selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</label>
                    <select
                      name="designation"
                      value={editingMember.designation_id || editingMember.designation}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-blue-500 outline-none font-semibold"
                      required
                    >
                      {designations && designations.length > 0 ? (
                        designations.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.title}</option>
                        ))
                      ) : (
                        DESIGNATIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editingMember.email || ''}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Contact */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone</label>
                    <input
                      type="text"
                      name="contact"
                      value={editingMember.contact || ''}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Bio</label>
                <textarea
                  name="bio"
                  value={editingMember.bio || ''}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {saveLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
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
