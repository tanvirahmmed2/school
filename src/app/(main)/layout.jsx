import Footer from '@/components/bars/Footer'
import Navbar from '@/components/bars/Navbar'
import React from 'react'
export const metadata={
    title:'Home | Govt. Primary School',
    description:'Government Primary School — Excellence in Education since 1985'
}
const layout = ({children}) => {
  return (
    <div className='w-full flex flex-col min-h-screen overflow-x-hidden'>
      <Navbar/>
      <main className='flex-1 w-full' style={{ paddingTop: '88px' }}>
        {children}
      </main>
      <Footer/>
    </div>
  )
}

export default layout

