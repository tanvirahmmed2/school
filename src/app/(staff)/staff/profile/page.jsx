'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCheckCircle,
  FiShield, FiSave, FiKey, FiCalendar, FiSliders
} from 'react-icons/fi';

const StaffProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/staff/me');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch staff profile.');
      }
      const staffData = data.paylod?.staff;
      if (staffData) {
        setProfile(staffData);
        setName(staffData.name || '');
        setEmail(staffData.email || '');
        setPhone(staffData.phone || '');
        setAddress(staffData.address || '');
        setIsTwoFactorEnabled(Boolean(staffData.is_two_factor_enabled));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      toast.error('Please fill in name, phone number, and address.');
      return;
    }

    setUpdatingProfile(true);
    try {
      const response = await fetch('/api/staff/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      toast.success(data.message || 'Profile updated successfully!');
      if (data.paylod?.staff) {
        setProfile(data.paylod.staff);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleToggle2FA = async (newValue) => {
    setToggling2FA(true);
    try {
      const response = await fetch('/api/staff/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_two_factor_enabled: newValue }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update 2FA status.');
      }

      setIsTwoFactorEnabled(newValue);
      toast.success(newValue ? 'Two-Factor Authentication Enabled!' : 'Two-Factor Authentication Disabled!');
      if (data.paylod?.staff) {
        setProfile(data.paylod.staff);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setToggling2FA(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await fetch('/api/staff/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      toast.success(data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading staff profile...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-2xl shadow-xs">
            <FiUser />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{profile?.name}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 capitalize">
                <FiCheckCircle className="text-xs" /> {profile?.role || 'Staff Member'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><FiMail /> {profile?.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FiShield /> Staff ID: #{profile?.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-xl ${
            isTwoFactorEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <FiShield className={isTwoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'} />
            {isTwoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Information Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <FiUser className="text-emerald-600 text-lg" /> Personal Details
            </h2>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiUser className="text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={updatingProfile}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>

              {/* READ-ONLY EMAIL INPUT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FiMail className="text-slate-400" /> Email Address</span>
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1"><FiLock className="text-[10px]" /> Read-only</span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed outline-none select-none font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiPhone className="text-slate-400" /> Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={updatingProfile}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMapPin className="text-slate-400" /> Contact Address
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={updatingProfile}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5 resize-none"
                />
              </div>

              <div className="flex justify-end md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {updatingProfile ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiSave className="text-base" /> Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* TWO-FACTOR AUTHENTICATION TOGGLE CARD */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <FiShield className="text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Require 6-digit email OTP verification on login</p>
                </div>
              </div>

              <button
                type="button"
                disabled={toggling2FA}
                onClick={() => handleToggle2FA(!isTwoFactorEnabled)}
                className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                  isTwoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                    isTwoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              When enabled, signing into your staff account will require entering a one-time passcode sent directly to your registered email address ({email}).
            </p>
          </div>
        </div>

        {/* Right Column: Password Change & Meta Card */}
        <div className="flex flex-col gap-6">
          {/* Security & Password Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <FiKey className="text-emerald-600 text-lg" /> Security & Password
            </h2>

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiLock className="text-slate-400" /> Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={updatingPassword}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiLock className="text-slate-400" /> New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={updatingPassword}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiLock className="text-slate-400" /> Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={updatingPassword}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {updatingPassword ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiLock className="text-base" /> Update Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Overview Metadata */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-200">
              <FiShield className="text-emerald-500 text-base" /> Account Metadata
            </h3>

            <div className="flex flex-col gap-3 text-xs text-slate-300 divide-y divide-slate-800">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 flex items-center gap-1.5"><FiUser /> Account ID</span>
                <span className="font-mono font-bold text-white">#{profile?.id}</span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 flex items-center gap-1.5"><FiSliders /> Staff Role</span>
                <span className="font-semibold text-white capitalize">{profile?.role || 'Staff Member'}</span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 flex items-center gap-1.5"><FiShield /> 2FA Status</span>
                <span className={`font-semibold ${isTwoFactorEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 flex items-center gap-1.5"><FiCalendar /> Joined On</span>
                <span className="font-semibold text-slate-200">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage;
