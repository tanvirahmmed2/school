'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUserPlus } from 'react-icons/fi';

const TeacherCreateForm = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !number || !designation) {
      toast.error('All fields (Name, Email, Phone Number, Designation) are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/teachers', { 
        name: name.trim(), 
        email: email.trim(), 
        number: number.trim(), 
        designation: designation.trim() 
      });

      toast.success(response.data.message || 'Teacher account placeholder created successfully!');
      setName('');
      setEmail('');
      setNumber('');
      setDesignation('');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FiUserPlus className="text-blue-600" /> Pre-create Teacher Profile
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Professor John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="e.g. john@school.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="text"
            required
            placeholder="e.g. +880 170 000 0000"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Designation
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Assistant Professor"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50"
          />
        </div>

        <div className="flex justify-end gap-3 md:col-span-2 mt-4 pt-3 border-t border-slate-100">
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
              'Save Teacher Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherCreateForm;
