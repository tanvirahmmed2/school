'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import StaffCreateForm from '@/component/forms/StaffCreateForm';

const AdminNewStaffPage = () => {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Add Staff Account
        </h1>
        <p className="text-sm text-slate-500">
          Create administrative or desk access credentials for Cashier, Registrar, and General Staff.
        </p>
      </div>

      <StaffCreateForm
        onSuccess={() => router.push('/admin/staff/list')}
        onCancel={() => router.push('/admin/staff/list')}
      />
    </div>
  );
};

export default AdminNewStaffPage;
