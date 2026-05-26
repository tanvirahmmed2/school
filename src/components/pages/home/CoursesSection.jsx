import Link from "next/link";
import React from "react";

const courses = [
  {
    grade: "Class 1",
    emoji: "🌱",
    subjects: ["Bangla", "English", "Math", "Science", "Religion"],
    students: 85,
    color: "#10B981",
    bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
  },
  {
    grade: "Class 2",
    emoji: "🌿",
    subjects: ["Bangla", "English", "Math", "Science", "Art"],
    students: 90,
    color: "#0EA5E9",
    bg: "linear-gradient(135deg, #F0F9FF, #E0F2FE)",
  },
  {
    grade: "Class 3",
    emoji: "📗",
    subjects: ["Bangla", "English", "Math", "Social Studies", "Science"],
    students: 78,
    color: "#7C3AED",
    bg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
  },
  {
    grade: "Class 4",
    emoji: "📘",
    subjects: ["Bangla", "English", "Math", "Science", "History"],
    students: 92,
    color: "#F59E0B",
    bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
  },
  {
    grade: "Class 5",
    emoji: "🎓",
    subjects: ["Bangla", "English", "Math", "Science", "Civics"],
    students: 88,
    color: "#F43F5E",
    bg: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
  },
  {
    grade: "Pre-School",
    emoji: "🌼",
    subjects: ["Rhymes", "Drawing", "Play Activity", "Basic Letters", "Numbers"],
    students: 45,
    color: "#4F46E5",
    bg: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
  },
];

const CoursesSection = () => {
  return (
    <section className="section-padding" style={{ background: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#EEF2FF", color: "#4F46E5" }}
          >
            Academic Programs
          </span>
          <h2
            className="text-4xl font-black text-slate-800 mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Our Classes &{" "}
            <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Structured academic programs from Pre-School to Class 5, following the national curriculum with modern pedagogical approaches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.grade}
              className="card-hover rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E2E8F0", background: "#fff" }}
            >
              {/* Card Header */}
              <div
                className="p-6 flex items-center justify-between"
                style={{ background: c.bg }}
              >
                <div>
                  <p className="text-3xl mb-1">{c.emoji}</p>
                  <h3 className="font-black text-slate-800 text-xl" style={{ fontFamily: "Poppins" }}>
                    {c.grade}
                  </h3>
                  <p className="text-sm" style={{ color: c.color }}>
                    {c.students} Students Enrolled
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg"
                  style={{ background: c.color }}
                >
                  {c.students}
                </div>
              </div>

              {/* Subjects */}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Core Subjects
                </p>
                <div className="flex flex-wrap gap-2">
                  {c.subjects.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: `${c.color}12`, color: c.color }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  href="/academics"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
                  style={{ background: `${c.color}15`, color: c.color }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/academics"
            className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
          >
            Explore All Programs →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
