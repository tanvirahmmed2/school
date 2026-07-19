'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiLayers, FiUsers, FiUserCheck, FiFilter } from 'react-icons/fi';

const AdminStudentListsPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  // Selected filters
  const [filterClassId, setFilterClassId] = useState('');
  const [filterSectionId, setFilterSectionId] = useState('');

  // Pre-creation form state
  const [showPreCreate, setShowPreCreate] = useState(false);
  const [preRegNo, setPreRegNo] = useState('');
  const [preClassId, setPreClassId] = useState('');
  const [preSectionId, setPreSectionId] = useState('');
  const [preSectionsList, setPreSectionsList] = useState([]);
  const [preRoll, setPreRoll] = useState('');

  // Edit student state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editClassId, setEditClassId] = useState('');
  const [editSectionId, setEditSectionId] = useState('');
  const [editBirthCert, setEditBirthCert] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editSectionsList, setEditSectionsList] = useState([]);
  const [editRoll, setEditRoll] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial lookup lists (classes, all students)
  const fetchClassesAndStudents = async () => {
    try {
      const classesRes = await fetch('/api/classes');
      const classesData = await classesRes.json();
      setClasses(classesData.paylod.classes || []);

      let url = '/api/students';
      const params = [];
      if (filterClassId) params.push(`class_id=${filterClassId}`);
      if (filterSectionId) params.push(`section_id=${filterSectionId}`);
      if (params.length > 0) url += '?' + params.join('&');

      const studentsRes = await fetch(url);
      const studentsData = await studentsRes.json();
      setStudents(studentsData.paylod?.students || []);
    } catch (err) {
      toast.error('Failed to load classes or student roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndStudents();
  }, [filterClassId, filterSectionId]);

  // Fetch sections based on filter class
  useEffect(() => {
    if (!filterClassId) {
      setSections([]);
      setFilterSectionId('');
      return;
    }
    const fetchFilterSections = async () => {
      const res = await fetch(`/api/sections?class_id=${filterClassId}`);
      const data = await res.json();
      setSections(data.paylod.sections || []);
      setFilterSectionId('');
    };
    fetchFilterSections();
  }, [filterClassId]);

  // Fetch sections based on pre-create class selection
  useEffect(() => {
    if (!preClassId) {
      setPreSectionsList([]);
      setPreSectionId('');
      return;
    }
    const fetchPreSections = async () => {
      const res = await fetch(`/api/sections?class_id=${preClassId}`);
      const data = await res.json();
      setPreSectionsList(data.paylod.sections || []);
      if (data.paylod.sections?.length > 0) {
        setPreSectionId(data.paylod.sections[0].id.toString());
      } else {
        setPreSectionId('');
      }
    };
    fetchPreSections();
  }, [preClassId]);

  // Fetch sections based on edit class selection
  useEffect(() => {
    if (!editClassId) {
      setEditSectionsList([]);
      setEditSectionId('');
      return;
    }
    const fetchEditSections = async () => {
      const res = await fetch(`/api/sections?class_id=${editClassId}`);
      const data = await res.json();
      setEditSectionsList(data.paylod.sections || []);
    };
    fetchEditSections();
  }, [editClassId]);

  // Handles pre-creating student
  const handlePreCreate = async (e) => {
    e.preventDefault();
    if (!preRegNo || !preClassId) {
      toast.error('Registration code and Class are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_number: preRegNo,
          class_id: preClassId,
          section_id: preSectionId || null,
          roll: preRoll || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to pre-create account.');

      toast.success(data.message || 'Student pre-created successfully!');
      setPreRegNo('');
      setPreRoll('');
      setShowPreCreate(false);
      fetchClassesAndStudents();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Start Edit
  const handleStartEdit = (student) => {
    setEditingStudent(student);
    setEditName(student.name || '');
    setEditEmail(student.email || '');
    setEditPhone(student.phone || '');
    setEditClassId(student.class_id ? student.class_id.toString() : '');
    setEditSectionId(student.section_id ? student.section_id.toString() : '');
    setEditBirthCert(student.birth_certificate_number || '');
    setEditGender(student.gender || '');
    setEditActive(student.is_active);
    setEditRoll(student.roll ? student.roll.toString() : '');
    setShowPreCreate(false);
  };

  // Handles updating student details
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editClassId) {
      toast.error('Academic class selection is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName || null,
          email: editEmail || null,
          phone: editPhone || null,
          registration_number: editingStudent.registration_number,
          class_id: editClassId,
          section_id: editSectionId || null,
          birth_certificate_number: editBirthCert || null,
          gender: editGender || null,
          is_active: editActive,
          roll: editRoll || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update student profile.');

      toast.success(data.message || 'Student record updated successfully.');
      setEditingStudent(null);
      fetchClassesAndStudents();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handles deleting student
  const handleDeleteStudent = async (id, regNo) => {
    const confirm = window.confirm(
      `Are you sure you want to permanently delete student registration code "${regNo}"? This will delete all attendance log sheets and fee logs for this student!`
    );
    if (!confirm) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete student.');

      toast.success(data.message || 'Student profile removed.');
      fetchClassesAndStudents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiUsers className="text-blue-600" /> Student Account Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pre-create accounts, filter lists by class/section, and manage student details.
          </p>
        </div>

        <button
          onClick={() => {
            setShowPreCreate(!showPreCreate);
            setEditingStudent(null);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
        >
          {showPreCreate ? (
            <>
              <FiX className="text-lg" /> Close Panel
            </>
          ) : (
            <>
              <FiPlus className="text-lg" /> Pre-create Student
            </>
          )}
        </button>
      </div>

      {/* Selectors Filter Card */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FiFilter /> Filter Class
          </label>
          <select
            value={filterClassId}
            onChange={(e) => setFilterClassId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50 cursor-pointer"
          >
            <option value="">All Academic Classes...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FiFilter /> Filter Section
          </label>
          <select
            value={filterSectionId}
            onChange={(e) => setFilterSectionId(e.target.value)}
            disabled={!filterClassId}
            className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50 cursor-pointer disabled:opacity-60"
          >
            <option value="">All Sections...</option>
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pre-Creation Form */}
      {showPreCreate && !editingStudent && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            🔑 Pre-create Student Account (Code + Class Allocation)
          </h2>
          <form onSubmit={handlePreCreate} className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Registration Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. STU99220"
                value={preRegNo}
                onChange={(e) => setPreRegNo(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assign Class
              </label>
              <select
                required
                value={preClassId}
                onChange={(e) => setPreClassId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
              >
                <option value="">Select class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assign Section (Optional)
              </label>
              <select
                value={preSectionId}
                onChange={(e) => setPreSectionId(e.target.value)}
                disabled={submitting || !preClassId}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 disabled:opacity-60"
              >
                <option value="">Select section...</option>
                {preSectionsList.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assign Roll (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={preRoll}
                onChange={(e) => setPreRoll(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
              />
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPreCreate(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
              >
                {submitting ? 'Pre-creating...' : 'Save Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Student profile form */}
      {editingStudent && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            📝 Edit Student Profile & Allocation Details
          </h2>
          <form onSubmit={handleUpdateStudent} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Registration code (Fixed)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingStudent.registration_number}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@school.com"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-555"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Class
                </label>
                <select
                  required
                  value={editClassId}
                  onChange={(e) => setEditClassId(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Section
                </label>
                <select
                  value={editSectionId}
                  onChange={(e) => setEditSectionId(e.target.value)}
                  disabled={submitting || !editClassId}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="">No section (Unallocated)...</option>
                  {editSectionsList.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Birth Certificate No.
                </label>
                <input
                  type="text"
                  value={editBirthCert}
                  onChange={(e) => setEditBirthCert(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Gender
                </label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Roll Number
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={editRoll}
                  onChange={(e) => setEditRoll(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            {/* Row with active toggle */}
            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="editActive"
                checked={editActive}
                onChange={(e) => setEditActive(e.target.checked)}
                disabled={submitting}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="editActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Is Active (Student account is allowed system access)
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
              >
                {submitting ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Registry Table */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Registered Student Roster ({students.length})
          </h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading student roster...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-350 text-5xl mb-3">🎓</span>
            <h3 className="text-sm font-bold text-slate-600">No Students Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              No student records matched the active filters. Pre-create students to populate the database.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Registration No
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Class & Section
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Registration Setup
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Active Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl w-fit">
                          {std.registration_number}
                        </span>
                        {std.roll && (
                          <span className="text-[10px] font-bold text-slate-500 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md w-fit">
                            Roll: {std.roll}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center font-bold text-sm">
                          {(std.name || 'Unset').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-800">{std.name || 'Pre-created (No profile)'}</p>
                            {std.gender && (
                              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                                std.gender === 'Male'
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : std.gender === 'Female'
                                  ? 'bg-pink-50 text-pink-600 border border-pink-100'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {std.gender}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold flex flex-col gap-0.5">
                            {std.email && <span>📧 {std.email}</span>}
                            {std.phone && <span>📞 {std.phone}</span>}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        <FiLayers className="text-xs text-slate-400" />
                        {std.class_name} {std.section_name ? `— Sec ${std.section_name}` : ' (No Section)'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${std.is_registered 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        {std.is_registered ? 'Setup Completed' : 'Pending Student Setup'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${std.is_active 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'}`}>
                        {std.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(std)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Edit Student Allocation"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(std.id, std.registration_number)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                        title="Delete Student"
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
  );
};

export default AdminStudentListsPage;
