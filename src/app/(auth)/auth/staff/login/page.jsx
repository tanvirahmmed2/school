'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight, FiUsers, FiHome } from 'react-icons/fi';
import GenericForm from '@/component/forms/GenericForm';

const StaffLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in.');
      }

      toast.success(data.message || 'Logged in successfully!');
      
      // Redirect based on staff role
      if (data.staff.role === 'registrar') {
        router.push('/staffs/registrar');
      } else {
        router.push('/staffs/staff');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'staff@school.com', icon: FiMail },
    { name: 'password', label: 'Password', type: 'password', required: true, placeholder: '••••••••', icon: FiLock },
  ];

  const values = { email, password };

  const handleChange = (fieldName, val) => {
    if (fieldName === 'email') setEmail(val);
    else if (fieldName === 'password') setPassword(val);
  };

  const extraLink = (
    <div className="flex flex-col gap-3 mt-1">
      <div className="text-right">
        <Link
          href="/auth/staff/recovery"
          className="text-xs font-medium text-indigo-650 hover:text-indigo-700 transition-colors text-indigo-600"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="text-center text-xs font-semibold text-slate-400 mt-2">
        First time logging in?{' '}
        <Link href="/auth/staff/register" className="text-indigo-650 hover:text-indigo-700 transition-colors underline text-indigo-600">
          Setup your account here
        </Link>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 relative px-4 py-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] aspect-square rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-110 animate-fade-up z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Staff Portal</h1>
          <p className="text-sm text-slate-500 max-w-80">Log in to access your administrative workspace or register panels.</p>
        </div>

        <div className="w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <GenericForm
            fields={fields}
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitText={
              <span className="flex items-center gap-1.5">
                <FiUsers className="text-lg" /> Staff Login <FiArrowRight className="text-lg" />
              </span>
            }
            submitting={loading}
            extraLink={extraLink}
            gridClass="flex flex-col gap-4"
          />
        </div>

        <div className="w-full text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-655 transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100"
          >
            <FiHome className="text-sm" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;