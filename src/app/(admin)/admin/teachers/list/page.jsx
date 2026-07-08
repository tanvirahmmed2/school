'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiUsers, FiMail, FiPhone, FiMapPin, FiCheckCircle, FiXCircle, FiBriefcase, FiUser } from 'react-icons/fi';

const AdminTeachersListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers');
      setTeachers(response.data.teachers || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleToggleStatus = async (teacher) => {
    const nextStatus = !teacher.is_active;
    try {
      await axios.put(`/api/teachers/${teacher.id}`, {
        name: teacher.name,
        email: teacher.email,
        number: teacher.number,
        designation: teacher.designation,
        address: teacher.address,
        is_active: nextStatus,
      });

      toast.success(
        `Teacher ${teacher.name} status updated successfully.`
      );
      
      setTeachers(
        teachers.map((t) => (t.id === teacher.id ? { ...t, is_active: nextStatus } : t))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteTeacher = async (id, teacherName) => {
    const confirm = window.confirm(
      `Are you sure you want to delete teacher "${teacherName}"? This will clear all class-subject assignments for this teacher as well.`
    );
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/teachers/${id}`);
      toast.success(response.data.message || 'Teacher account deleted.');
      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiUsers className="text-blue-600" /> Teachers Registry
        </h1>
        <p className="text-sm text-slate-500">
          View all registered teacher profiles, manage statuses, or remove records.
        </p>
      </div>

      {/* Teachers List Registry Table */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Registered Teachers ({teachers.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading registry...</span>
          </div>
        ) : teachers.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-350 text-5xl mb-3">👥</span>
            <h3 className="text-sm font-bold text-slate-600">No Teachers Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Register new teacher profiles using the "New Teacher Account" menu.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Teacher Details
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Account Setup
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center">
                          <FiUser className="text-base" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{teacher.name}</p>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                            <FiBriefcase className="text-slate-450" /> {teacher.designation || 'Unset designation'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-slate-655">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <FiMail className="text-slate-400 text-xs" /> {teacher.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <FiPhone className="text-slate-400 text-xs" /> {teacher.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 flex items-center gap-1.5">
                        <FiMapPin className="text-slate-400" /> 
                        {teacher.address || <span className="text-slate-400 italic">Address Pending Setup</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${teacher.is_registered 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        {teacher.is_registered ? 'Setup Completed' : 'Pending Register'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(teacher)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                          teacher.is_active
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                        title="Click to toggle active status"
                      >
                        {teacher.is_active ? (
                          <>
                            <FiCheckCircle className="text-sm" /> Active
                          </>
                        ) : (
                          <>
                            <FiXCircle className="text-sm" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-655 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Remove Teacher"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeachersListPage;
