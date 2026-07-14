'use client';

import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Contact = () => {

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Support Desk
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Contact Academic Office
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Reach out for admission questions, transcript verification queries, and general campus support details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Info Side */}
          <div className="md:col-span-5  p-6 rounded-3xl shadow-xs flex flex-col gap-6">
            <h3 className="font-extrabold text-slate-900 text-base">FIT Campus Address</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <FiMapPin className="text-sky-500 text-base shrink-0 mt-0.5" />
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  FIT Administrative Block, <br />
                  West Campus Road, Section 4, <br />
                  Dhaka, Bangladesh
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <FiMail className="text-sky-500 text-base shrink-0" />
                <span className="text-slate-600 text-xs sm:text-sm">support@fontana-edu.org</span>
              </div>

              <div className="flex gap-3 items-center">
                <FiPhone className="text-sky-500 text-base shrink-0" />
                <span className="text-slate-600 text-xs sm:text-sm">+880 1234 56789</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
              Office Hours: <br />
              Sunday - Thursday (9:00 AM - 5:00 PM)
            </div>
          </div>

          {/* Map Side */}
          <div className="md:col-span-7  rounded-3xl shadow-xs flex flex-col gap-4">
            <h3 className="font-extrabold text-slate-900 text-base mb-2">Our Location</h3>
            <div className="w-full overflow-hidden rounded-2xl ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.984847499078!2d90.47247927537212!3d24.898498477904457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375653ef6517fdcf%3A0x360557fb2a9073f9!2sDisibin!5e0!3m2!1sen!2sbd!4v1784044575096!5m2!1sen!2sbd"
                className="w-full h-90 md:h-100 border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;