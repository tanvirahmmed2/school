'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { Context } from '../helper/Context';

const Back = () => {
  const router = useRouter();
  const context = useContext(Context);

  const handleBack = () => {
    if (context?.goBack) {
      context.goBack();
    } else {
      router.back();
    }
  };

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      router.refresh();
    }
  };

  const handleNext = () => {
    router.forward();
  };

  return (
    <div className="grid grid-cols-3 gap-1.5 w-full mb-1">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center justify-center gap-1 px-2 py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs group"
        title="Go Back"
      >
        <FiArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
        <span>Back</span>
      </button>

      <button
        type="button"
        onClick={handleReload}
        className="flex items-center justify-center gap-1 px-2 py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs group"
        title="Reload Page"
      >
        <FiRefreshCw className="text-xs group-hover:rotate-180 transition-transform duration-300" />
        <span>Reload</span>
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="flex items-center justify-center gap-1 px-2 py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs group"
        title="Go Forward"
      >
        <span>Next</span>
        <FiArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default Back;