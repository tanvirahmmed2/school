"use client";
import React from "react";

const ContactSection = () => {
  return (
    <section className="section-padding" style={{ background: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#EEF2FF", color: "#4F46E5" }}
          >
            Contact Us
          </span>
          <h2
            className="text-4xl font-black text-slate-800 mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Get in{" "}
            <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            We'd love to hear from you. Reach out to us for admissions, inquiries, or any support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Contact Info */}
          <div className="space-y-5">
            {[
              {
                icon: "📍",
                title: "Address",
                text: "123 School Road, Uttara, Dhaka-1230, Bangladesh",
                color: "#4F46E5",
              },
              {
                icon: "📞",
                title: "Phone",
                text: "+880 1700-000000 | +880 1800-000000",
                color: "#7C3AED",
              },
              {
                icon: "📧",
                title: "Email",
                text: "info@govtprimary.edu.bd",
                color: "#F59E0B",
              },
              {
                icon: "🕐",
                title: "Office Hours",
                text: "Saturday – Thursday: 8:00 AM – 2:00 PM",
                color: "#10B981",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: "#fff", border: "1px solid #E2E8F0" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${c.color}12` }}
                >
                  {c.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-0.5">{c.title}</p>
                  <p className="text-slate-500 text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Contact Form */}
          <div
            className="p-8 rounded-2xl"
            style={{ background: "#fff", border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <h3 className="font-bold text-slate-800 text-xl mb-6">Send Us a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2"
                    style={{
                      border: "1px solid #E2E8F0",
                      "--tw-ring-color": "#4F46E5",
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2"
                    style={{ border: "1px solid #E2E8F0" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2"
                  style={{ border: "1px solid #E2E8F0" }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Subject
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all bg-white"
                  style={{ border: "1px solid #E2E8F0" }}
                >
                  <option>Admission Inquiry</option>
                  <option>Fee Information</option>
                  <option>Academic Query</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all resize-none"
                  style={{ border: "1px solid #E2E8F0" }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div
          className="mt-10 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            height: "280px",
            background: "linear-gradient(135deg, #1E293B, #0F172A)",
            border: "1px solid #334155",
          }}
        >
          <div className="text-center">
            <span className="text-6xl block mb-3">🗺️</span>
            <p className="text-slate-400 font-medium">Google Map — 123 School Road, Dhaka</p>
            <p className="text-slate-500 text-sm mt-1">Interactive map will load here</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
