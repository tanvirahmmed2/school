import Link from 'next/link'
import React from 'react'
import { FaLocationArrow } from 'react-icons/fa'
import { IoCall, IoMail } from 'react-icons/io5'

const Footer = () => {
    return (
        <footer className='w-full bg-emerald-950 text-white flex flex-col items-center justify-center border-t border-emerald-500/30 shadow-inner px-4 md:px-8 py-8 md:py-12 overflow-x-hidden'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs md:text-sm'>
                <div className='w-full flex flex-col gap-3'>
                    <h3 className='font-extrabold text-sm md:text-base tracking-tight border-b border-emerald-500/50 pb-2 text-white'>
                        Contact with FIT
                    </h3>
                    <p className='text-emerald-50/90 leading-relaxed'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. At dolor ea repudiandae culpa possimus aperiam vel ratione delectus optio mollitia.
                    </p>
                    <div className='flex flex-col gap-2 mt-1'>
                        <p className='w-full flex flex-row gap-2 items-center text-emerald-50/90'><IoCall className='text-emerald-300' /> +880 180 500 03886</p>
                        <p className='w-full flex flex-row gap-2 items-center text-emerald-50/90'><IoMail className='text-emerald-300' /> support@disibin.com</p>
                        <p className='w-full flex flex-row gap-2 items-center text-emerald-50/90'><FaLocationArrow className='text-emerald-300' /> Dhaka 1200</p>
                    </div>
                </div>


                <div className='w-full flex flex-col gap-3 md:col-span-2'>
                    <h3 className='font-extrabold text-sm md:text-base tracking-tight border-b border-emerald-500/50 pb-2 text-white'>
                        Quick Links
                    </h3>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1'>
                        <div className='flex flex-col gap-2'>
                            <Link href={'/'} className='hover:text-emerald-200 transition-colors duration-200'>Home</Link>
                            <Link href={'/teachers'} className='hover:text-emerald-200 transition-colors duration-200'>Teachers</Link>
                            <Link href={'/notices'} className='hover:text-emerald-200 transition-colors duration-200'>Notice</Link>
                            <Link href={'/results'} className='hover:text-emerald-200 transition-colors duration-200'>Results</Link>
                            <Link href={'/collaborations'} className='hover:text-emerald-200 transition-colors duration-200'>Collaborations</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Link href={'/acheivements'} className='hover:text-emerald-200 transition-colors duration-200'>Achievements</Link>
                            <Link href={'/admission'} className='hover:text-emerald-200 transition-colors duration-200'>Admission Apply</Link>
                            <Link href={'/payments'} className='hover:text-emerald-200 transition-colors duration-200'>Bills & Payments</Link>
                            <Link href={'/news'} className='hover:text-emerald-200 transition-colors duration-200'>News Hub</Link>
                            <Link href={'/student-fees'} className='hover:text-emerald-200 transition-colors duration-200'>Class Tuition Fees</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Link href={'/admission-status'} className='hover:text-emerald-200 transition-colors duration-200'>Admission Status</Link>
                            <Link href={'/verify-student'} className='hover:text-emerald-200 transition-colors duration-200'>Verify Student</Link>
                            <Link href={'/auth/student'} className='hover:text-emerald-200 transition-colors duration-200'>Student Portal</Link>
                            <Link href={'/auth/access/teacher'} className='hover:text-emerald-200 transition-colors duration-200'>Teacher Login</Link>
                            <Link href={'/auth/access'} className='hover:text-emerald-200 transition-colors duration-200'>Access Portal</Link>
                        </div>
                    </div>
                </div>

                <div className='w-full flex flex-col items-center justify-center gap-4 mt-6 md:mt-0 sm:col-span-2 md:col-span-1'>
                    <div className='w-full aspect-video bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-md'>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.3160107217595!2d90.47247927524832!3d24.898498477904493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375653ef6517fdcf%3A0x360557fb2a9073f9!2sDisibin!5e1!3m2!1sen!2sbd!4v1784655551008!5m2!1sen!2sbd" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="FIT Location Map"
                        ></iframe>
                    </div>
                    <p className='text-emerald-100/90 text-center text-xs font-semibold'>Copyright reserved © FIT 2026</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer