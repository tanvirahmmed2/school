'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import RecognitionCard from '@/component/cards/RecognitionCard';

const Recognition = () => {
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchRecognitions = async () => {
      try {
        const res = await fetch('/api/recognitions');
        if (res.ok) {
          const data = await res.json();
          const list = data.paylod?.recognitions || data.payload?.recognitions || data.recognitions || [];
          setRecognitions(list);
        }
      } catch (err) {
        console.error('Error fetching recognitions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecognitions();
  }, []);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (recognitions.length === 0) return null;

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-amber-50/20 to-slate-50/60 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-block text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest mb-2 border border-amber-100">
              Honours &amp; Awards
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recognitions
            </h2>
            <p className="text-slate-500 mt-1 text-xs md:text-sm max-w-lg">
              Swipe or slide to view milestones and honours awarded to our institution.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Slider Nav Buttons */}
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous recognitions"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-300 shadow-xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <FiChevronLeft className="text-lg" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next recognitions"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-300 shadow-xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <FiChevronRight className="text-lg" />
            </button>

            {/* View All Button */}
            <Link
              href="/recognitions"
              className="ml-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-full border border-amber-200/80 transition-colors"
            >
              <span>View All</span>
              <FiArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Single Row Touch-Slide Carousel Container */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {recognitions.map((item) => (
            <div
              key={item.id}
              className="w-[210px] sm:w-[230px] md:w-[250px] shrink-0 snap-start"
            >
              <RecognitionCard recognition={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recognition;