import Link from "next/link";
import React from "react";

const galleryItems = [
  { emoji: "🏫", label: "School Building", span: "col-span-2 row-span-2", bg: "linear-gradient(135deg, #312E81, #4C1D95)" },
  { emoji: "🔬", label: "Science Lab", span: "", bg: "linear-gradient(135deg, #065F46, #10B981)" },
  { emoji: "📚", label: "Library", span: "", bg: "linear-gradient(135deg, #7C3AED, #4F46E5)" },
  { emoji: "🏃", label: "Sports Day", span: "col-span-2", bg: "linear-gradient(135deg, #B45309, #F59E0B)" },
  { emoji: "🎨", label: "Art Class", span: "", bg: "linear-gradient(135deg, #9D174D, #F43F5E)" },
  { emoji: "🎓", label: "Graduation", span: "", bg: "linear-gradient(135deg, #1D4ED8, #0EA5E9)" },
];

const GalleryPreview = () => {
  return (
    <section className="section-padding" style={{ background: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#EEF2FF", color: "#4F46E5" }}
          >
            Gallery & Events
          </span>
          <h2
            className="text-4xl font-black text-slate-800 mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Life at{" "}
            <span className="gradient-text">Our School</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            A glimpse into the vibrant and enriching school life our students enjoy every day.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`${item.span} rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer`}
              style={{ background: item.bg }}
            >
              {/* Overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(0,0,0,0.3)" }}
              />
              <span className="text-5xl mb-2 relative z-10 transition-transform group-hover:scale-110 duration-300">
                {item.emoji}
              </span>
              <p className="text-white font-bold text-sm relative z-10">{item.label}</p>
              {/* View overlay button */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <span className="bg-white text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg z-20">
                  View Photo →
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl text-white hover:opacity-90 transition-all shadow-lg"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
          >
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
