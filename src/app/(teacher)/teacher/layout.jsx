import Navbar from '@/component/bars/teacher/Navbar'
import Sidebar from '@/component/bars/teacher/Sidebar'
import React from 'react'

const TeacherLayout = ({children}) => {
  return (
    <div className='w-full flex flex-col relative overflow-x-hidden'>
      <Navbar/>
      <Sidebar/>
      {children}
    </div>
  )
}

export default TeacherLayout