import React from 'react';
import { redirect } from 'next/navigation';
import { isStudent } from '@/lib/auth';

const StudentAuthLayout = async ({ children }) => {
  const authenticated = await isStudent();
  
  if (authenticated) {
    redirect('/student');
  }

  return (
    <>{children}</>
  );
};

export default StudentAuthLayout;
