import { redirect } from 'next/navigation';
import React from 'react';

const AdminStaffMainPage = () => {
  return redirect('/admin/staff/list');
};

export default AdminStaffMainPage;
