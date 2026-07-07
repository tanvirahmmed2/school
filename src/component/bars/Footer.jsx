import Link from 'next/link'
import React from 'react'
import { FaLocationArrow } from 'react-icons/fa'
import { IoCall, IoMail } from 'react-icons/io5'

const Footer = () => {
    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 bg-blue-950 overflow-x-hidden text-white text-xs md:text-sm '>
            <div className='w-full flex flex-col gap-2'>
                <p>Contact with FIT</p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. At dolor ea repudiandae culpa possimus aperiam vel ratione delectus optio mollitia.</p>
                <p className='w-full flex flex-row gap-2 items-center'><IoCall /> +880 180 500 03886</p>
                <p className='w-full flex flex-row gap-2 items-center'><IoMail /> support@disibin.com</p>
                <p className='w-full flex flex-row gap-2 items-center'><FaLocationArrow /> Dhaka 1200</p>
            </div>
            <div className='w-full flex flex-col gap-2'>
                <p>About FIT</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae praesentium, ab possimus reiciendis architecto explicabo in vero nulla modi nostrum temporibus? Qui quod veniam esse, quam architecto quae voluptatem mollitia sunt magni rerum sapiente illo doloribus numquam neque ratione itaque maiores! Quo omnis tempore temporibus voluptatem corrupti! Maiores, sed explicabo.</p>
                <Link href={'/about'}>About</Link>
            </div>
            <div className='w-full flex flex-col items-center justify-between gap-3'>
                <p>Quick Links</p>
                <div className='w-full flex flex-row gap-4'>
                    <div className='w-full flex flex-col gap-2'>
                        <Link href={'/'}>Home</Link>
                        <Link href={'/administations/teacher'}>Teachers</Link>
                        <Link href={'/notices'}>Notice</Link>
                        <Link href={'/results'}>Results</Link>
                        <Link href={'/acheivements'}>Acheivements</Link>
                        <Link href={'/collaborations'}>Collaborations</Link>
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <Link href={'/news'}>News Hub</Link>
                        <Link href={'/admission'}>Admission</Link>
                        <Link href={'/auth/student'}>Student Portal</Link>
                        <Link href={'/auth/teacher'}>Teacher Login</Link>
                        <Link href={'/auth/access'}>Access</Link>

                    </div>
                </div>
            </div>

            <div className='w-full flex flex-col items-center justify-center gap-4'>
                <div className='w-1/2 aspect-video bg-white rounded-2xl'></div>
                <p>Copyright reserved © FIT 2026</p>
            </div>
        </div>

    )
}

export default Footer