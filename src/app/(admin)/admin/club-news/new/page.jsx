'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlusCircle, FiFileText } from 'react-icons/fi';
import Link from 'next/link';
import AdminForm from '@/component/forms/AdminForm';

const CreateClubNewsPage = () => {
  const router = useRouter();
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/clubs');
        if (res.ok) {
          const data = await res.json();
          setClubs(data.clubs || []);
        }
      } catch (err) {
        console.error('Failed to load clubs:', err);
      } finally {
        setLoadingClubs(false);
      }
    };
    fetchClubs();
  }, []);

  const clubNewsFields = [
    {
      name: 'club_id',
      label: 'Campus Club',
      type: 'select',
      required: true,
      placeholder: 'Select a club...',
      options: clubs.map(c => ({ value: c.id, label: c.name }))
    },
    {
      name: 'title',
      label: 'Club News Title',
      type: 'text',
      required: true,
      placeholder: 'e.g. Photography Club Exhibition 2026'
    },
    {
      name: 'image',
      label: 'Cover Image File',
      type: 'file',
      required: false
    },
    {
      name: 'content',
      label: 'Content / Announcement Details',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the club announcement or event summary details...',
      rows: 8
    }
  ];

  if (loadingClubs) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-400">Loading active clubs...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Control Panel
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            Publish Club Announcement
          </h1>
        </div>
        <Link
          href="/admin/club-news/list"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <FiFileText />
          <span>View Published Club News</span>
        </Link>
      </div>

      <AdminForm
        title="Club Announcement Details"
        fields={clubNewsFields}
        apiEndpoint="/api/club-news"
        icon={FiPlusCircle}
        onSuccess={() => {
          router.push('/admin/club-news/list');
        }}
      />
    </div>
  );
};

export default CreateClubNewsPage;
