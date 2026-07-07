import Footer from '@/component/bars/Footer'
import Navbar from '@/component/bars/Navbar'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <div className='w-full flex flex-col items-center justify-between overflow-x-hidden'>
      <Navbar/>
      {children}
      <Footer/>
    </div>
  )
}

export default HomeLayout