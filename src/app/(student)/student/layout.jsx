import Navbar from '@/component/bars/student/Navbar'
import Sidebar from '@/component/bars/student/Sidebar'
import React from 'react'

const StudentLayout = ({children}) => {
  return (
    <div className='w-full flex flex-col relative overflow-x-hidden'>
      <Navbar/>
      <Sidebar/>
      {children}
    </div>
  )
}

export default StudentLayout