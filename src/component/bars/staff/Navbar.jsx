'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Context } from '@/component/helper/Context';

const Navbar = () => {
  const router = useRouter();
  const { staffSidebar, setStaffSidebar } = useContext(Context);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        const response = await fetch('/api/staff/me');
        if (response.ok) {
          const data = await response.json();
          setStaff(data.paylod.staff);
        }
      } catch (error) {
        console.error('Failed to fetch staff profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/staff/logout', {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('Logged out successfully.');
        router.push('/auth/access/staff/login');
      } else {
        toast.error('Failed to log out.');
      }
    } catch (error) {
      toast.error('Logout error occurred.');
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'cashier':
        return 'Cashier';
      case 'registrar':
        return 'Registrar';
      default:
        return 'Staff';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger toggle button */}
        <button
          onClick={() => setStaffSidebar(!staffSidebar)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 md:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm md:text-base hidden sm:inline-block">
            Staff Portal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Logged in staff info profile */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-655 text-xs font-semibold">
          <FiUser className="text-sm text-slate-400" />
          {loading ? (
            <span className="w-16 h-3 bg-slate-200 animate-pulse rounded"></span>
          ) : (
            <span>
              {staff ? `${staff.name} (${getRoleLabel(staff.role)})` : 'Staff'}
            </span>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 text-red-600 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer"
        >
          <FiLogOut className="text-sm" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
