'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiFileText, FiCheck, FiX, FiShield } from 'react-icons/fi';

const AdminStaffApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/leave-applications?type=staff');
      setApplications(response.data.applications || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.put(`/api/leave-applications/${id}`, { status });
      toast.success(response.data.message || `Leave application status updated.`);
      setApplications(
        applications.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiFileText className="text-blue-600" /> Staff Applications Drawer
        </h1>
        <p className="text-sm text-slate-500">
          Review, approve, or reject staff job requests or leave applications.
        </p>
      </div>

      {/* Applications Table Card */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Staff Leave Applications Registry
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-5xl mb-3">📄</span>
            <h3 className="text-sm font-bold text-slate-655 text-slate-600">No Applications Filed</h3>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Request Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date/Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => {
                  const startStr = new Date(app.start_date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                  const endStr = new Date(app.end_date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                  const diffTime = Math.abs(new Date(app.end_date) - new Date(app.start_date));
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{app.staff_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.staff_role === 'registrar' ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100">
                            <FiShield className="text-[10px]" /> Registrar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                            Staff
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-5050 text-slate-500">{app.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{startStr} to {endStr} ({diffDays} {diffDays === 1 ? 'Day' : 'Days'})</td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate" title={app.reason}>{app.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                          app.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                        {app.status === 'Pending' ? (
                          <div className="inline-flex gap-1.5">
                            <button 
                              onClick={() => handleUpdateStatus(app.id, 'Approved')}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                              title="Approve Application"
                            >
                              <FiCheck className="text-sm" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                              title="Reject Application"
                            >
                              <FiX className="text-sm" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Action Needed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStaffApplicationsPage;
