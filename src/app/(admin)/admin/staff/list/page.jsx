'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiUsers, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiBriefcase, FiUser, FiSend, FiPlus, FiEdit3, FiLogIn } from 'react-icons/fi';
import Link from 'next/link';

const AdminStaffListPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [payScales, setPayScales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState(null);

  // Edit modal states
  const [editingStaff, setEditingStaff] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editRole, setEditRole] = useState('staff');
  const [editGradeId, setEditGradeId] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/admin/staff');
      setStaffList(response.data.paylod?.staff || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const fetchPayScales = async () => {
    try {
      const response = await axios.get('/api/staff-pay-scales');
      setPayScales(response.data.paylod?.payScales || []);
    } catch (err) {
      console.error('Failed to load pay scales', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStaff(), fetchPayScales()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);
    setEditName(staff.name || '');
    setEditNumber(staff.number || '');
    setEditRole(staff.role || 'staff');
    setEditGradeId(staff.grade_id || '');
    setEditAddress(staff.address || '');
    setEditActive(staff.is_active);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName || !editNumber || !editRole) {
      toast.error('Name, phone number, and role are required.');
      return;
    }

    setSubmittingEdit(true);
    try {
      await axios.put(`/api/admin/staff/${editingStaff.id}`, {
        name: editName.trim(),
        email: editingStaff.email,
        number: editNumber.trim(),
        role: editRole,
        address: editAddress.trim(),
        is_active: editActive,
        grade_id: editGradeId || null
      });

      toast.success('Staff profile updated successfully.');
      setEditingStaff(null);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleToggleStatus = async (staff) => {
    const nextStatus = !staff.is_active;
    try {
      await axios.put(`/api/admin/staff/${staff.id}`, {
        name: staff.name,
        email: staff.email,
        number: staff.number,
        role: staff.role,
        address: staff.address,
        is_active: nextStatus,
        grade_id: staff.grade_id
      });

      toast.success(`Staff member ${staff.name} status updated successfully.`);
      
      setStaffList(
        staffList.map((s) => (s.id === staff.id ? { ...s, is_active: nextStatus } : s))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete staff member "${name}"?`);
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/admin/staff/${id}`);
      toast.success(response.data.message || 'Staff member account deleted.');
      setStaffList(staffList.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleResendVerification = async (staff) => {
    setResendingId(staff.id);
    try {
      const response = await axios.post('/api/admin/staff/resend-verification', {
        staff_id: staff.id
      });
      toast.success(response.data.message || `Verification link successfully sent to ${staff.email}`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setResendingId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'cashier':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'register':
        return 'bg-sky-50 text-sky-600 border border-sky-100';
      default:
        return 'bg-slate-50 text-slate-655 border border-slate-200';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'cashier':
        return 'Cashier';
      case 'register':
        return 'Registrar';
      default:
        return 'General Staff';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiUsers className="text-blue-600" /> Staff Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pre-register, delete, and control portal statuses of cashier, registrar, and general support staff.
          </p>
        </div>

        <div>
          <Link
            href="/admin/staff/new"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <FiPlus /> New Staff Member
          </Link>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading staff records...</span>
          </div>
        ) : staffList.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-355 text-5xl mb-3">👥</span>
            <h3 className="text-sm font-bold text-slate-655">No Staff Registered</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              Add a cashier, registrar, or general staff member to begin managing permissions.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Grade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                          <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1"><FiMail /> {staff.email}</span>
                            <span>|</span>
                            <span className="flex items-center gap-1"><FiPhone /> {staff.number}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${getRoleBadgeColor(staff.role)}`}>
                        {getRoleLabel(staff.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      {payScales.find((p) => p.id == staff.grade_id)?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {staff.is_registered ? (
                          <button
                            onClick={() => handleToggleStatus(staff)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                              staff.is_active
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            {staff.is_active ? 'Active' : 'Suspended'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>Setup Pending</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!staff.is_registered && (
                          <button
                            disabled={resendingId === staff.id}
                            onClick={() => handleResendVerification(staff)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                            title="Resend verification link"
                          >
                            <FiSend className={resendingId === staff.id ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">Resend Link</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(staff)}
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all cursor-pointer"
                          title="Edit staff member details"
                        >
                          <FiEdit3 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id, staff.name)}
                          className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition-all cursor-pointer"
                          title="Delete staff account"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal Dialog */}
      {editingStaff && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Edit Staff Member</h2>
            <p className="text-xs text-slate-400 mb-6">Modify profile details, credentials, portal access role, or salary grade.</p>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portal Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="staff">General Staff</option>
                    <option value="cashier">Cashier</option>
                    <option value="register">Registrar</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary Grade</label>
                  <select
                    value={editGradeId}
                    onChange={(e) => setEditGradeId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Unassigned</option>
                    {payScales.map((scale) => (
                      <option key={scale.id} value={scale.id}>
                        {scale.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-350 focus:ring-blue-500/20"
                />
                <label htmlFor="editActive" className="text-xs font-semibold text-slate-655 select-none cursor-pointer">
                  Account is Active (Un-check to suspend)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-50 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  disabled={submittingEdit}
                  className="px-5 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {submittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffListPage;
