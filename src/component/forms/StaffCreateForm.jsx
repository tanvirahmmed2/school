'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUserPlus } from 'react-icons/fi';
import GenericForm from './GenericForm';

const StaffCreateForm = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('staff');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name || !email || !number || !designation || !role) {
      toast.error('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/staff', { name, email, number, designation, role });

      toast.success(response.data.message || 'Staff profile pre-created successfully!');
      setName('');
      setEmail('');
      setNumber('');
      setDesignation('');
      setRole('staff');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. John Smith' },
    { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'e.g. john.smith@school.com' },
    { name: 'number', label: 'Phone Number', required: true, placeholder: 'e.g. +880 170 000 0000' },
    {
      name: 'role',
      label: 'System Role',
      type: 'select',
      required: true,
      options: [
        { value: 'staff', label: 'Staff' },
        { value: 'registrar', label: 'Registrar' },
      ],
    },
    { name: 'designation', label: 'Designation', required: true, placeholder: 'e.g. Accountant, Librarian' },
  ];

  const values = { name, email, number, designation, role };

  const handleChange = (fieldName, value) => {
    if (fieldName === 'name') setName(value);
    else if (fieldName === 'email') setEmail(value);
    else if (fieldName === 'number') setNumber(value);
    else if (fieldName === 'designation') setDesignation(value);
    else if (fieldName === 'role') setRole(value);
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FiUserPlus className="text-blue-600" /> Register New Staff Member
      </h2>

      <GenericForm
        fields={fields}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitText="Create Account"
        submitting={submitting}
        cancelText="Cancel"
        onCancel={onCancel}
        focusClass="focus:border-blue-500 focus:ring-blue-500/5"
      />
    </div>
  );
};

export default StaffCreateForm;
