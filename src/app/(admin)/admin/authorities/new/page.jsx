'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiUserPlus, FiBookOpen, FiMail, FiPhone, FiInfo, FiUpload, FiArrowLeft, FiCamera } from 'react-icons/fi';
import Link from 'next/link';

const DESIGNATIONS = [
  { value: 'chairman', label: 'Chairman' },
  { value: 'director', label: 'Managing Director' },
  { value: 'principal', label: 'Principal' },
  { value: 'registrar', label: 'Registrar' },
  { value: 'council', label: 'Academic Council Member' },
  { value: 'officers', label: 'Executive Officer' },
  { value: 'staff', label: 'Support Staff' }
];

export default function NewAuthorityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    designation: 'chairman',
    email: '',
    contact: '',
    image: ''
  });
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation) {
      toast.error('Name and Designation are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/authorities', formData);
      toast.success(res.data.message || 'Board member onboarded successfully!');
      router.push('/admin/authorities/list');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up max-w-3xl mx-auto">
      {/* Back to List */}
      <div>
        <Link 
          href="/admin/authorities/list"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
        >
          <FiArrowLeft className="text-sm" /> Back to Board List
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <FiUserPlus className="text-blue-600" /> Onboard New Board Member
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Pre-register leadership designations, contact info, bios, and upload profiles to Cloudinary.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.015)] flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Profile photo upload preview */}
          <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-3xl p-6 bg-slate-50/50">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border border-slate-200/80 bg-white flex items-center justify-center shadow-inner group">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-1.5">
                  <FiCamera className="text-3xl" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Photo</span>
                </div>
              )}
            </div>
            
            <label className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
              <FiUpload className="text-sm" /> Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[10px] text-slate-400 mt-2">JPEG, PNG or WEBP. Max 2MB.</p>
          </div>

          {/* Column 2: Essential Details */}
          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Alexander Fontana"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 font-medium"
                required
              />
            </div>

            {/* Designation Preset Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                Official Designation *
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-500 font-semibold"
                required
              >
                {DESIGNATIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alexander@fontana.edu"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                Contact Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            Brief Bio
          </label>
          <div className="relative">
            <FiInfo className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Provide a brief overview of professional accolades, governance history, or board experience..."
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 resize-none font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Onboarding...
              </>
            ) : (
              <>
                <FiUserPlus className="text-sm" /> Onboard Member
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
