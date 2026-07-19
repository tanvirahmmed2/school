'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUserPlus, FiMail } from 'react-icons/fi';

const StaffCreateForm = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [role, setRole] = useState('staff');
  const [designation, setDesignation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verificationSentTo, setVerificationSentTo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !number || !role) {
      toast.error('Name, Email, Phone Number, and Role are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/admin/staff', { 
        name: name.trim(), 
        email: email.trim(), 
        number: number.trim(), 
        role,
        designation: designation.trim()
      });

      toast.success(response.data.message || 'Staff profile placeholder created successfully!');
      const createdEmail = email.trim();
      setName('');
      setEmail('');
      setNumber('');
      setDesignation('');
      setRole('staff');
      setVerificationSentTo(createdEmail);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FiUserPlus className="text-blue-600" /> Pre-create Staff Profile
      </h2>

      {/* Verification link sent notice */}
      {verificationSentTo && (
        <div className="mb-5 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <FiMail className="text-emerald-600 text-sm" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-700">Verification Link Sent!</p>
            <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
              A secure setup verification link has been emailed to <strong>{verificationSentTo}</strong>. The staff member must click this link within 72 hours to complete their profile registration.
            </p>
            <button
              onClick={() => { setVerificationSentTo(''); if (onSuccess) onSuccess(); }}
              className="mt-2 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Michael Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="e.g. michael.smith@school.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. 555-0150"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Designation / Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. Assistant Cashier / Lead Registrar"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Portal Role *
          </label>
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
          >
            <option value="staff">General Staff</option>
            <option value="cashier">Cashier (Finance Desk)</option>
            <option value="register">Registrar (Admissions & Enrollments)</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 md:col-span-2 border-t border-slate-50 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Creating...' : 'Register Staff Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffCreateForm;
