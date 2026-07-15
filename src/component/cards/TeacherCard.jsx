'use client';

import React from 'react';
import { FiMail, FiPhone, FiEdit, FiTrash2 } from 'react-icons/fi';

const TeacherCard = ({ teacher, onEdit, onDelete, className = '' }) => {
  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : '👤';
  };

  return (
    <div className={`bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between h-full ${className}`}>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar/Thumbnail */}
            {teacher.image ? (
              <img 
                src={teacher.image} 
                alt={teacher.name} 
                className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 border border-slate-150 flex items-center justify-center text-sm font-black text-slate-550 text-slate-500 shrink-0">
                {getInitials(teacher.name)}
              </div>
            )}

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-800 truncate">
                {teacher.name}
              </h4>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 uppercase tracking-widest">
                {teacher.designation || 'Faculty Member'}
              </span>
            </div>
          </div>

          {/* Admin actions if callbacks are provided */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1.5 shrink-0 self-start">
              {onEdit && (
                <button
                  onClick={() => onEdit(teacher)}
                  className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <FiEdit className="text-xs" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(teacher.id)}
                  className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <FiTrash2 className="text-xs" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="w-full h-px bg-slate-50 my-4"></div>
      </div>

      {/* Contact Details */}
      <div className="flex flex-col gap-2 text-xs font-semibold text-slate-500 mt-auto">
        <a 
          href={`mailto:${teacher.email}`}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors truncate"
        >
          <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
            <FiMail className="text-xs" />
          </span>
          <span className="truncate">{teacher.email}</span>
        </a>
        {teacher.number && (
          <a 
            href={`tel:${teacher.number}`}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
              <FiPhone className="text-xs" />
            </span>
            <span>{teacher.number}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default TeacherCard;
