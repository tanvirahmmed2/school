'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiHome, FiPlus, FiEdit, FiTrash2, FiUser, FiMapPin, FiLayers, FiActivity, FiTag, FiBookOpen } from 'react-icons/fi';
import TiptapEditor from '@/component/helper/TiptapEditor';

const AdminHostelsPage = () => {
  const [activeTab, setActiveTab] = useState('hostels'); // 'hostels' or 'provosts'
  const [hostels, setHostels] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [provosts, setProvosts] = useState([]);
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [loadingProvosts, setLoadingProvosts] = useState(true);

  // Hostel form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalRoom, setTotalRoom] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('Male');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [editId, setEditId] = useState(null);
  const [submittingHostel, setSubmittingHostel] = useState(false);

  // Provost form states
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [submittingProvost, setSubmittingProvost] = useState(false);

  useEffect(() => {
    fetchHostels();
    fetchTeachers();
    fetchProvosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      imagePreview && setImagePreview(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImage('');
    setImagePreview('');
  };

  const fetchHostels = async () => {
    setLoadingHostels(true);
    try {
      const response = await axios.get('/api/hostels');
      setHostels(response.data.paylod.hostels || []);
    } catch (error) {
      toast.error('Failed to load hostels.');
    } finally {
      setLoadingHostels(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers');
      setTeachers(response.data.paylod.teachers || []);
    } catch (error) {
      console.error('Failed to load teachers for provost assignment:', error);
    }
  };

  const fetchProvosts = async () => {
    setLoadingProvosts(true);
    try {
      const response = await axios.get('/api/hostel-provost');
      setProvosts(response.data.paylod.provosts || []);
    } catch (error) {
      toast.error('Failed to load provost assignments.');
    } finally {
      setLoadingProvosts(false);
    }
  };

  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error('Hostel Name and Location are required.');
      return;
    }

    setSubmittingHostel(true);
    try {
      const payload = {
        name,
        description,
        total_room: totalRoom !== '' ? parseInt(totalRoom, 10) : 0,
        location,
        gender,
        image: image || null
      };

      if (editId) {
        const response = await axios.put(`/api/hostels/${editId}`, payload);
        toast.success(response.data.message || 'Hostel updated successfully!');
        setEditId(null);
      } else {
        const response = await axios.post('/api/hostels', payload);
        toast.success(response.data.message || 'Hostel created successfully!');
      }

      clearHostelForm();
      fetchHostels();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmittingHostel(false);
    }
  };

  const clearHostelForm = () => {
    setName('');
    setDescription('');
    setTotalRoom('');
    setLocation('');
    setGender('Male');
    setImage('');
    setImagePreview('');
    setEditId(null);
  };

  const handleEditClick = (hostel) => {
    setEditId(hostel.id);
    setName(hostel.name);
    setDescription(hostel.description || '');
    setTotalRoom(hostel.total_room !== null ? hostel.total_room : '');
    setLocation(hostel.location);
    setGender(hostel.gender || 'Male');
    setImage(hostel.image || '');
    setImagePreview(hostel.image || '');
    setActiveTab('hostels');
  };

  const handleDeleteHostel = async (id, hostelName) => {
    const confirm = window.confirm(`Are you sure you want to delete "${hostelName}"? This will permanently delete all rooms, allocations, fees, and provosts associated with it.`);
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/hostels/${id}`);
      toast.success(response.data.message || 'Hostel deleted.');
      fetchHostels();
      fetchProvosts(); // Refresh provosts in case they were cascadingly deleted
      if (editId === id) {
        clearHostelForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleProvostSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHostelId || !selectedTeacherId) {
      toast.error('Please select both a Hostel and a Teacher.');
      return;
    }

    setSubmittingProvost(true);
    try {
      const response = await axios.post('/api/hostel-provost', {
        hostel_id: selectedHostelId,
        teacher_id: selectedTeacherId
      });
      toast.success(response.data.message || 'Provost assigned successfully!');
      setSelectedHostelId('');
      setSelectedTeacherId('');
      fetchProvosts();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmittingProvost(false);
    }
  };

  const handleDeleteProvost = async (id, teacherName, hostelName) => {
    const confirm = window.confirm(`Remove ${teacherName} from being the provost of ${hostelName}?`);
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/hostel-provost/${id}`);
      toast.success(response.data.message || 'Provost assignment removed.');
      setProvosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiHome className="text-sky-600" /> Hostels & Residential Housing
        </h1>
        <p className="text-sm text-slate-500">
          Manage campus hostels, residential infrastructure, and assign faculty provosts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('hostels')}
          className={`px-5 py-2.5 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === 'hostels'
              ? 'border-sky-600 text-sky-655 text-sky-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Hostels Directory
        </button>
        <button
          onClick={() => setActiveTab('provosts')}
          className={`px-5 py-2.5 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === 'provosts'
              ? 'border-sky-600 text-sky-655 text-sky-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Faculty Provosts
        </button>
      </div>

      {activeTab === 'hostels' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Hostel Form */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiPlus className="text-sky-600" /> 
              {editId ? 'Modify Hostel Details' : 'Register New Hostel'}
            </h2>

            <form onSubmit={handleHostelSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hostel Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahidullah Hall"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submittingHostel}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiMapPin /> Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Campus Sector 4"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={submittingHostel}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiLayers /> Total Rooms Limit
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={totalRoom}
                  onChange={(e) => setTotalRoom(e.target.value)}
                  disabled={submittingHostel}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiUser className="text-slate-400" /> Designated Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={submittingHostel}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
                >
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiBookOpen /> Description
                </label>
                <TiptapEditor
                  value={description}
                  onChange={(val) => setDescription(val)}
                  placeholder="Details about building facilities..."
                />
              </div>

              {/* Image upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hostel Banner Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={submittingHostel}
                    onChange={handleImageChange}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer w-full"
                  />
                  {imagePreview && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs font-bold"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                {editId && (
                  <button
                    type="button"
                    onClick={clearHostelForm}
                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingHostel}
                  className={`py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                    editId ? 'bg-sky-600 hover:bg-sky-750 w-1/2 bg-sky-600' : 'bg-sky-650 hover:bg-sky-700 w-full bg-sky-600'
                  } disabled:opacity-50`}
                >
                  {submittingHostel ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : editId ? (
                    'Update Details'
                  ) : (
                    'Register Hostel'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Hostels List */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Registered Hostels ({hostels.length})
              </h2>
            </div>

            {loadingHostels ? (
              <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-slate-400">Loading hostels registry...</span>
              </div>
            ) : hostels.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
                <span className="text-slate-350 text-5xl mb-3">🏢</span>
                <h3 className="text-sm font-bold text-slate-655">No Hostels Registered</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  Register halls of residence using the form on the left.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hostel</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rooms Limit</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hostels.map((hostel) => (
                      <tr key={hostel.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                          <div className="flex items-center gap-3">
                            {hostel.image ? (
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                <img src={hostel.image} alt={hostel.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                                H
                              </div>
                            )}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span>{hostel.name}</span>
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                                  hostel.gender === 'Male'
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : hostel.gender === 'Female'
                                    ? 'bg-pink-50 text-pink-600 border border-pink-100'
                                    : 'bg-slate-100 text-slate-655 text-slate-600'
                                }`}>
                                  {hostel.gender || 'Unspecified'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">/{hostel.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600 flex items-center gap-1 mt-2.5">
                          <FiMapPin className="text-slate-400" /> {hostel.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                          {hostel.total_room || 0} Rooms
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                          {hostel.description || <span className="italic text-slate-300">No description</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(hostel)}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors cursor-pointer"
                            title="Edit Hostel"
                          >
                            <FiEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteHostel(hostel.id, hostel.name)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                            title="Delete Hostel"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Provost Assignment Form */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiPlus className="text-sky-600" /> Assign Provost
            </h2>

            <form onSubmit={handleProvostSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Hostel
                </label>
                <select
                  required
                  value={selectedHostelId}
                  onChange={(e) => setSelectedHostelId(e.target.value)}
                  disabled={submittingProvost}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
                >
                  <option value="">-- Choose Hostel --</option>
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Faculty / Teacher
                </label>
                <select
                  required
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  disabled={submittingProvost}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-sky-500"
                >
                  <option value="">-- Choose Faculty Member --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.designation || 'Teacher'})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submittingProvost}
                className="py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer bg-sky-600 hover:bg-sky-700 w-full disabled:opacity-50 mt-2"
              >
                {submittingProvost ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Assign as Provost'
                )}
              </button>
            </form>
          </div>

          {/* Provosts List */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Active Provost Assignments ({provosts.length})
              </h2>
            </div>

            {loadingProvosts ? (
              <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-slate-400">Loading provost mappings...</span>
              </div>
            ) : provosts.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
                <span className="text-slate-350 text-5xl mb-3">🎓</span>
                <h3 className="text-sm font-bold text-slate-655">No Provosts Assigned</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  Map faculty teachers to manage residential halls using the form on the left.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hostel</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Provost Faculty</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {provosts.map((provost) => (
                      <tr key={provost.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                          {provost.hostel_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700 flex items-center gap-2 mt-2.5">
                          <FiUser className="text-slate-450" /> {provost.teacher_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {provost.teacher_email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end">
                          <button
                            onClick={() => handleDeleteProvost(provost.id, provost.teacher_name, provost.hostel_name)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                            title="Remove Provost"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHostelsPage;
