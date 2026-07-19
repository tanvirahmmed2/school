'use client';

import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiCalendar, FiCreditCard, FiAlertOctagon } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CashierTransactionsPage = () => {
  const [role, setRole] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndTransactions = async () => {
      try {
        const profileRes = await fetch('/api/staff/me');
        if (!profileRes.ok) {
          setLoading(false);
          return;
        }
        const profileData = await profileRes.json();
        const userRole = profileData.paylod.staff.role;
        setRole(userRole);

        if (userRole === 'cashier') {
          const transRes = await fetch('/api/admin/finance/transactions');
          if (transRes.ok) {
            const transData = await transRes.json();
            setTransactions(transData.paylod?.transactions || []);
          }
        }
      } catch (err) {
        toast.error('Failed to load transaction data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndTransactions();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading billing records...</span>
      </div>
    );
  }

  // Hardcoded role check guard
  if (role !== 'cashier') {
    return (
      <div className="w-full max-w-md mx-auto mt-16 p-8 bg-red-50 border border-red-100 rounded-3xl text-center flex flex-col items-center gap-4 shadow-sm animate-fade-up">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <FiAlertOctagon className="text-red-600 text-xl" />
        </div>
        <div>
          <h2 className="text-base font-bold text-red-800">Access Denied</h2>
          <p className="text-xs text-red-650 mt-1">
            This module is restricted to the <strong>Cashier</strong> role only. You do not have permissions to view this ledger.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiDollarSign className="text-amber-500 animate-bounce" /> Transaction Ledger
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review general incoming and outgoing payments recorded by the Fontana Institute finance desk.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {transactions.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-5xl mb-3">💵</span>
            <h3 className="text-sm font-bold text-slate-600">No Transactions Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              No transactions have been recorded in the ledger yet.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((trans) => (
                  <tr key={trans.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      #{trans.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {trans.description || 'General Payment'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                        <FiCreditCard className="text-slate-400" />
                        {trans.payment_method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar />
                        {new Date(trans.payment_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">
                      ${Number(trans.amount).toFixed(2)}
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

export default CashierTransactionsPage;
