'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiSettings, FiMail, FiPhone, FiMapPin, FiGlobe, FiImage } from 'react-icons/fi';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    school_name: '',
    site_title: '',
    logo_url: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    youtube_url: '',
    meta_title: '',
    meta_description: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/website-settings');
        const data = await res.json();
        if (data.success && data.paylod?.settings) {
          setSettings(data.paylod.settings);
        }
      } catch (err) {
        toast.error('Failed to load website settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!settings.school_name) {
      toast.error('School Name is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/website-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Website configurations saved successfully!');
        if (data.paylod?.settings) {
          setSettings(data.paylod.settings);
        }
      } else {
        throw new Error(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading configurations...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiSettings className="text-blue-600 animate-spin-slow" /> Website Settings & Identity
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure site identity, branding, global headers, metadata, and social media handles.
        </p>
      </div>

      <form onSubmit={handleSave} className="w-full flex flex-col lg:flex-row gap-6">
        {/* Main Settings Card */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
              <FiGlobe className="text-blue-500" /> Basic Configurations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">School Name (Configured in Secrets) *</label>
                <input
                  type="text"
                  name="school_name"
                  value={settings.school_name || ''}
                  onChange={handleChange}
                  disabled
                  placeholder="e.g. Oakridge International School"
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Tab Title</label>
                <input
                  type="text"
                  name="site_title"
                  value={settings.site_title || ''}
                  onChange={handleChange}
                  placeholder="e.g. Oakridge Portal"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Branding Logo URL (Configured in Secrets)</label>
                <div className="relative flex items-center">
                  <FiImage className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="logo_url"
                    value={settings.logo_url || ''}
                    onChange={handleChange}
                    disabled
                    placeholder="https://example.com/logo.png"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2 mt-2">
              <FiPhone className="text-emerald-500" /> Contact Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support Email</label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-3.5 text-slate-400" />
                  <input
                    type="email"
                    name="contact_email"
                    value={settings.contact_email || ''}
                    onChange={handleChange}
                    placeholder="support@oakridge.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-555 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Office Phone</label>
                <div className="relative flex items-center">
                  <FiPhone className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="contact_phone"
                    value={settings.contact_phone || ''}
                    onChange={handleChange}
                    placeholder="+1 555-019-2834"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mailing Address</label>
                <div className="relative flex">
                  <FiMapPin className="absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    name="address"
                    value={settings.address || ''}
                    onChange={handleChange}
                    placeholder="123 Academic Way, Education District, NY 10001"
                    rows={3}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2 mt-2">
              <FiGlobe className="text-indigo-500" /> Search Engine Optimization (SEO)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Title Tag (Configured in Secrets)</label>
                <input
                  type="text"
                  name="meta_title"
                  value={settings.meta_title || ''}
                  onChange={handleChange}
                  disabled
                  placeholder="e.g. Oakridge Portal - Academic Excellence & Growth"
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Description Tag (Configured in Secrets)</label>
                <textarea
                  name="meta_description"
                  value={settings.meta_description || ''}
                  onChange={handleChange}
                  disabled
                  placeholder="Manage student enrollments, exam records, gradesheets, timetables, and billing files dynamically."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-5">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
              <FiGlobe className="text-amber-500" /> Social Handles
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facebook</label>
                <input
                  type="text"
                  name="facebook_url"
                  value={settings.facebook_url || ''}
                  onChange={handleChange}
                  placeholder="https://facebook.com/school"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Twitter / X</label>
                <input
                  type="text"
                  name="twitter_url"
                  value={settings.twitter_url || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/school"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instagram</label>
                <input
                  type="text"
                  name="instagram_url"
                  value={settings.instagram_url || ''}
                  onChange={handleChange}
                  placeholder="https://instagram.com/school"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">YouTube Channel</label>
                <input
                  type="text"
                  name="youtube_url"
                  value={settings.youtube_url || ''}
                  onChange={handleChange}
                  placeholder="https://youtube.com/school"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...
              </>
            ) : (
              <>
                <FiSave className="text-lg" /> Save Configurations
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
