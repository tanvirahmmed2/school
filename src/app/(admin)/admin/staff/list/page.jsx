'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiUsers, FiMail, FiPhone, FiMapPin, FiCheckCircle, FiXCircle, FiShield, FiUser } from 'react-icons/fi';

const AdminStaffListPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/staff');
      setStaffList(response.data.staff || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleStatus = async (staff) => {
    const nextStatus = !staff.is_active;
    try {
      await axios.put(`/api/staff/${staff.id}`, {
        name: staff.name,
        email: staff.email,
        number: staff.number,
        designation: staff.designation,
        address: staff.address,
        role: staff.role,
        is_active: nextStatus,
      });

      toast.success(
        `Staff member ${staff.name} has been ${nextStatus ? 'activated' : 'deactivated'}.`
      );
      
      // Update state directly
      setStaffList(
        staffList.map((s) => (s.id === staff.id ? { ...s, is_active: nextStatus } : s))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleRoleChange = async (staff, nextRole) => {
    try {
      await axios.put(`/api/staff/${staff.id}`, {
        name: staff.name,
        email: staff.email,
        number: staff.number,
        designation: staff.designation,
        address: staff.address,
        role: nextRole,
        is_active: staff.is_active,
      });

      toast.success(
        `Staff member ${staff.name} has been updated to role ${nextRole.toUpperCase()}.`
      );

      // Update state directly
      setStaffList(
        staffList.map((s) => (s.id === staff.id ? { ...s, role: nextRole } : s))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteStaff = async (id, staffName) => {
    const confirm = window.confirm(
      `Are you sure you want to delete staff member "${staffName}"? This action cannot be undone.`
    );
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/staff/${id}`);
      toast.success(response.data.message || 'Staff account deleted.');
      setStaffList(staffList.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiUsers className="text-blue-600" /> Staff Registry
        </h1>
        <p className="text-sm text-slate-500">
          View and manage registered staff members and registers/registrars.
        </p>
      </div>

      {/* Staff List Table Card */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Registered Staff ({staffList.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading registry...</span>
          </div>
        ) : staffList.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-350 text-5xl mb-3">👥</span>
            <h3 className="text-sm font-bold text-slate-600">No Staff Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Register new staff profiles using the "New Staff Account" menu.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Address
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
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center">
                          <FiUser className="text-base" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                          <div className="flex gap-2 items-center text-[10px] text-slate-400 font-semibold">
                            <span>Staff ID: {staff.id}</span>
                            <span>•</span>
                            <span className="text-slate-500 font-bold">{staff.designation || 'Unset designation'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={staff.role}
                        onChange={(e) => handleRoleChange(staff, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer outline-none transition-all duration-150 ${
                          staff.role === 'register'
                            ? 'bg-purple-50 text-purple-600 border-purple-100 focus:ring-2 focus:ring-purple-500/20'
                            : 'bg-blue-50 text-blue-600 border-blue-100 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                      >
                        <option value="staff">Staff</option>
                        <option value="register">Register</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <FiMail className="text-slate-400" /> {staff.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiPhone className="text-slate-400" /> {staff.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 flex items-center gap-1.5">
                        <FiMapPin className="text-slate-400" /> {staff.address}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(staff)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                          staff.is_active
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                        title="Click to toggle active status"
                      >
                        {staff.is_active ? (
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
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Remove Staff Member"
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

export default AdminStaffListPage;
