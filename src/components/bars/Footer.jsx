import Link from "next/link";
import React from "react";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Academic Programs", path: "/academics" },
  { name: "Admission", path: "/admission" },
  { name: "Notice Board", path: "/notice" },
  { name: "Gallery", path: "/gallery" },
  { name: "Results", path: "/result" },
  { name: "Contact", path: "/contact" },
];

const portalLinks = [
  { name: "Student Portal", path: "/portal/student" },
  { name: "Teacher Portal", path: "/portal/teacher" },
  { name: "Admin Dashboard", path: "/dashboard" },
  { name: "Online Admission", path: "/admission" },
  { name: "Fee Payment", path: "/portal/payment" },
  { name: "Exam Results", path: "/result" },
];

const Footer = () => {
  return (
    <footer className="w-full" style={{ background: "#0F172A", color: "#CBD5E1" }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
            >
              G
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">
                Govt. Primary School
              </h3>
              <p className="text-xs text-slate-400">Excellence in Education</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Nurturing young minds and building tomorrow's leaders through quality education, 
            discipline, and holistic development since 1985.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: "f", label: "Facebook", color: "#1877F2" },
              { icon: "t", label: "Twitter", color: "#1DA1F2" },
              { icon: "y", label: "YouTube", color: "#FF0000" },
              { icon: "in", label: "LinkedIn", color: "#0A66C2" },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:scale-110"
                style={{ background: s.color }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">
            Quick Links
          </h4>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="text-sm text-slate-400 hover:text-indigo-400 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 group-hover:w-3 transition-all duration-200 inline-block" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Portals */}
        <div>
          <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">
            Portals & Services
          </h4>
          <ul className="space-y-2.5">
            {portalLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="text-sm text-slate-400 hover:text-indigo-400 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-violet-500 group-hover:w-3 transition-all duration-200 inline-block" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">
            Contact Us
          </h4>
          <ul className="space-y-4">
            {[
              { icon: "📍", label: "123 School Road, Dhaka, Bangladesh" },
              { icon: "📞", label: "+880 1700-000000" },
              { icon: "📞", label: "+880 1800-000000" },
              { icon: "📧", label: "info@govtprimary.edu.bd" },
              { icon: "🕐", label: "Sat–Thu: 8:00 AM – 2:00 PM" },
            ].map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                <span className="mt-0.5 flex-shrink-0">{c.icon}</span>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t"
        style={{ borderColor: "#1E293B" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Govt. Primary School. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-indigo-400 transition-colors">
              Terms of Use
            </Link>
            <Link href="/sitemap" className="hover:text-indigo-400 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
