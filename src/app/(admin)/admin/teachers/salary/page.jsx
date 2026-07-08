'use client';

import React from 'react';
import { FiDollarSign, FiDownload } from 'react-icons/fi';

const AdminSalaryPage = () => {
  const mockSalaries = [
    { id: 1, name: 'John Doe', month: 'June 2026', basic: '$3,500', allowance: '$400', deductions: '$100', net: '$3,800', status: 'Paid' },
    { id: 2, name: 'Sarah Connor', month: 'June 2026', basic: '$4,000', allowance: '$500', deductions: '$150', net: '$4,350', status: 'Paid' },
    { id: 3, name: 'Walter White', month: 'June 2026', basic: '$5,000', allowance: '$600', deductions: '$200', net: '$5,400', status: 'Processing' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiDollarSign className="text-blue-600" /> Salary Ledger
        </h1>
        <p className="text-sm text-slate-500">
          Track salary pay slips, allowances, deductions, and payment statuses.
        </p>
      </div>

      {/* Salary List Registry Table */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Payroll Ledger (Current Month)
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Teacher</th>
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
              {mockSalaries.map((salary) => (
                <tr key={salary.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{salary.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{salary.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{salary.basic}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{salary.allowance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{salary.deductions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{salary.net}</td>
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
      </div>
    </div>
  );
};

export default AdminSalaryPage;
