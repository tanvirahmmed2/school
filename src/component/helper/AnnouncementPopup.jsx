'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBell, FiX, FiMapPin, FiLayers } from 'react-icons/fi';

const AnnouncementPopup = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        const response = await axios.get('/api/announcements');
        const active = response.data.paylod.announcement;
        
        if (active) {
          // Check if this announcement has been dismissed in the current session
          const dismissedId = sessionStorage.getItem('dismissed_announcement_id');
          if (dismissedId !== active.id.toString()) {
            setAnnouncement(active);
            // Delay open slightly for a smooth entrance animation after page load
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
          }
        }
      } catch (error) {
        console.error('Failed to load website announcement:', error);
      }
    };

    fetchActiveAnnouncement();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (announcement) {
      sessionStorage.setItem('dismissed_announcement_id', announcement.id.toString());
    }
  };

  if (!announcement || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in transition-opacity duration-300">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col gap-5 transform scale-100 animate-zoom-in transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-all cursor-pointer"
          aria-label="Close Announcement"
        >
          <FiX className="text-xl" />
        </button>

        {/* Icon & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiBell className="text-2xl animate-bounce" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">
              Special Notice
            </span>
            <span className="text-xs text-slate-405 font-bold text-slate-400">
              Broadcasted Announcement
            </span>
          </div>
        </div>

        {/* Title & Body */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
            {announcement.name}
          </h2>
          <div className="w-12 h-1 bg-amber-500 rounded-full my-1"></div>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto pr-2">
            {announcement.description}
          </p>
        </div>

        {/* Optional Meta fields */}
        {(announcement.location || announcement.total_room !== null) && (
          <div className="grid grid-cols-2 gap-4 border-t border-slate-105 border-slate-100 pt-4 text-xs text-slate-600">
            {announcement.location && (
              <div className="flex items-center gap-2">
                <FiMapPin className="text-amber-550 text-amber-600" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Location</span>
                  <span className="font-bold text-slate-700">{announcement.location}</span>
                </div>
              </div>
            )}
            {announcement.total_room !== null && (
              <div className="flex items-center gap-2">
                <FiLayers className="text-amber-550 text-amber-600" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Rooms Limit</span>
                  <span className="font-bold text-slate-700">{announcement.total_room}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Button to Action */}
        <button
          onClick={handleClose}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
        >
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
};

export default AnnouncementPopup;
