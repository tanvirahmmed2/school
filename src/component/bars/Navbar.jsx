import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='w-full bg-sky-600 text-white flex flex-col px-4 py-2'>
      <section className='w-full flex flex-row items-center justify-between'>
        <Link href={'/'}>
          Fontana Institute of Technology
        </Link>
        <div className='w-auto flex flex-row items-center justify-center gap-4'>
          <Link href={'/notices'}>Notices</Link>
          <Link href={'/auth'}>Login</Link>
        </div>
      </section>
      <section className='w-full flex flex-row items-center justify-between'>

      </section>
    </nav>
  )
}

export default Navbar