"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";


const bottomLink=[
  {name:'Home', path:'/'},
  {name:'Academics', path:'/academics'},
  {name:'About', path:'/about'},
  {name:'Administration', path:'/administration'},
  {name:'Admission', path:'/admission'},
  {name:'Facilities', path:'/facilities'},
  {name:'Contact', path:'/facilities'},
  {name:'Career', path:'/career'},
  {name:'Notice', path:'/notice'},
  {name:'Portal', path:'/portal'},
  {name:'Help Desk', path:'/help-desk'},
  {name:'Result', path:'/result'},
]

const Navbar = () => {
  const [hideTop, setHideTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHideTop(true);
      } else {
        setHideTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full fixed top-0 left-0 z-50 flex flex-col">
      
      <div
        className={`bg-blue-500 text-white transition-all duration-300 overflow-hidden ${
          hideTop ? "h-0 opacity-0" : "h-12 opacity-100"
        }`}
      >
        <div className="h-12 flex items-center justify-center">
          Upper Navbar
        </div>
      </div>

      <div className="h-12 bg-white shadow-md flex flex-row items-center justify-center px-6 w-full">
        {
          bottomLink.map((link,i)=>(
            <Link key={i} href={link.path} className="text-sm hover:bg-red-100 h-12 w-auto flex items-center justify-center px-4">{link.name}</Link>
          ))
        }
      </div>
    </div>
  );
};

export default Navbar;