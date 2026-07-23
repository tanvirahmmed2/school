'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiAward } from 'react-icons/fi';
import Link from 'next/link';
import AdminForm from '@/component/forms/AdminForm';

const CreateAchievementPage = () => {
  const router = useRouter();

  const achievementFields = [
    {
      name: 'title',
      label: 'Achievement Title',
      type: 'text',
      required: true,
      placeholder: 'e.g. Regional Hackathon Championship'
    },
    {
      name: 'image',
      label: 'Achievement Image',
      type: 'file',
      required: false
    },
    {
      name: 'description',
      label: 'Description / Details',
      type: 'textarea',
      required: true,
      placeholder: 'Provide detailed information about this institutional or student achievement milestone...',
      rows: 6
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
            Control Panel
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            Record New Achievement
          </h1>
        </div>
        <Link
          href="/admin/achievements/list"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <FiAward />
          <span>View Recorded Achievements</span>
        </Link>
      </div>

      <AdminForm
        title="Achievement Entry Details"
        fields={achievementFields}
        apiEndpoint="/api/achievements"
        icon={FiAward}
        onSuccess={() => {
          router.push('/admin/achievements/list');
        }}
      />
    </div>
  );
};

export default CreateAchievementPage;
