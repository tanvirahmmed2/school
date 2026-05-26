"use client";
import React, { useEffect, useRef, useState } from "react";

const stats = [
  { value: 1200, suffix: "+", label: "Total Students", icon: "🎓", color: "#4F46E5" },
  { value: 60, suffix: "+", label: "Expert Teachers", icon: "👨‍🏫", color: "#7C3AED" },
  { value: 98, suffix: "%", label: "Pass Rate", icon: "🏆", color: "#F59E0B" },
  { value: 40, suffix: "+", label: "Years of Service", icon: "📅", color: "#10B981" },
];

function useCountUp(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ stat, active }) {
  const count = useCountUp(stat.value, 2200, active);
  return (
    <div
      className="card-hover flex flex-col items-center text-center p-8 rounded-2xl relative overflow-hidden group"
      style={{ background: "#fff", border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"
        style={{ background: stat.color }}
      />
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md"
        style={{ background: `${stat.color}15` }}
      >
        {stat.icon}
      </div>
      <p
        className="text-5xl font-black mb-1"
        style={{ fontFamily: "Poppins, sans-serif", color: stat.color }}
      >
        {count}
        {stat.suffix}
      </p>
      <p className="text-slate-600 font-medium">{stat.label}</p>
    </div>
  );
}

const StatsSection = () => {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-padding" style={{ background: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#EEF2FF", color: "#4F46E5" }}
          >
            Our Achievements
          </span>
          <h2
            className="text-4xl font-black text-slate-800 mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Numbers That Tell Our Story
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Four decades of nurturing excellence — our statistics reflect the trust and impact of our institution.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
