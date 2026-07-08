import React from 'react';
import { redirect } from 'next/navigation';
import { isTeacher } from '@/lib/auth';

const TeacherAuthLayout = async ({ children }) => {
  const authenticated = await isTeacher();
  
  if (authenticated) {
    redirect('/teacher');
  }

  return (
    <>{children}</>
  );
};

export default TeacherAuthLayout;
