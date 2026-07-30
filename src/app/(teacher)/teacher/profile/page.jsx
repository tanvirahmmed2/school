'use client';

import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiBookOpen, FiPlus, FiTrash2, FiEdit2, FiX, FiCamera, FiShield, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import TiptapEditor from '@/component/helper/TiptapEditor';
import RichTextDisplay from '@/component/helper/RichTextDisplay';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', number: '', address: '' });
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);
  const [qualifications, setQualifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ degree: '', institution: '', passing_year: '', result: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/teacher/me');
        if (res.ok) {
          const data = await res.json();
          const teacher = data.paylod.teacher;
          setProfile(teacher);
          setProfileData({
            name: teacher.name || '',
            number: teacher.number || '',
            address: teacher.address || ''
          });
          setIsTwoFactorEnabled(Boolean(teacher.is_two_factor_enabled));
          fetchQualifications(teacher.id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fetchQualifications = async (teacherId) => {
    try {
      const res = await fetch(`/api/teachers/qualifications?teacher_id=${teacherId}`);
      if (res.ok) {
        const data = await res.json();
        setQualifications(data.paylod.qualifications || []);
      }
    } catch (err) { console.error('Error fetching qualifications:', err); }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim() || !formData.passing_year) {
      toast.error('Degree, Institution and Passing Year are required.'); return;
    }
    setFormLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/teachers/qualifications/${editId}`, formData);
        toast.success('Qualification updated.'); setEditId(null);
      } else {
        await axios.post('/api/teachers/qualifications', { teacher_id: profile.id, ...formData });
        toast.success('Qualification added.');
      }
      setFormData({ degree: '', institution: '', passing_year: '', result: '' });
      setShowForm(false);
      fetchQualifications(profile.id);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save.'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this qualification?')) return;
    try {
      await axios.delete(`/api/teachers/qualifications/${id}`);
      toast.success('Qualification removed.'); fetchQualifications(profile.id);
    } catch (err) { toast.error('Failed to remove.'); }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be < 2MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const toastId = toast.loading('Uploading picture...');
      try {
        const res = await axios.put('/api/teacher/me', { ...profileData, image: reader.result });
        toast.dismiss(toastId); toast.success('Profile picture updated!');
        setProfile(res.data.paylod.teacher);
      } catch (err) { toast.dismiss(toastId); toast.error(err.response?.data?.error || 'Failed.'); }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving details...');
    try {
      const res = await axios.put('/api/teacher/me', { ...profileData, image: profile.image });
      toast.dismiss(toastId); toast.success('Profile updated successfully.');
      setProfile(res.data.paylod.teacher); setIsEditing(false);
    } catch (err) { toast.dismiss(toastId); toast.error(err.response?.data?.error || 'Failed to save.'); }
  };

  const handleToggle2FA = async (newValue) => {
    setToggling2FA(true);
    const toastId = toast.loading('Updating security settings...');
    try {
      const res = await axios.put('/api/teacher/me', { is_two_factor_enabled: newValue });
      toast.dismiss(toastId);
      setIsTwoFactorEnabled(newValue);
      toast.success(newValue ? 'Two-Factor Authentication Enabled!' : 'Two-Factor Authentication Disabled!');
      setProfile(res.data.paylod.teacher);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Failed to update 2FA status.');
    } finally {
      setToggling2FA(false);
    }
  };

  if (loading) return <div className="w-full py-16 text-center text-xs text-slate-400">Loading profile...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FiUser className="text-emerald-600" /> My Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Your official teacher credentials and contact information.</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-semibold rounded-xl ${
          isTwoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          <FiShield className={isTwoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'} />
          {isTwoFactorEnabled ? '2FA Active' : '2FA Off'}
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative group w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
          {profile?.image ? (
            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'T'}
            </div>
          )}
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <FiCamera className="text-base" />
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </label>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-sm font-bold text-slate-800">{profile?.name}</h2>
          <p className="text-xs text-slate-500">ID: #{profile?.id}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-semibold">Active Instructor</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              profile?.is_permanent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>{profile?.is_permanent ? 'Permanent Staff' : 'Temporary / Contract'}</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Edit / View */}
        {isEditing ? (
          <form onSubmit={handleSaveDetails} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><FiUser className="text-emerald-600 text-xs" /> Edit Profile</span>
              <button type="button" onClick={() => { setProfileData({ name: profile.name || '', number: profile.number || '', address: profile.address || '' }); setIsEditing(false); }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"><FiX className="text-xs" /></button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Full Name</label>
              <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-600" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Email Address</label>
                <span className="text-[9px] text-slate-400 flex items-center gap-1"><FiLock className="text-[8px]" /> Locked</span>
              </div>
              <input type="email" readOnly value={profile?.email || ''}
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 cursor-not-allowed outline-none select-none font-medium" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Phone Number</label>
              <input type="text" value={profileData.number} onChange={(e) => setProfileData({ ...profileData, number: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-600" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Address</label>
              <TiptapEditor value={profileData.address} onChange={(val) => setProfileData({ ...profileData, address: val })} />
            </div>

            <button type="submit" className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors">Save Details</button>
          </form>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><FiUser className="text-emerald-600 text-xs" /> Personal & Contact Details</span>
              <button onClick={() => setIsEditing(true)} className="px-2 py-0.5 border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                <FiEdit2 className="text-[9px]" /> Edit
              </button>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400"><FiUser className="text-xs" /></div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Full Name</span>
                  <span className="text-xs font-semibold text-slate-700">{profile?.name || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400"><FiMail className="text-xs" /></div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Email</span>
                    <span className="text-[9px] text-slate-400 italic">(Read-only)</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{profile?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400"><FiPhone className="text-xs" /></div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Phone</span>
                  <span className="text-xs font-semibold text-slate-700">{profile?.number || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 mt-0.5"><FiMapPin className="text-xs" /></div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Address</span>
                  <RichTextDisplay html={profile?.address || 'N/A'} className="text-xs font-semibold text-slate-700 mt-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic & Security Card */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 border-b border-slate-200 pb-2"><FiBookOpen className="text-emerald-600 text-xs" /> Academic Info</span>
            <div className="space-y-2.5">
              {[
                { icon: FiAward, label: 'Designation', value: profile?.designation || 'Instructor' },
                { icon: FiUser, label: 'Employment Status', value: profile?.is_active ? 'Active Instructor' : 'Inactive' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400"><Icon className="text-xs" /></div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">{label}</span>
                    <span className="text-xs font-semibold text-slate-700">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2FA Security Switch Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <FiShield className="text-emerald-600 text-sm" />
                <span className="text-xs font-semibold text-slate-700">Two-Factor Authentication</span>
              </div>
              <button
                type="button"
                disabled={toggling2FA}
                onClick={() => handleToggle2FA(!isTwoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                  isTwoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                    isTwoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When enabled, a 6-digit verification code will be sent to your email when logging into the Teacher Portal.
            </p>
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><FiAward className="text-emerald-600 text-xs" /> Academic Qualifications</span>
          {!showForm && (
            <button onClick={() => { setEditId(null); setFormData({ degree: '', institution: '', passing_year: '', result: '' }); setShowForm(true); }}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-semibold">
              <FiPlus className="text-[9px]" /> Add Degree
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">{editId ? 'Edit Qualification' : 'Add Qualification'}</span>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="p-1 text-slate-400 hover:text-slate-600"><FiX className="text-xs" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Degree Title *</label>
                <input type="text" name="degree" value={formData.degree} onChange={handleInputChange} required
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-600" />
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Institution *</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleInputChange} required
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-600" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Graduation Year *</label>
                <input type="number" name="passing_year" value={formData.passing_year} onChange={handleInputChange} required
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-600" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Score / Result</label>
                <input type="text" name="result" value={formData.result} onChange={handleInputChange}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-600" />
              </div>
            </div>
            <button type="submit" disabled={formLoading}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors">
              {formLoading ? 'Saving...' : editId ? 'Save Changes' : 'Save Degree'}
            </button>
          </form>
        )}

        {qualifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No qualifications added yet. Click &quot;Add Degree&quot; to get started.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {qualifications.map((q) => (
              <div key={q.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50">
                <div>
                  <span className="text-xs font-semibold text-slate-800">{q.degree}</span>
                  <span className="text-[10px] text-slate-500 block">{q.institution}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">{q.passing_year}</span>
                    {q.result && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold">{q.result}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditId(q.id); setFormData({ degree: q.degree, institution: q.institution, passing_year: q.passing_year, result: q.result || '' }); setShowForm(true); }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg"><FiEdit2 className="text-xs" /></button>
                  <button onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><FiTrash2 className="text-xs" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
