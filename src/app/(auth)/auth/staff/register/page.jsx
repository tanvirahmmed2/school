'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiPhone, FiMapPin, FiArrowRight, FiUserPlus } from 'react-icons/fi';
import GenericForm from '@/component/forms/GenericForm';

const StaffRegistration = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  // Setup fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const [step, setStep] = useState(1); // 1 = Verify email, 2 = Complete setup
  const [loading, setLoading] = useState(false);

  // Step 1: Verify pre-created Staff Email
  const handleVerifyEmail = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email) {
      toast.error('Email address is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/staff/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email address.');
      }

      toast.success(data.message || 'Email verified. Complete your profile details below.');
      setName(data.staff.name);
      setPhone(data.staff.number);
      setDesignation(data.staff.designation);
      setRole(data.staff.role);
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete profile registration details
  const handleCompleteSetup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !address || !password) {
      toast.error('Address and Password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/staff/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          address: address.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete profile setup.');
      }

      toast.success(data.message || 'Account setup completed successfully!');
      router.push('/auth/staff/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Form Fields Configs
  const verifyFields = [
    { name: 'email', label: 'Enter Registered Email', type: 'email', required: true, placeholder: 'staff@school.com', icon: FiMail }
  ];

  const setupFields = [
    { name: 'address', label: 'Residential Address', type: 'textarea', required: true, placeholder: 'e.g. House 12, Road 2, Sector 3, Uttara, Dhaka', icon: FiMapPin, colSpan: 'col-span-2' },
    { name: 'password', label: 'Choose Password', type: 'password', required: true, placeholder: 'Minimum 6 characters', icon: FiLock, colSpan: 'col-span-2' }
  ];

  const handleChange = (fieldName, val) => {
    if (fieldName === 'email') setEmail(val);
    else if (fieldName === 'address') setAddress(val);
    else if (fieldName === 'password') setPassword(val);
  };

  const readOnlySection = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 text-xs font-semibold">
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
        <p className="text-slate-700 mt-0.5">{name}</p>
      </div>
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
        <p className="text-slate-700 mt-0.5">{email}</p>
      </div>
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
        <p className="text-slate-700 mt-0.5">{phone}</p>
      </div>
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Designation / Role</span>
        <p className="text-slate-700 mt-0.5">{designation} ({role ? role.toUpperCase() : ''})</p>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 relative px-4 py-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] aspect-square rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-140 animate-fade-up z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Staff Account Setup</h1>
          <p className="text-sm text-slate-500 max-w-100">
            {step === 1 
              ? 'Complete your profile registration using the email address pre-registered by administration.' 
              : `Verification successful. Welcome, ${name}. Complete your credentials details below.`}
          </p>
        </div>

        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          {step === 1 ? (
            <GenericForm
              fields={verifyFields}
              values={{ email }}
              onChange={handleChange}
              onSubmit={handleVerifyEmail}
              submitText={
                <span className="flex items-center gap-1.5">
                  Verify Email Address <FiArrowRight className="text-lg" />
                </span>
              }
              submitting={loading}
              gridClass="flex flex-col gap-4 max-w-110 mx-auto"
            />
          ) : (
            <GenericForm
              fields={setupFields}
              values={{ address, password }}
              onChange={handleChange}
              onSubmit={handleCompleteSetup}
              submitText={
                <span className="flex items-center gap-1.5">
                  <FiUserPlus className="text-lg" /> Complete Account Setup
                </span>
              }
              submitting={loading}
              readOnlySection={readOnlySection}
              gridClass="grid grid-cols-1 gap-4"
            />
          )}
        </div>

        <div className="w-full text-center mt-6">
          <Link
            href="/auth/staff/login"
            className="text-xs font-semibold hover:text-indigo-600 transition-colors py-1.5 px-3 rounded-full hover:bg-indigo-50 text-indigo-600"
          >
            Back to Staff Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration;
