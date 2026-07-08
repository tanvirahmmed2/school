import React from 'react';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

const AccessLayout = async ({ children }) => {
  const authenticated = await isAdmin();
  
  if (authenticated) {
    redirect('/admin');
  }

  return (
    <>{children}</>
  );
};

export default AccessLayout;