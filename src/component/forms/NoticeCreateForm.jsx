'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlusCircle } from 'react-icons/fi';

const NoticeCreateForm = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) {
      toast.error('Title and Drive Link are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link, is_pinned: isPinned })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create notice');
      toast.success('Notice published successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiPlusCircle className="text-sky-655 text-sky-600" /> Publish Notice Details
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notice Title *</label>
        <input
          type="text"
          required
          placeholder="e.g. Revised Midterm Exam Routine 2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drive/PDF File URL Link *</label>
        <input
          type="url"
          required
          placeholder="e.g. https://drive.google.com/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
        />
      </div>

      <div className="flex items-center gap-2.5 mt-2">
        <input
          type="checkbox"
          id="isPinned"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="w-4 h-4 text-sky-655 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
        />
        <label htmlFor="isPinned" className="text-xs font-bold text-slate-550 select-none cursor-pointer">
          Pin this notice to the top of notice board
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
        >
          {submitting ? 'Publishing...' : 'Publish Notice'}
        </button>
      </div>
    </form>
  );
};

export default NoticeCreateForm;
