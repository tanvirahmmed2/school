'use client';

import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const router=useRouter()
  const [sidebar, setSidebar] = useState(false);
  const [adminSidebar, setAdminSidebar] = useState(false);
  const [TeacherSidebar, setTeacherSidebar] = useState(false);
  const [studentSidebar, setStudentSidebar] = useState(false);

  const [classes, setClasses]=useState([])
  const [clubs, setClubs]=useState([])


  const goBack=()=>{
    router.back()
  }

  useEffect(() => {
    const fetchClassesAndClubs = async () => {
      try {
        const classesRes = await fetch('/api/classes');
        if (classesRes.ok) {
          const data = await classesRes.json();
          setClasses(data.paylod.classes || []);
        }
      } catch (err) {
        console.error('Error fetching classes in Context:', err);
      }

      try {
        const clubsRes = await fetch('/api/clubs');
        if (clubsRes.ok) {
          const data = await clubsRes.json();
          setClubs(data.paylod.clubs || []);
        }
      } catch (err) {
        console.error('Error fetching clubs in Context:', err);
      }
    };

    fetchClassesAndClubs();
  }, []);

  const values = {
    goBack,
    sidebar,
    setSidebar,
    adminSidebar,
    setAdminSidebar,
    TeacherSidebar,
    setTeacherSidebar,
    studentSidebar,
    setStudentSidebar,
    classes, setClasses,clubs, setClubs
  };

  return (
    <Context.Provider value={values}>
      {children}
    </Context.Provider>
  );
};