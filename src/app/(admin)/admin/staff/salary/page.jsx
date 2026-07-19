'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiDollarSign, FiDownload, FiPlus, FiTrash2, FiSettings, FiGrid, FiEdit3 } from 'react-icons/fi';

const AdminStaffSalaryPage = () => {
  const [activeTab, setActiveTab] = useState('payroll'); // 'payroll' or 'grades'
  const [salaries, setSalaries] = useState([]);
  const [payScales, setPayScales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating/editing a pay scale
  const [editingScale, setEditingScale] = useState(null);
  const [gradeName, setGradeName] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowance, setAllowance] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get('/api/salaries?type=staff');
      setSalaries(response.data.paylod.salaries || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const fetchPayScales = async () => {
    try {
      const response = await axios.get('/api/staff-pay-scales');
      setPayScales(response.data.paylod?.payScales || []);
    } catch (error) {
      toast.error('Failed to load staff pay scale grades.');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchSalaries(), fetchPayScales()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleCreatePayScale = async (e) => {
    e.preventDefault();
    if (!gradeName || basicSalary === '' || allowance === '') {
      toast.error('All grade fields are required.');
      return;
    }

    setSubmittingGrade(true);
    try {
      if (editingScale) {
        const response = await axios.put(`/api/staff-pay-scales/${editingScale.id}`, {
          name: gradeName.trim(),
          basic_salary: parseFloat(basicSalary),
          allowance: parseFloat(allowance)
        });
        toast.success(response.data.message || 'Staff pay scale grade updated successfully!');
        setEditingScale(null);
      } else {
        const response = await axios.post('/api/staff-pay-scales', {
          name: gradeName.trim(),
          basic_salary: parseFloat(basicSalary),
          allowance: parseFloat(allowance)
        });
        toast.success(response.data.message || 'Staff pay scale grade created successfully!');
      }

      setGradeName('');
      setBasicSalary('');
      setAllowance('');
      fetchPayScales();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleEditClick = (scale) => {
    setEditingScale(scale);
    setGradeName(scale.name);
    setBasicSalary(scale.basic_salary.toString());
    setAllowance(scale.allowance.toString());
  };

  const handleCancelEdit = () => {
    setEditingScale(null);
    setGradeName('');
    setBasicSalary('');
    setAllowance('');
  };

  const handleDeletePayScale = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete staff pay grade "${name}"? Staff members assigned to it will be set to Unassigned.`);
    if (!confirm) return;

    try {
      await axios.delete(`/api/staff-pay-scales/${id}`);
      toast.success('Staff pay grade deleted successfully.');
      if (editingScale && editingScale.id === id) {
        handleCancelEdit();
      }
      setPayScales(payScales.filter((scale) => scale.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiDollarSign className="text-blue-600" /> Staff Payroll & Salaries (BDT)
        </h1>
        <p className="text-sm text-slate-500">
          Track salary pay slips, manage grade-wise staff salary scales, and set allowances.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-1.5">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'payroll'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FiGrid /> Salary Ledgers
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'grades'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FiSettings /> Staff Pay Grade Scales
        </button>
      </div>

      {activeTab === 'payroll' ? (
        /* Salary List Registry Table */
        <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">
              Staff Payroll Ledger (Current Month)
            </h2>
          </div>

          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading payroll...</span>
            </div>
          ) : salaries.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-300 text-5xl mb-3">💵</span>
              <h3 className="text-sm font-bold text-slate-655">No Salaries Registered</h3>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Member</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Salary</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Allowance</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Deductions</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Net Paid</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{salary.staff_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 capitalize">{salary.staff_role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{salary.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">৳{parseFloat(salary.basic).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">৳{parseFloat(salary.allowance).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">৳{parseFloat(salary.deductions).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                        ৳{(parseFloat(salary.basic) + parseFloat(salary.allowance) - parseFloat(salary.deductions)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          salary.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {salary.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center">
                          <FiDownload className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Pay Scales Management View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Grades List Table */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Current Staff Salary Grade Scales ({payScales.length})
              </h2>
            </div>

            {loading ? (
              <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-slate-400">Loading scales...</span>
              </div>
            ) : payScales.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
                <span className="text-slate-300 text-5xl mb-3">💵</span>
                <h3 className="text-sm font-bold text-slate-655">No Pay Grades Configured</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  Use the registration form on the right to define salary grade boundaries.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Grade Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Salary</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Allowance</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scale Salary</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payScales.map((scale) => (
                      <tr key={scale.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{scale.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">৳{parseFloat(scale.basic_salary).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">৳{parseFloat(scale.allowance).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                          ৳{(parseFloat(scale.basic_salary) + parseFloat(scale.allowance)).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEditClick(scale)}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Edit Pay Grade"
                          >
                            <FiEdit3 className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeletePayScale(scale.id, scale.name)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-655 text-red-600 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Delete Pay Grade"
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

          {/* Right panel: Create/Edit Grade Form */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] h-fit flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <FiPlus className="text-blue-600" /> {editingScale ? 'Update Salary Grade' : 'Create Salary Grade'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define basic salaries and default allowances for staff employee grades.
              </p>
            </div>

            <form onSubmit={handleCreatePayScale} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Grade Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Accounts Officer"
                  value={gradeName}
                  onChange={(e) => setGradeName(e.target.value)}
                  disabled={submittingGrade}
                  className="w-full px-3.5 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Basic Salary (BDT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 45000"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  disabled={submittingGrade}
                  className="w-full px-3.5 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Allowance (BDT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 6000"
                  value={allowance}
                  onChange={(e) => setAllowance(e.target.value)}
                  disabled={submittingGrade}
                  className="w-full px-3.5 py-2.5 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                {editingScale && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={submittingGrade}
                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingGrade}
                  className={`py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 ${editingScale ? 'w-1/2' : 'w-full'}`}
                >
                  {submittingGrade ? 'Saving...' : editingScale ? 'Save Changes' : 'Register Pay Scale Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffSalaryPage;
