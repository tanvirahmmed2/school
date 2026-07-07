import Navbar from '@/component/bars/admin/Navbar'
import Sidebar from '@/component/bars/admin/Sidebar'
import React from 'react'

const AdminLayout = ({children}) => {
  return (
    <div className='w-full relative overflow-x-hidden'>
      <Navbar/>
      {children}
      <Sidebar/>
    </div>
  )
}

export default AdminLayout