import Link from 'next/link'
import React from 'react'
import { FaLocationArrow } from 'react-icons/fa'
import { IoCall, IoMail } from 'react-icons/io5'

const Footer = () => {
    return (
        <footer className='w-full bg-amber-950 text-white flex flex-col items-center justify-center border-t border-amber-500/30 shadow-inner px-4 md:px-8 py-8 md:py-12 overflow-x-hidden'>
            <div className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs md:text-sm'>
                <div className='w-full flex flex-col gap-3'>
                    <h3 className='font-extrabold text-sm md:text-base tracking-tight border-b border-amber-500/50 pb-2 text-white'>
                        Contact with FIT
                    </h3>
                    <p className='text-amber-50/90 leading-relaxed'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. At dolor ea repudiandae culpa possimus aperiam vel ratione delectus optio mollitia.
                    </p>
                    <div className='flex flex-col gap-2 mt-1'>
                        <p className='w-full flex flex-row gap-2 items-center text-amber-50/90'><IoCall className='text-amber-250' /> +880 180 500 03886</p>
                        <p className='w-full flex flex-row gap-2 items-center text-amber-50/90'><IoMail className='text-amber-250' /> support@disibin.com</p>
                        <p className='w-full flex flex-row gap-2 items-center text-amber-50/90'><FaLocationArrow className='text-amber-250' /> Dhaka 1200</p>
                    </div>
                </div>

                <div className='w-full flex flex-col gap-3'>
                    <h3 className='font-extrabold text-sm md:text-base tracking-tight border-b border-amber-500/50 pb-2 text-white'>
                        About FIT
                    </h3>
                    <p className='text-amber-50/90 leading-relaxed'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae praesentium, ab possimus reiciendis architecto explicabo in vero nulla modi nostrum temporibus? Qui quod veniam esse, quam architecto quae voluptatem mollitia sunt magni rerum sapiente illo doloribus.
                    </p>
                    <Link href={'/about'} className='mt-1 text-white hover:text-amber-200 transition-colors duration-250 font-bold inline-flex items-center gap-1 w-fit'>
                        About &rarr;
                    </Link>
                </div>

                <div className='w-full flex flex-col gap-3'>
                    <h3 className='font-extrabold text-sm md:text-base tracking-tight border-b border-amber-500/50 pb-2 text-white'>
                        Quick Links
                    </h3>
                    <div className='w-full flex flex-row gap-4 mt-1'>
                        <div className='w-1/2 flex flex-col gap-2'>
                            <Link href={'/'} className='hover:text-amber-200 transition-colors duration-200'>Home</Link>
                            <Link href={'/administations/teacher'} className='hover:text-amber-200 transition-colors duration-200'>Teachers</Link>
                            <Link href={'/notices'} className='hover:text-amber-200 transition-colors duration-200'>Notice</Link>
                            <Link href={'/results'} className='hover:text-amber-200 transition-colors duration-200'>Results</Link>
                            <Link href={'/acheivements'} className='hover:text-amber-200 transition-colors duration-200'>Achievements</Link>
                            <Link href={'/collaborations'} className='hover:text-amber-200 transition-colors duration-200'>Collaborations</Link>
                        </div>
                        <div className='w-1/2 flex flex-col gap-2'>
                            <Link href={'/news'} className='hover:text-amber-200 transition-colors duration-200'>News Hub</Link>
                            <Link href={'/admission'} className='hover:text-amber-200 transition-colors duration-200'>Admission</Link>
                            <Link href={'/auth/student'} className='hover:text-amber-200 transition-colors duration-200'>Student Portal</Link>
                            <Link href={'/auth/teacher'} className='hover:text-amber-200 transition-colors duration-200'>Teacher Login</Link>
                            <Link href={'/auth/access'} className='hover:text-amber-200 transition-colors duration-200'>Access</Link>
                        </div>
                    </div>
                </div>

                <div className='w-full flex flex-col items-center justify-center gap-4 mt-6 md:mt-0'>
                    <div className='w-2/3 aspect-video bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl flex items-center justify-center p-3 shadow-inner hover:scale-105 transition-transform duration-300'>
                        <span className='font-extrabold text-white text-lg md:text-xl tracking-tight text-center'>
                            FIT
                        </span>
                    </div>
                    <p className='text-amber-100/90 text-center text-xs font-semibold'>Copyright reserved © FIT 2026</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer