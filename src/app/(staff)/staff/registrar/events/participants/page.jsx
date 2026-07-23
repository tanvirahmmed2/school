'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUsers, FiArrowLeft, FiCalendar, FiMapPin, FiMail, FiUserCheck, FiSearch, FiFilter } from 'react-icons/fi';

const RegistrarParticipantsContent = () => {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [participants, setParticipants] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch events list
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await axios.get('/api/events');
        const list = res.data?.paylod?.events || [];
        setEvents(list);
        if (!selectedEventId && list.length > 0) {
          setSelectedEventId(String(list[0].id));
        }
      } catch (err) {
        console.error('Error fetching events list:', err);
        toast.error('Failed to load events.');
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch participants for selected event
  useEffect(() => {
    if (!selectedEventId) {
      setParticipants([]);
      return;
    }

    const fetchParticipants = async () => {
      setLoadingParticipants(true);
      try {
        const res = await axios.get(`/api/events/${selectedEventId}/participants`);
        setParticipants(res.data?.paylod?.participants || []);
      } catch (err) {
        console.error('Error fetching event participants:', err);
        toast.error('Failed to load event participants.');
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, [selectedEventId]);

  const selectedEvent = events.find((e) => String(e.id) === String(selectedEventId));

  const filteredParticipants = participants.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.registration_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/staff/registrar/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Events List</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full w-fit mb-2">
              <FiUsers /> Registrar Registry
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Event Participants List
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">
              Select an event to view the full registry of registered student participants.
            </p>
          </div>

          {/* Event Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <FiFilter className="text-emerald-600 ml-2" />
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-4 cursor-pointer"
            >
              {events.length === 0 && <option value="">No events available</option>}
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({new Date(ev.event_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Event Details Card */}
        {selectedEvent && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {selectedEvent.image && (
              <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold text-slate-900">{selectedEvent.title}</h3>
              <p className="text-slate-500 text-xs line-clamp-2">{selectedEvent.description}</p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-emerald-600">
                  <FiCalendar /> {new Date(selectedEvent.event_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <FiMapPin /> {selectedEvent.location}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <FiUsers /> {participants.length} Total Registered
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-xs">
          <FiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search participant by student name, registration number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Participants Table */}
        {loadingParticipants || loadingEvents ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs animate-pulse text-center">
            <div className="h-6 w-1/3 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-40 bg-slate-100 rounded-xl"></div>
          </div>
        ) : filteredParticipants.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">#</th>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Reg. Number</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Registration Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredParticipants.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                        <FiUserCheck className="text-emerald-600 text-sm" />
                        <span>{p.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                          {p.registration_number || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <FiMail className="text-slate-400" />
                          {p.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {p.joined_at ? new Date(p.joined_at).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-xs">
            <FiUsers className="text-4xl text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Participants Registered</h3>
            <p className="text-slate-500 text-xs mt-1">
              There are currently no registered student participants for the selected event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const RegistrarEventParticipantsOverviewPage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading participants...</div>}>
      <RegistrarParticipantsContent />
    </Suspense>
  );
};

export default RegistrarEventParticipantsOverviewPage;
