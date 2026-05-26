"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const badges = ["🏆 National Award Winner", "📚 40+ Years of Excellence", "✅ NCTB Affiliated"];

const HeroSection = () => {
  const [visible, setVisible] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(0);

  useEffect(() => {
    setVisible(true);
    const interval = setInterval(() => {
      setCurrentBadge((prev) => (prev + 1) % badges.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #312E81 70%, #4C1D95 100%)",
      }}
    >
      {/* Animated Background Orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, #F59E0B, transparent)",
          animation: "float 5s ease-in-out infinite reverse",
        }}
      />
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div
          className="text-white"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s ease",
          }}
        >
          {/* Rotating Badge */}
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{ animation: "pulse-ring 1.5s ease-out infinite" }}
            />
            <span key={currentBadge} style={{ animation: "fadeInUp 0.4s ease" }}>
              {badges[currentBadge]}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Shaping{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Brilliant
            </span>
            <br />
            Futures Together
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
            Government Primary School — where every child is nurtured with quality education,
            modern facilities, and dedicated teachers committed to excellence since 1985.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admission"
              className="inline-flex items-center gap-2 font-bold text-white px-7 py-3.5 rounded-xl hover:opacity-90 hover:shadow-2xl transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
            >
              Apply for Admission →
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-semibold text-white px-7 py-3.5 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              Learn More
            </Link>
          </div>

          {/* Mini Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { value: "1,200+", label: "Students" },
              { value: "60+", label: "Teachers" },
              { value: "98%", label: "Pass Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-white" style={{ fontFamily: "Poppins" }}>
                  {stat.value}
                </p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Visual Card */}
        <div
          className="hidden lg:flex justify-center items-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(60px)",
            transition: "all 1s ease 0.3s",
          }}
        >
          <div className="relative w-full max-w-md">
            {/* Main Card */}
            <div
              className="rounded-3xl p-8 shadow-2xl animate-float"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Decorative school visual */}
              <div className="w-full aspect-video rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                <div className="text-center">
                  <div className="text-6xl mb-2">🏫</div>
                  <p className="text-white font-bold text-lg">Govt. Primary School</p>
                  <p className="text-indigo-200 text-sm">Est. 1985</p>
                </div>
                <div className="absolute top-3 right-3 bg-emerald-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  LIVE
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: "📅", text: "Class Routine Available", sub: "Updated for 2025" },
                  { icon: "📢", text: "New Admission Open", sub: "Apply before June 30" },
                  { icon: "🏆", text: "Annual Result Published", sub: "Check your result now" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{item.text}</p>
                      <p className="text-slate-400 text-xs">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div
              className="absolute -top-6 -left-6 rounded-2xl px-4 py-3 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #EF4444)",
              }}
            >
              <p className="text-white font-black text-lg">40+</p>
              <p className="text-yellow-100 text-xs">Years Old</p>
            </div>
            <div
              className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 shadow-xl"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
            >
              <p className="text-white font-black text-lg">A+</p>
              <p className="text-emerald-100 text-xs">Rated School</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 80" className="w-full" fill="#F8FAFC">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
