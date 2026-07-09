'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiDollarSign, FiDownload, FiShield } from 'react-icons/fi';

const AdminStaffSalaryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get('/api/salaries?type=staff');
      setSalaries(response.data.salaries || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiDollarSign className="text-blue-600" /> Staff Salary Ledger
        </h1>
        <p className="text-sm text-slate-500">
          Track salary pay slips, allowances, deductions, and payment statuses for school staff.
        </p>
      </div>

      {/* Salary List Registry Table */}
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
            <h3 className="text-sm font-bold text-slate-655 text-slate-600">No Salaries Registered</h3>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.staff_role === 'register' ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100">
                          <FiShield className="text-[10px]" /> Register
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          Staff
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-5050 text-slate-500">{salary.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">${parseFloat(salary.basic).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">${parseFloat(salary.allowance).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">${parseFloat(salary.deductions).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      ${(parseFloat(salary.basic) + parseFloat(salary.allowance) - parseFloat(salary.deductions)).toLocaleString()}
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
    </div>
  );
};

export default AdminStaffSalaryPage;
