'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiImage } from 'react-icons/fi';
import GenericForm from '@/component/forms/GenericForm';

const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [image_id, setImageId] = useState('');

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        setNewsList(data.news || []);
      }
    } catch (error) {
      toast.error('Failed to load news articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenCreate = () => {
    setEditItem(null);
    setTitle('');
    setContent('');
    setImage('');
    setImageId('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setTitle(item.title);
    setContent(item.content);
    setImage(item.image || '');
    setImageId(item.image_id || '');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setSubmitting(true);
    try {
      const url = editItem ? `/api/news/${editItem.id}` : '/api/news';
      const method = editItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image: image.trim() || null,
          image_id: image_id.trim() || null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save news article.');
      }

      toast.success(data.message || 'News article saved successfully!');
      setModalOpen(false);
      fetchNews();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const response = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete news article.');
      }

      toast.success(data.message || 'News article deleted successfully.');
      fetchNews();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Form Fields Config
  const fields = [
    { name: 'title', label: 'Article Title', required: true, placeholder: 'e.g. Annual Sports Meet 2026', colSpan: 'col-span-2' },
    { name: 'content', label: 'Article Body Content', type: 'textarea', required: true, placeholder: 'Write the details here...', rows: 4, colSpan: 'col-span-2' },
    { name: 'image', label: 'Image URL', placeholder: 'e.g. https://example.com/sports.jpg', icon: FiImage },
    { name: 'image_id', label: 'Image ID / Cloud ID', placeholder: 'e.g. img_sports_2026' }
  ];

  const values = { title, content, image, image_id };

  const handleChange = (fieldName, val) => {
    if (fieldName === 'title') setTitle(val);
    else if (fieldName === 'content') setContent(val);
    else if (fieldName === 'image') setImage(val);
    else if (fieldName === 'image_id') setImageId(val);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-up max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl text-indigo-600">
            <FiFileText className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">News Management</h1>
            <p className="text-xs text-slate-400">Publish and manage news articles for students, teachers, and school portal visitors.</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer"
        >
          <FiPlus className="text-sm" /> Add News Article
        </button>
      </div>

      {/* Grid of articles */}
      {loading ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : newsList.length === 0 ? (
        <div className="w-full text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <p className="text-sm text-slate-400 font-semibold">No news articles found. Get started by writing one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between"
            >
              {news.image ? (
                <div className="w-full h-48 overflow-hidden relative">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-slate-50 flex items-center justify-center text-slate-300">
                  <FiImage className="text-4xl" />
                </div>
              )}

              <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2">{news.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed whitespace-pre-line">{news.content}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {new Date(news.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(news)}
                      className="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 rounded-xl transition-all duration-150 cursor-pointer"
                      title="Edit article"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition-all duration-150 cursor-pointer"
                      title="Delete article"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiFileText className="text-indigo-600" /> {editItem ? 'Edit News Article' : 'Publish News Article'}
            </h2>
            <GenericForm
              fields={fields}
              values={values}
              onChange={handleChange}
              onSubmit={handleFormSubmit}
              submitText={editItem ? 'Save Changes' : 'Publish Article'}
              submitting={submitting}
              cancelText="Cancel"
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;
