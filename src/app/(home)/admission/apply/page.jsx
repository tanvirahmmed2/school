'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiFileText } from 'react-icons/fi';
import AdmissionApplyForm from '@/component/forms/AdmissionApplyForm';

const ApplyFormContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const admissionIdParam = searchParams.get('admission_id');

  const [circulars, setCirculars] = useState([]);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCirculars = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/admissions');
        const data = await res.json();
        if (data.success && data.paylod?.circulars) {
          const list = data.paylod.circulars;
          setCirculars(list);

          // If circular ID parameter is provided, auto-select it
          if (admissionIdParam) {
            const found = list.find((c) => c.id.toString() === admissionIdParam);
            if (found) {
              setSelectedCircular(found);
            }
          }
        }
      } catch (err) {
        toast.error('Failed to load admission options.');
      } finally {
        setLoading(false);
      }
    };

    loadCirculars();
  }, [admissionIdParam]);

  const handleCircularChange = (id) => {
    const found = circulars.find((c) => c.id.toString() === id);
    setSelectedCircular(found || null);
  };

  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (formValues) => {
    if (!selectedCircular) {
      toast.error('Please select an admission circular target.');
      return;
    }

    // Client-side age validation
    const candidateAge = calculateAge(formValues.date_of_birth);
    if (selectedCircular.min_age !== null && candidateAge < selectedCircular.min_age) {
      toast.error(`Age requirement not met. Candidate age (${candidateAge}) is under target minimum of ${selectedCircular.min_age} years.`);
      return;
    }
    if (selectedCircular.max_age !== null && candidateAge > selectedCircular.max_age) {
      toast.error(`Age requirement not met. Candidate age (${candidateAge}) exceeds target maximum of ${selectedCircular.max_age} years.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/students/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          admission_id: selectedCircular.id
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Your application has been registered successfully!');
        router.push('/admission');
      } else {
        throw new Error(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Preparing application form...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
          <FiFileText />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Admission Registration Form</h2>
          <p className="text-xs text-slate-450 text-slate-400">Fill in the candidate's profile credentials.</p>
        </div>
      </div>

      <AdmissionApplyForm
        circulars={circulars}
        selectedCircular={selectedCircular}
        onCircularChange={handleCircularChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        admissionIdParam={admissionIdParam}
        onGoBack={() => router.push('/admission')}
      />
    </div>
  );
};

const ApplyPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Fontana Enrollment Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Intake Application Registry
          </h1>
        </div>

        <Suspense fallback={
          <div className="w-full min-h-[40vh] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ApplyFormContent />
        </Suspense>
      </div>
    </div>
  );
};

export default ApplyPage;
