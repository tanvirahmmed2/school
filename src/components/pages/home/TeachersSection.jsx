import React from "react";

const teachers = [
  {
    name: "Md. Rafiqul Islam",
    role: "Head Teacher",
    subject: "Mathematics & Science",
    exp: "18 Years",
    emoji: "👨‍🏫",
    rating: 4.9,
    color: "#4F46E5",
  },
  {
    name: "Nasrin Akter",
    role: "Senior Teacher",
    subject: "Bangla & Literature",
    exp: "14 Years",
    emoji: "👩‍🏫",
    rating: 4.8,
    color: "#7C3AED",
  },
  {
    name: "Karim Hossain",
    role: "Assistant Teacher",
    subject: "English & Social Studies",
    exp: "10 Years",
    emoji: "👨‍💼",
    rating: 4.7,
    color: "#F59E0B",
  },
  {
    name: "Fatema Begum",
    role: "Senior Teacher",
    subject: "Religion & Arts",
    exp: "12 Years",
    emoji: "👩‍💼",
    rating: 4.9,
    color: "#10B981",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-xs" style={{ color: i <= Math.floor(rating) ? "#F59E0B" : "#E2E8F0" }}>
          ★
        </span>
      ))}
      <span className="text-xs font-bold text-slate-500 ml-1">{rating}</span>
    </div>
  );
}

const TeachersSection = () => {
  return (
    <section className="section-padding" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Text */}
          <div>
            <span
              className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ background: "#EEF2FF", color: "#4F46E5" }}
            >
              Our Educators
            </span>
            <h2
              className="text-4xl font-black text-slate-800 mb-5"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Meet Our{" "}
              <span className="gradient-text">Dedicated</span>
              <br /> Teachers
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Our teaching staff are qualified, experienced, and passionate about education. 
              Each teacher is committed to providing personalized attention and fostering a 
              love of learning in every student.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: "60+", label: "Teachers" },
                { value: "95%", label: "Qualified" },
                { value: "15+", label: "Avg. Experience" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-4 rounded-xl"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                >
                  <p className="font-black text-2xl text-indigo-600" style={{ fontFamily: "Poppins" }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <a
              href="/teachers"
              className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
            >
              View All Teachers →
            </a>
          </div>

          {/* Right — Teacher Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {teachers.map((t) => (
              <div
                key={t.name}
                className="card-hover p-5 rounded-2xl group"
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ background: `${t.color}15` }}
                >
                  {t.emoji}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-0.5">{t.name}</h4>
                <p className="text-xs font-semibold mb-0.5" style={{ color: t.color }}>
                  {t.role}
                </p>
                <p className="text-xs text-slate-400 mb-3">{t.subject}</p>
                <StarRating rating={t.rating} />
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${t.color}12`, color: t.color }}
                  >
                    {t.exp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
