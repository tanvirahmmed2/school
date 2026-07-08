'use client';

import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);
  const [adminSidebar, setAdminSidebar] = useState(false);
  const [TeacherSidebar, setTeacherSidebar] = useState(false);
  const [studentSidebar, setStudentSidebar] = useState(false);
  const [staffSidebar, setStaffSidebar] = useState(false);

  const values = {
    sidebar,
    setSidebar,
    adminSidebar,
    setAdminSidebar,
    TeacherSidebar,
    setTeacherSidebar,
    studentSidebar,
    setStudentSidebar,
    staffSidebar,
    setStaffSidebar,
  };

  return (
    <Context.Provider value={values}>
      {children}
    </Context.Provider>
  );
};