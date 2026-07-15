'use client';

import React from 'react';
import { FiBook, FiEdit, FiTrash2 } from 'react-icons/fi';

const SubjectCard = ({ subject, onEdit, onDelete, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between h-full ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-600 text-lg shrink-0">
            <FiBook />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate">
              {subject.name}
            </h4>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black text-slate-500 bg-slate-100 border border-slate-200 uppercase tracking-widest">
              Code: {subject.code}
            </span>
          </div>
        </div>

        {/* Admin actions if callbacks are provided */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1.5 shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(subject)}
                className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                title="Edit Subject"
              >
                <FiEdit className="text-xs" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(subject.id)}
                className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                title="Delete Subject"
              >
                <FiTrash2 className="text-xs" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-slate-50 my-4"></div>

      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
        <span>DB Key: {subject.id}</span>
        <span className="text-blue-600 font-bold uppercase tracking-wider">Active Subject</span>
      </div>
    </div>
  );
};

export default SubjectCard;
