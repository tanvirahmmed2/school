'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiAward, FiPlus, FiTrash2, FiEdit2, FiArrowLeft, FiCheck, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminTeacherQualificationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('teacher_id') || '';

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(initialId);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    passing_year: '',
    result: ''
  });
  const [editMode, setEditMode] = useState(null); // id of qualification being edited

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacherId) {
      fetchQualifications(selectedTeacherId);
    } else {
      setQualifications([]);
    }
  }, [selectedTeacherId]);

  const fetchTeachers = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/teachers');
      setTeachers(res.data.paylod.teachers || []);
    } catch (err) {
      toast.error('Failed to load teachers lookup.');
    } finally {
      setListLoading(false);
    }
  };

  const fetchQualifications = async (teacherId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/teachers/qualifications?teacher_id=${teacherId}`);
      setQualifications(res.data.paylod.qualifications || []);
    } catch (err) {
      toast.error('Failed to retrieve teacher qualifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacherId) {
      toast.error('Please select a teacher.');
      return;
    }
    if (!formData.degree.trim() || !formData.institution.trim() || !formData.passing_year) {
      toast.error('Degree, Institution and Passing Year are required.');
      return;
    }

    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`/api/teachers/qualifications/${editMode}`, formData);
        toast.success('Qualification updated successfully.');
        setEditMode(null);
      } else {
        await axios.post('/api/teachers/qualifications', {
          teacher_id: selectedTeacherId,
          ...formData
        });
        toast.success('Qualification added successfully.');
      }
      setFormData({ degree: '', institution: '', passing_year: '', result: '' });
      fetchQualifications(selectedTeacherId);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save qualification.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (q) => {
    setEditMode(q.id);
    setFormData({
      degree: q.degree,
      institution: q.institution,
      passing_year: q.passing_year,
      result: q.result || ''
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setFormData({ degree: '', institution: '', passing_year: '', result: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this qualification record?')) return;
    try {
      await axios.delete(`/api/teachers/qualifications/${id}`);
      toast.success('Qualification removed.');
      fetchQualifications(selectedTeacherId);
    } catch (err) {
      toast.error('Failed to delete qualification.');
    }
  };

  const selectedTeacherDetails = teachers.find(t => String(t.id) === String(selectedTeacherId));

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up max-w-4xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/admin/teachers/list"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
        >
          <FiArrowLeft className="text-sm" /> Back to Teachers List
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <FiAward className="text-blue-600" /> Manage Teacher Qualifications
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Manage degrees, graduation credentials, and certifications for academic instructors.
        </p>
      </div>

      {/* Selector and Form Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left selector */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Instructor</label>
              {listLoading ? (
                <div className="h-10 bg-slate-50 animate-pulse rounded-xl mt-1.5"></div>
              ) : (
                <select
                  value={selectedTeacherId}
                  onChange={(e) => {
                    setSelectedTeacherId(e.target.value);
                    router.replace(`/admin/teachers/qualification?teacher_id=${e.target.value}`);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-xs text-slate-805 outline-none focus:bg-white focus:border-blue-500 bg-slate-50 mt-1.5 font-bold text-slate-800"
                >
                  <option value="">-- Choose Instructor --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.designation || 'Instructor'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedTeacherDetails && (
              <div className="border-t border-slate-50 pt-4 flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 text-lg font-bold shadow-inner">
                  <FiUsers className="text-xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs">{selectedTeacherDetails.name}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mt-0.5">{selectedTeacherDetails.designation || 'Instructor'}</span>
                  <span className="text-[9px] text-slate-400 font-medium block mt-0.5 truncate">{selectedTeacherDetails.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Forms & list */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {selectedTeacherId ? (
            <>
              {/* Form Block */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
                  <FiAward className="text-blue-600" /> {editMode ? 'Edit Qualification Record' : 'Add Teacher Qualification'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                  {/* Degree Name */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Degree Title *</label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      placeholder="e.g. Master of Science in Computer Science (MSCS)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Institution Name */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">University / Board *</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Passing Year */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Graduation Year *</label>
                    <input
                      type="number"
                      name="passing_year"
                      value={formData.passing_year}
                      onChange={handleInputChange}
                      placeholder="e.g. 2020"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Result */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score / CGPA</label>
                    <input
                      type="text"
                      name="result"
                      value={formData.result}
                      onChange={handleInputChange}
                      placeholder="e.g. GPA 3.95 / Summa Cum Laude"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-50">
                    {editMode && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {editMode ? (
                        <>
                          <FiCheck className="text-sm" /> Save Update
                        </>
                      ) : (
                        <>
                          <FiPlus className="text-sm" /> Add Credential
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* List Block */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">
                  Recorded Teacher Qualifications List
                </h3>

                {loading && qualifications.length === 0 ? (
                  <div className="py-12 flex justify-center items-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : qualifications.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-medium">
                    No academic qualifications recorded for this instructor.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {qualifications.map(q => (
                      <div key={q.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-all">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-extrabold text-slate-800 text-xs">{q.degree}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">{q.institution}</span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">Graduation: {q.passing_year}</span>
                            {q.result && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{q.result}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditClick(q)}
                            className="p-2 hover:bg-slate-50 hover:text-blue-600 rounded-lg text-slate-400 cursor-pointer"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 cursor-pointer"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl py-20 px-6 text-center text-slate-400 shadow-[0_10px_30px_rgba(0,0,0,0.01)] font-bold text-sm">
              Please choose a teacher from the select list to view or edit their academic qualifications list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
