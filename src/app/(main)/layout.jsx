import Footer from '@/components/bars/Footer'
import Navbar from '@/components/bars/Navbar'
import React from 'react'
export const metadata={
    title:'Home | School',
    description:'School Home Page'
}
const layout = ({children}) => {
  return (
    <div className='w-full flex flex-col min-h-screen'>
      <Navbar/>
      <main className='flex-1 w-full'>
        {children}
      </main>
      <Footer/>
    </div>
  )
}

export default layout
