'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2 } from 'react-icons/fi';

const ClassEditForm = ({ cls, onSuccess, onCancel }) => {
  const [name, setName] = useState(cls.name);
  const [numericName, setNumericName] = useState(cls.numeric_name);
  const [code, setCode] = useState(cls.code);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !numericName || !code) {
      toast.error('All fields are required.');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/classes/${cls.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, numeric_name: numericName, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update class.');
      }

      toast.success(data.message || 'Class updated successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full bg-white border border-blue-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(59,130,246,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FiEdit2 className="text-blue-600" /> Edit Class: {cls.name}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Class Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={updating}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Numeric Name
          </label>
          <input
            type="number"
            required
            value={numericName}
            onChange={(e) => setNumericName(e.target.value)}
            disabled={updating}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Class Code
          </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={updating}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
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
            disabled={updating}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {updating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Update Class'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassEditForm;
