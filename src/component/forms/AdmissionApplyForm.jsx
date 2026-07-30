'use client';

import React, { useState, useEffect } from 'react';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLayers,
  FiAward, FiBook, FiHeart, FiFileText, FiLock, FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

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
    blood_group: '',
    address: '',
    applied_class_id: '',
    father_name: '',
    father_occupation: '',
    father_phone: '',
    mother_name: '',
    mother_occupation: '',
    mother_phone: '',
    past_school_name: '',
    past_school_class: '',
    past_school_result: '',
    special_note: '',
    birth_regi_number: ''
  });

  useEffect(() => {
    if (selectedCircular) {
      setForm((prev) => ({
        ...prev,
        applied_class_id: selectedCircular.class_id ? selectedCircular.class_id.toString() : ''
      }));
    }
  }, [selectedCircular]);

  const isCircularLocked = selectedCircular && (
    selectedCircular.is_result_published ||
    (selectedCircular.finish_date && new Date() > new Date(selectedCircular.finish_date))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCircularLocked) {
      toast.error('Applications for this admission circular are closed because results have been published or the deadline has passed.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Target Circular Selector */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <FiLayers className="text-emerald-600" /> Target Admission Circular *
        </label>
        {admissionIdParam && selectedCircular ? (
          <div className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 font-bold">
            {selectedCircular.title} (Class: {selectedCircular.class_name})
          </div>
        ) : (
          <select
            required
            value={selectedCircular ? selectedCircular.id : ''}
            onChange={(e) => onCircularChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="">Choose an open circular drive...</option>
            {circulars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} — Class: {c.class_name} {c.is_result_published ? '(Results Published)' : ''}
              </option>
            ))}
          </select>
        )}

        {selectedCircular && (
          <div className="flex flex-col gap-2.5 mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] text-slate-600 font-semibold flex flex-wrap gap-x-4 gap-y-1">
              {selectedCircular.min_age !== null && <div>• Min Age: <strong>{selectedCircular.min_age} years</strong></div>}
              {selectedCircular.max_age !== null && <div>• Max Age: <strong>{selectedCircular.max_age} years</strong></div>}
              <div>• Deadline: <strong>{selectedCircular.finish_date ? new Date(selectedCircular.finish_date).toLocaleDateString() : 'N/A'}</strong></div>
              {selectedCircular.fees !== undefined && selectedCircular.fees !== null && (
                <div>• Admission Fee: <strong className="text-emerald-700 font-bold">BDT {parseFloat(selectedCircular.fees).toFixed(2)}</strong></div>
              )}
            </div>

            {isCircularLocked && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                <FiLock className="text-rose-600 shrink-0 text-sm" />
                <span>Notice: Applications for this circular are closed as results have been published. New applications are locked.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Candidate Personal Details */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <FiUser className="text-emerald-600" /> 1. Candidate Personal Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiUser /> Student Name *
            </label>
            <input
              type="text"
              required
              disabled={isCircularLocked}
              value={form.applicant_name}
              onChange={(e) => setForm((p) => ({ ...p, applicant_name: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiCalendar /> Date of Birth *
            </label>
            <input
              type="date"
              required
              disabled={isCircularLocked}
              value={form.date_of_birth}
              onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender *</label>
            <select
              disabled={isCircularLocked}
              value={form.gender}
              onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 cursor-pointer disabled:opacity-60"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiAward /> Birth Reg. / Certificate No *
            </label>
            <input
              type="text"
              required
              disabled={isCircularLocked}
              value={form.birth_regi_number}
              onChange={(e) => setForm((p) => ({ ...p, birth_regi_number: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiPhone /> Contact Number *
            </label>
            <input
              type="tel"
              required
              disabled={isCircularLocked}
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiMail /> Candidate Email *
            </label>
            <input
              type="email"
              required
              disabled={isCircularLocked}
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiHeart /> Blood Group
            </label>
            <select
              disabled={isCircularLocked}
              value={form.blood_group}
              onChange={(e) => setForm((p) => ({ ...p, blood_group: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 cursor-pointer disabled:opacity-60"
            >
              <option value="">-- Select Blood Group --</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiMapPin /> Residential Address *
            </label>
            <input
              type="text"
              required
              disabled={isCircularLocked}
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* 2. Father Details */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <FiUser className="text-emerald-600" /> 2. Father Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Father Name *</label>
            <input
              type="text"
              required
              disabled={isCircularLocked}
              value={form.father_name}
              onChange={(e) => setForm((p) => ({ ...p, father_name: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Father Occupation</label>
            <input
              type="text"
              disabled={isCircularLocked}
              value={form.father_occupation}
              onChange={(e) => setForm((p) => ({ ...p, father_occupation: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Father Contact Number *</label>
            <input
              type="tel"
              required
              disabled={isCircularLocked}
              value={form.father_phone}
              onChange={(e) => setForm((p) => ({ ...p, father_phone: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* 3. Mother Details */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <FiUser className="text-emerald-600" /> 3. Mother Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mother Name *</label>
            <input
              type="text"
              required
              disabled={isCircularLocked}
              value={form.mother_name}
              onChange={(e) => setForm((p) => ({ ...p, mother_name: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mother Occupation</label>
            <input
              type="text"
              disabled={isCircularLocked}
              value={form.mother_occupation}
              onChange={(e) => setForm((p) => ({ ...p, mother_occupation: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mother Contact Number *</label>
            <input
              type="tel"
              required
              disabled={isCircularLocked}
              value={form.mother_phone}
              onChange={(e) => setForm((p) => ({ ...p, mother_phone: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* 4. Past School & Additional Information */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <FiBook className="text-emerald-600" /> 4. Previous Academic Record &amp; Notes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Past School Name</label>
            <input
              type="text"
              disabled={isCircularLocked}
              value={form.past_school_name}
              onChange={(e) => setForm((p) => ({ ...p, past_school_name: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Past Class Passed</label>
            <input
              type="text"
              disabled={isCircularLocked}
              value={form.past_school_class}
              onChange={(e) => setForm((p) => ({ ...p, past_school_class: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Past Result / GPA</label>
            <input
              type="text"
              disabled={isCircularLocked}
              value={form.past_school_result}
              onChange={(e) => setForm((p) => ({ ...p, past_school_result: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <FiFileText /> Special Notes / Medical Info (Optional)
          </label>
          <textarea
            rows={2}
            disabled={isCircularLocked}
            value={form.special_note}
            onChange={(e) => setForm((p) => ({ ...p, special_note: e.target.value }))}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600 resize-none disabled:opacity-60"
            placeholder="Mention any physical conditions, extracurricular interests, or special instructions..."
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onGoBack}
          className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
        >
          Go Back
        </button>
        <button
          type="submit"
          disabled={submitting || isCircularLocked}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Application & Proceed'}
        </button>
      </div>

    </form>
  );
};

export default AdmissionApplyForm;
