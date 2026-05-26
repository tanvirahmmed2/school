"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Academics", path: "/academics" },
  { name: "Admission", path: "/admission" },
  { name: "Teachers", path: "/teachers" },
  { name: "Notice", path: "/notice" },
  { name: "Gallery", path: "/gallery" },
  { name: "Results", path: "/result" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideTop, setHideTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setHideTop(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50 flex flex-col">
      {/* Top Info Bar */}
      <div
        className={`w-full transition-all duration-500 overflow-hidden ${
          hideTop ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
        style={{ background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span>📞</span>
              <span className="hidden sm:inline">+880 1700-000000</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>📧</span>
              <span className="hidden sm:inline">info@govtprimaryschool.edu.bd</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs bg-white text-indigo-600 font-semibold px-3 py-1 rounded-full hover:bg-yellow-400 hover:text-white transition-all duration-200"
            >
              Admin Panel
            </Link>
            <Link
              href="/portal"
              className="text-xs border border-white/40 px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "shadow-xl py-0"
            : "py-0"
        }`}
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
            >
              G
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-bold text-slate-800 text-sm leading-none">
                Govt. Primary School
              </p>
              <p className="text-xs text-slate-500">Excellence in Education</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/admission"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
            >
              Apply Now
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 transition-all"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-96 border-t border-slate-100" : "max-h-0"
          }`}
        >
          <div className="px-4 py-3 flex flex-col gap-1 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admission"
              className="mt-2 text-center text-sm font-semibold text-white px-4 py-2.5 rounded-lg"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
              onClick={() => setMobileOpen(false)}
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;