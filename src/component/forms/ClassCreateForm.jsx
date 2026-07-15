'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiFolderPlus, FiHash, FiTag } from 'react-icons/fi';
import TiptapEditor from '@/component/helper/TiptapEditor';

const ClassCreateForm = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [numericName, setNumericName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !numericName || !code) {
      toast.error('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, numeric_name: numericName, code, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create class.');
      }

      toast.success(data.message || 'Class created successfully!');
      setName('');
      setNumericName('');
      setCode('');
      setDescription('');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FiFolderPlus className="text-blue-600" /> Add New Class
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FiFolderPlus className="text-slate-400" /> Class Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Class 10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FiHash className="text-slate-400" /> Numeric Name
          </label>
          <input
            type="number"
            required
            placeholder="e.g. 10"
            value={numericName}
            onChange={(e) => setNumericName(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FiTag className="text-slate-400" /> Class Code
          </label>
          <input
            type="text"
            required
            placeholder="e.g. C10"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Description
          </label>
          <TiptapEditor
            value={description}
            onChange={setDescription}
            placeholder="Brief overview or description of this class..."
          />
        </div>

        <div className="flex justify-end gap-3 md:col-span-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Create Class'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassCreateForm;
