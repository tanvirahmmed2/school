'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TeacherCreateForm from '@/component/forms/TeacherCreateForm';

const AdminNewTeacherPage = () => {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Add Teacher Account
        </h1>
        <p className="text-sm text-slate-500">
          Create credentials and profiles for newly joined educators.
        </p>
      </div>

      <TeacherCreateForm
        onSuccess={() => router.push('/admin/teachers/list')}
        onCancel={() => router.push('/admin/teachers/list')}
      />
    </div>
  );
};

export default AdminNewTeacherPage;
