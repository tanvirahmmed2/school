'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLayers, FiAward, FiBook, FiUploadCloud } from 'react-icons/fi';
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
    address: '',
    applied_class_id: '',
    previous_school: '',
    guardian_name: '',
    guardian_phone: '',
    birth_regi_number: '',
    image: '',
    signature: ''
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${name} file.`);
      };
      reader.readAsDataURL(file);
    }
  };

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <FiLayers /> Target Admission Circular *
        </label>
        {admissionIdParam && selectedCircular ? (
          <div className="w-full px-4 py-3 bg-primary-light/50 border border-primary-light rounded-xl text-sm text-sky-950 font-bold">
            {selectedCircular.title} (Class: {selectedCircular.class_name})
          </div>
        ) : (
          <select
            required
            value={selectedCircular ? selectedCircular.id : ''}
            onChange={(e) => onCircularChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary cursor-pointer"
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
          <div className="flex flex-col gap-2.5 mt-1 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
            <div className="text-[10px] text-slate-400 font-semibold flex flex-wrap gap-x-4 gap-y-1">
              {selectedCircular.min_age !== null && <div>• Min Age: <strong>{selectedCircular.min_age} years</strong></div>}
              {selectedCircular.max_age !== null && <div>• Max Age: <strong>{selectedCircular.max_age} years</strong></div>}
              <div>• Deadline: <strong>{new Date(selectedCircular.finish_date).toLocaleDateString()}</strong></div>
              {selectedCircular.fees !== undefined && selectedCircular.fees !== null && (
                <div>• Admission Fee: <strong className="text-primary font-bold">BDT {parseFloat(selectedCircular.fees).toFixed(2)}</strong></div>
              )}
            </div>
            {selectedCircular.description && (
              <div className="border-t border-slate-200/60 pt-2.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Circular Instructions</p>
                <div 
                  className="prose prose-sm max-w-none text-xs text-slate-600 leading-relaxed font-normal" 
                  dangerouslySetInnerHTML={{ __html: selectedCircular.description }} 
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-50 pt-4 mt-2 w-full">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">1. Candidate Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiUser /> Applicant Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Doe"
              value={form.applicant_name}
              onChange={(e) => setForm((p) => ({ ...p, applicant_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiCalendar /> Date of Birth *
            </label>
            <input
              type="date"
              required
              value={form.date_of_birth}
              onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiAward /> Birth Registration No *
            </label>
            <input
              type="text"
              required
              placeholder="Birth Certificate Number"
              value={form.birth_regi_number}
              onChange={(e) => setForm((p) => ({ ...p, birth_regi_number: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender *</label>
            <select
              value={form.gender}
              onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiMail /> Candidate Email *
            </label>
            <input
              type="email"
              required
              placeholder="candidate@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiPhone /> Candidate Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiBook /> Previous School (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Fontana Elementary School"
              value={form.previous_school}
              onChange={(e) => setForm((p) => ({ ...p, previous_school: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiMapPin /> Residential Address *
            </label>
            <textarea
              rows={2}
              required
              placeholder="House no, Street Name, City, Zip Code"
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* Guardian Section */}
      <div className="border-t border-slate-50 pt-4 mt-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">2. Parent / Guardian Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiUser /> Guardian Name *
            </label>
            <input
              type="text"
              required
              placeholder="Guardian full name"
              value={form.guardian_name}
              onChange={(e) => setForm((p) => ({ ...p, guardian_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FiPhone /> Guardian Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="Guardian contact phone number"
              value={form.guardian_phone}
              onChange={(e) => setForm((p) => ({ ...p, guardian_phone: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Fee Payment & Photo/Signature Process Notice */}
      <div className="border-t border-slate-50 pt-4 mt-2">
        <div className="bg-sky-50/80 border border-sky-100 p-4 rounded-2xl flex flex-col gap-1.5">
          <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
            <FiUploadCloud className="text-sky-600" /> Next Step After Submission
          </h4>
          <p className="text-xs text-sky-800 leading-relaxed">
            Upon submitting this application form, your application will be created with status <strong className="text-sky-950">incomplete</strong> and an <strong className="text-sky-950">unpaid</strong> admission fee receipt will be generated. Please pay the admission fee to the school cashier. Once payment is completed, you will receive an email to upload your picture and signature, which will submit your application for final admin review.
          </p>
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
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-1.5"
        >
          {submitting ? 'Submitting Application...' : 'Submit Application & Get Receipt'}
        </button>
      </div>
    </form>
  );
};

export default AdmissionApplyForm;
