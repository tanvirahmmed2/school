'use client';

import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiBookOpen, FiPlus, FiTrash2, FiEdit2, FiX, FiCamera } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Profile data states
  const [profileData, setProfileData] = useState({
    number: '',
    address: ''
  });

  // Qualifications states
  const [qualifications, setQualifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    passing_year: '',
    result: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/teacher/me');
        if (res.ok) {
          const data = await res.json();
          const teacher = data.paylod.teacher;
          setProfile(teacher);
          setProfileData({
            number: teacher.number || '',
            address: teacher.address || ''
          });
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
    } catch (err) {
      console.error('Error fetching qualifications:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim() || !formData.passing_year) {
      toast.error('Degree, Institution and Passing Year are required.');
      return;
    }

    setFormLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/teachers/qualifications/${editId}`, formData);
        toast.success('Qualification updated successfully.');
        setEditId(null);
      } else {
        await axios.post('/api/teachers/qualifications', {
          teacher_id: profile.id,
          ...formData
        });
        toast.success('Qualification added successfully.');
      }
      setFormData({ degree: '', institution: '', passing_year: '', result: '' });
      setShowForm(false);
      fetchQualifications(profile.id);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save qualification.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this qualification record?')) return;

    try {
      await axios.delete(`/api/teachers/qualifications/${id}`);
      toast.success('Qualification removed.');
      fetchQualifications(profile.id);
    } catch (err) {
      toast.error('Failed to remove qualification.');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const toastId = toast.loading('Uploading profile picture...');
      try {
        const res = await axios.put('/api/teacher/me', {
          ...profileData,
          image: reader.result
        });
        toast.dismiss(toastId);
        toast.success('Profile picture updated successfully!');
        setProfile(res.data.paylod.teacher);
      } catch (err) {
        toast.dismiss(toastId);
        toast.error(err.response?.data?.error || 'Failed to upload photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving profile changes...');
    try {
      const res = await axios.put('/api/teacher/me', {
        ...profileData,
        image: profile.image
      });
      toast.dismiss(toastId);
      toast.success('Profile contact details saved.');
      setProfile(res.data.paylod.teacher);
      setIsEditing(false);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.error || 'Failed to update details.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">My Profile</h1>
        <p className="text-slate-500 text-sm font-medium">Verify your official teacher credentials, designations, and contact information.</p>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.015)]">
        <div className="relative group w-24 h-24 rounded-full overflow-hidden shrink-0 border border-slate-100/80 shadow-sm bg-slate-55">
          {profile?.image ? (
            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-4xl font-extrabold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'T'}
            </div>
          )}
          <label className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer">
            <FiCamera className="text-xl" />
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </label>
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{profile?.name}</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Teacher ID: #{profile?.id}</p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Instructor
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              profile?.is_permanent 
                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>
              {profile?.is_permanent ? 'Permanent Staff' : 'Temporary / Contract'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Details */}
        {isEditing ? (
          <form onSubmit={handleSaveDetails} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.015)] animate-fade-down">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-1">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <FiUser className="text-indigo-600" /> Edit Contact Details
              </h3>
              <button
                type="button"
                onClick={() => {
                  setProfileData({
                    number: profile.number || '',
                    address: profile.address || ''
                  });
                  setIsEditing(false);
                }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer animate-fade-in"
              >
                <FiX />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                <input
                  type="text"
                  value={profileData.number}
                  onChange={(e) => setProfileData({ ...profileData, number: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 bg-white font-semibold"
                  placeholder="e.g. +880 180..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Residential Address</label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 bg-white font-semibold min-h-[80px] resize-y"
                  placeholder="e.g. Dhaka, Bangladesh"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Save Details
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.015)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-1">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <FiUser className="text-indigo-600" /> Contact Details
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-xs font-bold text-slate-650 cursor-pointer flex items-center gap-1 transition-all"
              >
                <FiEdit2 className="text-xs" /> Edit Info
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                  <FiMail className="text-sm" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm font-semibold text-slate-700">{profile?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                  <FiPhone className="text-sm" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <span className="text-sm font-semibold text-slate-700">{profile?.number || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                  <FiMapPin className="text-sm" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential Address</span>
                  <span className="text-sm font-semibold text-slate-700">{profile?.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Details */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.015)]">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
            <FiBookOpen className="text-indigo-600" /> Academic details
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiAward className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Designation</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.designation || 'Instructor'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                <FiUser className="text-sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Employment Status</span>
                <span className="text-sm font-semibold text-slate-700">{profile?.is_active ? 'Active / Permanent' : 'Temporary'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Qualifications Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.015)]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-1">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <FiAward className="text-indigo-600" /> Academic Qualifications
          </h3>
          {!showForm && (
            <button
              onClick={() => {
                setEditId(null);
                setFormData({ degree: '', institution: '', passing_year: '', result: '' });
                setShowForm(true);
              }}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <FiPlus /> Add Degree
            </button>
          )}
        </div>

        {/* Inline Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 md:p-5 flex flex-col gap-4 animate-fade-down duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {editId ? 'Edit Degree Record' : 'Add Degree / Certificate'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <FiX />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Degree Title *</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g. Bachelor of Science in Electrical Engineering"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 bg-white font-semibold"
                  required
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution / University *</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="e.g. Massachusetts Institute of Technology"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 bg-white font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Graduation Year *</label>
                <input
                  type="number"
                  name="passing_year"
                  value={formData.passing_year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2016"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 bg-white font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score / Result</label>
                <input
                  type="text"
                  name="result"
                  value={formData.result}
                  onChange={handleInputChange}
                  placeholder="e.g. CGPA 3.84"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 bg-white font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={formLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                {formLoading ? 'Saving...' : editId ? 'Save Changes' : 'Save Degree'}
              </button>
            </div>
          </form>
        )}

        {/* Qualifications List */}
        {qualifications.length === 0 ? (
          <p className="text-xs text-slate-400 italic font-medium py-4 text-center">
            No academic qualifications added. Click "Add Degree" to record yours.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {qualifications.map(q => (
              <div key={q.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-all bg-white">
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-extrabold text-slate-800 text-xs">{q.degree}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{q.institution}</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">Graduation: {q.passing_year}</span>
                    {q.result && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{q.result}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditId(q.id);
                      setFormData({
                        degree: q.degree,
                        institution: q.institution,
                        passing_year: q.passing_year,
                        result: q.result || ''
                      });
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-slate-400 cursor-pointer animate-fade-in"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 cursor-pointer animate-fade-in"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
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
