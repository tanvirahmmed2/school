import Navbar from '@/component/bars/student/Navbar'
import Sidebar from '@/component/bars/student/Sidebar'
import React from 'react'
import { redirect } from 'next/navigation';
import { isStudent } from '@/lib/auth';

const StudentLayout = async ({children}) => {
  const authenticated = await isStudent();

  if (!authenticated) {
    redirect('/auth/student/login');
  }

  return (
    <div className='w-full flex flex-col relative overflow-x-hidden'>
      <Navbar/>
      <Sidebar/>
      {children}
    </div>
  )
}

export default StudentLayout