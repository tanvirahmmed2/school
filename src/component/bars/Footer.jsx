import Link from 'next/link'
import React from 'react'
import { FaLocationArrow } from 'react-icons/fa'
import { IoCall, IoMail } from 'react-icons/io5'

const Footer = () => {
    return (
        <footer className='w-full bg-sky-950 text-white flex flex-col items-center justify-center border-t border-sky-500/30 shadow-inner px-4 md:px-8 py-8 md:py-12 overflow-x-hidden'>
            <div className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs md:text-sm'>
                <div className='w-full flex flex-col gap-3'>
                    <h3 className='font-extrabold text-sm md:text-base tracking-tight border-b border-sky-500/50 pb-2 text-white'>
                        Contact with FIT
                    </h3>
                    <p className='text-sky-50/90 leading-relaxed'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. At dolor ea repudiandae culpa possimus aperiam vel ratione delectus optio mollitia.
                    </p>
                    <div className='flex flex-col gap-2 mt-1'>
                        <p className='w-full flex flex-row gap-2 items-center text-sky-50/90'><IoCall className='text-sky-300' /> +880 180 500 03886</p>
                        <p className='w-full flex flex-row gap-2 items-center text-sky-50/90'><IoMail className='text-sky-300' /> support@disibin.com</p>
                        <p className='w-full flex flex-row gap-2 items-center text-sky-50/90'><FaLocationArrow className='text-sky-300' /> Dhaka 1200</p>
                    </div>
                </div>


                <div className='w-full flex flex-col gap-3 md:col-span-2'>
                    <h3 className='font-extrabold text-sm md:text-base tracking-tight border-b border-sky-500/50 pb-2 text-white'>
                        Quick Links
                    </h3>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1'>
                        <div className='flex flex-col gap-2'>
                            <Link href={'/'} className='hover:text-sky-200 transition-colors duration-200'>Home</Link>
                            <Link href={'/teachers'} className='hover:text-sky-200 transition-colors duration-200'>Teachers</Link>
                            <Link href={'/notices'} className='hover:text-sky-200 transition-colors duration-200'>Notice</Link>
                            <Link href={'/results'} className='hover:text-sky-200 transition-colors duration-200'>Results</Link>
                            <Link href={'/collaborations'} className='hover:text-sky-200 transition-colors duration-200'>Collaborations</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Link href={'/acheivements'} className='hover:text-sky-200 transition-colors duration-200'>Achievements</Link>
                            <Link href={'/admission'} className='hover:text-sky-200 transition-colors duration-200'>Admission Apply</Link>
                            <Link href={'/payments'} className='hover:text-sky-200 transition-colors duration-200'>Bills & Payments</Link>
                            <Link href={'/news'} className='hover:text-sky-200 transition-colors duration-200'>News Hub</Link>
                            <Link href={'/student-fees'} className='hover:text-sky-200 transition-colors duration-200'>Class Tuition Fees</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Link href={'/admission-status'} className='hover:text-sky-200 transition-colors duration-200'>Admission Status</Link>
                            <Link href={'/verify-student'} className='hover:text-sky-200 transition-colors duration-200'>Verify Student</Link>
                            <Link href={'/auth/student'} className='hover:text-sky-200 transition-colors duration-200'>Student Portal</Link>
                            <Link href={'/auth/access/teacher'} className='hover:text-sky-200 transition-colors duration-200'>Teacher Login</Link>
                            <Link href={'/auth/access'} className='hover:text-sky-200 transition-colors duration-200'>Access Portal</Link>
                        </div>
                    </div>
                </div>

                <div className='w-full flex flex-col items-center justify-center gap-4 mt-6 md:mt-0 sm:col-span-2 md:col-span-1'>
                    <div className='w-2/3 aspect-video bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl flex items-center justify-center p-3 shadow-inner hover:scale-105 transition-transform duration-300'>
                        <span className='font-extrabold text-white text-lg md:text-xl tracking-tight text-center'>
                            FIT
                        </span>
                    </div>
                    <p className='text-sky-100/90 text-center text-xs font-semibold'>Copyright reserved © FIT 2026</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer