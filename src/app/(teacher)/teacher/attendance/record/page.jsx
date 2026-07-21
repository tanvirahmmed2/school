'use client';

import React from 'react';
import ExcelAttendanceForm from '@/component/forms/ExcelAttendanceForm';

const AttendanceRecordPage = () => {
  return (
    <div className="flex flex-col gap-8 w-full mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Record Attendance</h1>
        <p className="text-slate-500 text-sm font-medium">
          Select a date and class, download the student list template, fill in statuses, then upload to register attendance.
        </p>
      </div>

      <ExcelAttendanceForm />
    </div>
  );
};

export default AttendanceRecordPage;
