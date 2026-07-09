'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiExternalLink, FiAward, FiEye } from 'react-icons/fi';
import GenericForm from '@/component/forms/GenericForm';

const NoticesManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [is_pinned, setIsPinned] = useState('false');

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      if (response.ok) {
        const data = await response.json();
        setNotices(data.notices || []);
      }
    } catch (error) {
      toast.error('Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenCreate = () => {
    setEditItem(null);
    setTitle('');
    setLink('');
    setIsPinned('false');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setTitle(item.title);
    setLink(item.link);
    setIsPinned(item.is_pinned ? 'true' : 'false');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim() || !link.trim()) {
      toast.error('Title and Google Drive Link are required.');
      return;
    }

    setSubmitting(true);
    try {
      const url = editItem ? `/api/notices/${editItem.id}` : '/api/notices';
      const method = editItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          link: link.trim(),
          is_pinned: is_pinned === 'true'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save notice.');
      }

      toast.success(data.message || 'Notice saved successfully!');
      setModalOpen(false);
      fetchNotices();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const response = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete notice.');
      }

      toast.success(data.message || 'Notice deleted successfully.');
      fetchNotices();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTogglePin = async (notice) => {
    try {
      const response = await fetch(`/api/notices/${notice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notice.title,
          link: notice.link,
          is_pinned: !notice.is_pinned
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(notice.is_pinned ? 'Notice unpinned.' : 'Notice pinned successfully!');
        fetchNotices();
      } else {
        throw new Error(data.error || 'Failed to toggle pin state.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Form Fields Config
  const fields = [
    { name: 'title', label: 'Notice Title', required: true, placeholder: 'e.g. Midterm Exam Schedule Fall 2026', colSpan: 'col-span-2' },
    { name: 'link', label: 'Google Drive Document Link', required: true, placeholder: 'e.g. https://drive.google.com/file/d/.../view', icon: FiExternalLink, colSpan: 'col-span-2' },
    {
      name: 'is_pinned',
      label: 'Priority Pinning',
      type: 'select',
      required: true,
      options: [
        { value: 'false', label: 'Standard Notice' },
        { value: 'true', label: 'Pinned Notice (Always stay at top)' }
      ],
      colSpan: 'col-span-2'
    }
  ];

  const values = { title, link, is_pinned };

  const handleChange = (fieldName, val) => {
    if (fieldName === 'title') setTitle(val);
    else if (fieldName === 'link') setLink(val);
    else if (fieldName === 'is_pinned') setIsPinned(val);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-up max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-650 rounded-2xl text-amber-600">
            <FiAlertCircle className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Notices Board Management</h1>
            <p className="text-xs text-slate-400">Share notices, host drives documents links, and pin crucial files at the top.</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-605 text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer bg-amber-600 hover:bg-amber-700"
        >
          <FiPlus className="text-sm" /> Add Notice Link
        </button>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notices.length === 0 ? (
        <div className="w-full text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <p className="text-sm text-slate-400 font-semibold">No notices published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white border rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 ${
                notice.is_pinned ? 'border-amber-250 bg-amber-50/10' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleTogglePin(notice)}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-colors duration-150 ${
                    notice.is_pinned
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-105'
                  }`}
                  title={notice.is_pinned ? 'Unpin notice' : 'Pin notice to top'}
                >
                  <FiAward className="text-lg" />
                </button>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm leading-snug">{notice.title}</span>
                    {notice.is_pinned && (
                      <span className="text-[9px] font-extrabold uppercase bg-amber-50 text-amber-650 border border-amber-100 px-2 py-0.5 rounded-full">
                        Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Published: {new Date(notice.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>

              {/* Action and link controls */}
              <div className="flex items-center gap-3 justify-end sm:justify-start">
                <a
                  href={notice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl text-xs font-bold transition-all duration-150 border border-slate-100/50"
                >
                  <FiEye className="text-sm" /> View Link
                </a>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(notice)}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 rounded-xl transition-all duration-150 cursor-pointer"
                    title="Edit notice"
                  >
                    <FiEdit2 className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="p-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition-all duration-150 cursor-pointer"
                    title="Delete notice"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiAlertCircle className="text-amber-600" /> {editItem ? 'Edit Notice Link' : 'Add Notice Link'}
            </h2>
            <GenericForm
              fields={fields}
              values={values}
              onChange={handleChange}
              onSubmit={handleFormSubmit}
              submitText={editItem ? 'Save Changes' : 'Add Notice'}
              submitting={submitting}
              cancelText="Cancel"
              onCancel={() => setModalOpen(false)}
              focusClass="focus:border-amber-500 focus:ring-amber-500/5"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesManagement;
