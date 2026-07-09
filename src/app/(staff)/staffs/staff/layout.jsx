import React from 'react';
import { redirect } from 'next/navigation';
import { isStaff } from '@/lib/auth';

const StaffLayout = async ({ children }) => {
  const authenticated = await isStaff();

  if (!authenticated) {
    redirect('/auth/staff/login');
  }

  return <>{children}</>;
};

export default StaffLayout;
