'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlusCircle } from 'react-icons/fi';

const ClubNewsCreateForm = ({ onSuccess, onCancel }) => {
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  const [clubId, setClubId] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/clubs');
        if (res.ok) {
          const data = await res.json();
          const activeClubs = data.paylod?.clubs || [];
          setClubs(activeClubs);
          if (activeClubs.length > 0) {
            setClubId(activeClubs[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Failed to load clubs:', err);
      } finally {
        setLoadingClubs(false);
      }
    };
    fetchClubs();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubId || !title.trim() || !content.trim()) {
      toast.error('Club, title, and content are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/club-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_id: clubId, title, image, content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish club news.');

      toast.success(data.message || 'Club news published successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingClubs) {
    return (
      <div className="py-6 flex justify-center items-center gap-2">
        <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-400">Loading clubs list...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiPlusCircle className="text-sky-600" /> Write Club News
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Campus Club *</label>
        <select
          required
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500 cursor-pointer"
        >
          {clubs.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Club News Title *</label>
        <input
          type="text"
          required
          placeholder="e.g. Photography Club Exhibition 2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cover Image File</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-55 file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content / Announcement Details *</label>
        <textarea
          required
          rows={8}
          placeholder="Describe the club announcement or event summary details..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
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
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-60"
        >
          {submitting ? 'Publishing...' : 'Publish Club News'}
        </button>
      </div>
    </form>
  );
};

export default ClubNewsCreateForm;
