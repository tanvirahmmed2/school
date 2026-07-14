'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLayers, FiAward, FiBook } from 'react-icons/fi';

const AdmissionApplyForm = ({ 
  circulars, 
  selectedCircular, 
  onCircularChange, 
  onSubmit, 
  submitting, 
  admissionIdParam,
  onGoBack
}) => {
  const [form, setForm] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    applied_class_id: '',
    previous_school: '',
    guardian_name: '',
    guardian_phone: '',
    birth_regi_number: ''
  });

  useEffect(() => {
    if (selectedCircular) {
      setForm((prev) => ({
        ...prev,
        applied_class_id: selectedCircular.class_id.toString()
      }));
    }
  }, [selectedCircular]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Circular Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <FiLayers /> Target Admission Circular *
        </label>
        {admissionIdParam && selectedCircular ? (
          <div className="w-full px-4 py-3 bg-sky-50/50 border border-sky-100 rounded-xl text-sm text-sky-950 font-bold">
            {selectedCircular.title} (Class: {selectedCircular.class_name})
          </div>
        ) : (
          <select
            required
            value={selectedCircular ? selectedCircular.id : ''}
            onChange={(e) => onCircularChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
          >
            <option value="">Choose an open circular drive...</option>
            {circulars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} — Class: {c.class_name}
              </option>
            ))}
          </select>
        )}
        {selectedCircular && (
          <div className="text-[10px] text-slate-400 font-semibold flex flex-wrap gap-x-4 gap-y-1 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {selectedCircular.min_age !== null && <div>• Min Age: <strong>{selectedCircular.min_age} years</strong></div>}
            {selectedCircular.max_age !== null && <div>• Max Age: <strong>{selectedCircular.max_age} years</strong></div>}
            {selectedCircular.birth_regi_number && <div>• Req Code: <strong>{selectedCircular.birth_regi_number}</strong></div>}
            <div>• Deadline: <strong>{new Date(selectedCircular.finish_date).toLocaleDateString()}</strong></div>
          </div>
        )}
      </div>

      {/* Candidate Section */}
      <div className="border-t border-slate-50 pt-4 mt-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">1. Candidate Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-450 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiUser /> Applicant Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={form.applicant_name}
              onChange={(e) => setForm((p) => ({ ...p, applicant_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiCalendar /> Date of Birth *
            </label>
            <input
              type="date"
              required
              value={form.date_of_birth}
              onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiAward /> Birth Registration No *
            </label>
            <input
              type="text"
              required
              placeholder="Birth Certificate Number"
              value={form.birth_regi_number}
              onChange={(e) => setForm((p) => ({ ...p, birth_regi_number: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest">Gender *</label>
            <select
              value={form.gender}
              onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiMail /> Candidate Email *
            </label>
            <input
              type="email"
              required
              placeholder="candidate@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiPhone /> Candidate Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiBook /> Previous School (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Fontana Elementary School"
              value={form.previous_school}
              onChange={(e) => setForm((p) => ({ ...p, previous_school: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiMapPin /> Residential Address *
            </label>
            <textarea
              rows={2}
              required
              placeholder="House no, Street Name, City, Zip Code"
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Guardian Section */}
      <div className="border-t border-slate-50 pt-4 mt-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">2. Parent / Guardian Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiUser /> Guardian Name *
            </label>
            <input
              type="text"
              required
              placeholder="Guardian full name"
              value={form.guardian_name}
              onChange={(e) => setForm((p) => ({ ...p, guardian_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiPhone /> Guardian Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="Guardian contact phone number"
              value={form.guardian_phone}
              onChange={(e) => setForm((p) => ({ ...p, guardian_phone: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 mt-4 border-t border-slate-50 pt-4">
        <button
          type="button"
          onClick={onGoBack}
          className="px-5 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold transition-colors cursor-pointer hover:bg-slate-50"
        >
          Go Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-1.5"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default AdmissionApplyForm;
