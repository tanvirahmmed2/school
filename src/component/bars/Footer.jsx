'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import { FaLocationArrow, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { IoCall, IoMail } from 'react-icons/io5';
import { Context } from '../helper/Context';

const Footer = () => {
  const { websiteSettings } = useContext(Context);

  const schoolName = websiteSettings?.school_name || websiteSettings?.site_title || 'FIT';
  const phone = websiteSettings?.contact_phone || '+880 180 500 03886';
  const email = websiteSettings?.contact_email || 'support@disibin.com';
  const address = websiteSettings?.address || 'Dhaka 1200';

  return (
    <footer className='w-full bg-primary-dark text-secondary flex flex-col items-center justify-center shadow-inner px-4 md:px-8 py-8 md:py-12 overflow-x-hidden gap-12 sm:gap-16'>
      <div className='w-full flex flex-col gap-3 md:col-span-2'>
        <h3 className='font-semibold text-sm md:text-base tracking-tight border-b border-primary pb-2 text-secondary'>
          Quick Links
        </h3>
        <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-8 mt-1 text-xs md:text-sm'>
          <div className='flex flex-col gap-2'>
            <Link href={'/'} className='hover:text-secondary transition-colors duration-200'>Home</Link>
            <Link href={'/teachers'} className='hover:text-secondary transition-colors duration-200'>Teachers</Link>
            <Link href={'/notices'} className='hover:text-secondary transition-colors duration-200'>Notice</Link>
            <Link href={'/results'} className='hover:text-secondary transition-colors duration-200'>Results</Link>
          </div>
          <div className='flex flex-col gap-2'>
            <Link href={'/achievements'} className='hover:text-secondary transition-colors duration-200'>Achievements</Link>
            <Link href={'/admission'} className='hover:text-secondary transition-colors duration-200'>Admission Apply</Link>
            <Link href={'/payments'} className='hover:text-secondary transition-colors duration-200'>Bills & Payments</Link>
            <Link href={'/student-fees'} className='hover:text-secondary transition-colors duration-200'>Class Tuition Fees</Link>
          </div>
          <div className='flex flex-col gap-2'>
            <Link href={'/news'} className='hover:text-secondary transition-colors duration-200'>News Hub</Link>
            <Link href={'/collaborations'} className='hover:text-secondary transition-colors duration-200'>Collaborations</Link>
            <Link href={'/club-news'} className='hover:text-secondary transition-colors duration-200'>Club News</Link>
            <Link href={'/admission-status'} className='hover:text-secondary transition-colors duration-200'>Admission Status</Link>
          </div>
          <div className='flex flex-col gap-2'>
            <Link href={'/verify-student'} className='hover:text-secondary transition-colors duration-200'>Verify Student</Link>
            <Link href={'/auth/student'} className='hover:text-secondary transition-colors duration-200'>Student Portal</Link>
            <Link href={'/auth/access/teacher'} className='hover:text-secondary transition-colors duration-200'>Teacher Login</Link>
            <Link href={'/auth/access'} className='hover:text-secondary transition-colors duration-200'>Access Portal</Link>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col md:flex-row items-start justify-between gap-8 text-xs md:text-sm'>
        <div className='w-full md:w-1/2 flex flex-col gap-3'>
          <h3 className='font-semibold text-sm md:text-base tracking-tight border-b border-primary pb-2 text-secondary'>
            Contact with {schoolName}
          </h3>
          <p className='text-secondary/80 leading-relaxed'>
            Dedicated to academic excellence, innovation, and holistic student development. Reach out to our administrative office for any inquiries.
          </p>
          <div className='flex flex-col gap-2 mt-1'>
            {phone && (
              <p className='w-full flex flex-row gap-2 items-center text-secondary/90'>
                <IoCall className='text-emerald-400 shrink-0' /> {phone}
              </p>
            )}
            {email && (
              <p className='w-full flex flex-row gap-2 items-center text-secondary/90'>
                <IoMail className='text-emerald-400 shrink-0' /> {email}
              </p>
            )}
            {address && (
              <p className='w-full flex flex-row gap-2 items-center text-secondary/90'>
                <FaLocationArrow className='text-emerald-400 shrink-0' /> {address}
              </p>
            )}
          </div>

          {/* Social Links */}
          {(websiteSettings?.facebook_url || websiteSettings?.twitter_url || websiteSettings?.instagram_url || websiteSettings?.youtube_url) && (
            <div className='flex items-center gap-3 mt-3'>
              {websiteSettings.facebook_url && (
                <a
                  href={websiteSettings.facebook_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 bg-emerald-900/60 hover:bg-primary-dark text-white rounded-lg transition-colors'
                  aria-label='Facebook'
                >
                  <FaFacebookF className='text-sm' />
                </a>
              )}
              {websiteSettings.twitter_url && (
                <a
                  href={websiteSettings.twitter_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 bg-emerald-900/60 hover:bg-primary-dark text-white rounded-lg transition-colors'
                  aria-label='Twitter'
                >
                  <FaTwitter className='text-sm' />
                </a>
              )}
              {websiteSettings.instagram_url && (
                <a
                  href={websiteSettings.instagram_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 bg-emerald-900/60 hover:bg-primary-dark text-white rounded-lg transition-colors'
                  aria-label='Instagram'
                >
                  <FaInstagram className='text-sm' />
                </a>
              )}
              {websiteSettings.youtube_url && (
                <a
                  href={websiteSettings.youtube_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 bg-emerald-900/60 hover:bg-primary-dark text-white rounded-lg transition-colors'
                  aria-label='YouTube'
                >
                  <FaYoutube className='text-sm' />
                </a>
              )}
            </div>
          )}
        </div>

        <div className='w-full md:w-1/2 flex flex-col items-center justify-center gap-4 mt-4 md:mt-0'>
          <div className='w-full max-w-md aspect-video bg-emerald-900/40 border border-primary/80 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-md'>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.3160107217595!2d90.47247927524832!3d24.898498477904493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375653ef6517fdcf%3A0x360557fb2a9073f9!2sDisibin!5e1!3m2!1sen!2sbd!4v1784655551008!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Location Map"
            ></iframe>
          </div>
          <p className='text-secondary/80 text-center text-xs font-semibold'>
            Copyright reserved © {schoolName} {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;