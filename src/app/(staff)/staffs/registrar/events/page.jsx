'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiUsers, FiX } from 'react-icons/fi';
import GenericForm from '@/component/forms/GenericForm';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Participants modal state
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [event_date, setEventDate] = useState('');
  const [location, setLocation] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditItem(null);
    setTitle('');
    setDescription('');
    setEventDate('');
    setLocation('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setTitle(item.title);
    setDescription(item.description);
    
    // Format date string for datetime-local input
    if (item.event_date) {
      const localDate = new Date(item.event_date);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      setEventDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else {
      setEventDate('');
    }
    
    setLocation(item.location);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim() || !description.trim() || !event_date || !location.trim()) {
      toast.error('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      const url = editItem ? `/api/events/${editItem.id}` : '/api/events';
      const method = editItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          event_date,
          location: location.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save event.');
      }

      toast.success(data.message || 'Event saved successfully!');
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event? All participant records will be removed.')) return;

    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete event.');
      }

      toast.success(data.message || 'Event deleted successfully.');
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewParticipants = async (event) => {
    setActiveEvent(event);
    setParticipantsModalOpen(true);
    setParticipantsLoading(true);
    try {
      const response = await fetch(`/api/events/${event.id}/participants`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants || []);
      }
    } catch (error) {
      toast.error('Failed to load participants.');
    } finally {
      setParticipantsLoading(false);
    }
  };

  // Form Fields Config
  const fields = [
    { name: 'title', label: 'Event Title', required: true, placeholder: 'e.g. Graduation Ceremony 2026', colSpan: 'col-span-2' },
    { name: 'description', label: 'Event Description', type: 'textarea', required: true, placeholder: 'Details about the event agenda, dress code, etc...', rows: 3, colSpan: 'col-span-2' },
    { name: 'event_date', label: 'Event Date & Time', type: 'datetime-local', required: true },
    { name: 'location', label: 'Location / Venue', required: true, placeholder: 'e.g. School Auditorium' }
  ];

  const values = { title, description, event_date, location };

  const handleChange = (fieldName, val) => {
    if (fieldName === 'title') setTitle(val);
    else if (fieldName === 'description') setDescription(val);
    else if (fieldName === 'event_date') setEventDate(val);
    else if (fieldName === 'location') setLocation(val);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-up max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-650 rounded-2xl text-purple-600">
            <FiCalendar className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Events Management</h1>
            <p className="text-xs text-slate-400">Schedule activities, choose locations, and review student participant lists.</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer"
        >
          <FiPlus className="text-sm" /> Add New Event
        </button>
      </div>

      {/* Events Table Container */}
      {loading ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="w-full text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <p className="text-sm text-slate-400 font-semibold">No school events scheduled yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-md">
                        <span className="font-bold text-slate-800 text-sm">{event.title}</span>
                        <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{event.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                        <FiMapPin className="text-slate-400" /> {event.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                        <FiCalendar className="text-slate-400" /> 
                        {new Date(event.event_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewParticipants(event)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-500 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                          title="View student registrations"
                        >
                          <FiUsers className="text-sm" /> Participants
                        </button>
                        <button
                          onClick={() => handleOpenEdit(event)}
                          className="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 rounded-xl transition-all duration-150 cursor-pointer"
                          title="Edit event"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition-all duration-150 cursor-pointer"
                          title="Delete event"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiCalendar className="text-purple-600" /> {editItem ? 'Edit Scheduled Event' : 'Schedule New Event'}
            </h2>
            <GenericForm
              fields={fields}
              values={values}
              onChange={handleChange}
              onSubmit={handleFormSubmit}
              submitText={editItem ? 'Save Changes' : 'Schedule Event'}
              submitting={submitting}
              cancelText="Cancel"
              onCancel={() => setModalOpen(false)}
              focusClass="focus:border-purple-500 focus:ring-purple-500/5"
            />
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {participantsModalOpen && activeEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl animate-scale-up flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FiUsers className="text-purple-600 text-lg" />
                <div className="flex flex-col">
                  <h2 className="text-base font-bold text-slate-800">Event Participants</h2>
                  <p className="text-[10px] text-slate-400 font-semibold">{activeEvent.title}</p>
                </div>
              </div>
              <button
                onClick={() => setParticipantsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[250px]">
              {participantsLoading ? (
                <div className="w-full h-48 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-purple-650 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : participants.length === 0 ? (
                <div className="w-full text-center py-12">
                  <p className="text-xs text-slate-400 font-semibold">No students have registered for this event yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Registration Num</th>
                      <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                      <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {participants.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 font-bold text-slate-800">{p.name}</td>
                        <td className="px-4 py-3 text-slate-500">{p.registration_number}</td>
                        <td className="px-4 py-3 text-slate-500">{p.email}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(p.joined_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;
