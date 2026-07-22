'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  FiShield, FiUsers, FiFileText, FiPlus, FiTrash2, FiEdit2,
  FiSave, FiSearch, FiAlertCircle, FiInfo, FiLayers, FiImage
} from 'react-icons/fi';

const TeacherClubsAdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');

  // Form states
  const [noticeText, setNoticeText] = useState('');
  const [savingNotice, setSavingNotice] = useState(false);

  // Add Moderator states
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [modDesignation, setModDesignation] = useState('Moderator');
  const [studentSearch, setStudentSearch] = useState('');
  const [addingMod, setAddingMod] = useState(false);

  // Manage News states
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [savingNews, setSavingNews] = useState(false);

  useEffect(() => {
    fetchTeacherClubs();
  }, []);

  const fetchTeacherClubs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/teacher/clubs');
      const payload = response.data?.paylod || {};
      if (payload.isClubAdmin && payload.clubs?.length > 0) {
        setIsClubAdmin(true);
        setClubs(payload.clubs);
        setStudents(payload.students || []);
        const firstClub = payload.clubs[0];
        setSelectedClubId(String(firstClub.id));
        setNoticeText(firstClub.notice_info || '');
      } else {
        setIsClubAdmin(false);
        setClubs([]);
      }
    } catch (error) {
      toast.error('Failed to load club admin details.');
    } finally {
      setLoading(false);
    }
  };

  const currentClub = clubs.find(c => String(c.id) === String(selectedClubId));

  useEffect(() => {
    if (currentClub) {
      setNoticeText(currentClub.notice_info || '');
      setEditingNewsId(null);
      setNewsTitle('');
      setNewsContent('');
      setNewsImage('');
    }
  }, [selectedClubId]);

  // Notice Update
  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (!selectedClubId) return;

    setSavingNotice(true);
    try {
      const res = await axios.post('/api/teacher/clubs', {
        action: 'update_notice',
        club_id: selectedClubId,
        notice_info: noticeText
      });
      toast.success(res.data.message || 'Notice updated successfully!');
      fetchTeacherClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update notice');
    } finally {
      setSavingNotice(false);
    }
  };

  // Add Moderator (Student only)
  const handleAddModerator = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedClubId) {
      toast.error('Please select a student.');
      return;
    }

    setAddingMod(true);
    try {
      const res = await axios.post('/api/teacher/clubs', {
        action: 'add_moderator',
        club_id: selectedClubId,
        student_id: selectedStudentId,
        designation: modDesignation
      });
      toast.success(res.data.message || 'Moderator added!');
      setSelectedStudentId('');
      setModDesignation('Moderator');
      fetchTeacherClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add moderator');
    } finally {
      setAddingMod(false);
    }
  };

  // Remove Moderator
  const handleRemoveModerator = async (studentId) => {
    if (!confirm('Remove this moderator?')) return;
    try {
      const res = await axios.post('/api/teacher/clubs', {
        action: 'remove_moderator',
        club_id: selectedClubId,
        student_id: studentId
      });
      toast.success(res.data.message || 'Moderator removed');
      fetchTeacherClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove moderator');
    }
  };

  // Image file handler for News
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size must be less than 4MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manage News
  const handleSaveNews = async (e) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      toast.error('Title and content are required.');
      return;
    }

    setSavingNews(true);
    try {
      const res = await axios.post('/api/teacher/clubs', {
        action: 'manage_news',
        club_id: selectedClubId,
        news_id: editingNewsId,
        title: newsTitle,
        content: newsContent,
        image: newsImage
      });
      toast.success(res.data.message || 'Club news saved!');
      setEditingNewsId(null);
      setNewsTitle('');
      setNewsContent('');
      setNewsImage('');
      fetchTeacherClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save news');
    } finally {
      setSavingNews(false);
    }
  };

  // Delete News
  const handleDeleteNews = async (newsId) => {
    if (!confirm('Delete this news post?')) return;
    try {
      const res = await axios.post('/api/teacher/clubs', {
        action: 'delete_news',
        club_id: selectedClubId,
        news_id: newsId
      });
      toast.success(res.data.message || 'News deleted');
      fetchTeacherClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete news');
    }
  };

  const handleEditNewsClick = (item) => {
    setEditingNewsId(item.id);
    setNewsTitle(item.title);
    setNewsContent(item.content);
    setNewsImage(item.image_url || '');
  };

  const filteredStudents = students.filter(st =>
    st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    st.registration_number.toLowerCase().includes(studentSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center">
        <span className="text-xs text-slate-400">Loading Club Admin...</span>
      </div>
    );
  }

  if (!isClubAdmin || clubs.length === 0) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
        <FiAlertCircle className="text-2xl text-slate-400 mx-auto" />
        <h2 className="text-sm font-bold text-slate-800">Not Assigned to Any Club</h2>
        <p className="text-xs text-slate-500">You are not currently assigned as a Club Admin.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{currentClub?.name}</h1>
          <p className="text-xs text-slate-500">
            Role: <span className="font-semibold text-slate-700">{currentClub?.admin_designation || 'Club Admin'}</span>
          </p>
        </div>

        {clubs.length > 1 && (
          <select
            value={selectedClubId}
            onChange={(e) => setSelectedClubId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
          >
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Notice Info & Add Moderator */}
        <div className="space-y-6">
          
          {/* Notice Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FiInfo /> Notice Information
            </h2>
            <form onSubmit={handleSaveNotice} className="space-y-3">
              <textarea
                rows={4}
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                placeholder="Notice info for members..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none resize-none"
              />
              <button
                type="submit"
                disabled={savingNotice}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingNotice ? 'Saving...' : 'Update Notice'}
              </button>
            </form>
          </div>

          {/* Moderator List Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FiUsers /> Student Moderators
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {currentClub?.moderators?.length || 0}
              </span>
            </div>

            {/* Add Moderator Form */}
            <form onSubmit={handleAddModerator} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <input
                type="text"
                placeholder="Filter student..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
              />

              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
              >
                <option value="">-- Select Student --</option>
                {filteredStudents.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.registration_number})
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Designation"
                value={modDesignation}
                onChange={(e) => setModDesignation(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
              />

              <button
                type="submit"
                disabled={addingMod}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {addingMod ? 'Adding...' : '+ Add Moderator'}
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {currentClub?.moderators?.map(mod => (
                <div key={mod.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{mod.student_name}</p>
                    <p className="text-[10px] text-slate-500">Reg: {mod.registration_number} • {mod.designation}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveModerator(mod.student_id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              {(!currentClub?.moderators || currentClub.moderators.length === 0) && (
                <p className="text-center text-xs text-slate-400 py-3">No moderators assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* Club News Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FiFileText /> {editingNewsId ? 'Edit Club News' : 'Publish Club News'}
              </h2>
              {editingNewsId && (
                <button
                  onClick={() => {
                    setEditingNewsId(null);
                    setNewsTitle('');
                    setNewsContent('');
                    setNewsImage('');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveNews} className="space-y-3">
              <input
                type="text"
                placeholder="News Title *"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
              />

              <textarea
                rows={4}
                placeholder="News Content *"
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none resize-none"
              />

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-100"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingNews}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {savingNews ? 'Publishing...' : editingNewsId ? 'Update Post' : 'Publish News'}
                </button>
              </div>
            </form>
          </div>

          {/* News List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Published News Posts
            </h2>

            <div className="space-y-3">
              {currentClub?.news?.map(item => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditNewsClick(item)} className="p-1 text-slate-500 hover:text-slate-800">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDeleteNews(item.id)} className="p-1 text-slate-500 hover:text-red-600">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </div>
              ))}

              {(!currentClub?.news || currentClub.news.length === 0) && (
                <p className="text-center text-xs text-slate-400 py-6">No news posts published yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherClubsAdminPage;
