import React from 'react';
import { redirect } from 'next/navigation';
import { isRegistrar } from '@/lib/auth';

const RegistrarLayout = async ({ children }) => {
  const authenticated = await isRegistrar();

  if (!authenticated) {
    // If not registrar, redirect to login
    redirect('/auth/staff/login');
  }

  return <>{children}</>;
};

export default RegistrarLayout;